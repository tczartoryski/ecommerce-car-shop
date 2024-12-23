# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Conversation, Message, Car


class ChatConsumer(AsyncWebsocketConsumer):

    async def get_message_history(self, conversation_id):
        try:
            conversation = Conversation.objects.get(id=conversation_id)
            messages = conversation.messages.order_by('timestamp').values(
                'id', 'conversation__id', 'sender__email', 'content', 'timestamp'
            )
            return list(messages)
        except Conversation.DoesNotExist:
            return []

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Get the conversation ID from the room name
        conversation_id = self.room_name

        # Retrieve the message history
        message_history = await self.get_message_history(conversation_id)

        # Send the message history to the client
        await self.send(text_data=json.dumps({
            'type': 'message_history',
            'messages': message_history
        }))

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        car_id = text_data_json['car_id']  # Assuming the car_id is sent from the client
        sender = self.scope['user']

        # Get the Car instance
        car = Car.objects.get(id=car_id)

        # Create a new Conversation instance associated with the Car
        conversation, created = Conversation.objects.get_or_create(car=car)

        # Add the sender as a participant if not already added
        conversation.participants.add(sender)

        # Create a new message
        new_message = Message.objects.create(
            conversation=conversation,
            sender=sender,
            content=message
        )

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': new_message.content,
                'sender': str(new_message.sender),
                'timestamp': str(new_message.timestamp)
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']
        timestamp = event['timestamp']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender,
            'timestamp': timestamp
        }))

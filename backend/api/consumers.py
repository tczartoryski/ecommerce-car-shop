import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.apps import apps
from .serializers import MessageSerializer, ConversationSerializer

EcommerceUser = get_user_model()

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope['user'].is_anonymous:
            await self.close()
        else:
            self.user = self.scope['user']
            self.group_name = f'notifications_{self.user.id}'
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            await self.accept()
            notifications = await self.get_unread_notifications(self.user)
            await self.send(text_data=json.dumps({
                'type': 'new_notifications',
                'notifications': notifications
            }))

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    @database_sync_to_async
    def get_unread_notifications(self, user):
        Message = apps.get_model('api', 'Message')
        unread_messages = Message.objects.filter(receiver=user, read=False)
        return MessageSerializer(unread_messages, many=True).data

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.conversation_group_name = f'conversation_{self.conversation_id}'

        await self.channel_layer.group_add(
            self.conversation_group_name,
            self.channel_name
        )

        await self.accept()
        print(f"WebSocket connected: {self.channel_name} joined {self.conversation_group_name}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.conversation_group_name,
            self.channel_name
        )
        print(f"WebSocket disconnected: {self.channel_name} left {self.conversation_group_name} with close code {close_code}")

    async def receive(self, text_data):
        print(f"Message received from WebSocket: {text_data}")
        try:
            data = json.loads(text_data)
            print(f"Parsed data: {data}")
            message = data['message']
            sender_id = data['sender_id']
            print(f"Parsed message: {message}, sender_id: {sender_id}")

            new_message = await self.save_message(sender_id, message)
            print(f"Message saved to database: {new_message}")

            await self.channel_layer.group_send(
                self.conversation_group_name,
                {
                    'type': 'chat_message',
                    'message': MessageSerializer(new_message).data
                }
            )
            print(f"Message sent to conversation group: {self.conversation_group_name}")

            await self.channel_layer.group_send(
                'conversations_group',
                {
                    'type': 'conversation_update',
                    'conversation': ConversationSerializer(new_message.conversation).data
                }
            )
            print(f"Conversation update sent to conversations group")
        except Exception as e:
            print(f"Error processing message: {e}")

    async def chat_message(self, event):
        message = event['message']
        print(f"Message received from conversation group: {message}")

        await self.send(text_data=json.dumps(message))
        print(f"Message sent to WebSocket: {message}")

    @database_sync_to_async
    def save_message(self, sender_id, message):
        print(f"Saving message to database: sender_id={sender_id}, message={message}")
        Conversation = apps.get_model('api', 'Conversation')
        Message = apps.get_model('api', 'Message')
        
        sender = EcommerceUser.objects.get(id=sender_id)
        conversation = Conversation.objects.get(id=self.conversation_id)
        new_message = Message.objects.create(
            conversation=conversation,
            sender=sender,
            receiver=conversation.buyer if conversation.seller == sender else conversation.seller,
            content=message
        )
        print(f"Message created: {new_message}")
        return new_message

class ConversationsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if self.user.is_anonymous:
            await self.close()
            print("Anonymous user tried to connect to Conversationa Consumer. Connection closed.")
        else:
            await self.accept()
            print(f"WebSocket connected: {self.channel_name} for user {self.user.id}")

            await self.channel_layer.group_add(
                'conversations_group',
                self.channel_name
            )
            print(f"Added {self.channel_name} to conversations_group")

            conversations = await self.get_conversations()
            print(f"Fetched initial conversations for user {self.user.id}")

            await self.send(text_data=json.dumps({
                'type': 'initial_conversations',
                'conversations': conversations
            }))
            print(f"Sent initial conversations to {self.channel_name}")
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            'conversations_group',
            self.channel_name
        )
        print(f"WebSocket disconnected: {self.channel_name} with close code {close_code}")

    async def receive(self, text_data):
        print(f"Message received from WebSocket: {text_data}")

    async def conversation_update(self, event):
        conversation = event['conversation']

        await self.send(text_data=json.dumps({
            'type': 'conversation_update',
            'conversation': conversation
        }))

    @database_sync_to_async
    def get_conversations(self):
        Conversation = apps.get_model('api', 'Conversation')
        conversations = Conversation.objects.filter(
            buyer=self.user
        ) | Conversation.objects.filter(
            seller=self.user
        )
        return ConversationSerializer(conversations, many=True).data

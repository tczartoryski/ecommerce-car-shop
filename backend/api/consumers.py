import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.apps import apps


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("Connecting user")
        if self.scope['user'].is_anonymous:
            print("User is anonymous")
            await self.close()
        else:
            print("User is not anonymous")
            self.user = self.scope['user']
            self.group_name = f'notifications_{self.user.id}'
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            await self.accept()
            print("Sending over unread notifications")
            # Send all unread notifications when the connection is established
            notifications = await self.get_unread_notifications(self.user)
            await self.send(text_data=json.dumps({
                'type': 'new_notifications',
                'notifications': notifications
            }))

    async def disconnect(self, close_code):
        print("Disconnecting user")
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        print("Receiving data")
        data = json.loads(text_data)
        print(f"Data received: {data}")

    async def notification_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'type': 'new_notifications',
            'notification': [message]
        }))

    @database_sync_to_async
    def get_unread_notifications(self, user):
        # Get the Message model dynamically
        Message = apps.get_model('api', 'Message')
        # Query the database for unread messages involving the user
        unread_messages = Message.objects.filter(receiver=user, read=False)
        # Serialize the unread messages
        from .serializers import MessageSerializer  # Import here to avoid early import issues
        serializer = MessageSerializer(unread_messages, many=True)
        return serializer.data
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.apps import apps
from .serializers import MessageSerializer, ConversationSerializer

EcommerceUser = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
        self.conversation_group_name = f"conversation_{self.conversation_id}"

        await self.channel_layer.group_add(
            self.conversation_group_name, self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.conversation_group_name, self.channel_name
        )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            if data["type"] == "new_message":
                message = data["message"]
                sender_id = data["sender_id"]

                new_message = await self.save_message(sender_id, message)
                await self.channel_layer.group_send(
                    self.conversation_group_name,
                    {
                        "type": "chat_message",
                        "message": MessageSerializer(new_message).data,
                    },
                )
                await self.channel_layer.group_send(
                    "conversations_group",
                    {
                        "type": "conversation_update",
                        "conversation": await self.serialize_conversation(
                            new_message.conversation
                        ),
                    },
                )

        except Exception as e:
            print(f"Error processing message: {e}")

    async def chat_message(self, event):
        message = event["message"]

        await self.send(text_data=json.dumps(message))

    @database_sync_to_async
    def serialize_conversation(self, conversation):
        return ConversationSerializer(conversation).data

    @database_sync_to_async
    def save_message(self, sender_id, message):
        Conversation = apps.get_model("api", "Conversation")
        Message = apps.get_model("api", "Message")

        sender = EcommerceUser.objects.get(id=sender_id)
        conversation = Conversation.objects.get(id=self.conversation_id)
        new_message = Message.objects.create(
            conversation=conversation,
            sender=sender,
            receiver=(
                conversation.buyer
                if conversation.seller == sender
                else conversation.seller
            ),
            content=message,
        )
        return new_message


class ConversationsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_anonymous:
            await self.close()
        else:
            await self.accept()

            await self.channel_layer.group_add("conversations_group", self.channel_name)

            conversations = await self.get_conversations()

            await self.send(
                text_data=json.dumps(
                    {"type": "initial_conversations", "conversations": conversations}
                )
            )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("conversations_group", self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data["type"] == "delete_conversation":
            print("Delete conversation request received")
            conversation_id = data["conversation_id"]
            await self.delete_conversation(conversation_id)
            conversations = await self.get_conversations()
            await self.send(
                text_data=json.dumps(
                    {"type": "initial_conversations", "conversations": conversations}
                )
            )

    async def conversation_update(self, event):
        conversation = event["conversation"]

        await self.send(
            text_data=json.dumps(
                {"type": "conversation_update", "conversation": conversation}
            )
        )

    @database_sync_to_async
    def get_conversations(self):
        Conversation = apps.get_model("api", "Conversation")
        conversations = Conversation.objects.filter(
            buyer=self.user
        ) | Conversation.objects.filter(seller=self.user)
        return ConversationSerializer(conversations, many=True).data

    @database_sync_to_async
    def delete_conversation(self, conversation_id):
        Conversation = apps.get_model("api", "Conversation")
        conversation = Conversation.objects.get(id=conversation_id)
        conversation.delete()
        print(f"Conversation {conversation_id} deleted")

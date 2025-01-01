from django.urls import re_path
from .consumers import NotificationConsumer, ChatConsumer, ConversationsConsumer


websocket_urlpatterns = [
   re_path('ws/notifications/', NotificationConsumer.as_asgi()),
   re_path(r'ws/conversations/(?P<conversation_id>\d+)/$', ChatConsumer.as_asgi()),
   re_path(r'ws/conversations/', ConversationsConsumer.as_asgi()),
]

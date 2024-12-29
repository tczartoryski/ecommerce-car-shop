from django.urls import re_path
from .consumers import NotificationConsumer

print("Configuring WebSocket URL patterns")

websocket_urlpatterns = [
   re_path('ws/notifications/', NotificationConsumer.as_asgi()),
    #re_path(r'ws/chat/(?P<room_name>\w+)/$', ChatConsumer.as_asgi()),
]

print("WebSocket URL patterns configured")
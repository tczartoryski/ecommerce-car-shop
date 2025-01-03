# api/urls.py
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .routing import websocket_urlpatterns  # Import WebSocket URL patterns

router = DefaultRouter()
router.register(r"conversations", views.ConversationViewSet, basename="conversation")

urlpatterns = [
    path("register/", views.RegisterView.as_view(), name="register"),
    path("user/details/", views.FetchDetailsView.as_view(), name="fetch-details"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("login/", views.UserLoginView.as_view(), name="login"),
    path("car/create/", views.CarDetailView.as_view(), name="create-car"),
    path("car/<str:pk>/", views.CarDetailView.as_view(), name="car-detail"),
    path("car/<str:pk>/update/", views.CarUpdateView.as_view(), name="car-update"),
    path("market-cars/", views.CarListView.as_view(), name="market-cars"),
    path("my-cars/", views.CarListView.as_view(), name="my-cars"),
    path(
        "change-password/", views.ChangePasswordView.as_view(), name="change-password"
    ),
    path(
        "password_reset/", views.password_reset_request, name="password_reset_request"
    ),
    path(
        "message-owner/",
        views.CreateConversationAndMessageView.as_view(),
        name="message-owner",
    ),
    path(
        "conversations/<int:conversation_id>/messages/",
        views.ConversationMessagesView.as_view(),
        name="conversation-messages",
    ),
    path("", include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += websocket_urlpatterns

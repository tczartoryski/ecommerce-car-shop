import logging
import json  # Import json module
from rest_framework.response import Response
from rest_framework import generics
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    EcommerceUserSerializer,
    CarSerializer,
    UserLoginSerializer,
    ConversationSerializer,
    MessageSerializer,
)
from rest_framework import viewsets
from .models import Car, EcommerceUser, Conversation, Message, CarImage
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.forms import PasswordResetForm
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

logger = logging.getLogger("django")


class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user_id": user.pk,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            },
            status=200,
        )


class RegisterView(generics.CreateAPIView):
    serializer_class = EcommerceUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user_id": user.pk,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            },
            status=201,
        )


class FetchDetailsView(generics.RetrieveAPIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request, *args, **kwargs):
        user = request.user
        return Response(
            {
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "id": user.id,
            },
            status=200,
        )


class ChangePasswordView(generics.UpdateAPIView):
    model = EcommerceUser
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        user = request.user
        new_password = request.data.get("new_password")
        user.set_password(new_password)
        user.save()
        return Response(
            {"success": True, "message": "Password changed successfully"}, status=200
        )


class CarListView(generics.ListAPIView):
    serializer_class = CarSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if self.request.path.endswith("market-cars/"):
            return Car.objects.exclude(owner=user)
        else:
            return Car.objects.filter(owner=user)


class CarDetailView(
    generics.CreateAPIView,
    generics.RetrieveAPIView,
    generics.DestroyAPIView,
    generics.UpdateAPIView,
):
    serializer_class = CarSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Car.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        CarImage.objects.filter(car=instance).delete()
        conversations = Conversation.objects.filter(car=instance)
        for conversation in conversations:
            Message.objects.filter(conversation=conversation).delete()
            conversation.delete()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CarUpdateView(generics.UpdateAPIView):
    serializer_class = CarSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Car.objects.all()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        existing_images_urls = request.data.getlist("existing_images")

        existing_images = CarImage.objects.filter(car=instance)
        for image in existing_images:
            if image.image.url not in existing_images_urls:
                image.delete()

        new_images = request.FILES.getlist("image_files")
        for image in new_images:
            CarImage.objects.create(car=instance, image=image)

        data = request.data.copy()
        data.pop("existing_images", None)
        data.pop("image_files", None)

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


@api_view(["POST"])
def test_request(request):
    print(request.data)
    return Response({"success": True, "message": "Yes"}, status=status.HTTP_200_OK)


@api_view(["POST"])
def password_reset_request(request):
    if request.method == "POST":
        form = PasswordResetForm(request.data)
        if form.is_valid():
            email = form.cleaned_data["email"]
            try:
                user = EcommerceUser.objects.get(email=email)
                form.save(request=request, use_https=request.is_secure())
                return Response(
                    {"success": True, "message": "Password reset email sent."},
                    status=status.HTTP_200_OK,
                )
            except EcommerceUser.DoesNotExist:
                return Response(
                    {"success": False, "message": "Email not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            return Response(
                {"success": False, "message": form.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
    else:
        return Response(
            {"success": False, "message": "Invalid request method."},
            status=status.HTTP_400_BAD_REQUEST,
        )


class CreateConversationAndMessageView(generics.CreateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        car_id = request.data.get("car_id")
        message_content = request.data.get("content")
        sender = request.user
        car = get_object_or_404(Car, id=car_id)
        conversation, created = Conversation.objects.get_or_create(
            car=car, buyer=sender, seller=car.owner
        )

        new_message = Message.objects.create(
            conversation=conversation,
            sender=sender,
            receiver=car.owner,
            content=message_content,
        )
        serialized_conversation = ConversationSerializer(conversation).data
        return Response(serialized_conversation, status=status.HTTP_201_CREATED)


class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer

    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(seller=user) | Conversation.objects.filter(
            buyer=user
        )


class ConversationMessagesView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        conversation_id = self.kwargs["conversation_id"]
        return Message.objects.filter(conversation_id=conversation_id).order_by(
            "timestamp"
        )

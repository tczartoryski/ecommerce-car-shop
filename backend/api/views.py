from rest_framework.response import Response
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (EcommerceUserSerializer, CarSerializer, UserLoginSerializer)
from .models import Car, EcommerceUser
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.forms import PasswordResetForm
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': user.pk,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        }, status=200)


class RegisterView(generics.CreateAPIView):
    serializer_class = EcommerceUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': user.pk,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        }, status=201)


class FetchDetailsView(generics.RetrieveAPIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request, *args, **kwargs):
        user = request.user
        return Response({
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        }, status=200)


class CarListView(generics.ListAPIView):
    serializer_class = CarSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if self.request.query_params.get('market', None):
            return Car.objects.exclude(owner=user)
        else:
            return Car.objects.filter(owner=user)


class CarDetailView(generics.CreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CarSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Car.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


@api_view(['POST'])
def password_reset_request(request):
    if request.method == 'POST':
        form = PasswordResetForm(request.data)
        if form.is_valid():
            email = form.cleaned_data['email']
            try:
                user = EcommerceUser.objects.get(email=email)
                form.save(request=request, use_https=request.is_secure())
                return Response({'success': True, 'message': 'Password reset email sent.'}, status=status.HTTP_200_OK)
            except EcommerceUser.DoesNotExist:
                return Response({'success': False, 'message': 'Email not found.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'success': False, 'message': form.errors}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'success': False, 'message': 'Invalid request method.'}, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.serializers import ModelSerializer
from .models import Car, EcommerceUser, Conversation, Message, CarImage
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate

User = get_user_model()

class CarImageSerializer(serializers.ModelSerializer):
    image_url = serializers.CharField(source='image.url', read_only=True)

    class Meta:
        model = CarImage
        fields = ['image_url']


class CarSerializer(serializers.ModelSerializer):
    images = CarImageSerializer(many=True, read_only=True)
    image_files = serializers.ListField(
        child=serializers.ImageField(write_only=True), write_only=True
    )

    class Meta:
        model = Car
        fields = ['id', 'make', 'model', 'year', 'color', 'description', 'mileage', 'price', 'zipcode', 'images', 'image_files']
        depth = 1

    def create(self, validated_data):
        image_files = validated_data.pop('image_files')
        car = Car.objects.create(**validated_data)
        for image in image_files:
            CarImage.objects.create(car=car, image=image)
        return car



class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        return user


class EcommerceUserSerializer(UserSerializer):
    cars = CarSerializer(many=True, read_only=True)

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ('cars',)


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(trim_whitespace=False)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        try:
            user = EcommerceUser.objects.get(email=email)
        except EcommerceUser.DoesNotExist:
            raise serializers.ValidationError('User with this email does not exist')

        user = authenticate(request=self.context.get('request'), username=user.email, password=password)

        if not user:
            raise serializers.ValidationError('Unable to authenticate with provided credentials')

        attrs['user'] = user
        return attrs


class ConversationSerializer(ModelSerializer):
    buyer = EcommerceUserSerializer(many=False)
    seller = EcommerceUserSerializer(many=False)
    car = CarSerializer(many=False)

    class Meta:
        model = Conversation
        fields = ('id', 'car', 'buyer', 'seller')


class MessageSerializer(ModelSerializer):
    conversation = ConversationSerializer(many=False)
    sender = EcommerceUserSerializer(many=False)

    class Meta:
        model = Message
        fields = ('id', 'conversation', 'content', 'sender', 'timestamp')

from rest_framework.serializers import ModelSerializer
from .models import Car, EcommerceUser, Conversation, Message


class CarSerializer(ModelSerializer):
    class Meta:
        model = Car
        fields = '__all__'
        depth = 1

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Check if the image field is not null before accessing its URL
        if instance.image:
            representation['image'] = instance.image.url
        else:
            representation['image'] = None

        return representation


class EcommerceUserSerializer(ModelSerializer):
    cars = CarSerializer(many=True)

    class Meta:
        model = EcommerceUser
        fields = ('id', 'first_name', 'last_name', 'email', 'cars')


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

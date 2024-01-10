from django.contrib.auth.forms import AuthenticationForm
from django.db.models import Q
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.views import APIView

from .models import Car, Conversation, Message, EcommerceUser
from .serializers import CarSerializer, ConversationSerializer, MessageSerializer
from django.contrib.auth import login


@api_view(['POST'])
def create_car(request):
    data = request.data
    image_file = data.get('image', None)

    # Get the current user
    user = request.user

    # Create the car and set the owner
    car = Car.objects.create(
        make=data['make'],
        model=data['model'],
        year=data['year'],
        price=data['price'],
        location=data['location'],
        description=data['description'],
        image=image_file,
        owner=user  # Set the owner to the current user
    )

    serializer = CarSerializer(car, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_my_cars(request):
    # Get the current user
    user = request.user
    # Filter cars based on the current user
    cars = Car.objects.filter(owner=user)

    # Serialize the cars and return the response
    serializer = CarSerializer(cars, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_market_cars(request):
    cars = Car.objects.exclude(owner=request.user)
    serializer = CarSerializer(cars, many=True)
    return Response(serializer.data)


class ConversationDetailView(APIView):

    def post(self, request):
        data = request.data

        # Get the current user
        user = request.user
        car = Car.objects.get(id=data['car'])
        # Create the Conversation
        conversation = Conversation.objects.create(
            car=car,
            buyer=request.user,
            seller=car.owner,
        )
        # Create the message model
        message = Message.objects.create(
            conversation=conversation,
            content=data['message'],
            sender=request.user
        )
        return Response("Conversation created", status=200)

    def get(self, request, pk):
        conversation = Conversation.objects.get(id=pk)
        serializer = MessageSerializer(conversation.messages, many=True)
        return Response(serializer.data)

    def patch(self, request, pk):
        conversation = Conversation.objects.get(id=pk)
        data = request.data
        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            content=data['message'],
        )
        serializer = MessageSerializer(conversation.messages, many=True)
        return Response(serializer.data)

    def delete(self, request, pk):
        try:
            car = Conversation.objects.get(id=pk)
        except Conversation.DoesNotExist:
            return Response({'error': 'Car not found'}, status=status.HTTP_404_NOT_FOUND)

        car.delete()
        return Response({'message': 'Car was deleted!'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_conversations(request):
    user_conversations = Conversation.objects.filter(Q(buyer=request.user) | Q(seller=request.user))
    serializer = ConversationSerializer(user_conversations, many=True)
    return Response(serializer.data)





@api_view(['POST'])
def do_login(request):
    request.data['username'] = request.data['email']
    form = AuthenticationForm(data=request.data)
    if form.is_valid():
        user = form.get_user()
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user_id': user.pk, 'email': user.email}, status=200)
    else:
        errors = form.errors.as_json()
        return Response({'error': 'Registration form is not valid', 'errors': errors}, status=400)

def user_exists(email):
    try:
        # Attempt to get the user with the given email
        user = EcommerceUser.objects.get(email=email)
        return True  # User exists
    except EcommerceUser.DoesNotExist:
        return False  # User does not exist

def valid_data(data):
    for key in data:
        if data[key] is None:
            return {'Valid': False,
                    'Message': f'{key} is None'}
    if not passwords_match(data):
        return {'Valid': False,
                'Message': f'Passwords Dont Match'}
    if len(data['password1']) < 6:
        return {'Valid': False,
                'Message': f'Passwords Not Long Enough'}
    if user_exists(data['email']):
        return {'Valid': False,
                'Message': f'Email Already Exists'}
    return {'Valid': True,
            'Message': f'User Valid'}

def passwords_match(data):
    return data['password1'] == data['password2']

@api_view(['POST'])
def register(request):
    request.data['username'] = request.data['email']
    valid = valid_data(request.data)
    if valid['Valid']:
        user = EcommerceUser.objects.create_user(
            email=request.data.get('email'),
            password=request.data.get('password1'),
            first_name=request.data.get('first_name'),
            last_name=request.data.get('last_name')
        )
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user_id': user.pk, 'email': user.email}, status=200)
    else:
        return Response({'error': valid['Message']}, status=400)


class CarDetailView(APIView):

    def post(self, request):
        data = request.data
        image_file = data.get('image', None)

        # Get the current user
        user = request.user

        # Create the car and set the owner
        car = Car.objects.create(
            make=data['make'],
            model=data['model'],
            year=data['year'],
            price=data['price'],
            location=data['location'],
            description=data['description'],
            image=image_file,
            owner=user  # Set the owner to the current user
        )

        serializer = CarSerializer(car, many=False)
        return Response(serializer.data)

    def get(self, request, pk):
        try:
            car = Car.objects.get(id=pk)
            serializer = CarSerializer(car)
            return Response(serializer.data)
        except Car.DoesNotExist:
            return Response({'error': 'Car not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            car = Car.objects.get(id=pk)
        except Car.DoesNotExist:
            return Response({'error': 'Car not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CarSerializer(instance=car, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            car = Car.objects.get(id=pk)
        except Car.DoesNotExist:
            return Response({'error': 'Car not found'}, status=status.HTTP_404_NOT_FOUND)

        car.delete()
        return Response({'message': 'Car was deleted!'}, status=status.HTTP_204_NO_CONTENT)



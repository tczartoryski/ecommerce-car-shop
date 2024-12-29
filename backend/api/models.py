from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models


class EcommerceUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        first_name = extra_fields.pop('first_name', None)
        last_name = extra_fields.pop('last_name', None)

        if not email:
            raise ValueError('The Email field must be set')

        email = self.normalize_email(email)
        user = self.model(first_name=first_name, last_name=last_name, email=email, username=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)


class EcommerceUser(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=30, blank=False, null=False)
    last_name = models.CharField(max_length=30, blank=False, null=False)
    email = models.EmailField(unique=True, blank=False, null=False)
    username = models.CharField(unique=True, blank=False, null=False, max_length=40)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = EcommerceUserManager()

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        # Set the username to the email if it's a superuser and username is not set
        if self.is_superuser and not self.username:
            self.username = self.email

        super().save(*args, **kwargs)


class Car(models.Model):
    model = models.TextField(null=True, blank=True)
    make = models.TextField(null=True, blank=True)
    year = models.TextField(null=True, blank=True)
    color = models.CharField(max_length=50)  # Add the color field
    zipcode = models.CharField(max_length=5, null=True, blank=True)  # Updated field
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Updated field
    mileage = models.IntegerField(null=True, blank=True)  # New field
    description = models.TextField(null=True, blank=True)
    owner = models.ForeignKey(EcommerceUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='cars')

    def __str__(self):
        return f'{self.model} {self.make} {self.year} {self.price} {self.zipcode}'

class CarImage(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='cars/images/')

    def __str__(self):
        return f'Image for {self.car.model} {self.car.make}'
   
    def delete(self, *args, **kwargs):
        # Delete the image file from the S3 bucket
        self.image.delete(save=False)
        # Call the superclass delete method
        super().delete(*args, **kwargs)

class Conversation(models.Model):
    seller = models.ForeignKey(EcommerceUser, on_delete=models.CASCADE, related_name='seller_conversations')    
    buyer = models.ForeignKey(EcommerceUser, on_delete=models.CASCADE, related_name='buyer_conversations')
    car = models.ForeignKey(Car, on_delete=models.CASCADE)


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(EcommerceUser, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(EcommerceUser, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
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
    location = models.TextField(null=True, blank=True)
    price = models.TextField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    owner = models.ForeignKey(EcommerceUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='cars')

    def __str__(self):
        return f'{self.model} {self.make} {self.year} {self.price} {self.location}'

class CarImage(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='cars/images/')

    def __str__(self):
        return f'Image for {self.car.model} {self.car.make}'

class Conversation(models.Model):
    participants = models.ManyToManyField(EcommerceUser, related_name='conversations')
    car = models.ForeignKey(Car, on_delete=models.CASCADE)


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(EcommerceUser, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
from django.contrib.auth.forms import UserCreationForm

from .models import EcommerceUser


class RegistrationForm(UserCreationForm):
    class Meta:
        model = EcommerceUser
        fields = ['email', 'password1', 'password2', 'first_name', 'last_name']
        exclude = ['date_joined']

    def __init__(self, *args, **kwargs):
        super(RegistrationForm, self).__init__(*args, **kwargs)
        self.fields.pop('username', None)
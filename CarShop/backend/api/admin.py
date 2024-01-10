from django.contrib import admin
from django.contrib.auth.admin import UserAdmin


from .models import Car, EcommerceUser, Conversation, Message


class EcommerceUserAdmin(UserAdmin):
    model = EcommerceUser
    list_display = ['email', 'first_name', 'last_name', 'display_cars', 'is_staff']
    ordering = ['email']
    readonly_fields = ['date_joined']

    def display_cars(self, obj):
        return ', '.join([str(car) for car in obj.cars.all()])

    display_cars.short_description = 'Cars'


admin.site.register(EcommerceUser, EcommerceUserAdmin)
admin.site.register(Car)
admin.site.register(Conversation)
admin.site.register(Message)





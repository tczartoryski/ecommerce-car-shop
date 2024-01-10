from django.urls import path
from . import views
from .views import CarDetailView

urlpatterns = [
    path('market-cars/', views.get_market_cars, name="market-cars"),
    path('conversation/create/', views.ConversationDetailView.as_view(), name="create-conversation"),
    path('conversation/<str:pk>/', views.ConversationDetailView.as_view(), name="conversation-detail"),
    path('conversations/', views.get_conversations, name="conversations"),
    path('my-cars/', views.get_my_cars, name="my-cars"),
    path('register/', views.register, name="register"),
    path('login/', views.do_login, name="login"),
    path('car/create/', CarDetailView.as_view(), name="create-car"),
    path('car/<str:pk>/', CarDetailView.as_view(), name="car-detail"),
]

# api/urls.py
from django.urls import path, re_path, include
from . import views
from .views import CarDetailView, UserLoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .routing import websocket_urlpatterns  # Import WebSocket URL patterns

urlpatterns = [
   path('register/', views.RegisterView.as_view(), name="register"),
   path('user/details/', views.FetchDetailsView.as_view(), name="fetch-details" ),
   path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
   path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
   path('login/', UserLoginView.as_view(), name="login"),
   path('car/create/', CarDetailView.as_view(), name="create-car"),
   path('car/<str:pk>/', CarDetailView.as_view(), name="car-detail"),
   path('market-cars/', views.CarListView.as_view(), name="market-cars"),
   path('my-cars/', views.CarListView.as_view(), name="my-cars"),
   path('password_reset/', views.password_reset_request, name='password_reset_request'),

]

urlpatterns += websocket_urlpatterns  # Include WebSocket URL patterns


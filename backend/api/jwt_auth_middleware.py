from channels.middleware import BaseMiddleware
from urllib.parse import parse_qs
from channels.db import database_sync_to_async

# Use lazy loading to avoid premature access to the Django models
@database_sync_to_async
def get_user(user_id):
    # This method will access the User model after the app registry is ready
    from django.contrib.auth import get_user_model
    try:
        User = get_user_model()  # Dynamically access the User model
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        from django.contrib.auth.models import AnonymousUser  # Import here when needed
        return AnonymousUser()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope["query_string"].decode())
        token = query_string.get("token")

        if token:
            try:
                # Dynamically import `UntypedToken` within the method to avoid early import issues
                from rest_framework_simplejwt.tokens import UntypedToken
                from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

                # Validate the token using the SimpleJWT UntypedToken
                UntypedToken(token[0])  # This checks if the token is valid but doesn't decode yet
                decoded_data = UntypedToken(token[0])  # Decode the token
                user_id = decoded_data["user_id"]

                # Fetch the user asynchronously and set it in the scope
                scope["user"] = await get_user(user_id)
            except (InvalidToken, TokenError) as e:
                # If the token is invalid or expired, set user to AnonymousUser
                from django.contrib.auth.models import AnonymousUser  # Import here when needed
                scope["user"] = AnonymousUser()
        else:
            # If no token is provided, set user to AnonymousUser
            from django.contrib.auth.models import AnonymousUser  # Import here when needed
            scope["user"] = AnonymousUser()

        # Proceed with the next part of the middleware chain
        return await super().__call__(scope, receive, send)

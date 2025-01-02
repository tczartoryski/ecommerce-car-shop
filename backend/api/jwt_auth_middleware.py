from channels.middleware import BaseMiddleware
from urllib.parse import parse_qs
from channels.db import database_sync_to_async


@database_sync_to_async
def get_user(user_id):
    from django.contrib.auth import get_user_model

    try:
        User = get_user_model()
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        from django.contrib.auth.models import AnonymousUser

        return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope["query_string"].decode())
        token = query_string.get("token")

        if token:
            try:
                from rest_framework_simplejwt.tokens import UntypedToken
                from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

                UntypedToken(token[0])
                decoded_data = UntypedToken(token[0])
                user_id = decoded_data["user_id"]

                scope["user"] = await get_user(user_id)
            except (InvalidToken, TokenError) as e:
                from django.contrib.auth.models import (
                    AnonymousUser,
                )

                scope["user"] = AnonymousUser()
        else:
            from django.contrib.auth.models import (
                AnonymousUser,
            )

            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)

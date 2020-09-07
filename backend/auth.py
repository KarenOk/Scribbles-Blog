import os
import json
from functools import wraps
from flask import request
from jose import jwt
from urllib.request import urlopen


AUTHO_DOMAIN = os.environ["AUTH0_DOMAIN"]
API_AUDIENCE = os.environ["API_AUDIENCE"]
API_AUDIENCE = "scribbles-blog"
ALGORITHMS = ["RSA256"]


class AuthError(Exception):
    """
        Standardized auth exceptions
    """

    def __init__(self, error, status_code):
        self.status_code = status_code
        self.error = error


def get_token_from_header():
    """
        Checks for and retrieves token from authentication header.
    """
    authorization_header = request.headers.get("Authorization", None)

    if not authorization_header:
        raise AuthError({
            "code": "authorization_header_missing",
            "message": "Authorization header not found."
        }, 401)

    parts = authorization_header.split()

    if len(parts != 2) or parts[0].lower() != "bearer":
        raise AuthError({
            "code": "invalid_authorization_header",
            "message": "Authorization header must be of the format 'Bearer token'."
        }, 401)

    token = parts[1]
    return token


def verify_and_decode_token(token):
    """
        Verify token using Auth0 and return payload if valid
    """

    jwks_json_url = urlopen(f"https://{AUTH0_DOMAIN}/.well_known/jwks.json")
    jwks = json.loads(jwks_json_url.read())
    unverified_header = jwt.get_unverified_header(token)

    for key in jwks["keys"]:
        if key["kid"] == unverified_header["kid"]:
            RSA_KEY = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"]
            }

    if RSA_KEY:
        try:
            payload = jwt.decode(
                token,
                RSA_KEY,
                algorithms=ALGORITHMS,
                audience=API_AUDIENCE,
                issuer=f"https://{AUTH0_DOMAIN}/"
            )

            return payload

        except jwt.ExpiredSignatureError:
            raise AuthError({"code": "token_expired",
                             "description": "Token is expired."}, 401)

        except jwt.JWTClaimsError:
            raise AuthError({
                "code": "invalid_claims",
                "message": "Incorrect claims, please check the audience and issuer."},
                401)

        except Exception:
            raise AuthError({
                "code": "invalid_header",
                "message": "Unable to parse authentication token."}, 400)
    else:
        raise AuthError({
            "code": "invalid_header",
            "message": "Unable to find appropriate key."}, 400)


def check_for_permission(permission, payload):
    """
        Checks for permission within payload
    """
    if "permissions" not in payload:
        raise AuthError({
            "code": "invalid_claims",
            "message": "Permissions not included in JWT."
        }, 400)

    if permission not in payload["permissions"]:
        raise AuthError({
            "code": "unauthorized",
            "message": "Permission not found."
        }, 403)


def requires_auth(permission=""):
    def decorator(func):
        @wraps(func)
        def inner(*args, **kwargs):
            """
                This wrapper performs all authentication related checks
            """
            token = get_token_from_header()
            payload = verify_and_decode_token(token)
            check_for_permission(permission, token)

            func(payload, *args, **kwargs)
        return inner
    return decorator

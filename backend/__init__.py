"""General setup."""

from functools import cached_property
import logging
import os
import sys

from dotenv import load_dotenv
from fastapi.security import HTTPAuthorizationCredentials
from fastapi.security.utils import get_authorization_scheme_param
from google.oauth2 import id_token
from google.auth.transport import requests as google_reqests
from strawberry.fastapi import BaseContext

from backend.exceptions import GoalTrackerException

LOGGER = logging.getLogger()
LOGGER.setLevel(logging.INFO)
HANDLER = logging.StreamHandler(sys.stdout)
FORMATTER = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
HANDLER.setFormatter(FORMATTER)
LOGGER.addHandler(HANDLER)


class GoalTrackerContext(BaseContext):  # pylint: disable=too-few-public-methods
    """Class to handle custom request context."""

    @cached_property
    def user_email(self) -> str | None:
        """The current user associated with the bearer token provided in request header."""
        if not self.request:
            return None

        authorization = self.request.headers.get("Authorization")
        scheme, credentials = get_authorization_scheme_param(authorization)
        if not (authorization and scheme and credentials):
            return None
        if scheme.lower() != "bearer":
            return None
        http_credentials = HTTPAuthorizationCredentials(scheme=scheme, credentials=credentials)
        idinfo = id_token.verify_oauth2_token(  # type: ignore[no-untyped-call]
            http_credentials.credentials,
            google_reqests.Request(),  # type: ignore[no-untyped-call]
            os.environ["GOOGLE_OAUTH_CLIENT_ID"],
        )

        return str(idinfo["email"])


REQUIRED_OPTIONS = ["POSTGRES_USER", "POSTGRES_PASSWORD", "DB_HOST", "POSTGRES_DB", "GOOGLE_OAUTH_CLIENT_ID"]
if all(option not in os.environ for option in REQUIRED_OPTIONS):
    load_dotenv(os.path.join(os.getcwd(), "backend", ".env.dev"))

for required_option in REQUIRED_OPTIONS:
    if required_option not in os.environ:
        raise GoalTrackerException(f"'{required_option}' environment variable not found.")

if "ENVIRONMENT" not in os.environ:
    os.environ["ENVIRONMENT"] = "Production"

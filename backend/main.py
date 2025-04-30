"""Configure the main application."""

from contextlib import asynccontextmanager
import os
from typing import Annotated, AsyncIterator, Dict

from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from google.oauth2 import id_token
from google.auth.transport import requests as google_reqests
from strawberry.fastapi import GraphQLRouter

from alembic.config import Config
from alembic import command

from backend import GoalTrackerContext
from backend.api import schema
from backend.database import add_encouragement
from backend.wait_for_postgres import wait_for_postgres


def run_migrations() -> None:
    """Runs alembic migrations."""
    alembic_cfg = Config(os.path.join(os.getcwd(), "backend", "alembic.ini"))
    command.upgrade(alembic_cfg, "head")


@asynccontextmanager
async def lifespan(fast_api_app: FastAPI) -> AsyncIterator[None]:
    """Handle the FastAPI app lifecycle."""
    del fast_api_app
    wait_for_postgres()
    run_migrations()
    add_encouragement()
    yield


async def get_context() -> GoalTrackerContext:
    """Sets up the request context for use by APIs."""
    return GoalTrackerContext()


app = FastAPI(lifespan=lifespan)
graphql_ide = "graphiql" if os.environ["ENVIRONMENT"] == "development" else None
graphql_router = GraphQLRouter(
    schema, path="/api/graphql", context_getter=get_context, graphql_ide=graphql_ide  # type: ignore[arg-type]
)
app.include_router(graphql_router)

origins = ["http://localhost"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/tokensignin")
def token_signin(idtoken: Annotated[str, Form()]) -> Dict[str, str]:
    """Verifies the token provided by the frontend."""
    idinfo = id_token.verify_oauth2_token(  # type: ignore[no-untyped-call]
        idtoken, google_reqests.Request(), os.environ["GOOGLE_OAUTH_CLIENT_ID"]  # type: ignore[no-untyped-call]
    )
    return {"email": idinfo["email"], "name": idinfo["name"]}

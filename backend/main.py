"""Configure the main application."""

from contextlib import asynccontextmanager
import os
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.asgi import GraphQL

from alembic.config import Config
from alembic import command

from backend.database import init_db
from backend.api import schema


def run_migrations() -> None:
    """Runs alembic migrations."""
    alembic_cfg = Config(os.path.join(os.getcwd(), "backend", "alembic.ini"))
    command.upgrade(alembic_cfg, "head")


@asynccontextmanager
async def lifespan(fast_api_app: FastAPI) -> AsyncIterator[None]:
    """Handle the FastAPI app lifecycle."""
    del fast_api_app
    init_db()
    run_migrations()
    yield


app = FastAPI(lifespan=lifespan)

app.add_route("/graphql", GraphQL(schema))  # type: ignore

origins = ["http://10.42.42.103", "http://localhost", "http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

"""Configure the main application."""

from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.asgi import GraphQL

from backend.database import init_db
from backend.api import schema


@asynccontextmanager
async def lifespan(fast_api_app: FastAPI) -> AsyncIterator[None]:
    """Handle the FastAPI app lifecycle."""
    del fast_api_app
    init_db()
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

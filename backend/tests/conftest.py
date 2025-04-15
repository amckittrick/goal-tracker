"""Configure the test environment."""

from collections.abc import Iterator

import pytest
from sqlalchemy.orm import close_all_sessions

from backend.database import Base, create_local_engine, init_db


@pytest.fixture(scope="session", autouse=True)
def setup_session() -> None:
    """Perform onetime setup for the test session."""
    init_db()


@pytest.fixture(autouse=True)
def db_setup_cleanup() -> Iterator[None]:
    """Wraps every test to ensure a clean database before and after each test."""
    close_all_sessions()
    Base.metadata.drop_all(bind=create_local_engine())

    close_all_sessions()
    Base.metadata.create_all(bind=create_local_engine())

    yield

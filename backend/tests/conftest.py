"""Configure the test environment."""

from collections.abc import Iterator

import pytest
from sqlalchemy import MetaData

from backend.database import create_local_engine, init_db


@pytest.fixture(autouse=True)
def setup() -> Iterator[None]:
    """Wraps every test to ensure a clean database before and after each test."""
    init_db()
    engine = create_local_engine()
    metadata_obj = MetaData()
    metadata_obj.drop_all(engine)
    metadata_obj.create_all(engine)

    yield

    metadata_obj.drop_all(engine)

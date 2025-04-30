"""Test functionality related to encouragement."""

import pytest

from backend.database import get_db, Encouragement
from backend.api import schema
import backend.tests.gql as test_gql


@pytest.mark.asyncio
async def test_encouragement() -> None:
    """Test getting encouraging words."""
    db = get_db()
    db.add(Encouragement(quote="Fake Quote One", author="Fake Author One"))
    db.add(Encouragement(quote="Fake Quote Two", author="Fake Author Two"))
    db.commit()

    get_encouragement_result = await schema.execute(test_gql.QUERY_GET_ENCOURAGEMENT)

    assert get_encouragement_result.errors is None
    assert get_encouragement_result.data is not None
    assert get_encouragement_result.data["encouragement"]["quote"] in ["Fake Quote One", "Fake Quote Two"]
    assert get_encouragement_result.data["encouragement"]["author"] in ["Fake Author One", "Fake Author Two"]

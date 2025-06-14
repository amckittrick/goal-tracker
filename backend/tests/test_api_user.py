"""Test functionality related to User."""

import pytest

from backend.api import schema
import backend.tests.gql as test_gql


@pytest.mark.asyncio
async def test_create_user_nominal() -> None:
    """Test nominal creation of a user."""
    create_user_result = await schema.execute(
        test_gql.MUTATION_CREATE_USER, variable_values={"email": "fake.user@fake.com", "fullname": "Fake User"}
    )
    assert create_user_result.errors is None
    assert create_user_result.data is not None
    assert create_user_result.data["createUser"] == {"id": 1, "email": "fake.user@fake.com", "fullname": "Fake User"}

    get_user_result = await schema.execute(test_gql.QUERY_GET_USER)
    assert get_user_result.errors is None
    assert get_user_result.data is not None
    assert get_user_result.data["user"] == {
        "id": 1,
        "email": "fake.user@fake.com",
        "fullname": "Fake User",
        "goals": [],
    }

    query_get_users = """
    query getUsers {
        users {
            id
            email
            fullname
            goals {
                id
                name
            }
        }
    }
    """
    get_users_result = await schema.execute(query_get_users)
    assert get_users_result.errors is None
    assert get_users_result.data is not None
    assert get_users_result.data["users"] == [
        {
            "id": 1,
            "email": "fake.user@fake.com",
            "fullname": "Fake User",
            "goals": [],
        },
    ]

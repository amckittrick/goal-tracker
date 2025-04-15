"""Test functionality related to User."""

import pytest

from backend.api import schema


QUERY_GET_USER = """
    query getUser($name: String!) {
        user(name: $name) {
            id
            name
            fullname
            goals {
                id
                name
            }
        }
    }
"""

MUTATION_CREATE_USER = """
    mutation createUser($name: String!, $fullname: String!) {
        createUser(name: $name, fullname: $fullname) {
            id
            name
            fullname
        }
    }
"""


@pytest.mark.asyncio
async def test_create_user_nominal() -> None:
    """Test nominal creation of a user."""
    create_user_result = await schema.execute(
        MUTATION_CREATE_USER, variable_values={"name": "fake-user", "fullname": "Fake User"}
    )
    assert create_user_result.errors is None
    assert create_user_result.data is not None
    assert create_user_result.data["createUser"] == {"id": 1, "name": "fake-user", "fullname": "Fake User"}

    get_user_result = await schema.execute(QUERY_GET_USER, variable_values={"name": "fake-user"})
    assert get_user_result.errors is None
    assert get_user_result.data is not None
    assert get_user_result.data["user"] == {
        "id": 1,
        "name": "fake-user",
        "fullname": "Fake User",
        "goals": [],
    }

    query_get_users = """
    query getUsers {
        users {
            id
            name
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
            "name": "fake-user",
            "fullname": "Fake User",
            "goals": [],
        },
    ]

"""Test that schema."""

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

MUTATION_CREATE_GOAL_FREQUENCY = """
    mutation createGoalFrequency($name: String!, $numberOfDays: Int!) {
        createGoalFrequency(name: $name, numberOfDays: $numberOfDays) {
            id
            name
            numberOfDays
        }
    }
"""

MUTATION_CREATE_GOAL = """
    mutation createGoal($name: String!, $frequencyName: String!, $username: String!) {
        createGoal(name: $name, frequencyName: $frequencyName, username: $username) {
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

MUTATION_CREATE_OR_UPDATE_ACTIVITY = """
    mutation createOrUpdateActivity($username: String!, $goalName: String!, $completed: DateTime!, $count: Int!) {
        createOrUpdateActivity(username: $username, goalName: $goalName, completed: $completed, count: $count) {
            id
            name
            activities {
                completed
                count
            }
        }
    }
"""

MUTATION_ADD_GOAL_TO_USER = """
    mutation addGoalToUser($ownerUsername: String!, $additionalUsername: String!, $goalName: String!) {
        addGoalToUser(ownerUsername: $ownerUsername, additionalUsername: $additionalUsername, goalName: $goalName) {
            id
            name
            fullname
        }
    }
"""


MUTATION_DELETE_GOAL = """
    mutation DeleteGoal($goalName: String!, $username: String! ) {
      deleteGoal(name: $goalName, username: $username) {
        id
        name
        goals {
          id
        }
      }
    }
"""


@pytest.mark.asyncio
async def test_lifecycle() -> None:
    """Test the full lifecycle."""
    await schema.execute(MUTATION_CREATE_USER, variable_values={"name": "fake-user-1", "fullname": "Fake User One"})

    await schema.execute(MUTATION_CREATE_USER, variable_values={"name": "fake-user-2", "fullname": "Fake User Two"})

    await schema.execute(MUTATION_CREATE_GOAL_FREQUENCY, variable_values={"name": "Daily", "numberOfDays": 1})

    mutation_add_goal_result = await schema.execute(
        MUTATION_CREATE_GOAL,
        variable_values={
            "name": "Fake Goal",
            "frequencyName": "Daily",
            "username": "fake-user-1",
        },
    )

    assert mutation_add_goal_result.errors is None
    assert mutation_add_goal_result.data is not None
    assert mutation_add_goal_result.data["createGoal"] == {
        "name": "fake-user-1",
        "fullname": "Fake User One",
        "id": 1,
        "goals": [
            {
                "id": 1,
                "name": "Fake Goal",
            }
        ],
    }

    mutation_add_activity_result = await schema.execute(
        MUTATION_CREATE_OR_UPDATE_ACTIVITY,
        variable_values={
            "username": "fake-user-1",
            "goalName": "Fake Goal",
            "completed": "1970-01-01T00:00:00Z",
            "count": 1,
        },
    )

    assert mutation_add_activity_result.errors is None
    assert mutation_add_activity_result.data is not None
    assert mutation_add_activity_result.data["createOrUpdateActivity"] == {
        "id": 1,
        "name": "Fake Goal",
        "activities": [
            {
                "completed": "1970-01-01T00:00:00",
                "count": 1,
            }
        ],
    }

    await schema.execute(
        MUTATION_ADD_GOAL_TO_USER,
        variable_values={"ownerUsername": "fake-user-1", "additionalUsername": "fake-user-2", "goalName": "Fake Goal"},
    )

    query_get_user_result = await schema.execute(QUERY_GET_USER, variable_values={"name": "fake-user-2"})

    assert query_get_user_result.errors is None
    assert query_get_user_result.data is not None
    assert query_get_user_result.data["user"] == {
        "name": "fake-user-2",
        "fullname": "Fake User Two",
        "id": 2,
        "goals": [
            {
                "id": 1,
                "name": "Fake Goal",
            }
        ],
    }

    mutation_delete_goal_response = await schema.execute(
        MUTATION_DELETE_GOAL, variable_values={"goalName": "Fake Goal", "username": "fake-user-1"}
    )
    assert mutation_delete_goal_response.errors is None

    query_get_user_result = await schema.execute(QUERY_GET_USER, variable_values={"name": "fake-user-2"})

    assert query_get_user_result.errors is None
    assert query_get_user_result.data is not None
    assert query_get_user_result.data["user"] == {
        "name": "fake-user-2",
        "fullname": "Fake User Two",
        "id": 2,
        "goals": [],
    }


@pytest.mark.asyncio
async def test_rename_goal() -> None:
    """Test renaming a goal."""
    await schema.execute(MUTATION_CREATE_USER, variable_values={"name": "fake-user", "fullname": "Fake User"})
    await schema.execute(MUTATION_CREATE_GOAL_FREQUENCY, variable_values={"name": "Daily", "numberOfDays": 1})

    await schema.execute(
        MUTATION_CREATE_GOAL,
        variable_values={
            "name": "Fake Goal",
            "frequencyName": "Daily",
            "username": "fake-user",
        },
    )

    mutation_rename_goal = """
    mutation renameGoal($currentGoalName: String!, $newGoalName: String!, $username: String!) {
        renameGoal(currentGoalName: $currentGoalName, newGoalName: $newGoalName, username: $username) {
            name
            activities {
                completed
            }
        }
    }
    """

    mutation_rename_goal_result = await schema.execute(
        mutation_rename_goal,
        variable_values={
            "currentGoalName": "Fake Goal",
            "newGoalName": "Fake Goal With A New Name",
            "username": "fake-user",
        },
    )
    assert mutation_rename_goal_result.errors is None
    assert mutation_rename_goal_result.data is not None
    assert mutation_rename_goal_result.data["renameGoal"] == {
        "name": "Fake Goal With A New Name",
        "activities": [],
    }

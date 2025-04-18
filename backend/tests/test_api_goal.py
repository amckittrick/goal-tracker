"""Test functionality related to Goal."""

import pytest

from backend.api import schema
from backend.tests.test_api_user import MUTATION_CREATE_USER, QUERY_GET_USER
from backend.tests.test_api_goal_frequency import MUTATION_CREATE_GOAL_FREQUENCY


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

MUTATION_RENAME_GOAL = """
mutation renameGoal($currentGoalName: String!, $newGoalName: String!, $username: String!) {
    renameGoal(currentGoalName: $currentGoalName, newGoalName: $newGoalName, username: $username) {
        name
        activities {
            completedYear
            completedMonth
            completedDay
        }
    }
}
"""

MUTATION_ADD_GOAL_TO_USER = """
    mutation addGoalToUser($ownerUsername: String!, $additionalUsername: String!, $goalName: String!) {
        addGoalToUser(ownerUsername: $ownerUsername, additionalUsername: $additionalUsername, goalName: $goalName) {
            name
            goals {
                name
            }
        }
    }
"""


@pytest.mark.asyncio
async def test_goal_lifecycle() -> None:
    """Test renaming a goal."""
    await schema.execute(MUTATION_CREATE_USER, variable_values={"name": "fake-user", "fullname": "Fake User"})
    await schema.execute(MUTATION_CREATE_GOAL_FREQUENCY, variable_values={"name": "Daily", "numberOfDays": 1})

    ##### Create a goal and verify it exists
    create_goal_result = await schema.execute(
        MUTATION_CREATE_GOAL,
        variable_values={
            "name": "Fake Goal",
            "frequencyName": "Daily",
            "username": "fake-user",
        },
    )
    assert create_goal_result.errors is None
    assert create_goal_result.data is not None
    assert create_goal_result.data["createGoal"] == {
        "id": 1,
        "name": "fake-user",
        "fullname": "Fake User",
        "goals": [
            {
                "id": 1,
                "name": "Fake Goal",
            },
        ],
    }

    ##### Rename that goal and verify everything stays the same except for it's name
    mutation_rename_goal_result = await schema.execute(
        MUTATION_RENAME_GOAL,
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

    ##### Now delete that goal
    mutation_delete_goal_response = await schema.execute(
        MUTATION_DELETE_GOAL, variable_values={"goalName": "Fake Goal With A New Name", "username": "fake-user"}
    )
    assert mutation_delete_goal_response.errors is None
    assert mutation_delete_goal_response.data is not None
    assert mutation_delete_goal_response.data["deleteGoal"] == {
        "id": 1,
        "name": "fake-user",
        "goals": [],
    }


@pytest.mark.asyncio
async def test_create_goal_no_user() -> None:
    """Test an exception is raised when attempting to create a goal for a user that does not exist."""
    create_goal_result = await schema.execute(
        MUTATION_CREATE_GOAL,
        variable_values={
            "name": "Fake Goal",
            "frequencyName": "Daily",
            "username": "fake-user",
        },
    )
    assert create_goal_result.errors is not None
    assert create_goal_result.errors[0].message == "No row was found when one was required"


@pytest.mark.asyncio
async def test_create_goal_no_goal_frequency() -> None:
    """Test an exception is raised when attempting to create a goal for a frequency that does not exist."""
    await schema.execute(MUTATION_CREATE_USER, variable_values={"name": "fake-user", "fullname": "Fake User"})
    create_goal_result = await schema.execute(
        MUTATION_CREATE_GOAL,
        variable_values={
            "name": "Fake Goal",
            "frequencyName": "Daily",
            "username": "fake-user",
        },
    )
    assert create_goal_result.errors is not None
    assert create_goal_result.errors[0].message == "No row was found when one was required"


@pytest.mark.asyncio
async def test_rename_goal_no_user() -> None:
    """Test an exception is raised when attempting to rename a goal for a user that does not exist."""
    rename_goal_result = await schema.execute(
        MUTATION_RENAME_GOAL,
        variable_values={
            "currentGoalName": "Fake Goal",
            "newGoalName": "Fake Goal With A New Name",
            "username": "fake-user",
        },
    )
    assert rename_goal_result.errors is not None
    assert rename_goal_result.errors[0].message == "No row was found when one was required"


@pytest.mark.asyncio
async def test_rename_goal_no_goal() -> None:
    """Test an exception is raised when attempting to rename a goal that does not exist."""
    await schema.execute(MUTATION_CREATE_USER, variable_values={"name": "fake-user", "fullname": "Fake User"})
    rename_goal_result = await schema.execute(
        MUTATION_RENAME_GOAL,
        variable_values={
            "currentGoalName": "Fake Goal",
            "newGoalName": "Fake Goal With A New Name",
            "username": "fake-user",
        },
    )
    assert rename_goal_result.errors is not None
    assert rename_goal_result.errors[0].message == "No goal found with name 'Fake Goal' for user 'fake-user'"


@pytest.mark.asyncio
async def test_delete_goal_no_user() -> None:
    """Test an exception is raised when attempting to delete a goal for a user that does not exist."""
    delete_goal_result = await schema.execute(
        MUTATION_DELETE_GOAL, variable_values={"goalName": "InvalidName", "username": "fake-user"}
    )
    assert delete_goal_result.errors is not None
    assert delete_goal_result.errors[0].message == "No row was found when one was required"


@pytest.mark.asyncio
async def test_delete_goal_not_found() -> None:
    """Test an exception is raised when attempting to delete a goal that does not exist."""
    await schema.execute(MUTATION_CREATE_USER, variable_values={"name": "fake-user", "fullname": "Fake User"})
    delete_goal_result = await schema.execute(
        MUTATION_DELETE_GOAL, variable_values={"goalName": "InvalidName", "username": "fake-user"}
    )
    assert delete_goal_result.errors is not None
    assert (
        delete_goal_result.errors[0].message == "No goal found with name 'InvalidName' on user 'fake-user' to delete."
    )


@pytest.mark.asyncio
async def test_add_goal_to_user_nominal() -> None:
    """Test adding a goal to a user."""
    await schema.execute(MUTATION_CREATE_USER, variable_values={"name": "fake-user-1", "fullname": "Fake User 1"})
    await schema.execute(MUTATION_CREATE_USER, variable_values={"name": "fake-user-2", "fullname": "Fake User 2"})
    await schema.execute(MUTATION_CREATE_GOAL_FREQUENCY, variable_values={"name": "Daily", "numberOfDays": 1})
    await schema.execute(
        MUTATION_CREATE_GOAL,
        variable_values={"name": "Fake Goal", "frequencyName": "Daily", "username": "fake-user-1"},
    )

    add_goal_to_user_result = await schema.execute(
        MUTATION_ADD_GOAL_TO_USER,
        variable_values={"ownerUsername": "fake-user-1", "additionalUsername": "fake-user-2", "goalName": "Fake Goal"},
    )
    assert add_goal_to_user_result.errors is None
    assert add_goal_to_user_result.data is not None
    assert add_goal_to_user_result.data["addGoalToUser"] == {"name": "fake-user-1", "goals": [{"name": "Fake Goal"}]}

    get_user_result = await schema.execute(QUERY_GET_USER, variable_values={"name": "fake-user-2"})

    assert get_user_result.errors is None
    assert get_user_result.data is not None
    assert get_user_result.data["user"] == {
        "name": "fake-user-2",
        "fullname": "Fake User 2",
        "id": 2,
        "goals": [
            {
                "id": 1,
                "name": "Fake Goal",
            }
        ],
    }


@pytest.mark.asyncio
async def test_add_goal_to_user_no_owner() -> None:
    """Test an exception is raised when attempting to add a goal to a user when the original owner does not exist."""
    add_goal_to_user_result = await schema.execute(
        MUTATION_ADD_GOAL_TO_USER,
        variable_values={"ownerUsername": "fake-user-1", "additionalUsername": "fake-user-2", "goalName": "Fake Goal"},
    )
    assert add_goal_to_user_result.errors is not None
    assert add_goal_to_user_result.errors[0].message == "No row was found when one was required"


@pytest.mark.asyncio
async def test_add_goal_to_user_no_additional_user() -> None:
    """Test an exception is raised when attempting to add a goal to a user when the new user does not exist."""
    await schema.execute(MUTATION_CREATE_USER, variable_values={"name": "fake-user-1", "fullname": "Fake User 1"})
    add_goal_to_user_result = await schema.execute(
        MUTATION_ADD_GOAL_TO_USER,
        variable_values={"ownerUsername": "fake-user-1", "additionalUsername": "fake-user-2", "goalName": "Fake Goal"},
    )
    assert add_goal_to_user_result.errors is not None
    assert add_goal_to_user_result.errors[0].message == "No row was found when one was required"


@pytest.mark.asyncio
async def test_add_goal_to_user_no_goal() -> None:
    """Test an exception is raised when attempting to add a goal to a user when the goal is not found."""
    await schema.execute(MUTATION_CREATE_USER, variable_values={"name": "fake-user-1", "fullname": "Fake User 1"})
    await schema.execute(MUTATION_CREATE_USER, variable_values={"name": "fake-user-2", "fullname": "Fake User 2"})
    add_goal_to_user_result = await schema.execute(
        MUTATION_ADD_GOAL_TO_USER,
        variable_values={"ownerUsername": "fake-user-1", "additionalUsername": "fake-user-2", "goalName": "Fake Goal"},
    )
    assert add_goal_to_user_result.errors is not None
    assert add_goal_to_user_result.errors[0].message == "No goal found with name 'Fake Goal' for user 'fake-user-1'"

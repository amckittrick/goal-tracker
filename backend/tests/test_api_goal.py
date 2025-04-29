"""Test functionality related to Goal."""

import pytest

from backend.api import schema, GoalFrequencyType
from backend.tests.test_api_user import MUTATION_CREATE_USER, QUERY_GET_USER


MUTATION_CREATE_GOAL = """
    mutation createGoal(
        $name: String!,
        $ownerEmail: String!,
        $frequency: GoalFrequencyType!,
        $requiredActivitiesPerPeriod: Int!
    ) {
        createGoal(
            name: $name,
            ownerEmail: $ownerEmail,
            frequency: $frequency,
            requiredActivitiesPerPeriod: $requiredActivitiesPerPeriod
        ) {
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

MUTATION_DELETE_GOAL = """
    mutation DeleteGoal($goalName: String!, $ownerEmail: String! ) {
      deleteGoal(name: $goalName, ownerEmail: $ownerEmail) {
        id
        email
        goals {
          id
        }
      }
    }
"""

MUTATION_RENAME_GOAL = """
mutation renameGoal($currentGoalName: String!, $newGoalName: String!, $ownerEmail: String!) {
    renameGoal(currentGoalName: $currentGoalName, newGoalName: $newGoalName, ownerEmail: $ownerEmail) {
        name
    }
}
"""

MUTATION_ADD_GOAL_TO_USER = """
    mutation addGoalToUser($ownerEmail: String!, $additionalUserEmail: String!, $goalName: String!) {
        addGoalToUser(ownerEmail: $ownerEmail, additionalUserEmail: $additionalUserEmail, goalName: $goalName) {
            email
            goals {
                name
            }
        }
    }
"""


@pytest.mark.asyncio
async def test_goal_lifecycle() -> None:
    """Test renaming a goal."""
    await schema.execute(MUTATION_CREATE_USER, variable_values={"email": "fake.user@fake.com", "fullname": "Fake User"})

    ##### Create a goal and verify it exists
    create_goal_result = await schema.execute(
        MUTATION_CREATE_GOAL,
        variable_values={
            "name": "Fake Goal",
            "ownerEmail": "fake.user@fake.com",
            "frequency": GoalFrequencyType.DAILY.name,
            "requiredActivitiesPerPeriod": 1,
        },
    )
    assert create_goal_result.errors is None
    assert create_goal_result.data is not None
    assert create_goal_result.data["createGoal"] == {
        "id": 1,
        "email": "fake.user@fake.com",
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
            "ownerEmail": "fake.user@fake.com",
        },
    )
    assert mutation_rename_goal_result.errors is None
    assert mutation_rename_goal_result.data is not None
    assert mutation_rename_goal_result.data["renameGoal"] == {"name": "Fake Goal With A New Name"}

    ##### Now delete that goal
    mutation_delete_goal_response = await schema.execute(
        MUTATION_DELETE_GOAL,
        variable_values={"goalName": "Fake Goal With A New Name", "ownerEmail": "fake.user@fake.com"},
    )
    assert mutation_delete_goal_response.errors is None
    assert mutation_delete_goal_response.data is not None
    assert mutation_delete_goal_response.data["deleteGoal"] == {
        "id": 1,
        "email": "fake.user@fake.com",
        "goals": [],
    }


@pytest.mark.asyncio
async def test_create_goal_no_user() -> None:
    """Test an exception is raised when attempting to create a goal for a user that does not exist."""
    create_goal_result = await schema.execute(
        MUTATION_CREATE_GOAL,
        variable_values={
            "name": "Fake Goal",
            "ownerEmail": "fake.user@fake.com",
            "frequency": GoalFrequencyType.DAILY.name,
            "requiredActivitiesPerPeriod": 1,
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
            "ownerEmail": "fake.user@fake.com",
        },
    )
    assert rename_goal_result.errors is not None
    assert rename_goal_result.errors[0].message == "No row was found when one was required"


@pytest.mark.asyncio
async def test_rename_goal_no_goal() -> None:
    """Test an exception is raised when attempting to rename a goal that does not exist."""
    await schema.execute(MUTATION_CREATE_USER, variable_values={"email": "fake.user@fake.com", "fullname": "Fake User"})
    rename_goal_result = await schema.execute(
        MUTATION_RENAME_GOAL,
        variable_values={
            "currentGoalName": "Fake Goal",
            "newGoalName": "Fake Goal With A New Name",
            "ownerEmail": "fake.user@fake.com",
        },
    )
    assert rename_goal_result.errors is not None
    assert rename_goal_result.errors[0].message == "No goal found with name 'Fake Goal' for user 'fake.user@fake.com'"


@pytest.mark.asyncio
async def test_delete_goal_no_user() -> None:
    """Test an exception is raised when attempting to delete a goal for a user that does not exist."""
    delete_goal_result = await schema.execute(
        MUTATION_DELETE_GOAL, variable_values={"goalName": "InvalidName", "ownerEmail": "fake.user@fake.com"}
    )
    assert delete_goal_result.errors is not None
    assert delete_goal_result.errors[0].message == "No row was found when one was required"


@pytest.mark.asyncio
async def test_delete_goal_not_found() -> None:
    """Test an exception is raised when attempting to delete a goal that does not exist."""
    await schema.execute(MUTATION_CREATE_USER, variable_values={"email": "fake.user@fake.com", "fullname": "Fake User"})
    delete_goal_result = await schema.execute(
        MUTATION_DELETE_GOAL, variable_values={"goalName": "InvalidName", "ownerEmail": "fake.user@fake.com"}
    )
    assert delete_goal_result.errors is not None
    assert (
        delete_goal_result.errors[0].message
        == "No goal found with name 'InvalidName' on user 'fake.user@fake.com' to delete."
    )


@pytest.mark.asyncio
async def test_add_goal_to_user_nominal() -> None:
    """Test adding a goal to a user."""
    await schema.execute(
        MUTATION_CREATE_USER, variable_values={"email": "fake.user.1@fake.com", "fullname": "Fake User 1"}
    )
    await schema.execute(
        MUTATION_CREATE_USER, variable_values={"email": "fake.user.2@fake.com", "fullname": "Fake User 2"}
    )
    await schema.execute(
        MUTATION_CREATE_GOAL,
        variable_values={
            "name": "Fake Goal",
            "ownerEmail": "fake.user.1@fake.com",
            "frequency": GoalFrequencyType.DAILY.name,
            "requiredActivitiesPerPeriod": 1,
        },
    )

    add_goal_to_user_result = await schema.execute(
        MUTATION_ADD_GOAL_TO_USER,
        variable_values={
            "ownerEmail": "fake.user.1@fake.com",
            "additionalUserEmail": "fake.user.2@fake.com",
            "goalName": "Fake Goal",
        },
    )
    assert add_goal_to_user_result.errors is None
    assert add_goal_to_user_result.data is not None
    assert add_goal_to_user_result.data["addGoalToUser"] == {
        "email": "fake.user.1@fake.com",
        "goals": [{"name": "Fake Goal"}],
    }

    get_user_result = await schema.execute(QUERY_GET_USER, variable_values={"email": "fake.user.2@fake.com"})

    assert get_user_result.errors is None
    assert get_user_result.data is not None
    assert get_user_result.data["user"] == {
        "email": "fake.user.2@fake.com",
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
        variable_values={
            "ownerEmail": "fake.user.1@fake.com",
            "additionalUserEmail": "fake.user.2@fake.com",
            "goalName": "Fake Goal",
        },
    )
    assert add_goal_to_user_result.errors is not None
    assert add_goal_to_user_result.errors[0].message == "No row was found when one was required"


@pytest.mark.asyncio
async def test_add_goal_to_user_no_additional_user() -> None:
    """Test an exception is raised when attempting to add a goal to a user when the new user does not exist."""
    await schema.execute(
        MUTATION_CREATE_USER, variable_values={"email": "fake.user.1@fake.com", "fullname": "Fake User 1"}
    )
    add_goal_to_user_result = await schema.execute(
        MUTATION_ADD_GOAL_TO_USER,
        variable_values={
            "ownerEmail": "fake.user.1@fake.com",
            "additionalUserEmail": "fake.user.2@fake.com",
            "goalName": "Fake Goal",
        },
    )
    assert add_goal_to_user_result.errors is not None
    assert add_goal_to_user_result.errors[0].message == "No row was found when one was required"


@pytest.mark.asyncio
async def test_add_goal_to_user_no_goal() -> None:
    """Test an exception is raised when attempting to add a goal to a user when the goal is not found."""
    await schema.execute(
        MUTATION_CREATE_USER, variable_values={"email": "fake.user.1@fake.com", "fullname": "Fake User 1"}
    )
    await schema.execute(
        MUTATION_CREATE_USER, variable_values={"email": "fake.user.2@fake.com", "fullname": "Fake User 2"}
    )
    add_goal_to_user_result = await schema.execute(
        MUTATION_ADD_GOAL_TO_USER,
        variable_values={
            "ownerEmail": "fake.user.1@fake.com",
            "additionalUserEmail": "fake.user.2@fake.com",
            "goalName": "Fake Goal",
        },
    )
    assert add_goal_to_user_result.errors is not None
    assert (
        add_goal_to_user_result.errors[0].message
        == "No goal found with name 'Fake Goal' for user 'fake.user.1@fake.com'"
    )

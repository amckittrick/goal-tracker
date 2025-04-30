"""Test functionality related to Goal."""

from unittest.mock import patch

import pytest

from backend.api import schema, GoalFrequencyType
import backend.tests.gql as test_gql


@pytest.mark.asyncio
async def test_goal_lifecycle() -> None:
    """Test renaming a goal."""
    await schema.execute(
        test_gql.MUTATION_CREATE_USER, variable_values={"email": "fake.user@fake.com", "fullname": "Fake User"}
    )

    ##### Create a goal and verify it exists
    create_goal_result = await schema.execute(
        test_gql.MUTATION_CREATE_GOAL,
        variable_values={
            "name": "Fake Goal",
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
        test_gql.MUTATION_RENAME_GOAL,
        variable_values={
            "currentGoalName": "Fake Goal",
            "newGoalName": "Fake Goal With A New Name",
        },
    )
    assert mutation_rename_goal_result.errors is None
    assert mutation_rename_goal_result.data is not None
    assert mutation_rename_goal_result.data["renameGoal"] == {"name": "Fake Goal With A New Name"}

    ##### Now delete that goal
    mutation_delete_goal_response = await schema.execute(
        test_gql.MUTATION_DELETE_GOAL,
        variable_values={"goalName": "Fake Goal With A New Name"},
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
        test_gql.MUTATION_CREATE_GOAL,
        variable_values={
            "name": "Fake Goal",
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
        test_gql.MUTATION_RENAME_GOAL,
        variable_values={
            "currentGoalName": "Fake Goal",
            "newGoalName": "Fake Goal With A New Name",
        },
    )
    assert rename_goal_result.errors is not None
    assert rename_goal_result.errors[0].message == "No row was found when one was required"


@pytest.mark.asyncio
async def test_rename_goal_no_goal() -> None:
    """Test an exception is raised when attempting to rename a goal that does not exist."""
    await schema.execute(
        test_gql.MUTATION_CREATE_USER, variable_values={"email": "fake.user@fake.com", "fullname": "Fake User"}
    )
    rename_goal_result = await schema.execute(
        test_gql.MUTATION_RENAME_GOAL,
        variable_values={
            "currentGoalName": "Fake Goal",
            "newGoalName": "Fake Goal With A New Name",
        },
    )
    assert rename_goal_result.errors is not None
    assert rename_goal_result.errors[0].message == "No goal found with name 'Fake Goal' for current user."


@pytest.mark.asyncio
async def test_delete_goal_no_user() -> None:
    """Test an exception is raised when attempting to delete a goal for a user that does not exist."""
    delete_goal_result = await schema.execute(
        test_gql.MUTATION_DELETE_GOAL, variable_values={"goalName": "InvalidName"}
    )
    assert delete_goal_result.errors is not None
    assert delete_goal_result.errors[0].message == "No row was found when one was required"


@pytest.mark.asyncio
async def test_delete_goal_not_found() -> None:
    """Test an exception is raised when attempting to delete a goal that does not exist."""
    await schema.execute(
        test_gql.MUTATION_CREATE_USER, variable_values={"email": "fake.user@fake.com", "fullname": "Fake User"}
    )
    delete_goal_result = await schema.execute(
        test_gql.MUTATION_DELETE_GOAL, variable_values={"goalName": "InvalidName"}
    )
    assert delete_goal_result.errors is not None
    assert delete_goal_result.errors[0].message == "No goal found with name 'InvalidName' for current user."


@pytest.mark.asyncio
async def test_add_goal_to_user_nominal() -> None:
    """Test adding a goal to a user."""
    await schema.execute(
        test_gql.MUTATION_CREATE_USER, variable_values={"email": "fake.user@fake.com", "fullname": "Fake User 1"}
    )
    await schema.execute(
        test_gql.MUTATION_CREATE_USER, variable_values={"email": "fake.user.2@fake.com", "fullname": "Fake User 2"}
    )
    await schema.execute(
        test_gql.MUTATION_CREATE_GOAL,
        variable_values={
            "name": "Fake Goal",
            "frequency": GoalFrequencyType.DAILY.name,
            "requiredActivitiesPerPeriod": 1,
        },
    )

    add_goal_to_user_result = await schema.execute(
        test_gql.MUTATION_ADD_GOAL_TO_USER,
        variable_values={
            "additionalUserEmail": "fake.user.2@fake.com",
            "goalName": "Fake Goal",
        },
    )
    assert add_goal_to_user_result.errors is None
    assert add_goal_to_user_result.data is not None
    assert add_goal_to_user_result.data["addGoalToUser"] == {
        "email": "fake.user@fake.com",
        "goals": [{"name": "Fake Goal"}],
    }

    with patch("backend.api.get_current_user_email") as mock_get_current_user_email:
        mock_get_current_user_email.return_value = "fake.user.2@fake.com"

        get_user_result = await schema.execute(test_gql.QUERY_GET_USER)
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
        test_gql.MUTATION_ADD_GOAL_TO_USER,
        variable_values={
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
        test_gql.MUTATION_CREATE_USER, variable_values={"email": "fake.user@fake.com", "fullname": "Fake User 1"}
    )
    add_goal_to_user_result = await schema.execute(
        test_gql.MUTATION_ADD_GOAL_TO_USER,
        variable_values={
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
        test_gql.MUTATION_CREATE_USER, variable_values={"email": "fake.user@fake.com", "fullname": "Fake User 1"}
    )
    await schema.execute(
        test_gql.MUTATION_CREATE_USER, variable_values={"email": "fake.user.2@fake.com", "fullname": "Fake User 2"}
    )
    add_goal_to_user_result = await schema.execute(
        test_gql.MUTATION_ADD_GOAL_TO_USER,
        variable_values={
            "additionalUserEmail": "fake.user.2@fake.com",
            "goalName": "Fake Goal",
        },
    )
    assert add_goal_to_user_result.errors is not None
    assert add_goal_to_user_result.errors[0].message == "No goal found with name 'Fake Goal' for current user."

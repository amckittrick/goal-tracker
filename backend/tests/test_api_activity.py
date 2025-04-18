"""Test functionality related to Activity."""

import pytest

from backend.api import schema
from backend.tests.test_api_goal import MUTATION_CREATE_GOAL
from backend.tests.test_api_goal_frequency import MUTATION_CREATE_GOAL_FREQUENCY
from backend.tests.test_api_user import MUTATION_CREATE_USER


MUTATION_CREATE_OR_UPDATE_ACTIVITY = """
    mutation createOrUpdateActivity(
        $ownerEmail: String!,
        $goalName: String!,
        $completedYear: Int!,
        $completedMonth: Int!,
        $completedDay: Int!,
        $count: Int!
    ) {
        createOrUpdateActivity(
            ownerEmail: $ownerEmail,
            goalName: $goalName,
            completedYear: $completedYear,
            completedMonth: $completedMonth,
            completedDay: $completedDay,
            count: $count
        ) {
            id
            name
            activities {
                completedYear
                completedMonth
                completedDay
                count
            }
        }
    }
"""


@pytest.mark.asyncio
async def test_create_activity_nominal() -> None:
    """Test nominal creation of an activity."""
    await schema.execute(MUTATION_CREATE_USER, variable_values={"email": "fake.user@fake.com", "fullname": "Fake User"})
    await schema.execute(
        MUTATION_CREATE_GOAL_FREQUENCY, variable_values={"name": "fake-goal-frequency", "numberOfDays": 1}
    )
    await schema.execute(
        MUTATION_CREATE_GOAL,
        variable_values={
            "name": "fake-goal",
            "frequencyName": "fake-goal-frequency",
            "ownerEmail": "fake.user@fake.com",
        },
    )

    create_activity_result = await schema.execute(
        MUTATION_CREATE_OR_UPDATE_ACTIVITY,
        variable_values={
            "ownerEmail": "fake.user@fake.com",
            "goalName": "fake-goal",
            "completedYear": 1970,
            "completedMonth": 1,
            "completedDay": 1,
            "count": 1,
        },
    )
    assert create_activity_result.errors is None
    assert create_activity_result.data is not None
    assert create_activity_result.data["createOrUpdateActivity"] == {
        "id": 1,
        "name": "fake-goal",
        "activities": [
            {
                "completedYear": 1970,
                "completedMonth": 1,
                "completedDay": 1,
                "count": 1,
            }
        ],
    }

    update_activity_result = await schema.execute(
        MUTATION_CREATE_OR_UPDATE_ACTIVITY,
        variable_values={
            "ownerEmail": "fake.user@fake.com",
            "goalName": "fake-goal",
            "completedYear": 1970,
            "completedMonth": 1,
            "completedDay": 1,
            "count": 2,
        },
    )
    assert update_activity_result.errors is None
    assert update_activity_result.data is not None
    assert update_activity_result.data["createOrUpdateActivity"] == {
        "id": 1,
        "name": "fake-goal",
        "activities": [
            {
                "completedYear": 1970,
                "completedMonth": 1,
                "completedDay": 1,
                "count": 2,
            }
        ],
    }


@pytest.mark.asyncio
async def test_create_activity_missing_goal() -> None:
    """Test an exception is raised when attempting to add an activity to a goal when the goal is not found."""
    await schema.execute(MUTATION_CREATE_USER, variable_values={"email": "fake.user@fake.com", "fullname": "Fake User"})

    create_activity_result = await schema.execute(
        MUTATION_CREATE_OR_UPDATE_ACTIVITY,
        variable_values={
            "ownerEmail": "fake.user@fake.com",
            "goalName": "fake-goal",
            "completedYear": 1970,
            "completedMonth": 1,
            "completedDay": 1,
            "count": 1,
        },
    )
    assert create_activity_result.errors is not None
    assert (
        create_activity_result.errors[0].message == "No goal found with name 'fake-goal' for user 'fake.user@fake.com'"
    )

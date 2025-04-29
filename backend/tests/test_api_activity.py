"""Test functionality related to Activity."""

from datetime import datetime

import pytest

from backend.api import schema, GoalFrequencyType
from backend.tests.test_api_goal import MUTATION_CREATE_GOAL
from backend.tests.test_api_user import MUTATION_CREATE_USER


MUTATION_CREATE_OR_UPDATE_ACTIVITY = """
    mutation createOrUpdateActivity(
        $ownerEmail: String!,
        $goalName: String!,
        $dateOfActivity: DateTime!,
        $count: Int!
    ) {
        createOrUpdateActivity(
            ownerEmail: $ownerEmail,
            goalName: $goalName,
            dateOfActivity: $dateOfActivity,
            count: $count
        ) {
            id
            name
            dailyActivities {
                year
                month
                day
                count
            }
            weeklyActivities {
                year
                month
                week
                count
            }
            yearlyActivities {
                year
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
        MUTATION_CREATE_GOAL,
        variable_values={
            "name": "fake-goal",
            "ownerEmail": "fake.user@fake.com",
            "frequency": GoalFrequencyType.DAILY.name,
            "requiredActivitiesPerPeriod": 1,
        },
    )

    create_activity_result = await schema.execute(
        MUTATION_CREATE_OR_UPDATE_ACTIVITY,
        variable_values={
            "ownerEmail": "fake.user@fake.com",
            "goalName": "fake-goal",
            "dateOfActivity": datetime(1970, 1, 1).isoformat(),
            "count": 1,
        },
    )
    assert create_activity_result.errors is None
    assert create_activity_result.data is not None
    assert create_activity_result.data["createOrUpdateActivity"] == {
        "id": 1,
        "name": "fake-goal",
        "dailyActivities": [
            {
                "year": 1970,
                "month": 1,
                "day": 1,
                "count": 1,
            }
        ],
        "weeklyActivities": [],
        "yearlyActivities": [],
    }

    update_activity_result = await schema.execute(
        MUTATION_CREATE_OR_UPDATE_ACTIVITY,
        variable_values={
            "ownerEmail": "fake.user@fake.com",
            "goalName": "fake-goal",
            "dateOfActivity": datetime(1970, 1, 1).isoformat(),
            "count": 2,
        },
    )
    assert update_activity_result.errors is None
    assert update_activity_result.data is not None
    assert update_activity_result.data["createOrUpdateActivity"] == {
        "id": 1,
        "name": "fake-goal",
        "dailyActivities": [
            {
                "year": 1970,
                "month": 1,
                "day": 1,
                "count": 2,
            }
        ],
        "weeklyActivities": [],
        "yearlyActivities": [],
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
            "dateOfActivity": datetime(1970, 1, 1).isoformat(),
            "count": 1,
        },
    )
    assert create_activity_result.errors is not None
    assert (
        create_activity_result.errors[0].message == "No goal found with name 'fake-goal' for user 'fake.user@fake.com'"
    )

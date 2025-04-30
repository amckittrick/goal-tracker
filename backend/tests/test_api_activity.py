"""Test functionality related to Activity."""

from datetime import datetime

import pytest

from backend.api import schema, GoalFrequencyType
import backend.tests.gql as test_gql


@pytest.mark.asyncio
async def test_create_daily_activity_nominal() -> None:
    """Test nominal creation of a daily activity."""
    await schema.execute(
        test_gql.MUTATION_CREATE_USER, variable_values={"email": "fake.user@fake.com", "fullname": "Fake User"}
    )

    await schema.execute(
        test_gql.MUTATION_CREATE_GOAL,
        variable_values={
            "name": "fake-goal",
            "frequency": GoalFrequencyType.DAILY.name,
            "requiredActivitiesPerPeriod": 1,
        },
    )

    create_activity_result = await schema.execute(
        test_gql.MUTATION_CREATE_OR_UPDATE_ACTIVITY,
        variable_values={
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
        test_gql.MUTATION_CREATE_OR_UPDATE_ACTIVITY,
        variable_values={
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
async def test_create_weekly_activity_nominal() -> None:
    """Test nominal creation of a weekly activity."""
    await schema.execute(
        test_gql.MUTATION_CREATE_USER, variable_values={"email": "fake.user@fake.com", "fullname": "Fake User"}
    )

    await schema.execute(
        test_gql.MUTATION_CREATE_GOAL,
        variable_values={
            "name": "fake-goal",
            "frequency": GoalFrequencyType.WEEKLY.name,
            "requiredActivitiesPerPeriod": 1,
        },
    )

    create_activity_result = await schema.execute(
        test_gql.MUTATION_CREATE_OR_UPDATE_ACTIVITY,
        variable_values={
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
        "dailyActivities": [],
        "weeklyActivities": [
            {
                "year": 1970,
                "month": 1,
                "week": 1,
                "count": 1,
            }
        ],
        "yearlyActivities": [],
    }

    update_activity_result = await schema.execute(
        test_gql.MUTATION_CREATE_OR_UPDATE_ACTIVITY,
        variable_values={
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
        "dailyActivities": [],
        "weeklyActivities": [
            {
                "year": 1970,
                "month": 1,
                "week": 1,
                "count": 2,
            }
        ],
        "yearlyActivities": [],
    }


@pytest.mark.asyncio
async def test_create_yearly_activity_nominal() -> None:
    """Test nominal creation of a yearly activity."""
    await schema.execute(
        test_gql.MUTATION_CREATE_USER, variable_values={"email": "fake.user@fake.com", "fullname": "Fake User"}
    )

    await schema.execute(
        test_gql.MUTATION_CREATE_GOAL,
        variable_values={
            "name": "fake-goal",
            "frequency": GoalFrequencyType.YEARLY.name,
            "requiredActivitiesPerPeriod": 1,
        },
    )

    create_activity_result = await schema.execute(
        test_gql.MUTATION_CREATE_OR_UPDATE_ACTIVITY,
        variable_values={
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
        "dailyActivities": [],
        "weeklyActivities": [],
        "yearlyActivities": [
            {
                "year": 1970,
                "count": 1,
            }
        ],
    }

    update_activity_result = await schema.execute(
        test_gql.MUTATION_CREATE_OR_UPDATE_ACTIVITY,
        variable_values={
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
        "dailyActivities": [],
        "weeklyActivities": [],
        "yearlyActivities": [
            {
                "year": 1970,
                "count": 2,
            }
        ],
    }


@pytest.mark.asyncio
async def test_create_activity_missing_goal() -> None:
    """Test an exception is raised when attempting to add an activity to a goal when the goal is not found."""
    await schema.execute(
        test_gql.MUTATION_CREATE_USER, variable_values={"email": "fake.user@fake.com", "fullname": "Fake User"}
    )

    create_activity_result = await schema.execute(
        test_gql.MUTATION_CREATE_OR_UPDATE_ACTIVITY,
        variable_values={
            "ownerEmail": "fake.user@fake.com",
            "goalName": "fake-goal",
            "dateOfActivity": datetime(1970, 1, 1).isoformat(),
            "count": 1,
        },
    )
    assert create_activity_result.errors is not None
    assert create_activity_result.errors[0].message == "No goal found with name 'fake-goal' for current user."

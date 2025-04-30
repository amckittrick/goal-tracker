"""Test functionality related to UserStatus for a Yearly Goal."""

from datetime import datetime, timedelta, timezone

import pytest

from backend.api import ActivityStatus, DisplayDuration, GoalFrequencyType, schema
import backend.tests.gql as test_gql


async def setup_yearly_goals() -> None:
    """Setup yearly goals."""
    await schema.execute(
        test_gql.MUTATION_CREATE_USER, variable_values={"email": "fake.user@fake.com", "fullname": "Fake User"}
    )
    await schema.execute(
        test_gql.MUTATION_CREATE_GOAL,
        variable_values={
            "name": "Fake Once Per Year Goal",
            "frequency": GoalFrequencyType.YEARLY.name,
            "requiredActivitiesPerPeriod": 1,
        },
    )
    await schema.execute(
        test_gql.MUTATION_CREATE_GOAL,
        variable_values={
            "name": "Fake Twice Per Year Goal",
            "frequency": GoalFrequencyType.YEARLY.name,
            "requiredActivitiesPerPeriod": 2,
        },
    )


async def setup_yearly_goal_activity(date_string: str) -> None:
    """Setup activities for yearly goals."""
    await schema.execute(
        test_gql.MUTATION_CREATE_OR_UPDATE_ACTIVITY,
        variable_values={
            "goalName": "Fake Once Per Year Goal",
            "dateOfActivity": date_string,
            "count": 1,
        },
    )
    await schema.execute(
        test_gql.MUTATION_CREATE_OR_UPDATE_ACTIVITY,
        variable_values={
            "goalName": "Fake Twice Per Year Goal",
            "dateOfActivity": date_string,
            "count": 1,
        },
    )


@pytest.mark.asyncio
async def test_get_user_status_yearly_goal_day_unachieved() -> None:
    """Test getting the status for a user with yearly goals for a single day that is unachieved."""
    await setup_yearly_goals()

    single_day_date_strings = [
        (datetime.now(tz=timezone.utc) - timedelta(days=370)).isoformat(),
        (datetime.now(tz=timezone.utc) + timedelta(days=370)).isoformat(),
    ]

    single_day_expected_statuses = [ActivityStatus.UNACHIEVED_PAST.name, ActivityStatus.UNACHIEVED_TODAY_OR_FUTURE.name]

    for date_string, expected_status in zip(single_day_date_strings, single_day_expected_statuses):

        get_user_status = await schema.execute(
            test_gql.QUERY_GET_USER_STATUS,
            variable_values={"duration": DisplayDuration.DAY.name, "dateToCheck": date_string},
        )
        assert get_user_status.errors is None
        assert get_user_status.data is not None
        assert get_user_status.data["userStatus"] == [
            {
                "name": "Fake Once Per Year Goal",
                "frequency": GoalFrequencyType.YEARLY.name,
                "dates": [date_string],
                "statuses": [[expected_status]],
            },
            {
                "name": "Fake Twice Per Year Goal",
                "frequency": GoalFrequencyType.YEARLY.name,
                "dates": [date_string],
                "statuses": [[expected_status, expected_status]],
            },
        ]


@pytest.mark.asyncio
async def test_get_user_status_yearly_goal_day_achieved() -> None:
    """Test getting the status for a user with yearly goals for a single day that is achieved."""
    await setup_yearly_goals()
    today = datetime.now(tz=timezone.utc).isoformat()
    await setup_yearly_goal_activity(today)

    get_user_status = await schema.execute(
        test_gql.QUERY_GET_USER_STATUS,
        variable_values={"duration": DisplayDuration.DAY.name, "dateToCheck": today},
    )
    assert get_user_status.errors is None
    assert get_user_status.data is not None
    assert get_user_status.data["userStatus"] == [
        {
            "name": "Fake Once Per Year Goal",
            "frequency": GoalFrequencyType.YEARLY.name,
            "dates": [today],
            "statuses": [[ActivityStatus.ACHIEVED.name]],
        },
        {
            "name": "Fake Twice Per Year Goal",
            "frequency": GoalFrequencyType.YEARLY.name,
            "dates": [today],
            "statuses": [[ActivityStatus.ACHIEVED.name, ActivityStatus.UNACHIEVED_TODAY_OR_FUTURE.name]],
        },
    ]


@pytest.mark.asyncio
async def test_get_user_status_yearly_goal_three_day_unachieved() -> None:
    """Test getting the status for a user with yearly goals for three days that are unachieved."""
    await setup_yearly_goals()

    today = datetime.now(tz=timezone.utc)
    today_s = today.isoformat()

    get_user_status = await schema.execute(
        test_gql.QUERY_GET_USER_STATUS,
        variable_values={"duration": DisplayDuration.THREE_DAY.name, "dateToCheck": today_s},
    )
    assert get_user_status.errors is None
    assert get_user_status.data is not None
    assert get_user_status.data["userStatus"] == [
        {
            "name": "Fake Once Per Year Goal",
            "frequency": GoalFrequencyType.YEARLY.name,
            "dates": [today_s],
            "statuses": [[ActivityStatus.UNACHIEVED_TODAY_OR_FUTURE.name]],
        },
        {
            "name": "Fake Twice Per Year Goal",
            "frequency": GoalFrequencyType.YEARLY.name,
            "dates": [today_s],
            "statuses": [
                [ActivityStatus.UNACHIEVED_TODAY_OR_FUTURE.name, ActivityStatus.UNACHIEVED_TODAY_OR_FUTURE.name],
            ],
        },
    ]


@pytest.mark.asyncio
async def test_get_user_status_yearly_goal_three_day_achieved() -> None:
    """Test getting the status for a user with yearly goals for three days that are achieved."""
    await setup_yearly_goals()

    today = datetime.now(tz=timezone.utc)
    today_s = today.isoformat()

    await setup_yearly_goal_activity(today_s)

    get_user_status = await schema.execute(
        test_gql.QUERY_GET_USER_STATUS,
        variable_values={"duration": DisplayDuration.THREE_DAY.name, "dateToCheck": today_s},
    )
    assert get_user_status.errors is None
    assert get_user_status.data is not None
    assert get_user_status.data["userStatus"] == [
        {
            "name": "Fake Once Per Year Goal",
            "frequency": GoalFrequencyType.YEARLY.name,
            "dates": [today_s],
            "statuses": [[ActivityStatus.ACHIEVED.name]],
        },
        {
            "name": "Fake Twice Per Year Goal",
            "frequency": GoalFrequencyType.YEARLY.name,
            "dates": [today_s],
            "statuses": [
                [ActivityStatus.ACHIEVED.name, ActivityStatus.UNACHIEVED_TODAY_OR_FUTURE.name],
            ],
        },
    ]


@pytest.mark.asyncio
async def test_get_user_status_yearly_goal_month_unachieved() -> None:
    """Test getting the status for a user with yearly goals for a month that are unachieved."""
    await setup_yearly_goals()

    today = datetime.now(tz=timezone.utc)
    today_s = today.isoformat()

    get_user_status = await schema.execute(
        test_gql.QUERY_GET_USER_STATUS,
        variable_values={"duration": DisplayDuration.MONTH.name, "dateToCheck": today_s},
    )
    assert get_user_status.errors is None
    assert get_user_status.data is not None
    assert get_user_status.data["userStatus"] == [
        {
            "name": "Fake Once Per Year Goal",
            "frequency": GoalFrequencyType.YEARLY.name,
            "dates": [today_s],
            "statuses": [[ActivityStatus.UNACHIEVED_TODAY_OR_FUTURE.name]],
        },
        {
            "name": "Fake Twice Per Year Goal",
            "frequency": GoalFrequencyType.YEARLY.name,
            "dates": [today_s],
            "statuses": [
                [ActivityStatus.UNACHIEVED_TODAY_OR_FUTURE.name, ActivityStatus.UNACHIEVED_TODAY_OR_FUTURE.name],
            ],
        },
    ]


@pytest.mark.asyncio
async def test_get_user_status_yearly_goal_month_achieved() -> None:
    """Test getting the status for a user with yearly goals for a month that are achieved."""
    await setup_yearly_goals()

    today = datetime.now(tz=timezone.utc)
    today_s = today.isoformat()

    await setup_yearly_goal_activity(today_s)

    get_user_status = await schema.execute(
        test_gql.QUERY_GET_USER_STATUS,
        variable_values={"duration": DisplayDuration.MONTH.name, "dateToCheck": today_s},
    )
    assert get_user_status.errors is None
    assert get_user_status.data is not None
    assert get_user_status.data["userStatus"] == [
        {
            "name": "Fake Once Per Year Goal",
            "frequency": GoalFrequencyType.YEARLY.name,
            "dates": [today_s],
            "statuses": [[ActivityStatus.ACHIEVED.name]],
        },
        {
            "name": "Fake Twice Per Year Goal",
            "frequency": GoalFrequencyType.YEARLY.name,
            "dates": [today_s],
            "statuses": [
                [ActivityStatus.ACHIEVED.name, ActivityStatus.UNACHIEVED_TODAY_OR_FUTURE.name],
            ],
        },
    ]

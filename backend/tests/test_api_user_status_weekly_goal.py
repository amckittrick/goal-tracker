"""Test functionality related to UserStatus for a Weekly Goal."""

from calendar import Calendar
from datetime import date, datetime, timedelta, timezone
from typing import List

import pytest

from backend.api import ActivityStatus, DisplayDuration, GoalFrequencyType, schema
import backend.tests.gql as test_gql


async def setup_weekly_goals() -> None:
    """Setup weekly goals."""
    await schema.execute(
        test_gql.MUTATION_CREATE_USER, variable_values={"email": "fake.user@fake.com", "fullname": "Fake User"}
    )
    await schema.execute(
        test_gql.MUTATION_CREATE_GOAL,
        variable_values={
            "name": "Fake Once Per Week Goal",
            "frequency": GoalFrequencyType.WEEKLY.name,
            "requiredActivitiesPerPeriod": 1,
        },
    )
    await schema.execute(
        test_gql.MUTATION_CREATE_GOAL,
        variable_values={
            "name": "Fake Twice Per Week Goal",
            "frequency": GoalFrequencyType.WEEKLY.name,
            "requiredActivitiesPerPeriod": 2,
        },
    )


async def setup_weekly_goal_activity(date_string: str) -> None:
    """Setup activities for weekly goals."""
    await schema.execute(
        test_gql.MUTATION_CREATE_OR_UPDATE_ACTIVITY,
        variable_values={
            "goalName": "Fake Once Per Week Goal",
            "dateOfActivity": date_string,
            "count": 1,
        },
    )
    await schema.execute(
        test_gql.MUTATION_CREATE_OR_UPDATE_ACTIVITY,
        variable_values={
            "goalName": "Fake Twice Per Week Goal",
            "dateOfActivity": date_string,
            "count": 1,
        },
    )


@pytest.mark.asyncio
async def test_get_user_status_weekly_goal_day_unachieved() -> None:
    """Test getting the status for a user with weekly goals for a single day that is unachieved."""
    await setup_weekly_goals()

    single_day_date_strings = [
        (datetime.now(tz=timezone.utc) - timedelta(days=8)).isoformat(),
        (datetime.now(tz=timezone.utc) + timedelta(days=8)).isoformat(),
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
                "name": "Fake Once Per Week Goal",
                "frequency": GoalFrequencyType.WEEKLY.name,
                "dates": [date_string],
                "statuses": [[expected_status]],
            },
            {
                "name": "Fake Twice Per Week Goal",
                "frequency": GoalFrequencyType.WEEKLY.name,
                "dates": [date_string],
                "statuses": [[expected_status, expected_status]],
            },
        ]


@pytest.mark.asyncio
async def test_get_user_status_weekly_goal_day_achieved() -> None:
    """Test getting the status for a user with weekly goals for a single day that is achieved."""
    await setup_weekly_goals()
    today = datetime.now(tz=timezone.utc).isoformat()
    await setup_weekly_goal_activity(today)

    get_user_status = await schema.execute(
        test_gql.QUERY_GET_USER_STATUS,
        variable_values={"duration": DisplayDuration.DAY.name, "dateToCheck": today},
    )
    assert get_user_status.errors is None
    assert get_user_status.data is not None
    assert get_user_status.data["userStatus"] == [
        {
            "name": "Fake Once Per Week Goal",
            "frequency": GoalFrequencyType.WEEKLY.name,
            "dates": [today],
            "statuses": [[ActivityStatus.ACHIEVED.name]],
        },
        {
            "name": "Fake Twice Per Week Goal",
            "frequency": GoalFrequencyType.WEEKLY.name,
            "dates": [today],
            "statuses": [[ActivityStatus.ACHIEVED.name, ActivityStatus.UNACHIEVED_TODAY_OR_FUTURE.name]],
        },
    ]


@pytest.mark.asyncio
async def test_get_user_status_weekly_goal_three_day_unachieved() -> None:
    """Test getting the status for a user with weekly goals for three days that are unachieved."""
    await setup_weekly_goals()

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
            "name": "Fake Once Per Week Goal",
            "frequency": GoalFrequencyType.WEEKLY.name,
            "dates": [today_s],
            "statuses": [[ActivityStatus.UNACHIEVED_TODAY_OR_FUTURE.name]],
        },
        {
            "name": "Fake Twice Per Week Goal",
            "frequency": GoalFrequencyType.WEEKLY.name,
            "dates": [today_s],
            "statuses": [
                [ActivityStatus.UNACHIEVED_TODAY_OR_FUTURE.name, ActivityStatus.UNACHIEVED_TODAY_OR_FUTURE.name],
            ],
        },
    ]


@pytest.mark.asyncio
async def test_get_user_status_weekly_goal_three_day_achieved() -> None:
    """Test getting the status for a user with weekly goals for three days that are achieved."""
    await setup_weekly_goals()

    today = datetime.now(tz=timezone.utc)
    today_s = today.isoformat()

    await setup_weekly_goal_activity(today_s)

    get_user_status = await schema.execute(
        test_gql.QUERY_GET_USER_STATUS,
        variable_values={"duration": DisplayDuration.THREE_DAY.name, "dateToCheck": today_s},
    )
    assert get_user_status.errors is None
    assert get_user_status.data is not None
    assert get_user_status.data["userStatus"] == [
        {
            "name": "Fake Once Per Week Goal",
            "frequency": GoalFrequencyType.WEEKLY.name,
            "dates": [today_s],
            "statuses": [[ActivityStatus.ACHIEVED.name]],
        },
        {
            "name": "Fake Twice Per Week Goal",
            "frequency": GoalFrequencyType.WEEKLY.name,
            "dates": [today_s],
            "statuses": [
                [ActivityStatus.ACHIEVED.name, ActivityStatus.UNACHIEVED_TODAY_OR_FUTURE.name],
            ],
        },
    ]


@pytest.mark.asyncio
async def test_get_user_status_weekly_goal_month_unachieved() -> None:
    """Test getting the status for a user with weekly goals for a month that are unachieved."""
    await setup_weekly_goals()

    calendar = Calendar(firstweekday=6)
    today = date.today()
    dates: List[str] = []
    statuses: List[List[str]] = []
    for month_date in calendar.itermonthdates(today.year, today.month):
        if month_date.weekday() == 6:
            month_datetime = datetime(month_date.year, month_date.month, month_date.day)
            dates.append(month_datetime.isoformat())
            if month_date >= today:
                statuses.append([ActivityStatus.UNACHIEVED_TODAY_OR_FUTURE.name])
            else:
                statuses.append([ActivityStatus.UNACHIEVED_PAST.name])

    two_a_day_statuses = [[item, item] for row in statuses for item in row]

    get_user_status = await schema.execute(
        test_gql.QUERY_GET_USER_STATUS,
        variable_values={"duration": DisplayDuration.MONTH.name, "dateToCheck": today.isoformat()},
    )
    assert get_user_status.errors is None
    assert get_user_status.data is not None
    assert get_user_status.data["userStatus"] == [
        {
            "name": "Fake Once Per Week Goal",
            "frequency": GoalFrequencyType.WEEKLY.name,
            "dates": dates,
            "statuses": statuses,
        },
        {
            "name": "Fake Twice Per Week Goal",
            "frequency": GoalFrequencyType.WEEKLY.name,
            "dates": dates,
            "statuses": two_a_day_statuses,
        },
    ]


@pytest.mark.asyncio
async def test_get_user_status_weekly_goal_month_achieved() -> None:
    """Test getting the status for a user with weekly goals for a month that are achieved."""
    await setup_weekly_goals()

    calendar = Calendar(firstweekday=6)
    today = date.today()
    dates: List[str] = []
    once_per_day_statuses: List[List[str]] = []
    twice_per_day_statuses: List[List[str]] = []
    for month_date in calendar.itermonthdates(today.year, today.month):
        if month_date.weekday() == 6:
            month_datetime = datetime(month_date.year, month_date.month, month_date.day)
            dates.append(month_datetime.isoformat())
            await setup_weekly_goal_activity(month_datetime.isoformat())
            once_per_day_statuses.append([ActivityStatus.ACHIEVED.name])
            if month_date >= today:
                twice_per_day_statuses.append(
                    [ActivityStatus.ACHIEVED.name, ActivityStatus.UNACHIEVED_TODAY_OR_FUTURE.name]
                )
            else:
                twice_per_day_statuses.append([ActivityStatus.ACHIEVED.name, ActivityStatus.UNACHIEVED_PAST.name])

    get_user_status = await schema.execute(
        test_gql.QUERY_GET_USER_STATUS,
        variable_values={"duration": DisplayDuration.MONTH.name, "dateToCheck": today.isoformat()},
    )
    assert get_user_status.errors is None
    assert get_user_status.data is not None
    assert get_user_status.data["userStatus"] == [
        {
            "name": "Fake Once Per Week Goal",
            "frequency": GoalFrequencyType.WEEKLY.name,
            "dates": dates,
            "statuses": once_per_day_statuses,
        },
        {
            "name": "Fake Twice Per Week Goal",
            "frequency": GoalFrequencyType.WEEKLY.name,
            "dates": dates,
            "statuses": twice_per_day_statuses,
        },
    ]

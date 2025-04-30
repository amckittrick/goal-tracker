# pylint: disable=too-few-public-methods,too-many-arguments,too-many-positional-arguments
"""Schema used to connect the API to the Database."""

from calendar import Calendar
from dataclasses import field
from datetime import datetime, timedelta
from enum import Enum
import os
from random import randrange
from typing import List, Optional, Union

from graphql.validation import NoSchemaIntrospectionCustomRule
from sqlalchemy.orm import Session
import strawberry
from strawberry import Schema
from strawberry.extensions import AddValidationRules

from backend import GoalTrackerContext
from backend.database import (
    DailyActivity as DailyActivityModel,
    Encouragement as EncouragementModel,
    get_db,
    Goal as GoalModel,
    GoalFrequency as GoalFrequencyModel,
    User as UserModel,
    WeeklyActivity as WeeklyActivityModel,
    YearlyActivity as YearlyActivityModel,
)
from backend.exceptions import InvalidAPIArgumentException
from backend.util import week_of_month, date_before_today


class DisplayDuration(Enum):
    """The duration to display in the UI."""

    DAY = "day"
    THREE_DAY = "three_day"
    MONTH = "month"


class ActivityStatus(Enum):
    """The status of an activity."""

    UNACHIEVED_PAST = "unachieved_past"
    UNACHIEVED_TODAY_OR_FUTURE = "unachieved_today_or_future"
    ACHIEVED = "achieved"


@strawberry.enum
class GoalFrequencyType(Enum):
    """The possible goal frequencies."""

    DAILY = "daily"
    WEEKLY = "weekly"
    YEARLY = "yearly"


@strawberry.type
class GoalStatusType:
    """The status for a given goal."""

    name: str
    frequency: GoalFrequencyType
    dates: List[datetime]
    statuses: List[List[ActivityStatus]] = field(default_factory=list)  # pylint: disable=invalid-field-call


@strawberry.type
class UserType:
    """Maps to a User in the DB."""

    id: int
    email: str
    fullname: str
    goals: List["GoalType"] = field(default_factory=list)  # pylint: disable=invalid-field-call


def convert_user(model: UserModel) -> UserType:
    """Convert a UserModel to a UserType."""
    goal_types = [convert_goal(goal_model) for goal_model in model.goals]
    return UserType(id=model.id, email=model.email, fullname=model.fullname, goals=goal_types)


@strawberry.type
class GoalType:
    """Maps to a Goal in the DB."""

    id: int
    name: str
    frequency: GoalFrequencyType
    daily_activities: List["DailyActivityType"] = field(default_factory=list)  # pylint: disable=invalid-field-call
    weekly_activities: List["WeeklyActivityType"] = field(default_factory=list)  # pylint: disable=invalid-field-call
    yearly_activities: List["YearlyActivityType"] = field(default_factory=list)  # pylint: disable=invalid-field-call
    required_activities_per_period: int


def convert_goal(model: GoalModel) -> GoalType:
    """Convert a GoalModel to a GoalType."""
    daily_activity_types = [convert_daily_activity(activity_model) for activity_model in model.daily_activities]
    weekly_activity_types = [convert_weekly_activity(activity_model) for activity_model in model.weekly_activities]
    yearly_activity_types = [convert_yearly_activity(activity_model) for activity_model in model.yearly_activities]
    return GoalType(
        id=model.id,
        name=model.name,
        frequency=GoalFrequencyType[model.frequency.name],
        daily_activities=daily_activity_types,
        weekly_activities=weekly_activity_types,
        yearly_activities=yearly_activity_types,
        required_activities_per_period=model.required_activities_per_period,
    )


@strawberry.type
class EncouragementType:
    """Provides encouragement to the user."""

    id: int
    quote: str
    author: str


def convert_encouragement(model: EncouragementModel) -> EncouragementType:
    """Convert an EncouragementModel to an EncouragementType."""
    return EncouragementType(id=model.id, quote=model.quote, author=model.author)


@strawberry.type
class DailyActivityType:
    """Maps to an DailyActivity in the DB."""

    id: int
    goal_id: int
    year: int
    month: int
    day: int
    count: int


def convert_daily_activity(model: DailyActivityModel) -> DailyActivityType:
    """Convert a DailyActivityModel to a DailyActivityType."""
    return DailyActivityType(
        id=model.id,
        goal_id=model.goal_id,
        year=model.year,
        month=model.month,
        day=model.day,
        count=model.count,
    )


@strawberry.type
class WeeklyActivityType:
    """Maps to a WeeklyActivity in the DB."""

    id: int
    goal_id: int
    year: int
    month: int
    week: int
    count: int


def convert_weekly_activity(model: WeeklyActivityModel) -> WeeklyActivityType:
    """Convert a WeeklyActivityModel to a WeeklyActivityType."""
    return WeeklyActivityType(
        id=model.id,
        goal_id=model.goal_id,
        year=model.year,
        month=model.month,
        week=model.week,
        count=model.count,
    )


@strawberry.type
class YearlyActivityType:
    """Maps to a YearlyActivity in the DB."""

    id: int
    goal_id: int
    year: int
    count: int


def convert_yearly_activity(model: YearlyActivityModel) -> YearlyActivityType:
    """Convert a WeeklyActivityModel to a YearlyActivityType."""
    return YearlyActivityType(
        id=model.id,
        goal_id=model.goal_id,
        year=model.year,
        count=model.count,
    )


def get_goal(user: UserModel, goal_name: str) -> GoalModel:
    """Get a goal for a user."""
    for goal in user.goals:
        if goal.name == goal_name:
            return goal
    raise InvalidAPIArgumentException(f"No goal found with name '{goal_name}' for current user.")


def get_daily_activity(goal: GoalModel, date_to_check: datetime) -> DailyActivityModel:
    """Get a daily activity on a specified date for a user + goal."""
    for activity in goal.daily_activities:
        if (
            activity.year == date_to_check.year
            and activity.month == date_to_check.month
            and activity.day == date_to_check.day
        ):
            return activity
    raise InvalidAPIArgumentException(
        f"No activity found on '{date_to_check.year}/{date_to_check.month}/{date_to_check.day}' for goal '{goal.name}'"
    )


def get_weekly_activity(goal: GoalModel, date_to_check: datetime) -> WeeklyActivityModel:
    """Get a daily activity on a specified date for a user + goal."""
    for activity in goal.weekly_activities:
        if (
            activity.year == date_to_check.year
            and activity.month == date_to_check.month
            and activity.week == week_of_month(date_to_check)
        ):
            return activity
    raise InvalidAPIArgumentException(
        f"No activity found on '{date_to_check.year}/{date_to_check.month}/{week_of_month(date_to_check)}"
        f" for goal '{goal.name}'"
    )


def get_yearly_activity(goal: GoalModel, date_to_check: datetime) -> YearlyActivityModel:
    """Get a daily activity on a specified date for a user + goal."""
    for activity in goal.yearly_activities:
        if activity.year == date_to_check.year:
            return activity
    raise InvalidAPIArgumentException(f"No activity found on '{date_to_check.year} for goal '{goal.name}'")


def get_goal_status_for_date(goal: GoalModel, date_to_check: datetime) -> List[ActivityStatus]:
    """Given a goal and date, returns the activity status."""
    match goal.frequency:
        case GoalFrequencyModel.DAILY:
            try:
                count = get_daily_activity(goal, date_to_check).count
            except InvalidAPIArgumentException:
                count = 0
        case GoalFrequencyModel.WEEKLY:
            try:
                count = get_weekly_activity(goal, date_to_check).count
            except InvalidAPIArgumentException:
                count = 0
        case GoalFrequencyModel.YEARLY:
            try:
                count = get_yearly_activity(goal, date_to_check).count
            except InvalidAPIArgumentException:
                count = 0
    activity_statuses: List[ActivityStatus] = []
    for idx in range(goal.required_activities_per_period):
        if count > idx:
            activity_statuses.append(ActivityStatus.ACHIEVED)
        elif date_before_today(date_to_check):
            activity_statuses.append(ActivityStatus.UNACHIEVED_PAST)
        else:
            activity_statuses.append(ActivityStatus.UNACHIEVED_TODAY_OR_FUTURE)
    return activity_statuses


def get_current_user_email(info: strawberry.Info[GoalTrackerContext]) -> str:
    """
    Method to get the current users email from GoalTrackerContext.
    Separate method so it can be mocked in testing.
    """
    if info.context.user_email is None:
        raise ValueError("No userEmail found in context. Ensure Bearer token was provided.")
    return info.context.user_email


def get_current_user(db: Session, info: strawberry.Info[GoalTrackerContext]) -> UserModel:
    """
    Get the current User as specified by the token in the header.
    See backend.main.py -> context_getter for where this is set.
    """
    user_email = get_current_user_email(info)
    return db.query(UserModel).where(UserModel.email == user_email).one()


def get_goal_status_day(goal: GoalModel, date_to_check: datetime) -> GoalStatusType:
    """Given goal, calculate it's status for a single day."""
    return GoalStatusType(
        name=goal.name,
        statuses=[get_goal_status_for_date(goal, date_to_check)],
        dates=[date_to_check],
        frequency=GoalFrequencyType[goal.frequency.name],
    )


def get_goal_status_three_day(goal: GoalModel, date_to_check: datetime) -> GoalStatusType:
    """Given goal, calculate it's status for three days."""
    dates: List[datetime] = []
    statuses: List[List[ActivityStatus]] = []
    goal_status = GoalStatusType(
        name=goal.name, frequency=GoalFrequencyType[goal.frequency.name], statuses=[], dates=[]
    )
    match goal.frequency:
        case GoalFrequencyModel.DAILY:
            statuses.append(get_goal_status_for_date(goal, date_to_check))
            dates.append(date_to_check)

            statuses.append(get_goal_status_for_date(goal, date_to_check - timedelta(days=1)))
            dates.append(date_to_check - timedelta(days=1))

            statuses.append(get_goal_status_for_date(goal, date_to_check - timedelta(days=2)))
            dates.append(date_to_check - timedelta(days=2))

            statuses.reverse()
            dates.reverse()

            goal_status.dates = dates
            goal_status.statuses = statuses
        case GoalFrequencyModel.WEEKLY:
            goal_status.statuses = [get_goal_status_for_date(goal, date_to_check)]
            goal_status.dates = [date_to_check]
        case GoalFrequencyModel.YEARLY:
            goal_status.statuses = [get_goal_status_for_date(goal, date_to_check)]
            goal_status.dates = [date_to_check]
    return goal_status


def get_goal_status_month(goal: GoalModel, date_to_check: datetime) -> GoalStatusType:
    """Given goal, calculate it's status for a month."""
    calendar = Calendar(firstweekday=6)
    dates: List[datetime] = []
    statuses: List[List[ActivityStatus]] = []
    goal_status = GoalStatusType(
        name=goal.name, frequency=GoalFrequencyType[goal.frequency.name], statuses=[], dates=[]
    )
    match goal.frequency:
        case GoalFrequencyModel.DAILY:
            for month_date in calendar.itermonthdates(date_to_check.year, date_to_check.month):
                month_datetime = datetime(month_date.year, month_date.month, month_date.day)
                statuses.append(get_goal_status_for_date(goal, month_datetime))
                dates.append(month_datetime)
            goal_status.statuses = statuses
            goal_status.dates = dates
        case GoalFrequencyModel.WEEKLY:
            for week_date in calendar.itermonthdates(date_to_check.year, date_to_check.month):
                if week_date.weekday() == 6:
                    week_datetime = datetime(week_date.year, week_date.month, week_date.day)
                    statuses.append(get_goal_status_for_date(goal, week_datetime))
                    dates.append(week_datetime)
            goal_status.statuses = statuses
            goal_status.dates = dates
        case GoalFrequencyModel.YEARLY:
            goal_status.statuses = [get_goal_status_for_date(goal, date_to_check)]
            goal_status.dates = [date_to_check]

    return goal_status


@strawberry.type
class Query:
    """GraphQL Queries"""

    @strawberry.field
    async def users(self) -> List[UserType]:
        """Return all users."""
        db = get_db()
        users = db.query(UserModel).all()
        return [convert_user(user) for user in users]

    @strawberry.field
    async def user(self, info: strawberry.Info[GoalTrackerContext]) -> UserType:
        """Return a single user."""
        return convert_user(get_current_user(get_db(), info))

    @strawberry.field
    async def encouragement(self) -> EncouragementType:
        """Provides encouragement to the user."""
        db = get_db()
        rand = randrange(0, db.query(EncouragementModel).count())
        return convert_encouragement(db.query(EncouragementModel)[rand])

    @strawberry.field
    async def user_status(  # pylint: disable=too-many-statements, too-many-locals
        self,
        duration: DisplayDuration,
        date_to_check: datetime,
        info: strawberry.Info[GoalTrackerContext],
        goal_name: Optional[str] = None,
    ) -> List[GoalStatusType]:
        """Calculate and return the status for all goals associated with a given user on the provided date."""
        user = get_current_user(get_db(), info)
        goal_statuses = []
        match duration:
            case DisplayDuration.DAY:
                for goal in user.goals:
                    if goal_name is None or goal.name == goal_name:
                        goal_statuses.append(get_goal_status_day(goal, date_to_check))
            case DisplayDuration.THREE_DAY:
                for goal in user.goals:
                    if goal_name is None or goal.name == goal_name:
                        goal_statuses.append(get_goal_status_three_day(goal, date_to_check))
            case DisplayDuration.MONTH:
                for goal in user.goals:
                    if goal_name is None or goal.name == goal_name:
                        goal_statuses.append(get_goal_status_month(goal, date_to_check))
        return goal_statuses


@strawberry.type
class Mutation:
    """GraphQL Mutations"""

    @strawberry.mutation
    async def create_user(self, email: str, fullname: str) -> UserType:
        """Create a new user."""
        db = get_db()
        user = UserModel(email=email, fullname=fullname, goals=[])
        db.add(user)

        db.commit()
        db.refresh(user)
        return convert_user(user)

    @strawberry.mutation
    async def create_goal(
        self,
        name: str,
        frequency: GoalFrequencyType,
        info: strawberry.Info[GoalTrackerContext],
        required_activities_per_period: Optional[int] = 1,
    ) -> UserType:
        """Create a new goal."""
        db = get_db()
        owner = get_current_user(db, info)

        goal = GoalModel(
            name=name,
            frequency=GoalFrequencyModel[frequency.name],
            daily_activities=[],
            weekly_activities=[],
            yearly_activities=[],
            required_activities_per_period=required_activities_per_period,
        )
        db.add(goal)
        db.commit()

        owner.goals.append(goal)

        db.commit()
        db.refresh(owner)
        return convert_user(owner)

    @strawberry.mutation
    async def rename_goal(
        self, current_goal_name: str, new_goal_name: str, info: strawberry.Info[GoalTrackerContext]
    ) -> GoalType:
        """Rename a goal."""
        db = get_db()
        owner = get_current_user(db, info)

        for goal in owner.goals:
            if goal.name == current_goal_name:
                goal.name = new_goal_name

                db.commit()
                db.refresh(goal)
                return convert_goal(goal)
        raise InvalidAPIArgumentException(f"No goal found with name '{current_goal_name}' for current user.")

    @strawberry.mutation
    async def add_goal_to_user(
        self, additional_user_email: str, goal_name: str, info: strawberry.Info[GoalTrackerContext]
    ) -> UserType:
        """Add a goal that's owned by one user to now be shared by an additional user."""
        db = get_db()
        owner = get_current_user(db, info)

        additional_user = db.query(UserModel).where(UserModel.email == additional_user_email).one()
        for goal in owner.goals:
            if goal.name == goal_name:
                additional_user.goals.append(goal)

                db.commit()
                db.refresh(owner)
                return convert_user(owner)
        raise InvalidAPIArgumentException(f"No goal found with name '{goal_name}' for current user.")

    @strawberry.mutation
    async def delete_goal(self, name: str, info: strawberry.Info[GoalTrackerContext]) -> UserType:
        """Delete a goal."""
        db = get_db()
        owner = get_current_user(db, info)

        goal_to_delete = None
        for goal in owner.goals:
            if goal.name == name:
                goal_to_delete = goal
                db.query(DailyActivityModel).filter(DailyActivityModel.goal_id == goal.id).delete()
                db.query(WeeklyActivityModel).filter(WeeklyActivityModel.goal_id == goal.id).delete()
                db.query(YearlyActivityModel).filter(YearlyActivityModel.goal_id == goal.id).delete()
                break
        if goal_to_delete is None:
            raise InvalidAPIArgumentException(f"No goal found with name '{name}' for current user.")
        users_needing_deletion = db.query(UserModel).filter(UserModel.goals.any(GoalModel.name == name)).all()
        for user_needing_deletion in users_needing_deletion:
            user_needing_deletion.goals.remove(goal_to_delete)

        db.commit()
        db.refresh(owner)
        return convert_user(owner)

    @strawberry.mutation
    async def create_or_update_activity(
        self, goal_name: str, date_of_activity: datetime, count: int, info: strawberry.Info[GoalTrackerContext]
    ) -> GoalType:
        """Create or update an activity"""
        db = get_db()
        owner = get_current_user(db, info)
        goal = get_goal(owner, goal_name)

        activity: Union[DailyActivityModel, WeeklyActivityModel, YearlyActivityModel]

        try:
            match goal.frequency:
                case GoalFrequencyModel.DAILY:
                    activity = get_daily_activity(goal, date_of_activity)
                    activity.count = count
                case GoalFrequencyModel.WEEKLY:
                    activity = get_weekly_activity(goal, date_of_activity)
                    activity.count = count
                case GoalFrequencyModel.YEARLY:
                    activity = get_yearly_activity(goal, date_of_activity)
                    activity.count = count

        except InvalidAPIArgumentException:
            match goal.frequency:
                case GoalFrequencyModel.DAILY:
                    activity = DailyActivityModel(
                        year=date_of_activity.year,
                        month=date_of_activity.month,
                        day=date_of_activity.day,
                        count=count,
                    )
                    goal.daily_activities.append(activity)
                case GoalFrequencyModel.WEEKLY:
                    activity = WeeklyActivityModel(
                        year=date_of_activity.year,
                        month=date_of_activity.month,
                        week=week_of_month(date_of_activity),
                        count=count,
                    )
                    goal.weekly_activities.append(activity)
                case GoalFrequencyModel.YEARLY:
                    activity = YearlyActivityModel(
                        year=date_of_activity.year,
                        count=count,
                    )
                    goal.yearly_activities.append(activity)

        db.commit()
        db.refresh(activity)
        db.refresh(goal)
        return convert_goal(goal)


if os.environ["ENVIRONMENT"] == "Development":
    schema = Schema(query=Query, mutation=Mutation)
else:
    schema = Schema(
        query=Query,
        mutation=Mutation,
        extensions=[
            AddValidationRules([NoSchemaIntrospectionCustomRule]),
        ],
    )

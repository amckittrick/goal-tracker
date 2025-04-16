# pylint: disable=too-few-public-methods
"""Schema used to connect the API to the Database."""

from dataclasses import field
from datetime import datetime
from random import randrange
from typing import List, Optional, Tuple

from sqlalchemy.orm import Session
import strawberry
from strawberry import Schema

from backend.database import (
    Activity as ActivityModel,
    get_db,
    Encouragement as EncouragementModel,
    Goal as GoalModel,
    GoalFrequency as GoalFrequencyModel,
    User as UserModel,
)
from backend.exceptions import InvalidAPIArgumentException


@strawberry.type
class UserType:
    """Maps to a User in the DB."""

    id: int
    name: str
    fullname: Optional[str]
    goals: List["GoalType"] = field(default_factory=list)  # pylint: disable=invalid-field-call


def convert_user(model: UserModel) -> UserType:
    """Convert a UserModel to a UserType."""
    goal_types = [convert_goal(goal_model) for goal_model in model.goals]
    return UserType(id=model.id, name=model.name, fullname=model.fullname, goals=goal_types)


@strawberry.type
class GoalType:
    """Maps to a Goal in the DB."""

    id: int
    name: str
    goal_frequency_id: int
    goal_frequency: "GoalFrequencyType"
    activities: List["ActivityType"] = field(default_factory=list)  # pylint: disable=invalid-field-call
    required_activities_per_period: int


def convert_goal(model: GoalModel) -> GoalType:
    """Convert a GoalModel to a GoalType."""
    activity_types = [convert_activity(activity_model) for activity_model in model.activities]
    return GoalType(
        id=model.id,
        name=model.name,
        goal_frequency_id=model.goal_frequency_id,
        goal_frequency=convert_goal_frequency(model.goal_frequency),
        activities=activity_types,
        required_activities_per_period=model.required_activities_per_period,
    )


@strawberry.type
class GoalFrequencyType:
    """Maps to a GoalFrequency in the DB."""

    id: int
    name: str
    number_of_days: int


def convert_goal_frequency(model: GoalFrequencyModel) -> GoalFrequencyType:
    """Convert a GoalFrequencyModel to a GoalFrequencyType."""
    return GoalFrequencyType(id=model.id, name=model.name, number_of_days=model.number_of_days)


@strawberry.type
class EncouragementType:
    """Provides encouragement to the user."""

    id: int
    quote: str
    author: str


def convert_encouragement(model: EncouragementModel) -> EncouragementType:
    """Convert an EncouragementModel to an EncouragementType."""
    return EncouragementType(id=model.id, quote=model.quote, author=model.author)


def get_activity(db_session: Session, username: str, goal_name: str, date: datetime) -> Tuple[GoalModel, ActivityModel]:
    """Get an activity on a specified date for a user + goal."""
    user = db_session.query(UserModel).where(UserModel.name == username).one()
    for goal in user.goals:
        if goal.name == goal_name:
            for activity in goal.activities:
                date_to_compare = date
                if (
                    activity.completed.year == date_to_compare.year
                    and activity.completed.month == date_to_compare.month
                    and activity.completed.day == date_to_compare.day
                ):
                    return goal, activity
    raise InvalidAPIArgumentException(f"No activity found on '{date} for goal '{goal_name}' and user '{user}")


@strawberry.type
class ActivityType:
    """Maps to an Activity in the DB."""

    id: int
    goal_id: int
    completed: datetime
    count: int


def convert_activity(model: ActivityModel) -> ActivityType:
    """Convert an ActivityModel to an ActivityType."""
    return ActivityType(id=model.id, goal_id=model.goal_id, completed=model.completed, count=model.count)


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
    async def user(self, name: str) -> UserType:
        """Return a single user."""
        db = get_db()
        user = db.query(UserModel).where(UserModel.name == name).one()
        return convert_user(user)

    @strawberry.field
    async def goal_frequencies(self) -> List[GoalFrequencyType]:
        """Get all GoalFrequency options from the DB."""
        db = get_db()
        return [convert_goal_frequency(goal_frequency) for goal_frequency in db.query(GoalFrequencyModel).all()]

    @strawberry.field
    async def encouragement(self) -> EncouragementType:
        """Provides encouragement to the user."""
        db = get_db()
        rand = randrange(0, db.query(EncouragementModel).count())
        return convert_encouragement(db.query(EncouragementModel)[rand])


@strawberry.type
class Mutation:
    """GraphQL Mutations"""

    @strawberry.mutation
    async def create_user(self, name: str, fullname: str) -> UserType:
        """Create a new user."""
        db = get_db()
        user = UserModel(name=name, fullname=fullname, goals=[])
        db.add(user)

        db.commit()
        db.refresh(user)
        return convert_user(user)

    @strawberry.mutation
    async def create_goal(
        self, name: str, username: str, frequency_name: str, required_activities_per_period: Optional[int] = 1
    ) -> UserType:
        """Create a new goal."""
        db = get_db()
        owner = db.query(UserModel).where(UserModel.name == username).one()
        frequency = db.query(GoalFrequencyModel).where(GoalFrequencyModel.name == frequency_name).one()

        goal = GoalModel(
            name=name,
            goal_frequency_id=frequency.id,
            activities=[],
            required_activities_per_period=required_activities_per_period,
        )
        db.add(goal)
        db.commit()

        owner.goals.append(goal)

        db.commit()
        db.refresh(owner)
        return convert_user(owner)

    @strawberry.mutation
    async def rename_goal(self, current_goal_name: str, new_goal_name: str, username: str) -> GoalType:
        """Rename a goal."""
        db = get_db()

        user = db.query(UserModel).where(UserModel.name == username).one()
        for goal in user.goals:
            if goal.name == current_goal_name:
                goal.name = new_goal_name

                db.commit()
                db.refresh(goal)
                return convert_goal(goal)
        raise InvalidAPIArgumentException(f"No goal found with name '{current_goal_name}' for user '{username}'")

    @strawberry.mutation
    async def add_goal_to_user(self, owner_username: str, additional_username: str, goal_name: str) -> UserType:
        """Add a goal that's owned by one user to now be shared by an additional user."""
        db = get_db()
        owner = db.query(UserModel).where(UserModel.name == owner_username).one()
        additional_user = db.query(UserModel).where(UserModel.name == additional_username).one()
        for goal in owner.goals:
            if goal.name == goal_name:
                additional_user.goals.append(goal)

                db.commit()
                db.refresh(owner)
                return convert_user(owner)
        raise InvalidAPIArgumentException(f"No goal found with name '{goal_name}' for user '{owner_username}'")

    @strawberry.mutation
    async def delete_goal(self, name: str, username: str) -> UserType:
        """Delete a goal."""
        db = get_db()
        user = db.query(UserModel).where(UserModel.name == username).one()
        goal_to_delete = None
        for goal in user.goals:
            if goal.name == name:
                goal_to_delete = goal
                db.query(ActivityModel).filter(ActivityModel.goal_id == goal.id).delete()
                break
        if goal_to_delete is None:
            raise InvalidAPIArgumentException(f"No goal found with name '{name}' on user '{username}' to delete.")
        users_needing_deletion = db.query(UserModel).filter(UserModel.goals.any(GoalModel.name == name)).all()
        for user_needing_deletion in users_needing_deletion:
            user_needing_deletion.goals.remove(goal_to_delete)

        db.commit()
        db.refresh(user)
        return convert_user(user)

    @strawberry.mutation
    async def create_goal_frequency(self, name: str, number_of_days: int) -> GoalFrequencyType:
        """Create a GoalFrequency."""
        db = get_db()
        goal_frequency = GoalFrequencyModel(name=name, number_of_days=number_of_days)
        db.add(goal_frequency)

        db.commit()
        db.refresh(goal_frequency)
        return convert_goal_frequency(goal_frequency)

    @strawberry.mutation
    async def delete_goal_frequency(self, name: str) -> None:
        """Delete a GoalFreqency."""
        db = get_db()
        goal_freqency_to_delete = db.query(GoalFrequencyModel).where(GoalFrequencyModel.name == name).one()
        db.query(GoalFrequencyModel).where(GoalFrequencyModel.id == goal_freqency_to_delete.id).delete()

        db.commit()
        return None

    @strawberry.mutation
    async def create_or_update_activity(
        self, username: str, goal_name: str, completed: datetime, count: int
    ) -> GoalType:
        """Create an Activity"""
        db = get_db()
        try:
            goal, activity = get_activity(db, username, goal_name, completed)
            activity.count = count
            db.commit()
            db.refresh(activity)
            db.refresh(goal)
            return convert_goal(goal)
        except InvalidAPIArgumentException:
            user = db.query(UserModel).where(UserModel.name == username).one()
            for goal in user.goals:
                if goal.name == goal_name:
                    activity = ActivityModel(completed=completed, count=count)
                    goal.activities.append(activity)

                    db.commit()
                    db.refresh(goal)
                    return convert_goal(goal)
        raise InvalidAPIArgumentException(f"No goal found with name '{goal_name}' for user '{username}'")


schema = Schema(query=Query, mutation=Mutation)

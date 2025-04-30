# pylint: disable=too-few-public-methods
"""Interface to the database."""

import enum
import os
from typing import Callable, List

from sqlalchemy import CheckConstraint, Column, create_engine, Engine, ForeignKey, String, Table, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, sessionmaker, Session

from backend.exceptions import GoalTrackerException


class GoalFrequency(enum.Enum):
    """Potential goal frequencies."""

    DAILY = "daily"
    WEEKLY = "weekly"
    YEARLY = "yearly"


class FunctionWithSessionLocalAttr:  # pylint: disable=too-few-public-methods
    """Class to model a function that has a session_local attribute. Effectively implements singleton behavior."""

    session_local: Callable[[], Session]

    def __call__(self) -> None: ...


init_db: FunctionWithSessionLocalAttr


def get_db_connection_str() -> str:
    """Return a string representing the connection to the database."""
    return f"postgresql+psycopg2://{os.environ['DB_USER']}:{os.environ['DB_KEY']}@{os.environ['DB_HOST']}/{os.environ['DB_NAME']}"  # pylint: disable=line-too-long


def create_local_engine() -> Engine:
    """Create a DB engine."""
    return create_engine(get_db_connection_str())


def init_db() -> None:  # type: ignore[no-redef]
    """Initialize the DB. Inside a function so it can be called in a loop in case the DB is not yet ready."""
    engine = create_local_engine()
    Base.metadata.create_all(bind=engine)
    init_db.session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Session:
    """Return a connection to the database."""
    if not hasattr(init_db, "session_local"):
        raise GoalTrackerException("DB has not been initialized yet.")
    db = init_db.session_local()
    try:
        return db
    finally:
        db.close()


class Base(DeclarativeBase):
    """Base Class."""


permission_table = Table(
    "permission",
    Base.metadata,
    Column("user_id", ForeignKey("user_account.id"), primary_key=True),
    Column("goal_id", ForeignKey("goal.id"), primary_key=True),
)


class User(Base):
    """A user."""

    __tablename__ = "user_account"
    __table_args__ = (
        CheckConstraint("length(email) > 0", name="non_empty_email"),
        CheckConstraint("length(fullname) > 0", name="non_empty_fullname"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(), unique=True)
    fullname: Mapped[str] = mapped_column(String())

    goals: Mapped[List["Goal"]] = relationship(secondary=permission_table, back_populates="users")


class Goal(Base):
    """A single goal tied to a user."""

    __tablename__ = "goal"
    __table_args__ = (CheckConstraint("length(name) > 0", name="non_empty_goal_name"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)
    required_activities_per_period: Mapped[int] = mapped_column(default=1)

    frequency: Mapped[GoalFrequency]

    daily_activities: Mapped[List["DailyActivity"]] = relationship()
    weekly_activities: Mapped[List["WeeklyActivity"]] = relationship()
    yearly_activities: Mapped[List["YearlyActivity"]] = relationship()

    users: Mapped[List["User"]] = relationship(secondary=permission_table, back_populates="goals")


class DailyActivity(Base):
    """A single activity tied to a daily goal."""

    __tablename__ = "daily_activity"
    id: Mapped[int] = mapped_column(primary_key=True)
    goal_id: Mapped[int] = mapped_column(ForeignKey("goal.id"))
    year: Mapped[int] = mapped_column()
    month: Mapped[int] = mapped_column()
    day: Mapped[int] = mapped_column()
    count: Mapped[int] = mapped_column()
    UniqueConstraint("goal_id", "year", "month", "day")


class WeeklyActivity(Base):
    """A single activity tied to a weekly goal."""

    __tablename__ = "weekly_activity"
    id: Mapped[int] = mapped_column(primary_key=True)
    goal_id: Mapped[int] = mapped_column(ForeignKey("goal.id"))
    year: Mapped[int] = mapped_column()
    month: Mapped[int] = mapped_column()
    week: Mapped[int] = mapped_column()
    count: Mapped[int] = mapped_column()
    UniqueConstraint("goal_id", "year", "month", "week")


class YearlyActivity(Base):
    """A single activity tied to a yearly goal."""

    __tablename__ = "yearly_activity"
    id: Mapped[int] = mapped_column(primary_key=True)
    goal_id: Mapped[int] = mapped_column(ForeignKey("goal.id"))
    year: Mapped[int] = mapped_column()
    count: Mapped[int] = mapped_column()
    UniqueConstraint("goal_id", "year")


class Encouragement(Base):
    """An encouraging quote."""

    __tablename__ = "encouragement"
    id: Mapped[int] = mapped_column(primary_key=True)
    quote: Mapped[str] = mapped_column(String(256))
    author: Mapped[str] = mapped_column(String(64))

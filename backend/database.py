# pylint: disable=too-few-public-methods
"""Interface to the database."""

from datetime import datetime, timezone
import os
from typing import Callable, List, Optional

from sqlalchemy import Column, create_engine, Engine, ForeignKey, String, Table
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, sessionmaker, Session

from backend.exceptions import GoalTrackerException


class FunctionWithSessionLocalAttr:  # pylint: disable=too-few-public-methods
    """Class to model a function that has a session_local attribute. Effectively implements singleton behavior."""

    session_local: Callable[[], Session]

    def __call__(self) -> None: ...


init_db: FunctionWithSessionLocalAttr


def get_db_connection_str() -> str:
    """Return a string representing the connection to the database."""
    if "DB_USER" not in os.environ:
        raise GoalTrackerException("'DB_USER' environment variable not found.")
    if "DB_KEY" not in os.environ:
        raise GoalTrackerException("'DB_KEY' environment variable not found.")
    if "DB_HOST" not in os.environ:
        raise GoalTrackerException("'DB_HOST' environment variable not found.")
    if "DB_NAME" not in os.environ:
        raise GoalTrackerException("'DB_NAME' environment variable not found.")
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

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30), unique=True)
    fullname: Mapped[Optional[str]]

    goals: Mapped[List["Goal"]] = relationship(secondary=permission_table, back_populates="users")


class Goal(Base):
    """A single goal tied to a user."""

    __tablename__ = "goal"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30))

    goal_frequency_id: Mapped[int] = mapped_column(ForeignKey("goal_frequency.id"))
    goal_frequency: Mapped["GoalFrequency"] = relationship()

    activities: Mapped[List["Activity"]] = relationship()

    users: Mapped[List["User"]] = relationship(secondary=permission_table, back_populates="goals")


class GoalFrequency(Base):
    """A type of goal based on it's frequency (eg daily, weekly, etc)."""

    __tablename__ = "goal_frequency"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30), unique=True)
    number_of_days: Mapped[int]


class Activity(Base):
    """A single activity tied to a single goal."""

    __tablename__ = "activity"
    id: Mapped[int] = mapped_column(primary_key=True)
    goal_id: Mapped[int] = mapped_column(ForeignKey("goal.id"))
    completed: Mapped[datetime] = mapped_column(default=datetime.now(timezone.utc))

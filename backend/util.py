"""General utility functions."""

from datetime import datetime, timezone
from math import ceil


def week_of_month(date_to_check: datetime) -> int:
    """Gets the week of the month for a date."""
    first_day = date_to_check.replace(day=1)

    day_of_month = date_to_check.day
    adjusted_day_of_month = day_of_month + first_day.weekday()

    return int(ceil(adjusted_day_of_month / 7.0))


def date_before_today(date_to_check: datetime) -> bool:
    """Check if a specified date occurs before today."""
    today = datetime.now(timezone.utc)
    if date_to_check.year < today.year:
        return True
    if date_to_check.year == today.year and date_to_check.month < today.month:
        return True
    if date_to_check.year == today.year and date_to_check.month == today.month and date_to_check.day < today.day:
        return True
    return False

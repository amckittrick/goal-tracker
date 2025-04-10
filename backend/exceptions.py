"""Internal Exception Classes."""


class GoalTrackerException(Exception):
    """Generic class to handle all internal exceptions."""


class InvalidAPIArgumentException(GoalTrackerException):
    """Used to handle invalid API arguments."""

"""Test functionality related to GoalFrequency."""

import pytest

from backend.api import schema


MUTATION_CREATE_GOAL_FREQUENCY = """
    mutation createGoalFrequency($name: String!, $numberOfDays: Int!) {
        createGoalFrequency(name: $name, numberOfDays: $numberOfDays) {
            id
            name
            numberOfDays
        }
    }
"""

MUTATION_DELETE_GOAL_FREQUENCY = """
    mutation deleteGoalFrequency($name: String!) {
        deleteGoalFrequency(name: $name)
    }
"""


@pytest.mark.asyncio
async def test_create_goal_frequency_nominal() -> None:
    """Test nominal creation of a GoalFrequency."""
    create_goal_frequency_result = await schema.execute(
        MUTATION_CREATE_GOAL_FREQUENCY, variable_values={"name": "fake-goal-frequency", "numberOfDays": 1}
    )
    assert create_goal_frequency_result.errors is None
    assert create_goal_frequency_result.data is not None
    assert create_goal_frequency_result.data["createGoalFrequency"] == {
        "id": 1,
        "name": "fake-goal-frequency",
        "numberOfDays": 1,
    }

    query_get_goal_frequencies = """
    query getGoalFrequencies {
        goalFrequencies {
            id
            name
            numberOfDays
        }
    }
    """
    get_goal_frequencies_result = await schema.execute(query_get_goal_frequencies)
    assert get_goal_frequencies_result.errors is None
    assert get_goal_frequencies_result.data is not None
    assert get_goal_frequencies_result.data["goalFrequencies"] == [
        {
            "id": 1,
            "name": "fake-goal-frequency",
            "numberOfDays": 1,
        },
    ]


@pytest.mark.asyncio
async def test_delete_goal_frequency_nominal() -> None:
    """Test nominal deletion of a GoalFrequency."""
    await schema.execute(
        MUTATION_CREATE_GOAL_FREQUENCY, variable_values={"name": "fake-goal-frequency", "numberOfDays": 1}
    )

    mutation_delete_goal_frequency_result = await schema.execute(
        MUTATION_DELETE_GOAL_FREQUENCY, variable_values={"name": "fake-goal-frequency"}
    )
    assert mutation_delete_goal_frequency_result.errors is None
    assert mutation_delete_goal_frequency_result.data is not None
    assert mutation_delete_goal_frequency_result.data["deleteGoalFrequency"] is None


@pytest.mark.asyncio
async def test_delete_goal_frequency_missing() -> None:
    """Test an exception is raised when attempting to delete a GoalFrequency that does not exist."""
    mutation_delete_goal_frequency_result = await schema.execute(
        MUTATION_DELETE_GOAL_FREQUENCY, variable_values={"name": "fake-goal-frequency"}
    )
    assert mutation_delete_goal_frequency_result.errors is not None
    assert mutation_delete_goal_frequency_result.errors[0].message == "No row was found when one was required"

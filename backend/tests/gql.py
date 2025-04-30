"""GQL Queries and Mutations for tests."""

QUERY_GET_ENCOURAGEMENT = """
    query getEncouragement {
        encouragement {
            id
            author
            quote
        }
    }
"""

QUERY_GET_USER = """
    query getUser {
        user {
            id
            email
            fullname
            goals {
                id
                name
            }
        }
    }
"""

QUERY_GET_USER_STATUS = """
    query getUserStatus($duration: DisplayDuration!, $dateToCheck: DateTime!) {
        userStatus(duration: $duration, dateToCheck: $dateToCheck) {
            name
            frequency
            dates
            statuses
        }
    }
"""

MUTATION_CREATE_USER = """
    mutation createUser($email: String!, $fullname: String!) {
        createUser(email: $email, fullname: $fullname) {
            id
            email
            fullname
        }
    }
"""

MUTATION_CREATE_GOAL = """
    mutation createGoal(
        $name: String!,
        $frequency: GoalFrequencyType!,
        $requiredActivitiesPerPeriod: Int!
    ) {
        createGoal(
            name: $name,
            frequency: $frequency,
            requiredActivitiesPerPeriod: $requiredActivitiesPerPeriod
        ) {
            id
            email
            fullname
            goals {
                id
                name
            }
        }
    }
"""

MUTATION_DELETE_GOAL = """
    mutation DeleteGoal($goalName: String!) {
      deleteGoal(name: $goalName) {
        id
        email
        goals {
          id
        }
      }
    }
"""

MUTATION_RENAME_GOAL = """
mutation renameGoal($currentGoalName: String!, $newGoalName: String!) {
    renameGoal(currentGoalName: $currentGoalName, newGoalName: $newGoalName) {
        name
    }
}
"""

MUTATION_ADD_GOAL_TO_USER = """
    mutation addGoalToUser($additionalUserEmail: String!, $goalName: String!) {
        addGoalToUser(additionalUserEmail: $additionalUserEmail, goalName: $goalName) {
            email
            goals {
                name
            }
        }
    }
"""

MUTATION_CREATE_OR_UPDATE_ACTIVITY = """
    mutation createOrUpdateActivity(
        $goalName: String!,
        $dateOfActivity: DateTime!,
        $count: Int!
    ) {
        createOrUpdateActivity(
            goalName: $goalName,
            dateOfActivity: $dateOfActivity,
            count: $count
        ) {
            id
            name
            dailyActivities {
                year
                month
                day
                count
            }
            weeklyActivities {
                year
                month
                week
                count
            }
            yearlyActivities {
                year
                count
            }
        }
    }
"""

import { gql } from './__generated__/gql.ts';

export const gqlGetUser = gql(`
  query GetUser {
    user {
      email
      fullname
      goals {
        name
      }
    }
  }
`);

export const gqlCreateOrUpdateActivity = gql(`
  mutation CreateOrUpdateActivity(
    $goalName: String!,
    $dateOfActivity: DateTime!,
    $count: Int!
  ) {
    createOrUpdateActivity(
      goalName: $goalName,
      dateOfActivity: $dateOfActivity,
      count: $count
    ){
        id
        name
        frequency
        requiredActivitiesPerPeriod
        dailyActivities {
          id
          goalId
          year
          month
          day
          count
        }
        weeklyActivities {
          id
          goalId
          year
          month
          week
          count
        }
        yearlyActivities {
          id
          goalId
          year
          count
        }
    }
  }
`);

export const gqlCreateGoal = gql(`
  mutation CreateGoal(
    $goalName: String!,
    $frequency: GoalFrequencyType!,
    $requiredActivitiesPerPeriod: Int!
  ) {
    createGoal(
      name: $goalName,
      frequency: $frequency,
      requiredActivitiesPerPeriod: $requiredActivitiesPerPeriod
    ){
      id
      email
      fullname
      goals {
        id
        name
        frequency
        requiredActivitiesPerPeriod
        dailyActivities {
          id
          goalId
          year
          month
          day
          count
        }
        weeklyActivities {
          id
          goalId
          year
          month
          week
          count
        }
        yearlyActivities {
          id
          goalId
          year
          count
        }
      }
    }
  }
`);

export const gqlAddGoalToUser = gql(`
  mutation addGoalToUser($additionalUserEmail: String!, $goalName: String!) {
      addGoalToUser(additionalUserEmail: $additionalUserEmail, goalName: $goalName) {
        id
        email
        fullname
        goals {
          id
          name
          frequency
          requiredActivitiesPerPeriod
          dailyActivities {
            id
            goalId
            year
            month
            day
            count
          }
          weeklyActivities {
            id
            goalId
            year
            month
            week
            count
          }
          yearlyActivities {
            id
            goalId
            year
            count
          }
        }
      }
  }
`);

export const gqlDeleteGoal = gql(`
  mutation DeleteGoal($goalName: String!) {
    deleteGoal(name: $goalName) {
      id
      email
      fullname
      goals {
        id
        name
        frequency
        requiredActivitiesPerPeriod
        dailyActivities {
          id
          goalId
          year
          month
          day
          count
        }
        weeklyActivities {
          id
          goalId
          year
          month
          week
          count
        }
        yearlyActivities {
          id
          goalId
          year
          count
        }
      }
    }
  }
`);

export const gqlRenameGoal = gql(`
  mutation renameGoal($currentGoalName: String!, $newGoalName: String!) {
      renameGoal(currentGoalName: $currentGoalName, newGoalName: $newGoalName) {
        id
        name
        frequency
        requiredActivitiesPerPeriod
        dailyActivities {
          id
          goalId
          year
          month
          day
          count
        }
        weeklyActivities {
          id
          goalId
          year
          month
          week
          count
        }
        yearlyActivities {
          id
          goalId
          year
          count
        }
      }
  }
`);

export const gqlGetEncouragement = gql(`
  query getEncouragement {
    encouragement {
      id
      author
      quote
    }
  }
`);

export const gqlGetUserStatus = gql(`
  query getUserStatus($duration: DisplayDuration!, $dateToCheck: DateTime!) {
    userStatus(duration: $duration, dateToCheck: $dateToCheck) {
      name
      frequency
      dates
      statuses
    }
  }
`);
import { gql } from './__generated__/gql.ts';

export const gqlGetUser = gql(`
  query GetUser($email: String!) {
    user(email: $email) {
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
    $ownerEmail: String!,
    $goalName: String!,
    $dateOfActivity: DateTime!,
    $count: Int!
  ) {
    createOrUpdateActivity(
      ownerEmail: $ownerEmail,
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
    $ownerEmail: String!,
    $frequency: GoalFrequencyType!,
    $requiredActivitiesPerPeriod: Int!
  ) {
    createGoal(
      name: $goalName,
      ownerEmail: $ownerEmail,
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
  mutation addGoalToUser($ownerEmail: String!, $additionalUserEmail: String!, $goalName: String!) {
      addGoalToUser(ownerEmail: $ownerEmail, additionalUserEmail: $additionalUserEmail, goalName: $goalName) {
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
  mutation DeleteGoal($goalName: String!, $ownerEmail: String! ) {
    deleteGoal(name: $goalName, ownerEmail: $ownerEmail) {
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
  mutation renameGoal($currentGoalName: String!, $newGoalName: String!, $ownerEmail: String!) {
      renameGoal(currentGoalName: $currentGoalName, newGoalName: $newGoalName, ownerEmail: $ownerEmail) {
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
  query getUserStatus($email: String!, $duration: DisplayDuration!, $dateToCheck: DateTime!) {
    userStatus(email: $email, duration: $duration, dateToCheck: $dateToCheck) {
      name
      frequency
      dates
      statuses
    }
  }
`);
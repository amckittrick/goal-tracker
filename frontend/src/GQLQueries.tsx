import { gql } from './__generated__/gql.ts';

export const gqlGetUser = gql(`
  query GetUser($email: String!) {
    user(email: $email) {
      id
      email
      fullname
      goals {
        id
        name
        requiredActivitiesPerPeriod
        goalFrequencyId
        goalFrequency {
          id
          name
          numberOfDays
        }
        activities {
          id
          goalId
          completedYear
          completedMonth
          completedDay
          count
        }
      }
    }
  }
`);

export const gqlGetUsers = gql(`
  query GetUsers {
    users {
      id
      email
      fullname
    }
  }
`);

export const gqlCreateOrUpdateActivity = gql(`
  mutation CreateOrUpdateActivity(
    $ownerEmail: String!,
    $goalName: String!,
    $completedYear: Int!,
    $completedMonth: Int!,
    $completedDay: Int!,
    $count: Int!
  ) {
    createOrUpdateActivity(
      ownerEmail: $ownerEmail,
      goalName: $goalName,
      completedYear: $completedYear,
      completedMonth: $completedMonth,
      completedDay: $completedDay,
      count: $count
    ){
      id
      name
      goalFrequencyId
      goalFrequency {
        id
        name
        numberOfDays
      }
      activities {
        id
        goalId
        completedYear
        completedMonth
        completedDay
        count
      }
    }
  }
`);

export const gqlCreateGoal = gql(`
  mutation CreateGoal(
    $goalName: String!,
    $ownerEmail: String!,
    $goalFrequency: String!,
    $requiredActivitiesPerPeriod: Int!
  ) {
    createGoal(
      name: $goalName,
      ownerEmail: $ownerEmail,
      frequencyName: $goalFrequency,
      requiredActivitiesPerPeriod: $requiredActivitiesPerPeriod
    ){
      id
      email
      fullname
      goals {
        id
        name
        goalFrequencyId
        goalFrequency {
          id
          name
          numberOfDays
        }
        activities {
          id
          goalId
          completedYear
          completedMonth
          completedDay
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
          goalFrequencyId
          goalFrequency {
            id
            name
            numberOfDays
          }
          activities {
            id
            goalId
            completedYear
            completedMonth
            completedDay
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
        goalFrequencyId
        goalFrequency {
          id
          name
          numberOfDays
        }
        activities {
          id
          goalId
          completedYear
          completedMonth
          completedDay
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
          activities {
              completedYear
              completedMonth
              completedDay
              count
          }
      }
  }
`);

export const gqlGetGoalFrequencies = gql(`
  query goalFrequencies {
    goalFrequencies {
      id
      name
      numberOfDays
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
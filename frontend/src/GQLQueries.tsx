import { gql } from './__generated__/gql.ts';

export const gqlGetUsers = gql(`
  query GetUsers {
    users {
      id
      name
      fullname
    }
  }
`);

export const gqlGetUserGoals = gql(`
  query GetUserGoals($username: String! ) {
    userGoals(username: $username){
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
        completed
        count
      }
        requiredActivitiesPerPeriod
    }
  }
`);

export const gqlCreateUser = gql(`
  mutation CreateUser($username: String!, $fullname: String! ) {
    createUser(name: $username, fullname: $fullname){
      id
      name
      fullname
    }
  }
`);

export const gqlCreateOrUpdateActivity = gql(`
  mutation CreateOrUpdateActivity(
    $username: String!,
    $goalName: String!,
    $completed: DateTime!,
    $count: Int!
  ) {
    createOrUpdateActivity(
      username: $username,
      goalName: $goalName,
      completed: $completed,
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
        completed
        count
      }
    }
  }
`);

export const gqlDeleteActivity = gql(`
  mutation DeleteActivity($username: String!, $goalName: String!, $date: DateTime! ) {
    deleteActivity(username: $username, goalName: $goalName, date: $date){
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
        completed
        count
      }
    }
  }
`);

export const gqlCreateGoal = gql(`
  mutation CreateGoal(
    $goalName: String!,
    $username: String!,
    $goalFrequency: String!,
    $requiredActivitiesPerPeriod: Int!
  ) {
    createGoal(
      name: $goalName,
      username: $username,
      frequencyName: $goalFrequency,
      requiredActivitiesPerPeriod: $requiredActivitiesPerPeriod
    ){
      id
      name
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
          completed
          count
        }
      }
    }
  }
`);

export const gqlAddGoalToUser = gql(`
  mutation addGoalToUser($ownerUsername: String!, $additionalUsername: String!, $goalName: String!) {
      addGoalToUser(ownerUsername: $ownerUsername, additionalUsername: $additionalUsername, goalName: $goalName) {
        id
        name
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
            completed
            count
          }
        }
      }
  }
`);

export const gqlDeleteGoal = gql(`
  mutation DeleteGoal($goalName: String!, $username: String! ) {
    deleteGoal(name: $goalName, username: $username) {
      id
      name
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
          completed
          count
        }
      }
    }
  }
`);

export const gqlRenameGoal = gql(`
  mutation renameGoal($currentGoalName: String!, $newGoalName: String!, $username: String!) {
      renameGoal(currentGoalName: $currentGoalName, newGoalName: $newGoalName, username: $username) {
          id
          name
          activities {
              completed
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
`)
/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query GetUser($username: String!) {\n    user(name: $username) {\n      id\n      name\n      fullname\n      goals {\n        id\n        name\n        requiredActivitiesPerPeriod\n        goalFrequencyId\n        goalFrequency {\n          id\n          name\n          numberOfDays\n        }\n        activities {\n          id\n          goalId\n          completed\n          count\n        }\n      }\n    }\n  }\n": typeof types.GetUserDocument,
    "\n  query GetUsers {\n    users {\n      id\n      name\n      fullname\n    }\n  }\n": typeof types.GetUsersDocument,
    "\n  mutation CreateUser($username: String!, $fullname: String! ) {\n    createUser(name: $username, fullname: $fullname){\n      id\n      name\n      fullname\n    }\n  }\n": typeof types.CreateUserDocument,
    "\n  mutation CreateOrUpdateActivity(\n    $username: String!,\n    $goalName: String!,\n    $completed: DateTime!,\n    $count: Int!\n  ) {\n    createOrUpdateActivity(\n      username: $username,\n      goalName: $goalName,\n      completed: $completed,\n      count: $count\n    ){\n      id\n      name\n      goalFrequencyId\n      goalFrequency {\n        id\n        name\n        numberOfDays\n      }\n      activities {\n        id\n        goalId\n        completed\n        count\n      }\n    }\n  }\n": typeof types.CreateOrUpdateActivityDocument,
    "\n  mutation CreateGoal(\n    $goalName: String!,\n    $username: String!,\n    $goalFrequency: String!,\n    $requiredActivitiesPerPeriod: Int!\n  ) {\n    createGoal(\n      name: $goalName,\n      username: $username,\n      frequencyName: $goalFrequency,\n      requiredActivitiesPerPeriod: $requiredActivitiesPerPeriod\n    ){\n      id\n      name\n      goals {\n        id\n        name\n        goalFrequencyId\n        goalFrequency {\n          id\n          name\n          numberOfDays\n        }\n        activities {\n          id\n          goalId\n          completed\n          count\n        }\n      }\n    }\n  }\n": typeof types.CreateGoalDocument,
    "\n  mutation addGoalToUser($ownerUsername: String!, $additionalUsername: String!, $goalName: String!) {\n      addGoalToUser(ownerUsername: $ownerUsername, additionalUsername: $additionalUsername, goalName: $goalName) {\n        id\n        name\n        goals {\n          id\n          name\n          goalFrequencyId\n          goalFrequency {\n            id\n            name\n            numberOfDays\n          }\n          activities {\n            id\n            goalId\n            completed\n            count\n          }\n        }\n      }\n  }\n": typeof types.AddGoalToUserDocument,
    "\n  mutation DeleteGoal($goalName: String!, $username: String! ) {\n    deleteGoal(name: $goalName, username: $username) {\n      id\n      name\n      goals {\n        id\n        name\n        goalFrequencyId\n        goalFrequency {\n          id\n          name\n          numberOfDays\n        }\n        activities {\n          id\n          goalId\n          completed\n          count\n        }\n      }\n    }\n  }\n": typeof types.DeleteGoalDocument,
    "\n  mutation renameGoal($currentGoalName: String!, $newGoalName: String!, $username: String!) {\n      renameGoal(currentGoalName: $currentGoalName, newGoalName: $newGoalName, username: $username) {\n          id\n          name\n          activities {\n              completed\n              count\n          }\n      }\n  }\n": typeof types.RenameGoalDocument,
    "\n  query goalFrequencies {\n    goalFrequencies {\n      id\n      name\n      numberOfDays\n    }\n  }\n": typeof types.GoalFrequenciesDocument,
};
const documents: Documents = {
    "\n  query GetUser($username: String!) {\n    user(name: $username) {\n      id\n      name\n      fullname\n      goals {\n        id\n        name\n        requiredActivitiesPerPeriod\n        goalFrequencyId\n        goalFrequency {\n          id\n          name\n          numberOfDays\n        }\n        activities {\n          id\n          goalId\n          completed\n          count\n        }\n      }\n    }\n  }\n": types.GetUserDocument,
    "\n  query GetUsers {\n    users {\n      id\n      name\n      fullname\n    }\n  }\n": types.GetUsersDocument,
    "\n  mutation CreateUser($username: String!, $fullname: String! ) {\n    createUser(name: $username, fullname: $fullname){\n      id\n      name\n      fullname\n    }\n  }\n": types.CreateUserDocument,
    "\n  mutation CreateOrUpdateActivity(\n    $username: String!,\n    $goalName: String!,\n    $completed: DateTime!,\n    $count: Int!\n  ) {\n    createOrUpdateActivity(\n      username: $username,\n      goalName: $goalName,\n      completed: $completed,\n      count: $count\n    ){\n      id\n      name\n      goalFrequencyId\n      goalFrequency {\n        id\n        name\n        numberOfDays\n      }\n      activities {\n        id\n        goalId\n        completed\n        count\n      }\n    }\n  }\n": types.CreateOrUpdateActivityDocument,
    "\n  mutation CreateGoal(\n    $goalName: String!,\n    $username: String!,\n    $goalFrequency: String!,\n    $requiredActivitiesPerPeriod: Int!\n  ) {\n    createGoal(\n      name: $goalName,\n      username: $username,\n      frequencyName: $goalFrequency,\n      requiredActivitiesPerPeriod: $requiredActivitiesPerPeriod\n    ){\n      id\n      name\n      goals {\n        id\n        name\n        goalFrequencyId\n        goalFrequency {\n          id\n          name\n          numberOfDays\n        }\n        activities {\n          id\n          goalId\n          completed\n          count\n        }\n      }\n    }\n  }\n": types.CreateGoalDocument,
    "\n  mutation addGoalToUser($ownerUsername: String!, $additionalUsername: String!, $goalName: String!) {\n      addGoalToUser(ownerUsername: $ownerUsername, additionalUsername: $additionalUsername, goalName: $goalName) {\n        id\n        name\n        goals {\n          id\n          name\n          goalFrequencyId\n          goalFrequency {\n            id\n            name\n            numberOfDays\n          }\n          activities {\n            id\n            goalId\n            completed\n            count\n          }\n        }\n      }\n  }\n": types.AddGoalToUserDocument,
    "\n  mutation DeleteGoal($goalName: String!, $username: String! ) {\n    deleteGoal(name: $goalName, username: $username) {\n      id\n      name\n      goals {\n        id\n        name\n        goalFrequencyId\n        goalFrequency {\n          id\n          name\n          numberOfDays\n        }\n        activities {\n          id\n          goalId\n          completed\n          count\n        }\n      }\n    }\n  }\n": types.DeleteGoalDocument,
    "\n  mutation renameGoal($currentGoalName: String!, $newGoalName: String!, $username: String!) {\n      renameGoal(currentGoalName: $currentGoalName, newGoalName: $newGoalName, username: $username) {\n          id\n          name\n          activities {\n              completed\n              count\n          }\n      }\n  }\n": types.RenameGoalDocument,
    "\n  query goalFrequencies {\n    goalFrequencies {\n      id\n      name\n      numberOfDays\n    }\n  }\n": types.GoalFrequenciesDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUser($username: String!) {\n    user(name: $username) {\n      id\n      name\n      fullname\n      goals {\n        id\n        name\n        requiredActivitiesPerPeriod\n        goalFrequencyId\n        goalFrequency {\n          id\n          name\n          numberOfDays\n        }\n        activities {\n          id\n          goalId\n          completed\n          count\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUser($username: String!) {\n    user(name: $username) {\n      id\n      name\n      fullname\n      goals {\n        id\n        name\n        requiredActivitiesPerPeriod\n        goalFrequencyId\n        goalFrequency {\n          id\n          name\n          numberOfDays\n        }\n        activities {\n          id\n          goalId\n          completed\n          count\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUsers {\n    users {\n      id\n      name\n      fullname\n    }\n  }\n"): (typeof documents)["\n  query GetUsers {\n    users {\n      id\n      name\n      fullname\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateUser($username: String!, $fullname: String! ) {\n    createUser(name: $username, fullname: $fullname){\n      id\n      name\n      fullname\n    }\n  }\n"): (typeof documents)["\n  mutation CreateUser($username: String!, $fullname: String! ) {\n    createUser(name: $username, fullname: $fullname){\n      id\n      name\n      fullname\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateOrUpdateActivity(\n    $username: String!,\n    $goalName: String!,\n    $completed: DateTime!,\n    $count: Int!\n  ) {\n    createOrUpdateActivity(\n      username: $username,\n      goalName: $goalName,\n      completed: $completed,\n      count: $count\n    ){\n      id\n      name\n      goalFrequencyId\n      goalFrequency {\n        id\n        name\n        numberOfDays\n      }\n      activities {\n        id\n        goalId\n        completed\n        count\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateOrUpdateActivity(\n    $username: String!,\n    $goalName: String!,\n    $completed: DateTime!,\n    $count: Int!\n  ) {\n    createOrUpdateActivity(\n      username: $username,\n      goalName: $goalName,\n      completed: $completed,\n      count: $count\n    ){\n      id\n      name\n      goalFrequencyId\n      goalFrequency {\n        id\n        name\n        numberOfDays\n      }\n      activities {\n        id\n        goalId\n        completed\n        count\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateGoal(\n    $goalName: String!,\n    $username: String!,\n    $goalFrequency: String!,\n    $requiredActivitiesPerPeriod: Int!\n  ) {\n    createGoal(\n      name: $goalName,\n      username: $username,\n      frequencyName: $goalFrequency,\n      requiredActivitiesPerPeriod: $requiredActivitiesPerPeriod\n    ){\n      id\n      name\n      goals {\n        id\n        name\n        goalFrequencyId\n        goalFrequency {\n          id\n          name\n          numberOfDays\n        }\n        activities {\n          id\n          goalId\n          completed\n          count\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateGoal(\n    $goalName: String!,\n    $username: String!,\n    $goalFrequency: String!,\n    $requiredActivitiesPerPeriod: Int!\n  ) {\n    createGoal(\n      name: $goalName,\n      username: $username,\n      frequencyName: $goalFrequency,\n      requiredActivitiesPerPeriod: $requiredActivitiesPerPeriod\n    ){\n      id\n      name\n      goals {\n        id\n        name\n        goalFrequencyId\n        goalFrequency {\n          id\n          name\n          numberOfDays\n        }\n        activities {\n          id\n          goalId\n          completed\n          count\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation addGoalToUser($ownerUsername: String!, $additionalUsername: String!, $goalName: String!) {\n      addGoalToUser(ownerUsername: $ownerUsername, additionalUsername: $additionalUsername, goalName: $goalName) {\n        id\n        name\n        goals {\n          id\n          name\n          goalFrequencyId\n          goalFrequency {\n            id\n            name\n            numberOfDays\n          }\n          activities {\n            id\n            goalId\n            completed\n            count\n          }\n        }\n      }\n  }\n"): (typeof documents)["\n  mutation addGoalToUser($ownerUsername: String!, $additionalUsername: String!, $goalName: String!) {\n      addGoalToUser(ownerUsername: $ownerUsername, additionalUsername: $additionalUsername, goalName: $goalName) {\n        id\n        name\n        goals {\n          id\n          name\n          goalFrequencyId\n          goalFrequency {\n            id\n            name\n            numberOfDays\n          }\n          activities {\n            id\n            goalId\n            completed\n            count\n          }\n        }\n      }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeleteGoal($goalName: String!, $username: String! ) {\n    deleteGoal(name: $goalName, username: $username) {\n      id\n      name\n      goals {\n        id\n        name\n        goalFrequencyId\n        goalFrequency {\n          id\n          name\n          numberOfDays\n        }\n        activities {\n          id\n          goalId\n          completed\n          count\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteGoal($goalName: String!, $username: String! ) {\n    deleteGoal(name: $goalName, username: $username) {\n      id\n      name\n      goals {\n        id\n        name\n        goalFrequencyId\n        goalFrequency {\n          id\n          name\n          numberOfDays\n        }\n        activities {\n          id\n          goalId\n          completed\n          count\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation renameGoal($currentGoalName: String!, $newGoalName: String!, $username: String!) {\n      renameGoal(currentGoalName: $currentGoalName, newGoalName: $newGoalName, username: $username) {\n          id\n          name\n          activities {\n              completed\n              count\n          }\n      }\n  }\n"): (typeof documents)["\n  mutation renameGoal($currentGoalName: String!, $newGoalName: String!, $username: String!) {\n      renameGoal(currentGoalName: $currentGoalName, newGoalName: $newGoalName, username: $username) {\n          id\n          name\n          activities {\n              completed\n              count\n          }\n      }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query goalFrequencies {\n    goalFrequencies {\n      id\n      name\n      numberOfDays\n    }\n  }\n"): (typeof documents)["\n  query goalFrequencies {\n    goalFrequencies {\n      id\n      name\n      numberOfDays\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
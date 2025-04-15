/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Date with time (isoformat) */
  DateTime: { input: any; output: any; }
  /** Represents NULL values */
  Void: { input: any; output: any; }
};

export type ActivityType = {
  __typename?: 'ActivityType';
  completed: Scalars['DateTime']['output'];
  count: Scalars['Int']['output'];
  goalId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
};

export type GoalFrequencyType = {
  __typename?: 'GoalFrequencyType';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  numberOfDays: Scalars['Int']['output'];
};

export type GoalType = {
  __typename?: 'GoalType';
  activities: Array<ActivityType>;
  goalFrequency: GoalFrequencyType;
  goalFrequencyId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  requiredActivitiesPerPeriod: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addGoalToUser: UserType;
  createGoal: UserType;
  createGoalFrequency: GoalFrequencyType;
  createOrUpdateActivity: GoalType;
  createUser: UserType;
  deleteActivity: GoalType;
  deleteGoal: UserType;
  deleteGoalFrequency?: Maybe<Scalars['Void']['output']>;
  renameGoal: GoalType;
};


export type MutationAddGoalToUserArgs = {
  additionalUsername: Scalars['String']['input'];
  goalName: Scalars['String']['input'];
  ownerUsername: Scalars['String']['input'];
};


export type MutationCreateGoalArgs = {
  frequencyName: Scalars['String']['input'];
  name: Scalars['String']['input'];
  requiredActivitiesPerPeriod?: InputMaybe<Scalars['Int']['input']>;
  username: Scalars['String']['input'];
};


export type MutationCreateGoalFrequencyArgs = {
  name: Scalars['String']['input'];
  numberOfDays: Scalars['Int']['input'];
};


export type MutationCreateOrUpdateActivityArgs = {
  completed: Scalars['DateTime']['input'];
  count: Scalars['Int']['input'];
  goalName: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationCreateUserArgs = {
  fullname: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type MutationDeleteActivityArgs = {
  date: Scalars['DateTime']['input'];
  goalName: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationDeleteGoalArgs = {
  name: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationDeleteGoalFrequencyArgs = {
  name: Scalars['String']['input'];
};


export type MutationRenameGoalArgs = {
  currentGoalName: Scalars['String']['input'];
  newGoalName: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  goalFrequencies: Array<GoalFrequencyType>;
  user: UserType;
  userGoals: Array<GoalType>;
  users: Array<UserType>;
};


export type QueryUserArgs = {
  name: Scalars['String']['input'];
};


export type QueryUserGoalsArgs = {
  username: Scalars['String']['input'];
};

export type UserType = {
  __typename?: 'UserType';
  fullname?: Maybe<Scalars['String']['output']>;
  goals: Array<GoalType>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'UserType', id: number, name: string, fullname?: string | null }> };

export type GetUserGoalsQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type GetUserGoalsQuery = { __typename?: 'Query', userGoals: Array<{ __typename?: 'GoalType', id: number, name: string, goalFrequencyId: number, requiredActivitiesPerPeriod: number, goalFrequency: { __typename?: 'GoalFrequencyType', id: number, name: string, numberOfDays: number }, activities: Array<{ __typename?: 'ActivityType', id: number, goalId: number, completed: any, count: number }> }> };

export type CreateUserMutationVariables = Exact<{
  username: Scalars['String']['input'];
  fullname: Scalars['String']['input'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'UserType', id: number, name: string, fullname?: string | null } };

export type CreateOrUpdateActivityMutationVariables = Exact<{
  username: Scalars['String']['input'];
  goalName: Scalars['String']['input'];
  completed: Scalars['DateTime']['input'];
  count: Scalars['Int']['input'];
}>;


export type CreateOrUpdateActivityMutation = { __typename?: 'Mutation', createOrUpdateActivity: { __typename?: 'GoalType', id: number, name: string, goalFrequencyId: number, goalFrequency: { __typename?: 'GoalFrequencyType', id: number, name: string, numberOfDays: number }, activities: Array<{ __typename?: 'ActivityType', id: number, goalId: number, completed: any, count: number }> } };

export type DeleteActivityMutationVariables = Exact<{
  username: Scalars['String']['input'];
  goalName: Scalars['String']['input'];
  date: Scalars['DateTime']['input'];
}>;


export type DeleteActivityMutation = { __typename?: 'Mutation', deleteActivity: { __typename?: 'GoalType', id: number, name: string, goalFrequencyId: number, goalFrequency: { __typename?: 'GoalFrequencyType', id: number, name: string, numberOfDays: number }, activities: Array<{ __typename?: 'ActivityType', id: number, goalId: number, completed: any, count: number }> } };

export type CreateGoalMutationVariables = Exact<{
  goalName: Scalars['String']['input'];
  username: Scalars['String']['input'];
  goalFrequency: Scalars['String']['input'];
  requiredActivitiesPerPeriod: Scalars['Int']['input'];
}>;


export type CreateGoalMutation = { __typename?: 'Mutation', createGoal: { __typename?: 'UserType', id: number, name: string, goals: Array<{ __typename?: 'GoalType', id: number, name: string, goalFrequencyId: number, goalFrequency: { __typename?: 'GoalFrequencyType', id: number, name: string, numberOfDays: number }, activities: Array<{ __typename?: 'ActivityType', id: number, goalId: number, completed: any, count: number }> }> } };

export type AddGoalToUserMutationVariables = Exact<{
  ownerUsername: Scalars['String']['input'];
  additionalUsername: Scalars['String']['input'];
  goalName: Scalars['String']['input'];
}>;


export type AddGoalToUserMutation = { __typename?: 'Mutation', addGoalToUser: { __typename?: 'UserType', id: number, name: string, goals: Array<{ __typename?: 'GoalType', id: number, name: string, goalFrequencyId: number, goalFrequency: { __typename?: 'GoalFrequencyType', id: number, name: string, numberOfDays: number }, activities: Array<{ __typename?: 'ActivityType', id: number, goalId: number, completed: any, count: number }> }> } };

export type DeleteGoalMutationVariables = Exact<{
  goalName: Scalars['String']['input'];
  username: Scalars['String']['input'];
}>;


export type DeleteGoalMutation = { __typename?: 'Mutation', deleteGoal: { __typename?: 'UserType', id: number, name: string, goals: Array<{ __typename?: 'GoalType', id: number, name: string, goalFrequencyId: number, goalFrequency: { __typename?: 'GoalFrequencyType', id: number, name: string, numberOfDays: number }, activities: Array<{ __typename?: 'ActivityType', id: number, goalId: number, completed: any, count: number }> }> } };

export type RenameGoalMutationVariables = Exact<{
  currentGoalName: Scalars['String']['input'];
  newGoalName: Scalars['String']['input'];
  username: Scalars['String']['input'];
}>;


export type RenameGoalMutation = { __typename?: 'Mutation', renameGoal: { __typename?: 'GoalType', id: number, name: string, activities: Array<{ __typename?: 'ActivityType', completed: any, count: number }> } };

export type GoalFrequenciesQueryVariables = Exact<{ [key: string]: never; }>;


export type GoalFrequenciesQuery = { __typename?: 'Query', goalFrequencies: Array<{ __typename?: 'GoalFrequencyType', id: number, name: string, numberOfDays: number }> };


export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fullname"}}]}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const GetUserGoalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserGoals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userGoals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"goalFrequencyId"}},{"kind":"Field","name":{"kind":"Name","value":"goalFrequency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfDays"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"goalId"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requiredActivitiesPerPeriod"}}]}}]}}]} as unknown as DocumentNode<GetUserGoalsQuery, GetUserGoalsQueryVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fullname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"fullname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fullname"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fullname"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const CreateOrUpdateActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOrUpdateActivity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"goalName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"completed"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"count"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOrUpdateActivity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"goalName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"goalName"}}},{"kind":"Argument","name":{"kind":"Name","value":"completed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"completed"}}},{"kind":"Argument","name":{"kind":"Name","value":"count"},"value":{"kind":"Variable","name":{"kind":"Name","value":"count"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"goalFrequencyId"}},{"kind":"Field","name":{"kind":"Name","value":"goalFrequency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfDays"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"goalId"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<CreateOrUpdateActivityMutation, CreateOrUpdateActivityMutationVariables>;
export const DeleteActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteActivity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"goalName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteActivity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"goalName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"goalName"}}},{"kind":"Argument","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"goalFrequencyId"}},{"kind":"Field","name":{"kind":"Name","value":"goalFrequency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfDays"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"goalId"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteActivityMutation, DeleteActivityMutationVariables>;
export const CreateGoalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGoal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"goalName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"goalFrequency"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requiredActivitiesPerPeriod"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGoal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"goalName"}}},{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"frequencyName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"goalFrequency"}}},{"kind":"Argument","name":{"kind":"Name","value":"requiredActivitiesPerPeriod"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requiredActivitiesPerPeriod"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"goals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"goalFrequencyId"}},{"kind":"Field","name":{"kind":"Name","value":"goalFrequency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfDays"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"goalId"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateGoalMutation, CreateGoalMutationVariables>;
export const AddGoalToUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addGoalToUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ownerUsername"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"additionalUsername"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"goalName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addGoalToUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ownerUsername"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ownerUsername"}}},{"kind":"Argument","name":{"kind":"Name","value":"additionalUsername"},"value":{"kind":"Variable","name":{"kind":"Name","value":"additionalUsername"}}},{"kind":"Argument","name":{"kind":"Name","value":"goalName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"goalName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"goals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"goalFrequencyId"}},{"kind":"Field","name":{"kind":"Name","value":"goalFrequency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfDays"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"goalId"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AddGoalToUserMutation, AddGoalToUserMutationVariables>;
export const DeleteGoalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteGoal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"goalName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteGoal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"goalName"}}},{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"goals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"goalFrequencyId"}},{"kind":"Field","name":{"kind":"Name","value":"goalFrequency"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfDays"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"goalId"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteGoalMutation, DeleteGoalMutationVariables>;
export const RenameGoalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"renameGoal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currentGoalName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newGoalName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renameGoal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"currentGoalName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currentGoalName"}}},{"kind":"Argument","name":{"kind":"Name","value":"newGoalName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newGoalName"}}},{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"activities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<RenameGoalMutation, RenameGoalMutationVariables>;
export const GoalFrequenciesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"goalFrequencies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"goalFrequencies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"numberOfDays"}}]}}]}}]} as unknown as DocumentNode<GoalFrequenciesQuery, GoalFrequenciesQueryVariables>;
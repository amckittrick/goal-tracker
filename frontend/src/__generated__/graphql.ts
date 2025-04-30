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
};

export enum ActivityStatus {
  Achieved = 'ACHIEVED',
  UnachievedPast = 'UNACHIEVED_PAST',
  UnachievedTodayOrFuture = 'UNACHIEVED_TODAY_OR_FUTURE'
}

export type DailyActivityType = {
  __typename?: 'DailyActivityType';
  count: Scalars['Int']['output'];
  day: Scalars['Int']['output'];
  goalId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  month: Scalars['Int']['output'];
  year: Scalars['Int']['output'];
};

export enum DisplayDuration {
  Day = 'DAY',
  Month = 'MONTH',
  ThreeDay = 'THREE_DAY'
}

export type EncouragementType = {
  __typename?: 'EncouragementType';
  author: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  quote: Scalars['String']['output'];
};

export enum GoalFrequencyType {
  Daily = 'DAILY',
  Weekly = 'WEEKLY',
  Yearly = 'YEARLY'
}

export type GoalStatusType = {
  __typename?: 'GoalStatusType';
  dates: Array<Scalars['DateTime']['output']>;
  frequency: GoalFrequencyType;
  name: Scalars['String']['output'];
  statuses: Array<Array<ActivityStatus>>;
};

export type GoalType = {
  __typename?: 'GoalType';
  dailyActivities: Array<DailyActivityType>;
  frequency: GoalFrequencyType;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  requiredActivitiesPerPeriod: Scalars['Int']['output'];
  weeklyActivities: Array<WeeklyActivityType>;
  yearlyActivities: Array<YearlyActivityType>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addGoalToUser: UserType;
  createGoal: UserType;
  createOrUpdateActivity: GoalType;
  createUser: UserType;
  deleteGoal: UserType;
  renameGoal: GoalType;
};


export type MutationAddGoalToUserArgs = {
  additionalUserEmail: Scalars['String']['input'];
  goalName: Scalars['String']['input'];
};


export type MutationCreateGoalArgs = {
  frequency: GoalFrequencyType;
  name: Scalars['String']['input'];
  requiredActivitiesPerPeriod?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationCreateOrUpdateActivityArgs = {
  count: Scalars['Int']['input'];
  dateOfActivity: Scalars['DateTime']['input'];
  goalName: Scalars['String']['input'];
};


export type MutationCreateUserArgs = {
  email: Scalars['String']['input'];
  fullname: Scalars['String']['input'];
};


export type MutationDeleteGoalArgs = {
  name: Scalars['String']['input'];
};


export type MutationRenameGoalArgs = {
  currentGoalName: Scalars['String']['input'];
  newGoalName: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  encouragement: EncouragementType;
  user: UserType;
  userStatus: Array<GoalStatusType>;
  users: Array<UserType>;
};


export type QueryUserStatusArgs = {
  dateToCheck: Scalars['DateTime']['input'];
  duration: DisplayDuration;
  goalName?: InputMaybe<Scalars['String']['input']>;
};

export type UserType = {
  __typename?: 'UserType';
  email: Scalars['String']['output'];
  fullname: Scalars['String']['output'];
  goals: Array<GoalType>;
  id: Scalars['Int']['output'];
};

export type WeeklyActivityType = {
  __typename?: 'WeeklyActivityType';
  count: Scalars['Int']['output'];
  goalId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  month: Scalars['Int']['output'];
  week: Scalars['Int']['output'];
  year: Scalars['Int']['output'];
};

export type YearlyActivityType = {
  __typename?: 'YearlyActivityType';
  count: Scalars['Int']['output'];
  goalId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  year: Scalars['Int']['output'];
};

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { __typename?: 'Query', user: { __typename?: 'UserType', email: string, fullname: string, goals: Array<{ __typename?: 'GoalType', name: string }> } };

export type CreateOrUpdateActivityMutationVariables = Exact<{
  goalName: Scalars['String']['input'];
  dateOfActivity: Scalars['DateTime']['input'];
  count: Scalars['Int']['input'];
}>;


export type CreateOrUpdateActivityMutation = { __typename?: 'Mutation', createOrUpdateActivity: { __typename?: 'GoalType', id: number, name: string, frequency: GoalFrequencyType, requiredActivitiesPerPeriod: number, dailyActivities: Array<{ __typename?: 'DailyActivityType', id: number, goalId: number, year: number, month: number, day: number, count: number }>, weeklyActivities: Array<{ __typename?: 'WeeklyActivityType', id: number, goalId: number, year: number, month: number, week: number, count: number }>, yearlyActivities: Array<{ __typename?: 'YearlyActivityType', id: number, goalId: number, year: number, count: number }> } };

export type CreateGoalMutationVariables = Exact<{
  goalName: Scalars['String']['input'];
  frequency: GoalFrequencyType;
  requiredActivitiesPerPeriod: Scalars['Int']['input'];
}>;


export type CreateGoalMutation = { __typename?: 'Mutation', createGoal: { __typename?: 'UserType', id: number, email: string, fullname: string, goals: Array<{ __typename?: 'GoalType', id: number, name: string, frequency: GoalFrequencyType, requiredActivitiesPerPeriod: number, dailyActivities: Array<{ __typename?: 'DailyActivityType', id: number, goalId: number, year: number, month: number, day: number, count: number }>, weeklyActivities: Array<{ __typename?: 'WeeklyActivityType', id: number, goalId: number, year: number, month: number, week: number, count: number }>, yearlyActivities: Array<{ __typename?: 'YearlyActivityType', id: number, goalId: number, year: number, count: number }> }> } };

export type AddGoalToUserMutationVariables = Exact<{
  additionalUserEmail: Scalars['String']['input'];
  goalName: Scalars['String']['input'];
}>;


export type AddGoalToUserMutation = { __typename?: 'Mutation', addGoalToUser: { __typename?: 'UserType', id: number, email: string, fullname: string, goals: Array<{ __typename?: 'GoalType', id: number, name: string, frequency: GoalFrequencyType, requiredActivitiesPerPeriod: number, dailyActivities: Array<{ __typename?: 'DailyActivityType', id: number, goalId: number, year: number, month: number, day: number, count: number }>, weeklyActivities: Array<{ __typename?: 'WeeklyActivityType', id: number, goalId: number, year: number, month: number, week: number, count: number }>, yearlyActivities: Array<{ __typename?: 'YearlyActivityType', id: number, goalId: number, year: number, count: number }> }> } };

export type DeleteGoalMutationVariables = Exact<{
  goalName: Scalars['String']['input'];
}>;


export type DeleteGoalMutation = { __typename?: 'Mutation', deleteGoal: { __typename?: 'UserType', id: number, email: string, fullname: string, goals: Array<{ __typename?: 'GoalType', id: number, name: string, frequency: GoalFrequencyType, requiredActivitiesPerPeriod: number, dailyActivities: Array<{ __typename?: 'DailyActivityType', id: number, goalId: number, year: number, month: number, day: number, count: number }>, weeklyActivities: Array<{ __typename?: 'WeeklyActivityType', id: number, goalId: number, year: number, month: number, week: number, count: number }>, yearlyActivities: Array<{ __typename?: 'YearlyActivityType', id: number, goalId: number, year: number, count: number }> }> } };

export type RenameGoalMutationVariables = Exact<{
  currentGoalName: Scalars['String']['input'];
  newGoalName: Scalars['String']['input'];
}>;


export type RenameGoalMutation = { __typename?: 'Mutation', renameGoal: { __typename?: 'GoalType', id: number, name: string, frequency: GoalFrequencyType, requiredActivitiesPerPeriod: number, dailyActivities: Array<{ __typename?: 'DailyActivityType', id: number, goalId: number, year: number, month: number, day: number, count: number }>, weeklyActivities: Array<{ __typename?: 'WeeklyActivityType', id: number, goalId: number, year: number, month: number, week: number, count: number }>, yearlyActivities: Array<{ __typename?: 'YearlyActivityType', id: number, goalId: number, year: number, count: number }> } };

export type GetEncouragementQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEncouragementQuery = { __typename?: 'Query', encouragement: { __typename?: 'EncouragementType', id: number, author: string, quote: string } };

export type GetUserStatusQueryVariables = Exact<{
  duration: DisplayDuration;
  dateToCheck: Scalars['DateTime']['input'];
}>;


export type GetUserStatusQuery = { __typename?: 'Query', userStatus: Array<{ __typename?: 'GoalStatusType', name: string, frequency: GoalFrequencyType, dates: Array<any>, statuses: Array<Array<ActivityStatus>> }> };


export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullname"}},{"kind":"Field","name":{"kind":"Name","value":"goals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const CreateOrUpdateActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOrUpdateActivity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"goalName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dateOfActivity"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"count"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOrUpdateActivity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"goalName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"goalName"}}},{"kind":"Argument","name":{"kind":"Name","value":"dateOfActivity"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateOfActivity"}}},{"kind":"Argument","name":{"kind":"Name","value":"count"},"value":{"kind":"Variable","name":{"kind":"Name","value":"count"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"requiredActivitiesPerPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"dailyActivities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"goalId"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"day"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"weeklyActivities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"goalId"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"week"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearlyActivities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"goalId"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<CreateOrUpdateActivityMutation, CreateOrUpdateActivityMutationVariables>;
export const CreateGoalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGoal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"goalName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"frequency"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GoalFrequencyType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requiredActivitiesPerPeriod"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGoal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"goalName"}}},{"kind":"Argument","name":{"kind":"Name","value":"frequency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"frequency"}}},{"kind":"Argument","name":{"kind":"Name","value":"requiredActivitiesPerPeriod"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requiredActivitiesPerPeriod"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullname"}},{"kind":"Field","name":{"kind":"Name","value":"goals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"requiredActivitiesPerPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"dailyActivities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"goalId"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"day"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"weeklyActivities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"goalId"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"week"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearlyActivities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"goalId"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateGoalMutation, CreateGoalMutationVariables>;
export const AddGoalToUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addGoalToUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"additionalUserEmail"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"goalName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addGoalToUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"additionalUserEmail"},"value":{"kind":"Variable","name":{"kind":"Name","value":"additionalUserEmail"}}},{"kind":"Argument","name":{"kind":"Name","value":"goalName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"goalName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullname"}},{"kind":"Field","name":{"kind":"Name","value":"goals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"requiredActivitiesPerPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"dailyActivities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"goalId"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"day"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"weeklyActivities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"goalId"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"week"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearlyActivities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"goalId"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AddGoalToUserMutation, AddGoalToUserMutationVariables>;
export const DeleteGoalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteGoal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"goalName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteGoal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"goalName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullname"}},{"kind":"Field","name":{"kind":"Name","value":"goals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"requiredActivitiesPerPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"dailyActivities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"goalId"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"day"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"weeklyActivities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"goalId"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"week"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearlyActivities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"goalId"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteGoalMutation, DeleteGoalMutationVariables>;
export const RenameGoalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"renameGoal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currentGoalName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newGoalName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renameGoal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"currentGoalName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currentGoalName"}}},{"kind":"Argument","name":{"kind":"Name","value":"newGoalName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newGoalName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"requiredActivitiesPerPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"dailyActivities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"goalId"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"day"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"weeklyActivities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"goalId"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"week"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yearlyActivities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"goalId"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<RenameGoalMutation, RenameGoalMutationVariables>;
export const GetEncouragementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getEncouragement"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"encouragement"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"quote"}}]}}]}}]} as unknown as DocumentNode<GetEncouragementQuery, GetEncouragementQueryVariables>;
export const GetUserStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"duration"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DisplayDuration"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dateToCheck"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"duration"},"value":{"kind":"Variable","name":{"kind":"Name","value":"duration"}}},{"kind":"Argument","name":{"kind":"Name","value":"dateToCheck"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateToCheck"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"dates"}},{"kind":"Field","name":{"kind":"Name","value":"statuses"}}]}}]}}]} as unknown as DocumentNode<GetUserStatusQuery, GetUserStatusQueryVariables>;
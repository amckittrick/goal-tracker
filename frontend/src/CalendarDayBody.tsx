import { ApolloError } from '@apollo/client';

import { GoalFrequencyType, GoalStatusType } from './__generated__/graphql.ts';

import CalendarDayBodyGoal from './CalendarDayBodyGoal.tsx';
import GQLLoading from './GQLLoading.tsx';
import GQLError from './GQLError.tsx';

export default function CalendarDayBody(
  {date, loading, error, userStatus}:
  {date: Date, loading: boolean, error: ApolloError | undefined, userStatus: GoalStatusType[] | undefined}
) {
  if (loading) return <GQLLoading></GQLLoading>;
  if (error) return <GQLError error={error}></GQLError>;
  if (!userStatus) return null;

  return (
    <div className="mx-1 flex-fill">
      <div className="d-flex vstack text-primary">
        <span>Daily Goals</span>
        {
          userStatus.map((goalStatus) =>
          (goalStatus.frequency == GoalFrequencyType.Daily) &&
            <CalendarDayBodyGoal
              key={goalStatus.name}
              goalStatus={goalStatus}
              date={date}>
            </CalendarDayBodyGoal>
          )
        }
        <span>Weekly Goals</span>
        {
          userStatus.map((goalStatus) =>
            (goalStatus.frequency == GoalFrequencyType.Weekly) &&
            <CalendarDayBodyGoal
              key={goalStatus.name}
              goalStatus={goalStatus}
              date={date}>
            </CalendarDayBodyGoal>
          )
        }
        <span>Yearly Goals</span>
        {
          userStatus.map((goalStatus) =>
            (goalStatus.frequency == GoalFrequencyType.Yearly) &&
            <CalendarDayBodyGoal
              key={goalStatus.name}
              goalStatus={goalStatus}
              date={date}>
            </CalendarDayBodyGoal>
          )
        }
      </div>
    </div>
  );
}
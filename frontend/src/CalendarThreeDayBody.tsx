import { ApolloError } from '@apollo/client';

import { GoalStatusType, GoalFrequencyType } from './__generated__/graphql.ts';

import CalendarThreeDayBodyGoal from './CalendarThreeDayBodyGoal.tsx';
import GQLLoading from './GQLLoading.tsx';
import GQLError from './GQLError.tsx';

export default function CalendarThreeDayBody(
  {currentUserEmail, loading, error, userStatus}:
  {currentUserEmail: string, loading: boolean, error: ApolloError | undefined, userStatus: GoalStatusType[] | undefined}
) {
  if (loading) return <GQLLoading></GQLLoading>;
  if (error) return <GQLError error={error}></GQLError>;
  if (!userStatus) return null;

  if (userStatus.length === 0) return null;

  const datesFromStrings: Date[] = userStatus[0].dates.map((dateFromDB) => new Date(Date.parse(dateFromDB)));

  return (
    <div className="container-xxl border border-primary">
      <div className="row p-0 text-primary">
        <div className="col-3 text-center">
          <span>
            Goal
          </span>
        </div>
        { datesFromStrings.map((date, index) =>
          <div className="col-3 border-start border-primary" key={index}>
            <div className="d-flex flex-column text-center">
              <span className="text-small-center">{date.toLocaleDateString("EN-US", {weekday: "short"})}</span>
              <span className="text-small-center">{date.toLocaleDateString("EN-US", {day: "numeric"})}</span>
            </div>
          </div>
        )}
      </div>
      {
        userStatus.map((goalStatus) =>
          (goalStatus.frequency == GoalFrequencyType.Daily) &&
          <CalendarThreeDayBodyGoal
            key={goalStatus.name}
            goalStatus={goalStatus}
            currentUserEmail={currentUserEmail}>
          </CalendarThreeDayBodyGoal>
        )
      }
      {
        userStatus.map((goalStatus) =>
          (goalStatus.frequency == GoalFrequencyType.Weekly) &&
          <CalendarThreeDayBodyGoal
            key={goalStatus.name}
            goalStatus={goalStatus}
            currentUserEmail={currentUserEmail}>
          </CalendarThreeDayBodyGoal>
        )
      }
      {
        userStatus.map((goalStatus) =>
          (goalStatus.frequency == GoalFrequencyType.Yearly) &&
          <CalendarThreeDayBodyGoal
            key={goalStatus.name}
            goalStatus={goalStatus}
            currentUserEmail={currentUserEmail}>
          </CalendarThreeDayBodyGoal>
        )
      }
    </div>
  );
}
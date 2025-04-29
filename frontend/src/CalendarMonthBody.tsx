import { ApolloError } from '@apollo/client';

import { GoalFrequencyType, GoalStatusType } from './__generated__/graphql.ts';

import GQLError from './GQLError.tsx';
import GQLLoading from './GQLLoading.tsx';
import CalendarMonthBodySingleDay from './CalendarMonthBodySingleDay.tsx';
import CalendarMonthBodySingleWeek from './CalendarMonthBodySingleWeek.tsx';

import "./CalendarMonth.css"

function Render(goalStatus: GoalStatusType | null, currentUserEmail: string) {
  if (goalStatus === null) return [];

  const elements = [];

  const daysToDisplay: Date[] = goalStatus.dates.map((dateFromDB) => new Date(Date.parse(dateFromDB)));

  for (let i = 0; i < goalStatus.statuses.length; i++) {
    switch (goalStatus.frequency) {
      case GoalFrequencyType.Daily:
        elements.push(
          <CalendarMonthBodySingleDay
            key={`LastMonth${i}`}
            activityStatus={goalStatus.statuses[i]}
            goalName={goalStatus.name}
            date={daysToDisplay[i]}
            currentUserEmail={currentUserEmail}>
          </CalendarMonthBodySingleDay>
        )
        break;
      case GoalFrequencyType.Weekly:
        elements.push(
          <CalendarMonthBodySingleWeek
            key={`LastMonth${i}`}
            activityStatus={goalStatus.statuses[i]}
            goalName={goalStatus.name}
            date={daysToDisplay[i]}
            currentUserEmail={currentUserEmail}>
          </CalendarMonthBodySingleWeek>
        )
        break;
    }
  }

  return elements;
}

export default function CalendarMonthBody(
  {currentUserEmail, loading, error, userStatus, goalName}:
  {currentUserEmail: string, loading: boolean, error: ApolloError | undefined, userStatus: GoalStatusType[] | undefined, goalName: string | null}
) {

  if (loading) return (
    <ul className="calendar-dates d-flex flex-wrap p-0">
      <GQLLoading></GQLLoading>
    </ul>
  );
  if (error) return <GQLError error={error}></GQLError>;
  if (!userStatus) return null;

  let goal: GoalStatusType | null = null;
  for (let i = 0; i < userStatus.length; i++) {
    if (userStatus[i].name === goalName) {
      goal = userStatus[i];
      break;
    }
  }

  return (
    <ul className="calendar-dates d-flex flex-wrap p-0">
      { Render(goal, currentUserEmail) }
    </ul>
  );
}
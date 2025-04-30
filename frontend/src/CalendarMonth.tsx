import { useQuery } from '@apollo/client';
import { useState } from 'react';

import { DisplayDuration, GoalFrequencyType } from './__generated__/graphql.ts';

import CalendarNavigation from './CalendarNavigation.tsx';
import CalendarMonthBody from './CalendarMonthBody.tsx';
import CalendarMonthGoalSelection from './CalendarMonthGoalSelection.tsx';
import { MONTHS } from './CalendarUtil.tsx';
import { gqlGetUserStatus } from './GQLQueries.tsx';

import "./CalendarMonth.css"

function handleCalendarNavigationClick(
  offset: number | null,
  currentDate: Date,
  setDate: React.Dispatch<React.SetStateAction<Date>>
) {
  if (offset === null) {
    setDate(new Date());
  } else {
  const newMonth = currentDate.getUTCMonth() + offset;
    if (newMonth < 0 || newMonth > 11) {
      const newDate = new Date(currentDate.getUTCFullYear(), newMonth, new Date().getDate())
      setDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setUTCMonth(newMonth);
      setDate(newDate);
    }
  }
};

export default function CalendarMonth() {
  const [date, setDate] = useState(new Date());
  const [goalName, setGoal] = useState<string | null>('');

  const { loading, error, data } = useQuery(gqlGetUserStatus, {
    variables: { duration: DisplayDuration.Month, dateToCheck: date}
  });

  const goalNameOptions: string[] = [];
  data?.userStatus.map((goalStatus) => {
    if (goalStatus.frequency == GoalFrequencyType.Daily || goalStatus.frequency == GoalFrequencyType.Weekly) {
      goalNameOptions.push(goalStatus.name);
    }
  });

  return (
    <div className="card mb-2 border-primary CalendarMonth">
      <div className="card-header p-1 bg-primary text-dark">
        <div className="d-flex flex-row justify-content-between align-items-center">
          <h5>{MONTHS[date.getUTCMonth()]} {date.getUTCFullYear()}</h5>
          <CalendarNavigation
            onClick={handleCalendarNavigationClick}
            currentDate={date}
            setDate={setDate}
            loading={loading}>
          </CalendarNavigation>
        </div>
      </div>
      <div className="card-body m-1 mb-2 p-0 bg-dark">
        <div className="calendar-container">
          <div className="calendar-body">
            <CalendarMonthGoalSelection goalNameOptions={goalNameOptions} setGoal={setGoal}></CalendarMonthGoalSelection>
            <ul className="calendar-weekdays d-flex flex-wrap p-0">
              <li>Sun</li>
              <li>Mon</li>
              <li>Tue</li>
              <li>Wed</li>
              <li>Thu</li>
              <li>Fri</li>
              <li>Sat</li>
            </ul>
            <CalendarMonthBody
              loading={loading}
              error={error}
              userStatus={data?.userStatus}
              goalName={goalName}>
            </CalendarMonthBody>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useQuery } from '@apollo/client';
import { useState } from 'react';

import { DisplayDuration } from './__generated__/graphql.ts';

import CalendarDayBody from './CalendarDayBody.tsx';
import CalendarNavigation from './CalendarNavigation.tsx';
import { gqlGetUserStatus } from './GQLQueries.tsx';

function HandleCalendarNavigationClick(
  offset: number | null,
  currentDate: Date,
  setDate: React.Dispatch<React.SetStateAction<Date>>
) {
  const newDate = new Date();
  if (offset !== null) {
    newDate.setDate(currentDate.getDate() + offset);
    setDate(newDate);
  }
  setDate(newDate);
};

export default function CalendarDay() {
  const [date, setDate] = useState(new Date());

  const { loading, error, data } = useQuery(gqlGetUserStatus, {
    variables: { duration: DisplayDuration.Day, dateToCheck: date.toISOString()}
  });

  return (
    <div className="card mb-2 border-primary">
      <div className="card-header p-1 bg-primary text-dark">
        <div className="d-flex flex-row justify-content-between align-items-center">
          <h5>{date.toLocaleDateString("EN-US", {weekday: "short", day: "numeric", month: "long"})}</h5>
          <CalendarNavigation
            onClick={HandleCalendarNavigationClick}
            currentDate={date}
            setDate={setDate}
            loading={loading}>
          </CalendarNavigation>
        </div>
      </div>
      <div className="card-body m-1 mb-2 p-0 bg-dark">
        <div className="d-flex p-0">
            <div className="mx-1 flex-fill">
              <CalendarDayBody
                date={date}
                loading={loading}
                error={error}
                userStatus={data?.userStatus}>
              </CalendarDayBody>
            </div>
        </div>
      </div>
    </div>
  );
}
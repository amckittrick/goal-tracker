import { useQuery } from '@apollo/client';
import { useState } from 'react';

import { DisplayDuration } from './__generated__/graphql.ts';

import CalendarNavigation from './CalendarNavigation.tsx';
import CalendarThreeDayBody from './CalendarThreeDayBody.tsx';
import { MONTHS } from './CalendarUtil.tsx';
import { gqlGetUserStatus } from './GQLQueries.tsx';

function handleCalendarNavigationClick(
  offset: number | null,
  currentDate: Date,
  setDate: React.Dispatch<React.SetStateAction<Date>>
) {

  if (offset === null) {
    setDate(new Date());
  } else {
    const newDate = new Date(currentDate);
    newDate.setUTCDate(newDate.getUTCDate() + offset);
    setDate(newDate);
  }
};

export default function CalendarThreeDay({currentUserEmail}: {currentUserEmail: string}) {
  const [date, setDate] = useState(new Date());

  const { loading, error, data } = useQuery(gqlGetUserStatus, {
    variables: { email: currentUserEmail, duration: DisplayDuration.ThreeDay, dateToCheck: date}
  });

  return (
    <div className="card mb-2 border-primary">
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
      <div className="card-block m-1 mb-2 p-0 bg-dark">
        <CalendarThreeDayBody
          currentUserEmail={currentUserEmail}
          loading={loading}
          error={error}
          userStatus={data?.userStatus}>
        </CalendarThreeDayBody>
      </div>
    </div>
  );
}
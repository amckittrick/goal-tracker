import { useMutation } from '@apollo/client';

import { ActivityStatus } from './__generated__/graphql.ts';

import { gqlCreateOrUpdateActivity, gqlGetUserStatus } from './GQLQueries.tsx';
import GQLLoading from './GQLLoading.tsx';

import "./CalendarMonthBodySingleWeek.css"

export default function CalendarMonthBodySingleWeek(
  {activityStatus, goalName, date, currentUserEmail}:
  {activityStatus: ActivityStatus[], goalName: string, date: Date, currentUserEmail: string}
) {
  const [CreateOrUpdateActivity, CreateOrUpdateActivityStatus] = useMutation(
    gqlCreateOrUpdateActivity,
    {
      refetchQueries: [
        gqlGetUserStatus
      ]
    }
  );

  if (CreateOrUpdateActivityStatus.loading) return <li><GQLLoading></GQLLoading></li>;
  if (CreateOrUpdateActivityStatus.error) return <p>Submission error : {CreateOrUpdateActivityStatus.error.message}</p>;

  const arrayOfDots: string[] = new Array(activityStatus.length);
  const dotBaseClass = "dot mx-1 p-0 btn";
  for (let i = 0; i < activityStatus.length; i ++) {
    switch (activityStatus[i]) {
      case ActivityStatus.Achieved:
        arrayOfDots[i] = dotBaseClass + " bg-success";
        break;
      case ActivityStatus.UnachievedPast:
        arrayOfDots[i] = dotBaseClass + " bg-danger";
        break;
      case ActivityStatus.UnachievedTodayOrFuture:
        arrayOfDots[i] = dotBaseClass + " bg-secondary";
        break
    }
  }

  const weekStart = new Date(date);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(date);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const count = activityStatus.filter((status) => status === ActivityStatus.Achieved).length;

  const today = new Date();
  const dateIsThisWeek = today >= weekStart && today <= weekEnd;

  return (
    <li
      className="flex-row w-100 CalendarMonthBodySingleWeek"
      data-testid={`CalendarMonthBodySingleWeek${date}`}>
      <div className="d-flex flex-column align-items-center">
        <p className={dateIsThisWeek ? 'today' : 'date-number'}>
            {weekStart.toLocaleDateString("EN-US", {day: "numeric", month: "short"})} - {weekEnd.toLocaleDateString("EN-US", {day: "numeric", month: "short"})}
        </p>
        <div className="row">
          {
            arrayOfDots.map((dotClass, index) =>
              <span
                key={index}
                className={dotClass}
                onClick={() => {
                  CreateOrUpdateActivity(
                    {
                      variables: {
                          ownerEmail: currentUserEmail,
                          goalName: goalName,
                          dateOfActivity: date,
                          count: count == index + 1 ? 0 : index + 1
                      }
                    }
                  );
                  }
                }
                data-testid={`CalendarMonthBodySingleWeekDot-${date.getUTCFullYear()}/${date.getUTCMonth()}/${date.getUTCDate()}-${index}`}>
              </span>
            )
          }
        </div>
      </div>
    </li>
  );
}
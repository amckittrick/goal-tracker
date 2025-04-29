import { useMutation } from '@apollo/client';

import { ActivityStatus } from './__generated__/graphql.ts';

import { gqlCreateOrUpdateActivity, gqlGetUserStatus } from './GQLQueries.tsx';
import GQLLoading from './GQLLoading.tsx';

import "./CalendarMonthBodySingleDay.css"

export default function CalendarMonthBodySingleDay(
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
  
  const count = activityStatus.filter((status) => status === ActivityStatus.Achieved).length;
  const today = new Date();
  const dateIsToday = date.getUTCFullYear() == today.getUTCFullYear() && date.getUTCMonth() == today.getUTCMonth() && date.getUTCDate() == today.getUTCDate();
  return (
    <li
      className="CalendarMonthBodySingleDay"
      data-testid={`CalendarMonthBodySingleDay${date}`}>
      <div className="d-flex flex-column align-items-center">
        <p className={dateIsToday ? 'today' : 'date-number'}>{date.toLocaleDateString("EN-US", {day: "numeric"})}</p>
        <div className="row">
          {
            arrayOfDots.map((dotClass, index) =>
              <button
                key={index}
                className={dotClass}
                onClick={
                  () => {
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
                data-testid={`CalendarMonthBodySingleDayDot-${date.getUTCFullYear()}/${date.getUTCMonth()}/${date.getUTCDate()}-${index}`}>
              </button>
            )
          }
        </div>
      </div>
    </li>
  );
}
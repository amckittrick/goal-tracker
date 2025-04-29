import { useMutation } from '@apollo/client';

import { ActivityStatus, GoalStatusType } from "./__generated__/graphql.ts"

import { gqlCreateOrUpdateActivity, gqlGetUserStatus } from './GQLQueries.tsx';
import GQLLoading from './GQLLoading.tsx';

import './CalendarThreeDayBodyGoal.css';

interface DayStatus {
  date: Date,
  dotClasses: string[],
  count: number
}

export default function CalendarThreeDayBodyGoal({goalStatus, currentUserEmail}: {goalStatus: GoalStatusType, currentUserEmail: string}) {
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

  const dayStatuses: DayStatus[] = [];

  // Iterate over each day to display
  for (let i = 0; i < goalStatus.statuses.length; i++) {
    const arrayOfDots: string[] = new Array(goalStatus.statuses[i].length);
    const dotBaseClass = "dot mx-1 p-0 btn";
    // Iterate over each required activity
    for (let j = 0; j < goalStatus.statuses[i].length; j ++) {
      switch (goalStatus.statuses[i][j]) {
        case ActivityStatus.Achieved:
          arrayOfDots[j] = dotBaseClass + " bg-success";
          break;
        case ActivityStatus.UnachievedPast:
          arrayOfDots[j] = dotBaseClass + " bg-danger";
          break;
        case ActivityStatus.UnachievedTodayOrFuture:
          arrayOfDots[j] = dotBaseClass + " bg-secondary";
          break
      }
    }
    
    const count = goalStatus.statuses[i].filter((status) => status === ActivityStatus.Achieved).length;

    dayStatuses.push({date: new Date(Date.parse(goalStatus.dates[i])), dotClasses: arrayOfDots, count: count})
  }



  return (
    <div className="row p-0 text-primary border-top border-primary CalendarThreeDayBodyGoal">
      <div className="col-3 text-center" style={{fontSize: "small"}}>{goalStatus.name}</div>
      {
        dayStatuses.map((dayStatus, index) =>
          <div
            key={index}
            className={goalStatus.statuses.length === 3 ? "col-3 text-center border-start border-primary" : "col-9 text-center border-start border-primary"}>
            {
              dayStatus.dotClasses.map((dotClass, index) =>
                <button
                    key={index}
                    className={dotClass}
                    onClick={() => {
                      CreateOrUpdateActivity(
                        {
                          variables: {
                            ownerEmail: currentUserEmail,
                            goalName: goalStatus.name,
                            dateOfActivity: dayStatus.date,
                            count: dayStatus.count == index + 1 ? 0 : index + 1
                          }
                        }
                      );
                    }
                  }
                  data-testid={`CalendarThreeDayBodyGoalDot-${dayStatus.date.getUTCFullYear()}/${dayStatus.date.getUTCMonth()}/${dayStatus.date.getUTCDate()}-${index}`}>
                </button>
              )
            }
          </div>
        )
      }
    </div>
  )
}
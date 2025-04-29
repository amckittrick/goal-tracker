import { useMutation } from '@apollo/client';

import { ActivityStatus, GoalStatusType } from "./__generated__/graphql.ts"

import { gqlCreateOrUpdateActivity, gqlGetUserStatus } from './GQLQueries.tsx';
import GQLLoading from './GQLLoading.tsx';

import './CalendarDayBodyGoal.css';

export default function CalendarDayBodyGoal({goalStatus, date, currentUserEmail}: {goalStatus: GoalStatusType, date: Date, currentUserEmail: string}) {
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

  const arrayOfDots: string[] = new Array(goalStatus.statuses[0].length);
  const dotBaseClass = "dot mx-1 p-0 btn";
  for (let i = 0; i < goalStatus.statuses[0].length; i ++) {
    switch (goalStatus.statuses[0][i]) {
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
  
  const count = goalStatus.statuses[0].filter((status) => status === ActivityStatus.Achieved).length;

  return (
    <div className="CalendarDayBodyGoal">
      <span>
        {goalStatus.name}
      </span>
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
                        goalName: goalStatus.name,
                        dateOfActivity: date,
                        count: count == index + 1 ? 0 : index + 1
                      },
                    },
                  );
                }
              }
              data-testid={`CalendarDayBodyGoalDot${index}`}>
          </button>
        )
      }
    </div>
  )
}
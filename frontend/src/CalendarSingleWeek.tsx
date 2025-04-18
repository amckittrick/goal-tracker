import { useMutation } from '@apollo/client';

import { ActivityType } from './__generated__/graphql.ts';

import { gqlCreateOrUpdateActivity } from './GQLQueries.tsx';
import GQLLoading from './GQLLoading.tsx';
import "./CalendarSingleWeek.css"

function GetDateActivityStatus(year: number, month: number, day: number, activities: ActivityType[], requiredActivitiesPerPeriod: number) {
  for (let i = 0; i < activities.length; i++) {
    const activity = activities[i];
    if (activity.completedYear == year && activity.completedMonth == month + 1 && activity.completedDay == day) {
      let className;
      if (activity.count >= requiredActivitiesPerPeriod) {
        className = "text-success";
      } else if (new Date(year, month, day) < new Date()) {
        className = "text-danger";
      } else {
        className = "text-secondary";
      }
      return { count: activity.count, className: className }
    }
  }
  return {
    count: 0,
    className: new Date(year, month, day) < new Date() ? "text-danger" : "text-secondary"
  }
}

export default function CalendarSingleWeek(
  {year, month, dateStart, dateEnd, activities, requiredActivitiesPerPeriod, goalName, username}:
  {year: number, month: number, dateStart: number, dateEnd: number, activities: ActivityType[], requiredActivitiesPerPeriod: number, goalName: string, username: string}
) {
  const [CreateOrUpdateActivity, CreateOrUpdateActivityStatus] = useMutation(gqlCreateOrUpdateActivity);

  if (CreateOrUpdateActivityStatus.loading) return <li><GQLLoading></GQLLoading></li>;
  if (CreateOrUpdateActivityStatus.error) return <p>Submission error : {CreateOrUpdateActivityStatus.error.message}</p>;

  const dateActivityStatus = GetDateActivityStatus(year, month, dateStart, activities, requiredActivitiesPerPeriod);

  const arrayOfDots: string[] = new Array(requiredActivitiesPerPeriod);
  for (let i = 0; i < arrayOfDots.length; i ++) {
    if (i < dateActivityStatus.count) {
      arrayOfDots[i] = "dot mx-1 p-0 bg-success";
    } else if (new Date(year, month, dateStart) < new Date()) {
      arrayOfDots[i] = "dot mx-1 p-0 bg-danger";
    } else {
      arrayOfDots[i] = "dot mx-1 p-0 bg-secondary";
    }
  }

  return (
    <li className="w-100">
      <div className="d-flex flex-column align-items-center">
        <p className={dateActivityStatus.className}>{dateStart} - {dateEnd}</p>
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
                          username: username,
                          goalName: goalName,
                          completedYear: year,
                          completedMonth: month + 1,
                          completedDay: dateStart,
                          count: dateActivityStatus.count == index + 1 ? 0 : index + 1
                      }
                    }
                  );
                  }
                }>
              </span>
            )
          }
        </div>
      </div>
    </li>
  );
}
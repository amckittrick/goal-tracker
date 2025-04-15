import { GoalType } from './__generated__/graphql.ts';

import ActivityCheckbox from './ActivityCheckbox.tsx';

export default function YearlyGoalProgress({ goal, username }: { goal: GoalType, username: string }) {
  interface YearEntry {
    symbol: string;
    yearCode: number;
    dateString: string;
    numberOfActivities: number;
  }

  const firstDayOfYear = new Date();
  firstDayOfYear.setMonth(1, 1);
  firstDayOfYear.setHours(0, 0, 0, 0);
  const yearEntry: YearEntry = {
    symbol: "bi bi-question-square-fill text-secondary",
    yearCode: firstDayOfYear.getUTCFullYear(),
    dateString: firstDayOfYear.toISOString(),
    numberOfActivities: 0,
  };

  goal.activities.map((activity) => {
      const activityCompletedString = activity.completed + 'Z';
      if (new Date(activityCompletedString).getUTCFullYear() == firstDayOfYear.getUTCFullYear()) {
        yearEntry.symbol = "bi bi-check-square-fill text-success";
        yearEntry.numberOfActivities = yearEntry.numberOfActivities + activity.count;
      }
  })

  return (
    <div className="mx-3 d-flex justify-content-between">
      <div className="mx-2">
        <p className="mb-1">{yearEntry.yearCode}</p>
        <div className="text-center">
          <ActivityCheckbox
            date={yearEntry.dateString}
            goalName={goal.name}
            username={username}
            numberOfActivities={yearEntry.numberOfActivities}
            requiredActivitiesPerPeriod={goal.requiredActivitiesPerPeriod}>
          </ActivityCheckbox>
        </div>
      </div>
    </div>
  )
}
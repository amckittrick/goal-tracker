import { GoalType } from './__generated__/graphql.ts';

import ActivityCheckbox from './ActivityCheckbox.tsx';

export default function YearlyGoalProgress({ goal, currentUserEmail }: { goal: GoalType, currentUserEmail: string }) {
  interface YearEntry {
    symbol: string;
    date: Date;
    numberOfActivities: number;
  }

  const firstDayOfYear = new Date();
  firstDayOfYear.setMonth(1, 1);
  firstDayOfYear.setHours(0, 0, 0, 0);
  const yearEntry: YearEntry = {
    symbol: "bi bi-question-square-fill text-secondary",
    date: firstDayOfYear,
    numberOfActivities: 0,
  };

  goal.activities.map((activity) => {
      if (activity.completedYear == firstDayOfYear.getUTCFullYear()) {
        yearEntry.numberOfActivities = yearEntry.numberOfActivities + activity.count;
      }
  })

  return (
    <div className="mx-3 d-flex justify-content-between text-primary">
      <div className="mx-2">
        <p className="mb-1">{yearEntry.date.getUTCFullYear()}</p>
        <div className="text-center">
          <ActivityCheckbox
            date={yearEntry.date}
            goalName={goal.name}
            currentUserEmail={currentUserEmail}
            numberOfActivities={yearEntry.numberOfActivities}
            requiredActivitiesPerPeriod={goal.requiredActivitiesPerPeriod}
            defaultSymbol={yearEntry.symbol}>
          </ActivityCheckbox>
        </div>
      </div>
    </div>
  )
}
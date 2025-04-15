import { GoalType } from './__generated__/graphql.ts';

import ActivityCheckbox from './ActivityCheckbox.tsx';
import { DayInWeek, GetMonday } from './Util.tsx';

function GetMonthDayString(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export default function WeeklyGoalProgress({ goal, username}: { goal: GoalType, username: string}) {
  interface WeekEntry {
    symbol: string;
    weekCode: string;
    dateString: string;
    numberOfActivities: number;
  }

  const today = new Date();
  let dayToCompareStartWeek = GetMonday();
  dayToCompareStartWeek.setDate(dayToCompareStartWeek.getDate() - 21);
  let dayToCompareEndWeek = new Date(dayToCompareStartWeek);
  dayToCompareEndWeek.setDate(dayToCompareEndWeek.getDate() + 6);
  dayToCompareEndWeek.setHours(23, 59, 59, 999)
  const symbols: WeekEntry[] = [];
  for (let i = 0; i < 4; i++) {
    if (today <= dayToCompareEndWeek) {
      symbols[i] = {
        symbol: "bi bi-question-square-fill text-secondary",
        weekCode: GetMonthDayString(dayToCompareStartWeek),
        dateString: dayToCompareStartWeek.toISOString(),
        numberOfActivities: 0,
      };
    } else {
      symbols[i] = {
        symbol: "bi bi-x-square-fill text-danger position-absolute",
        weekCode: GetMonthDayString(dayToCompareStartWeek),
        dateString: dayToCompareStartWeek.toISOString(),
        numberOfActivities: 0,
      };
    }
    goal.activities.map((activity) => {
      const activityCompletedString = activity.completed + 'Z';
      if (DayInWeek(dayToCompareStartWeek, dayToCompareEndWeek, new Date(activityCompletedString)) === true) {
        symbols[i].symbol = "bi bi-check-square-fill text-success";
        symbols[i].numberOfActivities = symbols[i].numberOfActivities + activity.count;
      }
    })
    dayToCompareStartWeek = new Date(dayToCompareStartWeek.setDate(dayToCompareStartWeek.getDate() + 7));
    dayToCompareEndWeek = new Date(dayToCompareEndWeek.setDate(dayToCompareEndWeek.getDate() + 7));
  }

  return(
    <div className="mx-3 d-flex justify-content-between">
      {symbols.map((weekEntry, index) => 
        <div key={index} className="mx-2">
          <p className="mb-1">{weekEntry.weekCode}</p>
          <div className="text-center">
            <ActivityCheckbox
              date={weekEntry.dateString}
              goalName={goal.name}
              username={username}
              numberOfActivities={weekEntry.numberOfActivities}
              requiredActivitiesPerPeriod={goal.requiredActivitiesPerPeriod}>
            </ActivityCheckbox>
          </div>
        </div>
      )}
    </div>
  )
}
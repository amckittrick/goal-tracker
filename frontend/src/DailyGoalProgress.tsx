import { GoalType } from './__generated__/graphql.ts';

import ActivityCheckbox from './ActivityCheckbox.tsx';

export function DayMonthYearEqual(dateOne: Date, dateTwo: Date) {
  return (
    dateOne.getUTCFullYear() == dateTwo.getUTCFullYear() &&
    dateOne.getUTCMonth() == dateTwo.getUTCMonth() &&
    dateOne.getUTCDate() == dateTwo.getUTCDate()
  )
}

export default function DailyGoalProgress({ goal, username }: { goal: GoalType, username: string }) {
  interface DayEntry {
    symbol: string;
    dayCode: string;
    numberOfActivities: number
    dateString: string,
  }

  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day == 0 ? -6 : 1); // Adjust when day is sunday
  let dayToCompare = new Date();
  dayToCompare.setDate(diff);
  dayToCompare.setHours(0, 0, 0, 0);
  const symbols: DayEntry[] = [];
  const dayCodes: string[] = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  for (let i = 0; i < 7; i++) {
    if (today <= dayToCompare) {
      symbols[i] = {
        symbol: "bi bi-question-square-fill text-secondary",
        dayCode: dayCodes[i],
        numberOfActivities: 0,
        dateString: dayToCompare.toISOString(),
      };
    } else {
      symbols[i] = {
        symbol: "bi bi-x-square-fill text-danger",
        dayCode: dayCodes[i],
        numberOfActivities: 0,
        dateString: dayToCompare.toISOString(),
      };
    }
    goal.activities.map((activity) => {
      const activityCompletedString = activity.completed + 'Z';
      if (DayMonthYearEqual(dayToCompare, new Date(activityCompletedString)) === true) {
        symbols[i].symbol = "bi bi-check-square-fill text-success";
        symbols[i].numberOfActivities = symbols[i].numberOfActivities + activity.count;
      }
    })
    dayToCompare = new Date(dayToCompare.setDate(dayToCompare.getDate() + 1));
  }

  return(
    <div className="mx-3 d-flex justify-content-between">
      {symbols.map((dayEntry, index) => 
        <div key={index} className="mx-2">
          <p className="mb-1">{dayEntry.dayCode}</p>
          <ActivityCheckbox
            date={dayEntry.dateString}
            goalName={goal.name}
            username={username}
            numberOfActivities={dayEntry.numberOfActivities}
            requiredActivitiesPerPeriod={goal.requiredActivitiesPerPeriod}>
          </ActivityCheckbox>
        </div>
      )}
    </div>
  )
}
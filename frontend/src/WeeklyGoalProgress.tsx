import { GoalType } from './__generated__/graphql.ts';

import { DayInWeek, GetMonday } from './Util.tsx';

function GetMonthDayString(date: Date) {
  return `${date.getMonth()}/${date.getDate()}`;
}

export default function DailyGoalProgress({ goal }: { goal: GoalType }) {
  interface DayEntry {
    symbol: string;
    weekCode: string;
  }

  const today = new Date();
  let dayToCompareStartWeek = GetMonday();
  dayToCompareStartWeek.setDate(dayToCompareStartWeek.getDate() - 21);
  let dayToCompareEndWeek = GetMonday();
  dayToCompareEndWeek.setDate(dayToCompareStartWeek.getDate() - 15);
  dayToCompareEndWeek.setHours(24, 59, 59, 999)
  const symbols: DayEntry[] = [];
  for (let i = 0; i < 4; i++) {
    if (today <= dayToCompareEndWeek) {
      symbols[i] = {
        symbol: "bi bi-question-square-fill text-secondary",
        weekCode: GetMonthDayString(dayToCompareStartWeek),
      };
    } else {
      symbols[i] = {
        symbol: "bi bi-x-square-fill text-danger position-absolute",
        weekCode: GetMonthDayString(dayToCompareStartWeek),
      };
    }
    goal.activities.map((activity) => {
      const activityCompletedString = activity.completed + 'Z';
      if (DayInWeek(dayToCompareStartWeek, dayToCompareEndWeek, new Date(activityCompletedString)) === true) {
        symbols[i] = {
          symbol: "bi bi-check-square-fill text-success",
          weekCode: GetMonthDayString(dayToCompareStartWeek),
        };
      }
    })
    dayToCompareStartWeek = new Date(dayToCompareStartWeek.setDate(dayToCompareStartWeek.getDate() + 7));
    dayToCompareEndWeek = new Date(dayToCompareEndWeek.setDate(dayToCompareEndWeek.getDate() + 7));
  }

  return(
    <div className="mx-3 d-flex justify-content-between">
      {symbols.map((dayEntry, index) => 
        <div id={`${index}`} className="mx-2">
          <p className="mb-1">{dayEntry.weekCode}</p>
          <div className="text-center">
            <i className={dayEntry.symbol}></i>
          </div>
        </div>
      )}
    </div>
  )
}
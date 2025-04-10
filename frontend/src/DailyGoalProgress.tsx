import { useMutation } from '@apollo/client';

import { GoalType } from './__generated__/graphql.ts';
import { gqlCreateActivity, gqlDeleteActivity } from './GQLQueries.tsx';

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
    achieved: boolean | null;
    dateString: string,
  }
  
  const [CreateActivity, createActivityStatus] = useMutation(gqlCreateActivity);
  const [DeleteActivity, deleteActivityStatus] = useMutation(gqlDeleteActivity);

  if (createActivityStatus.loading || deleteActivityStatus.loading) return <p>Loading ...</p>;
  if (createActivityStatus.error) return <p>Submission error : {createActivityStatus.error.message}</p>;
  if (deleteActivityStatus.error) return <p>Submission error : {deleteActivityStatus.error.message}</p>;

  const toggleAchieved = (dateToToggle: string, goalName: string, username: string, currentlyAchieved: boolean | null) => {
    if (currentlyAchieved === true) {
      DeleteActivity({ variables:{ username: username, goalName: goalName, date: dateToToggle}});
      
    } else {
      CreateActivity({ variables:{ username: username, goalName: goalName, completed: dateToToggle}});
    }
  };

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
        achieved: null,
        dateString: dayToCompare.toISOString(),
      };
    } else {
      symbols[i] = {
        symbol: "bi bi-x-square-fill text-danger",
        dayCode: dayCodes[i],
        achieved: false,
        dateString: dayToCompare.toISOString(),
      };
    }
    goal.activities.map((activity) => {
      const activityCompletedString = activity.completed + 'Z';
      if (DayMonthYearEqual(dayToCompare, new Date(activityCompletedString)) === true) {
        symbols[i].symbol = "bi bi-check-square-fill text-success";
        symbols[i].achieved = true;
      }
    })
    dayToCompare = new Date(dayToCompare.setDate(dayToCompare.getDate() + 1));
  }

  return(
    <div className="mx-3 d-flex justify-content-between">
      {symbols.map((dayEntry, index) => 
        <div key={index} className="mx-2" onClick={() => toggleAchieved(dayEntry.dateString, goal.name, username, dayEntry.achieved)}>
          <p className="mb-1">{dayEntry.dayCode}</p>
          <i className={dayEntry.symbol}></i>
        </div>
      )}
    </div>
  )
}
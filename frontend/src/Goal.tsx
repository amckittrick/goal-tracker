import { GoalType } from './__generated__/graphql.ts';

import Calendar from './Calendar.tsx';
import YearlyGoalProgress from './YearlyGoalProgress.tsx';

export default function Goal(
  {
    goal,
    goalFrequency,
    username,
    openModalEditGoal
  }:
  {
    goal: GoalType,
    goalFrequency: string,
    username: string,
    openModalEditGoal: ( data: { goalName: string }) => void
  }
) {

  return (
    <div>
      {
        goalFrequency === 'Daily' &&
        <Calendar
          activities={goal.activities}
          requiredActivitiesPerPeriod={goal.requiredActivitiesPerPeriod}
          goalName={goal.name}
          username={username}
          daily={true}
          openModalEditGoal={openModalEditGoal}>
        </Calendar>
      }
      {
        goalFrequency === 'Weekly' &&
        <Calendar
          activities={goal.activities}
          requiredActivitiesPerPeriod={goal.requiredActivitiesPerPeriod}
          goalName={goal.name}
          username={username}
          daily={false}
          openModalEditGoal={openModalEditGoal}>
        </Calendar>
      }
      {
        goalFrequency === 'Yearly' &&
        <YearlyGoalProgress goal={goal} username={username}></YearlyGoalProgress>
      }
    </div>
  )
}
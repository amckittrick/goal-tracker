import { GoalType } from './__generated__/graphql.ts';

import Calendar from './Calendar.tsx';
import YearlyGoalProgress from './YearlyGoalProgress.tsx';

export default function Goal(
  {
    goal,
    goalFrequency,
    currentUserEmail,
    openModalEditGoal
  }:
  {
    goal: GoalType,
    goalFrequency: string,
    currentUserEmail: string,
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
          currentUserEmail={currentUserEmail}
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
          currentUserEmail={currentUserEmail}
          daily={false}
          openModalEditGoal={openModalEditGoal}>
        </Calendar>
      }
      {
        goalFrequency === 'Yearly' &&
        <YearlyGoalProgress goal={goal} currentUserEmail={currentUserEmail}></YearlyGoalProgress>
      }
    </div>
  )
}
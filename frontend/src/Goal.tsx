import { GoalType } from './__generated__/graphql.ts';

import DailyGoalProgress from './DailyGoalProgress.tsx';
import WeeklyGoalProgress from './WeeklyGoalProgress.tsx';
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

  const handleEditGoalClick = () => {
    openModalEditGoal({ goalName: goal.name });
  };

  return (
    <div className="card mb-2">
      <div className="card-header p-1" id={`header_${goal.id}`}>
        <div className="d-flex">
          <div className="align-self-center m-1 flex-grow-1" style={{ width: "200px" }}>
            <h3>{goal.name}</h3>
          </div>
          <button type="button" className="p-1 m-1 btn" onClick={handleEditGoalClick}>
            <i className="bi bi-gear"></i>
          </button>
        </div>
        {
          goalFrequency === 'Daily' &&
          <DailyGoalProgress goal={goal} username={username}></DailyGoalProgress>
        }
        {
          goalFrequency === 'Weekly' &&
          <WeeklyGoalProgress goal={goal} username={username}></WeeklyGoalProgress>
        }
        {
          goalFrequency === 'Yearly' &&
          <YearlyGoalProgress goal={goal} username={username}></YearlyGoalProgress>
        }
      </div>
    </div>
  )
}
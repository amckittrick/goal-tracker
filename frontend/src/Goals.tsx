import { useQuery } from '@apollo/client';
import { GoalType } from './__generated__/graphql.ts';

import Goal from './Goal.tsx';
import { gqlGetUserGoals } from './GQLQueries.tsx';

function chunk(arr: GoalType[], size: number) {
  const newArr = [];
  for (let i = 0; i < arr.length; i += size) {
    newArr.push(arr.slice(i, i+size));
  }
  return newArr;
}

export default function Goals(
  {
    username,
    openModalEditGoal,
    openModalCreateGoal
  }:
  {
    username: string,
    openModalEditGoal: (data: { goalName: string } ) => void,
    openModalCreateGoal: () => void
  }
) {

  const handleCreateGoalClick = () => {
    openModalCreateGoal();
  };

  const { loading, error, data } = useQuery(gqlGetUserGoals, {
    variables: { username }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  let chunkedGoals: GoalType[][] = [];

  if (data) {
    chunkedGoals = chunk(data.userGoals, 2);
  }

  return (
    <div>
        <div className="d-flex">
          <button type="button" className="mb-2 btn btn-secondary btn-sm" onClick={handleCreateGoalClick}>
            Create Goal
            <i className="mx-2 bi bi-journal-plus"></i>
          </button>
        </div>
        {chunkedGoals.map((goalRow, index) =>
          <div className="row" key={index}>
            {goalRow.map((goal) =>
              <div key={goal.id} className={goal.goalFrequency.name === 'Daily' ? "col-md-6 col-sm-12" : "col-12"}>
                <Goal
                  goal={goal}
                  goalFrequency={goal.goalFrequency.name}
                  username={username}
                  openModalEditGoal={openModalEditGoal}>
                </Goal>
              </div>
            )}
          </div>
        )}
    </div>
  )
}

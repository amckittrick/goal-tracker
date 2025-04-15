import { useQuery } from '@apollo/client';

import Goal from './Goal.tsx';
import { gqlGetUserGoals } from './GQLQueries.tsx';

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

  return (
    <div>
        <div className="d-flex">
          <button type="button" className="mb-2 btn btn-secondary btn-sm" onClick={handleCreateGoalClick}>
            Create Goal
            <i className="mx-2 bi bi-journal-plus"></i>
          </button>
        </div>
        <div className="row">
          {data?.userGoals.map((goal) =>
            <div key={goal.id} className="col-md-6 col-sm-12">
              <Goal
                goal={goal}
                goalFrequency={goal.goalFrequency.name}
                username={username}
                openModalEditGoal={openModalEditGoal}>
              </Goal>
            </div>
          )}
        </div>
    </div>
  )
}

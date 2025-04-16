import { useMutation } from '@apollo/client';

import { gqlCreateOrUpdateActivity } from './GQLQueries.tsx';

export default function ActivityCheckbox(
  {date, goalName, username, numberOfActivities, requiredActivitiesPerPeriod} :
  {date: string, goalName: string, username: string, numberOfActivities: number, requiredActivitiesPerPeriod: number}
) {
  const [CreateOrUpdateActivity, CreateOrUpdateActivityStatus] = useMutation(gqlCreateOrUpdateActivity);

  if (CreateOrUpdateActivityStatus.loading) return <p>Loading ...</p>;
  if (CreateOrUpdateActivityStatus.error) return <p>Submission error : {CreateOrUpdateActivityStatus.error.message}</p>;

  const toggleAchieved = (dateToToggle: string, goalName: string, username: string, currentCount: number, newCount: number) => {
    if (currentCount == newCount) {
      CreateOrUpdateActivity({ variables:{ username: username, goalName: goalName, completed: dateToToggle, count: 0}});
    } else {
      CreateOrUpdateActivity({ variables:{ username: username, goalName: goalName, completed: dateToToggle, count: newCount}});
    }
  };

  const itemsToRepeat = new Array(requiredActivitiesPerPeriod).fill('');

  return (
    <div className="vstack">
      {itemsToRepeat.map((_, index) => 
        <i
          key={index}
          className={index >= numberOfActivities ? 'bi bi-x-square-fill text-danger' : 'bi bi-check-square-fill text-success'}
          onClick={() => toggleAchieved(date, goalName, username, numberOfActivities, index + 1)}>
        </i>
      )}
    </div>
  )
}

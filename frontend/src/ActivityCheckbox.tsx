import { useMutation } from '@apollo/client';

import { gqlCreateOrUpdateActivity } from './GQLQueries.tsx';
import GQLLoading from './GQLLoading.tsx';

export default function ActivityCheckbox(
  {
    date,
    goalName,
    currentUserEmail,
    numberOfActivities,
    requiredActivitiesPerPeriod,
    defaultSymbol
  } :
  {
    date: Date,
    goalName: string,
    currentUserEmail: string,
    numberOfActivities: number,
    requiredActivitiesPerPeriod: number,
    defaultSymbol: string
  }
) {
  const [CreateOrUpdateActivity, CreateOrUpdateActivityStatus] = useMutation(gqlCreateOrUpdateActivity);

  if (CreateOrUpdateActivityStatus.loading) return <GQLLoading></GQLLoading>;
  if (CreateOrUpdateActivityStatus.error) return <p>Submission error : {CreateOrUpdateActivityStatus.error.message}</p>;

  const toggleAchieved = (date: Date, goalName: string, currentUserEmail: string, currentCount: number, newCount: number) => {
    const countToSet = currentCount == newCount ? 0 : newCount;
    CreateOrUpdateActivity(
      {
        variables: {
          ownerEmail: currentUserEmail,
          goalName: goalName,
          completedYear: date.getUTCFullYear(),
          completedMonth: date.getUTCMonth() + 1,
          completedDay: date.getUTCDate(),
          count: countToSet
        }
      }
    );
  };

  const itemsToRepeat = new Array(requiredActivitiesPerPeriod).fill('');

  return (
    <div className="vstack">
      {itemsToRepeat.map((_, index) => 
        <i
          key={index}
          className={index >= numberOfActivities ? defaultSymbol : 'bi bi-check-square-fill text-success'}
          onClick={() => toggleAchieved(date, goalName, currentUserEmail, numberOfActivities, index + 1)}>
        </i>
      )}
    </div>
  )
}

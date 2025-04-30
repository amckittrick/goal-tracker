import { useMutation } from '@apollo/client';

import { gqlDeleteGoal, gqlGetUserStatus } from './GQLQueries';
import GQLError from './GQLError';

export default function ModalEditGoalDelete(
  { goalName, closeModal}: { goalName: string | null, closeModal: () => void }
) {
  const [deleteGoal, { loading, error }] = useMutation(
    gqlDeleteGoal,
    {
      refetchQueries: [
        gqlGetUserStatus
      ]
    }
  );

  if (loading) return <p>Submitting...</p>;
  if (error) return <GQLError error={error}></GQLError>;

  if (goalName === null) return null;

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        deleteGoal({ variables:{ goalName: goalName}});
        closeModal();
      }}>
      <h5>Delete</h5>
      <button type="submit" className="btn btn-secondary btn-sm my-2">
        Delete
        <i className="mx-1 bi bi-trash"></i>
      </button>
    </form>
  );
}

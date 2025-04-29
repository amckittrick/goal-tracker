import { useMutation } from '@apollo/client';

import { gqlDeleteGoal, gqlGetUserStatus } from './GQLQueries';

export default function ModalEditGoalDelete(
  { currentUserEmail, goalName, closeModal}: { currentUserEmail: string, goalName: string | null, closeModal: () => void }
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
  if (error) return <p>Submission error : {error.message}</p>;

  if (goalName === null) return null;

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        deleteGoal({ variables:{ goalName: goalName, ownerEmail: currentUserEmail}});
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

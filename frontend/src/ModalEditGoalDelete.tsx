import { useMutation } from '@apollo/client';

import { gqlDeleteGoal  } from './GQLQueries';

export default function ModalEditGoalDelete(
  { currentUserEmail, data, closeModal}: { currentUserEmail: string, data: { goalName: string }, closeModal: () => void }
) {
  const [deleteGoal, { loading, error }] = useMutation(gqlDeleteGoal);

  if (loading) return <p>Submitting...</p>;
  if (error) return <p>Submission error : {error.message}</p>;

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        deleteGoal({ variables:{ goalName: data.goalName, ownerEmail: currentUserEmail}});
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

import { useMutation } from '@apollo/client';
import React from 'react';

import { gqlRenameGoal, gqlGetUserStatus } from './GQLQueries';

export default function ModalEditGoalRenameGoal(
  { currentUserEmail, goalName, closeModal}: { currentUserEmail: string, goalName: string | null, closeModal: () => void }
) {
  const [renameGoal, { loading, error }] = useMutation(
    gqlRenameGoal,
    {
      refetchQueries: [
        gqlGetUserStatus
      ]
    }
  );

  const [newGoalName, setNewGoalName] = React.useState('');

  if (loading) return <p>Submitting...</p>;
  if (error) return <p>Submission error : {error.message}</p>;

  if (goalName === null) return null;

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        renameGoal({ variables:{ currentGoalName: goalName, ownerEmail: currentUserEmail, newGoalName: newGoalName}});
        closeModal();
      }}>
      <div className="mb-3">
        <h5>Rename</h5>
        <label htmlFor="modalEditGoalRenameGoal" className="form-label">New Name</label>
        <input
          type="text"
          className="form-control"
          id="modalEditGoalRenameGoal"
          aria-describedby="nameHelp"
          value={newGoalName}
          onChange={(event) => {
            setNewGoalName(event.target.value);
          }}>
        </input>
        <div id="nameHelp" className="form-text">Enter the new name for this goal.</div>
        <button type="submit" className="btn btn-secondary btn-sm my-2">
            Rename
            <i className="mx-1 bi bi-pencil"></i>
          </button>
      </div>
    </form>
  );
}

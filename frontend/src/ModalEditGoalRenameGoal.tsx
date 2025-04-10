import { useMutation } from '@apollo/client';
import React from 'react';

import { gqlRenameGoal } from './GQLQueries';

export default function ModalEditGoalRenameGoal(
  { username, data, closeModal}: { username: string, data: { goalName: string }, closeModal: () => void }
) {
  const [renameGoal, { loading, error }] = useMutation(gqlRenameGoal);

  const [newGoalName, setNewGoalName] = React.useState('');

  if (loading) return <p>Submitting...</p>;
  if (error) return <p>Submission error : {error.message}</p>;

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        renameGoal({ variables:{ currentGoalName: data.goalName, username: username, newGoalName: newGoalName}});
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

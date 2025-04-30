import { useMutation } from '@apollo/client';
import React from 'react';

import { gqlAddGoalToUser } from './GQLQueries';

export default function ModalEditGoalAddUser(
  { goalName, closeModal}: { goalName: string | null, closeModal: () => void }
) {
  const [addGoalToUser, addGoalToUserStatus] = useMutation(gqlAddGoalToUser);

  const [additionalUserEmail, setadditionalUserEmail] = React.useState('');

  if (addGoalToUserStatus.loading) return <p>Loading...</p>;
  if (addGoalToUserStatus.error) return <p>Error : {addGoalToUserStatus.error.message}</p>;

  if (goalName === null) return null;

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        addGoalToUser({ variables:{ goalName: goalName, additionalUserEmail: additionalUserEmail}});
        closeModal();
      }}>
      <div className="mb-3">
        <h5>Add User</h5>
        <label htmlFor="modalEditGoalAddUserNewUserEmail" className="form-label">Additional User Email address</label>
        <input
          type="email"
          className="form-control"
          id="modalEditGoalAddUserNewUserEmail"
          value={additionalUserEmail}
          onChange={(event) => {
            setadditionalUserEmail(event.target.value);
          }}>
        </input>
        <button type="submit" className="btn btn-secondary btn-sm my-2">
          Add
          <i className="mx-1 bi bi-person-add"></i>
        </button>
      </div>
    </form>
  );
}

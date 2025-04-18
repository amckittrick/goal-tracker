import { useMutation, useQuery } from '@apollo/client';
import React from 'react';

import { gqlAddGoalToUser, gqlGetUsers } from './GQLQueries';

export default function ModalEditGoalAddUser(
  { currentUserEmail, data, closeModal}: { currentUserEmail: string, data: { goalName: string }, closeModal: () => void }
) {
  const [addGoalToUser, addGoalToUserStatus] = useMutation(gqlAddGoalToUser);
  const [additionalUserEmail, setadditionalUserEmail] = React.useState('');

  const getUsersStatus = useQuery(gqlGetUsers);

  if (addGoalToUserStatus.loading || getUsersStatus.loading) return <p>Loading...</p>;
  if (addGoalToUserStatus.error) return <p>Error : {addGoalToUserStatus.error.message}</p>;
  if (getUsersStatus.error) return <p>Error : {getUsersStatus.error.message}</p>

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        addGoalToUser({ variables:{ goalName: data.goalName, ownerEmail: currentUserEmail, additionalUserEmail: additionalUserEmail}});
        closeModal();
      }}>
      <div className="mb-3">
        <h5>Add User</h5>
        <select
          className="form-select"
          aria-label="Additional User"
          onChange={(event) => {
            setadditionalUserEmail(event.target.value);
          }}>
          <option selected>Select Additional User</option>
          {
            getUsersStatus.data?.users.map((user) =>
              <option value={user.email}>{user.fullname}</option>
          )}
        </select>
        <button type="submit" className="btn btn-secondary btn-sm my-2">
          Add
          <i className="mx-1 bi bi-person-add"></i>
        </button>
      </div>
    </form>
  );
}

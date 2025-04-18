import { useMutation } from '@apollo/client';
import React from 'react';

import { gqlCreateUser } from './GQLQueries';

export default function ModalGeneralAdmin({ closeModal}: { closeModal: () => void }){
  const [inputUsername, setInputUsername] = React.useState("");
  const [inputFullname, setInputFullname] = React.useState("");

  const [CreateUser, { loading, error }] = useMutation(gqlCreateUser);
      
  if (loading) return <p>Submitting...</p>;
  if (error) return <p>Submission error : {error.message}</p>;

  return (
    <div>
      <div className="modal-backdrop" style={{opacity: 0.5 }}></div>
      <div className="modal show" style={{ display: 'block' }} id="modalCreateActivity">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Application Admin</h5>
              <button type="button" className="btn-close btn-close-white" onClick={closeModal} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={event => {
                  event.preventDefault();
                  CreateUser({ variables:{ username: inputUsername, fullname: inputFullname}});
                  setInputUsername('');
                  setInputFullname('');
                  closeModal();
                }}>
                <div className="mb-3">
                  <label htmlFor="modalGeneralAdminNewUserUsername" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="modalGeneralAdminNewUserUsername"
                    aria-describedby="newUserUsernameHelp"
                    value={inputUsername}
                    onChange={(event) => {
                      setInputUsername(event.target.value);
                    }}>
                  </input>
                  <div id="newUserUsernameHelp" className="form-text">Enter the username for the new user.</div>
                </div>
                <div className="mb-3">
                  <label htmlFor="modalGeneralAdminNewUserFullname" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="modalGeneralAdminNewUserFullname"
                    aria-describedby="newUserFullnameHelp"
                    value={inputFullname}
                    onChange={(event) => {
                      setInputFullname(event.target.value);
                    }}>
                  </input>
                  <div id="newUserFullnameHelp" className="form-text">Enter the full name for the new user.</div>
                </div>
                <button type="submit" className="btn btn-primary">Create New User</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';

import ModalEditGoalAddUser from './ModalEditGoalAddUser.tsx';
import ModalEditGoalDelete from './ModalEditGoalDelete.tsx';
import ModalEditGoalRenameGoal from './ModalEditGoalRenameGoal.tsx';

export default function ModalEditGoal(
  { currentUserEmail, closeModal, goalNames}: { currentUserEmail: string, closeModal: () => void, goalNames: string[] | undefined}
) {

  const [goalToEdit, setGoalToEdit] = useState<string | null>(null);

  return (
    <div>
      <div className="modal-backdrop" style={{opacity: 0.5 }}></div>
      <div className="modal show" style={{ display: 'block' }} id="modalEditGoal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Goals</h5>
              <button type="button" className="btn-close btn-close-white" onClick={closeModal} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              { goalNames !== undefined && (
                <div>
                  <select
                    className="form-select d-inline-block"
                    aria-label="Goal To View"
                    style={{maxWidth: "300px"}}
                    onChange={(event) => {
                      setGoalToEdit(event.target.value);
                    }}>
                    <option selected>Select Goal</option>
                    {
                      goalNames.map((goalName) =>
                      <option value={goalName}>{goalName}</option>
                    )}
                  </select>
                  <ModalEditGoalDelete currentUserEmail={currentUserEmail} goalName={goalToEdit} closeModal={closeModal}></ModalEditGoalDelete>
                  <hr></hr>
                  <ModalEditGoalAddUser currentUserEmail={currentUserEmail} goalName={goalToEdit} closeModal={closeModal}></ModalEditGoalAddUser>
                  <hr></hr>
                  <ModalEditGoalRenameGoal currentUserEmail={currentUserEmail} goalName={goalToEdit} closeModal={closeModal}></ModalEditGoalRenameGoal>
                </div>
                )
              }

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import ModalEditGoalAddUser from './ModalEditGoalAddUser.tsx';
import ModalEditGoalDelete from './ModalEditGoalDelete.tsx';
import ModalEditGoalRenameGoal from './ModalEditGoalRenameGoal.tsx';

export default function ModalEditGoal(
  { currentUserEmail, data, closeModal}: { currentUserEmail: string, data: { goalName: string }, closeModal: () => void }
) {

  return (
    <div>
      <div className="modal-backdrop" style={{opacity: 0.5 }}></div>
      <div className="modal show" style={{ display: 'block' }} id="modalEditGoal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit '{data.goalName}'</h5>
              <button type="button" className="btn-close btn-close-white" onClick={closeModal} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <ModalEditGoalDelete currentUserEmail={currentUserEmail} data={data} closeModal={closeModal}></ModalEditGoalDelete>
              <hr></hr>
              <ModalEditGoalAddUser currentUserEmail={currentUserEmail} data={data} closeModal={closeModal}></ModalEditGoalAddUser>
              <hr></hr>
              <ModalEditGoalRenameGoal currentUserEmail={currentUserEmail} data={data} closeModal={closeModal}></ModalEditGoalRenameGoal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

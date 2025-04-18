export default function ModalGeneralAdmin({ closeModal}: { closeModal: () => void }){
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

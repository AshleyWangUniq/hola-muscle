import type { ModalProps } from "../types/reuseableModal";

function reusableModal({ title, message, cancelButton, confirmButton } : ModalProps) {
    return <>
    <div className="modal d-block" tabIndex={-1}>
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title text-pink">{title}</h5>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    {cancelButton && <button type="button" className="btn btn-light me-1" onClick={cancelButton.buttonAction}>{cancelButton.buttonDisplay}</button>}
                    <button type="button" className="btn btn-pink" onClick={confirmButton.buttonAction}>{confirmButton.buttonDisplay}</button>
                </div>
            </div>
        </div>
    </div>
    </>
}

export default reusableModal;
import { useNavigate } from "react-router-dom";

export default function LogInReminder() {
    const navigate = useNavigate();
    return <>
        <div className="modal d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Please Log In</h5>
              </div>

              <div className="modal-body">
                You need to log in before creating a movement.
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {navigate("/");}}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Log In
                </button>
              </div>
            </div>
          </div>
        </div>
    </>
}
interface praps {
    setDisplay : React.Dispatch<React.SetStateAction<string | null>>
}

function LogInReminderModal(prap : praps) {
    return <>
    <div className="modal d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Please Log In</h5>
              </div>

              <div className="modal-body">
                You need to log in before creating an exercise.
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {prap.setDisplay(null);}}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    prap.setDisplay("LogIn");
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

export default LogInReminderModal;
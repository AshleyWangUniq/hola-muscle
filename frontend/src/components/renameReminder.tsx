/**
 * A reminder for the user to check their workout name, as it contains a default name.
 * 
 * @param useState
 */

interface propsType {
    name: string;
    updateName : React.Dispatch<React.SetStateAction<string>>;
}

function renameReminder({ name, updateName } : propsType) {
    function update(name : string) {
        updateName(name);
    }

    return (
        <>
        <div className="modal d-block" id="renameReminder" tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="text-pink">Default Workout Name</h5>
                    </div>
                    <div className="modal-body">
                        <input type="text" value={name} onChange={(e)=>{update(e.target.value)}}></input>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn-pink" data-dismiss="modal">Confirm</button>
                    </div>
                </div>
            </div>
            </div> 
        </>
    )
}

export default renameReminder;
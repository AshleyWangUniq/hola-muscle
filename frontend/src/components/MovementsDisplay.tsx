import { useEffect, useState } from 'react';
import { useMovements } from '../contexts/MovementContext';
import { Link, useNavigate  } from 'react-router-dom';
import ReusableModal from './ReusableModal';
import type { ModalProps } from '../types/reuseableModal';

interface bufferDeleting {
    working: boolean;
    confirmDel : boolean;
    warningDisplay: boolean;
    movementId: string;
}

interface MovementName {
    name : string;
}

function MovementsDisplay(name : MovementName) {
    const navigate = useNavigate();
    const {movements, deleteMovement} = useMovements();
    const confrimDel : ModalProps = {
        title : "Delete Movement?", 
        message : "Do you want to delete the movement?", 
        cancelButton : {buttonDisplay : "Cancel", buttonAction : ()=>resetBuffer()},
        confirmButton : {buttonDisplay : "Yes", buttonAction : ()=>deleteMov()}
    }
    const [infoSwitch, setSwitch] = useState(false);
    const deletedDisplay : ModalProps = {
        title : "Movement Deleted", 
        message : "Your movement is successfully deleted.", 
        confirmButton : {buttonDisplay : "Close", buttonAction : ()=>setSwitch(false)}
    }
    const [shoeDelete, setShowDelete] = useState(false);
    const deleted : ModalProps = {
        title :"Deleted",
        message:"Movement is successfully deleted",
        confirmButton:{buttonDisplay:"Close", buttonAction : ()=>setShowDelete(false)}
    }
const forceDel : ModalProps = {
        title : "Movement in Use", 
        message : "This movement is used in your workouts. Deleting it will also remove it from those workouts. Are you sure you want to continue?", 
        cancelButton : {buttonDisplay : "Cancel", buttonAction : ()=>resetBuffer()},
        confirmButton : {buttonDisplay : "Yes", buttonAction : ()=>confirmDelete()}
    }

    const muscle = name.name;
    const [deleteBuffer, setdeleteBuffer] = useState<bufferDeleting>({working: false, confirmDel: false, warningDisplay: false, movementId: ""});

    const displayMovements = muscle === "All" ? movements : movements.filter((mov) => mov.muscleGroups.includes(muscle));

    function resetBuffer() {
        console.log("restting");
        setdeleteBuffer({working: false, confirmDel:false, warningDisplay: false, movementId: ""});
    }

    // function takeBuffer(id:string) {
    //     console.log("warningDisplay setting");
    //     setdeleteBuffer(prev => ({...prev, warningDisplay: true, movementId : id}));
    //     // setdeleteBuffer({working: true, warningDisplay: true, movementId: id});
    // }

    //final step, run if movement is used by workout
    async function confirmDelete() {
        const response = await deleteMovement({id : deleteBuffer.movementId, forceDeletion : true});
        if (response && response.status === 200) {
            resetBuffer();
            setSwitch(true);
        }
    }

    // async function editMovement(id : string) {
    //     const response = await 
    // }

    // first step, show confirmation, set id
    function showDeleteModal(id : string) {
        setdeleteBuffer(prev => ({...prev, confirmDel:true, movementId: id}));
    }

    //second step, connect to backend to delete
    async function deleteMov() {
        const response = await deleteMovement({id : deleteBuffer.movementId, forceDeletion : false});
        console.log(response);
        if (response) {
            if (response.ok) {
                resetBuffer();
                // alert("Movement deleted.");
                setShowDelete(true);
            } else if (response.status === 409) {
                console.log("conflicting");
                setdeleteBuffer(prev => ({...prev, warningDisplay: true}));
                // takeBuffer(id);
            }
        }
    }

 
    return (
        <>
        <div>
            <button type ="button" onClick={() => {navigate("/NewMovement");}} className='float-end btn btn-pink'>New</button>
            <h1 className='text-pink'>{name.name}</h1>
            {displayMovements.length === 0 && <p className='text-pink'>No movement, click New <i className="bi bi-arrow-up-right-circle"></i> to generate your movement.<Link className="text-pink" to="/NewMovement">Generate here</Link></p>}
            
            <div>
                {displayMovements.map((mov)=>(
                    // (mov.muscleGroups.includes(muscle)) && 
                    <div className='card small-container' key={mov.name}>
                        <div className='card-body'> 
                            <div className='card-header d-flex justify-content-between'>
                            <h5 className='card-title text-pink'>{mov.name}</h5>
                            {/* </div> */}
                            {!mov.isPublic && 
                            <div className='btn-group'>
                                <button type="button" className='btn btn-sm me-1 btn-pink' onClick={() =>
                            navigate(`/EditMovement/${mov._id}`)
                        }>Edit</button>
                                <button type="button" className='btn btn-sm btn-pink' onClick={()=>showDeleteModal(mov._id)}>Delete</button>
                            </div>}
                            </div>
                            <p className='card-text'>{mov.description}</p>
                            <div className="card-footer">
                            <h6>Targmeted Muscle Groups: {mov.muscleGroups.map((muscle) => (
                                <span className='badge text-bg-pink me-1'>{muscle}</span>
                            ))}
                            </h6>
                            <h6>Equipment: {mov.equipment.map((equipment)=>(<span className='badge text-bg-pink me-1'>{equipment}</span>))}</h6>
                            </div>
                        </div>
                    </div>                        
                ))}
            </div>
        </div>
        {infoSwitch && <div><ReusableModal {...deletedDisplay} /></div>}

        {deleteBuffer.confirmDel && <div><ReusableModal {...confrimDel}/></div>}

        {deleteBuffer.warningDisplay && <div><ReusableModal {...forceDel}/></div>}

        {shoeDelete && <div><ReusableModal {...deleted} /></div>}

        {/* {deleteBuffer.warningDisplay && 
            <div className="modal d-block" tabIndex={-1}>
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-pink">Movement in Use</h5>
                    </div>
                    <div className="modal-body">
                        <p>This movement is used in your workouts. Deleting it will also remove it from those workouts. Are you sure you want to continue?</p>
                    </div>
                    <div className="modal-footer">
                        <div className='btn-group'>
                        <button type="button" className="btn btn-pink me-1" onClick={()=>confirmDelete()}>Force Delete</button>
                        <button type="button" className="btn btn-pink" onClick={()=>resetBuffer()}>Cancel</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        } */}
        </>
    );
}

export default MovementsDisplay;
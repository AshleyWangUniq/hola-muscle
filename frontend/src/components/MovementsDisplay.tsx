import { useState } from 'react';
import { useMovements } from '../contexts/MovementContext';
import type { Movement } from '../types/movement';


interface bufferDeleting {
    working: boolean;
    warningDisplay: boolean;
    movementId: string;
}

interface MovementName {
    name : string;
}

interface WorkoutName {
    name: string;
}

function MovementsDisplay(name : MovementName) {
    const {movements} = useMovements();
    const muscle = name.name;
    const [deleteBuffer, setdeleteBuffer] = useState<bufferDeleting>({working: false, warningDisplay: false, movementId: ""});
    const [deleteWarning, setDeleteWarning] = useState(false);
    const [affectedWorkouts, setAffectedWorkouts] = useState<WorkoutName[] | undefined>();
    // const [displayMovements, setDisplayMovements] = useState<Movement[]>();

    const displayMovements = muscle === "All" ? movements : movements.filter((mov) => mov.muscleGroups.includes(muscle));

    function resetBuffer() {
        console.log("restting");
        setdeleteBuffer({working: false, warningDisplay: false, movementId: ""});
        setAffectedWorkouts(undefined);
    }

    function takeBuffer(id:string) {
        setdeleteBuffer({working: true, warningDisplay: true, movementId: id});
    }

    async function forceDeletion() {
        try {
            console.log("force deleting");
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/movements/${deleteBuffer.movementId}?force=true`, {
                method: "DELETE",
                headers : {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (!res.ok) {
                
                throw new Error(data.message);
            } else {
                console.log("res is ok", data.message);
            }
        } catch(err) {
            console.log(err);
        } finally {
            resetBuffer();
        }
    }

    function editMovement(id : string) {

    }
    async function deleteMovement(id : string) {
        try {
            setdeleteBuffer({working: true, warningDisplay: true, movementId: id});
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/movements/${id}`, {
                method: "DELETE",
                headers : {
                    Authorization: `Bearer ${token}`
                }
            })
                const data = await res.json();

            if (res.ok) {
                console.log(data.message);
            } else {
                if (res.status === 409) {
                    console.log("Movement In Use");
                    takeBuffer(id);
                    // setDeleteWarning(true);
                    setAffectedWorkouts(data.workouts);
                } 
            }
        } catch(err) {
            console.log("no fkkking idea");
        }
    }

 
    return (
        <>
        <div>
            <h1 className='text-pink'>{name.name}</h1>
            <div>
                {displayMovements.map((mov)=>(
                    // (mov.muscleGroups.includes(muscle)) && 
                    <div className='card small-container' key={mov.name}>
                        <div className='card-body'> 
                            <h5 className='card-title text-pink'>{mov.name}</h5>
                            {!mov.isPublic && 
                            <div>
                                <button type="button" className='btn btn-sm btn-pink' onClick={()=>editMovement(mov._id)}>Edit</button>
                                <button type="button" className='btn btn-sm btn-pink' onClick={()=>deleteMovement(mov._id)}>Delete</button>
                            </div>}
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
        {/* {deleteBuffer.warningDisplay && <div>
            <p>Force Delete</p>
            {affectedWorkouts?.map((wk)=><p>{wk.name}</p>)}
            <button type="button" onClick={()=>forceDeletion()}>Force Delete</button>
            <button type="button" onClick={()=>resetBuffer()}>Cancel</button>
        </div>} */}
        {deleteBuffer.warningDisplay && 
            <div className="modal d-block" tabIndex={-1}>
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Movement in use!</h5>
                        {/* <button type="button" className="close" data-dismiss="modal" aria-label="Close"> */}
                        {/* <span aria-hidden="true">&times;</span> */}
                        {/* </button> */}
                    </div>
                    <div className="modal-body">
                        {/* {affectedWorkouts?.map((wk)=><p key="wk._id">{wk.name}</p>)} */}
                        <p>This movement is used in your workouts, delete movement will also remove it from your workouts. Do you still want to delete it?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn-pink" onClick={()=>forceDeletion()}>Force Delete</button>
                        <button type="button" className="btn-pink" onClick={()=>resetBuffer()}>Cancel</button>
                    </div>
                    </div>
                </div>
            </div>
        }
        </>
    );
}

export default MovementsDisplay;
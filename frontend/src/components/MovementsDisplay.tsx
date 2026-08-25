import { useEffect, useState } from 'react';
import { useMovements } from '../contexts/MovementContext';
import type { Movement } from '../types/movement';
import { Link } from 'react-router-dom';


interface bufferDeleting {
    working: boolean;
    warningDisplay: boolean;
    movementId: string;
}

interface MovementName {
    name : string;
}


function MovementsDisplay(name : MovementName) {
    const {movements} = useMovements();
    const muscle = name.name;
    const [deleteBuffer, setdeleteBuffer] = useState<bufferDeleting>({working: false, warningDisplay: false, movementId: ""});

    useEffect(()=>{

    },[]);

    const displayMovements = muscle === "All" ? movements : movements.filter((mov) => mov.muscleGroups.includes(muscle));

    function resetBuffer() {
        console.log("restting");
        setdeleteBuffer({working: false, warningDisplay: false, movementId: ""});
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
            {displayMovements.length === 0 && <p className='text-pink'>No movement, <Link className="text-pink" to="/NewMovement">Generate here</Link></p>}
            
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
                                <button type="button" className='btn btn-sm me-1 btn-pink' onClick={()=>editMovement(mov._id)}>Edit</button>
                                <button type="button" className='btn btn-sm btn-pink' onClick={()=>deleteMovement(mov._id)}>Delete</button>
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

        {deleteBuffer.warningDisplay && 
            <div className="modal d-block" tabIndex={-1}>
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-pink">Movement in Use</h5>
                        {/* <button type="button" className="close" data-dismiss="modal" aria-label="Close"> */}
                        {/* <span aria-hidden="true">&times;</span> */}
                        {/* </button> */}
                    </div>
                    <div className="modal-body">
                        <p>This movement is used in your workouts. Deleting it will also remove it from those workouts. Are you sure you want to continue?</p>
                    </div>
                    <div className="modal-footer">
                        <div className='btn-group'>
                        <button type="button" className="btn btn-pink me-1" onClick={()=>forceDeletion()}>Force Delete</button>
                        <button type="button" className="btn btn-pink" onClick={()=>resetBuffer()}>Cancel</button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        }
        </>
    );
}

export default MovementsDisplay;
import { useEffect, useState } from 'react';
import { useExercises } from '../contexts/ExerciseContext';
import { Link, useNavigate  } from 'react-router-dom';
import ReusableModal from './ReusableModal';
import type { ModalProps } from '../types/reuseableModal';

interface bufferDeleting {
    working: boolean;
    confirmDel : boolean;
    warningDisplay: boolean;
    exerciseId: string;
}

interface ExerciseName {
    name : string;
}


function ExerciseDisplay(name : ExerciseName) {
    const navigate = useNavigate();
    const {exercises, deleteExercise } = useExercises();
    console.log(exercises);
    const confrimDel : ModalProps = {
        title : "Delete Exercise?", 
        message : "Do you want to delete the exercise?", 
        cancelButton : {buttonDisplay : "Cancel", buttonAction : ()=>resetBuffer()},
        confirmButton : {buttonDisplay : "Yes", buttonAction : ()=>deleteEx()}
    }
    const [infoSwitch, setSwitch] = useState(false);
    const deletedDisplay : ModalProps = {
        title : "Exercise Deleted", 
        message : "Your exercise is successfully deleted.", 
        confirmButton : {buttonDisplay : "Close", buttonAction : ()=>setSwitch(false)}
    }
    const [shoeDelete, setShowDelete] = useState(false);
    const deleted : ModalProps = {
        title :"Deleted",
        message:"Exercise is successfully deleted",
        confirmButton:{buttonDisplay:"Close", buttonAction : ()=>setShowDelete(false)}
    }
const forceDel : ModalProps = {
        title : "Exercise in Use", 
        message : "This exercise is used in your workouts. Deleting it will also remove it from those workouts. Are you sure you want to continue?", 
        cancelButton : {buttonDisplay : "Cancel", buttonAction : ()=>resetBuffer()},
        confirmButton : {buttonDisplay : "Yes", buttonAction : ()=>confirmDelete()}
    }

    const muscle = name.name;
    const [deleteBuffer, setdeleteBuffer] = useState<bufferDeleting>({working: false, confirmDel: false, warningDisplay: false, exerciseId: ""});

    const displayExercises = muscle === "All" ? exercises : exercises.filter((exercise) => exercise.muscleGroups.includes(muscle));

    function resetBuffer() {
        console.log("restting");
        setdeleteBuffer({working: false, confirmDel:false, warningDisplay: false, exerciseId: ""});
    }

    async function confirmDelete() {
        const response = await deleteExercise({id : deleteBuffer.exerciseId, forceDeletion : true});
        if (response && response.status === 200) {
            resetBuffer();
            setSwitch(true);
        }
    }

    function showDeleteModal(id : string) {
        setdeleteBuffer(prev => ({...prev, confirmDel:true, exerciseId: id}));
    }

    //second step, connect to backend to delete
    async function deleteEx() {
        const response = await deleteExercise({id : deleteBuffer.exerciseId, forceDeletion : false});
        console.log(response);
        if (response) {
            if (response.ok) {
                resetBuffer();
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
            <button type ="button" onClick={() => {navigate("/NewExercise");}} className='float-end btn btn-pink'>New</button>
            <h1 className='text-pink'>{name.name}</h1>
            {displayExercises.length === 0 && <p className='text-pink'>No exercise, click New <i className="bi bi-arrow-up-right-circle"></i> to generate your exercise.<Link className="text-pink" to="/NewExercise">Generate here</Link></p>}
            
            <div>
                {displayExercises.map((exercise)=>(
                    // (mov.muscleGroups.includes(muscle)) && 
                    <div className='card small-container' key={exercise.name}>
                        <div className='card-body'> 
                            <div className='card-header d-flex justify-content-between'>
                            <h5 className='card-title text-pink'>{exercise.name}</h5>
                            {/* </div> */}
                            {!exercise.isPublic && 
                            <div className='btn-group'>
                                <button type="button" className='btn btn-sm me-1 btn-pink' onClick={() =>
                            navigate(`/EditExercise/${exercise._id}`)
                        }>Edit</button>
                                <button type="button" className='btn btn-sm btn-pink' onClick={()=>showDeleteModal(exercise._id)}>Delete</button>
                            </div>}
                            </div>
                            <p className='card-text'>{exercise.description}</p>
                            <div className="card-footer">
                            <h6>Targmeted Muscle Groups: {exercise.muscleGroups.map((muscle) => (
                                <span className='badge text-bg-pink me-1'>{muscle}</span>
                            ))}
                            </h6>
                            <h6>Equipment: {exercise.equipment.map((equipment)=>(<span className='badge text-bg-pink me-1'>{equipment}</span>))}</h6>
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

        </>
    );
}

export default ExerciseDisplay;
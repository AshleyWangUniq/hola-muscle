import { useExercises } from "../contexts/ExerciseContext";

interface exerciseModal {
    id : string;
    closeThis : () => void;
}

function ExerciseDetailModal(props : exerciseModal) {

    
    const {findExerciseById} = useExercises();
    const exercise = findExerciseById(props.id);
    if (!exercise) {
        
        props.closeThis();
        return ;
    }
    console.log(exercise);
    return <>
    <div className="modal d-flex" id={props.id} tabIndex={-1}>
    <div className="modal-dialog modal-lg">
        <div className="modal-content">
            <div className="modal-header background-pink">
                <button type="button" className="btn text-pink float-end" onClick={()=>props.closeThis()}><i className="bi bi-x-circle"></i></button>
                <h5 className='card-title text-pink'>{exercise.name}</h5>
            </div>
            <div className="modal-body">
                <p>{exercise.description}</p>
            </div>
            <div className="modal-footer">
                <h6>Targmeted Muscle Groups: {exercise.muscleGroups.map((muscle) => (
                    <span className='badge text-bg-pink me-1'>{muscle}</span>
                ))}
                </h6>
                <h6>Equipment: {exercise.equipment.map((equipment)=>(<span className='badge text-bg-pink me-1'>{equipment}</span>))}</h6>
            </div>
        </div>
    </div>
</div>
</>
}

export default ExerciseDetailModal;
import { useMovements } from "../contexts/MovementContext";

interface movementModal {
    id : string;
    closeThis : () => void;
}

function MovementDetailModal(props : movementModal) {

    
    const {findMovementById} = useMovements();
    const movement = findMovementById(props.id);
    if (!movement) {
        
        props.closeThis();
        return ;
    }
    console.log(movement);
    return <>
    <div className="modal d-flex" id={props.id} tabIndex={-1}>
    <div className="modal-dialog modal-lg">
        <div className="modal-content">
            <div className="modal-header">
                <button type="button" className="btn text-pink float-end" onClick={()=>props.closeThis()}><i className="bi bi-x-circle"></i></button>
                <h5 className='card-title text-pink'>{movement.name}</h5>
            </div>
            <div className="modal-body">
                <p>{movement.description}</p>
            </div>
            <div className="modal-footer">
                <h6>Targmeted Muscle Groups: {movement.muscleGroups.map((muscle) => (
                    <span className='badge text-bg-pink me-1'>{muscle}</span>
                ))}
                </h6>
                <h6>Equipment: {movement.equipment.map((equipment)=>(<span className='badge text-bg-pink me-1'>{equipment}</span>))}</h6>
            </div>
        </div>
    </div>
</div>
</>
}

export default MovementDetailModal;
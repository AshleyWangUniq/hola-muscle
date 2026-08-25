import { useNavigate } from "react-router-dom";
import { useWorkouts } from "../contexts/WorkoutContext";
import WorkoutDetail from "../Pages/WorkoutDetail";
import { useState } from "react";

function WorkoutDisplay() {
    const {workouts, deleteWorkout} = useWorkouts();
    const navigate = useNavigate();
    const [deleteId, setDeleteId] = useState<string | null>(null);

    async function deleteThis(id : string) {
        deleteWorkout(id);
        setDeleteId(null);
    }

    return <>
    {workouts.map((w)=>(
        <div> 
            <div className="card small-container" key={w.name}>
                <div className="card-header">
                    <h5 className="text-pink">{w.name}</h5>
                </div>
                <div className="card-body">
                    <p className="card-text">Difficulty: <span className="badge btn-pink me-1">{w.difficulty}</span></p>
                    <p className="card-text">Targeted Muscle Groups: {w.muscleGroups.map((muscle)=>(<span className="badge btn-pink me-1">{muscle}</span>))}</p>
                    <p className="card-text">Goals: {w.goal.map((goal)=>(<span className="badge btn-pink me-1">{goal}</span>))}</p>
                    
                </div>
                <div className="card-footer">
<button type="button" className="btn btn-pink btn-sm"
                        onClick={() =>
                            navigate("/WorkoutDetail", {
                                state: { workout: w }
                            })
                        }
                    >
                        Detail
                    </button>
                    <button id="w._id" className="btn btn-pink btn-sm" onClick={()=>(setDeleteId(w._id))}>Delete</button>
                </div>
            </div>
        </div>
))}
{deleteId && (<div className="modal d-block">
    <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="text-pink">Delete?</h5>
            </div>
            <div className="modal-body">
                <p>Do you want to delete this workout?</p>
            </div>
            <div className="modal-footer">
                <button onClick={()=>deleteThis(deleteId)}>Delete</button>
                <button onClick={()=>setDeleteId(null)}>Cancel</button>
            </div>
        </div>
    </div>
</div>)}

    </>;
    
}

export default WorkoutDisplay;



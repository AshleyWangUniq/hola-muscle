import { useNavigate } from "react-router-dom";
import { useWorkouts } from "../contexts/WorkoutContext";
import WorkoutDetail from "../Pages/WorkoutDetail";

function WorkoutDisplay() {
    const {workouts} = useWorkouts();
    const navigate = useNavigate();
    console.log(workouts);
    return <>
    {workouts.map((w)=>(
        <div> 
            <div className="card small-container" key={w.name}>
                <div className="card-header text-pink">{w.name}</div>
                <div className="card-body">
                    <p className="card-text">Difficulty: <span className="badge btn-pink me-1">{w.difficulty}</span></p>
                    <p className="card-text">Targeted Muscle Groups: {w.muscleGroups.map((muscle)=>(<span className="badge btn-pink me-1">{muscle}</span>))}</p>
                    <p className="card-text">Goals: {w.goal.map((goal)=>(<span className="badge btn-pink me-1">{goal}</span>))}</p>
                    {/* <button onClick={() =>
                            navigate("/workout-detail", {
                                state: { workout: workout }
                            })>Detail</button> */}
<button type="button" className="btn btn-pink"
                        onClick={() =>
                            navigate("/WorkoutDetail", {
                                state: { workout: w }
                            })
                        }
                    >
                        Detail
                    </button>
                </div>
            </div>
        </div>
       

))}
    </>;
    
}

export default WorkoutDisplay;



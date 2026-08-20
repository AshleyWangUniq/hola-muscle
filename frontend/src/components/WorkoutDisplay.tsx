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
            <h1>{w.name}</h1>
            <div className="card" key={w.name}>
                <div className="card-header">{w.name}</div>
                <div className="card-body">
                    <p className="card-text">Difficulty: <span className="badge text-bg-primary me-1">{w.difficulty}</span></p>
                    <p className="card-text">Targeted Muscle Groups: {w.muscleGroups.map((muscle)=>(<span className="badge text-bg-primary me-1">{muscle}</span>))}</p>
                    <p className="card-text">Goals: {w.goal.map((goal)=>(<span className="badge text-bg-primary me-1">{goal}</span>))}</p>
                    {/* <button onClick={() =>
                            navigate("/workout-detail", {
                                state: { workout: workout }
                            })>Detail</button> */}
<button
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



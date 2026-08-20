import { useLocation } from "react-router-dom";
import type { Workout } from "../types/workout";

export default function WorkoutDetail() {
    const location = useLocation();

    const workout = location.state.workout as Workout
    
    return (<>
    <div className="col-8">
        <h2>Exercises</h2>
        {workout.movements.map((movement) => (<div className="card" key={movement.id}>
            <div className="card-header">Will find name later</div>
            {/* {movement.sets.map((set)=>(<div>({movement.cardio})?():()</div>))}             */}
        </div>))}
    </div>
    <div className="col-4">
        <div className="card" key={workout.name}>
            <div className="card-header">{workout.name}</div>
            <div className="card-body">
                <p className="card-text">Difficulty: <span className="badge text-bg-primary me-1">{workout.difficulty}</span></p>
                <p className="card-text">Targeted Muscle Groups: {workout.muscleGroups.map((muscle)=>(<span className="badge text-bg-primary me-1">{muscle}</span>))}</p>
                <p className="card-text">Goals: {workout.goal.map((goal)=>(<span className="badge text-bg-primary me-1">{goal}</span>))}</p>
            </div>
        </div>
    </div>
    </>)
}

//two parents left 70% movements, right 30% name, description, diff ... 


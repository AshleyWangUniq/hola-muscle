import { useNavigate } from "react-router-dom";
import type { Workout } from "../types/workout";
import WorkoutDisplay from "../components/WorkoutDisplay";
import { useWorkouts } from "../contexts/WorkoutContext";

 function Workout() {
    const navigate = useNavigate();
  
    return <>
        <h1 className="text-pink">Workouts</h1>
        <button type="button" className="btn btn-pink" onClick={() => {navigate("/WorkoutGenerator");}}>Generate Your Workout</button>
        {/* <button onClick={loadWorkouts}>Load Workouts</button> */}
        <div>
            <WorkoutDisplay />
        </div>
        
    </>

}

export default Workout;
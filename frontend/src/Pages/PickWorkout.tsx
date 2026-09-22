import { useNavigate } from "react-router-dom";
import type { Workout } from "../types/workout";
import WorkoutDisplay from "../components/WorkoutDisplay";

 function PickWorkout() {
    const navigate = useNavigate();
    
  
    return <>
    {/* <div>
        <h1 className="text-pink">Workouts</h1>
        </div> */}
        <div>
            <WorkoutDisplay />
        </div>
        
    </>

}

export default PickWorkout;
import { useNavigate } from "react-router-dom";
import type { Workout } from "../types/workout";
import WorkoutDisplay from "../components/WorkoutDisplay";

 function WorkoutPage() {
    const navigate = useNavigate();
  
    return <>
        <button type="button" className="btn btn-pink float-end" onClick={() => {navigate("/WorkoutGenerator");}}>Generate Your Workout</button>
        <h1 className="text-pink">Workouts</h1>
        <div>
            <WorkoutDisplay />
        </div>
        
    </>

}

export default WorkoutPage;
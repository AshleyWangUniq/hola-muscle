import { useNavigate } from "react-router-dom";
import WorkoutDisplay from "../components/WorkoutDisplay";

 function WorkoutPage() {
    const navigate = useNavigate();
  
    return <>
    <div>
        <button type="button" className="btn btn-pink float-end" onClick={() => {navigate("/WorkoutGenerator");}}>Create Your Workout</button>
        <h1 className="text-pink">Workouts</h1>
        </div>
        <div>
            <WorkoutDisplay />
        </div>
        
    </>

}

export default WorkoutPage;
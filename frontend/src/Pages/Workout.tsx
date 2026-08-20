import { useNavigate } from "react-router-dom";
import type { Workout } from "../types/workout";
import WorkoutDisplay from "../components/WorkoutDisplay";
import { useWorkouts } from "../contexts/WorkoutContext";

 function Workout() {
    const navigate = useNavigate();
    // const { loadWorkouts } = useWorkouts();
    // let workouts;
    
    // async function loadWorkouts() {

    //     const token = localStorage.getItem("token");

    //     const headers : HeadersInit = {
    //                 "Content-Type": "application/json",
    //     }

    //     if (token) {
    //         headers.Authorization = `Bearer ${token}`;
    //     } 
    //     const response = await fetch(`http://localhost:3000/api/workouts`,
    //         {
    //             method: "GET",
    //             headers,
    //         }
    //     );
    //     console.log(response);
    //     if (!response.ok) {
    //         throw new Error("failed fetching workouts, sorrrry > <");
    //     }

    //     workouts = await response.json();
    //     console.log("workouts:", workouts);
    // }
    return <>
        <h1 className="text-pink">Workouts</h1>
        <button onClick={() => {navigate("/WorkoutGenerator");}}>Generate Your Workout</button>
        {/* <button onClick={loadWorkouts}>Load Workouts</button> */}
        <div>
            <WorkoutDisplay />
        </div>
        
    </>

}

export default Workout;
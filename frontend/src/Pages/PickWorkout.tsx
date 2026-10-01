import { useState } from "react";
import WorkoutDisplay from "../components/WorkoutDisplay";
import type { StrengthRecordGenerateType } from "../types/strengthRecord";
import { useWorkouts } from "../contexts/WorkoutContext";
import  { useExercises } from "../contexts/ExerciseContext";
import { useNavigate } from "react-router-dom";

 function PickWorkout() {
    const {workouts} = useWorkouts();
    const {exercises, findExerciseById} = useExercises();
    const navigate = useNavigate();

    function findExName(id: string) {
        const res = findExerciseById(id);
        if (!res) return "undefined name";
        return res.name;
    }

    

    function recordConverter(id : string) {
        const wkout =  workouts.find(wk=>wk._id === id);
        if (!wkout) return;
        const date = new Date();
        // return;

        const record : StrengthRecordGenerateType = {
            name: wkout.name +" " + date.toLocaleDateString("en-AU"),
            date: date,
            workoutRef: wkout._id,
            exercises: wkout.exercises.map(ex => ({
                id: crypto.randomUUID(),
                exercise: ex.exercise,
                name: findExName(ex.exercise),
                sets: ex.sets.map((set, index)=>({
                    id: crypto.randomUUID(),
                    order: index + 1,
                    dropOrder: 1,
                    reps: set.reps ?? 1,
                    weight: set.weight ?? 0
                }))
            }))
        };
        console.log(record);
        navigate("/AddRecord", {state : {passedRecord : record}});
    }
    return <>
    {/* <div>
        <h1 className="text-pink">Workouts</h1>
        </div> */}
        <div>
            <WorkoutDisplay pickedWorkout={recordConverter}/>
        </div>
        
    </>

}

export default PickWorkout;
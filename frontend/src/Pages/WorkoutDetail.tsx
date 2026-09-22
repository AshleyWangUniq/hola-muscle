import { useLocation, useNavigate } from "react-router-dom";
import type { Workout } from "../types/workout";
import { useEffect, useState } from "react";
import type { Exercise } from "../types/exercise";
import ExerciseDetailModal from "../components/ExerciseDetailModal";
import { useExercises } from "../contexts/ExerciseContext";

interface set {
    id: string;
    reps?: number;
    weight?: number;
    duration?: number;
}

interface exerciseDetail {
    id : string;
    exercise : Exercise;
    sets : set[];
    cardio: boolean;
}

export default function WorkoutDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const workout = location.state.workout as Workout;
    // console.log(workout);
    const {exercises, findExerciseById} = useExercises();
    const [exercisesforThis, setExercisesforThis] = useState<exerciseDetail[]>([]);
    const [exerciseId, setExerciseId] = useState<string>("");
    const [showExerciseDetail, setShowExerciseDetail] = useState<boolean>(false);

    function openExercise(id : string) {
        console.log("in button");
        setExerciseId(id);
        setShowExerciseDetail(true);
    }

    function loadExercises() {
        const buffers = workout.exercises.map((exercise) => {
            const buffer = findExerciseById(exercise.exercise);
            if (!buffer) {
                console.log("no matching exercise");
               return undefined;
            }
            return {
                ...exercise,
                exercise: buffer
            }
        }
        ).filter((exercise): exercise is exerciseDetail => exercise !== undefined);
        setExercisesforThis(buffers);
    }

    useEffect(()=>{
        loadExercises();
    },[exercises]);

    return (<>
    <div className="row">
    <div className="col-7">
        <button type="button" className="btn btn-pink float-end" onClick={() => navigate(`/EditWorkout/${workout._id}`)}>Edit</button>
        <h2 className="text-pink">Exercises</h2>
        {exercisesforThis.length === 0 && <p>No exercise in this workout. </p>}
        {exercisesforThis.map((exercise) => (
            <div className='card small-container' key={exercise.exercise.name}>
                        {/* <div className='card-body'>  */}
                            <div className="card-header bg-pink d-flex justify-content-between align-items-center">
                                <h5 className='card-title text-pink clickable' onClick={()=>openExercise(exercise.exercise._id)}>{exercise.exercise.name}</h5>
                                <button type="button" onClick={()=>openExercise(exercise.exercise._id)} className="btn"><i className="bi bi-box-arrow-up-right text-pink"></i></button>
                            </div>
                            {exercise.cardio && <div>
                                <ul className="list-group">
                                    {exercise.sets.map((set, index)=>(
                                        <li className="list-group-item row">
                                            <div className="col-3">Set {index}</div>
                                            <div className="col-9">{set.duration}</div>
                                        </li>))}
                                </ul>
                            </div>}
                            {!exercise.cardio && <div>
                                <ul className="list-group list-group-flush">
                                    {exercise.sets.map((set, index)=>(
                                        <li className="list-group-item  small-container">
                                            <div className="row">
                                            <div className="col-3 d-flex justify-content-center align-items-center">
                                                <h5 className="text-pink text-center">Set {++index}</h5>
                                            </div>
                                            <div className="col-8">
                                                <ul className="list-group"><li className="list-group-item">{set.reps} reps</li>
                                                <li className="list-group-item">{set.weight} kg</li></ul>
                                            </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>}
                            <div className="card-footer bg-pink">
                                <h6>Targmeted Muscle Groups: {exercise.exercise.muscleGroups.map((muscle) => (
                                <span className='badge text-bg-pink me-1'>{muscle}</span>
                            ))}
                            </h6>
                            <h6>Equipment: {exercise.exercise.equipment.map((equipment)=>(<span className='badge text-bg-pink me-1'>{equipment}</span>))}</h6>
                                </div>
                        {/* </div> */}
                    </div> 

                        ))}
    </div>
    <div className="col-4">
        <div className="card" key={workout.name}>
            <div className="card-header bg-pink">
                <h5 className="text-pink">{workout.name}</h5>
            </div>
            <div className="card-body">
                <p className="card-text">Difficulty: <span className="badge text-bg-pink me-1">{workout.difficulty}</span></p>
                <p className="card-text">Targeted Muscle Groups: {workout.muscleGroups.map((muscle)=>(<span className="badge text-bg-pink me-1">{muscle}</span>))}</p>
                <p className="card-text">Goals: {workout.goal.map((goal)=>(<span className="badge text-bg-pink me-1">{goal}</span>))}</p>
            </div>
        </div>
    </div>
    </div>
    {showExerciseDetail && <div><ExerciseDetailModal id={exerciseId} closeThis={()=>setShowExerciseDetail(false)}/></div>}
    
    </>)
}



import { useLocation } from "react-router-dom";
import type { Workout } from "../types/workout";
import { useMovements } from "../contexts/MovementContext";
import { useEffect, useState } from "react";
import type { Movement } from "../types/movement";

interface set {
    id: string;
    reps?: number;
    weight?: number;
    duration?: number;
}

interface movementDetail {
    id : string;
    movement : Movement;
    sets : set[];
    cardio: boolean;
}
export default function WorkoutDetail() {
    const location = useLocation();
    const workout = location.state.workout as Workout;

    const {movements, findMovementById} = useMovements();
    const [movementsforThis, setMovementsforThis] = useState<movementDetail[]>([]);

    function loadMovements() {
        const buffers = workout.movements.map((mov) => {
            const buffer = findMovementById(mov.movement);
            if (!buffer) {
               return undefined;
            }
            return {
                ...mov,
                movement: buffer
            }
        }
        ).filter((mov): mov is movementDetail => mov !== undefined);
        setMovementsforThis(buffers);
    }

    useEffect(()=>{
        loadMovements();
    },[movements]);

    return (<>
    <div className="row">
    <div className="col-7">
        <h2>Exercises</h2>
        {movementsforThis.map((mov) => (
            <div className='card small-container' key={mov.movement.name}>
                        <div className='card-body'> 
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className='card-title text-pink mb-0'>{mov.movement.name}</h5>
                                <i className="bi bi-box-arrow-up-right text-pink"></i>
                            </div>
                            {mov.cardio && <div>
                                <ul className="list-group">
                                    {mov.sets.map((set, index)=>(
                                        <li className="list-group-item row">
                                            <div className="col-3">Set {index}</div>
                                            <div className="col-9">{set.duration}</div>
                                        </li>))}
                                </ul>
                            </div>}
                            {!mov.cardio && <div>
                                <ul className="list-group list-group-flush">
                                    {mov.sets.map((set, index)=>(
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
                            <div className="card-footer">
                                <h6>Targmeted Muscle Groups: {mov.movement.muscleGroups.map((muscle) => (
                                <span className='badge text-bg-pink me-1'>{muscle}</span>
                            ))}
                            </h6>
                            <h6>Equipment: {mov.movement.equipment.map((equipment)=>(<span className='badge text-bg-pink me-1'>{equipment}</span>))}</h6>
                                </div>
                        </div>
                    </div> 

                        ))}
    </div>
    <div className="col-4">
        <div className="card" key={workout.name}>
            <div className="card-header">
                <h5 className="text-pink">{workout.name}</h5>
                </div>
            <div className="card-body">
                <p className="card-text">Difficulty: <span className="badge text-bg-primary me-1">{workout.difficulty}</span></p>
                <p className="card-text">Targeted Muscle Groups: {workout.muscleGroups.map((muscle)=>(<span className="badge text-bg-primary me-1">{muscle}</span>))}</p>
                <p className="card-text">Goals: {workout.goal.map((goal)=>(<span className="badge text-bg-primary me-1">{goal}</span>))}</p>
            </div>
        </div>
    </div>
    </div>
    </>)
}

//two parents left 70% movements, right 30% name, description, diff ... 


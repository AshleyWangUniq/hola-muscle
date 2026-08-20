import { useEffect, useState } from "react";
import { MUSCLE_GROUPS } from "../data/MuscleGroups";
import { EQUIPMENT } from "../data/Equipment";
import { GOALS } from "../data/FitnessGoals";
import { DIFFICULTY } from "../data/Difficulty";
import { useMovements } from "../contexts/MovementContext";
import Select from "react-select";
import type { Movement } from "../types/movement";
import { useNavigate } from "react-router-dom";
import NewMovement from "./NewMovement";
import MovementGenerator from "../components/MovementGenerator";

/*
workout 
*/

interface set {
    id: string;
    reps?: number;
    weight?: number;
    duration?: number;
}

interface MovementForWorkot {
    id: string;
    cardio: boolean;
    // name: string;
    // movement: Movement|null;
    movement: string;
    sets: set[];
}

interface MovOption {
    value: string;
    label: string;
    // movement: Movement;
}

interface workout {
    name: string;
    movements: MovementForWorkot[];
    muscleGroups: string[];
    equipment: string[];
    goal: string[];
    difficulty: string;
    duration?: number;
};

function WorkoutGenerator() {
    const [workout, setWorkout] = useState<workout>({name:"My Template", movements: [], muscleGroups: [], equipment: [], goal: [], difficulty: ""});
    const [movements, setMovements] = useState<MovementForWorkot[]>([]);  
    const {movements: movementsForOptions} = useMovements();   
    const movementsOptions : MovOption[] = movementsForOptions.map((mov) => ({value: mov._id, label: mov.name}));

    // const movementsOptions : MovOption[] = movementsForOptions.map((mov) => ({value: mov.id, label: mov.name, movement: mov}));
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(()=> {

        if (!token) {
            navigate("/LogInReminder");
        }
    });
    async function geneartion(e : React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!token) {
            alert("please log in first");
            return;
        }

        const finalValue: workout = {...workout, movements: movements};
        console.log("finalValue:", finalValue);
        
        const res = await fetch("http://localhost:3000/api/workoutgeneration", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(finalValue),
        });

        if (!res.ok) {
            throw new Error("failed to create workout");
        } else {
            console.log("sucessfully created your workout.");
        }
    } 

    function setGoal(newGoal: string) {
        setWorkout(prev=> ({...prev, goal:[...workout.goal, newGoal]}));
    }

    function setName(newName: string) {
        setWorkout(prev=>({...prev, name: newName}));
    }

    function setMovementName(selectedMov: MovOption, movid: string) {
        console.log("setting movement,", selectedMov);
        setMovements(prev=> (prev.map((mov) => mov.id === movid ? {...mov, movement: selectedMov.value} : mov)));
        // console.log(movements);
    }

    function setDifficulty(diff: string) {
        setWorkout(prev=> ({...prev, difficulty: diff}));
    }

    function deleteMovement(id: string) {
        setMovements(prev => prev.filter((mov)=> mov.id !== id));
    }

    function addMovement() {
        setMovements(prev=>[...prev, {id: crypto.randomUUID(), movement: "", sets: [], cardio: false}]);
    }



    // function changeFormat(movid: string, checked: boolean) {
    //     setMovements(movements.map((mov) => mov.id === movid ? {...mov, cardio: checked} : mov));
    // }

    // function numberReset(movid: string) {
    //     setMovements(movements.map((mov) => mov.id === movid ? {...mov, sets: mov.sets.map((s) => {...s, weight: null, })} : mov));
    // }

    function numberReset(movid: string, checked: boolean) {
        setMovements(prev => prev.map((mov) => mov.id === movid ? {...mov, cardio: checked, sets: mov.sets.map((s) => ({...s, reps: undefined, weight: undefined, duration: undefined })),} : mov));
    }

    function addSet(movid: string) {
        setMovements(prev => prev.map((mov)=>mov.id === movid? {...mov, sets: [...mov.sets, {id: crypto.randomUUID()}]}:mov
    ));
    }

    function changeSetWeight(movid: string, setid: string, newValue: string) {
        setMovements(prev => prev.map((mov) => mov.id === movid ? {...mov, sets: mov.sets.map((set) => set.id === setid ? {...set, weight: Number(newValue)} : set)}:mov));

    }

      function changeSetDuration(movid: string, setid: string, newValue: string) {
        setMovements(prev => prev.map((mov) => mov.id === movid ? {...mov, sets: mov.sets.map((set) => set.id === setid ? {...set, duration: Number(newValue)} : set)}:mov));
    }

    function changeSetReps(movid: string, setid: string, newValue: string) {
        setMovements(prev => prev.map((mov) => mov.id === movid ? {...mov, sets: mov.sets.map((set) => set.id === setid ? {...set, reps: Number(newValue)} : set)}:mov));
    }

    function deleteSet(movid : string, setid: string) {
        setMovements(prev =>prev.map((mov)=> 
            mov.id === movid ? { ...mov, sets: mov.sets.filter((set)=>set.id !== setid)}: mov
    ));
    }

    function addEquip(equip: string) {
        setWorkout(prev => ({...prev, equipment:[...workout.equipment, equip]}));
    }

    function delEquip(equip: string) {
        setWorkout(prev => ({...prev, equipment: workout.equipment.filter(e => e !== equip)}));
    }

    function deleteGoal(goal: string) {
        setWorkout(prev => ({...prev, goal: workout.goal.filter(e=>e !==goal)}));
    }

    // function addMuscle(muscle: string) {
    //     setWorkout({...workout, muscleGroups:[...workout.muscleGroups, muscle]});
    //     // console.log(workout);
    // }
    
    function addMuscle(muscle: string) {
        setWorkout(prev => ({...prev, muscleGroups:[...workout.muscleGroups, muscle]}));
    }
    function delMuscle(muscle: string) {
        setWorkout(prev => ({...prev, muscleGroups: workout.muscleGroups.filter(m => m !== muscle)}));
    }

    return <>
    {/* <MovementSelector onSelect={addMovement} /> */}
    <form onSubmit={geneartion}>
        <input className="form-control-lg " value={workout.name} onChange={(e)=>{setName(e.target.value)}}></input>
    <div>
    <h4>Targeted Muscles</h4>
    <div className="form-check container-grid">
        {MUSCLE_GROUPS.map((muscle)=> (
            <div key={muscle} className="form-check">
                <input id={muscle} className="form-check-input " type="checkbox" checked={workout.muscleGroups.includes(muscle)} onChange={(e)=> {
                    if (e.target.checked) {
                        addMuscle(muscle);
                    } else {
                        delMuscle(muscle);
                    }
                }}></input>
                <label htmlFor={muscle} className="form-check-label">{muscle}</label>
            </div>
        ))} 
    </div>
    </div>
    <div>
        <h4>Goals</h4>
        <div className="form-check container-grid">
            {GOALS.map((goal) => (
                <div key={goal}>
                <input id={goal} className="form-check-input " type="checkbox" checked={workout.goal.includes(goal)} onChange={(e)=> {
                    if (e.target.checked) {
                        setGoal(goal);
                    } else {
                        deleteGoal(goal);
                    }
                }}></input>
                <label htmlFor={goal} className="form-check-label">{goal}</label>
            </div>
            ))}
        </div>
    </div>
    <div>
        <h4>Difficulty</h4>
        <div className="form-check container-grid">
        {DIFFICULTY.map((diff) => (
            <div key={diff}>
                <input className="form-check-input" type="radio" name="difficulty" id={diff} checked={workout.difficulty === diff} onChange={()=>setDifficulty(diff)}></input>
                <label className="form-check-label" htmlFor={diff}>{diff}</label>
            </div>
        )
        )} </div>
    </div>
    <div>
        <h4>Equipment</h4>
        <div className="form-check container-grid">
            {EQUIPMENT.map((equip)=> (
                <div key={equip}>
                    <input id={equip} className="form-check-input " type="checkbox" checked={workout.equipment.includes(equip)} onChange={(e)=> {
                        if (e.target.checked) {
                            addEquip(equip);
                        } else {
                            delEquip(equip);
                        }}
                    }></input>
                    <label htmlFor={equip} className="form-check-label">{equip}</label>
                </div>
            ))} 
        </div>
    </div>
    <div>
    <button className="button"  type="button" onClick={addMovement}>Add Movement</button>
    <button className="button" type="button" data-bs-toggle="modal" data-bs-target="#NewMovement">Didn't Find Your Movement, Create New</button>
    

    {movements.map((movement)=> (<div className="card"  key={movement.id}>
    <div className="card-body">
        {/* <h6>{movement.name}</h6> */}
            <button className="button"  type="button" onClick={()=>deleteMovement(movement.id)}>Delete Movement</button>

        <Select options={movementsOptions} onChange={(option) => {if (option) setMovementName(option, movement.id);}}/>
        {/* <input type="text" className="form-control-lg" value={movement.name} onChange={(e)=>{setMovName(e.target.value, movement.id)}}></input> */}
        <button className="btn btn-pink" type="button" onClick={() => addSet(movement.id)}>Add Set</button>
        <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="role" id={movement.id} checked={movement.cardio} onChange={(e) => numberReset(movement.id, e.target.checked)}></input>
            <label className="form-check-label" htmlFor={movement.id}>Cardio?</label>
        </div>
        {movement.sets.map((set) => (
            <div key={set.id}>
            {movement.cardio ? (
            <div>
                <label>Duration</label>
                <input type="number" value={set.duration ?? ""} onChange={(e) => changeSetDuration(movement.id, set.id, e.target.value)} ></input>
            </div> ) :
            (<div>
                <div>
                <label>Weight</label>
                <input type="number" value={set.weight ?? ""} onChange={(e) => changeSetWeight(movement.id, set.id, e.target.value)}></input>
                </div>
                <div>
                <label>Reps</label>
                <input type="number" value={set.reps ?? ""} onChange={(e) => changeSetReps(movement.id, set.id, e.target.value)}></input>
                </div>
            </div>
            )}
            <button className="btn btn-pink btn-sm"  type="button" onClick={() => deleteSet(movement.id, set.id)}>Delete</button>
            <hr className='hr' />
            </div>
        ))}
    </div>
</div>
))}
</div>
<button type="submit" >Create</button>
</form>
<div
    className="modal"
    id="NewMovement"
    tabIndex={-1}
    aria-hidden="true"
>
    <div className="modal-dialog modal-lg">
        <div className="modal-content">

            <div className="modal-header">
                <h5 className="modal-title">Create New Movement</h5>

                <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                />
            </div>

            <div className="modal-body">
                <MovementGenerator />
            </div>

        </div>
    </div>
</div>
    </>
}

export default WorkoutGenerator;

//movements mapping 

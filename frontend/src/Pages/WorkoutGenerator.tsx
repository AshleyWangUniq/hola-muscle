import { useState } from "react";
import { MUSCLE_GROUPS } from "../data/MuscleGroups";
import { EQUIPMENT } from "../data/Equipment";
import { GOALS } from "../data/FitnessGoals";
import { DIFFICULTY } from "../data/Difficulty";


interface set {
    id: string;
    // cardio: boolean;
    reps?: number;
    weight?: number;
    duration?: number;
}

interface Movement {
    id: string;
    cardio: boolean;
    name: string;
    sets: set[];
}

interface workout {
    name: string;
    movements: Movement[];
    muscleGroups: string[];
    equipment: string[];
    goal: string[];
    difficulty: string;
    duration?: number;
};

function WorkoutGenerator() {
    const [workout, setWorkout] = useState<workout>({name:"My Template", movements: [], muscleGroups: [], equipment: [], goal: [], difficulty: ""});
    const [movements, setMovements] = useState<Movement[]>([]);

    function workoutGenerator(e : React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setWorkout({...workout, movements: movements});
        console.log(workout);
    }

    function setGoal(newGoal: string) {
        setWorkout({...workout, goal:[...workout.goal, newGoal]});
    }

    function setName(newName: string) {
        setWorkout({...workout, name: newName});
    }

    function setDifficulty(diff: string) {
        setWorkout({...workout, difficulty: diff});
    }

    // function setDuration(dur: string) {
    //     setWorkout({...workout, duration: Number(dur)});
    // }

    function deleteMovement(id: string) {
        setMovements(movements.filter((mov)=> mov.id !== id));
    }

    function addMovement() {
        setMovements([...movements, {id: crypto.randomUUID(), name: "", sets: [], cardio: false}]);
        console.log(workout);
    }

    // function changeFormat(movid: string, checked: boolean) {
    //     setMovements(movements.map((mov) => mov.id === movid ? {...mov, cardio: checked} : mov));
    // }

    // function numberReset(movid: string) {
    //     setMovements(movements.map((mov) => mov.id === movid ? {...mov, sets: mov.sets.map((s) => {...s, weight: null, })} : mov));
    // }

    function numberReset(movid: string, checked: boolean) {
        setMovements(movements.map((mov) => mov.id === movid ? {...mov, cardio: checked, sets: mov.sets.map((s) => ({...s, reps: undefined, weight: undefined, duration: undefined })),} : mov));
    }

    function addSet(movid: string) {
        setMovements(movements.map((mov)=>mov.id === movid? {...mov, sets: [...mov.sets, {id: crypto.randomUUID()}]}:mov
    ));
    }

    function changeSetWeight(movid: string, setid: string, newValue: string) {
        setMovements(movements.map((mov) => mov.id === movid ? {...mov, sets: mov.sets.map((set) => set.id === setid ? {...set, weight: Number(newValue)} : set)}:mov));
    }

      function changeSetDuration(movid: string, setid: string, newValue: string) {
        setMovements(movements.map((mov) => mov.id === movid ? {...mov, sets: mov.sets.map((set) => set.id === setid ? {...set, duration: Number(newValue)} : set)}:mov));
    }

    function changeSetReps(movid: string, setid: string, newValue: string) {
        setMovements(movements.map((mov) => mov.id === movid ? {...mov, sets: mov.sets.map((set) => set.id === setid ? {...set, reps: Number(newValue)} : set)}:mov));
    }

    function deleteSet(movid : string, setid: string) {
        setMovements(movements.map((mov)=> 
            mov.id === movid ? { ...mov, sets: mov.sets.filter((set)=>set.id !== setid)}: mov
    ));
    }

    function addEquip(equip: string) {
        setWorkout({...workout, equipment:[...workout.equipment, equip]});
    }

    function delEquip(equip: string) {
        setWorkout({...workout, equipment: workout.equipment.filter(e => e !== equip)});
    }

    function deleteGoal(goal: string) {
        setWorkout({...workout, goal: workout.goal.filter(e=>e !==goal)});
    }

    function addMuscle(muscle: string) {
        setWorkout({...workout, muscleGroups:[...workout.muscleGroups, muscle]});
        // console.log(workout);
    }

    function delMuscle(muscle: string) {
        setWorkout({...workout, muscleGroups: workout.muscleGroups.filter(m => m !== muscle)});
        console.log(workout);
    }



    return <>
    <form onSubmit={workoutGenerator}>
        <input className="form-control-lg " value={workout.name} onChange={(e)=>{setName(e.target.value)}}></input>
    <div>
    <h4>Targeted Muscles</h4>
    <div className="form-check container-grid">
        {MUSCLE_GROUPS.map((muscle)=> (
            <div className="form-check">
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
                <div>
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
            <div>
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
                <div>
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
    <button className="button" onClick={addMovement}>Add Movement</button>
    {movements.map((movement)=> (<div className="card">
    <div className="card-body">
        {/* <h6>{movement.name}</h6> */}
        <input type="text" className="form-control-lg"></input>
        <button className="btn btn-pink" onClick={() => addSet(movement.id)}>Add Set</button>
            <button className="button" onClick={()=>deleteMovement(movement.id)}>Delete Movement</button>
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
            <button className="btn btn-pink btn-sm" onClick={() => deleteSet(movement.id, set.id)}>Delete</button>
            <hr className='hr' />
            </div>
        ))}
    </div>
</div>
))}
</div>
<button type="submit" >Create</button>
</form>
    </>
}

export default WorkoutGenerator;

//movements mapping 

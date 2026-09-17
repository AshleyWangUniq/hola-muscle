import { useEffect, useState } from "react";
import { MUSCLE_GROUPS } from "../data/MuscleGroups";
import { EQUIPMENT } from "../data/Equipment";
import { GOALS } from "../data/FitnessGoals";
import { DIFFICULTY } from "../data/Difficulty";
import { useExercises } from "../contexts/ExerciseContext";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import ExerciseGenerator from "../components/ExerciseGenerator";
import { useUser } from "../contexts/UserContext";
import { useWorkouts } from "../contexts/WorkoutContext";
import ReusableModal from "../components/ReusableModal";
import type {ModalProps } from "../types/reuseableModal";
import type { WorkoutGenerateType, ExerciseForWorkout, Workout } from "../types/workout";

interface ExOption {
    value: string;
    label: string;
}

interface thisProp {
    editWorkout ?: Workout;
}

function WorkoutGenerator({editWorkout} : thisProp) {
    const [workout, setWorkout] = useState<WorkoutGenerateType>({name:"My Template", exercises: [], muscleGroups: [], equipment: [], goal: [], difficulty: ""});
    const [exercises, setExercises] = useState<ExerciseForWorkout[]>([]);  
    const {exercises: exercisesForOptions} = useExercises(); 
    const {user} = useUser();
    const {generateWorkout, editWorkout : editInContext} = useWorkouts();
    const [confirmName, setConfirmName] = useState(false);
    const [showSuccessModal, setShowModal] = useState(false);
    const exercisesOptions : ExOption[] = exercisesForOptions.map((exercise) => ({value: exercise._id, label: exercise.name}));
    const [repsMinAlert, setRepsMinAlert] = useState(false);
    const edit = editWorkout !== undefined;

    const modalProps : ModalProps = {
        title : "Unknown User", 
        message : "Please log in to generate your workout.", 
        cancelButton : {buttonDisplay : "Cancel", buttonAction : ()=>navigate("-1")},
        confirmButton : {buttonDisplay : "Log In", buttonAction : ()=>navigate("/logIn")}
    }

    const successModal : ModalProps = {
        title : "Success", 
        message : "Your workout is successfully created", 
        cancelButton : {buttonDisplay : "Close", buttonAction : ()=>navigate("/")},
        confirmButton : {buttonDisplay : "Create Another Exercise", buttonAction : ()=>reset()}
    }

    const navigate = useNavigate();

    useEffect(() => {
        if (editWorkout) {
            // console.log(editWorkout);
            setExercises(editWorkout.exercises);
            console.log(exercises);
            setWorkout(editWorkout);
        }
    },[editWorkout]);

    function reset() {
        setWorkout({name:"My Template", exercises: [], muscleGroups: [], equipment: [], goal: [], difficulty: ""});
        setShowModal(false);
        setConfirmName(false);
    }

    function cancel() {
        setConfirmName(false);
    }

    function confirmed(e : React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        if (workout.name === "My Template") {
            setConfirmName(true);
        } else {
            if (edit) {
                editSubmission();
            } else {
                generation();

            }
        }
    }
    async function editSubmission() {
        if (!editWorkout) return;
        const finalValue : Workout = {...workout, _id: editWorkout._id, exercises: exercises};
        const res = await editInContext(finalValue);
        navigate(-1);
    }

    async function generation() {
        // e.preventDefault();
        
        const finalValue: WorkoutGenerateType = {...workout, exercises: exercises};
        console.log("finalValue:", finalValue);
        const res = await generateWorkout(finalValue);

        if (!res.ok) {
            throw new Error("failed to create workout");
        } else {
            // reset();   
            setConfirmName(false);
            setShowModal(true);       
            console.log("sucessfully created your workout.");
        }
    } 

    function setGoal(newGoal: string) {
        setWorkout(prev=> ({...prev, goal:[...workout.goal, newGoal]}));
    }

    function setName(newName: string) {
        setWorkout(prev=>({...prev, name: newName}));
    }

    function setExerciseName(seletedEx: ExOption, exerciseId: string) {
        console.log("setting exercise,", seletedEx);
        setExercises(prev=> (prev.map((exercise) => exercise.id === exerciseId ? {...exercise, exercise: seletedEx.value} : exercise)));
    }

    function setDifficulty(diff: string) {
        setWorkout(prev=> ({...prev, difficulty: diff}));
    }

    function deleteExercise(id: string) {
        setExercises(prev => prev.filter((exercise)=> exercise.id !== id));
    }

    function addExercise() {
        setExercises(prev=>[...prev, {id: crypto.randomUUID(), exercise: "", sets: [], cardio: false}]);
    }

    function numberReset(exerciseId: string, checked: boolean) {
        setExercises(prev => prev.map((exercise) => exercise.id === exerciseId ? {...exercise, cardio: checked, sets: exercise.sets.map((s) => ({...s, reps: undefined, weight: undefined, duration: undefined })),} : exercise));
    }

    function addSet(exerciseId: string) {
        setExercises(prev => prev.map((exercise)=>exercise.id === exerciseId? {...exercise, sets: [...exercise.sets, {id: crypto.randomUUID()}]}:exercise
    ));
    }

    function changeSetWeight(exerciseId: string, setid: string, newValue: string) {
        setExercises(prev => prev.map((exercise) => exercise.id === exerciseId ? {...exercise, sets: exercise.sets.map((set) => set.id === setid ? {...set, weight:  newValue ? Number(newValue) : undefined} : set)}:exercise));

    }

      function changeSetDuration(exerciseId: string, setid: string, newValue: string) {
        setExercises(prev => prev.map((exercise) => exercise.id === exerciseId ? {...exercise, sets: exercise.sets.map((set) => set.id === setid ? {...set, duration: Number(newValue)} : set)}:exercise));
    }

    function changeSetReps(exerciseId: string, setid: string, newValue: string) {
        setExercises(prev => prev.map((exercise) => exercise.id === exerciseId ? {...exercise, sets: exercise.sets.map((set) => set.id === setid ? {...set, reps: Number(newValue)} : set)}:exercise));
    }

    function deleteSet(exerciseId : string, setid: string) {
        setExercises(prev =>prev.map((exercise)=> 
            exercise.id === exerciseId ? { ...exercise, sets: exercise.sets.filter((set)=>set.id !== setid)}: exercise
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
    
    function addMuscle(muscle: string) {
        console.log("adding muscle");
        setWorkout(prev => ({...prev, muscleGroups:[...workout.muscleGroups, muscle]}));
    }
    function delMuscle(muscle: string) {
        setWorkout(prev => ({...prev, muscleGroups: workout.muscleGroups.filter(m => m !== muscle)}));
    }

    return <>
    {!user && <div><ReusableModal {...modalProps}/></div>}
    {showSuccessModal && <ReusableModal {...successModal} />}
    <form onSubmit={confirmed}>
    <input className="form-control input-hola mb-2 text-center" value={workout.name} onChange={(e)=>{setName(e.target.value)}}></input>
    <hr className='hr' />
    <div>
    <h5 className="text-pink">Targeted Muscles</h5>
    <div className="form-check container-three-cols">
        {MUSCLE_GROUPS.map((muscle)=> (
            <div key={muscle} className="form-check">
                <input id={muscle} className="form-check-input checkbox" type="checkbox" checked={workout.muscleGroups.includes(muscle)} onChange={(e)=> {
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
    <hr className='hr' />
    <div>
        <h5 className="text-pink">Goals</h5>
        <div className="form-check container-grid">
            {GOALS.map((goal) => (
                <div key={goal}>
                <input id={goal} className="form-check-input checkbox" type="checkbox" checked={workout.goal.includes(goal)} onChange={(e)=> {
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
    <hr className='hr' />
    <div>
        <h5 className="text-pink">Difficulty</h5>
        <div className="form-check container-three-cols">
        {DIFFICULTY.map((diff) => (
            <div key={diff}>
                <input className="form-check-input checkbox" type="radio" name="difficulty" id={diff} checked={workout.difficulty === diff} onChange={()=>setDifficulty(diff)}></input>
                <label className="form-check-label" htmlFor={diff}>{diff}</label>
            </div>
        )
        )} </div>
    </div>
    <hr className='hr' />
    <div>
        <h5 className="text-pink">Equipment</h5>
        <div className="form-check container-three-cols">
            {EQUIPMENT.map((equip)=> (
                <div key={equip}>
                    <input id={equip} className="form-check-input checkbox" type="checkbox" checked={workout.equipment.includes(equip)} onChange={(e)=> {
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
    <hr className='hr' />
    {exercises.map((exercise)=> (
        <div className="card mb-3"  key={exercise.id}>
    <div className="card-body">
        <button className="btn btn-pink btn-sm float-lg-end float-none"  type="button" onClick={()=>deleteExercise(exercise.id)}>Delete Exercise</button>
        <div className="d-flex justify-content-between mb-3">
            <div className="col-9 me-3">
                <Select options={exercisesOptions} value={
        exercisesOptions.find(
            option => option.value === exercise.exercise) ?? null
    } onChange={(option) => {if (option) setExerciseName(option, exercise.id);}}/>
            </div>
            <div className="form-check form-switch col-3">
                <input className="form-check-input" type="checkbox" role="role" id={exercise.id} checked={exercise.cardio} onChange={(e) => numberReset(exercise.id, e.target.checked)}></input>
                <label className="form-check-label text-pink" htmlFor={exercise.id}>Cardio?</label>
            </div>
        </div>
        {/* <button className="btn btn-pink btn-sm mt-2" type="button" onClick={() => addSet(exercise.id)}>Add Set</button> */}
        {exercise.sets.map((set, index) => (
            <div className="row">
                <div className="col-2  d-flex justify-content-center align-items-center"><p className="text-pink">set {++index}</p></div>
            <div className="col-10 mb-3" key={set.id}>
            {exercise.cardio ? (
            <div className="row">
                <div className="col-10">
                    <label className="me-1">Duration in minute:</label>
                    <input type="number" min="0" value={set.duration ?? ""} onChange={(e) => changeSetDuration(exercise.id, set.id, e.target.value)} ></input>
                </div> 
                <div className="col-2">
                    <button className="btn btn-pink btn-sm" type="button" onClick={() => deleteSet(exercise.id, set.id)}>Delete</button>
                </div>
            </div>
            ) :
            (<div className="set-input-row">
                <div className="set-field">
                <label className="me-1 text-nowrap">Weight:</label>
                <input type="text"  inputMode="decimal" className="form-control" placeholder="in kg" value={set.weight} onChange={(e) => {
                    let value : string | undefined = e.target.value;
                    if (value==="") value=undefined;
                    changeSetWeight(exercise.id, set.id, e.target.value)}}></input>
                </div>
                <div className="set-field">
                <label className="me-1 text-nowrap">Reps: </label>
                <input type="text" inputMode="decimal" className="form-control" value={set.reps ?? ""} onChange={(e) => {
                    const value = e.target.value;

                    if (Number(value) < 1) {
                        setRepsMinAlert(true);
                    }
                    changeSetReps(exercise.id, set.id, value)}}></input>
                </div>
                <div className="set-action-btn">
                    <button className="btn btn-pink btn-sm" type="button" onClick={() => deleteSet(exercise.id, set.id)}>Delete</button>
                </div>
            </div>
            )}
            
            </div>
            <hr className='hr-light' />
            </div>
        ))}
        <button className="btn btn-pink btn-sm mt-2" type="button" onClick={() => addSet(exercise.id)}>Add Set</button>
    </div>
</div>
))}
    <div className="mb-5">
    <button className="btn btn-pink mt-3"  type="button" onClick={addExercise}>Add Exercise</button>
    <button className="btn btn-transparent" type="button" data-bs-toggle="modal" data-bs-target="#NewExercise"><i className="bi bi-box-arrow-up-right text-pink"></i> Didn't Find Your Exercise, Create Now</button>
    </div>
{/* </div> */}
<div className="d-flex justify-content-center">
    {edit && <button type="submit" className="btn btn-lg btn-pink">Update</button>}
    {!edit && <button type="submit" className="btn btn-lg btn-pink">Create</button>}

</div>
</form>
{confirmName && 
        (<div className="modal d-block" id="renameReminder" tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="text-pink">Please Confirm Your Workout Name</h5>
                    </div>
                    <div className="modal-body">
                        <input className="form-control-lg " value={workout.name} onChange={(e)=>{setName(e.target.value)}}></input>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-pink" onClick={cancel}>Cancel</button>
                        <button type="button" className="btn btn-pink" onClick={generation}>Confirm</button>
                    </div>
                </div>
            </div>
        </div> )}
<div
    className="modal"
    id="NewExercise"
    tabIndex={-1}
    aria-hidden="true"
>
    <div className="modal-dialog modal-lg">
        <div className="modal-content">

            <div className="modal-header">
                <h5 className="modal-title text-pink">Create New Exercise</h5>

                <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                />
            </div>

            <div className="modal-body">
                <ExerciseGenerator />
            </div>

        </div>
    </div>
</div>

    </>
}

export default WorkoutGenerator;


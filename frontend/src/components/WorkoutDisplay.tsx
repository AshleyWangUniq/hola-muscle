import { useNavigate } from "react-router-dom";
import { useWorkouts } from "../contexts/WorkoutContext";
import { useEffect, useState } from "react";
import type { Workout } from "../types/workout";
import { MUSCLE_GROUPS } from "../data/MuscleGroups";
import { EQUIPMENT } from "../data/Equipment";
import { GOALS } from "../data/FitnessGoals";
import { DIFFICULTY } from "../data/Difficulty";
import type { ModalProps } from "../types/reuseableModal";
import ReusableModal from "./ReusableModal";

function WorkoutDisplay() {
    const {workouts, deleteWorkout} = useWorkouts();
    const [currentWorkouts, setCurrentWorkouts] = useState<Workout[]>(workouts);
    const navigate = useNavigate();
    const [muscleFilters, setMuscleFilters] = useState<string[]>([]);
    const [equipmentFilters, setEquipmentFilters] = useState<string[]>([]);
    const [difficultyFilters, setDifficultyFilters] = useState<string[]>([]);
    const [goalFilters, setGoalFilters] = useState<string[]>([]);



    const [confirmDel, setConfirmDel] = useState<ModalProps>();

    function setDelete(id: string) {
        setConfirmDel({title : "Delete Exercise?", 
            message : "Do you want to delete the exercise?", 
            cancelButton : {buttonDisplay : "Cancel", buttonAction : ()=>setConfirmDel(undefined)},
            confirmButton : {buttonDisplay : "Yes", buttonAction : ()=>deleteThis(id)}})
    }

    async function deleteThis(id : string) {
        deleteWorkout(id);
        setConfirmDel(undefined);
    }
    useEffect(()=>{refreshWorkouts()}, [muscleFilters, equipmentFilters, difficultyFilters,goalFilters]);


    useEffect(() => {
        setCurrentWorkouts(workouts);
    }, [workouts]);

    // function selectMuscle(muscle : string) {
    //     setWorkouts(prev => ())
    // }
    function refreshWorkouts() {
        if (muscleFilters.length === 0 && 
            equipmentFilters.length === 0 && 
            difficultyFilters.length === 0 && 
        goalFilters.length === 0){
            setCurrentWorkouts(workouts);
        }
        else {
            setCurrentWorkouts(workouts.filter(wk => checkDifficulty(wk.difficulty) &&
            checkGoals(wk.goal)&& 
            checkMuscles(wk.muscleGroups) && 
            checkEquip(wk.equipment)))
        }
    }


    function checkMuscles(muscles : string[]) {
        if (muscleFilters.length === 0) return true;
        return muscleFilters.some(m => muscles.includes(m));
    }
    function checkEquip(equip : string[]) {
        if (equipmentFilters.length === 0) return true;
        return equipmentFilters.some(e => equip.includes(e));
    }
    function checkGoals(goals : string[]) {
        if (goalFilters.length === 0) return true;
        return goalFilters.some(g=>goals.includes(g));
    }

    function checkDifficulty(diff : string) {
        if (difficultyFilters.length === 0) return true;
        return difficultyFilters.includes(diff);
    }

    

    return <>
    <div key="filters">
        <ul className="nav d-flex justify-content-end">
            <li className="nav-item me-1">
                <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside">Muscles {muscleFilters.length !== 0 && <span className="badge btn-sm btn-pink me-1">{muscleFilters.length}</span>}</button>
                    <ul className="dropdown-menu">
                        <button className="btn btn-sm btn-pink ms-1 mb-1" type="button" onClick={()=>setMuscleFilters([])}>Reset</button>
                        <hr className="hr-bar" />
                        {MUSCLE_GROUPS.map((m) => (
                            <li key={m}>
                                <div className="dropdown-item">
                                <input className="form-check-input checkbox" type="checkbox" id={m} 
                                checked={muscleFilters.includes(m)} 
                                onChange={(e)=> {
                                    if (e.target.checked) {
                                        setMuscleFilters([...muscleFilters, m]);
                                    } else {
                                        setMuscleFilters(muscleFilters.filter((mm)=> mm !== m));
                                    }
                                }}></input>
                                <label className="form-check-label" htmlFor={m}>{m}</label>
                                </div>
                            </li>
                        ))}
                    </ul>
            </li>
            <li className="nav-item me-1">
                <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside">Equipment {equipmentFilters.length !== 0 && <span className="badge btn-sm btn-pink me-1">{equipmentFilters.length}</span>}</button>
                <ul className="dropdown-menu">
                    <button className="btn btn-sm btn-pink ms-1 mb-1" type="button" onClick={()=>setEquipmentFilters([])}>Reset</button>
                        <hr className="hr-bar" />
                {EQUIPMENT.map((equip)=> (
                    <li key={equip}>
                        <div className="dropdown-item">
                            <input className="form-check-input checkbox" type="checkbox" id={equip}
                            checked={equipmentFilters.includes(equip)}
                            onChange={(e) => {
                                if (e.target.checked) setEquipmentFilters([...equipmentFilters, equip]);
                                else setEquipmentFilters(equipmentFilters.filter((thisEquip)=> thisEquip !== equip));
                            }}
                            ></input>
                            <label className="form-check-label" htmlFor={equip}>{equip}</label>
                        </div>
                    </li>
                ))}
                </ul>
            </li>
            <li className="nav-item me-1">
                <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside">Goal {goalFilters.length !== 0 && <span className="badge btn-sm btn-pink me-1">{goalFilters.length}</span>}</button>
                <ul className="dropdown-menu">
                    <button className="btn btn-sm btn-pink ms-1 mb-1" type="button" onClick={()=>setGoalFilters([])}>Reset</button>
                        <hr className="hr-bar" />
                    {GOALS.map((g) => (
                        <li key={g}>
                            <div className="dropdown-item">
                                <input className="form-check-input checkbox" type="checkbox" id={g} 
                                checked={goalFilters.includes(g)}
                                onChange={(e) => {
                                    if (e.target.checked) setGoalFilters([...goalFilters, g]);
                                    else setGoalFilters(goalFilters.filter((thisGoal) => thisGoal !== g));
                                }}></input>
                                <label className="form-check-label" htmlFor={g}>{g}</label>
                            </div>
                        </li>
                    ))}
                </ul>
            </li>
            <li className="nav-item">
                <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside">Difficulty {difficultyFilters.length !== 0 && <span className="badge btn-sm btn-pink me-1">{difficultyFilters.length}</span>}</button>
                <ul className="dropdown-menu">
                    <button className="btn btn-sm btn-pink ms-1 mb-1" type="button" onClick={()=>setDifficultyFilters([])}>Reset</button>
                        <hr className="hr-bar" />
                    {DIFFICULTY.map((d) => (
                        <li key={d}>
                            <div className="dropdown-item">
                                <input className="form-check-input checkbox" type="checkbox" id={d}
                                checked={difficultyFilters.includes(d)}
                                onChange={(e) => {
                                    if (e.target.checked) setDifficultyFilters([...difficultyFilters, d]);
                                    else setDifficultyFilters(difficultyFilters.filter((thisD) => thisD !== d));
                                }}></input>
                                <label className="form-check-label" htmlFor={d}>{d}</label>
                            </div>
                        </li>
                    ))}
                </ul>
            </li>
        </ul>
        <hr className="hr-bar" />
    </div>
    
    <div className="container-grid">
        {currentWorkouts.map((w)=>(
            <div> 
                <div className="card small-container" key={w.name}>
                    <div className="card-header d-flex justify-content-between bg-pink">
                        <h5 className="text-pink">{w.name}</h5>
                        {/* <div className="btn-group">
                            <button type="button" className="btn btn-pink btn-sm me-1" onClick={() =>navigate("/WorkoutDetail", {state: { workout: w }})}>Detail</button>
                            <button type="button" className="btn btn-pink btn-sm me-1" onClick={() => navigate(`/EditWorkout/${w._id}`)}>Edit</button>
                            <button id="w._id" className="btn btn-pink btn-sm" onClick={()=>setDelete(w._id)}>Delete</button>
                        </div> */}
                        <div className="dropdown">
                            <button className="btn" data-bs-toggle="dropdown"  aria-expanded="false" type="button"><i className="bi bi-three-dots-vertical text-pink"></i></button>
                            <ul className="dropdown-menu">
                                <li>   
                                    <button type="button" className="dropdown-item" onClick={() =>navigate("/WorkoutDetail", {state: { workout: w }})}>Detail</button>
                                </li>
                                <li>
                                    <button type="button" className="dropdown-item" onClick={() => navigate(`/EditWorkout/${w._id}`)}>Edit</button>
                                </li>
                                <li>
                                    <button id="w._id" className="dropdown-item" onClick={()=>setDelete(w._id)}>Delete</button>
                                </li>
                            </ul>
                            </div>
                    </div>
                    <div className="card-body">
                        <p className="card-text">Difficulty: <span className="badge btn-pink me-1">{w.difficulty}</span></p>
                        <p className="card-text">Targeted Muscle Groups: {w.muscleGroups.map((muscle)=>(<span className="badge btn-pink me-1">{muscle}</span>))}</p>
                        <p className="card-text">Goals: {w.goal.map((goal)=>(<span className="badge btn-pink me-1">{goal}</span>))}</p>
                        
                    </div>
                    {/* <div className="card-footer">
                        
                    </div> */}
                </div>
            </div>
        ))}
    </div>
    {confirmDel && <ReusableModal {...confirmDel}/>}
    </>;
    
}

export default WorkoutDisplay;



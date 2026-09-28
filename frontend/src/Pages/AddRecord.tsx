import { useEffect, useState } from "react";
import type { StrengthRecordGenerateType, OneExercise, Set } from "../types/strengthRecord";
import Select from "react-select";
import { useExercises } from "../contexts/ExerciseContext";
import { useUser } from "../contexts/UserContext";
import type { ModalProps } from "../types/reuseableModal";
import { useNavigate } from "react-router-dom";
import ReusableModal from "../components/ReusableModal";
import { Rating } from "../data/Rating";
import ExerciseGenerator from "../components/ExerciseGenerator";

interface ExOption {
    value: string;
    label: string;
}

interface showWorkingOn {
    workingOn : boolean;
    exId : string;
}
function AddRecord() {
    const {user, fetchHelper} = useUser();
    const [record, setRecord] = useState<StrengthRecordGenerateType>({name: "",
        date: new Date(),
        exercises: []
    });
    const [startAt, setStartAt] = useState<number | null>(null);
    const [elapsed, setElapsed] = useState(0);
    const [duration, setDuration] = useState(0);
    const [recordExerices, setExercises] = useState<OneExercise[]>([]);
    const groupedExs = recordExerices.map(ex => ({...ex,  groupedSet : ex.sets.reduce<Record<number, Set[]>>((groups, set)=>{
        if (!groups[set.order]) {
            groups[set.order] = [];
        }
        groups[set.order].push(set);
        return groups;
    }, {})
    }));
    const {exercises} = useExercises();
    const exOptions : ExOption[] = exercises.map((ex) => ({value: ex._id, label: ex.name}));
    const [current, setCurrent] = useState<showWorkingOn>({workingOn: false, exId: ""});
    const [deleteDisplay, setDeleteDisplay] = useState<string | null>(null);
    const deleteWarning : ModalProps = {
         title : "Delete Exercise",
        message : "Do you want to delete this exericse?",
        cancelButton : {buttonDisplay: "Cancel", buttonAction:()=>setDeleteDisplay(null)},
        confirmButton : {buttonDisplay: "Confirm", buttonAction:() => {if (deleteDisplay) deleteExercise(deleteDisplay)}}
    }
    const navigate = useNavigate();

    const unknownUserModal : ModalProps = {
        title : "Unknown User", 
        message : "Please log in to generate your workout.", 
        cancelButton : {buttonDisplay : "Cancel", buttonAction : ()=>navigate("/Records")},
        confirmButton : {buttonDisplay : "Log In", buttonAction : ()=>navigate("/logIn")}
    }
    const [showConfirmFinish, setShowConfirmFinish] = useState(false);

    const confirmFinish : ModalProps = {
        title : "Confirm", 
        message : "Record cannot be modified after submit, do you want to finish?", 
        cancelButton : {buttonDisplay : "Cancel", buttonAction : ()=>setShowConfirmFinish(false)},
        confirmButton : {buttonDisplay : "Confirm", buttonAction : ()=>submitRecord()}
    }

    const [confirmedPast, setConfirmedPast] = useState(false);

    useEffect(()=> {
        if (!startAt) return;

        const interval = setInterval(()=> {
            setDuration(Date.now() - startAt + elapsed);
        }, 1000);

        return ()=>clearInterval(interval);
    }, [startAt]);

//pop up a confirm finish window
// If no name and other thing added, let user add in
async function submitRecord() {
    if (record.name === "") {
        console.log("no name");
        setRecord(prev => ({...prev, name: "Workout "+ record.date.toLocaleDateString("en-AU")}));
    }
    if (startAt) {
        setDuration(Date.now() - startAt + elapsed);
    }
    if (duration > 0) {
        setRecord(prev => ({...prev, duration: Math.floor(duration/1000)}));
    }
    const finalRecord : StrengthRecordGenerateType = {...record, exercises: recordExerices};
    console.log(finalRecord);
    const API_URL = import.meta.env.VITE_API_URL; 
    const res = await fetchHelper(`${API_URL}/api/strength-records`, true, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(finalRecord),
    });

    if (res.ok) navigate(-1);
}

//actual form submission
function finishRecording(e : React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    pauseTimer();
    setShowConfirmFinish(true);
}

function timeConverter(interval : number) {
    const totalSeconds = Math.floor(interval / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours !== 0) {
        return `${hours}:${minutes.toString()
                .padStart(2, "0")}:${seconds.toString()
                .padStart(2, "0")}`;
    } else {
        return `${minutes.toString()
                .padStart(2, "0")}:${seconds.toString()
                .padStart(2, "0")}`;
    }
    
}

/**
 * 
 * @param exId exercise id. 
 * @param setOrder set order, optional, if exist, it will duplicate as a drop set
 * @param reps optional reps
 * @param weight optional weight 
 */
function duplicateSet(exId: string, set : Set) {
    const newSet : Set = {...set, id : crypto.randomUUID(), order: set.order + 1};
    setExercises(prev => prev.map((ex) => {
        if (ex.id !== exId) return ex;
        const updatedSets = ex.sets.map((thisSet)=> thisSet.order > set.order ? {...thisSet, order: thisSet.order + 1} : thisSet);
        
        return {
            ...ex,
            sets: [...updatedSets, newSet]

        }
    }
    ));    
}

function setName(name : string) {
    setRecord(prev => ({...prev, name: name}));
}

function setRating(rating : string) {
    setRecord(prev => ({...prev, rating: rating}));
}

function setComment(com : string) {
    setRecord(prev => ({...prev, comment: com}));
}

function addExercise() {
    const newId = crypto.randomUUID();
    setExercises(prev => [...prev, {id:  newId, exercise: "", name: "", sets: []}]);
    setCurrent({workingOn: true, exId: newId});
}

function deleteExercise(id: string) {
    setDeleteDisplay(null);
    setExercises(prev => prev.filter((ex)=> ex.id !== id));
}

function startRecording() {
    setStartAt(Date.now());
}

/**
 * Add an empty set into the exericse
 * @param id exercise id
 */
function addSetInitial(id : string, reps?: number, weight ?: number) {
    const order = recordExerices.find((ex)=>ex.id === id)?.sets.reduce((max, set) => Math.max(max, set.order), 0);
    setExercises(prev => prev.map((ex)=>ex.id === id ? {...ex, sets: [...ex.sets, {id: crypto.randomUUID(), order: Number(order)+1, dropOrder: 1, reps: reps ?? 1, weight: weight ?? 0}]} : ex));
}

function addDropSet(exId: string, setOrder: number, reps?: number, weight ?: number) {
    let maxDropOrder = recordExerices.find((ex)=>ex.id === exId)?.sets.reduce((max, set) => {
        if (set.order !== setOrder) {
            return max;
        }
        if (!set.dropOrder) return max;
        return Math.max(max, set.dropOrder);
    }, 0);
    if (!maxDropOrder) maxDropOrder = 0;
    setExercises(prev => prev.map((ex)=>ex.id === exId ? {...ex, sets: [...ex.sets, {id: crypto.randomUUID(), order: Number(setOrder), dropOrder: maxDropOrder+1, reps: reps ?? 1, weight: weight ?? 0}]} : ex));

    // setExerci;ses(prev => prev.map((ex)=> ex.id === exId ? ))
}

function changeSetWeight(id: string, exId: string, value : string) {
    setExercises(prev => prev.map((ex)=> ex.id === exId ? {...ex, sets: ex.sets.map((set)=> set.id === id ? {...set, weight : Number(value)} : set)} : ex));
}

function changeSetReps(id: string, exId: string, value : string) {
    setExercises(prev => prev.map((ex)=> ex.id === exId ? {...ex, sets: ex.sets.map((set)=> set.id === id ? {...set, reps : Number(value)} : set)} : ex));
}
/**
 * delete the set from sets, reorder the order for the set
 * @param id set id
 * @param ExId exercise id
 */
function deleteSet(id: string, exId: string) {
    setExercises(prev => prev.map(ex => {
        if (ex.id !== exId) return ex;

        const setDeleting = ex.sets.find(set => set.id === id);
        if (!setDeleting) return ex;
        const {order, dropOrder} = setDeleting;


        const remainingSets = ex.sets.filter(set => set.id !== id);

        const findOrder = remainingSets.some(set => set.order === order);
        const newSets = findOrder ? remainingSets.map(set => 
            set.order === order && set.dropOrder > dropOrder ? 
            {...set, dropOrder: set.dropOrder-1} : set) : 
            remainingSets.map(set => set.order > order? 
                {...set, order: set.order-1} : set);
        return {
            ...ex,
            sets: newSets
        };
    }));
}
/**
 * 
 * @param refId exercise reference
 * @param name exercise name
 * @param id exercise record id
 */
function setExerciseName(refId: string, name: string, exId: string) {
    console.log("set exercising");
    setExercises(prev => prev.map((ex) => ex.id===exId? {...ex, exercise: refId, name: name}: ex));
}

function pauseTimer() {
    if (!startAt) return;
    setElapsed(prev => prev+(Date.now() - startAt)); 
    setStartAt(null);
}

    return <>
    <div className='container'>
        {showConfirmFinish && <div><ReusableModal {...confirmFinish}/></div>}
        {!user && <div><ReusableModal {...unknownUserModal}/></div>}
        {deleteDisplay && <div><ReusableModal {...deleteWarning}/></div>}
        <form onSubmit={finishRecording}>
            <div className="row mb-2">
                <div className="col-3">
        {!startAt && elapsed === 0 &&
                <button className="btn btn-pink" onClick={()=>startRecording()}>Start Timer</button>}
            {!startAt && elapsed !== 0 && <div className="d-flex align-items-center gap-2">
                <p className="text-pink">{timeConverter(elapsed)}</p>
                <button className="btn btn-pink" onClick={()=>startRecording()}>Resume</button>
                </div>}
            {startAt && <div className="d-flex align-items-center gap-2 mb-2">
                <p className="text-pink">{timeConverter(duration)}</p>
                <button className="btn btn-pink" onClick={()=>pauseTimer()}>Pause</button>
                </div>}
                </div>
                <div className="col-9">
                    <div className='d-flex justify-content-center'>
                        <input  type="text" className="form-control form-control-lg text-center input-hola" onChange={(e)=>setName(e.target.value)} placeholder={`Default Name: Workout ${record.date.toLocaleDateString("en-AU")}`}></input>
                    </div>
                </div>
            </div>
            <hr className="hr" />


            <h3 className="text-pink mb-4">Exercises</h3>
            
            {groupedExs.map((ex) => (
                <div className={`card mb-3 ${current.workingOn && current.exId === ex.id ? "bg-pink" : ""}`} key={ex.id}>
                {/* // <div className="card mb-3" key={ex.id}> */}
                    <div className="card-body">
                        <div>
                            {current.workingOn && current.exId !== ex.id && (<div>
                                <button type="button" className="float-end btn btn-sm btn-pink" onClick={()=> setCurrent({workingOn: true, exId: ex.id})}>Expand</button>
                            </div>)}
                            {current.workingOn && current.exId === ex.id && (<div>
                                <button type="button" className="float-end btn btn-sm btn-pink" onClick={()=> setCurrent({workingOn: true, exId: ""})}>Hide Detail</button>
                            </div>)}
                            <button className="btn btn-pink btn-sm fload-end" type="button" onClick={()=>setDeleteDisplay(ex.id)}>Delete</button>
                            {/* <button className="btn btn-pink btn-sm fload-end" type="button" onClick={()=>deleteExercise(ex.id)}>Delete</button> */}
                            <Select className="mb-3 mt-1" isDisabled={current.exId !== ex.id} options={exOptions} onChange={(option) => {if (option) setExerciseName(option.value, option.label, ex.id);}}/>
                        </div>

                        {current.workingOn && current.exId === ex.id && Object.entries(ex.groupedSet).map(([groups, groupedSets]) => (
                            <div key={groups}>
                                <div className="row">
                                    <div className="col-2  d-flex justify-content-center align-items-center">
                                        <p className="text-pink fw-bold">Set {groups}</p>
                                    </div>
                                <div className="col-10">
                                
                                {groupedSets.map(set => (
                                    <div key={set.id}>
                                    <div className="row mb-2">
                                        <div className="col-5 d-flex align-items-center">
                                            <label className="me-2" htmlFor={`w-${set.id}`}>Weight: </label>
                                            <input type="text" 
                                            className="form-control"
                                            inputMode="decimal" id={`w-${set.id}`} placeholder="0" value={set.weight === 0 ? "" : set.weight} onChange={(e)=>{const value = e.target.value; changeSetWeight(set.id, ex.id, value === "" ? "0" : value)}}></input>
                                        </div>
                                        <div className="col-5   d-flex align-items-center">
                                            <label className="me-2" htmlFor={`r-${set.id}`}>Reps:</label>
                                            <input type="text"
                                            className="form-control"
                                            inputMode="decimal" id={`w-${set.id}`} value={set.reps} onChange={(e)=>changeSetReps(set.id, ex.id, e.target.value)}></input>
                                        </div>
                                        <div className="dropdown col-1">
                                            <button className="btn btn-sm" type="button" data-bs-toggle="dropdown"  aria-expanded="false"><i className="bi bi-three-dots-vertical text-pink"></i></button>
                                            <ul className="dropdown-menu">
                                                <li>
                                                    <button type="button" className="dropdown-item" onClick={()=> duplicateSet(ex.id, set)}>Duplicate set</button>
                                                </li>
                                                <li>
                                                    <button type="button" className="dropdown-item" onClick={()=> addDropSet(ex.id, set.order)}>Add drop set</button>
                                                </li>
                                                <li>
                                                    <button type="button" className="dropdown-item" onClick={()=>deleteSet(set.id, ex.id)}>Delete</button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    </div>
                                ))}
                                </div>
                                </div>
                                <hr className="hr" />
                            </div>
                        ))}
                        {current.workingOn && current.exId === ex.id && (
                            <div>
                                <button type="button" className="btn btn-pink btn-sm" onClick={()=> addSetInitial(ex.id)}>Add set</button>
                                <button className="btn btn-transparent" type="button" data-bs-toggle="modal" data-bs-target="#NewExercise"><i className="bi bi-box-arrow-up-right text-pink"></i> Didn't Find Your Exercise, Create Now</button>
                            </div>
                        )}
                    </div> 
                </div> //finish card
            ))}
            <button type = "button" className="btn btn-pink" onClick={()=>addExercise()}>Add Exercise</button>
            <hr className="hr" />
            {recordExerices.length !== 0 && 
                (<div>
                    <div>
                        <h3 className="text-pink mb-4">Summary</h3>
                        {duration === 0 && elapsed === 0 && <div>
                            <h5 className="text-pink">Are you recording a past workout?</h5>
                        <div className="mb-3">
                            {confirmedPast && 
                            <div>
                                <input type="date" className="form-control input-hola mb-1" id="DatePicker" />
                                <div className="d-flex align-items-center">
                                    <label htmlFor="duration" className="h5 text-nowrap text-pink me-2">Duration in minute: </label>
                                    <input id="duration" type="number" inputMode="decimal" className="form-control input-hola"></input>
                                </div>
                            </div>}
                            {!confirmedPast && <button className="btn btn-pink" onClick={()=>setConfirmedPast(true)}>Yes</button>}
  
</div>

                        <hr className="hr-light" />
                            </div>}
                        

                        <h5 className="text-pink">How hard did this workout feel</h5>
                        <div className="form-check container-three-cols">
                            {Rating.map((r) => (
                                <div key={r}>
                                    <div className="form-check">
                                        <input className="form-check-input checkbox" type="radio" name="rating" id={r} checked={record.rating===r} onChange={()=>setRating(r)}/>
                                        <label className="form-check-label" htmlFor={r}>{r}</label>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <hr className="hr-light" />
                        <h5 className="text-pink">Comment</h5>
                        <textarea className="form-control input-textarea" onChange={(e)=>setComment(e.target.value)}></textarea>
                        <hr className="hr-light" />
                    </div>
                    <hr className="hr" />
                <div className="text-center m-3"><button type="submit" className="btn btn-pink btn-lg">Finish</button></div></div>)
            }
        </form>
    </div>
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

export default AddRecord;
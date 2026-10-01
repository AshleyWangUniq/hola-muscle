
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExercises } from '../contexts/ExerciseContext';
import { EQUIPMENT } from '../data/Equipment';
import { MUSCLE_GROUPS } from '../data/MuscleGroups';
import { useUser } from '../contexts/UserContext';
import type { ModalProps } from '../types/reuseableModal';
import ReusableModal from "./ReusableModal";
import type { Exercise } from '../types/exercise';

interface thisProp{
    exercise ?: Exercise;
    onSuccess ?: ()=>void;
}

function ExerciseGenerator({exercise, onSuccess} : thisProp) {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
    const [equipment, setEquipment] = useState<string[]>([]);
    const {addExercise, editExercise} = useExercises();
    const {user} = useUser();
    const navigate = useNavigate();
    const edit = exercise !== undefined;
    const [showModal, setShow] = useState<boolean>(false);
    const [created, setCreated] = useState<boolean>(false);
    const [alertMuscle, setAlertMuscle] = useState<string | undefined>(undefined);
    const [alertEquip, setAlertEquip] = useState<string | undefined>(undefined);
    const [alertName, setAlertName] = useState<string | undefined>(undefined);

    const addedModal : ModalProps = {
        title:"Exercise Created",
        message: "Exercise is successfully created",
        cancelButton : {buttonDisplay:"Close", buttonAction:()=>onSuccess? onSuccess() :navigate(-1)},
        confirmButton : {buttonDisplay:"Create Another Exercise", buttonAction:()=>resetPage()}
    }

    const [modalDisplay, setModal] = useState<ModalProps>({
        title : "",
        message : "",
        cancelButton : {buttonDisplay : "Calcel", buttonAction : ()=>setShow(false)},
        confirmButton : {buttonDisplay : "Confirm", buttonAction : () => navigate(-1)}
    })


    useEffect(()=>{
        window.scrollTo(0, 0);
        if (exercise) {
        if (exercise.description) {
            setDescription(exercise.description);
        }
        setEquipment(exercise.equipment);
        setMuscleGroups(exercise.muscleGroups);
        setName(exercise.name);
    }
    },[exercise]);

    useEffect(()=> {
        if (alertMuscle && muscleGroups.length !== 0) setAlertMuscle(undefined);
    },[muscleGroups]);

    useEffect(()=>{
        if (alertEquip && equipment.length !== 0) setAlertEquip(undefined);
    },[equipment]);

    useEffect(()=>{
        if (alertName && name !== "") setAlertName(undefined);
    },[name]);

    function resetPage() {
        setCreated(false);
        setName("");
        setDescription("");
        setEquipment([]);
        setMuscleGroups([]);
    }

    async function handleSubmission(e : React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!user) {
            return;
        }  
        if (edit && exercise) {
            console.log("submit editing");
            const res = await editExercise(exercise._id, {name, description, muscleGroups, equipment});
            if (res) {
                if (res.status === 200) {
                    setShow(true);
                    setModal(prev => ({...prev, title:"Exercise Updated",cancelButton:undefined}));
                }
                if (res.status === 304) {
                    navigate(-1);
                }
            }
        } else {
            let hasError = false;
            if (name === "") {
                setAlertName("Please enter a name for your exercise.");
                hasError = true;
            }
            if (muscleGroups.length === 0) {
                setAlertMuscle("Please select at least one targeted muscle.");
                hasError = true;
            }
            if (equipment.length === 0) {
                setAlertEquip("Please select at least one equipment, select bodyweight if no extra equipment needed.");
                hasError = true;
            }
            if (hasError) return;
            const added = await addExercise({name, description, muscleGroups, equipment});
            if (added.status === 201) {
                setCreated(true);
            } else {
                alert(added.message);
            }
            

        }
    }
    return <>
      <div className='container'>
        <div className='d-flex justify-content-center'>
            {edit && <h1 className='text-pink'>Edit Exercise</h1>}
            {!edit && <h1 className='text-pink'>New Exercise</h1>}
        </div>
        <hr className='hr' />
        <form onSubmit={handleSubmission}>
            <div className='form-group'>
                <label className='text-pink'>Name*</label>
                <input className="form-control input-hola" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
            </div>
            {alertName && <div className="alert alert-warning m-4" role="alert">{alertName}</div> }

            <div className='form-group'>
                <label className='text-pink'>Description</label>
                <textarea 
                className='form-control input-textarea'
                value = {description}
                onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className='form-group'>
                <label className='text-pink'>Targeted Muscle Groups*</label>
                <div className='container-grid'>
                {MUSCLE_GROUPS.map((muscle) => (
                    <div className="form-check checkbox-container" key={muscle}>
                        <input className="form-check-input checkbox" type="checkbox" id={muscle} checked={muscleGroups.includes(muscle)} onChange={(e) => {
                            if (e.target.checked) { setMuscleGroups([...muscleGroups, muscle]);
                            } else {
                                setMuscleGroups(muscleGroups.filter((m) => m !== muscle));
                            }
                        }}
                        />
                        <label className="form-check-label" htmlFor={muscle} > {muscle} </label>
                        </div>
                ))}
                </div>
                {alertMuscle && <div className="alert alert-warning m-4" role="alert">{alertMuscle}</div> }
            </div>

            <div className='form-group'>
                <label className='text-pink'>Equipment*</label>
                <div className='container-grid'>
                {EQUIPMENT.map((equip) => (
                    <div className='form-check checkbox-container' key = {equip}>
                        <input className='form-check-input checkbox' type='checkbox' id={equip} checked={equipment.includes(equip)} onChange={(e) => {
                            if (e.target.checked) { setEquipment([...equipment, equip]);}
                            else { setEquipment(equipment.filter((eq) => eq !== equip));}
                        }} />
                        <label className='form-check-label' htmlFor={equip} > {equip}</label>
                    </div>
                ))}
                </div>
                {alertEquip && <div className="alert alert-warning m-4" role="alert">{alertEquip}</div> }
            </div>
            <div className='d-flex justify-content-center'>
                <button type = 'submit' className='btn btn-pink'>Submit</button>
            </div>
        </form>
    </div>
    {showModal && <ReusableModal {...modalDisplay} />}
    {created && <ReusableModal {...addedModal} />}
    </>;
}

export default ExerciseGenerator;
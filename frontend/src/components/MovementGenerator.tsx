
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovements } from '../contexts/MovementContext';
import { EQUIPMENT } from '../data/Equipment';
import { MUSCLE_GROUPS } from '../data/MuscleGroups';
import { useUser } from '../contexts/UserContext';
import type { Movement } from '../types/movement';
import type { ModalProps } from '../types/reuseableModal';
import ReusableModal from "./ReusableModal";

interface thisProp{
    movement ?: Movement;
}

function MovementGenerator({movement} : thisProp) {
    // const [movements, setMovements] = useState<Movement[]>([]);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
    const [equipment, setEquipment] = useState<string[]>([]);
    const { addMovement, editMovement} = useMovements();
    const {user} = useUser();
    const navigate = useNavigate();
    const edit = movement !== undefined;
    const [showModal, setShow] = useState<boolean>(false);
    const [created, setCreated] = useState<boolean>(false);

    const addedModal : ModalProps = {
        title:"Movement Created",
        message: "Movement is successfully created",
        cancelButton : {buttonDisplay:"Close", buttonAction:()=>navigate(-1)},
        confirmButton : {buttonDisplay:"Create Another Movements", buttonAction:()=>resetPage()}
    }

    const [modalDisplay, setModal] = useState<ModalProps>({
        title : "",
        message : "",
        cancelButton : {buttonDisplay : "Calcel", buttonAction : ()=>setShow(false)},
        confirmButton : {buttonDisplay : "Confirm", buttonAction : () => navigate(-1)}
    })

    useEffect(()=>{
        window.scrollTo(0, 0);
        if (movement) {
        if (movement.description) {
            setDescription(movement.description);
        }
        setEquipment(movement.equipment);
        setMuscleGroups(movement.muscleGroups);
        setName(movement.name);
    }
    },[movement]);
    
    function resetPage() {
        setCreated(false);
        setName("");
        setDescription("");
        setEquipment([]);
        setMuscleGroups([]);
    }

    function checkValidation() {
        return false;
    }


    async function handleSubmission(e : React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        if (checkValidation()) {
        }
        if (!user) {
            return;
        }  
        if (edit && movement) {
            console.log("submit editing");
            const res = await editMovement(movement._id, {name, description, muscleGroups, equipment});
            if (res) {
                if (res.status === 200) {
                    setShow(true);
                    setModal(prev => ({...prev, title:"Movement Updated",cancelButton:undefined}));
                }
                if (res.status === 304) {
                    navigate(-1);
                }
            }
            
        } else {
            addMovement({name, description, muscleGroups, equipment});
            setCreated(true);

        }
        // navigate("/Movements");
    }
    return <>
      <div className='container'>
        <div className='d-flex justify-content-center'>
            {edit && <h1 className='text-pink'>Edit Movement</h1>}
            {!edit && <h1 className='text-pink'>New Movement</h1>}
        </div>
        <hr className='hr' />
        <form onSubmit={handleSubmission}>
            <div className='form-group'>
                <label className='text-pink'>Name</label>
                <input className="form-control" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className='form-group'>
                <label className='text-pink'>Description</label>
                <textarea 
                className='form-control'
                value = {description}
                onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className='form-group'>
                <label className='text-pink'>Targeted Muscle Groups</label>
                <div className='container-grid'>
                {MUSCLE_GROUPS.map((muscle) => (
                    <div className="form-check checkbox-container" key={muscle}>
                        <input className="form-check-input" type="checkbox" id={muscle} checked={muscleGroups.includes(muscle)} onChange={(e) => {
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
            </div>

            <div className='form-group'>
                <label className='text-pink'>Equipment</label>
                <div className='container-grid'>
                {EQUIPMENT.map((equip) => (
                    <div className='form-check checkbox-container' key = {equip}>
                        <input className='form-check-input' type='checkbox' id={equip} checked={equipment.includes(equip)} onChange={(e) => {
                            if (e.target.checked) { setEquipment([...equipment, equip]);}
                            else { setEquipment(equipment.filter((eq) => eq !== equip));}
                        }} />
                        <label className='form-check-label' htmlFor={equip} > {equip}</label>
                    </div>
                ))}
                </div>
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

export default MovementGenerator;
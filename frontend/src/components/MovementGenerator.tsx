
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovements } from '../contexts/MovementContext';
import { EQUIPMENT } from '../data/Equipment';
import { MUSCLE_GROUPS } from '../data/MuscleGroups';
import { useUser } from '../contexts/UserContext';
import type { Movement } from '../types/movement';

interface thisProp{
    movement ?: Movement;
}

function MovementGenerator({movement} : thisProp) {
    // const [movements, setMovements] = useState<Movement[]>([]);
    const [name, setName] = useState<string>(movement?.name ?? "");
    const [description, setDescription] = useState(movement?.description ?? "");
    const [muscleGroups, setMuscleGroups] = useState<string[]>(movement?.muscleGroups ?? []);
    const [equipment, setEquipment] = useState<string[]>(movement?.equipment ?? []);

    const { addMovement, editMovement} = useMovements();
    const {user} = useUser();
    const navigate = useNavigate();
    const edit = movement !== undefined;
    if (movement) {
        if (movement.description) {
            setDescription(movement.description);
        }
        setEquipment(movement.equipment);
        setMuscleGroups(movement.muscleGroups);
        setName(movement.name);
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
            editMovement(movement._id, {name, description, muscleGroups, equipment});
        } else {
            addMovement({name, description, muscleGroups, equipment});
        }
        navigate("/Movements");
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
    </>;
}

export default MovementGenerator;
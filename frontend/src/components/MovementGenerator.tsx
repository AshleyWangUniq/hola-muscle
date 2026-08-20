
import { useState, type ReactEventHandler, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMovements } from '../contexts/MovementContext';
import type { Movement } from '../types/movement';
import { EQUIPMENT } from '../data/Equipment';
import { MUSCLE_GROUPS } from '../data/MuscleGroups';

// const muscleGroupOptions = [
//     "shoulder",
//     "Chest",
//     "Back",
//     "Legs"
// ]

// const equipmentOptions = [
//     "cable",
//     "barbell",
//     "dumbbell",
//     "none",
//     "band"
// ]

// interface Movement {
//   name: string;
//   description?: string;
//   muscleGroups: string[];
//   equipment?: string[] | undefined;
//     isPublic: boolean;
// }

function MovementGenerator() {
    // const [movements, setMovements] = useState<Movement[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
    const [equipment, setEquipment] = useState<string[]>([]);
    const {movements, addMovement} = useMovements();

    async function createMovement(e : React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) return;
        

        const res = await fetch("http://localhost:3000/api/movements", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({name, description, muscleGroups, equipment}),
        });

        if (!res.ok) {
            throw new Error("failed to create movement");
        }

        const newmovement : Movement = await res.json();
        addMovement(newmovement);

        // setMovements([...movements, newmovement]);
        setName("");
        setDescription("");
        setMuscleGroups([]);
        setEquipment([]);
    }
    return <>
      <div className='container'>
                <h1 className='text-pink'>New Movement</h1>
                <hr className='hr' />
        <form onSubmit={createMovement}>
            <div className='form-group'>
                <label>Name</label>
                <input className="form-control" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className='form-group'>
                <label>Description</label>
                <textarea 
                className='form-control'
                value = {description}
                onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className='form-group'>
                <label>Targeted Muscle Groups</label>
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
                <label>Equipments</label>
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

            <button type = 'submit' className='btn btn-pink'>Submit</button>
            {/* <button type = 'button' onClick={handleSubmission}>Submit</button> */}
        </form>
        <hr className='hr' />
        <div>
            <h3 className='text-pink'>My Movements</h3>
            {movements.map((movement) => (
                <div key={movement.name}>{movement.name} + {movement.description}</div>
            ))}
        </div> 
    </div></>;
}

export default MovementGenerator;
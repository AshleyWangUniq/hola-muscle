import { useState, type ReactEventHandler, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';


const muscleGroups = [
    "shoulder",
    "Chest",
    "Back",
    "Legs"
]

const equipmentsOptions = [
    "cable",
    "barbell",
    "dumbbell",
    "none",
    "band"
]

interface Movement {
    id: number;
  name: string;
  description?: string;
  musclegroups?: string[];
  equipments?: string[];
  images ?: string[];
}



function NewMovement() {

    const [movements, setMovements] = useState<Movement[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [musclegroups, setMusclegroups] = useState<string[]>([]);
    const [equipments, setEquipments] = useState<string[]>([]);
    const [images, setImages] = useState("");

    async function fetchMovements() {
        const res = await fetch("http://localhost:3000/api/movements");
        const fetcheddata : Movement[] = await res.json();
        setMovements(fetcheddata);
    }

    async function createMovement(e : React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        const res = await fetch("http://localhost:3000/api/movements", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({name, description, musclegroups, equipments}),
        });

        const newmovement : Movement = await res.json();
        setMovements([...movements, newmovement]);
        setName("");
        setDescription("");
        setMusclegroups([]);
        setEquipments([]);
        
    }
      useEffect(() => {
    fetchMovements();
  }, []);


    // const navigate = useNavigate();
    

    // const handleSubmission = () => {
    //     const movement :  Movement = {
    //         name,
    //         description,
    //         musclegroups,
    //         equipments
    //     };
    //     console.log(movement);
    //     navigate('/BodyPartPage', {state : {name : movement.name,},});
    // };


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
                {muscleGroups.map((muscle) => (
                    <div className="form-check checkbox-container" key={muscle}>
                        <input className="form-check-input" type="checkbox" id={muscle} checked={musclegroups.includes(muscle)} onChange={(e) => {
                            if (e.target.checked) { setMusclegroups([...musclegroups, muscle]);

                            } else {
                                setMusclegroups(musclegroups.filter((m) => m !== muscle));
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
                {equipmentsOptions.map((equipment) => (
                    <div className='form-check checkbox-container' key = {equipment}>
                        <input className='form-check-input' type='checkbox' id={equipment} checked={equipments.includes(equipment)} onChange={(e) => {
                            if (e.target.checked) { setEquipments([...equipments, equipment]);}
                            else { setEquipments(equipments.filter((eq) => eq !== equipment));}
                        }} />
                        <label className='form-check-label' htmlFor={equipment} > {equipment}</label>
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
                <div key={movement.id}>{movement.name} + {movement.description}</div>
            ))}
        </div>
    </div>

    </>;
}

export default NewMovement;
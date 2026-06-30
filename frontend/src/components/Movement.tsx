import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';


interface Movement {
    id : number;
  name: string;
  description: string;
  musclegroups: string[];
  equipments: string[];
  images : string[];
}

interface MovementName {
    name : string;
}

function Movement(name : MovementName) {
    const [movements, setMovements] = useState<Movement[]>([]);



    async function fetchMOvementsByMuscle(muscle : string) {
        const res = await fetch(`http://localhost:3000/api/movements?muscleGroup=${muscle}`);
        const data: Movement[] = await res.json();
        setMovements(data);
    }
    // fetchMOvementsByMuscle(name.name);

    useEffect(()=> {
        fetchMOvementsByMuscle(name.name);
    }, []);

    return (
        <div>
            <h1>{name.name}</h1>
            <div>
                {movements.map((mov)=>(
                    <div className='card' key={mov.id}>
                        <div className='card-body'>
                            <h5 className='card-title'>{mov.name}</h5>
                            <p className='card-text'>{mov.description}</p>
                            <h6>Targeted Muscle Groups{mov.musclegroups.map((muscle) => (
                                <span className='badge text-bg-secondary'>{muscle}</span>
                            ))}</h6>
                        </div>
                    </div>

                ))}
            </div>
            <p>movement page, this is a separate component</p>
            </div>
    );
}

export default Movement;
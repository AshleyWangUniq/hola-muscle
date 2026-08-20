import { useState } from 'react';
import { useMovements } from '../contexts/MovementContext';
import type { Movement } from '../types/movement';


interface MovementName {
    name : string;
}

function MovementsDisplay(name : MovementName) {
    const {movements} = useMovements();
    const muscle = name.name;
    // const [displayMovements, setDisplayMovements] = useState<Movement[]>([]);
    console.log("muscle is: ", muscle);

    const displayMovements = muscle === "all" ? movements : movements.filter((mov) => mov.muscleGroups.includes(muscle));

 
    return (
        <div>
            <h1 className='text-pink'>{name.name}</h1>
            <div>
                {displayMovements.map((mov)=>(
                    // (mov.muscleGroups.includes(muscle)) && 
                    <div className='card small-container' key={mov.name}>
                        <div className='card-body'> 
                            <h5 className='card-title text-pink'>{mov.name}</h5>
                            <p className='card-text'>{mov.description}</p>
                            <h6>Targeted Muscle Groups{mov.muscleGroups.map((muscle) => (
                                <span className='badge text-bg-pink me-1'>{muscle}</span>
                            ))}
                            </h6>
                            <h6>Equipment: {mov.equipment.map((equipment)=>(<span className='badge text-bg-pink me-1'>{equipment}</span>))}</h6>
                        </div>
                    </div>
                        
                ))}
            </div>
        </div>
    );
}

export default MovementsDisplay;
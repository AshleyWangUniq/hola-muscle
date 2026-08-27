
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMovements } from '../contexts/MovementContext';
import MovementGenerator from '../components/MovementGenerator';
import type { Movement } from '../types/movement';


 function EditMovement() {
    const navigate = useNavigate();
    const {findMovementById} = useMovements();
    const {id} = useParams<{id : string}>();
    // const [movement, setMovement] = useState<Movement>(); 
    const movement = useState<Movement|undefined | null>(id? findMovementById(id) : null);
    console.log(movement);
    // return <>{movement!== undefined && movement !== null && <MovementGenerator movement={movement}/>}
    return <>
    {!movement && <p>for now</p>}
        {!movement && <p>Failed Baby</p>}
    </>

}

export default EditMovement;
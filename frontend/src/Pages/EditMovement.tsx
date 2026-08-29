
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMovements } from '../contexts/MovementContext';
import MovementGenerator from '../components/MovementGenerator';
import type { Movement } from '../types/movement';
import ReusableModal from '../components/ReusableModal';
import type { ModalProps } from '../types/reuseableModal';


 function EditMovement() {
    const navigate = useNavigate();
    const {findMovementById} = useMovements();
    const {id} = useParams<{id : string}>();

    if (!id) {
        const noMovement : ModalProps = {
        title : "No Movement",
        message : "No movement found.", 
        confirmButton : {buttonDisplay : "Close", buttonAction : ()=>navigate(-1)}
    }
        return <ReusableModal {...noMovement} />
    }

    const movement = findMovementById(id);

    if (!movement) {
        const noMovement : ModalProps = {
        title : "No Movement",
        message : "No movement found.", 
        confirmButton : {buttonDisplay : "Close", buttonAction : ()=>navigate(-1)}
    }
        return <ReusableModal {...noMovement} />
    }

    return <MovementGenerator movement={movement}/>


}

export default EditMovement;
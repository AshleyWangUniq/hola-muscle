
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useExercises } from '../contexts/ExerciseContext';
import ExerciseGenerator from '../components/ExerciseGenerator';
import type { Exercise } from '../types/exercise';
import ReusableModal from '../components/ReusableModal';
import type { ModalProps } from '../types/reuseableModal';


 function EditExercise() {
    const navigate = useNavigate();
    const {findExerciseById} = useExercises();
    const {id} = useParams<{id : string}>();

    if (!id) {
        const noExercise : ModalProps = {
        title : "No Exercise",
        message : "No exercise found.", 
        confirmButton : {buttonDisplay : "Close", buttonAction : ()=>navigate(-1)}
    }
        return <ReusableModal {...noExercise} />
    }

    const exercise = findExerciseById(id);

    if (!exercise) {
        const noExercise : ModalProps = {
        title : "No Exercise",
        message : "No exercise found.", 
        confirmButton : {buttonDisplay : "Close", buttonAction : ()=>navigate(-1)}
    }
        return <ReusableModal {...noExercise} />
    }

    return <ExerciseGenerator exercise={exercise}/>


}

export default EditExercise;

import { useNavigate, useParams } from 'react-router-dom';
import { useWorkouts } from '../contexts/WorkoutContext';
import WorkoutGenerator from './WorkoutGenerator';
import ReusableModal from '../components/ReusableModal';
import type { ModalProps } from '../types/reuseableModal';


 function EditWorkout() {
    const navigate = useNavigate();
    const {findWorkoutById} = useWorkouts();
    const {id} = useParams<{id : string}>();

    if (!id) {
        const noWorkout : ModalProps = {
        title : "No Workout",
        message : "No workout found.", 
        confirmButton : {buttonDisplay : "Close", buttonAction : ()=>navigate(-1)}
    }
        return <ReusableModal {...noWorkout} />
    }

    const wkout = findWorkoutById(id);

    if (!wkout) {
        const noWorkout : ModalProps = {
        title : "No Workout",
        message : "No workout found.", 
        confirmButton : {buttonDisplay : "Close", buttonAction : ()=>navigate(-1)}
    }
        return <ReusableModal {...noWorkout} />
    }

    return <WorkoutGenerator editWorkout={wkout}/>
}

export default EditWorkout;
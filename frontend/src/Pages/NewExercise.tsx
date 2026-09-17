import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import type { ModalProps } from '../types/reuseableModal';
import ReusableModal from "../components/ReusableModal";
import ExerciseGenerator from '../components/ExerciseGenerator';

function NewExercise() {
  const navigate = useNavigate();
  const {user} = useUser();

  const modalProps : ModalProps= {
    title : "Unknown User", 
    message : "Please log in to generate your workout.", 
    cancelButton : {
      buttonDisplay : "Cancel",
      buttonAction : () => navigate("/"),
    },
    confirmButton : {
      buttonDisplay : "Log In", 
      buttonAction : ()=>navigate("/logIn")
    }
  }

    return <>
    {!user && <div><ReusableModal {...modalProps}/></div>}
      <div><ExerciseGenerator /></div>
    </>;
}

export default NewExercise;
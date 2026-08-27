import {useState, useEffect } from 'react';
import {Navigate, useNavigate } from 'react-router-dom';
import MovementGenerator from '../components/MovementGenerator';
import type { User } from '../types/user';
import { useUser } from '../contexts/UserContext';
import type { ModalProps } from '../types/reuseableModal';
import ReusableModal from "../components/ReusableModal";

function NewMovement() {
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
      <div><MovementGenerator /></div>
    </>;
}

export default NewMovement;
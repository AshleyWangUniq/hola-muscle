import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import type {ModalProps} from "../types/reuseableModal"
import ReusableModal from "../components/ReusableModal";

function Profile() {
    const {user, deleteUser} = useUser();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [pwd, setPwd] = useState<string>("");
    const modalDisplay : ModalProps = {
        title:"Delete User",
        message:"Delete user will alsow delete your data, do you still want to delete?",
        cancelButton:{buttonDisplay:"Cancel", buttonAction:()=>setShowModal(false)},
        confirmButton:{buttonDisplay:"Delete", buttonAction:()=>deleteThis()}
    }

    async function deleteThis() {
        const res = await deleteUser(pwd);
        alert(res.message);
    }

    useEffect(()=>{
        if (!user){
            navigate("/");
        }
    },[user]);

    return <>
    <h1 className="text-pink">Hi {user?.firstName}</h1>
    <button onClick={()=>setShowModal(true)}>Delete User</button>
    {showModal && 
        <div className="modal d-block" tabIndex={-1}>
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title text-pink">Delete User</h5>
                </div>
                <div className="modal-body">
                    <p>You are deleting your user, please enter your password to continue: </p>
                    <input className='form-control' type="password" value={pwd} onChange={(e)=>setPwd(e.target.value)}></input>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-light me-1" onClick={()=>setShowModal(false)}>Cancel</button>
                    <button type="button" className="btn btn-pink" onClick={()=>deleteThis()}>Confirm</button>
                </div>
            </div>
        </div>
    </div> }
    </>
}

export default Profile;
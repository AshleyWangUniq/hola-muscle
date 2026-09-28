import { type ModalProps } from "../types/reuseableModal";
import ReusableModal from "../components/ReusableModal";
import Message from "../Message";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { StrengthRecord } from "../types/strengthRecord";
import { useUser } from "../contexts/UserContext";

function Records() {
    const navigate = useNavigate();
    const [showStarter, setStarter] = useState(false);
    const [records, setRecords] = useState<StrengthRecord[]>([]);
    const {user, fetchHelper} = useUser();
    const API_URL = import.meta.env.VITE_API_URL;

    const modalDisplay : ModalProps = {
        title: "Starting...", 
        message: "How do you want to start your workout",
        cancelButton: {buttonDisplay: "From a workout template", buttonAction: ()=>navigate("/WorkoutPage")},
        confirmButton: {buttonDisplay: "From movements", buttonAction: ()=>navigate("/AddRecord")}
    }
    useEffect(()=>{
        loadRecords();
    },[])

    const [confirmDelete, setConfirmDelete] = useState<string|undefined>(undefined); 

    const deleteWarning : ModalProps = {
    title : "Delete Record", 
    message : "Deleted record can't be recovered, do you still want to delete this record?", 
    cancelButton : {
      buttonDisplay : "Cancel",
      buttonAction : () => setConfirmDelete(undefined),
    },
    confirmButton : {
      buttonDisplay : "Confirm", 
      buttonAction : ()=>{confirmDelete && deleteRecord(confirmDelete);}
    }
  }

    const unknownUserModal : ModalProps= {
    title : "Unknown User", 
    message : "Please log in to find your workout history.", 
    cancelButton : {
      buttonDisplay : "Cancel",
      buttonAction : () => navigate("/"),
    },
    confirmButton : {
      buttonDisplay : "Log In", 
      buttonAction : ()=>navigate("/logIn")
    }
  }
  
  async function deleteRecord(id:string) {
    try {
        if (confirmDelete) {
            const res = await fetchHelper(`${API_URL}/api/strength-records/${id}`, true, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }});
            setConfirmDelete(undefined);
            const data = await res.json();
            if (!res.ok) {
                alert(data.message);
            }
            await loadRecords();
        }
        else {
            setConfirmDelete(id);
    }
    }catch(err) {
        console.log(err);
    }
  }

    async function loadRecords() {
        try {
            const res = await fetchHelper(`${API_URL}/api/strength-records`, true, {});
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data);
            }
            setRecords(data);
        }catch(err){
            console.log(err);
        }
    }

    

    return <>
    {confirmDelete && <div><ReusableModal {...deleteWarning} /></div>}
    {!user && <div><ReusableModal {...unknownUserModal}/></div>}
        <div>
            <button className="btn btn-pink btn-lg float-end" onClick={()=>setStarter(true)}>Start Exercising</button> 
            <h1 className='text-pink'>Records</h1>
            <hr className="hr" />
        </div>
        <div>
            <h3 className="text-pink">History</h3>
            <div className="container-grid">
            {records.map((rec)=> (<div>
                <div className='card'>
		<div className='card-header bg-pink'>
            <button className="btn btn-pink btn-sm float-end" onClick={()=>deleteRecord(rec._id)}>Delete</button>
            <h5 className="text-pink">{rec.name}</h5>
		</div>
		<div className='card-body'>
            {rec.rating && <p className="float-end">Rating: {rec.rating}</p>}
            <p>Date: {new Date(rec.date).toLocaleDateString("en-AU")}</p>
            <ul>
                {rec.exercises.map(ex=>(<li>{ex.name}</li>))}
            </ul>
            {rec.comment && <p>{rec.comment}</p>}
		</div>
	</div>
</div>
                ))}
                </div>
        </div>
        {showStarter && <div><ReusableModal {...modalDisplay} /></div>}
    </>
}

export default Records;
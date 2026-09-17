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

    const modalDisplay : ModalProps = {
        title: "Starting...", 
        message: "How do you want to start your workout",
        cancelButton: {buttonDisplay: "From a workout template", buttonAction: ()=>navigate("/WorkoutPage")},
        confirmButton: {buttonDisplay: "From movements", buttonAction: ()=>navigate("/AddRecord")}
    }
    useEffect(()=>{
        loadRecords();
    },[])

    async function loadRecords() {
        try {
            const res = await fetchHelper("http://localhost:3000/api/strength-records", true, {});
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
        <div>
            <button className="btn btn-pink float-end" onClick={()=>setStarter(true)}>Start Exercising</button> 
            <h1 className='text-pink'>Records</h1>
            <hr className="hr" />
        </div>
        <div>
            <h3 className="text-pink">History</h3>
            {records.map((rec)=> <p className="text-pink">{rec.name}</p>)}
        </div>
        {showStarter && <div><ReusableModal {...modalDisplay} /></div>}
    </>
}

export default Records;
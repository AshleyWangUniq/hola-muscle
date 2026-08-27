import { useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

function Profile() {
    const {user} = useUser();
    const navigate = useNavigate();

    useEffect(()=>{
        if (!user){
            navigate("/");
        }
    },[user]);

    return <>
    <h1 className="text-pink">User Profile</h1>
    </>
}

export default Profile;
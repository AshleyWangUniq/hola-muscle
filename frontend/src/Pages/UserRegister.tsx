import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import ReusableModal from "../components/ReusableModal";
import type { ModalProps } from "../types/reuseableModal";


function UserRegister() {
    const navigate = useNavigate();
    const {user, register} = useUser();
    const [showModal, setShowModal] = useState(false);
    const existedUser : ModalProps= {
        title : "Existed User", 
        message : "Existed User",
        cancelButton : {
            buttonDisplay : "Cancel",
            buttonAction : ()=>setShowModal(false)
        },
        confirmButton : {
            buttonDisplay : "Log In",
            buttonAction : ()=>navigate("/LogIn")
        }
    }

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const userData = {
        firstName,
        lastName,
        email,
        password,
    };

    useEffect(()=>{
        if (user) {
            navigate("/Profile");
        }
    },[user])

    async function handleSubmission(e: React.SyntheticEvent<HTMLFormElement>){
        e.preventDefault();

        const {status} = await register(userData);
        if (status === 200) {
            navigate("/Profile");
        }
        if (status === 409) {
            setShowModal(true);
        }
    }

    return <>
    {showModal && <div><ReusableModal {...existedUser}/></div>}
    <div className="container">
    <h1 className="text-pink">Register</h1>
    <hr className="hr"></hr>
    <form onSubmit={handleSubmission}>
        <div className="row">
            <div className="form-group col">
                <label htmlFor="firstName">First Name</label>
                <input className="form-control" type="text" value={firstName} onChange={(e)=> {
                    setFirstName(e.target.value)
                }}></input>
            </div>
            <div className="form-group col">
                <label htmlFor="lastName">Last Name</label>
                <input className="form-control" type="text" value={lastName} onChange={(e)=>
                    setLastName(e.target.value)
                }></input>
            </div>
        </div>
        <div className="form-group">
            <label htmlFor="email">Email</label>
            <input className="form-control" type="email" value={email} onChange={(e)=>setEmail(e.target.value)}></input>
        </div>
        <div className="form-group">
            <label htmlFor="password">Password</label>
            <input className="form-control" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}></input>
        </div>
        <button className="btn btn-pink" type="submit">Register</button>
        <hr className="hr"></hr>
        <p>Already have an account? 
            <Link className="text-pink" to="/LogIn">Log in</Link>
        </p>
    </form>
    </div>
    </>;
}

export default UserRegister;
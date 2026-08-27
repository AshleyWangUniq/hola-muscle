import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

// interface buttonCombination {
//     buttonDisplay : string;
//     buttonAction : () => void;
// }

// export interface ModalProps {
//     title : string;
//     message : string;
//     cancelButton ?: buttonCombination;
//     confirmButton : buttonCombination;
// }

function logIn() {

    const {user, logIn} = useUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [warning, setWarning] = useState(false);
    const [warningMsg, setWarningMsg] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        if (user) {
            navigate(-1);
        }
    },[user]);

    async function handleSubmission(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        

        const res = await logIn({email, password});
        if (res.stat !== 200) {
            setWarning(true);
            setWarningMsg(res.msg);
        }
    }

    return <>
    <div className="container">
    <h1 className="text-pink"> Log In</h1>
    <hr className='hr' />
    <form onSubmit={handleSubmission}>
        <div className='form-group'>
            <label>Email</label>
            <input className="form-control" type="email" value={email} onChange={(e)=>setEmail(e.target.value)}></input>
        </div>
        <div className='form-group'>
            <label>Password</label>
            <input className='form-control' type="password" value={password} onChange={(e)=>setPassword(e.target.value)}></input>
        </div>
        <button type="submit" className='btn btn-pink mb-3'>Sign In</button>
        {warning && <div className="alert alert-light"><i className="bi bi-exclamation-lg"></i>{warningMsg}</div>}
    </form>
    <hr className="hr"></hr>
        <p>Don't have an account yet?
            <Link className="text-pink" to="/UserRegister">Register</Link>
        </p>
    </div>
    </>
}

export default logIn;
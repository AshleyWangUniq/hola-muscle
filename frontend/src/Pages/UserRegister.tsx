import { useContext, useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import type { User } from "../types/user";


interface LoginPageProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

function UserRegister({setUser}: LoginPageProps) {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    if (token) {
        navigate("/Profile");
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



    async function handleSubmission(e: React.SyntheticEvent<HTMLFormElement>){
        e.preventDefault();

        // console.log("userData is", userData);

        const response = await fetch("http://localhost:3000/api/Users", {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        const result = await response.json();
        if (response.ok) {
            localStorage.setItem("token", result.token);
            setUser(result);
            navigate("/LogIn");
        } else {
            alert(result.message);
        }
        // console.log(result);
    }

    return <>
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
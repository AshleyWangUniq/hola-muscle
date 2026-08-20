import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { User } from "../types/user";
import { useMovements } from "../contexts/MovementContext";
import { useWorkouts } from "../contexts/WorkoutContext";

interface LoginPageProps {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

function logIn({ setUser }: LoginPageProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const {refreshMovements} = useMovements();
    const {loadWorkouts} = useWorkouts();


    async function handleSubmission(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        const response = await fetch("http://localhost:3000/api/LogIn", {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password}),
        })

        const result = await response.json();
        if(response.ok) {
            localStorage.setItem("token", result.token);
            setUser(result.user);
            refreshMovements();
            loadWorkouts();
            navigate("/");
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
        <button type="submit" className='btn btn-pink'>Sign In</button>
    </form>
    <hr className="hr"></hr>
        <p>Don't have an account yet?
            <Link className="text-pink" to="/UserRegister">Register</Link>
        </p>
    </div>
    </>
}

export default logIn;
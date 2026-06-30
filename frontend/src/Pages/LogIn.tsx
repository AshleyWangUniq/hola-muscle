import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function logIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const userLogIn = {
        email,
        password,
    };

    async function handleSubmission(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        

        const response = await fetch("http://localhost:3000/api/LogIn", {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userLogIn),
        })

        const result = await response.json();
        if(response.ok) {
            localStorage.setItem("token", result.token);
            console.log(localStorage.getItem("token"));
            navigate("/");
        }
        alert(result.message);

    }
    return <>
    <h1> Log In</h1>
    <form onSubmit={handleSubmission}>
        <div>
            <label>Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}></input>
        </div>
        <div>
            <label>Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}></input>
        </div>
        <button type="submit">Sign In</button>
    </form>
    </>
}

export default logIn;
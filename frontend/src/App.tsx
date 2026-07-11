import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import './index.css'
import Movements from "./Pages/Movements";
import HomePage from "./Pages/HomePage";
import NewMovement from "./Pages/NewMovement";
import UserRegister from "./Pages/UserRegister";
import WorkoutGenerator from "./Pages/WorkoutGenerator";
import LogIn from "./Pages/LogIn";
import Workout from "./Pages/Workout";
import Profile from "./Pages/Profile";
import { useState } from "react";
import type { User } from "./types/user";


function App() {

  const [user, setUser] = useState<User | null>(null);

  return <div><NavBar user={user} setUser={setUser}/>
  <div className="container">
  <Routes>
    <Route path="/" element = {<HomePage/>} />
    <Route path="/Movements" element={<Movements />} />
    <Route path="/NewMovement" element={<NewMovement user={user}/>} />
    <Route path="/UserRegister" element={<UserRegister setUser={setUser}/>} />
    <Route path="/LogIn" element={<LogIn setUser={setUser}/>} />
    <Route path="/Workout" element={<Workout />} />
    <Route path="/Profile" element={<Profile />} />
    <Route path="/WorkoutGenerator" element={<WorkoutGenerator />} />

  </Routes>
  </div>
</div>;
}

export default App;
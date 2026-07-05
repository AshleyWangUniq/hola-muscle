import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import './index.css'
import BodyPartPage from "./Pages/BodyPartPage";
import HomePage from "./Pages/HomePage";
import NewMovement from "./Pages/NewMovement";
import UserRegister from "./Pages/UserRegister";
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
    <Route path="/BodyPartPage" element={<BodyPartPage />} />
    <Route path="/NewMovement" element={<NewMovement />} />
    <Route path="/UserRegister" element={<UserRegister setUser={setUser}/>} />
    <Route path="/LogIn" element={<LogIn setUser={setUser}/>} />
    <Route path="/Workout" element={<Workout />} />
    <Route path="/Profile" element={<Profile />} />
  </Routes>
  </div>
</div>;
}

export default App;
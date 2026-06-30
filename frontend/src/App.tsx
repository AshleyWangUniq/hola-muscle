import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import './index.css'
import BodyPartPage from "./Pages/BodyPartPage";
import HomePage from "./Pages/HomePage";
import NewMovement from "./Pages/NewMovement";
import UserRegister from "./Pages/UserRegister";
import LogIn from "./Pages/LogIn";
import { useState } from "react";


function App() {


  return <div><NavBar />
  <div className="container">
  <Routes>
    <Route path="/" element = {<HomePage/>} />
    <Route path="/BodyPartPage" element={<BodyPartPage />} />
    <Route path="/NewMovement" element={<NewMovement />} />
    <Route path="/UserRegister" element={<UserRegister />} />
    <Route path="/LogIn" element={<LogIn />} />
  </Routes>
  </div>
</div>;
}

export default App;
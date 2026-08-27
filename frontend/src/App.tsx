import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import './index.css'
import Movements from "./Pages/Movements";
import HomePage from "./Pages/HomePage";
import NewMovement from "./Pages/NewMovement";
import UserRegister from "./Pages/UserRegister";
import WorkoutGenerator from "./Pages/WorkoutGenerator";
import LogIn from "./Pages/LogIn";
import WorkoutPage from "./Pages/WorkoutPage";
import Profile from "./Pages/Profile";
import LogInReminder from "./Pages/LogInReminder";
import WorkoutDetail from "./Pages/WorkoutDetail";
import EditMovement from "./Pages/EditMovement";


function App() {
  return <div><NavBar />
  <div className="container">
  <Routes>
    <Route path="/" element = {<HomePage/>} />
    <Route path="/Movements" element={<Movements />} />
    <Route path="/NewMovement" element={<NewMovement />} />
    <Route path="/EditMovement/:id" element={<EditMovement />} />
    <Route path="/UserRegister" element={<UserRegister />} />
    <Route path="/LogIn" element={<LogIn />} />
    <Route path="/WorkoutPage" element={<WorkoutPage />} />
    <Route path="/Profile" element={<Profile />} />
    <Route path="/WorkoutGenerator" element={<WorkoutGenerator />} />
    <Route path="/LogInReminder" element={<LogInReminder />} />
    <Route path="/WorkoutDetail" element={<WorkoutDetail />} />
  </Routes>
  </div>
</div>;
}

export default App;
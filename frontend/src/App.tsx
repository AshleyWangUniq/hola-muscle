import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import './index.css'
// import Movements from "./Pages/Movements";
import Exercises from "./Pages/Exercises";
import HomePage from "./Pages/HomePage";
// import NewMovement from "./Pages/NewMovement";
// import NewExercise from "./Pages/NewExercise";
import UserRegister from "./Pages/UserRegister";
import WorkoutGenerator from "./Pages/WorkoutGenerator";
import LogIn from "./Pages/LogIn";
import WorkoutPage from "./Pages/WorkoutPage";
import Profile from "./Pages/Profile";
import LogInReminder from "./Pages/LogInReminder";
import WorkoutDetail from "./Pages/WorkoutDetail";
import EditExercise from "./Pages/EditExercise";
import EditWorkout from "./Pages/EditWorkout";
import NewExercise from "./Pages/NewExercise";
import Records from "./Pages/Records";
import AddRecord from "./Pages/AddRecord";
import PickWorkout from "./Pages/PickWorkout";


function App() {
  return <div><NavBar />
  <div className="main-container">
  <Routes>
    <Route path="/" element = {<HomePage/>} />
    <Route path="/Exercises" element={<Exercises />} />
    <Route path="/NewExercise" element={<NewExercise />} />
    <Route path="/EditExercise/:id" element={<EditExercise />} />
    <Route path="/EditWorkout/:id" element={<EditWorkout />} />
    <Route path="/UserRegister" element={<UserRegister />} />
    <Route path="/LogIn" element={<LogIn />} />
    <Route path="/WorkoutPage" element={<WorkoutPage />} />
    <Route path="/Profile" element={<Profile />} />
    <Route path="/WorkoutGenerator" element={<WorkoutGenerator />} />
    <Route path="/LogInReminder" element={<LogInReminder />} />
    <Route path="/WorkoutDetail" element={<WorkoutDetail />} />
    <Route path="/Records" element={<Records />} />
    <Route path="/Addrecord" element={<AddRecord />} />
    <Route path="/PickWorkout" element={<PickWorkout />} />
  </Routes>
  </div>
</div>;
}

export default App;
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
import NewExercise from "./Pages/NewExercise";


function App() {
  return <div><NavBar />
  <div className="container">
  <Routes>
    <Route path="/" element = {<HomePage/>} />
    <Route path="/Exercises" element={<Exercises />} />
    <Route path="/NewExercise" element={<NewExercise />} />
    <Route path="/EditExercise/:id" element={<EditExercise />} />
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
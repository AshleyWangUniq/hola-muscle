import { Link } from "react-router-dom";
import Profile from "../Pages/Profile";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useUser } from "../contexts/UserContext";


function NavBar() {
  const {user, logOut} = useUser();
    return <nav className="navbar navbar-expand-lg">
      <Link className="navbar-brand" to={"/"}><img src="/src/assets/logo.png" alt="logo" height="30" /></Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto gap-3">
          <li className="nav-item">
            {/* <button type="button" id={"all"} className="list-group-item" onClick={()=>toDetail("all")}>All</button> */}
            <Link className="nav-link" to="Exercises" state={{name:"All"}}>Exercises</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={"/WorkoutPage"}>Workout</Link>
          </li>
          {user && 
          <li className="nav-item dropdown">
            <button id="userDropdown" className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span><i className="bi bi-person-circle"></i>{user.firstName}</span>
            </button>
            <div aria-labelledby="userDropdown" className="dropdown-menu">
              <Link to="/Profile" className="dropdown-item">Profile</Link>
              <button className="dropdown-item" onClick={logOut}>Log Out</button>
            </div>
          </li>
          }
          {!user && <li className="nav-item dropdown">
                <button id="registerDropdown" className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span><i className="bi bi-person-circle"></i></span>
                </button>
                <div aria-labelledby="registerDropdown" className="dropdown-menu dropdown-menu-end">
                  <Link className="dropdown-item" to={"/UserRegister"}>Register</Link>
                  <Link className="dropdown-item" to={"/LogIn"}>Log In</Link>
                </div>
              </li>}

        </ul>
      </div>
      </nav>
}

export default NavBar;
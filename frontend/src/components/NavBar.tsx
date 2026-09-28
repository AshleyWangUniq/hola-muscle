import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useUser } from "../contexts/UserContext";
import logo2 from "../assets/logo2.png";

function NavBar() {
  const {user, logOut} = useUser();
    return <nav className="navbar sticky-top navbar-expand-md">
      <div className="container-fluid">
      <Link className="navbar-brand" to={"/"}><img src={logo2} alt="logo" height="60" /></Link>
      <button className="navbar-toggler btn-pink"
        type="button" 
        data-bs-toggle="collapse"
        data-bs-target="#navbarItems"
        aria-controls="navbarItems"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarItems">
        <ul className="navbar-nav ms-auto gap-lg-3">
          <li className="nav-item">
            {/* <button type="button" id={"all"} className="list-group-item" onClick={()=>toDetail("all")}>All</button> */}
            <Link className="nav-link text-white" to="Exercises" state={{name:"All"}}>Exercises</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to={"/WorkoutPage"}>Workout</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to={"/Records"}>Records</Link>
          </li>
          {user && 
          <li className="nav-item dropdown">
            <button id="userDropdown" className="nav-link dropdown-toggle text-white" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span><i className="bi bi-person-circle"></i>{user.firstName}</span>
            </button>
            <div aria-labelledby="userDropdown" className="dropdown-menu">
              <Link to="/Profile" className="dropdown-item">Profile</Link>
              <button className="dropdown-item" onClick={logOut}>Log Out</button>
            </div>
          </li>
          }
          {!user && <li className="nav-item dropdown">
                <button id="registerDropdown" className="nav-link dropdown-toggle text-white" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span><i className="bi bi-person-circle"></i></span>
                </button>
                <div aria-labelledby="registerDropdown" className="dropdown-menu dropdown-menu-end">
                  <Link className="dropdown-item" to={"/UserRegister"}>Register</Link>
                  <Link className="dropdown-item" to={"/LogIn"}>Log In</Link>
                </div>
              </li>}

        </ul>
      </div>
      </div>
      </nav>
}

export default NavBar;
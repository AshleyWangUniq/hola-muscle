import { Link } from "react-router-dom";
import { useCallback, useState, useEffect } from "react";

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}


function NavBar() {
      const [connect, setConnect] = useState({});
      const [isLoged, setIsLoged] = useState(false);
      const [user, setUser] = useState<UserProfile | null>(null);

      useEffect(()=> {
        async function fetchUser() {
          const token = localStorage.getItem("token");

          if (!token) return;
          // console.log("Token is:", token);

          const response = await fetch("http://localhost:3000/api/profile", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const result = await response.json();

          if (response.ok) {
            setIsLoged(true);
            setUser(result);
          }
        } 

        fetchUser();
      },[]);

  async function callBackend() {
    try {
      const response = await fetch("http://localhost:3000/api/hello");
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      setConnect(data);
      console.log(data);
    } catch(error) {
      console.error("error message: ", error); 
    }
  }


    return <nav className="navbar justify-content-between">
            <Link to={"/"}><img src="/src/assets/logo.png" alt="logo" height="30" /></Link>
            {/* <a href="#">
                <img src="src/assets/holaMuscleOneLine (1).png" alt="logo" height="50" />
            </a> */}
            <button className="btn btn-link" type="button">
              {isLoged && <a><i className="bi bi-person-circle"></i>{user?.firstName}</a>}
              {!isLoged && <Link to={"/UserRegister"}><i className="bi bi-person-circle"></i>Register</Link>}
              
            </button>

            <button className="btn btn-link" type="button">
                <Link to={"/NewMovement"}>
                New Movement
                </Link>
                </button>
</nav>;
}

export default NavBar;
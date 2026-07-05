import {useState, useEffect } from 'react';
import {Navigate, useNavigate } from 'react-router-dom';
import MovementGenerator from '../components/MovementGenerator';
import type { User } from '../types/user';

interface movProp {
  user: User | null;
}

function NewMovement(user : movProp) {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();
  useEffect(()=> {
    console.log(user);
    if (user.user) {
      setShowModal(false);
    }
    // if (!user.user) {
    //   alert("Please log in first to create a movement.");
    //   navigate("/Login");
    // }
  },[user]);

    // useEffect(()=> {
    //     async function fetchUser() {
    //       const token = localStorage.getItem("token");

    //       if (!token) return;
    //     //   console.log("Token is:", token);

    //       const response = await fetch("http://localhost:3000/api/profile", {
    //         method: "GET",
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       });

    //     //   const result = await response.json();

    //       if (response.ok) {
    //         setIsLoged(true);
    //         // setUser(result);
    //       } else {
    //         alert("Please log in first");
    //       }
    //     } 
    //     fetchUser();
    //   },[]);

    return <>
    {showModal && (
        <div className="modal d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Please Log In</h5>
              </div>

              <div className="modal-body">
                You need to log in before creating a movement.
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {setShowModal(false); navigate("/");}}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowModal(false);
                    navigate("/login");
                  }}
                >
                  Log In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!showModal && <div><MovementGenerator /></div>}
    
    {/* {!isLoged && <Navigate to="/Login" />} */}
    </>;
}

export default NewMovement;
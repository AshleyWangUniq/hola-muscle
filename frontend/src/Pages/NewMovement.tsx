import {useState, useEffect } from 'react';
import {Navigate, useNavigate } from 'react-router-dom';
import MovementGenerator from '../components/MovementGenerator';
import type { User } from '../types/user';

interface movProp {
  user: User | null;
}

function NewMovement(user : movProp) {
  const navigate = useNavigate();
  // useEffect(()=> {
  //   if (user.user) {
  //   }
  // },[user]);

    return <>
    {!user.user && (
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
                  onClick={() => {navigate("/");}}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => {
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
      {user.user && <div><MovementGenerator /></div>}
    
    {/* {!isLoged && <Navigate to="/Login" />} */}
    </>;
}

export default NewMovement;
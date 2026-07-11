import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Movement from '../components/Movement';
import MuscleList from '../components/MuscleList';



export default function Movements() {
  const location = useLocation();
  const name = (location.state as {name : string}).name;


  return (
    <>
    <div className='container-full'>
      <div className='row'>
        <div className='col-8'><Movement name={name} /></div>
        <div className="col-4">
          <MuscleList />
        </div>
      </div>
    </div>
    </>
  );
}
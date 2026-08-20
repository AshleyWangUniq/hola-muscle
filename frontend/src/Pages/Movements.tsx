import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import MovementsDisplay from '../components/MovementsDisplay';
import MuscleList from '../components/MuscleList';



export default function Movements() {
  const location = useLocation();
  const name = (location.state as {name : string}).name;


  return (
    <>
    <div className='container-full'>
      <div className='row'>
        <div className='col-8'><MovementsDisplay name={name} /></div>
        <div className="col-4">
          <MuscleList />
        </div>
      </div>
    </div>
    </>
  );
}
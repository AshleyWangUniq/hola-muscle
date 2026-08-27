import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MovementsDisplay from '../components/MovementsDisplay';
import MuscleList from '../components/MuscleList';

// navigate("/Movements", {state: {name:bodypart},});

export default function Movements() {
  const location = useLocation();
  const [name, setName] = useState<string>("All");

  useEffect(()=>{
    if (location.state) {
          setName((location.state as {name : string}).name);
      }
  },[location]);
  

  return (
    <>
    <div className='container-grid-movements'>
        <div className='scroll-component'><MovementsDisplay name={name} /></div>
        <div className="fixed-conponent">
          <MuscleList />
        </div>
    </div> 
    </>
  );
}
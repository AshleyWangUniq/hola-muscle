import  { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ExerciseDisplay from '../components/ExercisesDisplay';
import MuscleList from '../components/MuscleList';


export default function exercises() {
  const location = useLocation();
  const [name, setName] = useState<string>("All");

  useEffect(()=>{
    if (location.state) {
          setName((location.state as {name : string}).name);
      }
  },[location]);
  
  return (
    <>
    <div className='container-grid-exercises'>
        <div className='scroll-component'><ExerciseDisplay name={name} /></div>
        <div className="fixed-conponent">
          <MuscleList />
        </div>
    </div> 
    </>
  );
}
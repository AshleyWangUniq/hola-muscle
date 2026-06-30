import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Movement from '../components/Movement';



export default function BodyPartPage() {
  const location = useLocation();
  console.log(location.state);
  const name = (location.state as {name : string}).name;
  console.log(name);


  return (
    <>
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>{name}</h1>
      <p>A introduction to this body part</p>

      <Movement name={name} />
    </div>
    </>
  );
}
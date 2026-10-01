import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'
// import "bootstrap/dist/js/bootstrap.bundle.min.js"
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ExerciseProvider } from './contexts/ExerciseContext.tsx'
import { WorkoutProvider } from './contexts/WorkoutContext.tsx'
import { UserProvider } from './contexts/UserContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter><UserProvider><ExerciseProvider><WorkoutProvider><App /></WorkoutProvider></ExerciseProvider></UserProvider></BrowserRouter>
  </StrictMode>,
)

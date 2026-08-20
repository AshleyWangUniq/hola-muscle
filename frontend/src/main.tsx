import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { MovementProvider } from './contexts/MovementContext.tsx'
import { WorkoutProvider } from './contexts/WorkoutContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter><MovementProvider><WorkoutProvider><App /></WorkoutProvider></MovementProvider></BrowserRouter>
  </StrictMode>,
)

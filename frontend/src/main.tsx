import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { MovementProvider } from './contexts/MovementContext.tsx'
import { WorkoutProvider } from './contexts/WorkoutContext.tsx'
import { UserProvider } from './contexts/UserContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter><UserProvider><MovementProvider><WorkoutProvider><App /></WorkoutProvider></MovementProvider></UserProvider></BrowserRouter>
  </StrictMode>,
)

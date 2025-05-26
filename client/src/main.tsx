// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserProvider } from './hooks/UserContext.tsx'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <UserProvider>
    <App />
  </UserProvider>
  // </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { handleSignInWithGoogle } from './auth/googleAuth';

window.handleSignInWithGoogle = handleSignInWithGoogle;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)




// Attach the function to the global `window` object

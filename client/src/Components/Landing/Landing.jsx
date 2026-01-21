import React from 'react'
import { useNavigate } from 'react-router-dom';
import './Landing.css'

export const Landing = () => {
  const navigate=useNavigate();

  const goToLogin=()=>{
     navigate('/login');
  };
  return (
    
    <div className="hero-container">
    <iframe
      src="https://courageous-darling-948835.framer.app/" className="Iframecontainer" allow="fullscreen" />
    <div className="Home">
       <button className="Home" onClick={goToLogin}>Login/Signup</button>
    </div>
    </div>
  )
}

export default Landing

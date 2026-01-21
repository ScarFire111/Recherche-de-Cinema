import './App.css';
import Landing from './Components/Landing/Landing';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup'; // This will work now
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
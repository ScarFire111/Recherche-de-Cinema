import './App.css';
import Landing from './Components/Landing/Landing';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import Preferences from './Components/Preferences/Preferences';
import Home from './Components/Home/Home';
import Search from './Components/Search/Search';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaBars, FaTimes } from 'react-icons/fa';
import LandingPage from './pages/LandingPage';
import ProblemsListPage from './pages/ProblemsListPage';
import AdminPanel from './pages/AdminPanel';
import Footer from './components/Footer';
import About from './pages/About';
import SignIn from './pages/SignInPage';
import SignUp from './pages/SignUpPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PasswordSetupPage from './pages/PasswordSetupPage';
import TagsManagement from './components/TagsManagement';
import PlatformsManagement from './components/PlatformsManagement';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Invalid token', error);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="bg-gray-800 text-white p-4 fixed top-0 left-0 right-0 z-50">
          <div className="container mx-auto flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="font-bold text-xl hover:text-gray-400 flex items-center">
              <img src="logo.png" alt="App Icon" className="w-11 h-11 " />
              Problemset Collector
            </Link>

            {/* Menu for larger screens */}
            <div className="hidden md:flex space-x-4">
              <Link to="/problems" className="hover:text-gray-400">Problems</Link>
              <Link to="/about" className="hover:text-gray-400">About</Link>
              {isAuthenticated && (
                <>
                  <Link to="/admin" className="hover:text-gray-400">Admin</Link>
                  <Link to="/add-admin" className="hover:text-gray-400">Invite Admin</Link>
                  <button onClick={handleSignOut} className="hover:text-gray-400">Logout</button>
                </>
              )}
            </div>

            {/* Hamburger Icon for mobile screens */}
            <div className="md:hidden">
              <button onClick={toggleMenu}>
                {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden flex items-start flex-col space-y-4 mt-4 bg-gray-800 p-4">
              <Link to="/problems" className="hover:text-gray-400" onClick={toggleMenu}>Problems</Link>
              <Link to="/about" className="hover:text-gray-400" onClick={toggleMenu}>About</Link>
              {isAuthenticated && (
                <>
                  <Link to="/admin" className="hover:text-gray-400" onClick={toggleMenu}>Admin</Link>
                  <Link to="/add-admin" className="hover:text-gray-400" onClick={toggleMenu}>Invite Admin</Link>
                  <button onClick={() => { handleSignOut(); toggleMenu(); }} className="hover:text-gray-400">
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </nav>

        {/* Main Content */}
        <div className="mt-15 flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/problems" element={<ProblemsListPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/signin" element={<SignIn onSignIn={setIsAuthenticated} />} />
            <Route path="/admin" element={isAuthenticated ? <AdminPanel /> : <SignIn onSignIn={setIsAuthenticated} />} >
              <Route path="tags" element={<TagsManagement />} />
              <Route path="platforms" element={<PlatformsManagement />} />
            </Route>
            <Route path="/add-admin" element={isAuthenticated ? <SignUp /> : <SignIn onSignIn={setIsAuthenticated} />} />
            <Route path="/setup-password" element={<PasswordSetupPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </div>

        {/* Footer */}
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;

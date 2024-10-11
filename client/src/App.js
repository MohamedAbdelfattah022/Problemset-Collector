import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ProblemsListPage from './pages/ProblemsListPage';
import AdminPanel from './pages/AdminPanel';
import Footer from './components/Footer';
import About from './pages/About';
import SignIn from './pages/SignInPage';
import SignUp from './pages/SignUpPage';
import PasswordSetupPage from './pages/PasswordSetupPage'; // Import PasswordSetupPage

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="bg-gray-800 text-white p-4 fixed top-0 left-0 right-0 z-100">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex space-x-4">
              <Link to="/" className="font-semibold hover:text-gray-400">
                Home
              </Link>
              <Link to="/problems" className="font-semibold hover:text-gray-400">
                Problems
              </Link>
              <Link to="/about" className="font-semibold hover:text-gray-400">
                About
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/admin" className="font-semibold hover:text-gray-400">
                    Admin
                  </Link>
                  <Link to="/add-admin" className="font-semibold hover:text-gray-400">
                    Add New Admin
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="mt-12 flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/problems" element={<ProblemsListPage />} />
            <Route path="/about" element={<About />} />
            {/* SignIn Route */}
            <Route path="/signin" element={<SignIn onSignIn={setIsAuthenticated} />} />
            {/* Protected Admin Route */}
            <Route
              path="/admin"
              element={
                isAuthenticated ? <AdminPanel /> : <SignIn onSignIn={setIsAuthenticated} />
              }
            />
            <Route
              path="/add-admin"
              element={
                isAuthenticated ? <SignUp /> : <SignIn onSignIn={setIsAuthenticated} />
              }
            />
            <Route path="/setup-password" element={<PasswordSetupPage />} /> {/* Route for Password Setup */}

          </Routes>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;

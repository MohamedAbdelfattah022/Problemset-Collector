import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api';

const SignInPage = ({ onSignIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await loginUser(email, password);

            if (response.status === 200) {
                const token = response.data;
                localStorage.setItem('token', token);

                onSignIn(true);
                navigate('/admin');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(`Login failed: ${error.response.data}`);
            } else {
                setError('Failed to log in. Please try again later.');
            }
        }
    };

    // Redirect to password reset page
    const handleForgotPassword = () => {
        navigate('/forgot-password'); // Replace with your actual reset password page path
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800">Sign In</h2>
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter your password"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                        Sign In
                    </button>
                </form>

                {/* Forgot Password Button */}
                <div className="mt-4 text-center">
                    <button
                        onClick={handleForgotPassword}
                        className="text-indigo-600 hover:underline text-sm"
                    >
                        Forgot your password?
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;

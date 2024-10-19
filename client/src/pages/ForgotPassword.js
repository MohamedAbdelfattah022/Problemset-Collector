import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const request = {
                email: email,
            };
            const response = await forgotPassword(request);
            if (response.status === 200) {
                setMessage("Reset email sent successfully. Please check your inbox.");
                setError('');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(`Error: ${error.response.data}`);
                setMessage('');
            } else {
                setError('Failed to send reset email. Please try again later.');
                setMessage('');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800">Reset Password</h2>
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
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {message && <p className="text-green-500 text-sm">{message}</p>}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                        Send Reset Link
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <button
                        onClick={() => navigate('/signin')}
                        className="text-sm text-indigo-600 hover:underline"
                    >
                        Back to Sign In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

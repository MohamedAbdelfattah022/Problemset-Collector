import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { registerUser } from "../api"

const PasswordSetupPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchParams] = useSearchParams();
    const token = decodeURIComponent(searchParams.get('token'));
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            setError('Please fill in both fields.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const formData = {
                password,
                token,
            };
            const response = await registerUser(formData);

            if (response.status === 200) {
                setSuccess('Your password has been set successfully! You can now log in.');
                setError('');
                setTimeout(() => {
                    navigate('/signin');
                }, 3000);
            }
        } catch (error) {
            setError('Failed to set your password. Please try again later.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800">Set Up Your Password</h2>
                <p className="mt-2 text-center text-gray-600">
                    Please enter a password for your admin account.
                </p>
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
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
                            placeholder="Enter new password"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Confirm your password"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">{success}</p>}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                        Set Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PasswordSetupPage;

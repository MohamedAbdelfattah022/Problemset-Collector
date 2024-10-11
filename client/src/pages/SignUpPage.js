import React, { useState } from 'react';
import { inviteAdmin } from '../api'; // Assume inviteAdmin is the function that sends the invite

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInviteAdmin = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!email) {
            setError('Please enter an email.');
            return;
        }

        try {
            // Call the inviteAdmin function from api.js
            const response = await inviteAdmin(email);

            if (response.status === 200) {
                setError('');
                setSuccess(`Invitation sent to ${email}.`);
                setEmail('');
            }
        } catch (error) {
            setSuccess('');
            if (error.response && error.response.data) {
                setError(`Failed to send invitation: ${error.response.data}`);
            } else {
                setError('Failed to send invitation. Please try again later.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800">Invite Admin</h2>
                <form onSubmit={handleInviteAdmin} className="mt-6 space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Admin Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter new admin's email"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">{success}</p>}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                        Send Invitation
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;

import React, { useState, useEffect } from 'react';
import { getPlatforms, createPlatform, updatePlatform, deletePlatform } from '../api';

const PlatformsManagement = () => {
    const [platforms, setPlatforms] = useState([]);
    const [newPlatform, setNewPlatform] = useState({ platformName: '', platformUrl: '' });
    const [editingPlatformId, setEditingPlatformId] = useState(null);
    const [editingData, setEditingData] = useState({ platformName: '', platformUrl: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchPlatforms();
    }, []);

    const fetchPlatforms = async () => {
        setLoading(true);
        try {
            const response = await getPlatforms();
            setPlatforms(response.data);
        } catch (error) {
            console.error("Failed to fetch platforms:", error);
            setMessage('Failed to fetch platforms.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePlatform = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createPlatform(newPlatform);
            setNewPlatform({ platformName: '', platformUrl: '' });
            setMessage('Platform added successfully.');
            fetchPlatforms();
        } catch (error) {
            console.error("Failed to create platform:", error);
            setMessage('Failed to add platform.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePlatform = async (id) => {
        setLoading(true);
        try {
            await updatePlatform(id, editingData);
            setEditingPlatformId(null);
            setMessage('Platform updated successfully.');
            fetchPlatforms();
        } catch (error) {
            console.error("Failed to update platform:", error);
            setMessage('Failed to update platform.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePlatform = async (id) => {
        setLoading(true);
        try {
            await deletePlatform(id);
            setMessage('Platform deleted successfully.');
            fetchPlatforms();
        } catch (error) {
            console.error("Failed to delete platform:", error);
            setMessage('Failed to delete platform.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (platform) => {
        setEditingPlatformId(platform.platformId);
        setEditingData({ platformName: platform.platformName, platformUrl: platform.platformUrl });
    };

    const handleCancelEdit = () => {
        setEditingPlatformId(null);
        setEditingData({ platformName: '', platformUrl: '' });
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 p-4 border rounded-lg shadow-lg bg-gray-50">
            {message && <div className={`mb-4 p-3 rounded ${message.includes('Failed') ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>{message}</div>}
            <form onSubmit={handleCreatePlatform} className="mb-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <div className="flex-1">
                    <label className="block mb-1 font-medium" htmlFor="platformName">Platform Name</label>
                    <input
                        id="platformName"
                        type="text"
                        value={newPlatform.platformName}
                        onChange={(e) => setNewPlatform({ ...newPlatform, platformName: e.target.value })}
                        placeholder="Enter platform name"
                        className="border border-gray-300 rounded-lg px-3 py-2 w-full shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="flex-1">
                    <label className="block mb-1 font-medium" htmlFor="platformUrl">Platform URL</label>
                    <input
                        id="platformUrl"
                        type="url"
                        value={newPlatform.platformUrl}
                        onChange={(e) => setNewPlatform({ ...newPlatform, platformUrl: e.target.value })}
                        placeholder="Enter platform URL"
                        className="border border-gray-300 rounded-lg px-3 py-2 w-full shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 sm:w-auto w-full">
                    {loading ? 'Adding...' : 'Add Platform'}
                </button>
            </form>

            <h3 className="text-2xl font-semibold mb-4">Existing Platforms</h3>
            <ul className="space-y-6">
                {platforms.map((platform) => (
                    <li key={platform.platformId} className="p-4 bg-white rounded-lg shadow-md">
                        <div className="flex justify-between items-center">
                            {editingPlatformId === platform.platformId ? (
                                <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 w-full">
                                    <input
                                        type="text"
                                        value={editingData.platformName}
                                        onChange={(e) => setEditingData({ ...editingData, platformName: e.target.value })}
                                        className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-auto shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                    <input
                                        type="url"
                                        value={editingData.platformUrl}
                                        onChange={(e) => setEditingData({ ...editingData, platformUrl: e.target.value })}
                                        className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-auto shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={() => handleUpdatePlatform(platform.platformId)}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row sm:space-x-2 w-full">
                                    <span className="font-medium text-gray-900">{platform.platformName}</span>
                                    <a href={platform.platformUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        {platform.platformUrl}
                                    </a>
                                </div>
                            )}
                            <div className="flex space-x-4">
                                {editingPlatformId !== platform.platformId && (
                                    <>
                                        <button
                                            onClick={() => handleEditClick(platform)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeletePlatform(platform.platformId)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlatformsManagement;

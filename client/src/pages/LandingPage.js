import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import { getPlatforms } from "../api"; // Assuming you're using axios for the API call

const LandingPage = () => {
    const [platforms, setPlatforms] = useState([]); // State to hold the platforms data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchPlatforms = async () => {
            try {
                const response = await getPlatforms(); // Fetch platforms
                setPlatforms(response.data); // Assuming response.data is an array of platforms
            } catch (err) {
                setError("Failed to load platforms. Please try again later."); // Update error state
                console.error("Error fetching platforms:", err); // Log error to console
            } finally {
                setLoading(false); // Stop loading once the fetch is complete
            }
        };

        fetchPlatforms();
    }, []); // Empty dependency array ensures the effect runs once when the component mounts

    return (
        <div className="bg-gray-50 min-h-screen pb-5">
            <Hero />

            <div className="mt-12 px-4 sm:px-6 lg:px-8 text-center">
                <p className="mt-4 text-lg text-gray-600">
                    Find, solve, and manage your problems efficiently.
                </p>
                <a
                    href="/problems"
                    className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    View Problems
                </a>
            </div>

            <div className="mt-12 px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Popular Platforms</h2>

                {loading && <p>Loading platforms...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && platforms.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {platforms.map((platform) => (
                            <a
                                key={platform.platformId}
                                href={platform.platformUrl}
                                className="block bg-white shadow-md hover:shadow-lg p-6 rounded-lg transition-shadow"
                            >
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {platform.platformName}
                                </h3>
                                <p className="text-blue-500 mt-2">Visit Platform</p>
                            </a>
                        ))}
                    </div>
                )}

                {!loading && !error && platforms.length === 0 && (
                    <p>No platforms available at the moment.</p>
                )}
            </div>
        </div>
    );
};

export default LandingPage;

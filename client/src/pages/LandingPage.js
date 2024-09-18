import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';

var platforms = ['LeetCode', 'Codeforces', 'AtCoder', 'CodeChef', 'GeeksforGeeks'];

const LandingPage = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        navigate(`/problems?category=${encodeURIComponent(category)}`);
    };

    const handlePlatformClick = (platform) => {
        navigate(`/problems?platform=${encodeURIComponent(platform)}`);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Hero />

            {/* Categories */}
            <div className="mt-12 px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                    {['Dynamic Programming', 'Graphs', 'Strings', 'Two Pointers'].map((category) => (
                        <div key={category} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <button
                                onClick={() => handleCategoryClick(category)}
                                className="w-full text-left"
                            >
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-700">{category}</h3>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Platforms */}
            <div className="mt-12 mb-4 px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Platforms</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
                    {platforms.map((platform) => (
                        <div key={platform} className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center">
                            <img
                                src={`/${platform.toLowerCase()}.svg`}
                                alt={platform}
                                className="w-12 sm:w-16 h-12 sm:h-16 object-contain mb-4"
                            />
                            <span className="text-base sm:text-lg font-semibold text-gray-700">{platform}</span>
                            <button
                                onClick={() => handlePlatformClick(platform)}
                                className="mt-4 bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Check Problems
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;

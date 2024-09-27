import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import { getPlatforms, getTags } from '../api'; // API function imports

const LandingPage = () => {
    const navigate = useNavigate();
    const [platforms, setPlatforms] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlatformsAndTags = async () => {
            try {
                const [platformResponse, tagResponse] = await Promise.all([
                    getPlatforms(),
                    getTags() // Fetch tags for categories
                ]);

                setPlatforms(platformResponse.data); // Set platforms data
                setTags(tagResponse.data); // Set tags data
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error('Error fetching platforms or tags:', error);
                setError('Failed to fetch platforms or tags'); // Set error message
                setLoading(false); // Set loading to false on error
            }
        };

        fetchPlatformsAndTags();
    }, []);

    const handleCategoryClick = (category) => {
        navigate(`/problems?category=${encodeURIComponent(category)}`);
    };

    const handlePlatformClick = (platformName) => {
        navigate(`/problems?platform=${encodeURIComponent(platformName)}`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            <Hero />

            {/* Categories (Tags) */}
            <div className="mt-12 px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                    {tags.map((tag) => (
                        <div key={tag.tagId} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <button
                                onClick={() => handleCategoryClick(tag.tagName || 'Unknown')}
                                className="w-full text-left"
                            >
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
                                    {tag.tagName || 'Unnamed Category'} {/* Fallback to handle nullable tagName */}
                                </h3>
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
                        <div key={platform.platformId} className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center">
                            <img
                                src={`/${platform.platformName.toLowerCase()}.svg`} // Use platformName
                                alt={platform.platformName} // Use platformName for alt
                                className="w-12 sm:w-16 h-12 sm:h-16 object-contain mb-4"
                            />
                            <span className="text-base sm:text-lg font-semibold text-gray-700">{platform.platformName}</span>
                            <a
                                href={platform.platformUrl} // Platform URL from API
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Visit Platform
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;

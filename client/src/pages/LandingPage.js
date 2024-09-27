import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import { getPlatforms, getTags } from '../api';

const platformsPagination = 4;
const tagsPagination = 8;

const LandingPage = () => {
    const navigate = useNavigate();
    const [platforms, setPlatforms] = useState([]);
    const [tags, setTags] = useState([]);
    const [loadingPlatforms, setLoadingPlatforms] = useState(true);
    const [loadingTags, setLoadingTags] = useState(true);
    const [platformsError, setPlatformsError] = useState(null);
    const [tagsError, setTagsError] = useState(null);

    // Pagination state for tags and platforms
    const [visibleTagsCount, setVisibleTagsCount] = useState(tagsPagination);  // Show 8 tags initially
    const [visiblePlatformsCount, setVisiblePlatformsCount] = useState(platformsPagination);  // Show 4 platforms initially
    const [tagsExpanded, setTagsExpanded] = useState(false);  // Track if tags are expanded
    const [platformsExpanded, setPlatformsExpanded] = useState(false);  // Track if platforms are expanded

    useEffect(() => {
        const fetchPlatformsAndTags = async () => {
            try {
                const [platformResponse, tagResponse] = await Promise.all([
                    getPlatforms(),
                    getTags()
                ]);

                setPlatforms(platformResponse.data);
                setTags(tagResponse.data);
                setLoadingPlatforms(false);
                setLoadingTags(false);
            } catch (error) {
                console.error('Error fetching platforms or tags:', error);
                setLoadingPlatforms(false);
                setLoadingTags(false);
                setPlatformsError('Failed to load platforms');
                setTagsError('Failed to load categories');
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

    const toggleTags = () => {
        setTagsExpanded(!tagsExpanded);
        setVisibleTagsCount(tagsExpanded ? tagsPagination : tags.length);  // Toggle the expanded state
    };

    const togglePlatforms = () => {
        setPlatformsExpanded(!platformsExpanded);
        setVisiblePlatformsCount(platformsExpanded ? platformsPagination : platforms.length);  // Toggle the expanded state
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Hero />

            {/* Categories (Tags) Section */}
            <div className="mt-12 px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Categories</h2>

                {/* Show spinner or error in the tags section */}
                {loadingTags ? (
                    <div className="flex justify-center items-center mt-6">
                        <div className="flex items-center space-x-2 text-blue-500">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            <span>Loading categories...</span>
                        </div>
                    </div>
                ) : tagsError ? (
                    <div className="text-red-500 text-center mt-6">{tagsError}</div>
                ) : (
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                            {tags.slice(0, visibleTagsCount).map((tag) => (
                                <div key={tag.tagId} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                    <button
                                        onClick={() => handleCategoryClick(tag.tagName || 'Unknown')}
                                        className="w-full text-left"
                                    >
                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
                                            {tag.tagName || 'Unnamed Category'}
                                        </h3>
                                    </button>
                                </div>
                            ))}
                        </div>
                        {tags.length > tagsPagination && (
                            <button
                                onClick={toggleTags}
                                className="mt-4 text-blue-500 hover:underline"
                            >
                                {tagsExpanded ? 'Show Less' : 'Show More'}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Platforms Section */}
            <div className="mt-12 mb-4 px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Platforms</h2>

                {/* Show spinner or error in the platforms section */}
                {loadingPlatforms ? (
                    <div className="flex justify-center items-center mt-6">
                        <div className="flex items-center space-x-2 text-blue-500">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            <span>Loading platforms...</span>
                        </div>
                    </div>
                ) : platformsError ? (
                    <div className="text-red-500 text-center mt-6">{platformsError}</div>
                ) : (
                    <div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
                            {platforms.slice(0, visiblePlatformsCount).map((platform) => (
                                <div key={platform.platformId} className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center">
                                    <img
                                        src={`/${platform.platformName.toLowerCase()}.svg`}
                                        alt={platform.platformName}
                                        className="w-12 sm:w-16 h-12 sm:h-16 object-contain mb-4"
                                    />
                                    <span className="text-base sm:text-lg font-semibold text-gray-700">{platform.platformName}</span>
                                    <a
                                        href={platform.platformUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Visit Platform
                                    </a>
                                </div>
                            ))}
                        </div>
                        {platforms.length > platformsPagination && (
                            <button
                                onClick={togglePlatforms}
                                className="mt-4 text-blue-500 hover:underline"
                            >
                                {platformsExpanded ? 'Show Less' : 'Show More'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LandingPage;

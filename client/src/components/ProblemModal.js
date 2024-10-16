import React, { useState, useEffect } from 'react';
import { getTags, getPlatforms, getDifficulties } from '../api';
import { createProblem, updateProblem } from '../api';

const ProblemModal = ({ problem, onClose }) => {
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        platform: '',
        difficulty: '',
        url: '',
        tags: [],
    });

    const [tags, setTags] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [difficulties, setDifficulties] = useState([]);
    const [searchTag, setSearchTag] = useState('');
    const [searchPlatform, setSearchPlatform] = useState('');
    const [searchDifficulty, setSearchDifficulty] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedPlatform, setSelectedPlatform] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tagResponse = await getTags();
                const platformResponse = await getPlatforms();
                const difficultyResponse = await getDifficulties();

                setTags(tagResponse.data);
                setPlatforms(platformResponse.data);
                setDifficulties(difficultyResponse.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (problem) {
            setFormData({
                id: problem.problemId || null,
                name: problem.problemName || '',
                platform: problem.platformName || '',
                difficulty: problem.problemDifficulty || '',
                url: problem.problemUrl || '',
                tags: problem.tags || [],
            });

            setSelectedTags(problem.tags || []);
            setSelectedPlatform(problem.platformName || '');
            setSearchDifficulty(problem.problemDifficulty || '');
        }
    }, [problem]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTagSelect = (tag) => {
        setSelectedTags((prevTags) => {
            const newTags = prevTags.includes(tag)
                ? prevTags.filter((t) => t !== tag)
                : [...prevTags, tag];
            setSearchTag('');
            return newTags;
        });
    };

    const handlePlatformSelect = (platform) => {
        setSelectedPlatform(platform);
        setFormData({ ...formData, platform });
        setSearchPlatform('');
    };

    const handleDifficultySelect = (difficulty) => {
        setFormData({ ...formData, difficulty });
        setSearchDifficulty('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const tagsToSend = [...new Set([...selectedTags, searchTag].filter(tag => tag))];
        const difficultyToSend = formData.difficulty || searchDifficulty;

        const problemData = {
            problemName: formData.name,
            platformName: selectedPlatform,
            problemUrl: formData.url,
            problemDifficulty: difficultyToSend,
            tags: tagsToSend,
        };

        try {
            if (problem) {
                await updateProblem(problem.problemId, problemData);
            } else {
                await createProblem(problemData);
            }
            onClose();
        } catch (error) {
            console.error('Failed to submit the problem:', error);
        }
    };


    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const filteredTags = tags.filter(tag => tag?.tagName?.toLowerCase().includes(searchTag.toLowerCase()));
    const filteredPlatforms = platforms.filter(platform => platform?.platformName?.toLowerCase().includes(searchPlatform.toLowerCase()));
    const filteredDifficulties = difficulties.filter(difficulty => difficulty.toLowerCase().includes(searchDifficulty.toLowerCase()));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={handleOverlayClick}>
            <div className="bg-white rounded-lg shadow-lg p-4 w-11/12 md:w-1/2 lg:w-1/3 relative overflow-hidden">
                <span className="absolute top-2 right-2 text-2xl cursor-pointer" onClick={onClose}>&times;</span>
                <h2 className="text-lg font-bold mb-4">{problem ? 'Edit Problem' : 'Add New Problem'}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Problem Name"
                        className="border rounded w-full p-2 mb-2"
                        required
                    />

                    {/* URL Input */}
                    <input
                        type="text"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                        placeholder="Problem URL"
                        className="border rounded w-full p-2 mb-2"
                        required
                    />

                    {/* Platform Selection */}
                    <div className="mb-2">
                        <label className="block mb-1">Platform:</label>
                        <input
                            type="text"
                            value={searchPlatform || selectedPlatform}
                            onChange={(e) => setSearchPlatform(e.target.value)}
                            placeholder="Search Platform"
                            className="border rounded w-full p-2 mb-2"
                        />
                        {selectedPlatform && !searchPlatform && (
                            <div className="border rounded bg-blue-100 p-2 mb-2 cursor-default">
                                {selectedPlatform}
                            </div>
                        )}
                        {searchPlatform && (
                            <ul className="border rounded bg-white max-h-40 overflow-y-auto">
                                {filteredPlatforms.map(platform => (
                                    <li key={platform.platformId}
                                        className={`p-2 hover:bg-gray-100 cursor-pointer ${selectedPlatform === platform.platformName ? 'bg-blue-100 font-bold' : ''}`}
                                        onClick={() => handlePlatformSelect(platform.platformName)}>
                                        {platform.platformName}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Searchable Difficulty Selection */}
                    <div className="mb-2">
                        <label className="block mb-1">Difficulty:</label>
                        <input
                            type="text"
                            value={searchDifficulty || formData.difficulty}
                            onChange={(e) => setSearchDifficulty(e.target.value)}
                            placeholder="Search Difficulties"
                            className="border rounded w-full p-2 mb-2"
                        />
                        {formData.difficulty && !searchDifficulty && (
                            <div className="border rounded bg-blue-100 p-2 mb-2 cursor-default">
                                {formData.difficulty}
                            </div>
                        )}
                        {searchDifficulty && (
                            <ul className="border rounded bg-white max-h-40 overflow-y-auto">
                                {filteredDifficulties.map(difficulty => (
                                    <li
                                        key={difficulty}
                                        onClick={() => handleDifficultySelect(difficulty)}
                                        className={`p-2 hover:bg-gray-100 cursor-pointer ${formData.difficulty === difficulty ? 'bg-blue-100 font-bold' : ''}`}>
                                        {difficulty}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Searchable Tags Input */}
                    <div className="mb-2">
                        <label className="block mb-1">Tags:</label>
                        <input
                            type="text"
                            value={searchTag}
                            onChange={(e) => setSearchTag(e.target.value)}
                            placeholder="Search Tags"
                            className="border rounded w-full p-2 mb-2"
                        />
                        <div className="flex flex-wrap">
                            {selectedTags.map(tag => (
                                <span key={tag} className="bg-blue-100 p-2 rounded-lg mr-2 mb-2 flex items-center">
                                    {tag}
                                    <span className="ml-2 cursor-pointer" onClick={() => handleTagSelect(tag)}>&times;</span>
                                </span>
                            ))}
                        </div>
                        {searchTag && (
                            <ul className="border rounded bg-white max-h-40 overflow-y-auto">
                                {filteredTags.map(tag => (
                                    <li
                                        key={tag.tagId}
                                        onClick={() => handleTagSelect(tag.tagName)}
                                        className={`p-2 hover:bg-gray-100 cursor-pointer ${selectedTags.includes(tag.tagName) ? 'bg-blue-100 font-bold' : ''}`}>
                                        {tag.tagName}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="bg-blue-500 text-white rounded w-full py-2 hover:bg-blue-600">
                        {problem ? 'Update' : 'Add'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProblemModal;

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProblemCard from '../components/ProblemCard';
import SearchBar from '../components/SearchBar';
import { getProblems, getProblemTags, getPlatformById, getTagById, getTags } from "../api";

const ProblemsListPage = ({ openEditModal, onDeleteProblem, isAdmin }) => {
    const [problems, setProblems] = useState([]);
    const [filteredProblems, setFilteredProblems] = useState([]);
    const [problemTags, setProblemTags] = useState([]);
    const [tagsMap, setTagsMap] = useState({});
    const [platformsMap, setPlatformsMap] = useState({});
    const [selectedTag, setSelectedTag] = useState(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tags, setTags] = useState([]);

    const [visibleTagsCount, setVisibleTagsCount] = useState(5);
    const [expanded, setExpanded] = useState(false);

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const category = query.get('category');
    const platform = query.get('platform');

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const problemsResponse = await getProblems();
                const problemTagsResponse = await getProblemTags();
                const tagResponse = await getTags();

                const platformsResponse = await Promise.all(
                    problemsResponse.data.map(problem =>
                        getPlatformById(problem.platformId).then(res => ({
                            platformId: problem.platformId,
                            platformName: res.data.platformName
                        }))
                    )
                );

                const tagsResponse = await Promise.all(
                    problemTagsResponse.data.map(async (tag) => {
                        const tagResponse = await getTagById(tag.tagId);
                        return { tagId: tag.tagId, tagName: tagResponse.data.tagName, problemId: tag.problemId };
                    })
                );

                setProblems(problemsResponse.data);
                setProblemTags(problemTagsResponse.data);
                setTags(tagResponse.data);

                setPlatformsMap(platformsResponse.reduce((acc, platform) => {
                    acc[platform.platformId] = platform.platformName;
                    return acc;
                }, {}));
                setTagsMap(tagsResponse.reduce((acc, tag) => {
                    acc[tag.problemId] = acc[tag.problemId] || [];
                    acc[tag.problemId].push(tag.tagName);
                    return acc;
                }, {}));
                setFilteredProblems(problemsResponse.data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch problems:', err);
                setError('Failed to fetch problems');
                setLoading(false);
            }
        };

        fetchProblems();
    }, []);

    useEffect(() => {
        filterProblems(selectedDifficulty, selectedTag, category, platform, searchTerm);
    }, [selectedDifficulty, selectedTag, category, platform, searchTerm, problems]);

    const handleTagClick = (tag) => {
        setSelectedTag(tag);
        filterProblems(selectedDifficulty, tag, category, platform, searchTerm);
    };

    const handleDifficultyClick = (difficulty) => {
        setSelectedDifficulty(difficulty);
        filterProblems(difficulty, selectedTag, category, platform, searchTerm);
    };

    const filterProblems = (difficulty, tag, category, platform, searchTerm) => {
        let filtered = problems;

        if (category) {
            filtered = filtered.filter(problem =>
                tagsMap[problem.problemId]?.some(t => t === category)
            );
        }
        if (tag) {
            filtered = filtered.filter(problem =>
                tagsMap[problem.problemId]?.some(t => t === tag)
            );
        }
        if (difficulty) {
            filtered = filtered.filter(problem => problem.problemDifficulty === difficulty);
        }
        if (platform) {
            filtered = filtered.filter(problem => problem.platformId === platform);
        }
        if (searchTerm) {
            filtered = filtered.filter(problem =>
                problem.problemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                problem.problemUrl?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProblems(filtered);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {
        filterProblems(selectedDifficulty, selectedTag, category, platform, searchTerm);
    };

    const clearFilters = () => {
        setSelectedTag(null);
        setSelectedDifficulty(null);
        setSearchTerm('');
        setFilteredProblems(problems);
    };

    const toggleTags = () => {
        if (expanded) {
            setVisibleTagsCount(5); // Collapse and show only 5 tags
        } else {
            setVisibleTagsCount(tags.length); // Expand to show all tags
        }
        setExpanded(!expanded); // Toggle the expanded state
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="flex items-center space-x-2 text-blue-500">
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span>Loading problems...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="bg-red-100 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row">
            <main className="flex-1 p-4">
                <div className="mb-4">
                    {(selectedTag || selectedDifficulty || category || searchTerm) && (
                        <button
                            onClick={clearFilters}
                            className="text-blue-500 hover:underline"
                        >
                            Clear filters ✖️
                        </button>
                    )}
                </div>
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    onSearchClick={handleSearchClick}
                />
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">Difficulties</h2>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {['Easy', 'Medium', 'Hard'].map((difficulty) => (
                            <button
                                key={difficulty}
                                onClick={() => handleDifficultyClick(difficulty)}
                                className={`px-4 py-2 rounded-lg text-white ${selectedDifficulty === difficulty ? 'bg-blue-500' : 'bg-gray-300'}`}
                            >
                                {difficulty}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">Tags</h2>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {tags.slice(0, visibleTagsCount).map((tag) => (
                            <button
                                key={tag.tagName}
                                onClick={() => handleTagClick(tag.tagName)}
                                className={`px-4 py-2 rounded-lg text-white ${selectedTag === tag.tagName ? 'bg-blue-500' : 'bg-gray-300'} mb-2`}
                            >
                                {tag.tagName}
                            </button>
                        ))}
                    </div>
                    {tags.length > 5 && (
                        <button
                            onClick={toggleTags}
                            className="mt-2 text-blue-500 hover:underline"
                        >
                            {expanded ? 'Show Less' : 'Show More'}
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProblems.map((problem) => (
                        <ProblemCard
                            key={problem.problemId}
                            problem={{
                                ...problem,
                                problemTags: tagsMap[problem.problemId] || [],
                                platformName: platformsMap[problem.platformId]
                            }}
                            onTagClick={handleTagClick}
                            onDifficultyClick={handleDifficultyClick}
                            onDelete={onDeleteProblem}
                            onEdit={openEditModal}
                            isAdmin={isAdmin}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ProblemsListPage;

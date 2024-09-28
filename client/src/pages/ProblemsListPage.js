import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ProblemCard from '../components/ProblemCard';
import SearchBar from '../components/SearchBar';
import { getProblems, getProblemTags, getPlatformById, getTagById, getTags, getDifficulties } from "../api";

const ProblemsListPage = ({ openEditModal, onDeleteProblem, isAdmin }) => {
    const [problems, setProblems] = useState([]);
    const [filteredProblems, setFilteredProblems] = useState([]);
    const [problemTags, setProblemTags] = useState([]);
    const [tagsMap, setTagsMap] = useState({});
    const [platformsMap, setPlatformsMap] = useState({});
    const [selectedTag, setSelectedTag] = useState(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [difficulties, setDifficulties] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tags, setTags] = useState([]);
    const [visibleTagsCount, setVisibleTagsCount] = useState(5); // Control visible tags
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const observer = useRef();

    const pageSize = 10;

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const category = query.get('category');
    const platform = query.get('platform');

    const fetchProblems = async (page, append = false) => {
        setLoading(true);
        try {
            const problemsResponse = await getProblems(page, pageSize);
            const platformsResponse = await Promise.all(
                problemsResponse.data.map(problem =>
                    getPlatformById(problem.platformId).then(res => ({
                        platformId: problem.platformId,
                        platformName: res.data.platformName
                    }))
                )
            );

            const problemTagsResponse = await getProblemTags();
            const tagsResponse = await getTags();
            const difficultiesResponse = await getDifficulties(); // Fetch difficulties from API
            // Ensure "Easy", "Medium", "Hard" are always at the top
            const orderedDifficulties = ['Easy', 'Medium', 'Hard', ...difficultiesResponse.data.filter(d => !['Easy', 'Medium', 'Hard'].includes(d))];

            setDifficulties(orderedDifficulties); // Set ordered difficulties

            const tagsMap = await Promise.all(
                problemTagsResponse.data.map(async (tag) => {
                    const tagResponse = await getTagById(tag.tagId);
                    return { tagId: tag.tagId, tagName: tagResponse.data.tagName, problemId: tag.problemId };
                })
            );

            setPlatformsMap(prev => ({
                ...prev,
                ...platformsResponse.reduce((acc, platform) => {
                    acc[platform.platformId] = platform.platformName;
                    return acc;
                }, {})
            }));

            setTagsMap(prev => ({
                ...prev,
                ...tagsMap.reduce((acc, tag) => {
                    acc[tag.problemId] = acc[tag.problemId] || [];
                    acc[tag.problemId].push(tag.tagName);
                    return acc;
                }, {})
            }));

            // Update problems based on whether we are appending or replacing
            if (append) {
                setProblems(prev => [...prev, ...problemsResponse.data]);
            } else {
                setProblems(problemsResponse.data);
            }

            setFilteredProblems(prev => append ? [...prev, ...problemsResponse.data] : problemsResponse.data);
            setHasMore(problemsResponse.data.length === pageSize); // Check if we have enough problems for the current page size
        } catch (err) {
            console.error('Failed to fetch problems:', err);
            setError('Failed to fetch problems');
        } finally {
            setLoading(false);
        }
    };

    // Fetch all problems on initial load
    useEffect(() => {
        fetchProblems(page); // Fetch the first page of problems
    }, []);

    // Load more problems when the page changes
    useEffect(() => {
        if (page > 1) {
            fetchProblems(page, true); // Append problems for subsequent pages
        }
    }, [page]);

    // Infinite Scroll: Trigger when scrolling to the bottom
    const lastProblemElementRef = (node) => {
        if (loading || !hasMore) return; // Stop observing if loading or no more data

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1); // Load next page when reaching the bottom
            }
        });

        if (node) observer.current.observe(node);
    };

    // Filter problems based on selected criteria
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
        setHasMore(filtered.length === pageSize); // Check if there are more problems to load
    };

    // Fetch tags and problems on initial load
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const problemTagsResponse = await getProblemTags();
                const tagsResponse = await getTags();

                const tagsMap = await Promise.all(
                    problemTagsResponse.data.map(async (tag) => {
                        const tagResponse = await getTagById(tag.tagId);
                        return { tagId: tag.tagId, tagName: tagResponse.data.tagName, problemId: tag.problemId };
                    })
                );

                setTags(tagsResponse.data);
                setTagsMap(tagsMap.reduce((acc, tag) => {
                    acc[tag.problemId] = acc[tag.problemId] || [];
                    acc[tag.problemId].push(tag.tagName);
                    return acc;
                }, {}));
            } catch (err) {
                console.error('Failed to fetch tags:', err);
                setError('Failed to fetch tags');
            }
        };

        fetchInitialData();
    }, []);

    // Update filtered problems on filters change
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
        setPage(1); // Reset page to 1 when clearing filters
        fetchProblems(1); // Re-fetch the first page
    };

    const handleSeeMoreTags = () => {
        setVisibleTagsCount(tags.length); // Show all tags
    };

    const handleSeeLessTags = () => {
        setVisibleTagsCount(5); // Reset to initial count
    };

    if (loading && page === 1) {
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
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <main className="p-4">
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
                        {difficulties.map((difficulty) => (
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
                    {visibleTagsCount < tags.length && (
                        <button onClick={handleSeeMoreTags} className="text-blue-500 hover:underline">
                            See More
                        </button>
                    )}
                    {visibleTagsCount > 5 && (
                        <button onClick={handleSeeLessTags} className="text-blue-500 hover:underline">
                            See Less
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProblems.map((problem, index) => {
                        const isLastProblem = filteredProblems.length === index + 1; // Check if this is the last problem
                        return (
                            <div ref={isLastProblem ? lastProblemElementRef : null} key={problem.problemId}>
                                <ProblemCard
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
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default ProblemsListPage;

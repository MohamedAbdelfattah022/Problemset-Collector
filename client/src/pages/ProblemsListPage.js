import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ProblemCard from '../components/ProblemCard';
import SearchBar from '../components/SearchBar';
import { getProblems, getDifficulties } from "../api";
import { HiOutlineX } from 'react-icons/hi';

const ProblemsListPage = ({ openEditModal, onDeleteProblem, isAdmin }) => {
    const pageSize = 10;
    const tagPagination = 6;
    const difficultiesPagination = 5; // Number of difficulties to show initially

    const [problems, setProblems] = useState([]);
    const [filteredProblems, setFilteredProblems] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedDifficulties, setSelectedDifficulties] = useState([]);
    const [difficulties, setDifficulties] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [visibleTagsCount, setVisibleTagsCount] = useState(tagPagination);
    const [visibleDifficultiesCount, setVisibleDifficultiesCount] = useState(difficultiesPagination); // For difficulties
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const observer = useRef();

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const category = query.get('category');
    const platform = query.get('platform');

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [problemsResponse, difficultiesResponse] = await Promise.all([
                getProblems(1, pageSize),
                getDifficulties(),
            ]);

            const orderedDifficulties = ['Easy', 'Medium', 'Hard', ...difficultiesResponse.data.filter(d => !['Easy', 'Medium', 'Hard'].includes(d))];

            setProblems(problemsResponse.data);
            setFilteredProblems(problemsResponse.data);
            setDifficulties(orderedDifficulties);

            if (problemsResponse.data.length < pageSize) setHasMore(false);
            else setHasMore(problemsResponse.data.length >= pageSize);
        } catch (err) {
            console.error('Failed to fetch initial data:', err);
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const fetchMoreProblems = async (page) => {
        setLoading(true);
        try {
            const problemsResponse = await getProblems(page, pageSize);
            setProblems(prev => [...prev, ...problemsResponse.data]);
            setFilteredProblems(prev => [...prev, ...problemsResponse.data]);

            if (problemsResponse.data.length < pageSize) setHasMore(false);
            else setHasMore(problemsResponse.data.length >= pageSize);
        } catch (err) {
            console.error('Failed to fetch more problems:', err);
            setError('Failed to fetch more problems');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (page > 1) {
            fetchMoreProblems(page);
        }
    }, [page]);

    const lastProblemElementRef = (node) => {
        if (loading || !hasMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    };

    const filterProblems = (selectedDifficulties, selectedTags, category, platform, searchTerm) => {
        let filtered = problems;

        if (category) {
            filtered = filtered.filter(problem =>
                problem.tags?.some(t => t === category)
            );
        }

        if (selectedTags.length > 0) {
            filtered = filtered.filter(problem =>
                selectedTags.every(selectedTag => problem.tags?.includes(selectedTag))
            );
        }

        if (selectedDifficulties.length > 0) {
            filtered = filtered.filter(problem => selectedDifficulties.includes(problem.problemDifficulty));
        }

        if (platform) {
            filtered = filtered.filter(problem => problem.platformName === platform);
        }

        if (searchTerm) {
            filtered = filtered.filter(problem =>
                problem.problemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                problem.problemUrl?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProblems(filtered);
    };

    useEffect(() => {
        filterProblems(selectedDifficulties, selectedTags, category, platform, searchTerm);
    }, [selectedDifficulties, selectedTags, category, platform, searchTerm, problems]);

    const handleTagClick = (tag) => {
        setSelectedTags((prevSelectedTags) => {
            if (prevSelectedTags.includes(tag)) {
                return prevSelectedTags.filter((t) => t !== tag);
            } else {
                return [...prevSelectedTags, tag];
            }
        });
    };

    const handleDifficultyClick = (difficulty) => {
        setSelectedDifficulties((prevSelectedDifficulties) => {
            if (prevSelectedDifficulties.includes(difficulty)) {
                return prevSelectedDifficulties.filter((d) => d !== difficulty);
            } else {
                return [...prevSelectedDifficulties, difficulty];
            }
        });
    };

    const handleSearchChange = (event) => setSearchTerm(event.target.value);
    const handleSearchClick = () => filterProblems(selectedDifficulties, selectedTags, category, platform, searchTerm);

    const clearFilters = () => {
        setSelectedTags([]);
        setSelectedDifficulties([]);
        setSearchTerm('');
        setPage(1);
        fetchInitialData();
    };

    const extractUniqueTags = () => {
        const allTags = problems.flatMap(problem => problem.tags);
        const uniqueTags = [...new Set(allTags)];

        const selectedTagsFiltered = uniqueTags.filter(tag => selectedTags.includes(tag));
        const unselectedTags = uniqueTags.filter(tag => !selectedTags.includes(tag));

        return [...selectedTagsFiltered, ...unselectedTags];
    };

    const extractUniqueDifficulties = () => {
        const allDifficulties = difficulties;
        const selectedDifficultiesFiltered = allDifficulties.filter(d => selectedDifficulties.includes(d));
        const unselectedDifficulties = allDifficulties.filter(d => !selectedDifficulties.includes(d));

        return [...selectedDifficultiesFiltered, ...unselectedDifficulties];
    };

    return (
        <div>
            <main className="p-4">
                <div className="mb-4">
                    {(selectedTags.length > 0 || selectedDifficulties.length > 0 || category || searchTerm) && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                            aria-label="Clear all filters"
                            title="Clear all filters"
                        >
                            <HiOutlineX className="mr-2" /> Clear Filters
                        </button>
                    )}
                </div>
                <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} onSearchClick={handleSearchClick} />
                
                {/* Difficulties Section */}
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">Difficulties</h2>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {extractUniqueDifficulties().slice(0, visibleDifficultiesCount).map((difficulty) => (
                            <button
                                key={difficulty}
                                onClick={() => handleDifficultyClick(difficulty)}
                                className={`px-4 py-2 rounded-lg text-white ${selectedDifficulties.includes(difficulty) ? 'bg-blue-500' : 'bg-gray-300'}`}
                            >
                                {difficulty}
                            </button>
                        ))}
                    </div>
                    {visibleDifficultiesCount < extractUniqueDifficulties().length && (
                        <button
                            onClick={() => setVisibleDifficultiesCount(extractUniqueDifficulties().length)}
                            className="text-blue-500 hover:underline mt-2"
                        >
                            Show More
                        </button>
                    )}
                    {visibleDifficultiesCount > difficultiesPagination && (
                        <button
                            onClick={() => setVisibleDifficultiesCount(difficultiesPagination)}
                            className="text-blue-500 hover:underline mt-2"
                        >
                            Show Less
                        </button>
                    )}
                </div>

                {/* Tags Section */}
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">Tags</h2>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {extractUniqueTags().slice(0, visibleTagsCount).map((tag) => (
                            <button
                                key={tag}
                                onClick={() => handleTagClick(tag)}
                                className={`px-4 py-2 rounded-lg text-white ${selectedTags.includes(tag) ? 'bg-blue-500' : 'bg-gray-300'} mb-2`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                    {visibleTagsCount < extractUniqueTags().length && (
                        <button onClick={() => setVisibleTagsCount(extractUniqueTags().length)} className="text-blue-500 hover:underline">Show More</button>
                    )}
                    {visibleTagsCount > tagPagination && (
                        <button onClick={() => setVisibleTagsCount(tagPagination)} className="text-blue-500 hover:underline">Show Less</button>
                    )}
                </div>

                {/* Problem Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProblems.map((problem, index) => {
                        const isLastProblem = filteredProblems.length === index + 1;
                        return (
                            <div ref={isLastProblem ? lastProblemElementRef : null} key={problem.problemId}>
                                <ProblemCard
                                    problem={problem}
                                    onEdit={openEditModal}
                                    onDeleteProblem={onDeleteProblem}
                                    isAdmin={isAdmin}
                                    onTagClick={handleTagClick}
                                    onDifficultyClick={handleDifficultyClick}
                                    onDelete={() => onDeleteProblem(problem.problemId)}
                                />
                            </div>
                        );
                    })}
                </div>

                {loading && <p className="text-center mt-4">Loading...</p>}
                {error && <p className="text-center mt-4 text-red-500">{error}</p>}
            </main>
        </div>
    );
};

export default ProblemsListPage;

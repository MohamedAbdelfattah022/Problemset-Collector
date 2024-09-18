import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProblemCard from '../components/ProblemCard';
import SearchBar from '../components/SearchBar';

const problems = [
    { id: 1, name: "Two Sum", platform: "LeetCode", difficulty: "Easy", tags: ["Arrays", "Hashing"], url: "https://leetcode.com/problems/two-sum" },
    { id: 2, name: "Dijkstra's Shortest Path", platform: "Codeforces", difficulty: "Medium", tags: ["Graphs", "Algorithms"], url: "https://codeforces.com/problemset/problem/20/C" },
    { id: 3, name: "Binary Search", platform: "HackerRank", difficulty: "Easy", tags: ["Binary Search", "Algorithms"], url: "https://www.hackerrank.com/challenges/binary-search" },
    { id: 4, name: "Longest Common Subsequence", platform: "GeeksforGeeks", difficulty: "Hard", tags: ["Dynamic Programming", "Strings"], url: "https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/" },
    { id: 5, name: "Traveling Salesman Problem", platform: "CodeChef", difficulty: "Hard", tags: ["Graphs", "Dynamic Programming"], url: "https://www.codechef.com/problems/TSP" },
    { id: 6, name: "Palindrome Partitioning", platform: "LeetCode", difficulty: "Medium", tags: ["Dynamic Programming", "Backtracking"], url: "https://leetcode.com/problems/palindrome-partitioning" },
    { id: 7, name: "Merge Intervals", platform: "LeetCode", difficulty: "Medium", tags: ["Arrays", "Sorting"], url: "https://leetcode.com/problems/merge-intervals" },
    { id: 8, name: "Knapsack Problem", platform: "HackerRank", difficulty: "Medium", tags: ["Dynamic Programming", "Greedy"], url: "https://www.hackerrank.com/challenges/knapsack" },
    { id: 9, name: "Maximum Subarray", platform: "LeetCode", difficulty: "Easy", tags: ["Arrays", "Dynamic Programming"], url: "https://leetcode.com/problems/maximum-subarray" },
    { id: 10, name: "Floyd-Warshall Algorithm", platform: "GeeksforGeeks", difficulty: "Medium", tags: ["Graphs", "Algorithms"], url: "https://www.geeksforgeeks.org/floyd-warshall-algorithm-dp-16/" },
    { id: 11, name: "N-Queens", platform: "LeetCode", difficulty: "Hard", tags: ["Backtracking"], url: "https://leetcode.com/problems/n-queens" },
    { id: 12, name: "Kruskal's Minimum Spanning Tree", platform: "HackerRank", difficulty: "Medium", tags: ["Graphs", "Greedy"], url: "https://www.hackerrank.com/challenges/kruskals-mst" },
    { id: 13, name: "Sudoku Solver", platform: "LeetCode", difficulty: "Hard", tags: ["Backtracking"], url: "https://leetcode.com/problems/sudoku-solver" },
    { id: 14, name: "Rod Cutting", platform: "GeeksforGeeks", difficulty: "Medium", tags: ["Dynamic Programming"], url: "https://www.geeksforgeeks.org/cutting-a-rod-dp-13/" },
    { id: 15, name: "Breadth-First Search", platform: "HackerRank", difficulty: "Easy", tags: ["Graphs", "Algorithms"], url: "https://www.hackerrank.com/challenges/bfs-shortest-reach-in-a-graph" },
    { id: 16, name: "Longest Increasing Subsequence", platform: "LeetCode", difficulty: "Medium", tags: ["Dynamic Programming"], url: "https://leetcode.com/problems/longest-increasing-subsequence" }
];

const ProblemsListPage = () => {
    const [filteredProblems, setFilteredProblems] = useState(problems);
    const [selectedTag, setSelectedTag] = useState(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const category = query.get('category');
    const platform = query.get('platform');

    useEffect(() => {
        filterProblems(selectedDifficulty, selectedTag, category, platform, searchTerm);
    }, [selectedDifficulty, selectedTag, category, platform, searchTerm]);

    const handleTagClick = (tag) => {
        setSelectedTag(tag);
        filterProblems(selectedDifficulty, tag, category, searchTerm);
    };

    const handleDifficultyClick = (difficulty) => {
        setSelectedDifficulty(difficulty);
        filterProblems(difficulty, selectedTag, category, searchTerm);
    };

    const filterProblems = (difficulty, tag, category, platform, searchTerm) => {
        let filtered = problems;

        if (category) {
            filtered = filtered.filter(problem => problem.tags.includes(category));
        }
        if (tag) {
            filtered = filtered.filter(problem => problem.tags.includes(tag));
        }
        if (difficulty) {
            filtered = filtered.filter(problem => problem.difficulty === difficulty);
        }
        if (platform) {
            filtered = filtered.filter(problem => problem.platform === platform);
        }
        if (searchTerm) {
            filtered = filtered.filter(problem =>
                problem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                problem.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
                problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredProblems(filtered);
    };


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {
        filterProblems(selectedDifficulty, selectedTag, category, searchTerm);
    };

    const clearFilters = () => {
        setSelectedTag(null);
        setSelectedDifficulty(null);
        setSearchTerm('');
        setFilteredProblems(problems);
    };

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
                        {['Arrays', 'Hashing', 'Graphs', 'Algorithms', 'Binary Search', 'Strings', 'Dynamic Programming', 'Backtracking', 'Sorting', 'Greedy'].map((tag) => (
                            <button
                                key={tag}
                                onClick={() => handleTagClick(tag)}
                                className={`px-4 py-2 rounded-lg text-white ${selectedTag === tag ? 'bg-blue-500' : 'bg-gray-300'} mb-2`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProblems.map((problem) => (
                        <ProblemCard
                            key={problem.id}
                            problem={problem}
                            onTagClick={handleTagClick}
                            onDifficultyClick={handleDifficultyClick}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ProblemsListPage;

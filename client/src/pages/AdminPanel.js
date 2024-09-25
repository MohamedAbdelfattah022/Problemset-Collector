import React, { useState } from 'react';
import ProblemsListPage from './ProblemsListPage';
import ProblemModal from '../components/ProblemModal';
import LandingPage from './LandingPage';

const isAdmin = true;  // Assuming isAdmin is determined based on user role

const initialProblems = [
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

const AdminPanel = () => {
    const [showProblemModal, setShowProblemModal] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [problems, setProblems] = useState(initialProblems);

    const openProblemModal = (problem = null) => {
        setSelectedProblem(problem);
        setShowProblemModal(true);
    };

    const closeProblemModal = () => {
        setSelectedProblem(null);
        setShowProblemModal(false);
    };

    const addProblem = (newProblem) => {
        setProblems((prevProblems) => [...prevProblems, newProblem]);
    };

    const editProblem = (editedProblem) => {
        setProblems((prevProblems) =>
            prevProblems.map(problem =>
                problem.id === editedProblem.id ? editedProblem : problem
            )
        );
    };

    const deleteProblem = (id) => {
        setProblems((prevProblems) => prevProblems.filter(problem => problem.id !== id));
    };

    return (
        <div className="flex flex-col">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Admin Panel - Manage Problems</h1>
                {isAdmin && (
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => openProblemModal()}
                    >
                        Add New Problem
                    </button>
                )}
                <ProblemsListPage
                    problems={problems}
                    openEditModal={openProblemModal}
                    onDeleteProblem={deleteProblem}
                    isAdmin={isAdmin}
                />
            </div>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Manage Categories & Platforms</h1>
                <LandingPage />
            </div>

            {showProblemModal && (
                <ProblemModal
                    problem={selectedProblem}
                    onClose={closeProblemModal}
                    onAddProblem={addProblem}
                    onEditProblem={editProblem}
                />
            )}
        </div>
    );
};

export default AdminPanel;

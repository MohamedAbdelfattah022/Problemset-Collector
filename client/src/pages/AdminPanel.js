import React, { useState, useEffect } from 'react';
import ProblemsListPage from './ProblemsListPage';
import ProblemModal from '../components/ProblemModal';
import TagsManagement from '../components/TagsManagement';
import PlatformsManagement from '../components/PlatformsManagement';
import { getProblems, createProblem, updateProblem, deleteProblem, getTags, getPlatforms } from '../api';

const AdminPanel = () => {
    const [showProblemModal, setShowProblemModal] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [problems, setProblems] = useState([]);
    const [tags, setTags] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('problems');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [problemsResponse, tagsResponse, platformsResponse] = await Promise.all([
                getProblems(),
                getTags(),
                getPlatforms()
            ]);
            setProblems(problemsResponse.data);
            setTags(tagsResponse.data);
            setPlatforms(platformsResponse.data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const openProblemModal = (problem = null) => {
        setSelectedProblem(problem);
        setShowProblemModal(true);
    };

    const closeProblemModal = () => {
        setSelectedProblem(null);
        setShowProblemModal(false);
    };

    const addProblem = async (newProblemData) => {
        try {
            const response = await createProblem(newProblemData);
            setProblems((prevProblems) => [...prevProblems, response.data]);
        } catch (error) {
            console.error("Failed to add problem:", error);
        }
    };

    const editProblem = async (editedProblemData) => {
        try {
            await updateProblem(selectedProblem.problemId, editedProblemData);
            setProblems((prevProblems) =>
                prevProblems.map(problem =>
                    problem.problemId === selectedProblem.problemId ? { ...problem, ...editedProblemData } : problem
                )
            );
        } catch (error) {
            console.error("Failed to edit problem:", error);
        }
    };

    const deleteProblemById = async (id) => {
        try {
            await deleteProblem(id);
            setProblems((prevProblems) => prevProblems.filter(problem => problem.id !== id));
        } catch (error) {
            console.error("Failed to delete problem:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <h2 className="text-xl font-semibold mt-4 text-gray-700">Loading Admin Panel</h2>
                    <p className="text-gray-500 mt-2">Please wait while we fetch the data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg">
            </nav>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('problems')}
                                className={`${activeTab === 'problems'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Problems
                            </button>
                            <button
                                onClick={() => setActiveTab('tags')}
                                className={`${activeTab === 'tags'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Tags
                            </button>
                            <button
                                onClick={() => setActiveTab('platforms')}
                                className={`${activeTab === 'platforms'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Platforms
                            </button>
                        </nav>
                    </div>

                    <div className="mt-6">
                        {activeTab === 'problems' && (
                            <div>
                                <div className="mb-4">
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                                        onClick={() => openProblemModal()}
                                    >
                                        Add New Problem
                                    </button>
                                </div>
                                <ProblemsListPage
                                    problems={problems}
                                    openEditModal={openProblemModal}
                                    onDeleteProblem={deleteProblemById}
                                    onEditProblem={editProblem}
                                    isAdmin={true}
                                />
                            </div>
                        )}
                        {activeTab === 'tags' && <TagsManagement tags={tags} setTags={setTags} />}
                        {activeTab === 'platforms' && <PlatformsManagement platforms={platforms} setPlatforms={setPlatforms} />}
                    </div>
                </div>
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
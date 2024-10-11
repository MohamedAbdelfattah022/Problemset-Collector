import React, { useState, useEffect } from 'react';
import ProblemsListPage from './ProblemsListPage';
import ProblemModal from '../components/ProblemModal';
import LandingPage from './LandingPage';
import { getProblems, createProblem, updateProblem, deleteProblem } from '../api';

const isAdmin = true;

const AdminPanel = () => {
    const [showProblemModal, setShowProblemModal] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await getProblems();
                setProblems(response.data);
            } catch (error) {
                console.error("Failed to fetch problems:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, []);

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
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Manage Problems</h1>
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
                    onDeleteProblem={deleteProblemById}
                    onEditProblem={editProblem}
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

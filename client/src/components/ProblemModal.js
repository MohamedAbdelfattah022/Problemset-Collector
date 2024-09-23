import React, { useState } from 'react';

const ProblemModal = ({ problem, onClose, onAddProblem, onEditProblem }) => {
    const [formData, setFormData] = useState({
        id: problem ? problem.id : null,
        name: problem ? problem.name : '',
        platform: problem ? problem.platform : '',
        difficulty: problem ? problem.difficulty : '',
        url: problem ? problem.url : '',
        tags: problem ? problem.tags : [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTagChange = (e) => {
        setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (problem) {
            onEditProblem(formData);
        } else {
            onAddProblem({ ...formData, id: Date.now() });
        }
        onClose();
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleOverlayClick} // Close modal on overlay click
        >
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2 lg:w-1/3 relative">
                <span className="absolute top-2 right-2 cursor-pointer" onClick={onClose}>
                    &times;
                </span>
                <h2 className="text-lg font-bold mb-4">{problem ? 'Edit Problem' : 'Add New Problem'}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Problem Name"
                        className="border rounded w-full p-2 mb-4"
                        required
                    />
                    <input
                        type="text"
                        name="platform"
                        value={formData.platform}
                        onChange={handleChange}
                        placeholder="Platform"
                        className="border rounded w-full p-2 mb-4"
                        required
                    />
                    <input
                        type="text"
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleChange}
                        placeholder="Difficulty"
                        className="border rounded w-full p-2 mb-4"
                        required
                    />
                    <input
                        type="text"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                        placeholder="Problem URL"
                        className="border rounded w-full p-2 mb-4"
                        required
                    />
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags.join(', ')}
                        onChange={handleTagChange}
                        placeholder="Tags (comma-separated)"
                        className="border rounded w-full p-2 mb-4"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                    >
                        {problem ? 'Update' : 'Add'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProblemModal;

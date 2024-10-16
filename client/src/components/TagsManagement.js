import React, { useState, useEffect } from 'react';
import { getTags, createTag, updateTag, deleteTag } from '../api';

const TagsManagement = () => {
    const [tags, setTags] = useState([]);
    const [newTagName, setNewTagName] = useState('');
    const [editingTag, setEditingTag] = useState(null);
    const [editingTagName, setEditingTagName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        setLoading(true);
        try {
            const response = await getTags();
            setTags(response.data);
        } catch (error) {
            console.error('Failed to fetch tags:', error);
            setMessage('Failed to fetch tags.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTag = async (e) => {
        e.preventDefault();
        if (!newTagName.trim()) return;
        setLoading(true);
        try {
            await createTag(newTagName);
            setNewTagName('');
            setMessage('Tag added successfully.');
            fetchTags();
        } catch (error) {
            console.error('Failed to create tag:', error);
            setMessage('Failed to add tag.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTag = async (id) => {
        if (!editingTagName.trim()) return;
        setLoading(true);
        try {
            await updateTag(id, editingTagName);
            setMessage('Tag updated successfully.');
            setEditingTag(null);
            fetchTags();
        } catch (error) {
            console.error('Failed to update tag:', error);
            setMessage('Failed to update tag.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingTag(null);
        setEditingTagName(''); // Reset the editing input value
    };

    const handleDeleteTag = async (id) => {
        setLoading(true);
        try {
            await deleteTag(id);
            setMessage('Tag deleted successfully.');
            fetchTags();
        } catch (error) {
            console.error('Failed to delete tag:', error);
            setMessage('Failed to delete tag.');
        } finally {
            setLoading(false);
        }
    };

    const startEditing = (tag) => {
        setEditingTag(tag.tagId);
        setEditingTagName(tag.tagName); // Pre-populate the input with the current tag name
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 p-4 border rounded-lg shadow-lg bg-gray-50">
            {message && (
                <div className={`mb-4 p-3 rounded ${message.includes('Failed') ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleCreateTag} className="mb-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="New tag name"
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                />
                <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700  sm:w-auto w-full">
                    {loading ? 'Adding...' : 'Add Tag'}
                </button>
            </form>

            <h3 className="text-2xl font-semibold mb-4">Existing Tags</h3>
            {loading && <p>Loading tags...</p>}
            {!loading && tags.length === 0 && <p>No tags available.</p>}

            <ul className="space-y-6">
                {tags.map((tag) => (
                    <li key={tag.tagId} className="p-4 bg-white rounded-lg shadow-md">
                        <div className="flex justify-between items-center">
                            {editingTag === tag.tagId ? (
                                <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 w-full">
                                    <input
                                        type="text"
                                        value={editingTagName}
                                        onChange={(e) => setEditingTagName(e.target.value)}
                                        className="border border-gray-300 rounded-lg px-3 py-2 w-full shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        autoFocus
                                    />
                                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                                        <button
                                            onClick={() => handleUpdateTag(tag.tagId)}
                                            className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 "
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 "
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between w-full">
                                    <span className="font-medium text-gray-900">{tag.tagName}</span>
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => startEditing(tag)}
                                            className="text-blue-500 hover:text-blue-700 "
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTag(tag.tagId)}
                                            className="text-red-500 hover:text-red-700 "
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TagsManagement;

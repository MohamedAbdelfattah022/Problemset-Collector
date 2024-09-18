import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange, onSearchClick }) => {
    return (
        <div className="mt-6 flex justify-center">
            <input
                type="text"
                value={searchTerm}
                onChange={onSearchChange}
                className="w-2/3 md:w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Search problems by name, platform, or tags..."
            />
            <button
                onClick={onSearchClick}
                className="ml-4 bg-indigo-500 text-white px-5 py-3 rounded-lg hover:bg-indigo-600"
            >
                Search
            </button>
        </div>
    );
};

export default SearchBar;

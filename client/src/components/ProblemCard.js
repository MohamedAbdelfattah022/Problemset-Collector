const ProblemCard = ({ problem, onTagClick, onDifficultyClick, onDelete, onEdit, isAdmin }) => {
    const tags = problem?.tags || [];

    const getDifficultyClass = (difficulty) => {
        if (difficulty === 'Easy') return 'bg-green-200 text-green-800';
        if (difficulty === 'Medium') return 'bg-yellow-200 text-yellow-800';
        if (difficulty === 'Hard') return 'bg-red-200 text-red-800';

        const numericDifficulty = parseInt(difficulty, 10);
        if (numericDifficulty >= 2400) return 'bg-red-pure text-white';
        if (numericDifficulty >= 2300) return 'bg-orange-custom text-white';
        if (numericDifficulty >= 2100) return 'bg-orange-custom text-white';
        if (numericDifficulty >= 1900) return 'bg-violet-custom text-white';
        if (numericDifficulty >= 1600) return 'bg-blue-pure text-white';
        if (numericDifficulty >= 1400) return 'bg-cyan-custom text-white';
        if (numericDifficulty >= 1200) return 'bg-green-custom text-white';
        if (numericDifficulty >= 0) return 'bg-gray-400 text-white';

        return 'bg-pink-500 text-white';
    };

    return (
        <div
            role="row"
            className="p-4 odd:bg-layer-1 even:bg-overlay-1 dark:odd:bg-dark-layer-bg dark:even:bg-dark-fill-4 flex flex-col sm:flex-row items-start justify-between bg-white dark:bg-gray-700 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl"
        >
            {/* Problem Details Cell */}
            <div role="cell" className="flex-grow flex flex-col">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white break-words">
                    <a
                        href={problem?.problemUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={problem?.problemName}
                        className="hover:underline"
                    >
                        {problem?.problemName || 'No name available'}
                    </a>
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{problem?.platformName || 'No platform available'}</p>
                {/* Tags display */}
                <div className="mt-2 flex flex-wrap gap-1">
                    {tags.length > 0 ? (
                        tags.map((tag, index) => (
                            <button
                                key={index}
                                onClick={() => onTagClick(tag)}
                                className="bg-indigo-200 text-indigo-700 px-2 py-1 rounded-full text-xs sm:text-sm transition-all duration-300 ease-in-out hover:bg-indigo-300"
                            >
                                {tag}
                            </button>
                        ))
                    ) : (
                        <span className="text-gray-500">No tags available</span>
                    )}
                </div>
            </div>

            {/* Difficulty Cell */}
            <div role="cell" className="mt-2 sm:mt-0 sm:ml-4 flex items-center">
                <button
                    onClick={() => onDifficultyClick(problem?.problemDifficulty || 'Unknown')}
                    className={`inline-block px-3 py-1 rounded-lg text-sm font-medium cursor-pointer ${getDifficultyClass(problem?.problemDifficulty)}`}
                >
                    {problem?.problemDifficulty || 'Unknown'}
                </button>
            </div>

            {/* Admin controls for editing and deleting */}
            {isAdmin && (
                <div className="mt-2 sm:mt-0 sm:ml-4 flex items-center space-x-2">
                    <button
                        className="bg-[#4169E1] text-[#FFFFFF] px-3 py-1 rounded-lg hover:bg-[#3C5A9A] transition-all duration-300 ease-in-out"
                        onClick={() => onEdit(problem)}
                    >
                        Edit
                    </button>
                    <button
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-300 ease-in-out"
                        onClick={() => onDelete(problem?.problemId)}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProblemCard;

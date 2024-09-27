const ProblemCard = ({ problem, onTagClick, onDifficultyClick, onDelete, onEdit, isAdmin }) => {
    const tags = problem?.problemTags || [];

    const getDifficultyClass = (difficulty) => {


        if (difficulty === 'Easy') return 'bg-green-200 text-green-800';
        if (difficulty === 'Medium') return 'bg-yellow-200 text-yellow-800';
        if (difficulty === 'Hard') return 'bg-red-200 text-red-800';

        const numericDifficulty = parseInt(difficulty, 10);

        if (numericDifficulty >= 2400) return 'bg-red-600 text-white';
        if (numericDifficulty >= 2300) return 'bg-orange-400 text-white';
        if (numericDifficulty >= 2100) return 'bg-orange-400 text-white';
        if (numericDifficulty >= 1900) return 'bg-purple-600 text-white';
        if (numericDifficulty >= 1600) return 'bg-blue-600 text-white';
        if (numericDifficulty >= 1400) return 'bg-cyan-500 text-white';
        if (numericDifficulty >= 1200) return 'bg-green-600 text-white';
        if (numericDifficulty >= 0) return 'bg-gray-400 text-white';

        return 'bg-pink-500 text-white';;
    };

    return (
        <div className="border rounded-lg p-4 shadow-lg bg-white dark:bg-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                <a href={problem?.problemUrl || '#'} target="_blank" rel="noopener noreferrer">
                    {problem?.problemName || 'No name available'}
                </a>
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{problem?.platformName || 'No platform available'}</p>

            <div className="mt-2">
                <button
                    onClick={() => onDifficultyClick(problem?.problemDifficulty || 'Unknown')}
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${getDifficultyClass(problem?.problemDifficulty)}`}
                >
                    {problem?.problemDifficulty || 'Unknown'}
                </button>
            </div>

            <div className="mt-4">
                {tags.length > 0 ? (
                    tags.map((tag, index) => (
                        <button
                            key={index}
                            onClick={() => onTagClick(tag)}
                            className="inline-block bg-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-sm mb-2 mr-2"
                        >
                            {tag}
                        </button>
                    ))
                ) : (
                    <span className="text-gray-500">No tags available</span>
                )}
            </div>

            {isAdmin && (
                <div className="mt-4 flex gap-2">
                    <button
                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                        onClick={() => onEdit(problem)}
                    >
                        Edit
                    </button>
                    <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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

const ProblemCard = ({ problem, onTagClick, onDifficultyClick }) => {
    return (
        <div className="border rounded-lg p-4 shadow-lg bg-white dark:bg-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                <a href={problem.url} target="_blank" rel="noopener noreferrer">
                    {problem.name}
                </a>
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{problem.platform}</p>
            <div className="mt-2">
                <button
                    onClick={() => onDifficultyClick(problem.difficulty)}
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${problem.difficulty === 'Easy' ? 'bg-green-200 text-green-800' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'
                        }`}
                >
                    {problem.difficulty}
                </button>
            </div>
            <div className="mt-4">
                {problem.tags.map((tag, index) => (
                    <button
                        key={index}
                        onClick={() => onTagClick(tag)}
                        className="inline-block bg-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-sm mb-2 mr-2"
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProblemCard;

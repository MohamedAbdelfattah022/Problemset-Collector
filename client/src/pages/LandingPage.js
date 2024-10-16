import React from 'react';
import Hero from '../components/Hero';

const LandingPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <Hero />

            <div className="mt-12 px-4 sm:px-6 lg:px-8 text-center">
                <p className="mt-4 text-lg text-gray-600">
                    Find, solve, and manage your problems efficiently.
                </p>
                <a
                    href="/problems"
                    className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    View Problems
                </a>
            </div>
        </div>
    );
};

export default LandingPage;

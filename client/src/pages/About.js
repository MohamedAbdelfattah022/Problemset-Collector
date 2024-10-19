import React, { useState } from 'react';

const About = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <div className="bg-gray-50 max-h-screen mt-[4em]">
            <main className="pt-5 px-6 container mx-auto">
                <section className="mb-10">
                    <h2 className="text-3xl font-bold text-gray-800">Project Purpose</h2>
                    <p className="mt-4 text-gray-600">
                        The purpose of this project is to provide a centralized place where problems from various platforms are collected and categorized for easier access and study.
                    </p>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-5">
                    {/* Creator */}
                    <div>
                        <div className="mt-4 bg-white p-6 rounded-lg shadow-lg text-center">
                            <img
                                src="creator.jpg"
                                alt="Creator Pic"
                                className="w-60 h-60 rounded-full mx-auto"
                            />
                            <h3 className="text-xl font-semibold text-gray-800 mt-4">Mohamed Abdelfattah</h3>
                            <p className="text-gray-600">Creator</p>
                            <p className="mt-2 text-gray-600">
                                ECPC Finalist | Backend Developer
                            </p>

                            {/* Social Media Accounts inside creator card */}
                            <div className="flex justify-center space-x-4 mt-2">
                                <a
                                    href="https://www.linkedin.com/in/mohamed-abdelfattah-65b984247/"
                                    target="_blank" rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    className="text-blue-600 bg-blue-100 p-3 rounded-full hover:bg-blue-200 transition-colors"
                                >
                                    <img
                                        src="linkedin.png"
                                        alt="LinkedIn"
                                        className="h-6 w-6"
                                    />
                                </a>
                                <a
                                    href="https://github.com/MohamedAbdelfattah022"
                                    target="_blank" rel="noopener noreferrer"
                                    aria-label="GitHub"
                                    className="text-gray-800 bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    <img
                                        src="github.png"
                                        alt="Github"
                                        className="h-6 w-6"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="w-full">
                        <h2 className="text-3xl font-bold text-gray-800">Get in Touch</h2>
                        <p className="text-gray-600 mb-6">
                            Have questions or a suggestion? Reach out to me through the contact form below.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-2 w-full md:w-2/3">
                            <div>
                                <label htmlFor="name" className="block text-gray-700">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-gray-700">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    rows="4"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default About;

import axios from 'axios';

const API_URL = 'http://localhost:5293/api';

// Users API
export const inviteAdmin = (email) => {
    return axios.post(`${API_URL}/Users/invite`, email, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
};

export const registerUser = (formData) => {
    return axios.post(`${API_URL}/Users/register`, formData);
};

export const loginUser = async (email, password) => {
    const response = await axios.post(`${API_URL}/Users/login`, { email, password });
    localStorage.setItem('token', response.data.token);
    return response;
};

export const forgotPassword = async (data) => {
    return await axios.post(`${API_URL}/Users/forgotPass`, data);
};

export const resetPassword = async (formData) => {
    return await axios.put(`${API_URL}/Users/resetPass`, formData);
};

// Tags API
export const getTags = async () => {
    return await axios.get(`${API_URL}/Tags`);
};

export const getTagById = async (id) => {
    return await axios.get(`${API_URL}/Tags/${id}`);
};

export const createTag = async (tagName) => {
    const token = localStorage.getItem('token');
    return await axios.post(`${API_URL}/Tags/${tagName}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const updateTag = async (id, tagName) => {
    const token = localStorage.getItem('token');
    return await axios.put(`${API_URL}/Tags/${id}`, { tagName }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const deleteTag = async (id) => {
    const token = localStorage.getItem('token');
    return await axios.delete(`${API_URL}/Tags/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
// Platforms API
export const getPlatforms = async () => {
    return await axios.get(`${API_URL}/Platforms`);
};

export const getPlatformById = async (id) => {
    return await axios.get(`${API_URL}/Platforms/${id}`);
};

export const createPlatform = async (platformData) => {
    const token = localStorage.getItem('token');
    return await axios.post(`${API_URL}/Platforms`, platformData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const updatePlatform = async (id, platformData) => {
    const token = localStorage.getItem('token');
    return await axios.put(`${API_URL}/Platforms/${id}`, platformData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const deletePlatform = async (id) => {
    const token = localStorage.getItem('token');
    return await axios.delete(`${API_URL}/Platforms/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getPlatformByName = async (platformName) => {
    return await axios.get(`${API_URL}/Platforms/${platformName}`);
};

// Problems API
export const getProblems = async (page = 1, pageSize = 10) => {
    return await axios.get(`${API_URL}/Problems?page=${page}&pageSize=${pageSize}`);
};

export const createProblem = async (problemData) => {
    const token = localStorage.getItem('token');
    return await axios.post(`${API_URL}/Problems`, problemData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getProblemById = async (id) => {
    return await axios.get(`${API_URL}/Problems/${id}`);
};

export const updateProblem = async (id, problemData) => {
    const token = localStorage.getItem('token');
    return await axios.put(`${API_URL}/Problems/${id}`, problemData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const deleteProblem = async (id) => {
    return await axios.delete(`${API_URL}/Problems/${id}`);
};

export const getDifficulties = async () => {
    return await axios.get(`${API_URL}/Problems/difficulties`);
};

// ProblemTags API
export const getProblemTags = async () => {
    return await axios.get(`${API_URL}/ProblemTags`);
};

export const createProblemTag = async (tagData) => {
    return await axios.post(`${API_URL}/ProblemTags`, tagData);
};

export const getTagsByProblemId = async (problemId) => {
    return await axios.get(`${API_URL}/ProblemTags/tag/${problemId}`);
};

export const getProblemsByTagId = async (tagId) => {
    return await axios.get(`${API_URL}/ProblemTags/problems/${tagId}`);
};

export const deleteProblemTag = async (tagId, problemId) => {
    return await axios.delete(`${API_URL}/ProblemTags/${tagId}/${problemId}`);
};

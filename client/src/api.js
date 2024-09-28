import axios from 'axios';

const API_URL = 'https://localhost:7287/api';

// Tags API
export const getTags = async () => {
    return await axios.get(`${API_URL}/Tags`);
};

export const getTagById = async (id) => {
    return await axios.get(`${API_URL}/Tags/${id}`);
};

export const createTag = async (tagName) => {
    return await axios.post(`${API_URL}/Tags`, { tagName });
};

export const updateTag = async (id, tagName) => {
    return await axios.put(`${API_URL}/Tags/${id}`, { tagName });
};

export const deleteTag = async (id) => {
    return await axios.delete(`${API_URL}/Tags/${id}`);
};

// Platforms API
export const getPlatforms = async () => {
    return await axios.get(`${API_URL}/Platforms`);
};

export const getPlatformById = async (id) => {
    return await axios.get(`${API_URL}/Platforms/${id}`);
};

export const createPlatform = async (platformData) => {
    return await axios.post(`${API_URL}/Platforms`, platformData);
};

export const updatePlatform = async (id, platformData) => {
    return await axios.put(`${API_URL}/Platforms/${id}`, platformData);
};

export const deletePlatform = async (id) => {
    return await axios.delete(`${API_URL}/Platforms/${id}`);
};

export const getPlatformByName = async (platformName) => {
    return await axios.get(`${API_URL}/Platforms/${platformName}`);
};

// Problems API
export const getProblems = async (page = 1, pageSize = 10) => {
    return await axios.get(`${API_URL}/Problems?page=${page}&pageSize=${pageSize}`);
};

export const getProblemById = async (id) => {
    return await axios.get(`${API_URL}/Problems/${id}`);
};

export const createProblem = async (problemData) => {
    return await axios.post(`${API_URL}/Problems`, problemData);
};

export const updateProblem = async (id, problemData) => {
    return await axios.put(`${API_URL}/Problems/${id}`, problemData);
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

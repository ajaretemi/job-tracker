import axios from "axios";

const API_BASE = "http://localhost:5000/api/jobs";

export const getJobs = () => axios.get(API_BASE);

export const createJob = (formData) =>
  axios.post(API_BASE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateJob = (id, jobData) =>
  axios.put(`${API_BASE}/${id}`, jobData);

export const deleteJob = (id) => axios.delete(`${API_BASE}/${id}`);

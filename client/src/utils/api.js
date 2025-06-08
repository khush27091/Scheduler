// src/api.js
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const registerUser = (data) => axios.post(`${API_BASE}/register`, data);
export const loginUser = (data) => axios.post(`${API_BASE}/login`, data);

export const createAvailability = (data) => axios.post(`${API_BASE}/availability`, data);
export const getUserAvailability = (userId) => axios.get(`${API_BASE}/availability/${userId}`);
export const updateAvailability = (id, data) => axios.put(`${API_BASE}/availability/${id}`, data);
export const deleteAvailability = (id) => axios.delete(`${API_BASE}/availability/${id}`);

export const generateBookingLink = (data) => axios.post(`${API_BASE}/bookinglink`, data);
export const getBookingLinkDetails = (linkId) => axios.get(`${API_BASE}/bookinglink/${linkId}`);

export const createBooking = (data) => axios.post(`${API_BASE}/booking`, data);
export const getBookingsByLink = (linkId) => axios.get(`${API_BASE}/booking/${linkId}`);
export const cancelBooking = (id) => axios.delete(`${API_BASE}/booking/${id}`);

// Centralized Axios client with Firebase token refresh + retry.
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config.js';

const baseURL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000';

export const api = axios.create({ baseURL });

let authInitPromise;
const waitForAuthInit = () => {
  if (auth.currentUser) {
    return Promise.resolve(auth.currentUser);
  }
  if (!authInitPromise) {
    authInitPromise = new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        authInitPromise = null;
        resolve(user || null);
      });
    });
  }
  return authInitPromise;
};

const getFreshToken = async (forceRefresh = false) => {
  const user = await waitForAuthInit();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const token = await user.getIdToken(forceRefresh);
  localStorage.setItem('idToken', token);
  return token;
};

api.interceptors.request.use(async (cfg) => {
  try {
    const token = await getFreshToken();
    cfg.headers = cfg.headers || {};
    cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
  } catch (error) {
    localStorage.removeItem('idToken');
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
});

api.interceptors.response.use(undefined, async (error) => {
  const status = error?.response?.status;
  const originalRequest = error.config;
  if (status === 401 && !originalRequest?._retry) {
    originalRequest._retry = true;
    try {
      const newToken = await getFreshToken(true);
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshErr) {
      console.error('Token refresh failed', refreshErr);
    }
    localStorage.removeItem('idToken');
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }
  return Promise.reject(error);
});

// Meals
export async function listMeals() {
  const { data } = await api.get('/api/v1/meals');
  return data.meals || [];
}
export async function createMeal(meal) { // meal: { name, calories, protein, fat, carbs }
  return api.post('/api/v1/meals', meal).then(r => r.data);
}

export async function updateMeal(mealID, meal) {
  return api.put(`/api/v1/meals/${mealID}`, meal).then(r => r.data);
}

export async function deleteMealById(mealID) {
  return api.delete(`/api/v1/meals/${mealID}`).then(r => r.data);
}

// Goals
export async function getGoals() { return api.get('/api/v1/goals').then(r => r.data); }
export async function setGoals(goals) { return api.post('/api/v1/goals', goals).then(r => r.data); }
export async function updateGoals(goals) { return api.put('/api/v1/goals', goals).then(r => r.data); }

// Plans
export async function listPlans() {
  return api.get('/api/v1/plans').then(r => r.data);
}

export async function createPlan(plan) {
  // plan: { day, mealID, mealType }
  return api.post('/api/v1/plans', plan).then(r => r.data);
}

export async function deletePlan(id) {
  return api.delete(`/api/v1/plans/${id}`).then(r => r.data);
}

// Users
export async function getCurrentUser() { return api.get('/api/v1/users/current').then(r => r.data); }

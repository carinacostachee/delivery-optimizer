import axios from "axios";
import type { Route } from "../types";
import type { AddRoute } from "../types";
import { auth } from "../config/firebase";
export const api = axios.create({
  baseURL: "http://localhost:8000",
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchAllRoutes = async (): Promise<Route[]> => {
  try {
    const response = await api.get("/routes");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch routes:", error);
    throw error;
  }
};

export const createRoute = async (data: AddRoute): Promise<Route> => {
  try {
    const response = await api.post("/routes", data);
    return response.data;
  } catch (error) {
    console.error("Failed to add the new route:", error);
    throw error;
  }
};

export const deleteRoute = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/routes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete this specific route with id:${id}`, error);
    throw error;
  }
};
export const getRoute = async (id: string): Promise<Route> => {
  try {
    const response = await api.get(`/routes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to retrieve the route with id:${id}`, error);
    throw error;
  }
};

export const postOptimizeRoute = async (id: string): Promise<Route> => {
  try {
    const response = await api.post(`/routes/${id}/optimize`);
    return response.data;
  } catch (error) {
    console.error(`Failed to optimize the route with id:${id}`, error);
    throw error;
  }
};

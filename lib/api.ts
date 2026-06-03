import axios from 'axios';
import { API_URL } from './config';

const api = axios.create({
  baseURL: API_URL,
});

export interface HeyamaObject {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export interface PaginatedResponse {
  data: HeyamaObject[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getObjects = (page = 1, limit = 10) =>
  api.get<PaginatedResponse>(`/objects?page=${page}&limit=${limit}`).then((r) => r.data);

export const getObject = (id: string) =>
  api.get<HeyamaObject>(`/objects/${id}`).then((r) => r.data);

export const createObject = (formData: FormData) =>
  api.post<HeyamaObject>('/objects', formData).then((r) => r.data);

export const deleteObject = (id: string) =>
  api.delete(`/objects/${id}`).then((r) => r.data);
import axios from 'axios';
import { Item } from '../types';
import { MOCKAPI_BASE_URL, RESOURCE_NAME, USE_MOCK_API } from '../constants';

// --- Real API Service ---
const api = axios.create({
  baseURL: MOCKAPI_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- In-Memory Store for Demo Mode ---
let mockStore: Item[] = [
  { id: '1', title: 'Welcome to CRUD App', description: 'This is a demo item. Swipe left to delete!', userId: 'demo-user', createdAt: new Date().toISOString(), status: 'active' },
  { id: '2', title: 'Review BRD', description: 'Check all requirements in the PDF.', userId: 'demo-user', createdAt: new Date().toISOString(), status: 'completed' },
];

export const ItemService = {
  getAll: async (userId: string): Promise<Item[]> => {
    if (USE_MOCK_API) {
      await new Promise(r => setTimeout(r, 800)); // Simulate network lag
      return mockStore.filter(i => i.userId === userId);
    }
    // BRD 3.3.2 Get User's Items
    const response = await api.get(`/${RESOURCE_NAME}?userId=${userId}`);
    return response.data;
  },

  create: async (item: Omit<Item, 'id'>): Promise<Item> => {
    if (USE_MOCK_API) {
      await new Promise(r => setTimeout(r, 800));
      const newItem = { ...item, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
      mockStore.push(newItem);
      return newItem;
    }
    // BRD 3.3.4 Create New Item
    const response = await api.post(`/${RESOURCE_NAME}`, item);
    return response.data;
  },

  update: async (id: string, updates: Partial<Item>): Promise<Item> => {
    if (USE_MOCK_API) {
      await new Promise(r => setTimeout(r, 800));
      const index = mockStore.findIndex(i => i.id === id);
      if (index === -1) throw new Error("Item not found");
      mockStore[index] = { ...mockStore[index], ...updates };
      return mockStore[index];
    }
    // BRD 3.3.5 Update Item
    const response = await api.put(`/${RESOURCE_NAME}/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK_API) {
      await new Promise(r => setTimeout(r, 800));
      mockStore = mockStore.filter(i => i.id !== id);
      return;
    }
    // BRD 3.3.6 Delete Item
    await api.delete(`/${RESOURCE_NAME}/${id}`);
  }
};

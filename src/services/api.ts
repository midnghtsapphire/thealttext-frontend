/**
 * TheAltText Frontend — API Service
 * Standalone API layer — connects to the TheAltText Backend.
 * Includes Stripe dual-mode (test/live) toggle.
 * A GlowStarLabs product by Audrey Evans.
 */
import axios from 'axios';
import type { AltTextResult, ScanJob, Report, DashboardStats, APIKeyData, GalleryItem, WCAGComplianceScore, AISuggestion, AccessibilityPreview, EcommerceProduct } from '../types';

// ── Mock API imports (for demo mode) ────────────────────────────────────────
import {
  mockAuthAPI, mockImageAPI, mockScannerAPI, mockReportAPI,
  mockDashboardAPI, mockBillingAPI, mockDeveloperAPI,
  mockGalleryAPI, mockEcommerceAPI, mockAISuggestionsAPI,
  mockAccessibilityPreviewAPI, mockBulkAPI,
} from './mockApi';

// ── Configuration ───────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || '/api';
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true' || !import.meta.env.VITE_API_URL;

// ── Stripe Dual-Mode ────────────────────────────────────────────────────────
const STRIPE_MODE: 'test' | 'live' = (import.meta.env.VITE_STRIPE_MODE || 'test') as 'test' | 'live';

export function getStripePublishableKey(): string {
  if (STRIPE_MODE === 'live') {
    return import.meta.env.VITE_STRIPE_LIVE_PUBLISHABLE_KEY || '';
  }
  return import.meta.env.VITE_STRIPE_TEST_PUBLISHABLE_KEY || '';
}

export function getStripeMode(): 'test' | 'live' {
  return STRIPE_MODE;
}

// ── Axios Instance ──────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('thealttext_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('thealttext_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth API ────────────────────────────────────────────────────────────────
export const authAPI = DEMO_MODE ? mockAuthAPI : {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: { email: string; password: string; full_name?: string }) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  updateProfile: (data: { full_name?: string; organization?: string; preferred_language?: string; preferred_tone?: string }) =>
    api.put('/auth/profile', data),
};

// ── Image API ───────────────────────────────────────────────────────────────
export const imageAPI = DEMO_MODE ? mockImageAPI : {
  analyzeUrl: (data: { image_url: string; language?: string; tone?: string; wcag_level?: string; context?: string }) =>
    api.post('/images/analyze-url', data),
  analyzeFile: (file: File, options: { language?: string; tone?: string; wcag_level?: string; context?: string } = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(options).forEach(([k, v]) => { if (v) formData.append(k, v); });
    return api.post('/images/analyze', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  bulkUpload: (files: File[], options: { language?: string; tone?: string; wcag_level?: string } = {}) => {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    Object.entries(options).forEach(([k, v]) => { if (v) formData.append(k, v); });
    return api.post('/images/bulk-upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  getHistory: (skip = 0, limit = 50) => api.get(`/images/history?skip=${skip}&limit=${limit}`),
};

// ── Scanner API ─────────────────────────────────────────────────────────────
export const scannerAPI = DEMO_MODE ? mockScannerAPI : {
  scan: (data: { url: string; scan_depth?: number; generate_alt?: boolean; language?: string; tone?: string }) =>
    api.post('/scanner/scan', data),
  listJobs: (skip = 0, limit = 20) => api.get(`/scanner/jobs?skip=${skip}&limit=${limit}`),
  getJob: (jobId: number) => api.get(`/scanner/jobs/${jobId}`),
};

// ── Reports API ─────────────────────────────────────────────────────────────
export const reportAPI = DEMO_MODE ? mockReportAPI : {
  list: (skip = 0, limit = 20) => api.get(`/reports/?skip=${skip}&limit=${limit}`),
  get: (reportId: number) => api.get(`/reports/${reportId}`),
  export: (reportId: number, format: string) =>
    api.get(`/reports/${reportId}/export/${format}`, { responseType: format === 'csv' ? 'blob' : 'json' }),
};

// ── Dashboard API ───────────────────────────────────────────────────────────
export const dashboardAPI = DEMO_MODE ? mockDashboardAPI : {
  getStats: () => api.get('/dashboard/stats'),
  getCarbon: () => api.get('/dashboard/carbon'),
};

// ── Billing API (Stripe dual-mode) ──────────────────────────────────────────
export const billingAPI = DEMO_MODE ? mockBillingAPI : {
  createCheckout: (data: { plan: string; success_url: string; cancel_url: string }) =>
    api.post('/billing/checkout', { ...data, stripe_mode: STRIPE_MODE }),
  getSubscription: () => api.get('/billing/subscription'),
  cancel: () => api.post('/billing/cancel'),
};

// ── Developer API ───────────────────────────────────────────────────────────
export const developerAPI = DEMO_MODE ? mockDeveloperAPI : {
  createKey: (data: { name: string }) => api.post('/developer/keys', data),
  listKeys: () => api.get('/developer/keys'),
  revokeKey: (keyId: number) => api.delete(`/developer/keys/${keyId}`),
};

// ── Blue Ocean: Gallery API ─────────────────────────────────────────────────
export const galleryAPI = DEMO_MODE ? mockGalleryAPI : {
  list: (skip = 0, limit = 50) => api.get(`/gallery?skip=${skip}&limit=${limit}`),
  get: (id: number) => api.get(`/gallery/${id}`),
  delete: (id: number) => api.delete(`/gallery/${id}`),
};

// ── Blue Ocean: E-commerce API ──────────────────────────────────────────────
export const ecommerceAPI = DEMO_MODE ? mockEcommerceAPI : {
  listProducts: (skip = 0, limit = 50) => api.get(`/ecommerce/products?skip=${skip}&limit=${limit}`),
  addProduct: (data: { sku: string; product_name: string; category: string; image_urls: string[] }) =>
    api.post('/ecommerce/products', data),
  generateSeoAlt: (productId: number) => api.post(`/ecommerce/products/${productId}/seo-alt`),
};

// ── Blue Ocean: AI Suggestions API ──────────────────────────────────────────
export const aiSuggestionsAPI = DEMO_MODE ? mockAISuggestionsAPI : {
  getSuggestions: (imageUrl: string) => api.post('/ai/suggestions', { image_url: imageUrl }),
};

// ── Blue Ocean: Accessibility Preview API ───────────────────────────────────
export const accessibilityPreviewAPI = DEMO_MODE ? mockAccessibilityPreviewAPI : {
  getPreview: (imageUrl: string, altText: string) =>
    api.post('/accessibility/preview', { image_url: imageUrl, alt_text: altText }),
};

// ── Blue Ocean: Bulk Processing API ─────────────────────────────────────────
export const bulkAPI = DEMO_MODE ? mockBulkAPI : {
  startBulkJob: (files: File[], options: { language?: string; tone?: string }) => {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    Object.entries(options).forEach(([k, v]) => { if (v) formData.append(k, v); });
    return api.post('/bulk/process', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  getBulkJobStatus: (jobId: string) => api.get(`/bulk/status/${jobId}`),
};

export default api;

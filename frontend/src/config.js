import axios from 'axios';

// In production, VITE_API_URL can be set to the deployed backend URL (e.g. https://potato-backend.onrender.com)
// In local development, it defaults to empty string '' which uses the Vite proxy (/api, /uploads)
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

if (API_BASE_URL) {
  axios.defaults.baseURL = API_BASE_URL;
}

/**
 * Resolves an image URL so it works seamlessly whether relative or absolute,
 * locally with Vite proxy or in production on separate domains.
 *
 * @param {string} path - Image path (e.g. '/uploads/potato-123.jpg')
 * @returns {string} Fully resolved image URL
 */
export function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${cleanPath}` : cleanPath;
}

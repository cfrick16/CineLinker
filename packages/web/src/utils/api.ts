// In development, we can use relative URLs which will be handled by the Vite proxy
// In production, we'll use the full API URL from the environment variable
const API_BASE = import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  console.log('Fetching from:', url); // Debug log
  
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      console.error('API call failed:', response.status, response.statusText);
      throw new Error(`API call failed: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

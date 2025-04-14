import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('API URL being used:', process.env.REACT_APP_API_URL || 'http://localhost:5000/api');

// Test connection to the API server
async function testApiConnection() {
  try {
    // Simple HEAD request to check if the server is reachable
    const testUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    console.log(`Testing connection to: ${testUrl}`);
    
    const response = await fetch(`${testUrl}`, { 
      method: 'HEAD',
      mode: 'cors'
    });
    
    console.log('API server is reachable:', response.ok);
    return true;
  } catch (error) {
    console.error('API server is not reachable:', error.message);
    return false;
  }
}

// Run the test immediately to see results in console
testApiConnection();

// Add authorization header to requests if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authApi = {
  // Register a new user
  register: async (userData) => {
    try {
      console.log('Attempting to register user with API URL:', API_URL);
      
      // Add default role if not specified
      if (!userData.role) {
        userData.role = 'Viewer';
      }
      
      // Try to use a relative URL as fallback
      const response = await api.post('/auth/register', userData)
        .catch(async (error) => {
          if (error.message === "Network Error") {
            console.log('Network error detected. Trying localhost fallback...');
            
            // Create a temporary axios instance with localhost
            const localApi = axios.create({
              baseURL: 'http://localhost:5000/api',
              headers: {
                'Content-Type': 'application/json',
              }
            });
            
            // Try with localhost
            return await localApi.post('/auth/register', userData);
          }
          throw error;
        });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user info
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },

  // Get current user from localStorage
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export const uploadApi = {
  // Upload media file
  uploadMedia: async (file) => {
    try {
      const formData = new FormData();
      formData.append('media', file);
      
      const response = await axios.post(`${API_URL}/uploads`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': localStorage.getItem('token')
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
};

export const transactionApi = {
  // Get all transactions with optional filters
  getTransactions: async (filters = {}) => {
    try {
      const response = await api.get('/transactions', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  // Get a single transaction by ID
  getTransaction: async (id) => {
    try {
      const response = await api.get(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching transaction with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new transaction
  createTransaction: async (transactionData) => {
    try {
      const response = await api.post('/transactions', transactionData);
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  // Update an existing transaction
  updateTransaction: async (id, transactionData) => {
    try {
      const response = await api.put(`/transactions/${id}`, transactionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating transaction with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a transaction
  deleteTransaction: async (id) => {
    try {
      const response = await api.delete(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting transaction with ID ${id}:`, error);
      throw error;
    }
  },

  // Get transaction summary
  getTransactionSummary: async (filters = {}) => {
    try {
      const response = await api.get('/transactions/summary/all', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction summary:', error);
      throw error;
    }
  },
  
  // Import transactions from CSV
  importFromCSV: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_URL}/transactions/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': localStorage.getItem('token')
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error importing transactions from CSV:', error);
      throw error;
    }
  }
};

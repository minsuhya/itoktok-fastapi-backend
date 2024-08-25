// stores/auth.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,  // Holds the user object after login
    isAuthenticated: false,  // Tracks authentication status
    token: null,  // JWT token or similar
  }),

  actions: {
    async login(credentials) {
      try {
        // Send login request to API
        // axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;
        // axios.defaults.baseURL = "http://localhost:2080";
        // console.log('url:', axios.defaults.baseURL);
        const response = await axios.post('/auth/login', credentials, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        // Assuming response contains user data and token
        this.user = response.data.user;
        this.token = response.data.access_token;
        this.isAuthenticated = true;

        // Store the token in localStorage or a similar mechanism
        localStorage.setItem('authToken', this.token);

        // Set Authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        return true;

      } catch (error) {
        console.error('Failed to log in:', error);
        // Handle error appropriately
        return false;
      }
    },

    logout() {
      // Clear user data and token
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;

      // Remove token from localStorage
      localStorage.removeItem('authToken');

      // Clear Authorization header
      delete axios.defaults.headers.common['Authorization'];
    },

    // Method to check if the user is authenticated
    checkAuth() {
      const token = localStorage.getItem('authToken');
      if (token) {
        this.token = token;
        this.isAuthenticated = true;
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        // Optionally, fetch user details if not stored
      }
    }
  }
});


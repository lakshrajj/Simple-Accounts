import { useState } from 'react';
import { authApi } from '../services/api';
import { User, Mail, Lock, User2 } from 'lucide-react';

const RegisterForm = ({ setIsAuthenticated, setShowRegister, onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState(null); // Add debug state

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.username || !formData.email || !formData.password || !formData.name) {
      setError('All fields are required');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setError('');
    setLoading(true);
    setDebug(null); // Clear debug info
    
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = formData;
      
      // Debug: Log the data being sent
      console.log('Sending registration data:', registerData);
      
      const response = await authApi.register(registerData);
      
      // Debug: Log the response
      console.log('Registration response:', response);
      setDebug({
        sentData: registerData,
        response: response
      });
      
      setIsAuthenticated(true);
      if (onClose) onClose();
    } catch (err) {
      console.error('Registration error:', err);
      
      // More detailed error logging
      setDebug({
        error: err,
        errorData: err.response?.data,
        status: err.response?.status,
        message: err.message
      });
      
      // More specific error handling
      if (err.response?.status === 409) {
        setError('Username or email already exists. Please try another.');
      } else if (err.response?.status === 400) {
        setError('Invalid data provided. Please check your information.');
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Create an Account</h2>
        <p className="text-gray-600 text-sm mt-1">Enter your details to register</p>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User2 className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              name="username"
              placeholder="johndoe123"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              placeholder="******************"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="******************"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>
        
        {/* Debug information section */}
        {debug && (
          <div className="mb-4 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
            <p className="font-bold mb-1">Debug Info:</p>
            <pre>{JSON.stringify(debug, null, 2)}</pre>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 font-semibold"
              onClick={() => setShowRegister(false)}
            >
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
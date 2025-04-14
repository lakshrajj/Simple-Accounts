import { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Shield, LogOut, 
  Save, Camera, AlertTriangle, CheckCircle
} from 'lucide-react';
import { authApi } from '../services/api';

const UserProfile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    dateJoined: '',
    avatar: '',
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [profileStats, setProfileStats] = useState({
    totalTransactions: 0,
    totalIncome: 0,
    totalExpenses: 0,
    lastActivity: '',
  });
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // In a real app, this would fetch user data from the API
        // For now, we'll get user from localStorage
        const storedUser = authApi.getUser();
        
        if (storedUser) {
          // Format the date to display
          const joinDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          
          const userData = {
            name: storedUser.name || 'User',
            email: storedUser.email || 'user@example.com',
            phone: storedUser.phone || '',
            dateJoined: storedUser.date || joinDate,
            avatar: storedUser.avatar || '',
          };
          
          setUser(userData);
          setFormData({
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
          
          // For demonstration, we'll use mock stats
          setProfileStats({
            totalTransactions: 42,
            totalIncome: 4150,
            totalExpenses: 1775,
            lastActivity: new Date().toLocaleDateString(),
          });
        }
      } catch (error) {
        console.error('Failed to load user data', error);
        setMessage({
          text: 'Failed to load user data. Please try again.',
          type: 'error',
        });
      }
    };
    
    loadUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In real app, you would call:
      // await api.put('/users/profile', formData);
      
      // For our mock app:
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setUser({
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });
      
      // Update localStorage (simplified version)
      const currentUser = authApi.getUser();
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      setMessage({
        text: 'Profile updated successfully!',
        type: 'success',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        text: 'Failed to update profile. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        text: 'New passwords do not match',
        type: 'error',
      });
      setLoading(false);
      return;
    }
    
    try {
      // In real app, call the API:
      // await api.put('/users/password', {
      //   currentPassword: formData.currentPassword,
      //   newPassword: formData.newPassword,
      // });
      
      // For our mock:
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setMessage({
        text: 'Password updated successfully!',
        type: 'success',
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({
        text: 'Failed to update password. Please check your current password.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authApi.logout();
    // In the integrated app, logout would be handled by the parent component
    // No need to call setIsAuthenticated since it's not passed as prop anymore
    window.location.reload(); // Simple way to refresh the page after logout
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return;
    
    setLoading(true);
    try {
      // In a real app:
      // const response = await uploadApi.uploadMedia(avatarFile);
      // const avatarUrl = response.fileUrl;
      
      // For our mock:
      await new Promise(resolve => setTimeout(resolve, 1000));
      const avatarUrl = avatarPreview; // Use the preview as the "uploaded" URL
      
      setUser({
        ...user,
        avatar: avatarUrl,
      });
      
      // Update in localStorage
      const currentUser = authApi.getUser();
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          avatar: avatarUrl,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      setMessage({
        text: 'Profile picture updated successfully!',
        type: 'success',
      });
      setAvatarFile(null);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setMessage({
        text: 'Failed to upload profile picture. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Clear any message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-4 md:mb-0 md:mr-6 relative">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {avatarPreview || user.avatar ? (
                    <img 
                      src={avatarPreview || user.avatar} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23D1D5DB'%3E%3Cpath d='M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm5 12.59c0 .8-6 .8-10 .8-2 0-4-.21-4-.8v-1a3.69 3.69 0 0 1 4-4h6a3.59 3.59 0 0 1 4 4z'/%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <User className="h-12 w-12 text-gray-400 dark:text-gray-300" />
                  )}
                </div>
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 cursor-pointer">
                  <Camera className="h-4 w-4 text-white" />
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              
              {avatarFile && (
                <button
                  onClick={uploadAvatar}
                  disabled={loading}
                  className="mb-4 md:mb-0 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Save className="h-4 w-4 mr-1" />
                  {loading ? 'Uploading...' : 'Upload Picture'}
                </button>
              )}

              <div className="text-center md:text-left">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{user.name}</h2>
                <div className="flex flex-col md:flex-row md:space-x-4 text-gray-600 dark:text-gray-300 mt-1">
                  <span className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {user.email}
                  </span>
                  {user.phone && (
                    <span className="flex items-center mt-1 md:mt-0">
                      <Phone className="h-4 w-4 mr-1" />
                      {user.phone}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Member since: {user.dateJoined}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            {message.type === 'error' ? (
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                {message.text}
              </div>
            ) : (
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                {message.text}
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex shadow-sm rounded-md">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
              } px-4 py-2 text-sm font-medium rounded-l-md border border-gray-300 dark:border-gray-600 focus:z-10 focus:outline-none`}
            >
              Profile Information
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`${
                activeTab === 'security'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
              } px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300 dark:border-gray-600 focus:z-10 focus:outline-none`}
            >
              Security
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('activity')}
              className={`${
                activeTab === 'activity'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
              } px-4 py-2 text-sm font-medium rounded-r-md border-t border-b border-r border-gray-300 dark:border-gray-600 focus:z-10 focus:outline-none`}
            >
              Account Activity
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Information</h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleProfileSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md ${
                          !isEditing ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-700'
                        } text-gray-700 dark:text-white`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md ${
                          !isEditing ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-700'
                        } text-gray-700 dark:text-white`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone Number
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md ${
                          !isEditing ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-700'
                        } text-gray-700 dark:text-white`}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            ...formData,
                            name: user.name,
                            email: user.email,
                            phone: user.phone,
                          });
                        }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Security Settings</h3>

              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        required
                        className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      New Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        required
                        className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white rounded-md"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Password must be at least 8 characters and include a mix of letters, numbers, and symbols.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirm New Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white rounded-md"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Account Activity</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-3">Account Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Total Transactions:</span>
                      <span className="font-medium dark:text-white">{profileStats.totalTransactions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Total Income:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">${profileStats.totalIncome.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Total Expenses:</span>
                      <span className="font-medium text-red-600 dark:text-red-400">${profileStats.totalExpenses.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Net Balance:</span>
                      <span className={`font-medium ${
                        profileStats.totalIncome - profileStats.totalExpenses >= 0 
                          ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        ${(profileStats.totalIncome - profileStats.totalExpenses).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-3">Account Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Last Activity:</span>
                      <span className="font-medium dark:text-white">{profileStats.lastActivity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Account Status:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Account Type:</span>
                      <span className="font-medium dark:text-white">Personal</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
                <h4 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-3">Recent Logins</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date & Time</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">IP Address</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Device</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">April 14, 2025 - 10:23 AM</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">192.168.1.1</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Chrome on Windows</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">New York, USA</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">April 13, 2025 - 3:45 PM</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">192.168.1.1</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Safari on iPhone</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">New York, USA</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">April 12, 2025 - 9:12 AM</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">192.168.1.1</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Firefox on MacOS</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">New York, USA</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
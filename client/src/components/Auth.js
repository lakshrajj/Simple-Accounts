import { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { authApi } from '../services/api';

const Auth = ({ setIsAuthenticated }) => {
  const [showRegister, setShowRegister] = useState(false);
  
  useEffect(() => {
    // Check if user is already authenticated
    if (authApi.isLoggedIn()) {
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        {showRegister ? (
          <RegisterForm 
            setIsAuthenticated={setIsAuthenticated} 
            setShowRegister={setShowRegister} 
          />
        ) : (
          <LoginForm 
            setIsAuthenticated={setIsAuthenticated} 
            setShowRegister={setShowRegister} 
          />
        )}
      </div>
    </div>
  );
};

export default Auth;
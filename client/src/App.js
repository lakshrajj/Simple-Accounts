/* eslint-disable jsx-a11y/anchor-is-valid */

// App.js - Main Application Component
import { useState, useEffect } from 'react';
import AccountingDashboard from './components/AccountingDashboard';
import UserProfile from './components/UserProfile';
import MobileMenu from './components/MobileMenu';
import Favicon from './components/Favicon';
import { 
  DollarSign, 
  Settings, 
  PieChart, 
  List, 
  LogOut,
  HelpCircle,
  User,
  Menu,
  Sun,
  Moon
} from 'lucide-react';
import { authApi } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Set dark mode as default
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    }
  };

  const handleLogout = () => {
    authApi.logout();
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Favicon />
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="px-6 py-4 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">Samatva Accounts</span>
            </div>
            <button 
              onClick={toggleTheme}
              className="p-1 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div className="flex-1 px-4 py-6">
          <nav className="space-y-2">
            <button  
              onClick={() => setActiveTab('dashboard')}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'dashboard' 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              } w-full text-left`}
            >
              <PieChart className={`mr-3 h-5 w-5 ${
                activeTab === 'dashboard' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
              }`} />
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('transactions')}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'transactions' 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              } w-full text-left`}
            >
              <List className={`mr-3 h-5 w-5 ${
                activeTab === 'transactions' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
              }`} />
              Transactions
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'profile' 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              } w-full text-left`}
            >
              <User className={`mr-3 h-5 w-5 ${
                activeTab === 'profile' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
              }`} />
              My Profile
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
            >
              <Settings className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Settings
            </button>
            <button 
              onClick={() => setActiveTab('help')}
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
            >
              <HelpCircle className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Help
            </button>
          </nav>
        </div>
        <div className="px-4 py-4 border-t dark:border-gray-700">
          <button 
            onClick={handleLogout}
            className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">Samatva Accounts</span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleTheme}
              className="p-1 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button 
              className="text-gray-500 dark:text-gray-300 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        handleLogout={handleLogout}
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto pt-16 md:pt-0 dark:bg-gray-900">
        {activeTab === 'dashboard' || activeTab === 'transactions' ? (
          <AccountingDashboard activeView={activeTab} setActiveView={setActiveTab} />
        ) : activeTab === 'profile' ? (
          <UserProfile />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">Content for {activeTab} will be available soon</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
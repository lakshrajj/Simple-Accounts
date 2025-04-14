import { useState } from 'react';
import { 
  X, 
  PieChart, 
  List, 
  User, 
  Settings, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';

const MobileMenu = ({ activeTab, setActiveTab, handleLogout, isOpen, setIsOpen }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}></div>
      )}
      
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out shadow-lg`}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
          <button className="text-gray-500 focus:outline-none" onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="py-4">
          <nav className="px-2 space-y-1">
            <button  
              onClick={() => {
                setActiveTab('dashboard');
                setIsOpen(false);
              }}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'dashboard' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'
              } w-full text-left`}
            >
              <PieChart className={`mr-3 h-5 w-5 ${
                activeTab === 'dashboard' ? 'text-blue-600' : 'text-gray-500'
              }`} />
              Dashboard
            </button>
            <button 
              onClick={() => {
                setActiveTab('transactions');
                setIsOpen(false);
              }}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'transactions' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'
              } w-full text-left`}
            >
              <List className={`mr-3 h-5 w-5 ${
                activeTab === 'transactions' ? 'text-blue-600' : 'text-gray-500'
              }`} />
              Transactions
            </button>
            <button 
              onClick={() => {
                setActiveTab('profile');
                setIsOpen(false);
              }}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'profile' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'
              } w-full text-left`}
            >
              <User className={`mr-3 h-5 w-5 ${
                activeTab === 'profile' ? 'text-blue-600' : 'text-gray-500'
              }`} />
              My Profile
            </button>
            <button 
              onClick={() => {
                setActiveTab('settings');
                setIsOpen(false);
              }}
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <Settings className="mr-3 h-5 w-5 text-gray-500" />
              Settings
            </button>
            <button 
              onClick={() => {
                setActiveTab('help');
                setIsOpen(false);
              }}
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <HelpCircle className="mr-3 h-5 w-5 text-gray-500" />
              Help
            </button>
          </nav>
        </div>
        
        <div className="border-t px-4 py-4 absolute bottom-0 w-full">
          <button 
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-500" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  ChevronDown, Plus, Search, Calendar, Filter, 
  DollarSign, TrendingUp, TrendingDown, ArrowRight,
  Pencil, Trash2, FileImage, ImageIcon, Upload, FileText, XCircle, AlertCircle
} from 'lucide-react';
import { transactionApi, uploadApi } from '../services/api';

// Mock data for initial display
const initialTransactions = [
  { id: 1, type: 'income', amount: 3500, category: 'Salary', from: 'Acme Corp', date: '2025-04-01', note: 'Monthly salary' },
  { id: 2, type: 'expense', amount: 1200, category: 'Rent', to: 'Property Management', date: '2025-04-03', note: 'April rent' },
  { id: 3, type: 'expense', amount: 85, category: 'Utilities', to: 'Power Company', date: '2025-04-05', note: 'Electricity bill' },
  { id: 4, type: 'expense', amount: 120, category: 'Groceries', to: 'Supermarket', date: '2025-04-07', note: '' },
  { id: 5, type: 'income', amount: 500, category: 'Freelance', from: 'Client XYZ', date: '2025-04-10', note: 'Website design' },
  { id: 6, type: 'expense', amount: 55, category: 'Dining', to: 'Restaurant', date: '2025-04-12', note: 'Dinner with friends' },
  { id: 7, type: 'expense', amount: 200, category: 'Shopping', to: 'Department Store', date: '2025-04-15', note: 'New clothes' },
  { id: 8, type: 'expense', amount: 35, category: 'Transportation', to: 'Fuel Station', date: '2025-04-18', note: 'Gas' },
  { id: 9, type: 'income', amount: 150, category: 'Interest', from: 'Bank', date: '2025-04-20', note: 'Savings interest' },
  { id: 10, type: 'expense', amount: 80, category: 'Entertainment', to: 'Cinema', date: '2025-04-22', note: 'Movie tickets' },
];

// Categories with colors
const categories = {
  'Salary': '#4CAF50',
  'Freelance': '#8BC34A',
  'Interest': '#CDDC39',
  'Rent': '#F44336',
  'Utilities': '#FF5722',
  'Groceries': '#FF9800',
  'Dining': '#FFC107',
  'Shopping': '#9C27B0',
  'Transportation': '#2196F3',
  'Entertainment': '#E91E63',
  'Other': '#607D8B'
};

// Time frame options for filtering
const timeFrameOptions = [
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: '90days', label: 'Last 90 Days' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'thisYear', label: 'This Year' },
  { value: 'custom', label: 'Custom Date Range' }
];

// Function to format currency amount in INR
const formatCurrency = (amount) => {
  return `₹${amount.toFixed(2)}`;
};

// Filter Component that can be reused in both views
const FilterSection = ({ 
  timeFrameFilter, 
  handleTimeFrameChange, 
  dateRange, 
  setDateRange, 
  categoryFilter, 
  setCategoryFilter, 
  searchTerm, 
  setSearchTerm 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="timeframe" className="form-label">Time Frame</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <select
              id="timeframe"
              value={timeFrameFilter}
              onChange={(e) => handleTimeFrameChange(e.target.value)}
              className="pl-10 form-select"
            >
              <option value="">Select Time Frame</option>
              {timeFrameOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        {timeFrameFilter === 'custom' && (
          <>
            <div>
              <label htmlFor="date-from" className="form-label">Date From</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="date"
                  id="date-from"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  className="pl-10 form-input"
                />
              </div>
            </div>
            <div>
              <label htmlFor="date-to" className="form-label">Date To</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="date"
                  id="date-to"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  className="pl-10 form-input"
                />
              </div>
            </div>
          </>
        )}
        
        <div>
          <label htmlFor="category" className="form-label">Category</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 form-select"
            >
              <option value="">All Categories</option>
              {Object.keys(categories).map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="search" className="form-label">Search</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="pl-10 form-select"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountingDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    category: '',
    customCategory: '',
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [isImportingCSV, setIsImportingCSV] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [csvUploadResult, setCsvUploadResult] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('dashboard');
  const [timeFrameFilter, setTimeFrameFilter] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const filters = {};
        if (dateRange.from) filters.dateFrom = dateRange.from;
        if (dateRange.to) filters.dateTo = dateRange.to;
        if (categoryFilter) filters.category = categoryFilter;
        if (searchTerm) filters.search = searchTerm;

        const data = await transactionApi.getTransactions(filters);
        setTransactions(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        setError('Failed to load transactions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [dateRange, categoryFilter, searchTerm]);

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter(transaction => {
    // Date range filter
    if (dateRange.from && new Date(transaction.date) < new Date(dateRange.from)) return false;
    if (dateRange.to && new Date(transaction.date) > new Date(dateRange.to)) return false;
    
    // Category filter
    if (categoryFilter && transaction.category !== categoryFilter) return false;
    
    // Search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return transaction.category.toLowerCase().includes(searchLower) ||
             (transaction.from && transaction.from.toLowerCase().includes(searchLower)) ||
             (transaction.to && transaction.to.toLowerCase().includes(searchLower)) ||
             (transaction.note && transaction.note.toLowerCase().includes(searchLower));
    }
    
    return true;
  }).sort((a, b) => {
    // Sort transactions by the selected field
    if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else if (sortField === 'amount') {
      return sortDirection === 'asc' 
        ? a.amount - b.amount
        : b.amount - a.amount;
    } else if (sortField === 'category') {
      return sortDirection === 'asc'
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category);
    } else if (sortField === 'type') {
      return sortDirection === 'asc'
        ? a.type.localeCompare(b.type)
        : b.type.localeCompare(a.type);
    }
    return 0;
  });

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netBalance = totalIncome - totalExpenses;

  // Prepare data for charts
  const prepareExpensesByCategory = () => {
    const categoryMap = {};
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (!categoryMap[t.category]) categoryMap[t.category] = 0;
        categoryMap[t.category] += t.amount;
      });
    
    return Object.keys(categoryMap)
      .map(category => ({
        name: category,
        value: categoryMap[category],
        color: categories[category] || categories['Other']
      }))
      .sort((a, b) => b.value - a.value); // Sort by value in descending order
  };

  const prepareIncomeByCategory = () => {
    const categoryMap = {};
    filteredTransactions
      .filter(t => t.type === 'income')
      .forEach(t => {
        if (!categoryMap[t.category]) categoryMap[t.category] = 0;
        categoryMap[t.category] += t.amount;
      });
    
    return Object.keys(categoryMap)
      .map(category => ({
        name: category,
        value: categoryMap[category],
        color: categories[category] || categories['Other']
      }))
      .sort((a, b) => b.value - a.value); // Sort by value in descending order
  };

  const prepareMonthlyData = () => {
    const months = {};
    
    filteredTransactions.forEach(t => {
      const month = t.date.substring(0, 7); // Format: YYYY-MM
      if (!months[month]) {
        months[month] = { month, income: 0, expenses: 0 };
      }
      
      if (t.type === 'income') {
        months[month].income += t.amount;
      } else {
        months[month].expenses += t.amount;
      }
    });
    
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
  };

  const expensesByCategory = prepareExpensesByCategory();
  const incomeByCategory = prepareIncomeByCategory();
  const monthlyData = prepareMonthlyData();

  // Handle adding new transaction
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || '' : value
    }));
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddTransaction = async () => {
    if (!newTransaction.amount || (!newTransaction.category && !newTransaction.customCategory) || !newTransaction.date) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Use custom category if selected
    const finalCategory = isCustomCategory ? newTransaction.customCategory : newTransaction.category;

    let mediaUrl = '';
    
    // If there's a file selected, upload it first
    if (selectedFile) {
      setUploadingFile(true);
      try {
        const uploadResult = await uploadApi.uploadMedia(selectedFile);
        mediaUrl = uploadResult.file;
      } catch (error) {
        alert('Failed to upload file. Please try again.');
        setUploadingFile(false);
        return;
      } finally {
        setUploadingFile(false);
      }
    }

    try {
      // Create transaction data object
      const transactionData = {
        type: newTransaction.type,
        amount: parseFloat(newTransaction.amount),
        category: finalCategory,
        from: newTransaction.from,
        to: newTransaction.to,
        date: newTransaction.date,
        note: newTransaction.note,
        mediaUrl
      };

      // Save to database via API
      const savedTransaction = await transactionApi.createTransaction(transactionData);
      
      // Update local state with the transaction from the server (includes _id)
      setTransactions(prevTransactions => [...prevTransactions, savedTransaction]);
      
      // Reset form
      setNewTransaction({
        type: 'expense',
        amount: '',
        category: '',
        from: '',
        to: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
        mediaUrl: ''
      });
      setSelectedFile(null);
      setIsAddingTransaction(false);
    } catch (error) {
      alert(`Failed to save transaction: ${error.message}`);
      console.error('Transaction save error:', error);
    }
  };

  // Handle updating existing transaction
  const handleUpdateTransaction = async () => {
    if (!newTransaction.amount || (!newTransaction.category && !newTransaction.customCategory) || !newTransaction.date) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Use custom category if selected
    const finalCategory = isCustomCategory ? newTransaction.customCategory : newTransaction.category;

    let mediaUrl = newTransaction.mediaUrl;
    
    // If there's a new file selected, upload it first
    if (selectedFile) {
      setUploadingFile(true);
      try {
        const uploadResult = await uploadApi.uploadMedia(selectedFile);
        mediaUrl = uploadResult.file;
      } catch (error) {
        alert('Failed to upload file. Please try again.');
        setUploadingFile(false);
        return;
      } finally {
        setUploadingFile(false);
      }
    }

    try {
      // Create transaction data object
      const transactionData = {
        type: newTransaction.type,
        amount: parseFloat(newTransaction.amount),
        category: finalCategory,
        from: newTransaction.from,
        to: newTransaction.to,
        date: newTransaction.date,
        note: newTransaction.note,
        mediaUrl
      };
      
      // Update via API - using _id instead of id
      const updatedTransaction = await transactionApi.updateTransaction(newTransaction._id, transactionData);
      
      // Update local state with the updated transaction
      setTransactions(prevTransactions => 
        prevTransactions.map(t => t._id === updatedTransaction._id ? updatedTransaction : t)
      );
      
      // Reset form
      setNewTransaction({
        type: 'expense',
        amount: '',
        category: '',
        from: '',
        to: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
        mediaUrl: ''
      });
      
      setSelectedFile(null);
      setIsAddingTransaction(false);
    } catch (error) {
      alert(`Failed to update transaction: ${error.message}`);
      console.error('Transaction update error:', error);
    }
  };

  // Handle timeframe filter change
  const handleTimeFrameChange = (value) => {
    setTimeFrameFilter(value);
    
    // If custom is selected, don't modify date range - user will input manually
    if (value === 'custom') {
      return;
    }
    
    const today = new Date();
    let fromDate = new Date();
    let toDate = new Date();
    
    switch(value) {
      case '7days':
        fromDate.setDate(today.getDate() - 7);
        break;
      case '30days':
        fromDate.setDate(today.getDate() - 30);
        break;
      case '90days':
        fromDate.setDate(today.getDate() - 90);
        break;
      case 'thisMonth':
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        toDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'lastMonth':
        fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        toDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'thisYear':
        fromDate = new Date(today.getFullYear(), 0, 1);
        toDate = new Date(today.getFullYear(), 11, 31);
        break;
      default:
        // Clear the date range
        setDateRange({ from: '', to: '' });
        return;
    }
    
    setDateRange({
      from: fromDate.toISOString().split('T')[0],
      to: toDate.toISOString().split('T')[0]
    });
  };

  
  // Handle CSV file selection
  const handleCsvFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
      setCsvUploadResult(null); // Reset result when new file selected
    }
  };
  
  // Handle CSV import
  const handleImportCSV = async () => {
    if (!csvFile) {
      alert('Please select a CSV file to import');
      return;
    }
    
    setImportLoading(true);
    
    try {
      const result = await transactionApi.importFromCSV(csvFile);
      setCsvUploadResult(result);
      
      // If transactions were successfully imported, update the list
      if (result.transactions && result.transactions.length > 0) {
        // Refresh transaction list from the server
        const refreshedData = await transactionApi.getTransactions();
        setTransactions(refreshedData);
      }
    } catch (error) {
      console.error('CSV import error:', error);
      setCsvUploadResult({
        message: 'Import failed',
        error: error.response?.data?.message || error.message,
        errors: error.response?.data?.errors
      });
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">SimpleAccounts</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsImportingCSV(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Upload className="mr-2 h-4 w-4" /> Import CSV
              </button>
              <button
                onClick={() => setIsAddingTransaction(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Transaction
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Toggle */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex shadow-sm rounded-md">
            <button
              type="button"
              onClick={() => setActiveView('dashboard')}
              className={`${
                activeView === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
              } px-4 py-2 text-sm font-medium rounded-l-md border border-gray-300 dark:border-gray-600 focus:z-10 focus:outline-none`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => setActiveView('transactions')}
              className={`${
                activeView === 'transactions'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
              } px-4 py-2 text-sm font-medium rounded-r-md border border-gray-300 dark:border-gray-600 focus:z-10 focus:outline-none`}
            >
              Transactions
            </button>
          </div>
        </div>

        {/* Filter Section - Now appears in both views */}
        <FilterSection 
          timeFrameFilter={timeFrameFilter}
          handleTimeFrameChange={handleTimeFrameChange}
          dateRange={dateRange}
          setDateRange={setDateRange}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {activeView === 'dashboard' ? (
          <div>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-full p-4">
                      <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Income</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(totalIncome)}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">{filteredTransactions.filter(t => t.type === 'income').length}</span> income transactions
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-red-100 dark:bg-red-900 rounded-full p-4">
                      <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Expenses</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(totalExpenses)}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">{filteredTransactions.filter(t => t.type === 'expense').length}</span> expense transactions
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${netBalance >= 0 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-yellow-100 dark:bg-yellow-900'} rounded-full p-4`}>
                      <DollarSign className={`h-6 w-6 ${netBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Net Balance</dt>
                        <dd className="flex items-baseline">
                          <div className={`text-2xl font-semibold ${netBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                            {formatCurrency(netBalance)}
                          </div>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            {netBalance >= 0 ? '👍 Surplus' : '👎 Deficit'}
                          </span>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Savings rate: <span className="font-medium">{totalIncome > 0 ? `${Math.round((totalIncome - totalExpenses) / totalIncome * 100)}%` : '0%'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Monthly Cash Flow */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Monthly Cash Flow</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.5} />
                      <XAxis dataKey="month" stroke="#9CA3AF" tickFormatter={(month) => {
                        const date = new Date(month);
                        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                      }} />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value) => [
                          formatCurrency(value),
                          'Amount (₹)'
                        ]}
                        labelFormatter={(label) => {
                          const date = new Date(label);
                          return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ paddingTop: '10px' }}
                        iconType="circle"
                      />
                      <Bar dataKey="income" fill="#4CAF50" name="Income" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" fill="#F44336" name="Expenses" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Expense Breakdown</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expensesByCategory}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          innerRadius={30}
                          paddingAngle={2}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          strokeWidth={1}
                          stroke="#FFFFFF"
                        >
                          {expensesByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => formatCurrency(value)} 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {expensesByCategory.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      {expensesByCategory.slice(0, 6).map((category, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                          <span className="truncate">{category.name}: {formatCurrency(category.value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Income Sources</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={incomeByCategory}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          innerRadius={30}
                          paddingAngle={2}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          strokeWidth={1}
                          stroke="#FFFFFF"
                        >
                          {incomeByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => formatCurrency(value)} 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {incomeByCategory.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      {incomeByCategory.slice(0, 6).map((category, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                          <span className="truncate">{category.name}: {formatCurrency(category.value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Transactions Table */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => {
                        if (sortField === 'date') {
                          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortField('date');
                          setSortDirection('desc');
                        }
                      }}
                    >
                      Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => {
                        if (sortField === 'type') {
                          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortField('type');
                          setSortDirection('asc');
                        }
                      }}
                    >
                      Type {sortField === 'type' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => {
                        if (sortField === 'category') {
                          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortField('category');
                          setSortDirection('asc');
                        }
                      }}
                    >
                      Category {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">From/To</th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => {
                        if (sortField === 'amount') {
                          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortField('amount');
                          setSortDirection('desc');
                        }
                      }}
                    >
                      Amount {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Note</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Media</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{transaction.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {transaction.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{transaction.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {transaction.type === 'income' ? transaction.from : transaction.to}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        transaction.type === 'income' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{transaction.note}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {transaction.mediaUrl && (
                          <a 
                            href={transaction.mediaUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <ImageIcon className="h-5 w-5" />
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => {
                            setNewTransaction({
                              id: transaction.id,
                              type: transaction.type,
                              amount: transaction.amount,
                              category: transaction.category,
                              from: transaction.from || '',
                              to: transaction.to || '',
                              date: transaction.date,
                              note: transaction.note || '',
                              mediaUrl: transaction.mediaUrl || ''
                            });
                            setIsAddingTransaction(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this transaction?')) {
                              try {
                                // Call API to delete from database
                                await transactionApi.deleteTransaction(transaction._id);
                                // Update state with removed transaction
                                setTransactions(transactions.filter(t => t._id !== transaction._id));
                              } catch (error) {
                                alert(`Failed to delete transaction: ${error.message}`);
                                console.error('Transaction delete error:', error);
                              }
                            }
                          }}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* CSV Import Modal */}
      {isImportingCSV && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-blue-500" />
                      Import Transactions from CSV
                    </h3>
                    
                    {!csvUploadResult && (
                      <div className="mb-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Upload a CSV file with transaction data. The CSV file must include the following columns:
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded mb-4">
                          <code className="text-xs font-mono block mb-2">type,amount,category,from,to,date,note</code>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Example: <code>income,5000,Salary,ABC Company,,2025-04-01,Monthly salary</code>
                          </p>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Select CSV File
                          </label>
                          <div className="mt-1 flex items-center">
                            <input
                              type="file"
                              id="csv-file"
                              accept=".csv"
                              onChange={handleCsvFileChange}
                              className="sr-only"
                            />
                            <label
                              htmlFor="csv-file"
                              className="relative cursor-pointer bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                            >
                              <span>Choose file</span>
                            </label>
                            <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                              {csvFile ? csvFile.name : 'No file selected'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {csvUploadResult && (
                      <div className={`rounded-md p-4 ${
                        csvUploadResult.error 
                          ? 'bg-red-50 dark:bg-red-900/20' 
                          : 'bg-green-50 dark:bg-green-900/20'
                      } mb-4`}>
                        <div className="flex">
                          <div className="flex-shrink-0">
                            {csvUploadResult.error 
                              ? <AlertCircle className="h-5 w-5 text-red-400" /> 
                              : <div className="h-5 w-5 text-green-400">✓</div>}
                          </div>
                          <div className="ml-3">
                            <h3 className={`text-sm font-medium ${
                              csvUploadResult.error 
                                ? 'text-red-800 dark:text-red-200' 
                                : 'text-green-800 dark:text-green-200'
                            }`}>
                              {csvUploadResult.message}
                            </h3>
                            
                            {csvUploadResult.errors && csvUploadResult.errors.length > 0 && (
                              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                                <ul className="list-disc pl-5 space-y-1">
                                  {csvUploadResult.errors.slice(0, 5).map((error, index) => (
                                    <li key={index}>Row {error.row}: {error.error}</li>
                                  ))}
                                  {csvUploadResult.errors.length > 5 && (
                                    <li>...and {csvUploadResult.errors.length - 5} more errors</li>
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {!csvUploadResult ? (
                  <>
                    <button
                      type="button"
                      onClick={handleImportCSV}
                      disabled={!csvFile || importLoading}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {importLoading ? 'Importing...' : 'Import Transactions'}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setCsvFile(null);
                      setCsvUploadResult(null);
                    }}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Upload Another File
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsImportingCSV(false);
                    setCsvFile(null);
                    setCsvUploadResult(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {isAddingTransaction && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                      {newTransaction.id ? 'Edit Transaction' : 'Add New Transaction'}
                    </h3>
                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="type"
                          value="expense"
                          checked={newTransaction.type === 'expense'}
                          onChange={handleInputChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Expense</span>
                      </label>
                      <label className="flex items-center mt-2">
                        <input
                          type="radio"
                          name="type"
                          value="income"
                          checked={newTransaction.type === 'income'}
                          onChange={handleInputChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Income</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label htmlFor="amount" className="form-label">Amount*</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                              ₹
                            </span>
                          </div>
                          <input
                            type="number"
                            name="amount"
                            id="amount"
                            value={newTransaction.amount}
                            onChange={handleInputChange}
                            className="pl-7 form-input"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="flex justify-between items-center mb-2">
                          <label htmlFor="category" className="form-label">Category*</label>
                          <div className="flex items-center">
                            <input
                              id="customCategoryToggle"
                              type="checkbox"
                              checked={isCustomCategory}
                              onChange={() => setIsCustomCategory(!isCustomCategory)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="customCategoryToggle" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                              Custom category
                            </label>
                          </div>
                        </div>
                        
                        {isCustomCategory ? (
                          <input
                            type="text"
                            id="customCategory"
                            name="customCategory"
                            value={newTransaction.customCategory}
                            onChange={handleInputChange}
                            placeholder="Enter custom category"
                            className="form-input"
                          />
                        ) : (
                          <select
                            id="category"
                            name="category"
                            value={newTransaction.category}
                            onChange={handleInputChange}
                            className="form-select"
                          >
                            <option value="">Select a category</option>
                            {Object.keys(categories).map((category) => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        )}
                      </div>
                      <div className="col-span-2">
                        <label htmlFor={newTransaction.type === 'income' ? 'from' : 'to'} className="form-label">
                          {newTransaction.type === 'income' ? 'Received From*' : 'Paid To*'}
                        </label>
                        <input
                          type="text"
                          name={newTransaction.type === 'income' ? 'from' : 'to'}
                          id={newTransaction.type === 'income' ? 'from' : 'to'}
                          value={newTransaction.type === 'income' ? newTransaction.from : newTransaction.to}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="date" className="form-label">Date*</label>
                        <input
                          type="date"
                          name="date"
                          id="date"
                          value={newTransaction.date}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="note" className="form-label">Note (Optional)</label>
                        <textarea
                          id="note"
                          name="note"
                          rows="3"
                          value={newTransaction.note}
                          onChange={handleInputChange}
                          className="form-textarea"
                        ></textarea>
                      </div>
                      
                      <div className="col-span-2">
                        <label htmlFor="media" className="form-label">
                          Attach Receipt or Document (Optional)
                        </label>
                        <div className="mt-1 flex items-center">
                          <input
                            type="file"
                            id="media"
                            name="media"
                            onChange={handleFileChange}
                            className="sr-only"
                            accept="image/png,image/jpeg,image/gif,application/pdf"
                          />
                          <label
                            htmlFor="media"
                            className="relative cursor-pointer bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                          >
                            <span>Choose file</span>
                          </label>
                          <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                            {selectedFile ? selectedFile.name : 'No file selected'}
                          </span>
                          
                          {newTransaction.mediaUrl && !selectedFile && (
                            <div className="ml-3 flex items-center">
                              <a
                                href={newTransaction.mediaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                              >
                                <FileImage className="h-5 w-5 mr-1" />
                                View Attachment
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={newTransaction.id ? handleUpdateTransaction : handleAddTransaction}
                  disabled={uploadingFile}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingFile ? 'Uploading...' : newTransaction.id ? 'Update' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingTransaction(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountingDashboard;
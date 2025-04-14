// routes/transactions.js - Transaction API Routes
const express = require('express');
const router = express.Router();
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { auth, checkEditorOrAdmin, checkAdmin } = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Helper function for INR formatting
const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Helper function to add formatted amount to transaction objects
const formatTransaction = (transaction) => {
  const t = transaction.toObject();
  t.formattedAmount = formatINR(t.amount);
  return t;
};

// Apply auth middleware to all transaction routes
router.use(auth);

// Get all transactions
router.get('/', async (req, res) => {
  try {
    let query = { user: req.user.id }; // Filter by authenticated user
    
    // Apply filters if provided
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    if (req.query.dateFrom || req.query.dateTo) {
      query.date = {};
      if (req.query.dateFrom) {
        query.date.$gte = new Date(req.query.dateFrom);
      }
      if (req.query.dateTo) {
        query.date.$lte = new Date(req.query.dateTo);
      }
    }
    // Month filter (1-12)
    else if (req.query.month) {
      const month = parseInt(req.query.month);
      const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }
    // Year filter
    else if (req.query.year) {
      const year = parseInt(req.query.year);
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { category: searchRegex },
        { from: searchRegex },
        { to: searchRegex },
        { note: searchRegex }
      ];
      // Make sure to still filter by user
      query.$and = [
        { user: req.user.id },
        { $or: query.$or }
      ];
      delete query.$or;
      delete query.user;
    }
    
    const transactions = await Transaction.find(query).sort({ date: -1 });
    
    // Format amounts in INR
    const formattedTransactions = transactions.map(formatTransaction);
    
    res.json(formattedTransactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single transaction
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ 
      _id: req.params.id,
      user: req.user.id // Ensure user can only access their own transactions
    });
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Format amount in INR
    const formattedTransaction = formatTransaction(transaction);
    
    res.json(formattedTransaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new transaction
router.post('/', async (req, res) => {
  const transaction = new Transaction({
    type: req.body.type,
    amount: req.body.amount,
    category: req.body.category,
    from: req.body.from,
    to: req.body.to,
    date: req.body.date,
    note: req.body.note,
    mediaUrl: req.body.mediaUrl,
    user: req.user.id // Set the authenticated user as the owner
  });

  try {
    const newTransaction = await transaction.save();
    
    // Format amount in INR
    const formattedTransaction = formatTransaction(newTransaction);
    
    res.status(201).json(formattedTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a transaction
router.put('/:id', async (req, res) => {
  try {
    let transaction;
    
    // Admin can update any transaction
    if (req.user.role === 'Admin') {
      transaction = await Transaction.findById(req.params.id);
    } 
    // Editors can update their own transactions
    else if (req.user.role === 'Editor') {
      transaction = await Transaction.findOne({
        _id: req.params.id,
        user: req.user.id
      });
    } 
    // Viewers can't update transactions
    else {
      return res.status(403).json({ message: 'Not authorized to update transactions' });
    }
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (req.body.type) transaction.type = req.body.type;
    if (req.body.amount) transaction.amount = req.body.amount;
    if (req.body.category) transaction.category = req.body.category;
    if (req.body.from) transaction.from = req.body.from;
    if (req.body.to) transaction.to = req.body.to;
    if (req.body.date) transaction.date = req.body.date;
    if (req.body.note !== undefined) transaction.note = req.body.note;
    if (req.body.mediaUrl !== undefined) transaction.mediaUrl = req.body.mediaUrl;

    const updatedTransaction = await transaction.save();
    
    // Format amount in INR
    const formattedTransaction = formatTransaction(updatedTransaction);
    
    res.json(formattedTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a transaction
router.delete('/:id', async (req, res) => {
  try {
    let transaction;
    
    // Admin can delete any transaction
    if (req.user.role === 'Admin') {
      transaction = await Transaction.findById(req.params.id);
    } 
    // Editors can delete their own transactions
    else if (req.user.role === 'Editor') {
      transaction = await Transaction.findOne({
        _id: req.params.id,
        user: req.user.id
      });
    } 
    // Viewers can't delete transactions
    else {
      return res.status(403).json({ message: 'Not authorized to delete transactions' });
    }
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    await transaction.deleteOne(); // Use deleteOne instead of remove which is deprecated
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get transaction summary
router.get('/summary/all', async (req, res) => {
  try {
    const dateFilter = { user: req.user.id }; // Filter by authenticated user
    
    // Handle date filtering
    if (req.query.dateFrom || req.query.dateTo) {
      dateFilter.date = {};
      if (req.query.dateFrom) {
        dateFilter.date.$gte = new Date(req.query.dateFrom);
      }
      if (req.query.dateTo) {
        dateFilter.date.$lte = new Date(req.query.dateTo);
      }
    }
    // Month filter (1-12)
    else if (req.query.month) {
      const month = parseInt(req.query.month);
      const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      dateFilter.date = { $gte: startDate, $lte: endDate };
    }
    // Year filter
    else if (req.query.year) {
      const year = parseInt(req.query.year);
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59);
      dateFilter.date = { $gte: startDate, $lte: endDate };
    }
    
    // Category filter
    if (req.query.category) {
      dateFilter.category = req.query.category;
    }

    // Calculate total income
    const incomeResult = await Transaction.aggregate([
      { $match: { type: 'income', user: req.user.id, ...dateFilter } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Calculate total expenses
    const expenseResult = await Transaction.aggregate([
      { $match: { type: 'expense', user: req.user.id, ...dateFilter } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Calculate by category
    const categoryResults = await Transaction.aggregate([
      { $match: { user: req.user.id, ...dateFilter } },
      { $group: {
          _id: { type: '$type', category: '$category' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.type': 1, 'total': -1 } }
    ]);
    
    // Calculate monthly totals
    const monthlyResults = await Transaction.aggregate([
      { $match: { user: req.user.id, ...dateFilter } },
      { $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    // Helper function for summary formatting
    const formatSummaryAmount = (amount) => {
      return {
        raw: amount,
        formatted: formatINR(amount)
      };
    };

    const summary = {
      totalIncome: formatSummaryAmount(incomeResult.length > 0 ? incomeResult[0].total : 0),
      totalExpenses: formatSummaryAmount(expenseResult.length > 0 ? expenseResult[0].total : 0),
      netBalance: formatSummaryAmount((incomeResult.length > 0 ? incomeResult[0].total : 0) - 
                                     (expenseResult.length > 0 ? expenseResult[0].total : 0)),
      byCategory: categoryResults.reduce((acc, item) => {
        const type = item._id.type;
        const category = item._id.category;
        if (!acc[type]) acc[type] = [];
        acc[type].push({ category, amount: formatSummaryAmount(item.total) });
        return acc;
      }, {}),
      monthly: monthlyResults.reduce((acc, item) => {
        const yearMonth = `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`;
        if (!acc[yearMonth]) acc[yearMonth] = { month: yearMonth, income: formatSummaryAmount(0), expenses: formatSummaryAmount(0) };
        if (item._id.type === 'income') {
          acc[yearMonth].income = formatSummaryAmount(item.total);
        } else {
          acc[yearMonth].expenses = formatSummaryAmount(item.total);
        }
        return acc;
      }, {})
    };
    
    // Convert monthly object to array for easier frontend processing
    summary.monthly = Object.values(summary.monthly).sort((a, b) => a.month.localeCompare(b.month));
    
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Set up storage for the CSV file uploads
const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/csv');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`);
  }
});

// Filter to only accept CSV files
const csvFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(csv)$/)) {
    return cb(new Error('Only CSV files are allowed!'), false);
  }
  cb(null, true);
};

const csvUpload = multer({ 
  storage: csvStorage,
  fileFilter: csvFilter
}).single('file');

// Import transactions from CSV
router.post('/import', auth, (req, res) => {
  csvUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a CSV file' });
    }

    const results = [];
    const errors = [];
    
    // Process the CSV file
    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on('data', (data) => {
        try {
          // Validate the CSV data
          if (!data.type || !data.amount || !data.category || !data.date) {
            errors.push({ row: results.length + errors.length + 1, error: 'Missing required fields' });
            return;
          }

          // Validate transaction type
          if (data.type !== 'income' && data.type !== 'expense') {
            errors.push({ 
              row: results.length + errors.length + 1, 
              error: 'Invalid transaction type. Must be "income" or "expense"'
            });
            return;
          }

          // Validate amount
          const amount = parseFloat(data.amount);
          if (isNaN(amount) || amount <= 0) {
            errors.push({ 
              row: results.length + errors.length + 1, 
              error: 'Invalid amount. Must be a positive number'
            });
            return;
          }

          // Validate date
          const date = new Date(data.date);
          if (isNaN(date.getTime())) {
            errors.push({ 
              row: results.length + errors.length + 1, 
              error: 'Invalid date format. Use YYYY-MM-DD format'
            });
            return;
          }

          // For income transactions, 'from' field is required
          if (data.type === 'income' && !data.from) {
            errors.push({ 
              row: results.length + errors.length + 1, 
              error: 'From field is required for income transactions'
            });
            return;
          }

          // For expense transactions, 'to' field is required
          if (data.type === 'expense' && !data.to) {
            errors.push({ 
              row: results.length + errors.length + 1, 
              error: 'To field is required for expense transactions'
            });
            return;
          }

          // Create transaction object
          results.push({
            type: data.type,
            amount: amount,
            category: data.category,
            from: data.from || '', 
            to: data.to || '',
            date: date,
            note: data.note || '',
            mediaUrl: data.mediaUrl || '',
            user: req.user.id
          });
        } catch (error) {
          errors.push({ 
            row: results.length + errors.length + 1, 
            error: `Processing error: ${error.message}`
          });
        }
      })
      .on('end', async () => {
        try {
          // Delete the CSV file after processing
          fs.unlinkSync(req.file.path);
          
          if (results.length === 0) {
            return res.status(400).json({ 
              message: 'No valid transactions found in the CSV file',
              errors
            });
          }

          // Save all valid transactions to the database
          const savedTransactions = await Transaction.insertMany(results);
          
          res.status(200).json({
            message: `Successfully imported ${savedTransactions.length} transactions`,
            transactions: savedTransactions.map(formatTransaction),
            errors: errors.length > 0 ? errors : undefined
          });
        } catch (error) {
          res.status(500).json({ 
            message: 'Error saving transactions to database', 
            error: error.message,
            errors
          });
        }
      });
  });
});

module.exports = router;
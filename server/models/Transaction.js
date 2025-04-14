const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense']
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: function() { return this.type === 'income'; }
  },
  to: {
    type: String,
    required: function() { return this.type === 'expense'; }
  },
  date: {
    type: Date,
    required: true
  },
  note: {
    type: String
  },
  mediaUrl: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
import { useState, useEffect, useCallback } from 'react';
import { transactionApi } from '../services/api';

export const useTransactions = (initialFilters = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    byCategory: { income: [], expense: [] },
    monthly: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  // Fetch transactions based on filters
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await transactionApi.getTransactions(filters);
      setTransactions(data);
    } catch (err) {
      setError('Failed to fetch transactions. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch summary data
  const fetchSummary = useCallback(async () => {
    try {
      const data = await transactionApi.getTransactionSummary(filters);
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    }
  }, [filters]);

  // Add a new transaction
  const addTransaction = async (transaction) => {
    setLoading(true);
    try {
      await transactionApi.createTransaction(transaction);
      await fetchTransactions();
      await fetchSummary();
      return true;
    } catch (err) {
      setError('Failed to add transaction. Please try again.');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing transaction
  const updateTransaction = async (id, transaction) => {
    setLoading(true);
    try {
      await transactionApi.updateTransaction(id, transaction);
      await fetchTransactions();
      await fetchSummary();
      return true;
    } catch (err) {
      setError('Failed to update transaction. Please try again.');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete a transaction
  const deleteTransaction = async (id) => {
    setLoading(true);
    try {
      await transactionApi.deleteTransaction(id);
      await fetchTransactions();
      await fetchSummary();
      return true;
    } catch (err) {
      setError('Failed to delete transaction. Please try again.');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, [fetchTransactions, fetchSummary]);

  return {
    transactions,
    summary,
    loading,
    error,
    filters,
    updateFilters,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshData: () => {
      fetchTransactions();
      fetchSummary();
    }
  };
};
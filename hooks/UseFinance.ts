import { useState, useEffect } from "react";
import { Transaction, Goal, FinancialSummary } from "@/types/finance";
import { useFinanceStore } from "@/lib/store";

export const useFinance = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    setTransactions(storage.getTransactions());
    setGoals(storage.getGoals());
  }, []);

  const addTransaction = (transaction: Transaction) => {
    storage.addTransaction(transaction);
    setTransactions(storage.getTransactions());
  };

  const updateTransaction = (id: string, updated: Partial<Transaction>) => {
    storage.updateTransaction(id, updated);
    setTransactions(storage.getTransactions());
  };

  const deleteTransaction = (id: string) => {
    storage.deleteTransaction(id);
    setTransactions(storage.getTransactions());
  };

  const addGoal = (goal: Goal) => {
    storage.addGoal(goal);
    setGoals(storage.getGoals());
  };

  const updateGoal = (id: string, updated: Partial<Goal>) => {
    storage.updateGoal(id, updated);
    setGoals(storage.getGoals());
  };

  const deleteGoal = (id: string) => {
    storage.deleteGoal(id);
    setGoals(storage.getGoals());
  };

  const getSummary = (): FinancialSummary => {
    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      balance,
      savingsRate,
    };
  };

  return {
    transactions,
    goals,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addGoal,
    updateGoal,
    deleteGoal,
    getSummary,
  };
};

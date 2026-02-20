import { create } from "zustand"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  date: string
  note: string
}

interface Goal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string
}

interface FinanceStore {
  transactions: Transaction[]
  goals: Goal[]
  isLoading: boolean
  error: string | null
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<Transaction | null>
  updateTransaction: (id: string, transaction: Omit<Transaction, "id">) => Promise<Transaction | null>
  deleteTransaction: (id: string) => Promise<boolean>
  addGoal: (goal: Omit<Goal, "id">) => Promise<Goal | null>
  updateGoal: (id: string, goal: Omit<Goal, "id">) => Promise<Goal | null>
  deleteGoal: (id: string) => Promise<boolean>
  fetchTransactions: () => Promise<void>
  fetchGoals: () => Promise<void>
  clearError: () => void
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  transactions: [],
  goals: [],
  isLoading: false,
  error: null,

  addTransaction: async (transaction) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Failed to add transaction")
      }

      const data = await response.json()
      set((state) => ({
        transactions: [...state.transactions, data],
        isLoading: false,
      }))
      return data
    } catch (error: any) {
      const errorMsg = error.message || "Failed to add transaction"
      set({ error: errorMsg, isLoading: false })
      return null
    }
  },

  updateTransaction: async (id, transaction) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Failed to update transaction")
      }

      const data = await response.json()
      set((state) => ({
        transactions: state.transactions.map((t) => (t.id === id ? data : t)),
        isLoading: false,
      }))
      return data
    } catch (error: any) {
      const errorMsg = error.message || "Failed to update transaction"
      set({ error: errorMsg, isLoading: false })
      return null
    }
  },

  deleteTransaction: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Failed to delete transaction")
      }

      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
        isLoading: false,
      }))
      return true
    } catch (error: any) {
      const errorMsg = error.message || "Failed to delete transaction"
      set({ error: errorMsg, isLoading: false })
      return false
    }
  },

  addGoal: async (goal) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: goal.title,
          target_amount: goal.targetAmount,
          current_amount: goal.currentAmount,
          deadline: goal.deadline,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Failed to add goal")
      }

      const data = await response.json()
      const formattedGoal: Goal = {
        id: data.id,
        title: data.title,
        targetAmount: data.target_amount,
        currentAmount: data.current_amount,
        deadline: data.deadline,
      }
      set((state) => ({
        goals: [...state.goals, formattedGoal],
        isLoading: false,
      }))
      return formattedGoal
    } catch (error: any) {
      const errorMsg = error.message || "Failed to add goal"
      set({ error: errorMsg, isLoading: false })
      return null
    }
  },

  updateGoal: async (id, goal) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: goal.title,
          target_amount: goal.targetAmount,
          current_amount: goal.currentAmount,
          deadline: goal.deadline,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Failed to update goal")
      }

      const data = await response.json()
      const formattedGoal: Goal = {
        id: data.id,
        title: data.title,
        targetAmount: data.target_amount,
        currentAmount: data.current_amount,
        deadline: data.deadline,
      }
      set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? formattedGoal : g)),
        isLoading: false,
      }))
      return formattedGoal
    } catch (error: any) {
      const errorMsg = error.message || "Failed to update goal"
      set({ error: errorMsg, isLoading: false })
      return null
    }
  },

  deleteGoal: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Failed to delete goal")
      }

      set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
        isLoading: false,
      }))
      return true
    } catch (error: any) {
      const errorMsg = error.message || "Failed to delete goal"
      set({ error: errorMsg, isLoading: false })
      return false
    }
  },

  fetchTransactions: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/transactions")
      if (!response.ok) throw new Error("Failed to fetch transactions")
      const data = await response.json()
      set({ transactions: data, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  fetchGoals: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/goals")
      if (!response.ok) throw new Error("Failed to fetch goals")
      const data = await response.json()
      const formattedGoals: Goal[] = data.map((g: any) => ({
        id: g.id,
        title: g.title,
        targetAmount: g.target_amount,
        currentAmount: g.current_amount,
        deadline: g.deadline,
      }))
      set({ goals: formattedGoals, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  clearError: () => set({ error: null }),
}))

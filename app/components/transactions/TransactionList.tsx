"use client"
import { Trash2, Edit2, Search, X, Filter, SortAsc, ChevronRight } from "lucide-react"
import { useState, useMemo, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/Dialog"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  date: string
  note: string
}

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
  onEdit: (transaction: Transaction) => void
}

type SortField = "date" | "category"
type SortOrder = "asc" | "desc"

const CATEGORIES = {
  income: ["Salary", "Freelance", "Investment", "Bonus", "Other"],
  expense: ["Food", "Transport", "Utilities", "Entertainment", "Shopping", "Health", "Other"],
}

export function TransactionList({ transactions, onDelete, onEdit }: TransactionListProps) {
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [sortSubMenuOpen, setSortSubMenuOpen] = useState<SortField | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null)

  const [selectedSort, setSelectedSort] = useState<null | { field: string; order?: "asc" | "desc" }>(null)
  const [selectedFilter, setSelectedFilter] = useState<"all" | "income" | "expense" | null>("all") // default "all"

  const filterDropdownRef = useRef<HTMLDivElement>(null)
  const sortDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setFilterDropdownOpen(false)
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getAvailableCategories = () => {
    if (filterType === "all") {
      return [...new Set([...CATEGORIES.income, ...CATEGORIES.expense])].sort()
    }
    return CATEGORIES[filterType].sort()
  }

  const formatCurrency = (amount: number) => {
    const currency = localStorage.getItem("currency") || "₦"
    return `${currency}${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
  }

  const processedTransactions = useMemo(() => {
    const filtered = transactions.filter((t) => {
      const typeMatch = filterType === "all" || t.type === filterType
      const categoryMatch = selectedCategory === null || t.category === selectedCategory
      let searchMatch = true
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        searchMatch =
          t.category.toLowerCase().includes(query) ||
          t.type.toLowerCase().includes(query) ||
          formatDate(t.date).includes(query) ||
          t.note.toLowerCase().includes(query)
      }
      return typeMatch && categoryMatch && searchMatch
    })

    return filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === "date") {
        aValue = new Date(a.date).getTime()
        bValue = new Date(b.date).getTime()
      } else if (sortField === "category") {
        aValue = a.category.toLowerCase()
        bValue = b.category.toLowerCase()
      }

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      return sortOrder === "asc" ? comparison : -comparison
    })
  }, [transactions, filterType, selectedCategory, sortField, sortOrder, searchQuery])

  const getBalanceBeforeTransaction = (currentTransaction: Transaction) => {
    let balance = 0
    const chronologicalTransactions = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    for (const transaction of chronologicalTransactions) {
      if (transaction.id === currentTransaction.id) break
      balance += transaction.type === "income" ? transaction.amount : -transaction.amount
    }
    return balance
  }

  const FILTER_OPTIONS = [
    { value: "all", label: "All Transactions" },
    { value: "income", label: "Income" },
    { value: "expense", label: "Expenses" },
  ] as const

  return (
    <div className="space-y-4">
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap md:flex-row gap-4 items-start md:items-center">

          {/* Search Bar */}
          <div className="relative w-full md:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by category, type, date, or note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-10 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm
                 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500
                 focus:ring-offset-2 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Filter & Sort */}
          <div className="flex justify-center flex-row gap-3 items-center">

            {/* Filter */}
            <div className="relative" ref={filterDropdownRef}>
              <button
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground
                   text-sm font-medium hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50
                   dark:hover:bg-indigo-950/20 transition-all shadow-sm w-full sm:w-auto"
              >
                <Filter size={16} />
                <span className="cursor-pointer">Filter By</span>
              </button>

              {filterDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 bg-background border border-border rounded-lg shadow-lg z-10 min-w-48 overflow-hidden">
                  {FILTER_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setFilterType(option.value)
                        setSelectedCategory(null)
                        setFilterDropdownOpen(false)
                        setSelectedFilter(option.value)
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-muted/50 cursor-pointer
                        ${selectedFilter === option.value ? "bg-indigo-50 font-semibold" : ""}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="relative" ref={sortDropdownRef}>
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground
                   text-sm font-medium hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50
                   dark:hover:bg-indigo-950/20 transition-all shadow-sm w-full sm:w-auto"
              >
                <SortAsc size={16} />
                <span className="cursor-pointer">Sort By</span>
              </button>

              {sortDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 bg-background border border-border rounded-lg shadow-lg z-10 min-w-48 overflow-hidden">

                  {/* sort by date */}
                  <button
                    onClick={() => setSortSubMenuOpen(sortSubMenuOpen === "date" ? null : "date")}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center justify-between hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    <span className={`${selectedSort?.field === "date" ? "text-indigo-600 font-semibold" : ""}`}>
                      Date
                    </span>
                    <ChevronRight size={14} className={`transition-all ${sortSubMenuOpen === "date" ? "rotate-90" : ""}`} />
                  </button>

                  {/* date dropdown */}
                  {sortSubMenuOpen === "date" && (
                    <div className="pl-4 border-l ml-2 bg-muted/20 p-2 space-y-1">
                      <button
                        onClick={() => {
                          setSortField("date")
                          setSortOrder("desc")
                          setSelectedSort({ field: "date", order: "desc" })
                          setSortDropdownOpen(false)
                          setSortSubMenuOpen(null)
                        }}
                        className={`w-full text-left px-2 py-2 text-sm rounded hover:bg-muted cursor-pointer
                          ${selectedSort?.field === "date" && selectedSort?.order === "desc" ? "bg-indigo-50 font-semibold" : ""}`}
                      >
                        Newest First
                      </button>

                      <button
                        onClick={() => {
                          setSortField("date")
                          setSortOrder("asc")
                          setSelectedSort({ field: "date", order: "asc" })
                          setSortDropdownOpen(false)
                          setSortSubMenuOpen(null)
                        }}
                        className={`w-full text-left px-2 py-2 text-sm rounded hover:bg-muted cursor-pointer
                          ${selectedSort?.field === "date" && selectedSort?.order === "asc" ? "bg-indigo-50 font-semibold" : ""}`}
                      >
                        Oldest First
                      </button>
                    </div>
                  )}

                  {/* sort by category */}
                  <button
                    onClick={() => setSortSubMenuOpen(sortSubMenuOpen === "category" ? null : "category")}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center justify-between border-t hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    <span className={`${selectedSort?.field === "category" ? "text-indigo-600 font-semibold" : ""}`}>
                      Category
                    </span>
                    <ChevronRight size={14} className={`transition-all ${sortSubMenuOpen === "category" ? "rotate-90" : ""}`} />
                  </button>

                  {/* category dropdown */}
                  {sortSubMenuOpen === "category" && (
                    <div className="pl-4 border-l ml-2 bg-muted/20 p-2 max-h-56 overflow-y-auto space-y-1">
                      {getAvailableCategories().map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat)
                            setSelectedSort({ field: "category" })
                            setSortDropdownOpen(false)
                            setSortSubMenuOpen(null)
                          }}
                          className={`w-full text-left px-2 py-2 text-sm rounded hover:bg-muted cursor-pointer
                            ${selectedSort?.field === "category" && selectedCategory === cat ? "bg-indigo-50 font-semibold" : ""}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-10 space-y-2">
          <p className="text-muted-foreground text-lg">
            No transactions yet
          </p>
          <p className="text-sm text-muted-foreground">
            Create a new transaction to get started
          </p>
        </div>
      ) : processedTransactions.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-border shadow-sm">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left py-2.5 px-4 font-semibold text-sm text-foreground">Type</th>
                <th className="text-left py-2.5 px-4 font-semibold text-sm text-foreground">Category</th>
                <th className="text-left py-2.5 px-4 font-semibold text-sm text-foreground">Amount</th>
                <th className="text-center py-2.5 px-4 font-semibold text-sm text-foreground">Date</th>
                <th className="text-right py-2.5 px-4 font-semibold text-sm text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedTransactions.map((transaction, index) => (
                <tr
                  key={transaction.id}
                  className={`border-b border-border ${index % 2 === 0 ? "bg-background" : "bg-muted/30"
                    } hover:bg-muted/50 transition-colors cursor-pointer`}
                  onClick={() => setSelectedTransaction(transaction)}
                >
                  <td className="py-2.5 px-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${transaction.type === "income"
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                        }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-sm text-foreground font-medium truncate max-w-xs">
                    {transaction.category}
                  </td>
                  <td
                    className={`py-2.5 px-4 text-sm font-semibold ${transaction.type === "income"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-orange-600 dark:text-orange-400"
                      }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="py-2.5 px-4 text-sm text-muted-foreground text-center">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <div
                      className="flex items-center justify-end gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onEdit(transaction)}
                        className="p-1.5 hover:bg-indigo-600/10 rounded-lg transition-colors text-indigo-600 dark:text-indigo-400"
                      >
                        <Edit2 size={16} className="cursor-pointer" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmation(transaction.id)}
                        className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                      >
                        <Trash2 size={16} className="cursor-pointer" />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">
          No transactions match your filters
        </p>
      )}


      <Dialog open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p
                    className={`text-sm font-semibold capitalize ${selectedTransaction.type === "income"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-orange-600 dark:text-orange-400"
                      }`}
                  >
                    {selectedTransaction.type}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="text-sm font-semibold text-foreground">{selectedTransaction.category}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Note</p>
                <p className="text-sm text-foreground">{selectedTransaction.note || "-"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="text-sm font-semibold text-foreground">{formatDate(selectedTransaction.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p
                    className={`text-sm font-semibold ${selectedTransaction.type === "income"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-orange-600 dark:text-orange-400"
                      }`}
                  >
                    {selectedTransaction.type === "income" ? "+" : "-"}
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Balance Before</p>
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(getBalanceBeforeTransaction(selectedTransaction))}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Balance After</p>
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(
                      getBalanceBeforeTransaction(selectedTransaction) +
                      (selectedTransaction.type === "income"
                        ? selectedTransaction.amount
                        : -selectedTransaction.amount),
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmation} onOpenChange={(open) => !open && setDeleteConfirmation(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-foreground">Are you sure you want to delete this transaction?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted/50 transition-colors text-foreground font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirmation) {
                    onDelete(deleteConfirmation)
                    setDeleteConfirmation(null)
                  }
                }}
                className="px-4 py-2 rounded-lg bg-destructive hover:bg-destructive/90 transition-colors text-destructive-foreground font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

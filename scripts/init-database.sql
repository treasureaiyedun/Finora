-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table (shared across users for standard categories)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accounts table (user accounts/wallets)
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  balance DECIMAL(15, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_amount DECIMAL(15, 2) NOT NULL,
  current_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
  deadline DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id),
  limit_amount DECIMAL(15, 2) NOT NULL,
  current_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
  month DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_category_id ON budgets(category_id);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for goals
CREATE POLICY "Users can view their own goals"
  ON goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
  ON goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
  ON goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
  ON goals FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for budgets
CREATE POLICY "Users can view their own budgets"
  ON budgets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budgets"
  ON budgets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets"
  ON budgets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets"
  ON budgets FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for accounts
CREATE POLICY "Users can view their own accounts"
  ON accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own accounts"
  ON accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts"
  ON accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accounts"
  ON accounts FOR DELETE
  USING (auth.uid() = user_id);

-- Insert default categories
INSERT INTO categories (name, type) VALUES
  ('Salary', 'income'),
  ('Freelance', 'income'),
  ('Investment', 'income'),
  ('Bonus', 'income'),
  ('Other', 'income'),
  ('Food', 'expense'),
  ('Transport', 'expense'),
  ('Utilities', 'expense'),
  ('Entertainment', 'expense'),
  ('Healthcare', 'expense'),
  ('Shopping', 'expense'),
  ('Other', 'expense')
ON CONFLICT DO NOTHING;

-- Seed data insertion function (insert after user creation)
CREATE OR REPLACE FUNCTION seed_user_data(p_user_id UUID)
RETURNS TABLE(accounts_created INT, transactions_created INT, goals_created INT, budgets_created INT) AS $$
DECLARE
  v_account_id UUID;
  v_food_cat_id UUID;
  v_transport_cat_id UUID;
  v_utilities_cat_id UUID;
  v_entertainment_cat_id UUID;
  v_shopping_cat_id UUID;
  v_account_count INT := 0;
  v_transaction_count INT := 0;
  v_goal_count INT := 0;
  v_budget_count INT := 0;
BEGIN
  -- Get category IDs
  SELECT id INTO v_food_cat_id FROM categories WHERE name = 'Food' AND type = 'expense';
  SELECT id INTO v_transport_cat_id FROM categories WHERE name = 'Transport' AND type = 'expense';
  SELECT id INTO v_utilities_cat_id FROM categories WHERE name = 'Utilities' AND type = 'expense';
  SELECT id INTO v_entertainment_cat_id FROM categories WHERE name = 'Entertainment' AND type = 'expense';
  SELECT id INTO v_shopping_cat_id FROM categories WHERE name = 'Shopping' AND type = 'expense';

  -- Create main account
  INSERT INTO accounts (user_id, name, balance)
  VALUES (p_user_id, 'Main Account', 49850000)
  RETURNING id INTO v_account_id;
  v_account_count := 1;

  -- Insert income transactions
  INSERT INTO transactions (user_id, type, category, amount, date, note)
  VALUES
    (p_user_id, 'income', 'Salary', 50000000, CURRENT_DATE - INTERVAL '5 days', 'Monthly Salary'),
    (p_user_id, 'income', 'Freelance', 500000, CURRENT_DATE - INTERVAL '3 days', 'Freelance Project'),
    (p_user_id, 'income', 'Bonus', 2000000, CURRENT_DATE - INTERVAL '30 days', 'Q4 Bonus');
  v_transaction_count := v_transaction_count + 3;

  -- Insert expense transactions
  INSERT INTO transactions (user_id, type, category, amount, date, note)
  VALUES
    (p_user_id, 'expense', 'Food', 50000, CURRENT_DATE - INTERVAL '1 day', 'Grocery shopping'),
    (p_user_id, 'expense', 'Food', 25000, CURRENT_DATE - INTERVAL '2 days', 'Restaurant lunch'),
    (p_user_id, 'expense', 'Transport', 100000, CURRENT_DATE - INTERVAL '4 days', 'Gas and fuel'),
    (p_user_id, 'expense', 'Utilities', 100000, CURRENT_DATE - INTERVAL '10 days', 'Electricity bill'),
    (p_user_id, 'expense', 'Entertainment', 50000, CURRENT_DATE - INTERVAL '7 days', 'Movie tickets'),
    (p_user_id, 'expense', 'Shopping', 200000, CURRENT_DATE - INTERVAL '6 days', 'New clothes'),
    (p_user_id, 'expense', 'Healthcare', 150000, CURRENT_DATE - INTERVAL '15 days', 'Doctor visit');
  v_transaction_count := v_transaction_count + 7;

  -- Insert goals
  INSERT INTO goals (user_id, title, target_amount, current_amount, deadline)
  VALUES
    (p_user_id, 'Buy a MacBook', 1800000, 200000, CURRENT_DATE + INTERVAL '180 days'),
    (p_user_id, 'Emergency Fund', 5000000, 2500000, CURRENT_DATE + INTERVAL '365 days'),
    (p_user_id, 'Vacation Fund', 2000000, 500000, CURRENT_DATE + INTERVAL '120 days');
  v_goal_count := 3;

  -- Insert budgets for current month
  INSERT INTO budgets (user_id, category_id, limit_amount, current_amount, month)
  VALUES
    (p_user_id, v_food_cat_id, 500000, 75000, DATE_TRUNC('month', CURRENT_DATE)::DATE),
    (p_user_id, v_transport_cat_id, 300000, 100000, DATE_TRUNC('month', CURRENT_DATE)::DATE),
    (p_user_id, v_entertainment_cat_id, 200000, 50000, DATE_TRUNC('month', CURRENT_DATE)::DATE),
    (p_user_id, v_shopping_cat_id, 400000, 200000, DATE_TRUNC('month', CURRENT_DATE)::DATE);
  v_budget_count := 4;

  RETURN QUERY SELECT v_account_count, v_transaction_count, v_goal_count, v_budget_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION seed_user_data(UUID) TO authenticated;

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { FAB } from './components/FAB';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Groups } from './pages/Groups';
import { GroupDetail } from './pages/GroupDetail';
import { CreateGroup } from './pages/CreateGroup';
import { AddExpense } from './pages/AddExpense';
import { Activity } from './pages/Activity';
import { Profile } from './pages/Profile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { GroupManagement } from './pages/admin/GroupManagement';

// Layout wrapper for authenticated routes
function AuthenticatedLayout() {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner" style={{ width: 40, height: 40 }} />
          <p className="text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
      <FAB />
    </div>
  );
}

// Public route guard
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Admin route guard
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();

  if (!currentUser?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Authenticated Routes */}
      <Route element={<AuthenticatedLayout />}>
        <Route path="/" element={<Dashboard />} />

        {/* Groups */}
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/new" element={<CreateGroup />} />
        <Route path="/groups/:groupId" element={<GroupDetail />} />
        <Route path="/groups/:groupId/expense/new" element={<AddExpense />} />

        {/* Activity & Profile */}
        <Route path="/activity" element={<Activity />} />
        <Route path="/profile" element={<Profile />} />

        {/* Expenses redirect */}
        <Route path="/expenses" element={<Activity />} />
        <Route path="/expenses/new" element={<Navigate to="/groups" replace />} />

        {/* Settlements redirect */}
        <Route path="/settlements/new" element={<Navigate to="/groups" replace />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/groups"
          element={
            <AdminRoute>
              <GroupManagement />
            </AdminRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

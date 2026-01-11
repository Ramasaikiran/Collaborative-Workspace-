import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Feedback from './pages/Feedback';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Timesheets from './pages/Timesheets';
import Integrations from './pages/Integrations';
import { cn } from '@/utils';

const NavLink = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname.startsWith(to);

    return (
        <Link to={to} className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            isActive
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        )}>
            {children}
        </Link>
    );
};

const ProtectedRoute = ({ children }) => {
    const { user, isLoading, logout } = useAuth();

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
    if (!user) return <Navigate to="/login" replace />;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b z-50 flex items-center px-6 justify-between shadow-sm">
                <div className="flex items-center gap-8">
                    <Link to="/dashboard" className="font-bold text-2xl text-blue-600 flex items-center gap-2">
                        CodeHustlers
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        <NavLink to="/tasks">Task Board</NavLink>
                        <NavLink to="/calendar">Calendar</NavLink>

                        <NavLink to="/feedback">Feedback</NavLink>
                        <NavLink to="/timesheets">Timesheets</NavLink>
                        <NavLink to="/integrations">Integrations</NavLink>
                    </nav>
                </div>

                <div className="flex gap-4 items-center">


                    <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                        <Link to="/profile" className="flex items-center gap-2 hover:bg-slate-100 p-1.5 rounded-full transition-colors pr-3">
                            <span className="text-sm font-medium text-slate-700 hidden lg:inline-block">Welcome, {user.full_name?.split(' ')[0]}</span>
                            {user.avatar ?
                                <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200" /> :
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                    {user.full_name?.[0]}
                                </div>
                            }
                        </Link>
                        <button
                            onClick={() => { logout(); window.location.href = '/login'; }}
                            className="text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Spacer for fixed header */}
            <div className="pt-16 flex-1">
                {children}
            </div>
        </div>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
                    <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
                    <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                    <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
                    <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                    <Route path="/timesheets" element={<ProtectedRoute><Timesheets /></ProtectedRoute>} />
                    <Route path="/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

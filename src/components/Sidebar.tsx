import { NavLink, useLocation } from 'react-router-dom';
import {
    Home, Users, Receipt, Activity, Settings,
    Shield, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './Avatar';

const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/groups', icon: Users, label: 'Groups' },
    { path: '/expenses', icon: Receipt, label: 'Expenses' },
    { path: '/activity', icon: Activity, label: 'Activity' },
];

const adminItems = [
    { path: '/admin', icon: Shield, label: 'Admin Panel' },
];

export function Sidebar() {
    const location = useLocation();
    const { currentUser, logout } = useAuth();

    if (!currentUser) return null;

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">💸</div>
                    <span className="sidebar-brand-text">Kill Bill</span>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="sidebar-nav">
                <div className="sidebar-section">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/' && location.pathname.startsWith(item.path));

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={`sidebar-link ${isActive ? 'active' : ''}`}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </div>

                {/* Admin Section */}
                {currentUser.isAdmin && (
                    <div className="sidebar-section">
                        <div className="sidebar-section-title">Admin</div>
                        {adminItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.path);

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                                >
                                    <item.icon size={20} />
                                    <span>{item.label}</span>
                                </NavLink>
                            );
                        })}
                    </div>
                )}
            </nav>

            {/* User Profile */}
            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <Avatar name={currentUser.displayName} size="md" />
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-name">{currentUser.displayName}</div>
                        <div className="sidebar-user-role">
                            {currentUser.isAdmin ? 'Administrator' : 'Member'}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: 'var(--space-3)' }}>
                    <NavLink to="/profile" className="sidebar-link">
                        <Settings size={20} />
                        <span>Settings</span>
                    </NavLink>

                    <button
                        className="sidebar-link w-full"
                        onClick={logout}
                        style={{ color: 'var(--sentiment-negative)' }}
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}

import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Users, Receipt, Activity, Settings } from 'lucide-react';

const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/groups', icon: Users, label: 'Groups' },
    { path: '/expenses', icon: Receipt, label: 'Expenses' },
    { path: '/activity', icon: Activity, label: 'Activity' },
    { path: '/profile', icon: Settings, label: 'Profile' },
];

export function BottomNav() {
    const location = useLocation();

    return (
        <nav className="bottom-nav">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path ||
                    (item.path !== '/' && location.pathname.startsWith(item.path));

                return (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                    >
                        <motion.div
                            className="nav-icon"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <item.icon size={24} />
                        </motion.div>
                        <span className="nav-label">{item.label}</span>
                        {isActive && (
                            <motion.div
                                className="nav-indicator"
                                layoutId="nav-indicator"
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 4,
                                    height: 4,
                                    borderRadius: '50%',
                                    background: 'var(--color-primary-500)',
                                }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        )}
                    </NavLink>
                );
            })}
        </nav>
    );
}

import { NavLink, useLocation } from 'react-router-dom';
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
                        <div className="nav-icon">
                            <item.icon size={24} />
                        </div>
                        <span className="nav-label">{item.label}</span>
                        {isActive && (
                            <div
                                className="nav-indicator"
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 4,
                                    height: 4,
                                    borderRadius: '50%',
                                    background: 'var(--interactive-accent)',
                                }}
                            />
                        )}
                    </NavLink>
                );
            })}
        </nav>
    );
}

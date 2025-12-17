import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    LogOut, Shield, ChevronRight, Moon, Bell,
    HelpCircle, Info, Palette, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from '../components/Header';
import { Avatar } from '../components/Avatar';

export function Profile() {
    const { currentUser, logout } = useAuth();
    const { themeStyle, themeMode, setThemeStyle, setThemeMode } = useTheme();
    const navigate = useNavigate();

    if (!currentUser) return null;

    const themeStyles = [
        {
            id: 'wise' as const,
            name: 'Wise',
            description: 'Professional banking look',
            lightColor: '#00B775',
            darkColor: '#00B775',
            lightBg: '#FFFFFF',
            darkBg: '#111827',
        },
        {
            id: 'killbill' as const,
            name: 'Kill Bill',
            description: 'Bold, cinematic design',
            lightColor: '#FFD700',
            darkColor: '#FFD700',
            lightBg: '#FFFFFF',
            darkBg: '#0D0D0D',
        },
    ];

    const settingsGroups = [
        {
            title: 'Account',
            items: [
                {
                    icon: Bell,
                    label: 'Notifications',
                    hint: 'Enabled',
                    onClick: () => { },
                },
            ],
        },
        {
            title: 'Support',
            items: [
                {
                    icon: HelpCircle,
                    label: 'Help & FAQ',
                    onClick: () => { },
                },
                {
                    icon: Info,
                    label: 'About',
                    hint: 'Version 1.0.0',
                    onClick: () => { },
                },
            ],
        },
    ];

    return (
        <div className="page-container pb-24">
            <PageHeader title="Profile" />

            {/* User Card */}
            <motion.div
                className="card flex items-center gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Avatar name={currentUser.displayName} size="xl" />
                <div className="flex-1">
                    <h2 className="text-xl font-bold">{currentUser.displayName}</h2>
                    <p className="text-secondary">@{currentUser.username}</p>
                    {currentUser.isAdmin && (
                        <span className="admin-badge mt-2">
                            <Shield size={12} />
                            Admin
                        </span>
                    )}
                </div>
            </motion.div>

            {/* Theme Switcher */}
            <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h3 className="text-sm font-semibold text-secondary mb-2 px-1">
                    Theme Style
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {themeStyles.map((style) => {
                        const isSelected = themeStyle === style.id;
                        const currentColor = themeMode === 'light' ? style.lightColor : style.darkColor;
                        const currentBg = themeMode === 'light' ? style.lightBg : style.darkBg;

                        return (
                            <motion.button
                                key={style.id}
                                className={`card p-4 text-left transition-all ${isSelected
                                    ? 'border-2'
                                    : 'border-2 border-transparent'
                                    }`}
                                style={{
                                    borderColor: isSelected ? currentColor : undefined,
                                }}
                                onClick={() => setThemeStyle(style.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div
                                        className="w-10 h-10 rounded-lg border-2 flex items-center justify-center"
                                        style={{
                                            backgroundColor: currentBg,
                                            borderColor: currentColor,
                                        }}
                                    >
                                        {isSelected ? (
                                            <Check size={20} style={{ color: currentColor }} />
                                        ) : (
                                            <Palette size={20} style={{ color: currentColor }} />
                                        )}
                                    </div>
                                </div>
                                <div className="font-heading font-semibold text-base mb-1 uppercase tracking-wide">
                                    {style.name}
                                </div>
                                <div className="text-xs text-secondary">
                                    {style.description}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Light/Dark Mode Toggle */}
                <h3 className="text-sm font-semibold text-secondary mb-2 px-1">
                    Color Mode
                </h3>
                <div className="settings-list">
                    <button
                        className="settings-item w-full"
                        onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
                    >
                        <div className="settings-item-icon">
                            <Moon size={20} />
                        </div>
                        <div className="settings-item-content">
                            <div className="settings-item-label">
                                {themeMode === 'light' ? 'Light Mode' : 'Dark Mode'}
                            </div>
                            <div className="settings-item-hint">
                                {themeMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                            </div>
                        </div>
                        <div
                            className="flex items-center justify-center w-12 h-6 rounded-full transition-colors"
                            style={{
                                backgroundColor: themeMode === 'dark' ? 'var(--interactive-primary)' : 'var(--border-subtle)',
                            }}
                        >
                            <motion.div
                                className="w-5 h-5 rounded-full bg-white"
                                animate={{
                                    x: themeMode === 'dark' ? 12 : -12,
                                }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        </div>
                    </button>
                </div>
            </motion.div>

            {/* Admin Panel Link */}
            {currentUser.isAdmin && (
                <motion.div
                    className="settings-list mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <button
                        className="settings-item w-full"
                        onClick={() => navigate('/admin')}
                    >
                        <div
                            className="settings-item-icon"
                            style={{ background: 'var(--color-warning-light)', color: 'var(--color-warning)' }}
                        >
                            <Shield size={20} />
                        </div>
                        <div className="settings-item-content">
                            <div className="settings-item-label">Admin Panel</div>
                            <div className="settings-item-hint">Manage users and groups</div>
                        </div>
                        <ChevronRight size={20} className="settings-item-arrow" />
                    </button>
                </motion.div>
            )}

            {/* Settings Groups */}
            {settingsGroups.map((group, groupIndex) => (
                <motion.div
                    key={group.title}
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (groupIndex + 3) }}
                >
                    <h3 className="text-sm font-semibold text-secondary mb-2 px-1">
                        {group.title}
                    </h3>
                    <div className="settings-list">
                        {group.items.map((item) => (
                            <button
                                key={item.label}
                                className="settings-item w-full"
                                onClick={item.onClick}
                            >
                                <div className="settings-item-icon">
                                    <item.icon size={20} />
                                </div>
                                <div className="settings-item-content">
                                    <div className="settings-item-label">{item.label}</div>
                                    {item.hint && (
                                        <div className="settings-item-hint">{item.hint}</div>
                                    )}
                                </div>
                                <ChevronRight size={20} className="settings-item-arrow" />
                            </button>
                        ))}
                    </div>
                </motion.div>
            ))}

            {/* Logout */}
            <motion.button
                className="btn btn-danger btn-block mt-8"
                onClick={logout}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <LogOut size={18} />
                Sign Out
            </motion.button>
        </div>
    );
}

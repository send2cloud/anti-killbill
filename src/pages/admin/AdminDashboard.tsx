import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Layers, TrendingUp, ArrowRight } from 'lucide-react';
import { db } from '../../lib/db';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/Header';

export function AdminDashboard() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const { data } = db.useQuery({
        users: {},
        groups: {},
        expenses: {},
    });

    if (!currentUser?.isAdmin) {
        return (
            <div className="min-h-screen">
                <Header title="Access Denied" showBack />
                <div className="page-container text-center">
                    <p className="text-secondary">You don't have admin privileges.</p>
                </div>
            </div>
        );
    }

    const stats = [
        {
            icon: Users,
            label: 'Total Users',
            value: data?.users?.length || 0,
            color: 'var(--color-primary-500)',
            bgColor: 'var(--color-primary-100)',
        },
        {
            icon: Layers,
            label: 'Total Groups',
            value: data?.groups?.length || 0,
            color: 'var(--color-info)',
            bgColor: 'var(--color-info-light)',
        },
        {
            icon: TrendingUp,
            label: 'Total Expenses',
            value: data?.expenses?.length || 0,
            color: 'var(--color-success)',
            bgColor: 'var(--color-success-light)',
        },
    ];

    const adminLinks = [
        {
            title: 'User Management',
            description: 'Create, edit and delete users',
            icon: Users,
            path: '/admin/users',
        },
        {
            title: 'Group Management',
            description: 'View and manage all groups',
            icon: Layers,
            path: '/admin/groups',
        },
    ];

    return (
        <div className="min-h-screen pb-24">
            <Header title="Admin Panel" showBack />

            <div className="page-container">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="card text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div
                                className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center"
                                style={{ background: stat.bgColor, color: stat.color }}
                            >
                                <stat.icon size={20} />
                            </div>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="text-xs text-secondary">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Admin Links */}
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="flex flex-col gap-3">
                    {adminLinks.map((link, index) => (
                        <motion.button
                            key={link.path}
                            className="card flex items-center gap-4 text-left w-full"
                            onClick={() => navigate(link.path)}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{
                                    background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))',
                                    color: 'white',
                                }}
                            >
                                <link.icon size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold">{link.title}</div>
                                <div className="text-sm text-secondary">{link.description}</div>
                            </div>
                            <ArrowRight size={20} className="text-tertiary" />
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
}

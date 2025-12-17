import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

interface HeaderProps {
    title: string;
    showBack?: boolean;
    actions?: ReactNode;
    transparent?: boolean;
}

export function Header({ title, showBack = false, actions, transparent = false }: HeaderProps) {
    const navigate = useNavigate();

    return (
        <header
            className="header"
            style={transparent ? {
                background: 'transparent',
                backdropFilter: 'none',
                borderBottom: 'none'
            } : undefined}
        >
            {showBack && (
                <motion.button
                    className="header-back"
                    onClick={() => navigate(-1)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ArrowLeft size={24} />
                </motion.button>
            )}

            <motion.h1
                className="header-title"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                {title}
            </motion.h1>

            <div className="header-actions">
                {actions}
            </div>
        </header>
    );
}

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
    return (
        <div className="flex items-end justify-between mb-6">
            <div>
                <motion.h1
                    className="text-2xl font-bold"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    {title}
                </motion.h1>
                {subtitle && (
                    <motion.p
                        className="text-secondary mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>
            {action && (
                <motion.button
                    className="btn btn-primary btn-sm"
                    onClick={action.onClick}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {action.label}
                </motion.button>
            )}
        </div>
    );
}

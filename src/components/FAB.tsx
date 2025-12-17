import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Receipt, CreditCard, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FABAction {
    icon: React.ElementType;
    label: string;
    onClick: () => void;
}

export function FAB() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const actions: FABAction[] = [
        {
            icon: Receipt,
            label: 'Add Expense',
            onClick: () => {
                setIsOpen(false);
                navigate('/expenses/new');
            },
        },
        {
            icon: CreditCard,
            label: 'Record Payment',
            onClick: () => {
                setIsOpen(false);
                navigate('/settlements/new');
            },
        },
        {
            icon: Users,
            label: 'Create Group',
            onClick: () => {
                setIsOpen(false);
                navigate('/groups/new');
            },
        },
    ];

    return (
        <>
            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fab-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            <div className="fab-container">
                <AnimatePresence>
                    {isOpen && (
                        <div className="fab-menu">
                            {actions.map((action, index) => (
                                <motion.button
                                    key={action.label}
                                    className="fab-menu-item"
                                    initial={{ opacity: 0, x: 20, scale: 0.8 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 20, scale: 0.8 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={action.onClick}
                                >
                                    <div className="fab-menu-item-icon">
                                        <action.icon size={20} />
                                    </div>
                                    <span className="fab-menu-item-label">
                                        {action.label}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    )}
                </AnimatePresence>

                <motion.button
                    className="fab"
                    onClick={() => setIsOpen(!isOpen)}
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Plus size={24} />
                </motion.button>
            </div>
        </>
    );
}

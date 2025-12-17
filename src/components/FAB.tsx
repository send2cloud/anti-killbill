import { useState } from 'react';
import { Plus, Receipt, CreditCard, Users } from 'lucide-react';
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
            {isOpen && (
                <div
                    className="fab-backdrop"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div className="fab-container">
                {isOpen && (
                    <div className="fab-menu">
                        {actions.map((action) => (
                            <button
                                key={action.label}
                                className="fab-menu-item"
                                onClick={action.onClick}
                            >
                                <div className="fab-menu-item-icon">
                                    <action.icon size={20} />
                                </div>
                                <span className="fab-menu-item-label">
                                    {action.label}
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                <button
                    className={`fab ${isOpen ? 'fab-open' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Plus size={24} className={isOpen ? 'fab-icon-rotated' : ''} />
                </button>
            </div>
        </>
    );
}

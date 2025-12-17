import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatRelativeDate } from '../utils/formatters';
import { getCategoryById } from '../utils/calculations';

interface ExpenseCardProps {
    id: string;
    description: string;
    amount: number;
    category: string;
    paidByName: string;
    currency: string;
    date: number;
    yourShare?: number;
    groupId?: string;
}

export function ExpenseCard({
    id,
    description,
    amount,
    category,
    paidByName,
    currency,
    date,
    yourShare,
    groupId,
}: ExpenseCardProps) {
    const navigate = useNavigate();
    const categoryInfo = getCategoryById(category);

    const handleClick = () => {
        if (groupId) {
            navigate(`/groups/${groupId}/expenses/${id}`);
        } else {
            navigate(`/expenses/${id}`);
        }
    };

    return (
        <div
            className="expense-card cursor-pointer"
            onClick={handleClick}
        >
            <div
                className="expense-icon"
                style={{ background: categoryInfo.color }}
            >
                <categoryInfo.icon size={20} />
            </div>

            <div className="expense-info">
                <div className="expense-description truncate">{description}</div>
                <div className="expense-meta">
                    <span>{paidByName} paid</span>
                    <span>•</span>
                    <span>{formatRelativeDate(date)}</span>
                </div>
            </div>

            <div className="expense-amount">
                <div className="expense-total">{formatCurrency(amount, currency)}</div>
                {yourShare !== undefined && yourShare !== 0 && (
                    <div
                        className={`expense-share ${yourShare > 0 ? 'text-owed' : 'text-owe'}`}
                    >
                        {yourShare > 0 ? 'you lent ' : 'you borrowed '}
                        {formatCurrency(Math.abs(yourShare), currency)}
                    </div>
                )}
            </div>
        </div>
    );
}

interface ExpenseCardSkeletonProps {
    count?: number;
}

export function ExpenseCardSkeleton({ count = 5 }: ExpenseCardSkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="expense-card" style={{ cursor: 'default' }}>
                    <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)' }} />
                    <div className="expense-info" style={{ gap: 'var(--space-2)' }}>
                        <div className="skeleton skeleton-text" style={{ width: '70%' }} />
                        <div className="skeleton skeleton-text-sm" style={{ width: '50%' }} />
                    </div>
                    <div className="skeleton" style={{ width: 70, height: 40 }} />
                </div>
            ))}
        </>
    );
}

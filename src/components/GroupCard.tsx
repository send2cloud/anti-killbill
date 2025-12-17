import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { AvatarGroup } from './Avatar';
import { formatCurrency } from '../utils/formatters';

interface GroupCardProps {
    id: string;
    name: string;
    memberNames: string[];
    balance: number;
    currency: string;
}

export function GroupCard({
    id,
    name,
    memberNames,
    balance,
    currency,
}: GroupCardProps) {
    const navigate = useNavigate();

    return (
        <div
            className="group-card"
            onClick={() => navigate(`/groups/${id}`)}
        >
            <div className="group-info">
                <div className="group-name">{name}</div>
                <div className="group-meta">
                    <AvatarGroup names={memberNames} max={3} size="sm" />
                    <span>{memberNames.length} members</span>
                </div>
            </div>

            <div className="group-balance">
                <div
                    className={`font-semibold ${balance > 0 ? 'text-owed' : balance < 0 ? 'text-owe' : 'text-tertiary'
                        }`}
                >
                    {balance > 0 ? '+' : ''}{formatCurrency(balance, currency)}
                </div>
                <div className="text-xs text-tertiary mt-1">
                    {balance > 0 ? 'you are owed' : balance < 0 ? 'you owe' : 'settled up'}
                </div>
            </div>

            <ChevronRight size={20} className="text-tertiary" />
        </div>
    );
}

interface GroupCardSkeletonProps {
    count?: number;
}

export function GroupCardSkeleton({ count = 3 }: GroupCardSkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="group-card" style={{ cursor: 'default' }}>
                    <div className="skeleton" style={{ width: 56, height: 56, borderRadius: 'var(--radius-xl)' }} />
                    <div className="group-info" style={{ gap: 'var(--space-2)' }}>
                        <div className="skeleton skeleton-text" style={{ width: '60%' }} />
                        <div className="skeleton skeleton-text-sm" style={{ width: '40%' }} />
                    </div>
                    <div className="skeleton" style={{ width: 60, height: 32 }} />
                </div>
            ))}
        </>
    );
}

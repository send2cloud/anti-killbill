import { motion } from 'framer-motion';
import { db } from '../lib/db';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/Header';
import { ExpenseCard, ExpenseCardSkeleton } from '../components/ExpenseCard';
import { Receipt } from 'lucide-react';

export function Activity() {
    const { currentUser } = useAuth();

    const { data, isLoading } = db.useQuery({
        groups: {
            members: {},
            expenses: {
                paidBy: {},
                splitWith: {},
            },
        },
    });

    if (!currentUser) return null;

    // Get user's groups
    const userGroups = data?.groups?.filter((group) =>
        group.members?.some((m) => m.id === currentUser.id)
    ) || [];

    // Get all expenses from user's groups, sorted by date
    const allExpenses = userGroups
        .flatMap((group) =>
            (group.expenses || []).map((exp) => ({
                ...exp,
                groupId: group.id,
                groupName: group.name,
                currency: group.currency || 'USD',
            }))
        )
        .sort((a, b) => b.createdAt - a.createdAt);

    // Group by date
    const expensesByDate = allExpenses.reduce((acc, expense) => {
        const date = new Date(expense.date).toDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(expense);
        return acc;
    }, {} as Record<string, typeof allExpenses>);

    return (
        <div className="page-container pb-24">
            <PageHeader
                title="Activity"
                subtitle={`${allExpenses.length} expenses`}
            />

            {isLoading ? (
                <ExpenseCardSkeleton count={6} />
            ) : allExpenses.length === 0 ? (
                <motion.div
                    className="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="empty-state-icon">
                        <Receipt size={32} />
                    </div>
                    <h3 className="empty-state-title">No activity yet</h3>
                    <p className="empty-state-description">
                        Expenses from your groups will appear here
                    </p>
                </motion.div>
            ) : (
                Object.entries(expensesByDate).map(([date, expenses]) => (
                    <div key={date} className="mb-6">
                        <h3 className="text-sm font-semibold text-secondary mb-3">
                            {date === new Date().toDateString()
                                ? 'Today'
                                : date === new Date(Date.now() - 86400000).toDateString()
                                    ? 'Yesterday'
                                    : date}
                        </h3>
                        <div className="flex flex-col gap-2">
                            {expenses.map((expense, index) => (
                                <ExpenseCard
                                    key={expense.id}
                                    id={expense.id}
                                    description={expense.description}
                                    amount={expense.amount}
                                    category={expense.category}
                                    paidByName={expense.paidBy?.displayName || 'Unknown'}
                                    currency={expense.currency}
                                    date={expense.date}
                                    groupId={expense.groupId}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

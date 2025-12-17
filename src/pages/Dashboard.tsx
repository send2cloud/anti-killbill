import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/Header';
import { GroupCard, GroupCardSkeleton } from '../components/GroupCard';
import { ExpenseCard, ExpenseCardSkeleton } from '../components/ExpenseCard';
import { formatCurrency } from '../utils/formatters';
import { calculateGroupBalances } from '../utils/calculations';

export function Dashboard() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // Query user's groups with expenses
    const { data, isLoading } = db.useQuery({
        groups: {
            members: {},
            expenses: {
                paidBy: {},
                splitWith: {},
            },
            settlements: {
                fromUser: {},
                toUser: {},
            },
        },
    });

    if (!currentUser) return null;

    // Filter groups the user is a member of
    const userGroups = data?.groups?.filter((group) =>
        group.members?.some((m) => m.id === currentUser.id)
    ) || [];

    // Calculate total balances across all groups
    let totalOwed = 0;
    let totalOwe = 0;

    const groupsWithBalances = userGroups.map((group) => {
        const balances = calculateGroupBalances(
            group.expenses || [],
            group.settlements || [],
            group.members || []
        );
        const userBalance = balances[currentUser.id] || 0;

        if (userBalance > 0) totalOwed += userBalance;
        else totalOwe += Math.abs(userBalance);

        return {
            ...group,
            userBalance,
        };
    });

    // Get recent expenses across all groups
    const recentExpenses = userGroups
        .flatMap((group) =>
            (group.expenses || []).map((exp) => ({
                ...exp,
                groupId: group.id,
                currency: group.currency,
            }))
        )
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5);

    const netBalance = totalOwed - totalOwe;

    return (
        <div className="page-container pb-24">
            <PageHeader
                title={`Hi, ${currentUser.displayName.split(' ')[0]} 👋`}
                subtitle="Here's your expense summary"
            />

            {/* Balance Overview */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-2 text-sm text-secondary mb-2">
                        <TrendingUp size={16} className="text-owed" />
                        <span>You are owed</span>
                    </div>
                    <div className="text-2xl font-bold text-owed">
                        {formatCurrency(totalOwed)}
                    </div>
                </motion.div>

                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center gap-2 text-sm text-secondary mb-2">
                        <TrendingDown size={16} className="text-owe" />
                        <span>You owe</span>
                    </div>
                    <div className="text-2xl font-bold text-owe">
                        {formatCurrency(totalOwe)}
                    </div>
                </motion.div>
            </div>

            {/* Net Balance Card */}
            <motion.div
                className="balance-card mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="balance-label">Net Balance</div>
                <div className="balance-amount">
                    {netBalance >= 0 ? '+' : ''}{formatCurrency(netBalance)}
                </div>
                <div className="balance-detail">
                    {netBalance > 0
                        ? "You're in the green! 🎉"
                        : netBalance < 0
                            ? "Time to settle up some debts"
                            : "All settled up! Perfect balance"}
                </div>
            </motion.div>

            {/* Your Groups */}
            <div className="section-header">
                <h2 className="section-title flex items-center gap-2">
                    <Users size={20} />
                    Your Groups
                </h2>
                <button
                    className="section-action flex items-center gap-1"
                    onClick={() => navigate('/groups')}
                >
                    See all <ArrowRight size={14} />
                </button>
            </div>

            <div className="flex flex-col gap-3 mb-6">
                {isLoading ? (
                    <GroupCardSkeleton count={2} />
                ) : groupsWithBalances.length === 0 ? (
                    <motion.div
                        className="empty-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="empty-state-icon">
                            <Users size={32} />
                        </div>
                        <h3 className="empty-state-title">No groups yet</h3>
                        <p className="empty-state-description">
                            Create a group to start splitting expenses with friends
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/groups/new')}
                        >
                            Create Group
                        </button>
                    </motion.div>
                ) : (
                    groupsWithBalances.slice(0, 3).map((group, index) => (
                        <GroupCard
                            key={group.id}
                            id={group.id}
                            name={group.name}
                            emoji={group.emoji || '👥'}
                            memberNames={group.members?.map((m) => m.displayName) || []}
                            balance={group.userBalance}
                            currency={group.currency || 'USD'}
                            index={index}
                        />
                    ))
                )}
            </div>

            {/* Recent Activity */}
            {recentExpenses.length > 0 && (
                <>
                    <div className="section-header">
                        <h2 className="section-title">Recent Expenses</h2>
                        <button
                            className="section-action flex items-center gap-1"
                            onClick={() => navigate('/activity')}
                        >
                            See all <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-2">
                        {isLoading ? (
                            <ExpenseCardSkeleton count={3} />
                        ) : (
                            recentExpenses.map((expense, index) => (
                                <ExpenseCard
                                    key={expense.id}
                                    id={expense.id}
                                    description={expense.description}
                                    amount={expense.amount}
                                    category={expense.category}
                                    paidByName={expense.paidBy?.displayName || 'Unknown'}
                                    currency={expense.currency || 'USD'}
                                    date={expense.date}
                                    groupId={expense.groupId}
                                    index={index}
                                />
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

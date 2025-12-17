import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Settings, Users, Receipt,
    CreditCard
} from 'lucide-react';
import { db, id } from '../lib/db';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { Avatar } from '../components/Avatar';
import { ExpenseCard, ExpenseCardSkeleton } from '../components/ExpenseCard';
import { BalanceSummary, SimplifiedBalanceCard } from '../components/BalanceSummary';
import { Modal } from '../components/Modal';
import { formatCurrency } from '../utils/formatters';
import { calculateGroupBalances, simplifyDebts, getBalanceBetweenUsers } from '../utils/calculations';

type TabType = 'expenses' | 'balances' | 'members';

export function GroupDetail() {
    const { groupId } = useParams<{ groupId: string }>();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('expenses');
    const [showSettleModal, setShowSettleModal] = useState(false);
    const [settleWith, setSettleWith] = useState<{ userId: string; userName: string; amount: number } | null>(null);

    const { data, isLoading } = db.useQuery({
        groups: {
            $: { where: { id: groupId } },
            members: {},
            createdBy: {},
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

    if (!currentUser || !groupId) return null;

    const group = data?.groups?.[0];

    if (isLoading) {
        return (
            <div className="min-h-screen">
                <Header title="Loading..." showBack />
                <div className="page-container">
                    <ExpenseCardSkeleton count={5} />
                </div>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="min-h-screen">
                <Header title="Group not found" showBack />
                <div className="page-container">
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Users size={32} />
                        </div>
                        <h3 className="empty-state-title">Group not found</h3>
                        <p className="empty-state-description">
                            This group may have been deleted or you don't have access
                        </p>
                        <button className="btn btn-primary" onClick={() => navigate('/groups')}>
                            Back to Groups
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const members = group.members || [];
    const expenses = group.expenses || [];
    const settlements = group.settlements || [];
    const currency = group.currency || 'USD';

    // Calculate balances
    const balances = calculateGroupBalances(expenses, settlements, members);
    const simplifiedDebts = simplifyDebts(balances);

    // User balances for display
    const userBalances = members
        .filter((m) => m.id !== currentUser.id)
        .map((m) => ({
            userId: m.id,
            userName: m.displayName,
            amount: getBalanceBetweenUsers(currentUser.id, m.id, expenses, settlements),
        }))
        .filter((b) => Math.abs(b.amount) > 0.01);

    // Sort expenses by date
    const sortedExpenses = [...expenses].sort((a, b) => b.date - a.date);

    const handleSettleUp = (userId: string, userName: string, amount: number) => {
        setSettleWith({ userId, userName, amount });
        setShowSettleModal(true);
    };

    const confirmSettlement = async () => {
        if (!settleWith) return;

        const settlementId = id();
        await db.transact([
            db.tx.settlements[settlementId].update({
                amount: Math.abs(settleWith.amount),
                date: Date.now(),
                note: '',
                createdAt: Date.now(),
            }),
            db.tx.settlements[settlementId].link({
                fromUser: settleWith.amount < 0 ? currentUser.id : settleWith.userId,
                toUser: settleWith.amount < 0 ? settleWith.userId : currentUser.id,
                group: groupId,
            }),
        ]);

        setShowSettleModal(false);
        setSettleWith(null);
    };

    return (
        <div className="min-h-screen pb-24">
            {/* Header */}
            <Header
                title=""
                showBack
                actions={
                    <button className="btn-icon btn-ghost">
                        <Settings size={20} />
                    </button>
                }
            />

            {/* Group Info */}
            <div className="page-container pt-0">
                <motion.div
                    className="text-center mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div
                        className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl"
                        style={{
                            background: 'linear-gradient(135deg, var(--color-primary-100), var(--color-primary-200))',
                        }}
                    >
                        {group.emoji || '👥'}
                    </div>
                    <h1 className="text-2xl font-bold mb-1">{group.name}</h1>
                    <p className="text-secondary">{members.length} members</p>
                </motion.div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <motion.button
                        className="btn btn-primary flex items-center justify-center gap-2"
                        onClick={() => navigate(`/groups/${groupId}/expense/new`)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Receipt size={18} />
                        Add Expense
                    </motion.button>
                    <motion.button
                        className="btn btn-secondary flex items-center justify-center gap-2"
                        onClick={() => {
                            if (userBalances.length > 0) {
                                const debt = userBalances[0];
                                handleSettleUp(debt.userId, debt.userName, debt.amount);
                            }
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <CreditCard size={18} />
                        Settle Up
                    </motion.button>
                </div>

                {/* Tabs */}
                <div className="split-type-selector mb-6">
                    {(['expenses', 'balances', 'members'] as const).map((tab) => (
                        <button
                            key={tab}
                            className={`split-type-option ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'expenses' && (
                        <motion.div
                            key="expenses"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex flex-col gap-2"
                        >
                            {sortedExpenses.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon">
                                        <Receipt size={32} />
                                    </div>
                                    <h3 className="empty-state-title">No expenses yet</h3>
                                    <p className="empty-state-description">
                                        Add your first expense to start tracking
                                    </p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => navigate(`/groups/${groupId}/expense/new`)}
                                    >
                                        <Plus size={18} />
                                        Add Expense
                                    </button>
                                </div>
                            ) : (
                                sortedExpenses.map((expense, index) => (
                                    <ExpenseCard
                                        key={expense.id}
                                        id={expense.id}
                                        description={expense.description}
                                        amount={expense.amount}
                                        category={expense.category}
                                        paidByName={expense.paidBy?.displayName || 'Unknown'}
                                        currency={currency}
                                        date={expense.date}
                                        groupId={groupId}
                                        index={index}
                                    />
                                ))
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'balances' && (
                        <motion.div
                            key="balances"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex flex-col gap-4"
                        >
                            <BalanceSummary
                                balances={userBalances}
                                currency={currency}
                                currentUserId={currentUser.id}
                            />

                            {simplifiedDebts.length > 0 && (
                                <>
                                    <h3 className="font-semibold mt-4 mb-2">Suggested Settlements</h3>
                                    {simplifiedDebts.map((debt) => {
                                        const fromUser = members.find((m) => m.id === debt.fromUserId);
                                        const toUser = members.find((m) => m.id === debt.toUserId);
                                        if (!fromUser || !toUser) return null;

                                        const isCurrentUserInvolved =
                                            debt.fromUserId === currentUser.id || debt.toUserId === currentUser.id;

                                        return (
                                            <SimplifiedBalanceCard
                                                key={`${debt.fromUserId}-${debt.toUserId}`}
                                                fromUserName={fromUser.displayName}
                                                toUserName={toUser.displayName}
                                                amount={debt.amount}
                                                currency={currency}
                                                onSettle={
                                                    isCurrentUserInvolved
                                                        ? () => handleSettleUp(
                                                            debt.fromUserId === currentUser.id ? debt.toUserId : debt.fromUserId,
                                                            debt.fromUserId === currentUser.id ? toUser.displayName : fromUser.displayName,
                                                            debt.fromUserId === currentUser.id ? -debt.amount : debt.amount
                                                        )
                                                        : undefined
                                                }
                                            />
                                        );
                                    })}
                                </>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'members' && (
                        <motion.div
                            key="members"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex flex-col gap-2"
                        >
                            {members.map((member, index) => (
                                <motion.div
                                    key={member.id}
                                    className="card flex items-center gap-4"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Avatar name={member.displayName} size="lg" />
                                    <div className="flex-1">
                                        <div className="font-medium">{member.displayName}</div>
                                        <div className="text-sm text-secondary">@{member.username}</div>
                                    </div>
                                    {member.id === group.createdBy?.id && (
                                        <span className="chip chip-primary">Creator</span>
                                    )}
                                    {member.id === currentUser.id && (
                                        <span className="chip">You</span>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Settle Up Modal */}
            <Modal
                isOpen={showSettleModal}
                onClose={() => setShowSettleModal(false)}
                title="Settle Up"
            >
                {settleWith && (
                    <div className="flex flex-col gap-4">
                        <p className="text-secondary">
                            {settleWith.amount < 0 ? (
                                <>
                                    You owe <strong>{settleWith.userName}</strong>{' '}
                                    <strong className="text-owe">{formatCurrency(Math.abs(settleWith.amount), currency)}</strong>
                                </>
                            ) : (
                                <>
                                    <strong>{settleWith.userName}</strong> owes you{' '}
                                    <strong className="text-owed">{formatCurrency(settleWith.amount, currency)}</strong>
                                </>
                            )}
                        </p>

                        <div className="flex gap-3">
                            <button
                                className="btn btn-secondary flex-1"
                                onClick={() => setShowSettleModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary flex-1"
                                onClick={confirmSettlement}
                            >
                                Record Settlement
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

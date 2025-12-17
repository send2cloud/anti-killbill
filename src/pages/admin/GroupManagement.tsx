import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Trash2, Users, ChevronRight } from 'lucide-react';
import { db } from '../../lib/db';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/Header';
import { AvatarGroup } from '../../components/Avatar';
import { Modal } from '../../components/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';

export function GroupManagement() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const { data, isLoading } = db.useQuery({
        groups: {
            members: {},
            expenses: {},
            createdBy: {},
        },
    });

    const groups = data?.groups || [];

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

    const filteredGroups = groups.filter((group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (groupId: string) => {
        try {
            await db.transact(db.tx.groups[groupId].delete());
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Failed to delete group:', error);
        }
    };

    const totalExpenseAmount = (expenses: { amount: number }[]) => {
        return expenses.reduce((sum, e) => sum + e.amount, 0);
    };

    return (
        <div className="min-h-screen pb-24">
            <Header title="Group Management" showBack />

            <div className="page-container">
                {/* Search */}
                <motion.div
                    className="relative mb-6"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Search
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-tertiary"
                    />
                    <input
                        type="text"
                        className="form-input pl-12"
                        placeholder="Search groups..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="card mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm text-secondary">Total Groups</div>
                            <div className="text-2xl font-bold">{groups.length}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-secondary">Total Expenses</div>
                            <div className="text-2xl font-bold">
                                {formatCurrency(
                                    groups.reduce((sum, g) => sum + totalExpenseAmount(g.expenses || []), 0)
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Groups List */}
                <div className="flex flex-col gap-3">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="card flex items-center gap-4">
                                <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)' }} />
                                <div className="flex-1">
                                    <div className="skeleton skeleton-text mb-2" style={{ width: '60%' }} />
                                    <div className="skeleton skeleton-text-sm" style={{ width: '40%' }} />
                                </div>
                            </div>
                        ))
                    ) : filteredGroups.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <Users size={32} />
                            </div>
                            <h3 className="empty-state-title">
                                {searchQuery ? 'No groups found' : 'No groups yet'}
                            </h3>
                        </div>
                    ) : (
                        filteredGroups.map((group, index) => (
                            <motion.div
                                key={group.id}
                                className="card"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className="flex items-center gap-4 mb-3">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                        style={{
                                            background: 'linear-gradient(135deg, var(--color-primary-100), var(--color-primary-200))',
                                        }}
                                    >
                                        {group.emoji || '👥'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold truncate">{group.name}</div>
                                        <div className="text-sm text-secondary">
                                            Created {formatDate(group.createdAt)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: 'var(--border-light)' }}>
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <div className="text-xs text-secondary">Members</div>
                                            <AvatarGroup
                                                names={(group.members || []).map((m) => m.displayName)}
                                                max={4}
                                                size="sm"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-xs text-secondary">Total</div>
                                            <div className="font-semibold">
                                                {formatCurrency(totalExpenseAmount(group.expenses || []), group.currency || 'USD')}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => navigate(`/groups/${group.id}`)}
                                        >
                                            View
                                            <ChevronRight size={16} />
                                        </button>
                                        <button
                                            className="btn-icon btn-ghost btn-icon-sm"
                                            style={{ color: 'var(--color-error)' }}
                                            onClick={() => setDeleteConfirm(group.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title="Delete Group?"
            >
                <p className="text-secondary mb-6">
                    This will permanently delete the group and all its expenses.
                    This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button
                        className="btn btn-secondary flex-1"
                        onClick={() => setDeleteConfirm(null)}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-danger flex-1"
                        onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                    >
                        Delete Group
                    </button>
                </div>
            </Modal>
        </div>
    );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Users } from 'lucide-react';
import { db } from '../lib/db';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/Header';
import { GroupCard, GroupCardSkeleton } from '../components/GroupCard';
import { calculateGroupBalances } from '../utils/calculations';

export function Groups() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

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

    // Calculate balances and apply search filter
    const groupsWithBalances = userGroups
        .map((group) => {
            const balances = calculateGroupBalances(
                group.expenses || [],
                group.settlements || [],
                group.members || []
            );
            return {
                ...group,
                userBalance: balances[currentUser.id] || 0,
            };
        })
        .filter((group) =>
            group.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => b.createdAt - a.createdAt);

    return (
        <div className="page-container pb-24">
            <PageHeader
                title="Groups"
                subtitle={`${userGroups.length} groups`}
                action={{
                    label: 'New Group',
                    onClick: () => navigate('/groups/new'),
                }}
            />

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

            {/* Groups List */}
            <div className="flex flex-col gap-3">
                {isLoading ? (
                    <GroupCardSkeleton count={4} />
                ) : groupsWithBalances.length === 0 ? (
                    <motion.div
                        className="empty-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="empty-state-icon">
                            <Users size={32} />
                        </div>
                        <h3 className="empty-state-title">
                            {searchQuery ? 'No groups found' : 'No groups yet'}
                        </h3>
                        <p className="empty-state-description">
                            {searchQuery
                                ? 'Try a different search term'
                                : 'Create a group to start splitting expenses with friends'}
                        </p>
                        {!searchQuery && (
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/groups/new')}
                            >
                                <Plus size={20} />
                                Create Group
                            </button>
                        )}
                    </motion.div>
                ) : (
                    groupsWithBalances.map((group) => (
                        <GroupCard
                            key={group.id}
                            id={group.id}
                            name={group.name}
                            memberNames={group.members?.map((m) => m.displayName) || []}
                            balance={group.userBalance}
                            currency={group.currency || 'USD'}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

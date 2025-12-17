import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db, id } from '../lib/db';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { Avatar } from '../components/Avatar';
import { Check } from 'lucide-react';

const GROUP_EMOJIS = ['✈️', '🏠', '🎉', '🍔', '🚗', '💼', '🎮', '🏖️', '🎬', '🛒', '⚽', '🎵'];

const CURRENCIES = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
];

export function CreateGroup() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [emoji, setEmoji] = useState('👥');
    const [currency, setCurrency] = useState('USD');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Query all users to select members
    const { data } = db.useQuery({ users: {} });
    const allUsers = data?.users || [];

    // Filter out current user from selection (they'll be added automatically)
    const selectableUsers = allUsers.filter((u) => u.id !== currentUser?.id);

    if (!currentUser) return null;

    const toggleMember = (userId: string) => {
        setSelectedMembers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const groupId = id();
            const memberIds = [currentUser.id, ...selectedMembers];

            await db.transact([
                db.tx.groups[groupId].update({
                    name: name.trim(),
                    description: description.trim(),
                    emoji,
                    currency,
                    createdAt: Date.now(),
                }),
                db.tx.groups[groupId].link({ createdBy: currentUser.id }),
                ...memberIds.map((memberId) =>
                    db.tx.groups[groupId].link({ members: memberId })
                ),
            ]);

            navigate(`/groups/${groupId}`);
        } catch (error) {
            console.error('Failed to create group:', error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pb-24">
            <Header title="Create Group" showBack />

            <form className="page-container" onSubmit={handleSubmit}>
                {/* Emoji Selector */}
                <motion.div
                    className="text-center mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div
                        className="w-24 h-24 rounded-2xl mx-auto mb-4 flex items-center justify-center text-5xl cursor-pointer"
                        style={{
                            background: 'linear-gradient(135deg, var(--color-primary-100), var(--color-primary-200))',
                        }}
                    >
                        {emoji}
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {GROUP_EMOJIS.map((e) => (
                            <button
                                key={e}
                                type="button"
                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${emoji === e
                                        ? 'bg-primary-100 ring-2 ring-primary-500'
                                        : 'bg-tertiary hover:bg-border-medium'
                                    }`}
                                onClick={() => setEmoji(e)}
                            >
                                {e}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Group Name */}
                <motion.div
                    className="form-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <label className="form-label">Group Name *</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., Trip to Paris"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </motion.div>

                {/* Description */}
                <motion.div
                    className="form-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <label className="form-label">Description</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="What's this group for?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </motion.div>

                {/* Currency */}
                <motion.div
                    className="form-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <label className="form-label">Currency</label>
                    <div className="select-wrapper">
                        <select
                            className="select"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            {CURRENCIES.map((c) => (
                                <option key={c.code} value={c.code}>
                                    {c.symbol} {c.code} - {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </motion.div>

                {/* Members */}
                <motion.div
                    className="form-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                >
                    <label className="form-label">
                        Members ({selectedMembers.length + 1} selected)
                    </label>

                    {/* Current User (always included) */}
                    <div className="user-selector-item selected mb-2">
                        <Avatar name={currentUser.displayName} size="md" />
                        <div className="flex-1">
                            <div className="font-medium">{currentUser.displayName}</div>
                            <div className="text-sm text-secondary">@{currentUser.username}</div>
                        </div>
                        <span className="chip chip-primary">You</span>
                    </div>

                    {/* Selectable Members */}
                    <div className="flex flex-col gap-2">
                        {selectableUsers.map((user) => {
                            const isSelected = selectedMembers.includes(user.id);
                            return (
                                <motion.div
                                    key={user.id}
                                    className={`user-selector-item ${isSelected ? 'selected' : ''}`}
                                    onClick={() => toggleMember(user.id)}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <Avatar name={user.displayName} size="md" />
                                    <div className="flex-1">
                                        <div className="font-medium">{user.displayName}</div>
                                        <div className="text-sm text-secondary">@{user.username}</div>
                                    </div>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center"
                                        >
                                            <Check size={14} className="text-inverse" />
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}

                        {selectableUsers.length === 0 && (
                            <div className="text-center text-secondary py-4">
                                No other users available. Ask admin to create more users.
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    className="btn btn-primary btn-lg btn-block mt-6"
                    disabled={!name.trim() || isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isSubmitting ? (
                        <div className="spinner" style={{ width: 20, height: 20 }} />
                    ) : (
                        'Create Group'
                    )}
                </motion.button>
            </form>
        </div>
    );
}

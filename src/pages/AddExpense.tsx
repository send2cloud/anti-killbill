import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { db, id } from '../lib/db';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { Avatar } from '../components/Avatar';
import { EXPENSE_CATEGORIES } from '../utils/calculations';
import { getCurrencySymbol } from '../utils/formatters';

type SplitType = 'equal' | 'exact' | 'percentage';

export function AddExpense() {
    const { groupId } = useParams<{ groupId: string }>();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('other');
    const [paidById, setPaidById] = useState(currentUser?.id || '');
    const [splitType, setSplitType] = useState<SplitType>('equal');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [splitDetails, setSplitDetails] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Query group data
    const { data, isLoading } = db.useQuery({
        groups: {
            $: { where: { id: groupId } },
            members: {},
        },
    });

    const group = data?.groups?.[0];
    const members = group?.members || [];
    const currency = group?.currency || 'USD';

    // Initialize selected members with all group members when data loads
    useEffect(() => {
        if (members.length > 0 && selectedMembers.length === 0) {
            setSelectedMembers(members.map((m) => m.id));
        }
    }, [members]);

    if (!currentUser || !groupId) return null;

    const toggleMember = (userId: string) => {
        setSelectedMembers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSplitDetailChange = (userId: string, value: string) => {
        setSplitDetails((prev) => ({
            ...prev,
            [userId]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim() || !amount || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const expenseId = id();
            const numAmount = parseFloat(amount);

            // Calculate split details based on type
            let finalSplitDetails: Record<string, number> = {};

            if (splitType === 'equal') {
                const splitAmount = numAmount / selectedMembers.length;
                selectedMembers.forEach((memberId) => {
                    finalSplitDetails[memberId] = Math.round(splitAmount * 100) / 100;
                });
            } else if (splitType === 'exact') {
                Object.entries(splitDetails).forEach(([userId, val]) => {
                    if (selectedMembers.includes(userId)) {
                        finalSplitDetails[userId] = parseFloat(val) || 0;
                    }
                });
            } else if (splitType === 'percentage') {
                Object.entries(splitDetails).forEach(([userId, val]) => {
                    if (selectedMembers.includes(userId)) {
                        finalSplitDetails[userId] = parseFloat(val) || 0;
                    }
                });
            }

            await db.transact([
                db.tx.expenses[expenseId].update({
                    description: description.trim(),
                    amount: numAmount,
                    category,
                    splitType,
                    splitDetails: finalSplitDetails,
                    date: Date.now(),
                    createdAt: Date.now(),
                }),
                db.tx.expenses[expenseId].link({ group: groupId }),
                db.tx.expenses[expenseId].link({ paidBy: paidById }),
                ...selectedMembers.map((memberId) =>
                    db.tx.expenses[expenseId].link({ splitWith: memberId })
                ),
            ]);

            navigate(`/groups/${groupId}`);
        } catch (error) {
            console.error('Failed to add expense:', error);
            setIsSubmitting(false);
        }
    };

    if (isLoading || !group) {
        return (
            <div className="min-h-screen">
                <Header title="Add Expense" showBack />
                <div className="page-container flex items-center justify-center">
                    <div className="spinner" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24">
            <Header title="Add Expense" showBack />

            <form className="page-container" onSubmit={handleSubmit}>
                {/* Amount Input */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="text-sm text-secondary mb-2">Amount</div>
                    <div className="amount-input-wrapper">
                        <span className="amount-currency">{getCurrencySymbol(currency)}</span>
                        <input
                            type="number"
                            className="amount-input"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>
                </motion.div>

                {/* Description */}
                <motion.div
                    className="form-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <label className="form-label">Description *</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="What was this for?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </motion.div>

                {/* Category */}
                <motion.div
                    className="form-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <label className="form-label">Category</label>
                    <div className="flex flex-wrap gap-2">
                        {EXPENSE_CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                className={`chip cursor-pointer ${category === cat.id ? 'chip-primary' : ''
                                    }`}
                                onClick={() => setCategory(cat.id)}
                            >
                                <cat.icon size={16} />
                                <span>{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Paid By */}
                <motion.div
                    className="form-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <label className="form-label">Paid by</label>
                    <div className="flex flex-wrap gap-2">
                        {members.map((member) => (
                            <button
                                key={member.id}
                                type="button"
                                className={`user-selector-item ${paidById === member.id ? 'selected' : ''
                                    }`}
                                style={{ padding: 'var(--space-2) var(--space-3)' }}
                                onClick={() => setPaidById(member.id)}
                            >
                                <Avatar name={member.displayName} size="sm" />
                                <span className="font-medium">{member.displayName}</span>
                                {member.id === currentUser.id && (
                                    <span className="text-xs text-secondary">(you)</span>
                                )}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Split Type */}
                <motion.div
                    className="form-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                >
                    <label className="form-label">Split type</label>
                    <div className="split-type-selector">
                        {(['equal', 'exact', 'percentage'] as const).map((type) => (
                            <button
                                key={type}
                                type="button"
                                className={`split-type-option ${splitType === type ? 'active' : ''}`}
                                onClick={() => setSplitType(type)}
                            >
                                {type === 'equal' ? 'Equal' : type === 'exact' ? 'Exact' : '%'}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Split With */}
                <motion.div
                    className="form-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <label className="form-label">Split with</label>
                    <div className="flex flex-col gap-2">
                        {members.map((member) => {
                            const isSelected = selectedMembers.includes(member.id);
                            const splitAmount = amount && isSelected && splitType === 'equal'
                                ? (parseFloat(amount) / selectedMembers.length).toFixed(2)
                                : '';

                            return (
                                <div
                                    key={member.id}
                                    className={`user-selector-item ${isSelected ? 'selected' : ''}`}
                                    onClick={() => toggleMember(member.id)}
                                >
                                    <Avatar name={member.displayName} size="md" />
                                    <div className="flex-1">
                                        <div className="font-medium">{member.displayName}</div>
                                        {splitType === 'equal' && isSelected && splitAmount && (
                                            <div className="text-sm text-secondary">
                                                {getCurrencySymbol(currency)}{splitAmount}
                                            </div>
                                        )}
                                    </div>

                                    {splitType !== 'equal' && isSelected && (
                                        <input
                                            type="number"
                                            className="form-input"
                                            style={{ width: 80, padding: 'var(--space-2)' }}
                                            placeholder={splitType === 'percentage' ? '%' : '0.00'}
                                            value={splitDetails[member.id] || ''}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                handleSplitDetailChange(member.id, e.target.value);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            step={splitType === 'percentage' ? '1' : '0.01'}
                                            min="0"
                                        />
                                    )}

                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center shrink-0"
                                        >
                                            <Check size={14} className="text-inverse" />
                                        </motion.div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    className="btn btn-primary btn-lg btn-block mt-6"
                    disabled={!description.trim() || !amount || selectedMembers.length === 0 || isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isSubmitting ? (
                        <div className="spinner" style={{ width: 20, height: 20 }} />
                    ) : (
                        'Add Expense'
                    )}
                </motion.button>
            </form>
        </div>
    );
}

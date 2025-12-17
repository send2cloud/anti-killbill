import type { User, Expense, Settlement } from '../lib/db';

interface SplitResult {
    userId: string;
    amount: number;
}

/**
 * Calculate split amounts based on split type
 */
export function calculateSplit(
    totalAmount: number,
    splitType: 'equal' | 'exact' | 'percentage',
    splitDetails: Record<string, number>,
    participants: string[]
): SplitResult[] {
    switch (splitType) {
        case 'equal':
            return calculateEqualSplit(totalAmount, participants);
        case 'exact':
            return calculateExactSplit(splitDetails);
        case 'percentage':
            return calculatePercentageSplit(totalAmount, splitDetails);
        default:
            return calculateEqualSplit(totalAmount, participants);
    }
}

/**
 * Split equally among all participants
 */
function calculateEqualSplit(totalAmount: number, participants: string[]): SplitResult[] {
    const perPerson = totalAmount / participants.length;
    return participants.map((userId) => ({
        userId,
        amount: Math.round(perPerson * 100) / 100,
    }));
}

/**
 * Use exact amounts specified
 */
function calculateExactSplit(splitDetails: Record<string, number>): SplitResult[] {
    return Object.entries(splitDetails).map(([userId, amount]) => ({
        userId,
        amount,
    }));
}

/**
 * Calculate amounts based on percentages
 */
function calculatePercentageSplit(
    totalAmount: number,
    splitDetails: Record<string, number>
): SplitResult[] {
    return Object.entries(splitDetails).map(([userId, percentage]) => ({
        userId,
        amount: Math.round((totalAmount * percentage / 100) * 100) / 100,
    }));
}

interface BalanceEntry {
    fromUserId: string;
    toUserId: string;
    amount: number;
}

interface UserBalance {
    [userId: string]: number;
}

/**
 * Calculate balances between users in a group
 * Positive means user is owed money, negative means user owes money
 */
export function calculateGroupBalances(
    expenses: (Expense & { paidBy?: User; splitWith?: User[] })[],
    settlements: (Settlement & { fromUser?: User; toUser?: User })[],
    members: User[]
): UserBalance {
    const balances: UserBalance = {};

    // Initialize all members with 0 balance
    members.forEach((member) => {
        balances[member.id] = 0;
    });

    // Process expenses
    expenses.forEach((expense) => {
        const paidById = expense.paidBy?.id;
        if (!paidById) return;

        const participantIds = expense.splitWith?.map((u) => u.id) || [];
        const splitType = expense.splitType as 'equal' | 'exact' | 'percentage';
        const splitDetails = (expense.splitDetails || {}) as Record<string, number>;

        const splits = calculateSplit(
            expense.amount,
            splitType,
            splitDetails,
            participantIds
        );

        // The payer is owed money by others
        splits.forEach((split) => {
            if (split.userId !== paidById) {
                // Payer is owed this amount
                balances[paidById] = (balances[paidById] || 0) + split.amount;
                // This user owes the payer
                balances[split.userId] = (balances[split.userId] || 0) - split.amount;
            }
        });
    });

    // Process settlements
    settlements.forEach((settlement) => {
        const fromId = settlement.fromUser?.id;
        const toId = settlement.toUser?.id;
        if (!fromId || !toId) return;

        // fromUser paid toUser, so fromUser is now owed less / owes less
        balances[fromId] = (balances[fromId] || 0) + settlement.amount;
        balances[toId] = (balances[toId] || 0) - settlement.amount;
    });

    return balances;
}

/**
 * Simplify debts - find minimum transactions needed to settle all debts
 */
export function simplifyDebts(balances: UserBalance): BalanceEntry[] {
    const transactions: BalanceEntry[] = [];

    // Separate into creditors and debtors
    const creditors: { userId: string; amount: number }[] = [];
    const debtors: { userId: string; amount: number }[] = [];

    Object.entries(balances).forEach(([userId, amount]) => {
        if (amount > 0.01) {
            creditors.push({ userId, amount });
        } else if (amount < -0.01) {
            debtors.push({ userId, amount: Math.abs(amount) });
        }
    });

    // Sort by amount descending
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    // Match debtors with creditors
    let creditIndex = 0;
    let debtIndex = 0;

    while (creditIndex < creditors.length && debtIndex < debtors.length) {
        const creditor = creditors[creditIndex];
        const debtor = debtors[debtIndex];

        const amount = Math.min(creditor.amount, debtor.amount);

        if (amount > 0.01) {
            transactions.push({
                fromUserId: debtor.userId,
                toUserId: creditor.userId,
                amount: Math.round(amount * 100) / 100,
            });
        }

        creditor.amount -= amount;
        debtor.amount -= amount;

        if (creditor.amount < 0.01) creditIndex++;
        if (debtor.amount < 0.01) debtIndex++;
    }

    return transactions;
}

/**
 * Get balance between two specific users
 */
export function getBalanceBetweenUsers(
    userId1: string,
    userId2: string,
    expenses: (Expense & { paidBy?: User; splitWith?: User[] })[],
    settlements: (Settlement & { fromUser?: User; toUser?: User })[]
): number {
    let balance = 0;

    // Expenses where user1 paid and user2 was involved
    expenses.forEach((expense) => {
        const paidById = expense.paidBy?.id;
        const participantIds = expense.splitWith?.map((u) => u.id) || [];

        if (!participantIds.includes(userId1) && !participantIds.includes(userId2)) return;

        const splitType = expense.splitType as 'equal' | 'exact' | 'percentage';
        const splitDetails = (expense.splitDetails || {}) as Record<string, number>;
        const splits = calculateSplit(expense.amount, splitType, splitDetails, participantIds);

        if (paidById === userId1) {
            // User1 paid, find what user2 owes
            const user2Split = splits.find((s) => s.userId === userId2);
            if (user2Split) {
                balance += user2Split.amount;
            }
        } else if (paidById === userId2) {
            // User2 paid, find what user1 owes
            const user1Split = splits.find((s) => s.userId === userId1);
            if (user1Split) {
                balance -= user1Split.amount;
            }
        }
    });

    // Settlements between users
    settlements.forEach((settlement) => {
        const fromId = settlement.fromUser?.id;
        const toId = settlement.toUser?.id;

        if (fromId === userId1 && toId === userId2) {
            // User1 paid user2
            balance -= settlement.amount;
        } else if (fromId === userId2 && toId === userId1) {
            // User2 paid user1
            balance += settlement.amount;
        }
    });

    return Math.round(balance * 100) / 100;
}

/**
 * Category definitions with icons and colors
 */
export const EXPENSE_CATEGORIES = [
    { id: 'food', label: 'Food & Drinks', emoji: '🍔', color: '#fef3c7' },
    { id: 'transport', label: 'Transport', emoji: '🚗', color: '#dbeafe' },
    { id: 'accommodation', label: 'Accommodation', emoji: '🏨', color: '#fce7f3' },
    { id: 'entertainment', label: 'Entertainment', emoji: '🎬', color: '#e9d5ff' },
    { id: 'shopping', label: 'Shopping', emoji: '🛍️', color: '#d1fae5' },
    { id: 'utilities', label: 'Utilities', emoji: '💡', color: '#e0e7ff' },
    { id: 'other', label: 'Other', emoji: '📦', color: '#f3f4f6' },
] as const;

export function getCategoryById(categoryId: string) {
    return EXPENSE_CATEGORIES.find((c) => c.id === categoryId) || EXPENSE_CATEGORIES[6];
}

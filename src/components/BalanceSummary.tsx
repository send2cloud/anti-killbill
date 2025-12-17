import { motion } from 'framer-motion';
import { Avatar } from './Avatar';
import { formatCurrency } from '../utils/formatters';

interface BalanceItem {
    userId: string;
    userName: string;
    amount: number;
}

interface BalanceSummaryProps {
    balances: BalanceItem[];
    currency: string;
    currentUserId?: string; // Reserved for future use
}

export function BalanceSummary({ balances, currency }: BalanceSummaryProps) {
    const totalOwed = balances
        .filter((b) => b.amount > 0)
        .reduce((sum, b) => sum + b.amount, 0);

    const totalOwe = balances
        .filter((b) => b.amount < 0)
        .reduce((sum, b) => sum + Math.abs(b.amount), 0);

    const netBalance = totalOwed - totalOwe;

    return (
        <div className="flex flex-col gap-4">
            {/* Summary Card */}
            <motion.div
                className="balance-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="balance-label">Your balance</div>
                <div className="balance-amount">
                    {netBalance >= 0 ? '+' : ''}{formatCurrency(netBalance, currency)}
                </div>
                <div className="balance-detail flex gap-6 mt-4">
                    <div>
                        <span style={{ opacity: 0.7 }}>You are owed</span>
                        <div className="font-semibold">{formatCurrency(totalOwed, currency)}</div>
                    </div>
                    <div>
                        <span style={{ opacity: 0.7 }}>You owe</span>
                        <div className="font-semibold">{formatCurrency(totalOwe, currency)}</div>
                    </div>
                </div>
            </motion.div>

            {/* Balance List */}
            <div className="card">
                {balances.length === 0 ? (
                    <div className="text-center text-secondary py-4">
                        All settled up! 🎉
                    </div>
                ) : (
                    balances.map((balance, index) => (
                        <motion.div
                            key={balance.userId}
                            className="balance-row"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className="balance-user">
                                <Avatar name={balance.userName} size="sm" />
                                <span className="font-medium">{balance.userName}</span>
                            </div>
                            <div
                                className={`balance-amount-text ${balance.amount > 0 ? 'text-owed' : 'text-owe'
                                    }`}
                            >
                                {balance.amount > 0 ? (
                                    <>owes you {formatCurrency(balance.amount, currency)}</>
                                ) : (
                                    <>you owe {formatCurrency(Math.abs(balance.amount), currency)}</>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}

interface SimplifiedBalanceProps {
    fromUserName: string;
    toUserName: string;
    amount: number;
    currency: string;
    onSettle?: () => void;
}

export function SimplifiedBalanceCard({
    fromUserName,
    toUserName,
    amount,
    currency,
    onSettle,
}: SimplifiedBalanceProps) {
    return (
        <motion.div
            className="card flex items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <Avatar name={fromUserName} size="md" />
            <div className="flex-1">
                <div className="text-sm text-secondary">
                    <span className="font-medium text-primary">{fromUserName}</span> owes
                    <span className="font-medium text-primary"> {toUserName}</span>
                </div>
                <div className="text-lg font-semibold text-owe">
                    {formatCurrency(amount, currency)}
                </div>
            </div>
            {onSettle && (
                <button className="btn btn-primary btn-sm" onClick={onSettle}>
                    Settle
                </button>
            )}
        </motion.div>
    );
}

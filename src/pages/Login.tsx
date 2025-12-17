import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export function Login() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = await login(username, pin);
            if (!success) {
                setError('Invalid username or PIN');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <motion.div
                className="login-card"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
                {/* Logo */}
                <div className="login-logo">
                    <motion.div
                        className="login-logo-icon"
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 0 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                    >
                        💰
                    </motion.div>
                    <h1 className="login-title">Kill Bill</h1>
                    <p className="login-subtitle">Split expenses with friends</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <motion.input
                            type="text"
                            className="form-input"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            whileFocus={{ scale: 1.01 }}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">PIN</label>
                        <motion.input
                            type="password"
                            className="form-input"
                            placeholder="Enter your PIN"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            maxLength={6}
                            whileFocus={{ scale: 1.01 }}
                            required
                        />
                    </div>

                    {error && (
                        <motion.div
                            className="text-error text-sm mb-4"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.button
                        type="submit"
                        className="btn btn-primary btn-lg btn-block"
                        disabled={isLoading || !username || !pin}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isLoading ? (
                            <div className="spinner" style={{ width: 20, height: 20 }} />
                        ) : (
                            'Sign In'
                        )}
                    </motion.button>
                </form>

                {/* Demo hint */}
                <motion.div
                    className="text-center text-sm text-secondary mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Ask your admin to create an account for you
                </motion.div>
            </motion.div>
        </div>
    );
}

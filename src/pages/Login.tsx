import { useState } from 'react';
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
            <div className="login-card">
                {/* Logo */}
                <div className="login-logo">
                    <div className="login-logo-icon">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" rx="12" fill="var(--interactive-accent)" />
                            <path d="M14 24L22 32L34 16" stroke="var(--interactive-on-accent)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 className="login-title">Kill Bill</h1>
                    <p className="login-subtitle">Split expenses with friends</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">PIN</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Enter your PIN"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            maxLength={6}
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-error text-sm mb-4">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg btn-block"
                        disabled={isLoading || !username || !pin}
                    >
                        {isLoading ? (
                            <div className="spinner" style={{ width: 20, height: 20 }} />
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Demo hint */}
                <div className="text-center text-sm text-secondary mt-6">
                    Ask your admin to create an account for you
                </div>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Shield, Search } from 'lucide-react';
import { db, id } from '../../lib/db';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/Header';
import { Avatar } from '../../components/Avatar';
import { Modal } from '../../components/Modal';

interface UserFormData {
    username: string;
    displayName: string;
    pin: string;
    isAdmin: boolean;
}

const initialFormData: UserFormData = {
    username: '',
    displayName: '',
    pin: '',
    isAdmin: false,
};

export function UserManagement() {
    const { currentUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<string | null>(null);
    const [formData, setFormData] = useState<UserFormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const { data, isLoading } = db.useQuery({ users: {} });
    const users = data?.users || [];

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

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openCreateModal = () => {
        setEditingUser(null);
        setFormData(initialFormData);
        setShowModal(true);
    };

    const openEditModal = (user: typeof users[0]) => {
        setEditingUser(user.id);
        setFormData({
            username: user.username,
            displayName: user.displayName,
            pin: '', // Don't show existing PIN
            isAdmin: user.isAdmin,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            if (editingUser) {
                // Update existing user
                const updates: Record<string, any> = {
                    username: formData.username.trim().toLowerCase(),
                    displayName: formData.displayName.trim(),
                    isAdmin: formData.isAdmin,
                };
                if (formData.pin) {
                    updates.pin = formData.pin;
                }
                await db.transact(db.tx.users[editingUser].update(updates));
            } else {
                // Create new user
                const userId = id();
                await db.transact(
                    db.tx.users[userId].update({
                        username: formData.username.trim().toLowerCase(),
                        displayName: formData.displayName.trim(),
                        pin: formData.pin,
                        isAdmin: formData.isAdmin,
                        avatarColor: '',
                        createdAt: Date.now(),
                    })
                );
            }

            setShowModal(false);
            setFormData(initialFormData);
            setEditingUser(null);
        } catch (error) {
            console.error('Failed to save user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (userId: string) => {
        try {
            await db.transact(db.tx.users[userId].delete());
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    return (
        <div className="min-h-screen pb-24">
            <Header
                title="User Management"
                showBack
                actions={
                    <motion.button
                        className="btn btn-primary btn-sm"
                        onClick={openCreateModal}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Plus size={18} />
                        Add User
                    </motion.button>
                }
            />

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
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </motion.div>

                {/* Users List */}
                <div className="flex flex-col gap-2">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="card flex items-center gap-4">
                                <div className="skeleton skeleton-avatar" />
                                <div className="flex-1">
                                    <div className="skeleton skeleton-text mb-2" style={{ width: '60%' }} />
                                    <div className="skeleton skeleton-text-sm" style={{ width: '40%' }} />
                                </div>
                            </div>
                        ))
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center text-secondary py-8">
                            {searchQuery ? 'No users found' : 'No users yet'}
                        </div>
                    ) : (
                        filteredUsers.map((user, index) => (
                            <motion.div
                                key={user.id}
                                className="card flex items-center gap-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Avatar name={user.displayName} size="lg" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold truncate">{user.displayName}</span>
                                        {user.isAdmin && (
                                            <span className="admin-badge">
                                                <Shield size={10} />
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-secondary">@{user.username}</div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        className="btn-icon btn-ghost btn-icon-sm"
                                        onClick={() => openEditModal(user)}
                                    >
                                        <Edit size={16} />
                                    </button>
                                    {user.id !== currentUser.id && (
                                        <button
                                            className="btn-icon btn-ghost btn-icon-sm"
                                            style={{ color: 'var(--color-error)' }}
                                            onClick={() => setDeleteConfirm(user.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingUser ? 'Edit User' : 'Create User'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username *</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="e.g., johndoe"
                            value={formData.username}
                            onChange={(e) => setFormData((f) => ({ ...f, username: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Display Name *</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="e.g., John Doe"
                            value={formData.displayName}
                            onChange={(e) => setFormData((f) => ({ ...f, displayName: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            PIN {editingUser && '(leave empty to keep current)'}
                        </label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Enter 4-6 digit PIN"
                            value={formData.pin}
                            onChange={(e) => setFormData((f) => ({ ...f, pin: e.target.value }))}
                            maxLength={6}
                            required={!editingUser}
                        />
                    </div>

                    <div className="form-group">
                        <label className="checkbox-wrapper">
                            <div
                                className={`checkbox ${formData.isAdmin ? 'checked' : ''}`}
                                onClick={() => setFormData((f) => ({ ...f, isAdmin: !f.isAdmin }))}
                            >
                                {formData.isAdmin && <Shield size={12} className="text-inverse" />}
                            </div>
                            <span className="checkbox-label">Admin privileges</span>
                        </label>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            className="btn btn-secondary flex-1"
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex-1"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <div className="spinner" style={{ width: 20, height: 20 }} />
                            ) : editingUser ? (
                                'Save Changes'
                            ) : (
                                'Create User'
                            )}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title="Delete User?"
            >
                <p className="text-secondary mb-6">
                    This action cannot be undone. All data associated with this user will be
                    permanently deleted.
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
                        Delete
                    </button>
                </div>
            </Modal>
        </div>
    );
}

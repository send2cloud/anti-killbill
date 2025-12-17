import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Mobile: Bottom Sheet */}
                    <motion.div
                        className="modal bottom-sheet hide-desktop"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div className="bottom-sheet-handle" />
                        {title && (
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">{title}</h2>
                                <button className="btn-icon btn-ghost" onClick={onClose}>
                                    <X size={20} />
                                </button>
                            </div>
                        )}
                        {children}
                    </motion.div>

                    {/* Desktop: Center Modal */}
                    <motion.div
                        className="modal center-modal hide-mobile"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        {title && (
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">{title}</h2>
                                <button className="btn-icon btn-ghost" onClick={onClose}>
                                    <X size={20} />
                                </button>
                            </div>
                        )}
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

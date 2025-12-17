import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="modal-backdrop"
                onClick={onClose}
            />

            {/* Mobile: Bottom Sheet */}
            <div className="modal bottom-sheet hide-desktop">
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
            </div>

            {/* Desktop: Center Modal */}
            <div className="modal center-modal hide-mobile">
                {title && (
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">{title}</h2>
                        <button className="btn-icon btn-ghost" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                )}
                {children}
            </div>
        </>
    );
}

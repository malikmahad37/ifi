import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const styleMap = {
        success: {
            bg: 'bg-brand-lime/10',
            border: 'border-brand-lime/20',
            iconUrl: 'text-brand-lime',
            Icon: CheckCircle
        },
        error: {
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
            iconUrl: 'text-red-500',
            Icon: AlertCircle
        },
        info: {
            bg: 'bg-theme-base/10',
            border: 'border-theme-base/20',
            iconUrl: 'text-theme-base/80',
            Icon: Info
        }
    };

    const { bg, border, iconUrl, Icon } = styleMap[type];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-md shadow-2xl ${bg} ${border}`}
                >
                    <Icon className={`w-5 h-5 ${iconUrl}`} />
                    <p className="text-theme-base text-xs font-bold font-mono uppercase tracking-wide">{message}</p>
                    <button onClick={onClose} className="ml-4 p-1 rounded-md hover:bg-theme-base/10 transition-colors text-theme-base/40 hover:text-theme-base">
                        <X className="w-4 h-4" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

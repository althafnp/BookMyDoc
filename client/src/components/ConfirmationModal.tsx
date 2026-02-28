import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';

type ConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    confirmButton?: 'default' | 'destructive';
    cancelText?: string;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message,
    confirmText = 'OK',
    confirmButton = 'default',
    cancelText = 'Cancel'
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <Card
                className="max-w-md w-full animate-in fade-in zoom-in-95 duration-200 overflow-hidden py-0 border-none"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <CardHeader className="bg-muted/90 flex justify-between items-center py-5">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </CardHeader>

                {/* Content */}
                <CardContent>   
                    <p className="text-sm font-medium">{message}</p>
                </CardContent>

                {/* Footer Actions */}
                <CardFooter className="bg-muted/30 flex justify-end gap-3 border-t border-border py-5">
                    <Button variant="outline" onClick={onClose}>
                        {cancelText}
                    </Button>
                    <Button variant={confirmButton} onClick={() => {
                        onConfirm();
                        onClose();
                    }}>
                        {confirmText}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ConfirmationModal;



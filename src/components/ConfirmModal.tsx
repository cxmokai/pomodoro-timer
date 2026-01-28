import type { ReactNode } from 'react';
import { X } from './icons';
import { themes } from '../utils/themes';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  currentTheme: string;
  customActions?: ReactNode;
}

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = 'CONFIRM',
  cancelText = 'CANCEL',
  onConfirm,
  onCancel,
  currentTheme,
  customActions,
}: ConfirmModalProps) => {
  const theme = themes[currentTheme];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 brutal-fade-in"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`brutal-card ${theme.modal} w-full max-w-md brutal-slide-in`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b-4">
            <h2 className={`text-lg ${theme.text} no-select`}>{title}</h2>
            <button
              onClick={onCancel}
              className={`brutal-btn p-2 cursor-pointer no-select`}
              style={{
                background: theme.surfaceHighlight
                  .replace('bg-[', '')
                  .replace(']', ''),
                color: theme.text.replace('text-[', '').replace(']', ''),
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message */}
          <div className="p-6">
            <p className={`text-sm ${theme.text}`}>{message}</p>
          </div>

          {/* Actions */}
          {customActions ? (
            <div className="p-6 pt-0">{customActions}</div>
          ) : (
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={onCancel}
                className={`flex-1 brutal-btn px-4 py-3 cursor-pointer no-select`}
                style={{
                  background: theme.surfaceHighlight
                    .replace('bg-[', '')
                    .replace(']', ''),
                  color: theme.text.replace('text-[', '').replace(']', ''),
                }}
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 brutal-btn px-4 py-3 cursor-pointer no-select`}
                style={{
                  background: theme.buttonPrimary
                    .split(' ')
                    .find((c) => c.startsWith('bg-['))
                    ?.replace('bg-[', '')
                    .replace(']', '') || theme.accent,
                  color: theme.buttonPrimary.includes('text-[')
                    ? theme.buttonPrimary
                        .split(' ')
                        .find((c) => c.startsWith('text-['))
                        ?.replace('text-[', '')
                        .replace(']', '') || '#ffffff'
                    : '#ffffff',
                }}
              >
                {confirmText}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

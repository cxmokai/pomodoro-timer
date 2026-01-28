import { themes } from '../utils/themes';

interface YesterdayQuestModalProps {
  isOpen: boolean;
  yesterdayQuest: { id: string; title: string } | null;
  onDismiss: () => void;
  onMoveToToday: () => void;
  currentTheme: string;
}

export const YesterdayQuestModal = ({
  isOpen,
  yesterdayQuest,
  onDismiss,
  onMoveToToday,
  currentTheme,
}: YesterdayQuestModalProps) => {
  const theme = themes[currentTheme];

  if (!isOpen || !yesterdayQuest) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 brutal-fade-in"
        onClick={onDismiss}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`brutal-card ${theme.modal} w-full max-w-md brutal-slide-in`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b-4">
            <h2 className={`text-lg ${theme.text} no-select`}>
              YESTERDAY'S QUEST
            </h2>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className={`text-sm ${theme.textMuted} mb-4 no-select`}>
              You have an incomplete quest from yesterday:
            </p>
            <div
              className={`p-4 brutal-card ${theme.surfaceHighlight} mb-4`}
            >
              <p className={`text-base ${theme.text} font-bold no-select`}>
                {yesterdayQuest.title}
              </p>
            </div>
            <p className={`text-sm ${theme.textMuted} no-select`}>
              Would you like to continue working on it today?
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 pt-0">
            <button
              onClick={onDismiss}
              className={`flex-1 brutal-btn px-4 py-3 cursor-pointer no-select`}
              style={{
                background: theme.surfaceHighlight
                  .replace('bg-[', '')
                  .replace(']', ''),
                color: theme.text.replace('text-[', '').replace(']', ''),
              }}
            >
              DISCARD
            </button>
            <button
              onClick={onMoveToToday}
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
              CONTINUE TODAY
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

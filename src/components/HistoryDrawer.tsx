import { useState, useEffect, useCallback } from 'react';
import { Trash2, X, Search, CheckCircle2, History } from './icons';
import { ConfirmModal } from './ConfirmModal';
import { themes } from '../utils/themes';
import type { CompletedQuest, PomodoroSession } from '../utils/themes';
import { useData } from '../contexts/DataContext';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
}

// Format time as HH:MM
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

// Get date key for grouping
const getDateKey = (timestamp: number): string => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  }
};

// Get relative time
const getRelativeTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return date.toLocaleDateString();
};

// Filter and group quests by date
const groupQuestsByDate = (
  quests: CompletedQuest[],
  daysToShow: number = 10
): Map<string, CompletedQuest[]> => {
  const grouped = new Map<string, CompletedQuest[]>();
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  // Calculate cutoff date (daysToShow days ago, excluding today)
  const cutoffDate = new Date(today);
  cutoffDate.setDate(cutoffDate.getDate() - daysToShow);
  cutoffDate.setHours(0, 0, 0, 0);

  // Filter and group
  quests.forEach((quest) => {
    const questDate = new Date(quest.completedAt);

    // Skip today's quests (user wants to exclude today)
    if (questDate.toDateString() === today.toDateString()) {
      return;
    }

    // Skip quests older than cutoff
    if (questDate < cutoffDate) {
      return;
    }

    const dateKey = getDateKey(quest.completedAt);

    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(quest);
  });

  return grouped;
};

export const HistoryDrawer = ({
  isOpen,
  onClose,
  currentTheme,
}: HistoryDrawerProps) => {
  const { completedQuests, deleteCompletedQuest, sessions } = useData();
  const theme = themes[currentTheme];

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredQuests, setFilteredQuests] = useState<CompletedQuest[]>([]);
  const [questToDelete, setQuestToDelete] = useState<CompletedQuest | null>(null);
  const daysToShow = 10;

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim() === '') {
        setFilteredQuests(completedQuests);
      } else {
        const filtered = completedQuests.filter((quest) =>
          quest.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredQuests(filtered);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, completedQuests]);

  // Group filtered quests by date
  const groupedQuests = groupQuestsByDate(filteredQuests, daysToShow);

  // Sort dates (most recent first)
  const sortedDates = Array.from(groupedQuests.keys()).sort((a, b) => {
    if (a === 'Today') return -1;
    if (b === 'Today') return 1;
    if (a === 'Yesterday') return -1;
    if (b === 'Yesterday') return 1;
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const handleDeleteClick = useCallback((quest: CompletedQuest) => {
    setQuestToDelete(quest);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (questToDelete) {
      deleteCompletedQuest(questToDelete.id);
      setQuestToDelete(null);
    }
  }, [questToDelete, deleteCompletedQuest]);

  const handleDeleteCancel = useCallback(() => {
    setQuestToDelete(null);
  }, []);

  // Calculate total completed and sessions stats
  const totalCompleted = filteredQuests.length;
  const completedSessions = sessions.filter((s: PomodoroSession) => s.completed && s.type === 'work').length;
  const skippedSessions = sessions.filter((s: PomodoroSession) => !s.completed && s.type === 'work').length;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 brutal-fade-in"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 brutal-card transition-transform duration-300 ease-in-out ${theme.surface} ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          borderTop: 'none',
          borderBottom: 'none',
          borderRight: 'none',
        }}
      >
        {/* Header */}
        <div className="p-6 border-b-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg ${theme.text} no-select flex items-center gap-2`}>
              <History className="w-5 h-5" />
              HISTORY
            </h2>
            <button
              onClick={onClose}
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

          {/* Search Input */}
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme.textMuted}`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search completed quests..."
              className={`w-full pl-10 pr-4 py-2 text-sm brutal-input no-select`}
              style={{
                background: theme.bg.replace('bg-[', '').replace(']', ''),
                color: theme.text.replace('text-[', '').replace(']', ''),
              }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className={`p-4 border-b-2 ${theme.surfaceHighlight}`}>
          <div className="flex justify-around text-center">
            <div>
              <div className={`text-2xl font-bold ${theme.text}`}>
                {totalCompleted}
              </div>
              <div className={`text-xs ${theme.textMuted} no-select`}>
                QUESTS
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold`} style={{ color: '#22c55e' }}>
                {completedSessions}
              </div>
              <div className={`text-xs ${theme.textMuted} no-select`}>
                COMPLETED SESSIONS
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold`} style={{ color: '#ef4444' }}>
                {skippedSessions}
              </div>
              <div className={`text-xs ${theme.textMuted} no-select`}>
                SKIPPED
              </div>
            </div>
          </div>
        </div>

        {/* Quest List */}
        <div
          className="overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 260px)' }}
        >
          {filteredQuests.length === 0 ? (
            <div className="p-6">
              <p className={`text-sm ${theme.textMuted} text-center no-select`}>
                {searchQuery ? 'No quests match your search' : 'No completed quests yet'}
              </p>
            </div>
          ) : (
            <div className="p-4">
              {sortedDates.map((dateKey) => {
                const dateQuests = groupedQuests.get(dateKey)!;
                return (
                  <div key={dateKey} className="mb-6">
                    {/* Date Header */}
                    <div
                      className={`text-xs font-bold ${theme.textMuted} mb-3 px-2 no-select`}
                    >
                      {dateKey} ({dateQuests.length})
                    </div>

                    {/* Quests for this date */}
                    <div className="space-y-2">
                      {dateQuests.map((quest, index) => (
                        <div
                          key={quest.id}
                          className={`flex items-center gap-3 p-3 brutal-card ${theme.surfaceHighlight} transition-all duration-200`}
                          style={{
                            animation: `brutal-slide-in 0.2s ease-out ${index * 30}ms both`,
                          }}
                        >
                          {/* Status Icon */}
                          <CheckCircle2
                            className="w-4 h-4 flex-shrink-0"
                            style={{ color: '#22c55e' }}
                          />

                          {/* Quest Title */}
                          <div className="flex-1 min-w-0">
                            <div
                              className={`text-sm ${theme.text} truncate no-select`}
                              style={{
                                textDecoration: 'line-through',
                                opacity: 0.7,
                              }}
                              title={quest.title}
                            >
                              {quest.title}
                            </div>
                            <div
                              className={`text-xs ${theme.textMuted} no-select`}
                            >
                              {formatTime(quest.completedAt)} · {getRelativeTime(quest.completedAt)}
                            </div>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteClick(quest)}
                            className={`px-3 py-2 brutal-btn cursor-pointer no-select`}
                            style={{
                              background: theme.surfaceHighlight
                                .replace('bg-[', '')
                                .replace(']', ''),
                              color: theme.text.replace('text-[', '').replace(']', ''),
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={questToDelete !== null}
        title="DELETE QUEST?"
        message={`Delete "${questToDelete?.title || 'this quest'}"? This action cannot be undone.`}
        confirmText="DELETE"
        cancelText="CANCEL"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        currentTheme={currentTheme}
      />
    </>
  );
};

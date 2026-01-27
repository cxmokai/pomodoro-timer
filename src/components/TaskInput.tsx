import { useState, useEffect } from 'react';
import { Check } from './icons';
import { themes } from '../utils/themes';
import type { CompletedQuest } from '../utils/themes';

interface TaskInputProps {
  currentTheme: string;
  onQuestComplete?: (quest: CompletedQuest) => void;
}

export const TaskInput = ({
  currentTheme,
  onQuestComplete,
}: TaskInputProps) => {
  const [task, setTask] = useState(() => {
    return localStorage.getItem('pomodoro-task') || '';
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const theme = themes[currentTheme];

  useEffect(() => {
    localStorage.setItem('pomodoro-task', task);
  }, [task]);

  const handleComplete = () => {
    if (!task.trim()) return;

    setIsCompleted(true);

    // Save to completed quests
    const completedQuest: CompletedQuest = {
      id: Date.now().toString(),
      title: task,
      completedAt: Date.now(),
    };

    // Get existing completed quests
    const existing = localStorage.getItem('pomodoro-completed-quests');
    const completedQuests: CompletedQuest[] = existing
      ? JSON.parse(existing)
      : [];
    completedQuests.unshift(completedQuest);

    // Keep only last 50 quests
    const trimmed = completedQuests.slice(0, 50);
    localStorage.setItem('pomodoro-completed-quests', JSON.stringify(trimmed));

    // Notify parent
    onQuestComplete?.(completedQuest);

    // Clear after animation
    setTimeout(() => {
      setTask('');
      setIsCompleted(false);
      localStorage.removeItem('pomodoro-task');
    }, 1500);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        {isEditing ? (
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsEditing(false);
              }
            }}
            placeholder="Enter your quest..."
            className={`w-full px-4 py-3 text-sm brutal-input no-select`}
            style={{
              background: theme.bg.replace('bg-[', '').replace(']', ''),
              color: theme.text.replace('text-[', '').replace(']', ''),
            }}
            autoFocus
          />
        ) : (
          <div
            onClick={() => !isCompleted && setIsEditing(true)}
            className={`w-full px-4 py-3 cursor-pointer brutal-btn no-select flex items-center ${
              task ? theme.surfaceHighlight : theme.bg
            } ${isCompleted ? 'opacity-50' : ''}`}
            style={{
              background: task
                ? theme.surfaceHighlight.replace('bg-[', '').replace(']', '')
                : theme.bg.replace('bg-[', '').replace(']', ''),
              color: task
                ? theme.text.replace('text-[', '').replace(']', '')
                : theme.textMuted.replace('text-[', '').replace(']', ''),
            }}
          >
            <span
              style={{
                textDecoration: isCompleted ? 'line-through' : 'none',
              }}
            >
              {task || 'Click to add quest...'}
            </span>
          </div>
        )}
      </div>

      {/* Complete button - only show when there's a task */}
      {task && !isEditing && (
        <button
          onClick={handleComplete}
          disabled={isCompleted}
          className={`brutal-btn px-5 py-3 flex items-center justify-center cursor-pointer no-select`}
          style={{
            background: isCompleted ? '#FFB347' : '#FF6B35',
            color: '#000000',
            opacity: isCompleted ? 0.7 : 1,
          }}
        >
          <Check className="w-[18px] h-[18px]" />
        </button>
      )}
    </div>
  );
};

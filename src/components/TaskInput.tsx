import { useState, useEffect } from "react";
import { Target, Check } from "./icons";
import { themes } from "../utils/themes";
import type { CompletedQuest } from "../utils/themes";

interface TaskInputProps {
  currentTheme: string;
  onQuestComplete?: (quest: CompletedQuest) => void;
}

export const TaskInput = ({ currentTheme, onQuestComplete }: TaskInputProps) => {
  const [task, setTask] = useState(() => {
    return localStorage.getItem("pomodoro-task") || "";
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const theme = themes[currentTheme];

  useEffect(() => {
    localStorage.setItem("pomodoro-task", task);
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
    const existing = localStorage.getItem("pomodoro-completed-quests");
    const completedQuests: CompletedQuest[] = existing ? JSON.parse(existing) : [];
    completedQuests.unshift(completedQuest);

    // Keep only last 50 quests
    const trimmed = completedQuests.slice(0, 50);
    localStorage.setItem("pomodoro-completed-quests", JSON.stringify(trimmed));

    // Notify parent
    onQuestComplete?.(completedQuest);

    // Clear after animation
    setTimeout(() => {
      setTask("");
      setIsCompleted(false);
      localStorage.removeItem("pomodoro-task");
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
              if (e.key === "Enter") {
                setIsEditing(false);
              }
            }}
            placeholder="Enter your quest..."
            className={`w-full px-4 py-3 text-[10px] border-4 ${theme.input} pixel-input pixel-no-select`}
            style={{
              fontFamily: "'Press Start 2P', cursive",
              boxShadow: `inset 2px 2px 0 0 rgba(0,0,0,0.15)`,
            }}
            autoFocus
          />
        ) : (
          <div
            onClick={() => !isCompleted && setIsEditing(true)}
            className={`w-full px-4 py-3 border-4 cursor-pointer transition-all duration-100 pixel-btn pixel-btn-hover pixel-cursor-pointer flex items-center gap-2 ${
              task ? theme.surfaceHighlight : theme.bg
            } ${theme.border} ${isCompleted ? 'opacity-50' : ''}`}
            style={{
              boxShadow: task
                ? `2px 2px 0 0 rgba(0,0,0,0.15)`
                : `inset 2px 2px 0 0 rgba(0,0,0,0.1)`,
            }}
          >
            <Target size={16} className={task ? theme.text : theme.textMuted} />
            <span
              className={task ? theme.text : `${theme.textMuted} italic`}
              style={{
                textDecoration: isCompleted ? 'line-through' : 'none',
              }}
            >
              {task || "Click to add quest..."}
            </span>
          </div>
        )}
      </div>

      {/* Complete button - only show when there's a task */}
      {task && !isEditing && (
        <button
          onClick={handleComplete}
          disabled={isCompleted}
          className={`pixel-btn px-5 py-3 border-4 flex items-center justify-center cursor-pointer transition-all duration-100 pixel-no-select ${
            isCompleted
              ? 'bg-[#00ff88] border-[#00cc6a] text-[#0d0221]'
              : theme.buttonPrimary
          }`}
          style={{
            boxShadow: isCompleted
              ? '2px 2px 0 0 rgba(0,0,0,0.2)'
              : '4px 4px 0 0 rgba(0,0,0,0.2)',
          }}
        >
          <Check size={18} />
        </button>
      )}
    </div>
  );
};

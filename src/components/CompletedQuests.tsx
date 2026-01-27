import { useState, useEffect } from "react";
import { Trash2, CheckCircle } from './icons';
import { themes } from "../utils/themes";
import type { CompletedQuest } from "../utils/themes";

interface CompletedQuestsProps {
  currentTheme: string;
  triggerUpdate?: number;
}

export const CompletedQuests = ({ currentTheme, triggerUpdate }: CompletedQuestsProps) => {
  const [quests, setQuests] = useState<CompletedQuest[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = themes[currentTheme];

  useEffect(() => {
    loadQuests();
  }, [triggerUpdate]);

  const loadQuests = () => {
    const existing = localStorage.getItem("pomodoro-completed-quests");
    if (existing) {
      const parsed: CompletedQuest[] = JSON.parse(existing);
      setQuests(parsed);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const deleteQuest = (id: string) => {
    const existing = localStorage.getItem("pomodoro-completed-quests");
    if (existing) {
      const parsed: CompletedQuest[] = JSON.parse(existing);
      const filtered = parsed.filter(q => q.id !== id);
      localStorage.setItem("pomodoro-completed-quests", JSON.stringify(filtered));
      setQuests(filtered);
    }
  };

  if (quests.length === 0) return null;

  const displayQuests = isExpanded ? quests : quests.slice(0, 3);

  return (
    <div className={`border-4 ${theme.border} ${theme.surface} ${theme.shadow} mt-6`}>
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 border-b-4 ${theme.border} cursor-pointer`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={`flex items-center gap-3 ${theme.text} pixel-no-select`}>
          <span className="text-2xl">⭐</span>
          <span className="text-[10px]">
            COMPLETED QUESTS ({quests.length})
          </span>
        </div>
        <span className={`text-xl ${theme.text} pixel-no-select`}>
          {isExpanded ? "▼" : "▶"}
        </span>
      </div>

      {/* Quest List */}
      <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
        {displayQuests.map((quest) => (
          <div
            key={quest.id}
            className={`flex items-center justify-between p-3 border-4 ${theme.border} ${theme.surfaceHighlight} transition-all duration-200`}
            style={{
              boxShadow: `2px 2px 0 0 rgba(0,0,0,0.15)`,
            }}
          >
            <div className="flex-1 min-w-0">
              <div className={`text-[10px] ${theme.text} truncate pixel-no-select`}
                style={{
                  textDecoration: 'line-through',
                  opacity: 0.7,
                }}
              >
                {quest.title}
              </div>
              <div className={`text-[8px] ${theme.textMuted} mt-1 pixel-no-select`}>
                {formatTime(quest.completedAt)}
              </div>
            </div>
            <button
              onClick={() => deleteQuest(quest.id)}
              className={`ml-3 px-3 py-2 border-4 text-sm cursor-pointer ${theme.buttonSecondary} pixel-btn pixel-no-select`}
              style={{
                textShadow: '1px 1px 0 rgba(0,0,0,0.3)',
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Show More/Less */}
      {quests.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full p-3 border-t-4 ${theme.border} text-[9px] ${theme.textMuted} hover:${theme.text} cursor-pointer transition-colors pixel-no-select`}
        >
          {isExpanded ? "▲ SHOW LESS" : `▼ SHOW ${quests.length - 3} MORE`}
        </button>
      )}
    </div>
  );
};

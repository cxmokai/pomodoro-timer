import { useEffect, useState } from "react";
import { useTimer } from "./hooks/useTimer";
import { TimerDisplay } from "./components/TimerDisplay";
import { Controls } from "./components/Controls";
import { ModeIndicator } from "./components/ModeIndicator";
import { TaskInput } from "./components/TaskInput";
import { CompletedQuests } from "./components/CompletedQuests";
import { SettingsModal } from "./components/SettingsModal";
import { themes } from "./utils/themes";
import { Settings, Gamepad2, Sun, Moon } from "./components/icons";

function App() {
  const {
    timeLeft,
    mode,
    isRunning,
    sessionCount,
    settings,
    initialDuration,
    toggleTimer,
    resetTimer,
    skipMode,
    updateSettings,
  } = useTimer();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [questUpdateTrigger, setQuestUpdateTrigger] = useState(0);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          toggleTimer();
          break;
        case "r":
          resetTimer();
          break;
        case "s":
          skipMode();
          break;
        case "t":
          setIsSettingsOpen((prev) => !prev);
          break;
        case "escape":
          setIsSettingsOpen(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [toggleTimer, resetTimer, skipMode]);

  const theme = themes[settings.theme];

  const handleQuestComplete = () => {
    setQuestUpdateTrigger(prev => prev + 1);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${theme.bg} scanlines pixel-grid crt-vignette`}>
      <div className="container mx-auto px-4 py-6 max-w-2xl pixel-slide-in">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <h1 className={`text-xl tracking-tight ${theme.text} pixel-no-select terminal-glow`}>
            ◆ POMODORO
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
              className={`pixel-btn text-[10px] px-3 py-2 border-4 cursor-pointer flex items-center justify-center ${theme.border} ${theme.surface} hover:opacity-80 transition-opacity pixel-no-select`}
              title={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {settings.theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`pixel-btn text-[10px] px-3 py-2 border-4 cursor-pointer flex items-center gap-2 ${theme.border} ${theme.surface} hover:opacity-80 transition-opacity pixel-no-select`}
            >
              <Settings size={14} />
              <span>SETTINGS</span>
            </button>
          </div>
        </header>

        {/* Main Timer Card */}
        <div className={`p-8 mb-8 border-4 ${theme.border} ${theme.surface} ${theme.shadow}`}>
          <ModeIndicator mode={mode} currentTheme={settings.theme} />

          <div className="flex justify-center my-8">
            <TimerDisplay
              timeLeft={timeLeft}
              initialDuration={initialDuration}
              mode={mode}
              currentTheme={settings.theme}
            />
          </div>

          <Controls
            isRunning={isRunning}
            onToggle={toggleTimer}
            onReset={resetTimer}
            onSkip={skipMode}
            currentTheme={settings.theme}
          />
        </div>

        {/* Task Input */}
        <div className={`p-5 border-4 ${theme.border} ${theme.surface} ${theme.shadow} mb-6`}>
          <div className={`flex items-center gap-2 mb-3 ${theme.textMuted} pixel-no-select`}>
            <span className="text-xl">⚔</span>
            <span className="text-[10px]">CURRENT QUEST</span>
          </div>
          <TaskInput
            currentTheme={settings.theme}
            onQuestComplete={handleQuestComplete}
          />
        </div>

        {/* Completed Quests */}
        <CompletedQuests
          currentTheme={settings.theme}
          triggerUpdate={questUpdateTrigger}
        />

        {/* Stats Footer */}
        <footer className="flex justify-between items-center mt-6">
          <div className={`flex items-center gap-2 ${theme.textMuted} pixel-no-select`}>
            <Gamepad2 size={18} />
            <span className="text-[10px]">
              SESSIONS: <span className={`${theme.text} terminal-glow`}>{sessionCount}</span>
            </span>
          </div>
        </footer>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        updateSettings={updateSettings}
        currentTheme={settings.theme}
      />
    </div>
  );
}

export default App;

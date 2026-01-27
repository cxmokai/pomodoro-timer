import { useState, useEffect } from "react";
import { Volume2, VolumeX, X } from "./icons";
import { themes, type Settings } from "../utils/themes";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  currentTheme: string;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  settings,
  updateSettings,
  currentTheme,
}: SettingsProps) => {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const theme = themes[currentTheme];

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (
    key: keyof Settings,
    value: number | boolean | string,
  ) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    updateSettings({ [key]: value });
  };

  const shortcuts = [
    { key: "SPACE / K", action: "Start/Pause" },
    { key: "R", action: "Reset" },
    { key: "S", action: "Skip Mode" },
    { key: "T", action: "Settings" },
    { key: "ESC", action: "Close" },
  ];

  if (!isOpen) return null;

  const isTerminal = currentTheme === 'terminal';

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl pixel-slide-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#111111',
          border: '4px solid #333333',
          boxShadow: '8px 8px 0 0 rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4" style={{ borderColor: '#333333', background: '#0a0a0a' }}>
          <h2 className="text-base pixel-no-select flex items-center gap-3" style={{ color: '#00ff41', textShadow: '0 0 10px rgba(0, 255, 65, 0.5)' }}>
            <span style={{ fontSize: '20px' }}>⚙</span>
            <span>SETTINGS</span>
          </h2>
          <button
            onClick={onClose}
            className="pixel-btn px-4 py-2 border-4 cursor-pointer flex items-center justify-center pixel-no-select"
            style={{
              background: '#1a1a1a',
              borderColor: '#333333',
              color: '#00ff41',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto" style={{ background: '#111111' }}>
          {/* Duration Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] mb-2 pixel-no-select" style={{ color: '#00ff41' }}>
                WORK (min)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={localSettings.workDuration}
                onChange={(e) =>
                  handleChange("workDuration", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 text-[10px] border-4 pixel-input pixel-no-select"
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  background: '#0a0a0a',
                  borderColor: '#333333',
                  color: '#00ff41',
                  boxShadow: 'inset 2px 2px 0 0 rgba(0,0,0,0.3)',
                }}
              />
            </div>
            <div>
              <label className="block text-[10px] mb-2 pixel-no-select" style={{ color: '#00ff41' }}>
                SHORT BREAK (min)
              </label>
              <input
                type="number"
                min="1"
                max="15"
                value={localSettings.shortBreakDuration}
                onChange={(e) =>
                  handleChange("shortBreakDuration", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 text-[10px] border-4 pixel-input pixel-no-select"
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  background: '#0a0a0a',
                  borderColor: '#333333',
                  color: '#00ff41',
                  boxShadow: 'inset 2px 2px 0 0 rgba(0,0,0,0.3)',
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] mb-2 pixel-no-select" style={{ color: '#00ff41' }}>
                LONG BREAK (min)
              </label>
              <input
                type="number"
                min="5"
                max="30"
                value={localSettings.longBreakDuration}
                onChange={(e) =>
                  handleChange("longBreakDuration", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 text-[10px] border-4 pixel-input pixel-no-select"
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  background: '#0a0a0a',
                  borderColor: '#333333',
                  color: '#00ff41',
                  boxShadow: 'inset 2px 2px 0 0 rgba(0,0,0,0.3)',
                }}
              />
            </div>
            <div>
              <label className="block text-[10px] mb-2 pixel-no-select" style={{ color: '#00ff41' }}>
                INTERVAL
              </label>
              <input
                type="number"
                min="2"
                max="8"
                value={localSettings.longBreakInterval}
                onChange={(e) =>
                  handleChange("longBreakInterval", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 text-[10px] border-4 pixel-input pixel-no-select"
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  background: '#0a0a0a',
                  borderColor: '#333333',
                  color: '#00ff41',
                  boxShadow: 'inset 2px 2px 0 0 rgba(0,0,0,0.3)',
                }}
              />
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="p-4 border-4" style={{ borderColor: '#333333', background: '#0a0a0a' }}>
            <label className="flex items-center justify-between cursor-pointer pixel-cursor-pointer">
              <span className="text-[10px] pixel-no-select" style={{ color: '#00ff41' }}>
                ENABLE SOUND
              </span>
              <div className="flex items-center gap-3">
                <span style={{ color: '#00ff41' }}>
                  {localSettings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </span>
                <input
                  type="checkbox"
                  checked={localSettings.soundEnabled}
                  onChange={(e) => handleChange("soundEnabled", e.target.checked)}
                  className="pixel-checkbox"
                  style={{ accentColor: '#00ff41' }}
                />
              </div>
            </label>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="p-4 border-4" style={{ borderColor: '#333333', background: '#0a0a0a' }}>
            <h3 className="text-[10px] mb-3 pixel-no-select" style={{ color: '#00ff41' }}>CONTROLS</h3>
            <div className="grid grid-cols-2 gap-3">
              {shortcuts.map((shortcut) => (
                <div key={shortcut.key} className="flex justify-between items-center">
                  <kbd
                    className="px-3 py-2 text-[8px] border-4 pixel-no-select"
                    style={{
                      borderColor: '#333333',
                      background: '#1a1a1a',
                      color: '#00ff41',
                      boxShadow: '2px 2px 0 0 rgba(0,0,0,0.3)',
                    }}
                  >
                    {shortcut.key}
                  </kbd>
                  <span className="text-[9px] pixel-no-select" style={{ color: '#00ff41' }}>
                    {shortcut.action}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Theme Selector */}
          <div className="p-4 border-4" style={{ borderColor: '#333333', background: '#0a0a0a' }}>
            <h3 className="text-[10px] mb-3 pixel-no-select" style={{ color: '#00ff41' }}>THEME</h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(themes).map((themeName) => (
                <button
                  key={themeName}
                  onClick={() => handleChange('theme', themeName)}
                  className="px-3 py-2 text-[8px] border-4 pixel-btn pixel-no-select"
                  style={{
                    background: localSettings.theme === themeName ? '#00ff41' : '#1a1a1a',
                    borderColor: localSettings.theme === themeName ? '#00ff41' : '#333333',
                    color: localSettings.theme === themeName ? '#0a0a0a' : '#00ff41',
                    textShadow: localSettings.theme === themeName ? 'none' : '0 0 5px rgba(0, 255, 65, 0.3)',
                  }}
                >
                  {themes[themeName].name.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

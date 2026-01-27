import { themes } from '../utils/themes';
import { Play, Pause, RefreshCw, SkipForward } from './icons';

interface ControlsProps {
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
  currentTheme: string;
}

export const Controls = ({
  isRunning,
  onToggle,
  onReset,
  onSkip,
  currentTheme,
}: ControlsProps) => {
  const theme = themes[currentTheme];

  return (
    <div className="flex justify-center gap-4 flex-wrap">
      {/* Start/Pause Button */}
      <button
        onClick={onToggle}
        className={`brutal-btn px-6 py-3 flex items-center gap-2 cursor-pointer no-select ${
          isRunning ? theme.button : theme.buttonPrimary
        }`}
        style={{
          background: isRunning
            ? theme.surfaceHighlight.replace('bg-[', '').replace(']', '')
            : '#FF6B35',
          color: isRunning
            ? theme.text.replace('text-[', '').replace(']', '')
            : '#000000',
        }}
      >
        {isRunning ? (
          <>
            <Pause className="w-5 h-5" />
            <span className="text-sm">PAUSE</span>
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            <span className="text-sm">START</span>
          </>
        )}
      </button>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className={`brutal-btn px-6 py-3 flex items-center gap-2 cursor-pointer no-select ${theme.button}`}
        style={{
          background: theme.surfaceHighlight
            .replace('bg-[', '')
            .replace(']', ''),
          color: theme.text.replace('text-[', '').replace(']', ''),
        }}
      >
        <RefreshCw className="w-5 h-5" />
        <span className="text-sm">RESET</span>
      </button>

      {/* Skip Button */}
      <button
        onClick={onSkip}
        className={`brutal-btn px-6 py-3 flex items-center gap-2 cursor-pointer no-select ${theme.button}`}
        style={{
          background: theme.surfaceHighlight
            .replace('bg-[', '')
            .replace(']', ''),
          color: theme.text.replace('text-[', '').replace(']', ''),
        }}
      >
        <SkipForward className="w-5 h-5" />
        <span className="text-sm">SKIP</span>
      </button>
    </div>
  );
};

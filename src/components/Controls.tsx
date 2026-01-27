import { themes } from "../utils/themes";
import { Play, Pause, RefreshCw, SkipForward } from 'pixelarticons';

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
        className={`pixel-btn pixel-btn-hover px-6 py-3 font-bold border-3 cursor-pointer flex items-center gap-2 ${
          isRunning ? theme.buttonSecondary : theme.buttonPrimary
        } transition-all duration-100 pixel-no-select`}
        style={{
          textShadow: '1px 1px 0 rgba(0,0,0,0.3)',
        }}
      >
        {isRunning ? (
          <>
            <Pause size={20} />
            <span className="text-[10px]">PAUSE</span>
          </>
        ) : (
          <>
            <Play size={20} />
            <span className="text-[10px]">START</span>
          </>
        )}
      </button>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className={`pixel-btn pixel-btn-hover px-6 py-3 font-bold border-3 cursor-pointer flex items-center gap-2 ${theme.button} transition-all duration-100 pixel-no-select`}
        style={{
          textShadow: '1px 1px 0 rgba(0,0,0,0.3)',
        }}
      >
        <RefreshCw size={20} />
        <span className="text-[10px]">RESET</span>
      </button>

      {/* Skip Button */}
      <button
        onClick={onSkip}
        className={`pixel-btn pixel-btn-hover px-6 py-3 font-bold border-3 cursor-pointer flex items-center gap-2 ${theme.button} transition-all duration-100 pixel-no-select`}
        style={{
          textShadow: '1px 1px 0 rgba(0,0,0,0.3)',
        }}
      >
        <SkipForward size={20} />
        <span className="text-[10px]">SKIP</span>
      </button>
    </div>
  );
};

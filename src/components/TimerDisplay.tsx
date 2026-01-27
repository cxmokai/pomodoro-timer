import { type TimerMode } from '../hooks/useTimer';
import { themes, modeColors } from '../utils/themes';

interface TimerDisplayProps {
  timeLeft: number;
  initialDuration: number;
  mode: TimerMode;
  currentTheme: string;
  isRunning: boolean;
}

interface DigitProps {
  value: number;
  theme: (typeof themes)[keyof typeof themes];
}

const Digit = ({ value, theme }: DigitProps) => {
  const digits = value.toString().padStart(2, '0');
  return (
    <div className="flex gap-2">
      {digits.split('').map((digit, i) => (
        <div
          key={i}
          className={`w-14 h-18 flex items-center justify-center text-4xl no-select ${theme.text}`}
          style={{
            background: theme.surfaceHighlight
              .replace('bg-[', '')
              .replace(']', ''),
            border: `4px solid #000000`,
            boxShadow: `2px 2px 0 0 #000000`,
          }}
        >
          {digit}
        </div>
      ))}
    </div>
  );
};

export const TimerDisplay = ({
  timeLeft,
  initialDuration,
  mode,
  currentTheme,
  isRunning,
}: TimerDisplayProps) => {
  const theme = themes[currentTheme];
  const modeInfo = modeColors[mode];

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Progress Bar */}
      <div className="w-full max-w-[300px] mb-4">
        <div
          className="h-7 relative overflow-hidden brutal-progress-bar"
          style={{
            background: theme.bg.replace('bg-[', '').replace(']', ''),
          }}
        >
          {/* Progress fill */}
          <div
            className="h-full brutal-progress-fill"
            style={{
              width: `${(timeLeft / initialDuration) * 100}%`,
              background: modeInfo.color,
            }}
          />
        </div>
      </div>

      {/* Time Display */}
      <div className="flex items-center gap-4">
        <Digit value={minutes} theme={theme} />
        <div
          className={`text-4xl ${theme.text} ${isRunning ? 'brutal-blink' : ''}`}
        >
          :
        </div>
        <Digit value={seconds} theme={theme} />
      </div>

      {/* Mode indicator as badge */}
      <div
        className="mt-3 text-sm tracking-widest px-4 py-2 brutal-card brutal-pop no-select"
        style={{
          background: modeInfo.color,
          color: currentTheme === 'dark' ? '#000000' : '#ffffff',
        }}
      >
        {modeInfo.name}
      </div>
    </div>
  );
};

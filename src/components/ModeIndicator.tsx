import { type TimerMode } from '../hooks/useTimer'
import { themes, modeColors } from '../utils/themes'

interface ModeIndicatorProps {
  mode: TimerMode
  currentTheme: string
}

export const ModeIndicator = ({ mode, currentTheme }: ModeIndicatorProps) => {
  const theme = themes[currentTheme]

  const getModeLabel = (m: string) => {
    switch (m) {
      case 'work': return 'WORK'
      case 'shortBreak': return 'SHORT'
      case 'longBreak': return 'LONG'
      default: return ''
    }
  }

  return (
    <div className="flex justify-center items-center gap-3 mb-6">
      {['work', 'shortBreak', 'longBreak'].map((m) => {
        const isActive = m === mode
        const activeColor = modeColors[m as keyof typeof modeColors].color
        return (
          <div key={m} className="flex items-center gap-2">
            {/* LED indicator */}
            <div
              className="w-4 h-4 no-select transition-all duration-200"
              style={{
                background: isActive ? activeColor : 'transparent',
                border: `3px solid ${isActive ? '#000000' : theme.border.replace('border-[', '').replace(']', '')}`,
                boxShadow: isActive ? `2px 2px 0 0 #000000` : 'none',
              }}
            />
            {/* Mode label for active mode */}
            {isActive && (
              <span
                className={`text-sm no-select brutal-pop`}
                style={{
                  color: theme.text.replace('text-[', '').replace(']', ''),
                }}
              >
                {getModeLabel(m)}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

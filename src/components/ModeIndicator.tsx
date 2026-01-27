import { type TimerMode } from '../hooks/useTimer'
import { themes, modeColors } from '../utils/themes'

interface ModeIndicatorProps {
  mode: TimerMode
  currentTheme: string
}

export const ModeIndicator = ({ mode, currentTheme }: ModeIndicatorProps) => {
  const theme = themes[currentTheme]
  const modeInfo = modeColors[mode]
  const isTerminal = currentTheme === 'terminal'

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
      {/* Status indicators with terminal glow */}
      {['work', 'shortBreak', 'longBreak'].map((m) => {
        const isActive = m === mode
        const color = isActive ? modeInfo.color : theme.border.replace('border-[', '').replace(']', '')
        return (
          <div key={m} className="flex items-center gap-2">
            {/* Terminal LED indicator */}
            <div
              className="w-4 h-4 pixel-no-select transition-all duration-200"
              style={{
                background: isActive ? color : 'transparent',
                border: isTerminal
                  ? `2px solid ${color}`
                  : `3px solid ${isActive ? 'rgba(0,0,0,0.4)' : color}`,
                boxShadow: isActive && isTerminal
                  ? `0 0 8px ${color}, 0 0 16px ${color}40, inset 0 0 4px ${color}60`
                  : isActive
                  ? `0 0 0 2px ${color}40, 2px 2px 0 0 rgba(0,0,0,0.3)`
                  : 'none',
                imageRendering: 'pixelated',
              }}
            />
            {/* Mode label for active mode */}
            {isActive && (
              <span
                className={`text-[9px] font-bold pixel-no-select pixel-pop`}
                style={{
                  color: theme.text.replace('text-[', '').replace(']', ''),
                  textShadow: isTerminal
                    ? `0 0 8px ${modeInfo.color}, 0 0 16px ${modeInfo.color}80`
                    : '1px 1px 0 rgba(0,0,0,0.3)',
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

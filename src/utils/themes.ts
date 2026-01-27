export interface Theme {
  name: string
  bg: string
  surface: string
  surfaceHighlight: string
  shadow: string
  text: string
  textMuted: string
  accent: string
  accentHover: string
  border: string
  input: string
  ring: string
  button: string
  buttonPrimary: string
  buttonSecondary: string
  modal: string
}

export const themes: Record<string, Theme> = {
  dark: {
    name: 'Dark',
    bg: 'bg-[#0a0a0a]',
    surface: 'bg-[#111111]',
    surfaceHighlight: 'bg-[#1a1a1a]',
    shadow: 'shadow-[4px_4px_0px_0px_#050505]',
    text: 'text-[#00ff41]',
    textMuted: 'text-[#4a664a]',
    accent: '#00ff41',
    accentHover: 'hover:text-[#00cc33]',
    border: 'border-[#333333]',
    input: 'bg-[#0a0a0a] border-[#333333] text-[#00ff41] placeholder:text-[#4a664a]',
    ring: '#00ff41',
    button: 'bg-[#1a1a1a] hover:bg-[#222222] text-[#00ff41] border-[#333333]',
    buttonPrimary: 'bg-[#00ff41] hover:bg-[#00cc33] text-[#0a0a0a] border-[#00ff41]',
    buttonSecondary: 'bg-[#1a1a1a] hover:bg-[#222222] text-[#00ff41] border-[#333333]',
    modal: 'bg-[#111111] border-[#333333]',
  },
  light: {
    name: 'Light',
    bg: 'bg-[#ffffff]',
    surface: 'bg-[#f5f5f5]',
    surfaceHighlight: 'bg-[#e8e8e8]',
    shadow: 'shadow-[4px_4px_0px_0px_#d0d0d0]',
    text: 'text-[#1a1a1a]',
    textMuted: 'text-[#666666]',
    accent: '#00aa35',
    accentHover: 'hover:text-[#008829]',
    border: 'border-[#cccccc]',
    input: 'bg-[#ffffff] border-[#cccccc] text-[#1a1a1a] placeholder:text-[#888888]',
    ring: '#00aa35',
    button: 'bg-[#e8e8e8] hover:bg-[#d8d8d8] text-[#1a1a1a] border-[#cccccc]',
    buttonPrimary: 'bg-[#00aa35] hover:bg-[#008829] text-[#ffffff] border-[#00aa35]',
    buttonSecondary: 'bg-[#e8e8e8] hover:bg-[#d8d8d8] text-[#1a1a1a] border-[#cccccc]',
    modal: 'bg-[#f5f5f5] border-[#cccccc]',
  },
}

export const modeColors: Record<string, { name: string; color: string; bg: string }> = {
  work: {
    name: 'WORK MODE',
    color: '#00ff41',
    bg: 'bg-[#00ff41]',
  },
  shortBreak: {
    name: 'SHORT BREAK',
    color: '#00cc33',
    bg: 'bg-[#00cc33]',
  },
  longBreak: {
    name: 'LONG BREAK',
    color: '#009926',
    bg: 'bg-[#009926]',
  },
}

export interface Settings {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  longBreakInterval: number
  soundEnabled: boolean
  theme: string
}

export const defaultSettings: Settings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  soundEnabled: true,
  theme: 'dark',
}

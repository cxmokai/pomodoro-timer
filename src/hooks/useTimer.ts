import { useState, useEffect, useCallback, useRef } from 'react';
import type { PomodoroSettings, PomodoroSession } from '../utils/themes';
import { playNotificationSound } from '../utils/sounds';
import { useData } from '../contexts/DataContext';

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface TimerState {
  mode: TimerMode;
  isRunning: boolean;
  sessionCount: number;
  sessionStartTime: number | null;
  initialTimeLeft: number;
  elapsedTime: number;
}

const TIMER_STORAGE_KEY = 'pomodoro-timer-state';

const saveTimerState = (state: TimerState) => {
  localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state));
};

const loadTimerState = (): TimerState | null => {
  const saved = localStorage.getItem(TIMER_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
};

const clearTimerState = () => {
  localStorage.removeItem(TIMER_STORAGE_KEY);
};

export const useTimer = () => {
  const {
    settings,
    updateSettings: updateDataSettings,
    sessions,
    setSessions,
    incrementTodayPomodoroCount,
    isLoading,
  } = useData();

  const getModeDuration = useCallback(
    (currentMode: TimerMode): number => {
      switch (currentMode) {
        case 'work':
          return settings.workDuration * 60;
        case 'shortBreak':
          return settings.shortBreakDuration * 60;
        case 'longBreak':
          return settings.longBreakDuration * 60;
        default:
          return settings.workDuration * 60;
      }
    },
    [
      settings.workDuration,
      settings.shortBreakDuration,
      settings.longBreakDuration,
    ]
  );

  const hasRestoredStateRef = useRef(false);
  const hasCompletedInitialLoadRef = useRef(false);
  const lastKnownSettingsRef = useRef(settings);

  useEffect(() => {
    if (isLoading) return;

    if (!hasRestoredStateRef.current) {
      hasRestoredStateRef.current = true;
      lastKnownSettingsRef.current = settings;
      return;
    }

    if (!hasCompletedInitialLoadRef.current) {
      hasCompletedInitialLoadRef.current = true;
      lastKnownSettingsRef.current = settings;
      return;
    }

    // Check if settings actually changed (user explicitly changed them)
    if (
      lastKnownSettingsRef.current.workDuration !== settings.workDuration ||
      lastKnownSettingsRef.current.shortBreakDuration !==
        settings.shortBreakDuration ||
      lastKnownSettingsRef.current.longBreakDuration !==
        settings.longBreakDuration
    ) {
      // User changed settings, clear saved state and reset timer
      clearTimerState();
      const newDuration = settings.workDuration * 60;
      setTimeLeft(newDuration);
      setInitialDuration(newDuration);
      setIsRunning(false);
      sessionStartTimeRef.current = null;
      elapsedTimeRef.current = 0;
      lastKnownSettingsRef.current = settings;
    }
  }, [
    settings.workDuration,
    settings.shortBreakDuration,
    settings.longBreakDuration,
    isLoading,
  ]);

  // Restore state from sessionStorage on mount
  const getInitialState = () => {
    const saved = loadTimerState();

    if (saved) {
      // If timer is running, restore with elapsed time calculation
      if (saved.isRunning && saved.sessionStartTime) {
        const currentElapsed = Math.floor(
          (Date.now() - saved.sessionStartTime) / 1000
        );
        const effectiveElapsed = saved.elapsedTime + currentElapsed;
        const restoredTimeLeft = Math.max(
          0,
          saved.initialTimeLeft - effectiveElapsed
        );
        const timerNaturallyCompleted =
          effectiveElapsed >= saved.initialTimeLeft;

        return {
          mode: saved.mode,
          timeLeft: restoredTimeLeft,
          isRunning: !timerNaturallyCompleted && restoredTimeLeft > 0,
          sessionCount: saved.sessionCount,
          initialDuration: saved.initialTimeLeft,
          sessionStartTime: saved.sessionStartTime,
          elapsedTime: timerNaturallyCompleted
            ? saved.elapsedTime + currentElapsed
            : saved.elapsedTime,
        };
      }

      // If timer is paused, restore the paused state
      if (!saved.isRunning && saved.elapsedTime > 0) {
        const restoredTimeLeft = Math.max(
          0,
          saved.initialTimeLeft - saved.elapsedTime
        );
        return {
          mode: saved.mode,
          timeLeft: restoredTimeLeft,
          isRunning: false,
          sessionCount: saved.sessionCount,
          initialDuration: saved.initialTimeLeft,
          sessionStartTime: saved.sessionStartTime,
          elapsedTime: saved.elapsedTime,
        };
      }

      // If timer is not running and not paused (fresh start), use saved initialTimeLeft
      return {
        mode: saved.mode,
        timeLeft: saved.initialTimeLeft,
        isRunning: false,
        sessionCount: saved.sessionCount,
        initialDuration: saved.initialTimeLeft,
        sessionStartTime: null,
        elapsedTime: 0,
      };
    }

    // No saved state, use current settings (might be default or loaded from Firebase)
    const defaultDuration = settings.workDuration * 60;
    return {
      mode: 'work' as TimerMode,
      timeLeft: defaultDuration,
      isRunning: false,
      sessionCount: 0,
      initialDuration: defaultDuration,
      sessionStartTime: null,
      elapsedTime: 0,
    };
  };

  const initialState = getInitialState();
  const [mode, setMode] = useState<TimerMode>(initialState.mode);
  const [timeLeft, setTimeLeft] = useState(initialState.timeLeft);
  const [isRunning, setIsRunning] = useState(initialState.isRunning);
  const [sessionCount, setSessionCount] = useState(initialState.sessionCount);
  const [initialDuration, setInitialDuration] = useState(
    initialState.initialDuration
  );

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionStartTimeRef = useRef<number | null>(
    initialState.sessionStartTime
  );
  const elapsedTimeRef = useRef<number>(initialState.elapsedTime);
  const prevModeRef = useRef<TimerMode | null>(null);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave: TimerState = {
      mode,
      isRunning,
      sessionCount,
      sessionStartTime:
        isRunning || elapsedTimeRef.current > 0
          ? sessionStartTimeRef.current
          : null,
      initialTimeLeft: initialDuration,
      elapsedTime: elapsedTimeRef.current,
    };
    saveTimerState(stateToSave);
  }, [mode, isRunning, sessionCount, initialDuration, timeLeft]);

  useEffect(() => {
    if (prevModeRef.current !== null && prevModeRef.current !== mode) {
      const duration = getModeDuration(mode);
      setTimeLeft(duration);
      setInitialDuration(duration);
      setIsRunning(false);
      sessionStartTimeRef.current = null;
      elapsedTimeRef.current = 0;
    }
    prevModeRef.current = mode;
  }, [mode, getModeDuration]);

  const startTimer = useCallback(() => {
    if (!sessionStartTimeRef.current) {
      sessionStartTimeRef.current = Date.now();
    }
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    if (sessionStartTimeRef.current) {
      const elapsed = Math.floor(
        (Date.now() - sessionStartTimeRef.current) / 1000
      );
      elapsedTimeRef.current += elapsed;
      sessionStartTimeRef.current = null;
    }
    setIsRunning(false);
  }, []);

  // Save incomplete session when user skips or resets
  const saveIncompleteSession = useCallback(
    (currentMode: TimerMode, endReason: 'skipped' | 'reset') => {
      const startTime = sessionStartTimeRef.current;
      if (startTime && currentMode === 'work') {
        const incompleteSession: PomodoroSession = {
          id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          startTime,
          endTime: Date.now(),
          type: currentMode,
          completed: false,
          endReason,
        };
        setSessions([incompleteSession, ...sessions]);
        sessionStartTimeRef.current = null;
        // Clear saved state when skipping or resetting
        clearTimerState();
      }
    },
    [sessions, setSessions]
  );

  const resetTimer = useCallback(() => {
    saveIncompleteSession(mode, 'reset');
    setIsRunning(false);
    const duration = getModeDuration(mode);
    setTimeLeft(duration);
    setInitialDuration(duration);
  }, [mode, getModeDuration, saveIncompleteSession]);

  const toggleTimer = useCallback(() => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  }, [isRunning, startTimer, pauseTimer]);

  const skipMode = useCallback(() => {
    saveIncompleteSession(mode, 'skipped');
    setIsRunning(false);
    if (mode === 'work') {
      const newSessionCount = sessionCount + 1;
      setSessionCount(newSessionCount);

      if (newSessionCount % settings.longBreakInterval === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }
    } else {
      setMode('work');
    }
    const newMode =
      mode === 'work'
        ? (sessionCount + 1) % settings.longBreakInterval === 0
          ? 'longBreak'
          : 'shortBreak'
        : 'work';
    const duration = getModeDuration(newMode);
    setTimeLeft(duration);
    setInitialDuration(duration);
  }, [mode, sessionCount, settings, getModeDuration, saveIncompleteSession]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsRunning(false);
      // Clear saved state when timer completes
      clearTimerState();

      if (settings.soundEnabled) {
        playNotificationSound();
      }

      // Save completed session to history
      const startTime = sessionStartTimeRef.current;
      if (startTime) {
        const newSession: PomodoroSession = {
          id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          startTime,
          endTime: Date.now(),
          type: mode,
          completed: true,
        };
        setSessions([newSession, ...sessions]);
        sessionStartTimeRef.current = null;
      }

      if (mode === 'work') {
        const newSessionCount = sessionCount + 1;
        setSessionCount(newSessionCount);
        incrementTodayPomodoroCount();

        if (newSessionCount % settings.longBreakInterval === 0) {
          setMode('longBreak');
          const duration = settings.longBreakDuration * 60;
          setTimeLeft(duration);
          setInitialDuration(duration);
        } else {
          setMode('shortBreak');
          const duration = settings.shortBreakDuration * 60;
          setTimeLeft(duration);
          setInitialDuration(duration);
        }
      } else {
        setMode('work');
        const duration = settings.workDuration * 60;
        setTimeLeft(duration);
        setInitialDuration(duration);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeLeft, mode, sessionCount, settings]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateSettings = (newSettings: Partial<PomodoroSettings>) => {
    updateDataSettings(newSettings);
  };

  return {
    timeLeft,
    mode,
    isRunning,
    sessionCount,
    settings,
    initialDuration,
    formatTime,
    toggleTimer,
    resetTimer,
    skipMode,
    updateSettings,
  };
};

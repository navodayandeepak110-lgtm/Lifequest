import React, { useState, useEffect, useRef } from 'react'
import { Plus, Check, Play, Pause, RotateCcw } from 'lucide-react'
import './Dashboard.css'
import { getLevelInfo, getGreeting, getTodayDateString, calculateStreak } from '../utils/defaults'

const Dashboard = ({ userData, updateUserData }) => {
  const levelInfo = getLevelInfo(userData.profile.xp)
  const todayHabits = userData.habits || []
  const today = getTodayDateString()

  const completedToday = todayHabits.filter(h => h.completions && h.completions[today]).length
  const totalHabits = todayHabits.length
  const progressPercent = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0

  // Study Timer State
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [studyTime, setStudyTime] = useState(0) // time in seconds
  const timerIntervalRef = useRef(null)

  // Load saved study time from localStorage
  useEffect(() => {
    const savedTime = localStorage.getItem('studyTime')
    if (savedTime) {
      setStudyTime(parseInt(savedTime, 10))
    }
  }, [])

  // Timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setStudyTime(prevTime => {
          const newTime = prevTime + 1
          localStorage.setItem('studyTime', newTime.toString())
          return newTime
        })
      }, 1000)
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [isTimerRunning])

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning)
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    setStudyTime(0)
    localStorage.setItem('studyTime', '0')
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleToggleHabit = (habitId) => {
    const habit = userData.habits.find(h => h.id === habitId)
    const completions = habit.completions || {}
    const isCurrentlyCompleted = completions[today]

    // Toggle completion
    const newCompletions = {
      ...completions,
      [today]: !isCurrentlyCompleted,
    }

    // Update XP
    const xpChange = isCurrentlyCompleted ? -habit.xp : habit.xp
    const newXp = Math.max(0, userData.profile.xp + xpChange)
    const newLevelInfo = getLevelInfo(newXp)

    // Calculate new streak
    const newStreak = calculateStreak(newCompletions)

    // Update habit
    const updatedHabits = userData.habits.map(h =>
      h.id === habitId
        ? { ...h, completions: newCompletions, streak: newStreak }
        : h
    )

    updateUserData({
      ...userData,
      habits: updatedHabits,
      profile: {
        ...userData.profile,
        xp: newXp,
        level: newLevelInfo.level,
      },
    })
  }

  return (
    <div className="dashboard fade-in">
      <div className="page-header">
        <h1 className="greeting">{getGreeting()}, {userData.profile.name}!</h1>
        <p className="greeting-subtext">Ready to level up your life today?</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon primary">⚡</div>
            <div>
              <div className="stat-title">Level & XP</div>
            </div>
          </div>
          <div className="stat-value">Level {levelInfo.level}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            {levelInfo.title}
          </div>
          <div className="xp-progress">
            <div className="progress-label">
              <span>{userData.profile.xp} XP</span>
              <span>{levelInfo.xpInCurrentLevel} / {levelInfo.xpNeededForNextLevel}</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${levelInfo.progressPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon success">✓</div>
            <div>
              <div className="stat-title">Today's Progress</div>
            </div>
          </div>
          <div className="stat-value">{Math.round(progressPercent)}%</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {completedToday} of {totalHabits} habits completed
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon warning">🔥</div>
            <div>
              <div className="stat-title">Best Streak</div>
            </div>
          </div>
          <div className="stat-value">
            {Math.max(...userData.habits.map(h => h.streak || 0), 0)}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            days in a row
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Today's Habits</h2>
          </div>
          {todayHabits.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <div className="empty-text">No habits yet</div>
              <p style={{ fontSize: '0.875rem' }}>Add your first habit to get started!</p>
            </div>
          ) : (
            <div className="habit-list">
              {todayHabits.map(habit => {
                const isCompleted = habit.completions && habit.completions[today]
                return (
                  <div key={habit.id} className="habit-item">
                    <div
                      className={`habit-checkbox ${isCompleted ? 'checked' : ''}`}
                      onClick={() => handleToggleHabit(habit.id)}
                    >
                      {isCompleted && <Check size={16} color="white" />}
                    </div>
                    <span className="habit-icon">{habit.icon}</span>
                    <div className="habit-info">
                      <div className="habit-name">{habit.name}</div>
                      <div className="habit-details">
                        {habit.duration} • {habit.streak > 0 ? `${habit.streak} day streak` : 'Start your streak!'}
                      </div>
                    </div>
                    <div className="habit-xp">+{habit.xp} XP</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Study Timer</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem' }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontFamily: 'monospace',
              marginBottom: '2rem',
              letterSpacing: '0.1em'
            }}>
              {formatTime(studyTime)}
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button
                onClick={toggleTimer}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: isTimerRunning ? 'var(--warning)' : 'var(--primary)',
                  color: 'white',
                  transition: 'all 0.2s ease'
                }}
              >
                {isTimerRunning ? (
                  <>
                    <Pause size={20} />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    <span>Start</span>
                  </>
                )}
              </button>
              <button
                onClick={resetTimer}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: '2px solid var(--border)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  transition: 'all 0.2s ease'
                }}
              >
                <RotateCcw size={20} />
                <span>Reset</span>
              </button>
            </div>
            <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Track your study sessions and stay focused!
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            💡 Daily Quest
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            "The journey of a thousand miles begins with a single step. What step will you take today?"
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

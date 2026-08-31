import React, { useState } from 'react'
import { Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight, Info } from 'lucide-react'
import './Habits.css'
import { getLevelInfo, calculateStreak, getTodayDateString } from '../utils/defaults'

const Habits = ({ userData, updateUserData }) => {
  const [showModal, setShowModal] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [formData, setFormData] = useState({
    name: '',
    icon: '⭐',
    duration: '',
    xp: 20,
  })

  const iconOptions = ['⭐', '🧘', '📚', '💪', '🏃', '🎯', '✍️', '🎨', '🎵', '💻', '🍎', '💧', '😴', '🧠', '❤️']

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = getTodayDateString()

  const handleOpenModal = (habit = null) => {
    if (habit) {
      setEditingHabit(habit)
      setFormData({
        name: habit.name,
        icon: habit.icon,
        duration: habit.duration,
        xp: habit.xp,
      })
    } else {
      setEditingHabit(null)
      setFormData({
        name: '',
        icon: '⭐',
        duration: '',
        xp: 20,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingHabit(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingHabit) {
      // Edit existing habit
      const updatedHabits = userData.habits.map(h =>
        h.id === editingHabit.id ? { ...h, ...formData } : h
      )
      updateUserData({ ...userData, habits: updatedHabits })
    } else {
      // Add new habit
      const newHabit = {
        id: Date.now().toString(),
        ...formData,
        streak: 0,
        completions: {},
      }
      updateUserData({
        ...userData,
        habits: [...userData.habits, newHabit],
      })
    }

    handleCloseModal()
  }

  const handleDelete = (habitId) => {
    if (confirm('Are you sure you want to delete this habit? All completion history will be lost.')) {
      const habit = userData.habits.find(h => h.id === habitId)

      // Recalculate XP without this habit
      let xpToRemove = 0
      if (habit.completions) {
        Object.keys(habit.completions).forEach(date => {
          if (habit.completions[date]) {
            xpToRemove += habit.xp
          }
        })
      }

      const newXp = Math.max(0, userData.profile.xp - xpToRemove)
      const newLevelInfo = getLevelInfo(newXp)

      const updatedHabits = userData.habits.filter(h => h.id !== habitId)
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
  }

  const handleToggleCompletion = (habitId, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    // Prevent marking future dates
    if (dateStr > today) {
      return
    }

    const habit = userData.habits.find(h => h.id === habitId)
    const completions = habit.completions || {}
    const isCurrentlyCompleted = completions[dateStr]

    // Toggle completion
    const newCompletions = {
      ...completions,
      [dateStr]: !isCurrentlyCompleted,
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

  const isDateCompleted = (habit, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return habit.completions && habit.completions[dateStr]
  }

  const isToday = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return dateStr === today
  }

  const isFutureDate = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return dateStr > today
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const getMonthStats = () => {
    let totalCompletions = 0
    let possibleCompletions = 0

    userData.habits.forEach(habit => {
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        if (dateStr <= today) {
          possibleCompletions++
          if (habit.completions && habit.completions[dateStr]) {
            totalCompletions++
          }
        }
      }
    })

    const completionRate = possibleCompletions > 0
      ? Math.round((totalCompletions / possibleCompletions) * 100)
      : 0

    return { totalCompletions, possibleCompletions, completionRate }
  }

  const stats = getMonthStats()

  return (
    <div className="habits-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="greeting">Habit Tracker</h1>
          <p className="greeting-subtext">Track your daily habits and build consistency</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          Add Habit
        </button>
      </div>

      {userData.habits.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-text">No habits yet</div>
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
              Create your first habit to start tracking your daily progress!
            </p>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <Plus size={20} />
              Create First Habit
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Month Navigation and Stats */}
          <div className="card month-header-card">
            <div className="month-navigation">
              <button className="icon-btn" onClick={handlePrevMonth}>
                <ChevronLeft size={20} />
              </button>
              <h2 className="month-title">
                {monthNames[month]} {year}
              </h2>
              <button className="icon-btn" onClick={handleNextMonth}>
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="month-stats">
              <div className="stat-badge">
                <span className="stat-badge-value">{stats.totalCompletions}</span>
                <span className="stat-badge-label">Completed</span>
              </div>
              <div className="stat-badge">
                <span className="stat-badge-value">{stats.completionRate}%</span>
                <span className="stat-badge-label">Completion Rate</span>
              </div>
              <div className="stat-badge">
                <span className="stat-badge-value">{userData.habits.length}</span>
                <span className="stat-badge-label">Active Habits</span>
              </div>
            </div>
          </div>

          {/* Monthly Habit Tracker Grid */}
          <div className="card tracker-card">
            <div className="tracker-container">
              <div className="tracker-grid-wrapper">
                {/* Header Row - Days */}
                <div className="tracker-header">
                  <div className="tracker-cell habit-name-header">Habit</div>
                  <div className="tracker-days-header">
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                      <div
                        key={day}
                        className={`tracker-day-header ${isToday(day) ? 'today' : ''} ${isFutureDate(day) ? 'future' : ''}`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Habit Rows */}
                <div className="tracker-body">
                  {userData.habits.map(habit => (
                    <div key={habit.id} className="tracker-row">
                      {/* Habit Info */}
                      <div className="tracker-cell habit-info-cell">
                        <div className="habit-info-content">
                          <span className="habit-icon-small">{habit.icon}</span>
                          <div className="habit-details-small">
                            <div className="habit-name-small">{habit.name}</div>
                            <div className="habit-meta-small">
                              {habit.duration} • +{habit.xp} XP • 🔥 {habit.streak}
                            </div>
                          </div>
                          <div className="habit-actions-small">
                            <button
                              className="icon-btn-mini"
                              onClick={() => handleOpenModal(habit)}
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="icon-btn-mini danger"
                              onClick={() => handleDelete(habit.id)}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Completion Checkboxes */}
                      <div className="tracker-days-row">
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                          const completed = isDateCompleted(habit, day)
                          const isTodayDate = isToday(day)
                          const isFuture = isFutureDate(day)

                          return (
                            <div
                              key={day}
                              className={`tracker-checkbox-cell ${completed ? 'completed' : ''} ${isTodayDate ? 'today' : ''} ${isFuture ? 'future' : ''}`}
                              onClick={() => handleToggleCompletion(habit.id, day)}
                              title={`${habit.name} - Day ${day}`}
                            >
                              {completed && <span className="check-icon">✓</span>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="tracker-legend">
              <div className="legend-item">
                <div className="legend-box completed"></div>
                <span>Completed</span>
              </div>
              <div className="legend-item">
                <div className="legend-box today"></div>
                <span>Today</span>
              </div>
              <div className="legend-item">
                <div className="legend-box incomplete"></div>
                <span>Incomplete</span>
              </div>
              <div className="legend-item">
                <div className="legend-box future"></div>
                <span>Future</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add/Edit Habit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingHabit ? 'Edit Habit' : 'Create New Habit'}
              </h2>
              <button className="icon-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Habit Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Morning Meditation"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Icon</label>
                <div className="icon-picker">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, icon })}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Duration / Target Time</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 30 min"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">XP Reward</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.xp}
                  onChange={(e) => setFormData({ ...formData, xp: parseInt(e.target.value) })}
                  min="10"
                  max="100"
                  step="10"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingHabit ? 'Save Changes' : 'Create Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Habits

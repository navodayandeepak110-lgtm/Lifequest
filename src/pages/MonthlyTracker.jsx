import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './MonthlyTracker.css'
import { getMonthKey, getTodayDateString } from '../utils/defaults'

const MonthlyTracker = ({ userData, updateUserData }) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()

  const today = getTodayDateString()
  const currentMonthKey = getMonthKey(year, month)

  const completions = userData.monthlyCompletions || {}
  const monthCompletions = completions[currentMonthKey] || []

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleToggleDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    // Only allow marking today or past dates
    if (dateStr > today) {
      return
    }

    const monthKey = getMonthKey(year, month)
    const currentCompletions = userData.monthlyCompletions || {}
    const monthData = currentCompletions[monthKey] || []

    let updatedMonthData
    if (monthData.includes(dateStr)) {
      updatedMonthData = monthData.filter(d => d !== dateStr)
    } else {
      updatedMonthData = [...monthData, dateStr]
    }

    updateUserData({
      ...userData,
      monthlyCompletions: {
        ...currentCompletions,
        [monthKey]: updatedMonthData,
      },
    })
  }

  const isDateCompleted = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return monthCompletions.includes(dateStr)
  }

  const isToday = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return dateStr === today
  }

  const isFutureDate = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return dateStr > today
  }

  const completionRate = monthCompletions.length > 0
    ? Math.round((monthCompletions.length / daysInMonth) * 100)
    : 0

  const renderCalendar = () => {
    const days = []
    const totalSlots = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7

    // Empty cells before first day
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const completed = isDateCompleted(day)
      const isCurrentDay = isToday(day)
      const isFuture = isFutureDate(day)

      days.push(
        <div
          key={day}
          className={`calendar-day ${completed ? 'completed' : ''} ${isCurrentDay ? 'today' : ''} ${isFuture ? 'future' : ''}`}
          onClick={() => !isFuture && handleToggleDay(day)}
        >
          <span className="day-number">{day}</span>
          {completed && <span className="check-mark">✓</span>}
        </div>
      )
    }

    // Empty cells after last day
    const remaining = totalSlots - days.length
    for (let i = 0; i < remaining; i++) {
      days.push(<div key={`empty-end-${i}`} className="calendar-day empty" />)
    }

    return days
  }

  return (
    <div className="monthly-tracker-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="greeting">Monthly Tracker</h1>
          <p className="greeting-subtext">Track your daily progress throughout the month</p>
        </div>
      </div>

      <div className="card">
        <div className="calendar-header">
          <button className="icon-btn" onClick={handlePrevMonth}>
            <ChevronLeft size={20} />
          </button>
          <h2 className="calendar-month">
            {monthNames[month]} {year}
          </h2>
          <button className="icon-btn" onClick={handleNextMonth}>
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="calendar-stats">
          <div className="stat-item">
            <div className="stat-value">{monthCompletions.length}</div>
            <div className="stat-label">Days Completed</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{completionRate}%</div>
            <div className="stat-label">Completion Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{daysInMonth}</div>
            <div className="stat-label">Total Days</div>
          </div>
        </div>

        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday-label">{day}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {renderCalendar()}
        </div>

        <div className="calendar-legend">
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
    </div>
  )
}

export default MonthlyTracker

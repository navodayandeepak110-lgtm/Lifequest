export const initializeDefaultData = () => {
  const today = new Date().toISOString().split('T')[0]

  return {
    profile: {
      name: 'Adventurer',
      xp: 0,
      level: 1,
    },
    habits: [
      {
        id: '1',
        name: 'Morning Meditation',
        icon: '🧘',
        duration: '10 min',
        xp: 20,
        streak: 0,
        completions: {}, // { '2026-08-01': true, '2026-08-02': true }
      },
      {
        id: '2',
        name: 'Read for 30 minutes',
        icon: '📚',
        duration: '30 min',
        xp: 30,
        streak: 0,
        completions: {},
      },
      {
        id: '3',
        name: 'Exercise',
        icon: '💪',
        duration: '45 min',
        xp: 50,
        streak: 0,
        completions: {},
      },
    ],
    goals: [
      {
        id: '1',
        name: 'Learn a new skill',
        type: 'Learning',
        dueDate: getDateInFuture(30),
        progress: 25,
        completed: false,
      },
      {
        id: '2',
        name: 'Complete fitness challenge',
        type: 'Health',
        dueDate: getDateInFuture(60),
        progress: 40,
        completed: false,
      },
    ],
    weeklyProgress: initializeWeeklyProgress(),
  }
}

const getDateInFuture = (days) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

const initializeWeeklyProgress = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date().getDay()

  return days.map((day, index) => ({
    day,
    completed: false,
    isToday: index === today,
  }))
}

export const getLevelInfo = (xp) => {
  const levels = [
    { level: 1, title: 'Beginner', xpRequired: 0 },
    { level: 2, title: 'Explorer', xpRequired: 100 },
    { level: 3, title: 'Adventurer', xpRequired: 250 },
    { level: 4, title: 'Achiever', xpRequired: 500 },
    { level: 5, title: 'Champion', xpRequired: 1000 },
    { level: 6, title: 'Master', xpRequired: 2000 },
    { level: 7, title: 'Legend', xpRequired: 4000 },
  ]

  let currentLevel = levels[0]
  let nextLevel = levels[1]

  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].xpRequired) {
      currentLevel = levels[i]
      nextLevel = levels[i + 1] || { ...levels[i], xpRequired: levels[i].xpRequired + 5000 }
    } else {
      break
    }
  }

  const xpInCurrentLevel = xp - currentLevel.xpRequired
  const xpNeededForNextLevel = nextLevel.xpRequired - currentLevel.xpRequired
  const progressPercent = (xpInCurrentLevel / xpNeededForNextLevel) * 100

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    xp,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    progressPercent: Math.min(progressPercent, 100),
    nextLevel: nextLevel.level,
    nextTitle: nextLevel.title,
  }
}

export const getGreeting = () => {
  const hour = new Date().getHours()

  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
}

export const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0]
}

export const getMonthKey = (year, month) => {
  return `${year}-${String(month + 1).padStart(2, '0')}`
}

export const calculateStreak = (completions) => {
  if (!completions || Object.keys(completions).length === 0) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let streak = 0
  let checkDate = new Date(today)

  // Check if completed today or yesterday to start streak
  const todayStr = getTodayDateString()
  const yesterdayDate = new Date(today)
  yesterdayDate.setDate(yesterdayDate.getDate() - 1)
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0]

  if (!completions[todayStr] && !completions[yesterdayStr]) {
    return 0
  }

  // If not completed today but completed yesterday, start from yesterday
  if (!completions[todayStr] && completions[yesterdayStr]) {
    checkDate = new Date(yesterdayDate)
  }

  // Count backwards
  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0]
    if (completions[dateStr]) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

export const recalculateXP = (habits) => {
  let totalXP = 0
  const today = getTodayDateString()

  habits.forEach(habit => {
    if (habit.completions) {
      Object.keys(habit.completions).forEach(date => {
        if (habit.completions[date]) {
          totalXP += habit.xp
        }
      })
    }
  })

  return totalXP
}

// Migrate old data format to new format
export const migrateUserData = (oldData) => {
  if (!oldData) return null

  const migratedData = { ...oldData }

  // Migrate habits from old format to new format
  if (migratedData.habits) {
    migratedData.habits = migratedData.habits.map(habit => {
      // If habit already has completions object, it's already migrated
      if (habit.completions && typeof habit.completions === 'object') {
        return habit
      }

      // Migrate from old format
      const completions = {}

      // If old format had completed and lastCompleted fields
      if (habit.lastCompleted && habit.completed) {
        completions[habit.lastCompleted] = true
      }

      // Remove old fields and add new structure
      const { completed, lastCompleted, ...rest } = habit
      return {
        ...rest,
        completions,
        streak: habit.streak || 0,
      }
    })
  }

  // Remove old monthlyCompletions field if it exists
  if (migratedData.monthlyCompletions) {
    delete migratedData.monthlyCompletions
  }

  // Recalculate XP based on all completions
  const totalXP = recalculateXP(migratedData.habits)
  const levelInfo = getLevelInfo(totalXP)

  migratedData.profile = {
    ...migratedData.profile,
    xp: totalXP,
    level: levelInfo.level,
  }

  // Recalculate streaks for all habits
  migratedData.habits = migratedData.habits.map(habit => ({
    ...habit,
    streak: calculateStreak(habit.completions || {}),
  }))

  return migratedData
}

import React, { useState, useEffect } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Habits from './pages/Habits'
import Goals from './pages/Goals'
import Profile from './pages/Profile'
import { useLocalStorage } from './hooks/useLocalStorage'
import { initializeDefaultData, migrateUserData } from './utils/defaults'

function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'dark')
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [userData, setUserData] = useLocalStorage('userData', initializeDefaultData())

  // Apply migration on first load
  useEffect(() => {
    const migratedData = migrateUserData(userData)
    if (migratedData && JSON.stringify(migratedData) !== JSON.stringify(userData)) {
      setUserData(migratedData)
    }
  }, []) // Only run once on mount

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const updateUserData = (newData) => {
    setUserData(newData)
  }

  const resetData = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      setUserData(initializeDefaultData())
      alert('All data has been reset!')
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard userData={userData} updateUserData={updateUserData} />
      case 'habits':
        return <Habits userData={userData} updateUserData={updateUserData} />
      case 'goals':
        return <Goals userData={userData} updateUserData={updateUserData} />
      case 'profile':
        return <Profile
          userData={userData}
          updateUserData={updateUserData}
          theme={theme}
          toggleTheme={toggleTheme}
          resetData={resetData}
        />
      default:
        return <Dashboard userData={userData} updateUserData={updateUserData} />
    }
  }

  return (
    <div className="app">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        userData={userData}
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App

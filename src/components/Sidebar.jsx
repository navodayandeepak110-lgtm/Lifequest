import React from 'react'
import { Home, CheckSquare, Calendar, Target, User } from 'lucide-react'
import './Sidebar.css'

const Sidebar = ({ currentPage, setCurrentPage, userData }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'habits', label: 'Habits', icon: CheckSquare },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">LifeQuest</span>
        </div>
        <p className="tagline">Small actions. Big transformation.</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {userData.profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <div className="user-name">{userData.profile.name}</div>
            <div className="user-level">Level {userData.profile.level}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

import React, { useState } from 'react'
import { Moon, Sun, User, Mail, Shield, RefreshCw } from 'lucide-react'
import './Profile.css'
import { getLevelInfo } from '../utils/defaults'

const Profile = ({ userData, updateUserData, theme, toggleTheme, resetData }) => {
  const [name, setName] = useState(userData.profile.name)
  const levelInfo = getLevelInfo(userData.profile.xp)

  const handleSaveName = () => {
    if (name.trim()) {
      updateUserData({
        ...userData,
        profile: {
          ...userData.profile,
          name: name.trim(),
        },
      })
      alert('Profile updated successfully!')
    }
  }

  return (
    <div className="profile-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="greeting">Profile & Settings</h1>
          <p className="greeting-subtext">Manage your account and preferences</p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="card profile-card">
          <div className="profile-avatar-large">
            {userData.profile.name.charAt(0).toUpperCase()}
          </div>

          <div className="profile-info">
            <h2 className="profile-name">{userData.profile.name}</h2>
            <p className="profile-title">{levelInfo.title}</p>
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <div className="stat-value-large">{levelInfo.level}</div>
              <div className="stat-label-small">Level</div>
            </div>
            <div className="profile-stat">
              <div className="stat-value-large">{userData.profile.xp}</div>
              <div className="stat-label-small">Total XP</div>
            </div>
            <div className="profile-stat">
              <div className="stat-value-large">{userData.habits.length}</div>
              <div className="stat-label-small">Habits</div>
            </div>
            <div className="profile-stat">
              <div className="stat-value-large">{userData.goals.length}</div>
              <div className="stat-label-small">Goals</div>
            </div>
          </div>

          <div className="xp-section">
            <div className="xp-label">
              Level {levelInfo.level} → {levelInfo.nextLevel}
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <div className="xp-info">
              {levelInfo.xpInCurrentLevel} / {levelInfo.xpNeededForNextLevel} XP
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="card">
            <h3 className="card-title">
              <User size={20} />
              Personal Information
            </h3>

            <div className="form-group">
              <label className="form-label">Display Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <button className="btn btn-primary" onClick={handleSaveName}>
              Save Changes
            </button>
          </div>

          <div className="card">
            <h3 className="card-title">
              <Shield size={20} />
              Appearance
            </h3>

            <div className="theme-toggle-container">
              <div className="theme-info">
                <div className="theme-label">Theme</div>
                <div className="theme-description">
                  {theme === 'dark' ? 'Dark mode is active' : 'Light mode is active'}
                </div>
              </div>
              <button className="theme-toggle" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">
              <RefreshCw size={20} />
              Data Management
            </h3>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Reset all your data including habits, goals, and progress. This action cannot be undone.
            </p>

            <button className="btn btn-danger" onClick={resetData}>
              <RefreshCw size={18} />
              Reset All Data
            </button>
          </div>

          <div className="card">
            <h3 className="card-title">
              <Mail size={20} />
              About LifeQuest
            </h3>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              LifeQuest is a gamified productivity app that helps you build better habits,
              achieve your goals, and level up your life. Track your progress, earn XP,
              and unlock achievements as you transform your daily routine.
            </p>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Version 1.0.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

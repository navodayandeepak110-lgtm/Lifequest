import React, { useState } from 'react'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import './Goals.css'

const Goals = ({ userData, updateUserData }) => {
  const [showModal, setShowModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'Personal',
    dueDate: '',
    progress: 0,
  })

  const goalTypes = ['Personal', 'Health', 'Learning', 'Career', 'Finance', 'Fitness', 'Creative', 'Social']

  const handleOpenModal = (goal = null) => {
    if (goal) {
      setEditingGoal(goal)
      setFormData({
        name: goal.name,
        type: goal.type,
        dueDate: goal.dueDate,
        progress: goal.progress,
      })
    } else {
      setEditingGoal(null)
      setFormData({
        name: '',
        type: 'Personal',
        dueDate: '',
        progress: 0,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingGoal(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingGoal) {
      const updatedGoals = userData.goals.map(g =>
        g.id === editingGoal.id ? { ...g, ...formData } : g
      )
      updateUserData({ ...userData, goals: updatedGoals })
    } else {
      const newGoal = {
        id: Date.now().toString(),
        ...formData,
        completed: false,
      }
      updateUserData({
        ...userData,
        goals: [...userData.goals, newGoal],
      })
    }

    handleCloseModal()
  }

  const handleDelete = (goalId) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      const updatedGoals = userData.goals.filter(g => g.id !== goalId)
      updateUserData({ ...userData, goals: updatedGoals })
    }
  }

  const handleToggleComplete = (goalId) => {
    const updatedGoals = userData.goals.map(g =>
      g.id === goalId ? { ...g, completed: !g.completed, progress: g.completed ? g.progress : 100 } : g
    )
    updateUserData({ ...userData, goals: updatedGoals })
  }

  const getDaysRemaining = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const activeGoals = userData.goals.filter(g => !g.completed)
  const completedGoals = userData.goals.filter(g => g.completed)

  return (
    <div className="goals-page fade-in">
      <div className="page-header">
        <div>
          <h1 className="greeting">Goals</h1>
          <p className="greeting-subtext">Set your targets and track your progress</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          Add Goal
        </button>
      </div>

      <div className="goals-section">
        <h2 className="section-title">Active Goals ({activeGoals.length})</h2>

        {activeGoals.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">🎯</div>
              <div className="empty-text">No active goals</div>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                Create your first goal to start tracking your progress!
              </p>
              <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                <Plus size={20} />
                Create First Goal
              </button>
            </div>
          </div>
        ) : (
          <div className="goals-grid">
            {activeGoals.map(goal => {
              const daysRemaining = getDaysRemaining(goal.dueDate)
              const isOverdue = daysRemaining < 0

              return (
                <div key={goal.id} className="goal-card">
                  <div className="goal-card-header">
                    <span className={`goal-type ${goal.type.toLowerCase()}`}>
                      {goal.type}
                    </span>
                    <div className="goal-card-actions">
                      <button
                        className="icon-btn"
                        onClick={() => handleOpenModal(goal)}
                        title="Edit goal"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="icon-btn danger"
                        onClick={() => handleDelete(goal.id)}
                        title="Delete goal"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h3 className="goal-card-name">{goal.name}</h3>

                  <div className="goal-due-date">
                    <span className={isOverdue ? 'overdue' : ''}>
                      {isOverdue
                        ? `Overdue by ${Math.abs(daysRemaining)} days`
                        : daysRemaining === 0
                        ? 'Due today'
                        : daysRemaining === 1
                        ? 'Due tomorrow'
                        : `${daysRemaining} days remaining`}
                    </span>
                  </div>

                  <div className="goal-progress">
                    <div className="progress-header">
                      <span>Progress</span>
                      <span className="progress-percent">{goal.progress}%</span>
                    </div>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>

                  <button
                    className="btn btn-success"
                    onClick={() => handleToggleComplete(goal.id)}
                  >
                    Mark as Complete
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {completedGoals.length > 0 && (
        <div className="goals-section">
          <h2 className="section-title">Completed Goals ({completedGoals.length})</h2>
          <div className="goals-grid">
            {completedGoals.map(goal => (
              <div key={goal.id} className="goal-card completed">
                <div className="goal-card-header">
                  <span className={`goal-type ${goal.type.toLowerCase()}`}>
                    {goal.type}
                  </span>
                  <div className="goal-card-actions">
                    <button
                      className="icon-btn danger"
                      onClick={() => handleDelete(goal.id)}
                      title="Delete goal"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="goal-card-name">
                  <span className="completed-checkmark">✓</span>
                  {goal.name}
                </h3>

                <button
                  className="btn btn-secondary"
                  onClick={() => handleToggleComplete(goal.id)}
                >
                  Mark as Active
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingGoal ? 'Edit Goal' : 'Create New Goal'}
              </h2>
              <button className="icon-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Goal Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Learn React"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Goal Type</label>
                <select
                  className="form-input"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  {goalTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Progress ({formData.progress}%)</label>
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingGoal ? 'Save Changes' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Goals

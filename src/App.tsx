import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/AppShell'

import Dashboard from './pages/Dashboard'
import Workouts from './pages/Workouts'
import ExerciseDetail from './pages/ExerciseDetail'
import AIGenerator from './pages/AIGenerator'
import Nutrition from './pages/Nutrition'
import Progress from './pages/Progress'
import Challenges from './pages/Challenges'
import Community from './pages/Community'
import AICoach from './pages/AICoach'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      <Route path="/app" element={<AppShell />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="workouts" element={<Workouts />} />
        <Route path="workouts/:id" element={<ExerciseDetail />} />
        <Route path="ai-generator" element={<AIGenerator />} />
        <Route path="nutrition" element={<Nutrition />} />
        <Route path="progress" element={<Progress />} />
        <Route path="challenges" element={<Challenges />} />
        <Route path="community" element={<Community />} />
        <Route path="ai-coach" element={<AICoach />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="admin" element={<Admin />} />
      </Route>
      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  )
}

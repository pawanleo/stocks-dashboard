import Dashboard from './components/Dashboard'
import LoginView from './components/LoginView'
import SignupView from './components/SignupView'
import LandingView from './components/LandingView'
import HomeGrid from './components/HomeGrid'
import PriceChart from './components/PriceChart'
import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingView />} />
      <Route path="/login" element={<LoginView />} />
      <Route path="/signup" element={<SignupView />} />
      <Route path="/stocks" element={<Dashboard />}>
         <Route index element={<HomeGrid />} />
         <Route path=":symbol" element={<PriceChart />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App

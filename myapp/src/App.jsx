import './App.css'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'

function App() {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  )
}

export default App

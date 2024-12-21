import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useLocation,
} from 'react-router-dom'
import './Styles/index.css'
import Header from './Components/Header.jsx'
import HomePage from './Pages/HomePage.jsx'
import RegisterPage from './Pages/RegisterPage.jsx'
import LoginPage from './Pages/LoginPage.jsx'
import ProfilePage from './Pages/ProfilePage.jsx'
import { AuthProvider } from './Context/AuthContext'

function App() {
    const location = useLocation()
    const hideHeaderPaths = ['/register', '/login']
    const showHeader = !hideHeaderPaths.includes(location.pathname)

    return (
        <AuthProvider>
            {showHeader && <Header />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </AuthProvider>
    )
}

export default function Root() {
    return (
        <Router>
            <App />
        </Router>
    )
}

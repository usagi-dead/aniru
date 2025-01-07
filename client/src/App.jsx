import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useLocation,
} from 'react-router-dom'
import './Styles/index.css'
import Header from './Components/Header/Header.jsx'
import HomePage from './Pages/HomePage.jsx'
import RegisterPage from './Pages/RegisterPage.jsx'
import LoginPage from './Pages/LoginPage.jsx'
import ProfilePage from './Pages/ProfilePage.jsx'
import AnimePage from './Pages/AnimePage'
import { UserProvider } from './Context/UserProvider'

function App() {
    const location = useLocation()
    const hideHeaderPaths = ['/register', '/login']
    const showHeader = !hideHeaderPaths.includes(location.pathname)

    return (
        <UserProvider>
            {showHeader && <Header />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/anime/:id" element={<AnimePage />} />
            </Routes>
        </UserProvider>
    )
}

export default function Root() {
    return (
        <Router>
            <App />
        </Router>
    )
}

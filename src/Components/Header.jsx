import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import '../Styles/Header.css'
import Search from './Search'

const Header = () => {
    const { user, logout } = useContext(AuthContext)
    const [animation, setAnimation] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    setTimeout(() => {
        setAnimation(true)
    }, 600)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <header className={`${animation ? 'active' : ''}`}>
            <div className={`header-back ${scrolled ? 'scrolled' : ''}`}>
                <div className="header-align container">
                    <Link to="/">
                        <img src="/aniru.svg" alt="aniru" className="logo" />
                    </Link>

                    <Search />

                    <div className="buttons-container">
                        {user ? (
                            <>
                                <Link to="/profile">
                                    <button className="standard-input button">
                                        Профиль
                                    </button>
                                </Link>
                                <button
                                    className="standard-input button"
                                    onClick={logout}
                                >
                                    Выйти
                                </button>
                            </>
                        ) : (
                            <Link to="/login">
                                <button className="standard-input button">
                                    Войти
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header

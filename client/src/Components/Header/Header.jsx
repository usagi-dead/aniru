// Header.jsx
import React, { useEffect, useState } from 'react'
import usePageTransition from '../../Hooks/usePageTransition.jsx'
import { useUser } from '../../Context/UserProvider.jsx'
import '../../Styles/Header.css'
import Search from './Search.jsx'

const Header = () => {
    const { user } = useUser()
    const [animation, setAnimation] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { handleSwitch } = usePageTransition()

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
                    <img
                        src="/logo/aniru.svg"
                        alt="aniru"
                        className="logo"
                        onClick={() => handleSwitch('/')}
                    />

                    <Search />

                    {user ? (
                        <div className="buttons-container">
                            {user.role === 'admin' && (
                                <button
                                    className="standard-input button"
                                    onClick={() => handleSwitch('/admin')}
                                >
                                    Админка
                                </button>
                            )}
                            <button
                                className="standard-input button"
                                onClick={() => handleSwitch('/profile')}
                            >
                                Профиль
                            </button>
                        </div>
                    ) : (
                        <button
                            className="standard-input button"
                            onClick={() => handleSwitch('/login')}
                        >
                            Войти
                        </button>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header

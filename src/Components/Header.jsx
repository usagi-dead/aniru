import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import '../Styles/Header.css'
import Search from './Search'

const Header = () => {
    const { user, logout } = useContext(AuthContext)

    return (
        <header>
            <div className="header-back">
                <div className="header-align container">
                    <Link to="/">
                        <img src="/aniru.svg" alt="aniru" className="logo" />
                    </Link>

                    <Search />

                    {user ? (
                        <>
                            <Link to="/profile">
                                <button className="standard-input button">
                                    Профиль
                                </button>
                            </Link>
                            {/*<button*/}
                            {/*    className="standard-input button"*/}
                            {/*    onClick={logout}*/}
                            {/*>*/}
                            {/*    Выйти*/}
                            {/*</button>*/}
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
        </header>
    )
}

export default Header

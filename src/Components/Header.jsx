import React, { useEffect, useState } from 'react'
import '../Styles/Header.css'

const AnimeCatalog = () => {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY
            setIsScrolled(scrollTop > 0)
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <header>
            <div className={`header-back ${isScrolled ? 'scrolled' : ''}`}>
                <div className="header-align container">
                    <img src="/aniru.svg" alt="aniru" className="logo" />

                    <search>
                        <form action="./search/">
                            <input
                                type="search"
                                id="anime"
                                name="q"
                                placeholder="Поиск"
                                className="standard-input"
                            />
                            <img
                                src="/search.svg"
                                alt="🔍"
                                className="search-icon"
                            />
                        </form>
                    </search>

                    <button className="standard-input button">Войти</button>
                </div>
            </div>
        </header>
    )
}

export default AnimeCatalog

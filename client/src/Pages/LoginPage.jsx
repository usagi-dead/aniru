import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../Context/AuthContext'
import usePageTransition from '../Hooks/usePageTransition'
import Message from '../Components/Message'
import '../Styles/Auth.css'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [errorCheck, setErrorCheck] = useState(false)
    const [messageCheck, setMessageCheck] = useState(false)
    const { login } = useContext(AuthContext)
    const { handleSwitch } = usePageTransition()

    useEffect(() => {
        document.body.style.overflow = 'hidden'
    }, [])

    const validateForm = () => {
        if (password.length < 6) {
            setError('Пароль должен содержать минимум 6 символов')
            setErrorCheck(true)
            return false
        } else {
            return true
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })

        if (response.ok) {
            const data = await response.json()
            setSuccess(data.message)
            setMessageCheck(true)
            setTimeout(() => {
                login(data)
                handleSwitch('/profile')
            }, 1200)
        } else {
            const data = await response.json()
            setErrorCheck(true)
            setError(data.error)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        if (name === 'username') setUsername(value)
        if (name === 'password') setPassword(value)

        setErrorCheck(false)
    }

    return (
        <section className={`auth-container`}>
            <form onSubmit={handleSubmit}>
                <img
                    src="/logo/aniru.svg"
                    alt="aniru"
                    className="logo"
                    onClick={() => handleSwitch('/')}
                />
                <input
                    type="text"
                    name="username"
                    placeholder="Логин"
                    value={username}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">Войти</button>
                <button
                    type="button"
                    onClick={() => handleSwitch('/register', true)}
                    className="move-button"
                >
                    Создать аккаунт
                </button>
            </form>

            <Message text={error} type="error" isVisible={errorCheck} />
            <Message text={success} type="success" isVisible={messageCheck} />
        </section>
    )
}

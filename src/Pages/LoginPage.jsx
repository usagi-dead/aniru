import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import Message from '../Components/Message'
import '../Styles/Auth.css'

export default function LoginPage() {
    const [isClosing, setIsClosing] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [errorCheck, setErrorCheck] = useState(true)
    const [messageCheck, setMessageCheck] = useState(true)
    const navigate = useNavigate()
    const { login } = useContext(AuthContext)

    useEffect(() => {
        document.body.style.overflow = 'hidden'
    }, [])

    const handleSwitch = (url) => {
        setIsClosing(true)
        setErrorCheck(false)
        setTimeout(() => {
            navigate(url)
        }, 600)
    }

    const validateForm = () => {
        if (password.length < 6) {
            setError('Пароль должен содержать минимум 6 символов.')
            return false
        } else {
            setError('')
            return true
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorCheck(true)

        if (!validateForm()) return

        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })

        if (response.ok) {
            const data = await response.json()
            setSuccess('Авторизация прошла успешно!')
            setTimeout(() => {
                login(data)
                setIsClosing(true)
                setMessageCheck(false)
                setTimeout(() => {
                    navigate('/profile')
                }, 600)
            }, 1200)
        } else {
            const data = await response.json()
            setError(data.error || 'Неверный логин или пароль.')
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        if (name === 'username') setUsername(value)
        if (name === 'password') setPassword(value)

        setErrorCheck(false)
        setTimeout(() => {
            setErrorCheck(true)
        }, 600)
    }

    return (
        <section>
            <form
                onSubmit={handleSubmit}
                className={`auth-container ${isClosing ? 'closing' : ''}`}
            >
                <img
                    src="/aniru.svg"
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
                    onClick={() => handleSwitch('/register')}
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

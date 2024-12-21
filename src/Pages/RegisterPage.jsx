import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Message from '../Components/Message'
import '../Styles/Auth.css'

export default function RegisterPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isClosing, setIsClosing] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [errorCheck, setErrorCheck] = useState(true)
    const [messageCheck, setMessageCheck] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        document.body.style.overflow = 'hidden'
    }, [])

    const handleSetError = (msg) => {
        setError(msg)
    }

    const handleSwitch = (url) => {
        setIsClosing(true)
        setErrorCheck(false)
        setTimeout(() => {
            navigate(url)
        }, 600)
    }

    const validateForm = () => {
        if (password.length < 6) {
            handleSetError('Пароль должен содержать минимум 6 символов.')
            return false
        } else if (password !== confirmPassword) {
            handleSetError('Пароли не совпадают.')
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

        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })

        if (response.ok) {
            setSuccess('Регистрация прошла успешно!')
            setTimeout(() => {
                setIsClosing(true)
                setMessageCheck(false)
                setTimeout(() => {
                    navigate('/login')
                }, 600)
            }, 1200)
        } else {
            const data = await response.json()
            handleSetError(data.error || 'Ошибка регистрации.')
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        if (name === 'username') setUsername(value)
        if (name === 'password') setPassword(value)
        if (name === 'confirmPassword') setConfirmPassword(value)

        setErrorCheck(false)
        setTimeout(() => {
            setErrorCheck(true)
        }, 600)
    }

    return (
        <section>
            <form
                className={`auth-container ${isClosing ? 'closing' : ''}`}
                onSubmit={handleSubmit}
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

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Повторите пароль"
                    value={confirmPassword}
                    onChange={handleInputChange}
                    required
                />

                <button type="submit">Создать аккаунт</button>

                <button
                    type="button"
                    onClick={() => handleSwitch('/login')}
                    className="move-button"
                >
                    Войти
                </button>
            </form>

            <Message text={error} type="error" isVisible={errorCheck} />
            <Message text={success} type="success" isVisible={messageCheck} />
        </section>
    )
}

import React, { useEffect, useState } from 'react'
import usePageTransition from '../Hooks/usePageTransition'
import Message from '../Components/Message'
import '../Styles/Auth.css'

export default function RegisterPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [errorCheck, setErrorCheck] = useState(false)
    const [messageCheck, setMessageCheck] = useState(false)
    const { handleSwitch } = usePageTransition()

    useEffect(() => {
        document.body.style.overflow = 'hidden'
    }, [])

    const handleSetError = (msg) => {
        setError(msg)
    }

    const validateForm = () => {
        if (password.length < 6) {
            handleSetError('Пароль должен содержать минимум 6 символов')
            setErrorCheck(true)
            return false
        } else if (password !== confirmPassword) {
            handleSetError('Пароли не совпадают')
            setErrorCheck(true)
            return false
        } else {
            return true
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })

        if (response.ok) {
            const data = await response.json()
            setSuccess(data.message)
            setMessageCheck(true)
            setTimeout(() => {
                handleSwitch('/login')
            }, 1200)
        } else {
            const data = await response.json()
            handleSetError(data.error || 'Ошибка регистрации')
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        if (name === 'username') setUsername(value)
        if (name === 'password') setPassword(value)
        if (name === 'confirmPassword') setConfirmPassword(value)

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
                    onClick={() => handleSwitch('/login', true)}
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

import React, { useEffect, useState } from 'react'
import { useUser } from '../Context/UserProvider.jsx'
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
    const { login } = useUser()
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

        try {
            const data = await login(username, password)

            setSuccess('Успешный вход!')
            setMessageCheck(true)

            setTimeout(() => {
                handleSwitch('/profile')
            }, 1200)
        } catch (err) {
            // Если ошибка при входе, показываем ошибку
            setErrorCheck(true)
            setError(err.response ? err.response.data.error : 'Ошибка входа')
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

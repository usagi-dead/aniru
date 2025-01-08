import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import API_BASE_URL from '../config'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [favorites, setFavorites] = useState([])
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Получение отзывов пользователя
    const getUserReviews = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/users/reviews`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            )
            setReviews(response.data)
        } catch (err) {
            setError(
                err.response
                    ? err.response.data.error
                    : 'Error fetching reviews'
            )
        }
    }

    // Обновление данных пользователя
    const updateUserData = async (newUserData, avatar) => {
        try {
            const formData = new FormData()
            formData.append('username', newUserData.username)
            formData.append('description', newUserData.description)
            if (avatar) {
                formData.append('avatar', avatar) // Добавляем файл аватарки
            }

            const response = await axios.put(
                `${API_BASE_URL}/api/users/profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )

            // Обновляем данные пользователя в состоянии
            setUser((prevUser) => ({
                ...prevUser,
                ...newUserData,
                avatar: response.data.avatarUrl || prevUser.avatar,
            }))
        } catch (err) {
            setError(
                err.response
                    ? err.response.data.error
                    : 'Error updating user profile'
            )
        }
    }

    // Получение профиля пользователя
    const getUserProfile = async () => {
        try {
            setLoading(true)
            const response = await axios.get(
                `${API_BASE_URL}/api/users/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            )
            setUser(response.data)
            setLoading(false)
        } catch (err) {
            setError(
                err.response
                    ? err.response.data.error
                    : 'Error fetching user profile'
            )
            setLoading(false)
        }
    }

    // Получение избранных аниме
    const getUserFavorites = async () => {
        try {
            setLoading(true)
            const response = await axios.get(
                `${API_BASE_URL}/api/users/favorites`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            )
            setFavorites(response.data)
            setLoading(false)
        } catch (err) {
            setError(
                err.response
                    ? err.response.data.error
                    : 'Error fetching favorites'
            )
            setLoading(false)
        }
    }

    // Добавление аниме в избранное
    const addToFavorites = async (animeId) => {
        try {
            await axios.post(
                `${API_BASE_URL}/api/users/favorites`,
                { animeId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            )
            getUserFavorites() // Обновляем список избранных
        } catch (err) {
            setError(
                err.response
                    ? err.response.data.error
                    : 'Error adding to favorites'
            )
        }
    }

    // Удаление аниме из избранного
    const removeFromFavorites = async (animeId) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/users/favorites`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                data: { animeId },
            })
            // Обновляем список избранных после удаления
            setFavorites((prevFavorites) =>
                prevFavorites.filter((anime) => anime.id !== animeId)
            )
        } catch (err) {
            setError(
                err.response
                    ? err.response.data.error
                    : 'Error removing from favorites'
            )
        }
    }

    // Регистрация пользователя
    const register = async (username, password) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/auth/register`,
                {
                    username,
                    password,
                }
            )
            // Не сохраняем токен
            setError(null)
            return response.data.message
        } catch (err) {
            setError(
                err.response
                    ? err.response.data.error
                    : 'Ошибка при регистрации'
            )
        }
    }

    // Логин пользователя
    const login = async (username, password) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/auth/login`,
                {
                    username,
                    password,
                }
            )
            localStorage.setItem('token', response.data.token)
            getUserProfile()
            getUserFavorites()
        } catch (err) {
            throw err
        }
    }

    // Выход из системы
    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
        setFavorites([])
    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getUserProfile()
            getUserFavorites()
            getUserReviews()
        }
    }, [])

    return (
        <UserContext.Provider
            value={{
                user,
                reviews,
                favorites,
                loading,
                error,
                register,
                login,
                logout,
                updateUserData,
                getUserReviews,
                addToFavorites,
                removeFromFavorites,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => React.useContext(UserContext)

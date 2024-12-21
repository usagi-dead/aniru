// src/Context/AuthContext.js
import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [reviews, setReviews] = useState([])
    const [favorites, setFavorites] = useState([])

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            const userData = JSON.parse(storedUser)
            setUser(userData)
            fetchUserReviews(userData.id)
            fetchUserFavorites(userData.id)
        }
    }, [])

    // Функция для загрузки отзывов пользователя
    const fetchUserReviews = async (userId) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/user/${userId}/reviews`
            )
            setReviews(response.data)
        } catch (error) {
            console.error('Ошибка при получении отзывов:', error)
        }
    }

    // Функция для загрузки избранных аниме пользователя
    const fetchUserFavorites = async (userId) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/user/${userId}/favorites`
            )
            setFavorites(response.data)
        } catch (error) {
            console.error('Ошибка при получении избранных аниме:', error)
        }
    }

    const login = (userData) => {
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        // Загружаем данные о пользователе
        fetchUserReviews(userData.id)
        fetchUserFavorites(userData.id)
    }

    const logout = () => {
        setUser(null)
        setReviews([])
        setFavorites([])
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider
            value={{ user, reviews, favorites, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    )
}

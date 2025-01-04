import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [reviews, setReviews] = useState([])
    const [favorites, setFavorites] = useState([])

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        const token = Cookies.get('token')
        if (storedUser && token) {
            const userData = JSON.parse(storedUser)
            setUser(userData)
            fetchUserReviews(userData.id, token)
            fetchUserFavorites(userData.id, token)
        }
    }, [])

    const fetchUserReviews = async (userId, token) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/user/${userId}/reviews`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setReviews(response.data)
        } catch (error) {
            console.error('Ошибка при получении отзывов:', error)
        }
    }

    const fetchUserFavorites = async (userId, token) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/user/${userId}/favorites`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setFavorites(response.data)
        } catch (error) {
            console.error('Ошибка при получении избранных аниме:', error)
        }
    }

    const login = (userData) => {
        setUser(userData.user)
        localStorage.setItem('user', JSON.stringify(userData.user))
        Cookies.set('token', userData.token, {
            expires: 1,
            sameSite: 'None',
            secure: true,
        })
        fetchUserReviews(userData.user.id, userData.token)
        fetchUserFavorites(userData.user.id, userData.token)
    }

    const logout = () => {
        setUser(null)
        setReviews([])
        setFavorites([])
        localStorage.removeItem('user')
        Cookies.remove('token')
    }

    const updateUserData = async (userId, updatedData) => {
        const token = Cookies.get('token')
        if (!token) {
            console.error('Нет токена для обновления данных пользователя')
            return
        }

        try {
            const response = await axios.put(
                `http://localhost:5000/api/user/${userId}`,
                updatedData,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            const updatedUser = { ...user, ...updatedData }
            setUser(updatedUser)
            localStorage.setItem('user', JSON.stringify(updatedUser))
            console.log(response.data.message)
        } catch (error) {
            console.error('Ошибка при обновлении данных пользователя:', error)
        }
    }

    const addFavorite = async (animeId) => {
        const token = Cookies.get('token')
        if (!token) {
            console.error('Нет токена для добавления в избранное')
            return
        }

        try {
            const response = await axios.post(
                `http://localhost:5000/api/user/${user.id}/favorites/${animeId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setFavorites((prevFavorites) => [...prevFavorites, { id: animeId }])
            console.log(response.data.message)
        } catch (error) {
            console.error(
                'Ошибка при добавлении в избранное:',
                error.response?.data || error.message
            )
        }
    }

    const removeFavorite = async (animeId) => {
        const token = Cookies.get('token')
        if (!token) {
            console.error('Нет токена для удаления из избранного')
            return
        }

        try {
            const response = await axios.delete(
                `http://localhost:5000/api/user/${user.id}/favorites/${animeId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setFavorites((prevFavorites) =>
                prevFavorites.filter((favorite) => favorite.id !== animeId)
            )
            console.log(response.data.message)
        } catch (error) {
            console.error('Ошибка при удалении из избранного:', error)
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                reviews,
                favorites,
                setReviews,
                setFavorites, // Добавьте setFavorites сюда
                login,
                logout,
                updateUserData,
                addFavorite,
                removeFavorite,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

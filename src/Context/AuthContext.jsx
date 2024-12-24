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
        Cookies.set('token', userData.token, { expires: 1 })
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

    return (
        <AuthContext.Provider
            value={{
                user,
                reviews,
                favorites,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

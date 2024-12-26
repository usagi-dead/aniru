import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import Cookies from 'js-cookie'
import '../Styles/AnimePage/AnimePage.css'
import AnimeRating from '../Components/AnimeRating.jsx'

export default function AnimePage() {
    const { id } = useParams()
    const {
        user,
        favorites,
        reviews,
        setReviews,
        addFavorite,
        removeFavorite,
    } = useContext(AuthContext)
    const [anime, setAnime] = useState(null)
    const [newReview, setNewReview] = useState({ rating: '', review: '' })
    const [error, setError] = useState(null)
    const [isFavorite, setIsFavorite] = useState(false) // Локальное состояние для кнопки

    // Загружаем информацию о аниме и отзывах
    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/anime/${id}`)
            .then((response) => setAnime(response.data))
            .catch((error) => console.error('Error fetching anime:', error))

        axios
            .get(`http://localhost:5000/api/anime/${id}/reviews`)
            .then((response) => setReviews(response.data))
            .catch((error) => console.error('Error fetching reviews:', error))

        // Проверяем, есть ли это аниме в избранном
        setIsFavorite(favorites.some((fav) => fav.id === parseInt(id)))
    }, [id, favorites, setReviews])

    // Обработчик добавления/удаления из избранного
    const toggleFavorite = async () => {
        if (!user) {
            console.error('Пользователь не авторизован')
            return
        }

        if (isFavorite) {
            await removeFavorite(id) // Удаляем из избранного
        } else {
            await addFavorite(id) // Добавляем в избранное
        }

        // Обновляем локальное состояние сразу после операции
        setIsFavorite(!isFavorite)
    }

    // Обработчик изменений формы отзыва
    const handleChange = (e) => {
        const { name, value } = e.target
        setNewReview((prev) => ({ ...prev, [name]: value }))
    }

    // Обработчик отправки отзыва
    const handleSubmitReview = (e) => {
        e.preventDefault()

        if (!newReview.rating || !newReview.review) {
            setError('Пожалуйста, заполните все поля.')
            return
        }

        axios
            .post(
                'http://localhost:5000/api/review',
                {
                    user_id: user.id,
                    anime_id: id,
                    rating: newReview.rating,
                    review: newReview.review,
                },
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                }
            )
            .then(() => {
                setNewReview({ rating: '', review: '' })
                return axios.get(
                    `http://localhost:5000/api/anime/${id}/reviews`
                )
            })
            .then((response) => setReviews(response.data))
            .catch((error) => console.error('Error submitting review:', error))
    }

    if (!anime) {
        return <p>Loading...</p>
    }

    return (
        <div className="container anime-container">
            <div className="margin-container">
                <AnimeRating rating={anime.average_rating} />
                <div className="top-container">
                    <div className="anime-poster">
                        <img
                            src={'/posters/' + anime.image_url + '.jpg'}
                            alt={anime.title}
                            className="blurred"
                        />
                        <img
                            src={'/posters/' + anime.image_url + '.jpg'}
                            alt={anime.title}
                            className="main"
                        />
                    </div>
                    <div className="anime-info">
                        <img
                            src={'/logos/' + anime.image_url + '.png'}
                            alt={anime.title}
                            className="anime-logo"
                        />
                        <p>
                            <strong>Название:</strong> {anime.title}
                        </p>
                        <p>
                            <strong>Год:</strong> {anime.release_year}
                        </p>
                        <p>
                            <strong>Жанры:</strong> {anime.genres}
                        </p>
                        <p>
                            <strong>Описание:</strong> {anime.description}
                        </p>

                        {user && (
                            <button
                                className={`standard-input button favorite-button ${
                                    isFavorite ? 'remove' : 'add'
                                }`}
                                onClick={toggleFavorite}
                            >
                                {isFavorite
                                    ? 'Удалить из избранного'
                                    : 'Добавить в избранное'}
                            </button>
                        )}
                    </div>
                </div>

                {user && (
                    <div className="reviews-container">
                        <h2>Оставить отзыв:</h2>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <form
                            onSubmit={handleSubmitReview}
                            className="review-form"
                        >
                            <div className="add-item">
                                <label htmlFor="rating">Рейтинг (1-10):</label>
                                <input
                                    type="number"
                                    id="rating"
                                    name="rating"
                                    min="1"
                                    max="10"
                                    value={newReview.rating}
                                    onChange={handleChange}
                                    className="standard-input"
                                />
                            </div>
                            <div className="add-item">
                                <label htmlFor="review">Отзыв:</label>
                                <textarea
                                    id="review"
                                    name="review"
                                    value={newReview.review}
                                    onChange={handleChange}
                                    className="standard-input textarea"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="standard-input button"
                            >
                                Отправить отзыв
                            </button>
                        </form>
                    </div>
                )}

                <div className="reviews-container">
                    <h2>Отзывы:</h2>
                    {reviews.length > 0 ? (
                        <ul>
                            {reviews.map((review, index) => (
                                <li key={index}>
                                    <AnimeRating rating={review.rating} />
                                    <div className="image-container">
                                        <img
                                            src={`/avatars/${review.avatar}`}
                                            alt="avatar"
                                            className="profile-image blurred"
                                        />
                                        <img
                                            src={`/avatars/${review.avatar}`}
                                            alt="avatar"
                                            className="profile-image main"
                                        />
                                    </div>
                                    <div className="review-container">
                                        <div className="top">
                                            <h3>
                                                <strong>
                                                    {review.username}
                                                </strong>
                                            </h3>
                                            <p className="date">
                                                (
                                                {new Date(
                                                    review.created_at
                                                ).toLocaleDateString()}
                                                )
                                            </p>
                                        </div>
                                        <p>{review.review}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Отзывов пока нет.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

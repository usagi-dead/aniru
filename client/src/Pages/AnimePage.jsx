import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUser } from '../Context/UserProvider'
import '../Styles/AnimePage/AnimePage.css'
import AnimeRating from '../Components/AnimeRating.jsx'
import API_BASE_URL from '../config'

export default function AnimePage() {
    const { id } = useParams()
    const { user, favorites, addToFavorites, removeFromFavorites } = useUser()
    const [anime, setAnime] = useState(null)
    const [reviews, setReviews] = useState([])
    const [newReview, setNewReview] = useState({ rating: '', review: '' })
    const [error, setError] = useState(null)
    const [review, setReview] = useState(false)

    const isFavorite = favorites.some((fav) => fav.id === parseInt(id, 10))

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/anime/${id}`)
            .then((response) => response.json())
            .then((data) => setAnime(data))
            .catch((error) => console.error('Error fetching anime:', error))

        fetch(`${API_BASE_URL}/api/anime/${id}/reviews`)
            .then((response) => response.json())
            .then((data) => setReviews(data))
            .catch((error) => console.error('Error fetching reviews:', error))
    }, [id])

    const toggleFavorite = () => {
        if (isFavorite) {
            removeFromFavorites(parseInt(id, 10))
        } else {
            addToFavorites(parseInt(id, 10))
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setNewReview((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmitReview = (e) => {
        e.preventDefault()

        if (!newReview.rating || !newReview.review) {
            setError('Пожалуйста, заполните все поля.')
            return
        }

        fetch(`${API_BASE_URL}/api/anime/${id}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                rating: newReview.rating,
                review: newReview.review,
            }),
        })
            .then(() => {
                setNewReview({ rating: '', review: '' })
                return fetch(`${API_BASE_URL}/api/anime/${id}/reviews`)
            })
            .then((response) => response.json())
            .then((data) => setReviews(data))
            .catch((error) => console.error('Error submitting review:', error))
    }

    const toggleReview = () => {
        return setReview(!review)
    }

    const onCloseReview = () => {
        return setReview(false)
    }

    useEffect(() => {
        if (review) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = 'auto'

        const handleKeydown = (e) => {
            if (e.key === 'Escape') onCloseReview()
        }

        window.addEventListener('keydown', handleKeydown)

        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [review])

    if (!anime) {
        return <p></p>
    }

    return (
        <div className="container anime-container">
            <div className="margin-container">
                <AnimeRating rating={anime.average_rating} />
                <div className="top-container">
                    <div className="anime-poster">
                        <img
                            src={`/posters/${anime.image_url}.jpg`}
                            alt={anime.title}
                            className="blurred"
                        />
                        <img
                            src={`/posters/${anime.image_url}.jpg`}
                            alt={anime.title}
                            className="main"
                        />
                    </div>
                    <div className="anime-info">
                        <div className="title-wrapper">
                            <h1>{anime.title}</h1>
                        </div>
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
                            <div className="buttons-container">
                                <button
                                    className={`standard-input image-button favorite-button ${isFavorite ? 'remove active' : 'add'}`}
                                    onClick={toggleFavorite}
                                >
                                    <img
                                        src={
                                            isFavorite
                                                ? '/media/remove-from-favorite.svg'
                                                : '/media/add-to-favorite.svg'
                                        }
                                        alt=""
                                        className="button-icon"
                                    />
                                    {isFavorite ? 'Удалить' : 'Добавить'}
                                </button>

                                <button
                                    className="standard-input image-button button"
                                    onClick={toggleReview}
                                >
                                    <img
                                        src="/media/star.svg"
                                        alt=""
                                        className="button-icon"
                                    />
                                    Оставить отзыв
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div
                    className={`overlay ${review ? 'active' : ''}`}
                    onClick={onCloseReview}
                />
                <div
                    className={`filters-container container ${review ? 'active' : ''}`}
                >
                    <div className="filters-top-container">
                        <h1 className="filters-title">Оставить отзыв</h1>
                        <button
                            className="standard-input button filters-close"
                            onClick={onCloseReview}
                        >
                            <img src="/media/close.svg" alt="x" />
                        </button>
                    </div>

                    <div className="filters-content-container review-form">
                        <div className="add-item">
                            <label htmlFor="rating">Рейтинг:</label>
                            <div className="rating-buttons">
                                {Array.from(
                                    { length: 10 },
                                    (_, i) => i + 1
                                ).map((value) => (
                                    <button
                                        key={value}
                                        type="button"
                                        className={`standard-input button rating-button ${newReview.rating === value ? 'active' : ''}`}
                                        onClick={() =>
                                            setNewReview((prev) => ({
                                                ...prev,
                                                rating: value,
                                            }))
                                        }
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="add-item">
                            <label htmlFor="review">Комментарий:</label>
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
                            onClick={handleSubmitReview}
                        >
                            Отправить отзыв
                        </button>
                    </div>
                </div>

                <div className="reviews-container">
                    <h2>Отзывы:</h2>
                    {reviews.length > 0 ? (
                        <ul>
                            {reviews.map((review, index) => (
                                <li key={index}>
                                    <AnimeRating rating={review.rating} />
                                    <div className="image-container">
                                        <img
                                            src={`${API_BASE_URL}/uploads/avatars/${review.avatar}`}
                                            alt="avatar"
                                            className="profile-image blurred"
                                        />
                                        <img
                                            src={`${API_BASE_URL}/uploads/avatars/${review.avatar}`}
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

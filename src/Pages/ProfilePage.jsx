import React, { useContext } from 'react'
import { AuthContext } from '../Context/AuthContext'

const ProfilePage = () => {
    const { user, reviews, favorites, logout } = useContext(AuthContext)

    if (!user) return <div>Пожалуйста, войдите в систему.</div>

    return (
        <div>
            <h1>Добро пожаловать, {user.username}!</h1>

            <section>
                <h2>Мои отзывы</h2>
                {reviews.length > 0 ? (
                    <ul>
                        {reviews.map((review, index) => (
                            <li key={index}>
                                <strong>{review.anime_title}:</strong>{' '}
                                {review.rating} - {review.review}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>У вас нет отзывов.</p>
                )}
            </section>

            <section>
                <h2>Мои избранные аниме</h2>
                {favorites.length > 0 ? (
                    <ul>
                        {favorites.map((anime) => (
                            <li key={anime.id}>
                                <img
                                    src={anime.image_url}
                                    alt={anime.title}
                                    width={50}
                                />
                                {anime.title}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>У вас нет избранных аниме.</p>
                )}
            </section>

            <button onClick={logout}>Выйти</button>
        </div>
    )
}

export default ProfilePage

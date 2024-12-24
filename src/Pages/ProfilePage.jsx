import React, { useContext } from 'react'
import { AuthContext } from '../Context/AuthContext'
import '../Styles/ProfilePage/ProfilePage.css'
import AnimeCard from '../Components/AnimeCard.jsx'
import usePageTransition from '../Hooks/usePageTransition'

const ProfilePage = () => {
    const { user, reviews, favorites, logout } = useContext(AuthContext)
    const { handleSwitch } = usePageTransition()

    if (!user) return <div></div>

    return (
        <div className="profile-container container">
            <div className="margin-container">
                <div className="left-container">
                    <div className="profile-image-container">
                        <img
                            src={user.avatar}
                            alt="avatar"
                            className="profile-image blurred"
                        />
                        <img
                            src={user.avatar}
                            alt="avatar"
                            className="profile-image main"
                        />
                    </div>

                    <h1 className="username">{user.username}</h1>

                    <div className="text-container">
                        <div className="block">
                            <h3 className="sub-title">Описание:</h3>
                            <p>{user.description}</p>
                        </div>

                        <div className="block">
                            <h3 className="sub-title">В избранном:</h3>
                            <p>{favorites.length} аниме</p>
                        </div>

                        <div className="block">
                            <h3 className="sub-title">Отзывов:</h3>
                            <p>{reviews.length}</p>
                        </div>

                        <button className="standard-input button image-button">
                            <img
                                src="/media/edit.svg"
                                alt="?"
                                className="button-icon"
                            />
                            Изменить
                        </button>

                        <button
                            className="standard-input button image-button"
                            onClick={() => {
                                if (
                                    window.confirm(
                                        'Вы уверены, что хотите выйти?'
                                    )
                                ) {
                                    handleSwitch('/')
                                    setTimeout(() => {
                                        logout()
                                    }, 600)
                                }
                            }}
                        >
                            <img
                                src="/media/logout.svg"
                                alt="?"
                                className="button-icon"
                            />
                            Выйти
                        </button>
                    </div>
                </div>

                <div className="right-container">
                    <section className="favorites-container">
                        <h2>
                            <span className="blue">*</span> Избранное аниме
                        </h2>
                        <div className="cards-container">
                            {favorites.map((item, key) => (
                                <AnimeCard key={key} anime={item}></AnimeCard>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2>
                            <span className="green">*</span> Оставленные отзывы
                        </h2>
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
                </div>
            </div>
        </div>
    )
}

export default ProfilePage

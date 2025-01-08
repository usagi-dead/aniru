import React, { useEffect, useState } from 'react'
import { useUser } from '../Context/UserProvider.jsx'
import '../Styles/ProfilePage/ProfilePage.css'
import AnimeCard from '../Components/AnimeCard.jsx'
import usePageTransition from '../Hooks/usePageTransition'

const ITEMS_VISIBLE = 3

const ProfilePage = () => {
    const { handleSwitch } = usePageTransition()
    const { user, reviews, favorites, logout, updateUserData, getUserReviews } =
        useUser()
    const [isEditing, setIsEditing] = useState(false)
    const [updatedUser, setUpdatedUser] = useState({
        username: user?.username || '',
        description: user?.description || '',
    })
    const [avatar, setAvatar] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isImageLoaded, setIsImageLoaded] = useState(false)

    useEffect(() => {
        if (user) {
            getUserReviews()
        }
    }, [user, getUserReviews])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setUpdatedUser({ ...updatedUser, [name]: value })
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setAvatar(file)
            setAvatarPreview(URL.createObjectURL(file))
        }
    }

    const handleImageLoad = () => {
        setIsImageLoaded(true)
    }

    const startEditing = () => {
        setUpdatedUser({
            username: user.username || '',
            description: user.description || '',
        })
        setAvatarPreview(null)
        setIsEditing(true)
    }

    const handleSave = async () => {
        try {
            await updateUserData(updatedUser, avatar)
            setIsEditing(false)
            setAvatar(null)
            setAvatarPreview(null)
        } catch (error) {
            console.error('Error saving profile:', error)
        }
    }

    const paginate = (direction) => {
        setCurrentIndex((prevIndex) => {
            const nextIndex =
                direction === 'next' ? prevIndex + 1 : prevIndex - 1
            return Math.max(
                0,
                Math.min(favorites.length - ITEMS_VISIBLE, nextIndex)
            )
        })
    }

    if (!user || !isImageLoaded) return <div></div>

    return (
        <div className="profile-container container">
            <div className="margin-container">
                <div className="left-container">
                    <div className="profile-image-container">
                        <img
                            src={avatarPreview || user.avatar}
                            alt="avatar"
                            className="profile-image blurred"
                            onLoad={handleImageLoad}
                        />
                        <img
                            src={avatarPreview || user.avatar}
                            alt="avatar"
                            className="profile-image main-image"
                            onLoad={handleImageLoad}
                        />
                    </div>

                    {isEditing ? (
                        <div className="text-container editing">
                            <div className="block">
                                <h3 className="sub-title">Имя:</h3>
                                <input
                                    type="text"
                                    name="username"
                                    value={updatedUser.username}
                                    onChange={handleInputChange}
                                    className="standard-input"
                                    placeholder="Имя"
                                />
                            </div>

                            <div className="block">
                                <h3 className="sub-title">Описание:</h3>
                                <textarea
                                    name="description"
                                    value={updatedUser.description}
                                    onChange={handleInputChange}
                                    className="standard-input textarea"
                                    placeholder="Описание"
                                />
                            </div>

                            <div className="block">
                                <h3 className="sub-title">Аватар:</h3>
                                <input
                                    type="file"
                                    id="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="file"
                                    className="standard-input file-input-label"
                                >
                                    Выберите файл
                                </label>
                            </div>

                            <div className="profile-buttons">
                                <button
                                    className="standard-input button save-button"
                                    onClick={handleSave}
                                >
                                    Сохранить
                                </button>
                                <button
                                    className="standard-input button cancel-button"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Отменить
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className="username">{user.username}</h1>
                            <div className="text-container">
                                <div className="block">
                                    <h3 className="sub-title">Описание:</h3>
                                    {user.description !== '' ? (
                                        <p>{user.description}</p>
                                    ) : (
                                        <p className="none-description">
                                            Отсутствует
                                        </p>
                                    )}
                                </div>

                                <div className="block">
                                    <h3 className="sub-title">В избранном:</h3>
                                    <p>{favorites.length} аниме</p>
                                </div>

                                <div className="block">
                                    <h3 className="sub-title">Отзывов:</h3>
                                    <p>{reviews.length}</p>
                                </div>

                                <div className="profile-buttons">
                                    <button
                                        className="standard-input button image-button"
                                        onClick={startEditing}
                                    >
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
                                                }, 800)
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
                        </>
                    )}
                </div>

                <div className="right-container">
                    <section className="favorites-container">
                        <h2>
                            <span className="blue">*</span> Избранное аниме
                        </h2>
                        {favorites.length > 0 ? (
                            <div
                                className={`cards-container ${favorites.length > ITEMS_VISIBLE ? '' : 'none-pagination'}`}
                            >
                                {favorites.length > ITEMS_VISIBLE && (
                                    <button
                                        disabled={currentIndex === 0}
                                        onClick={() => paginate('prev')}
                                        className="standard-input pagination-button"
                                    >
                                        <img
                                            src="/media/arrow.svg"
                                            alt="⬇️"
                                            className="left"
                                        />
                                    </button>
                                )}

                                <div className="cards-wrapper">
                                    <div
                                        className="cards-slider"
                                        style={{
                                            transform: `translateX(calc(-${currentIndex * (100 / ITEMS_VISIBLE)}% - ${currentIndex * 10}px))`,
                                        }}
                                    >
                                        {favorites.map((item) => (
                                            <AnimeCard
                                                key={item.id}
                                                anime={item}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {favorites.length > ITEMS_VISIBLE && (
                                    <button
                                        disabled={
                                            currentIndex ===
                                            favorites.length - ITEMS_VISIBLE
                                        }
                                        onClick={() => paginate('next')}
                                        className="standard-input pagination-button"
                                    >
                                        <img
                                            src="/media/arrow.svg"
                                            alt="⬇️"
                                            className="right"
                                        />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <p className="none-items">
                                У вас нет избранных аниме(
                            </p>
                        )}
                    </section>

                    <section className="favorites-container">
                        <h2>
                            <span className="green">*</span> Оставленные отзывы
                        </h2>
                        {reviews.length > 0 ? (
                            <ul>
                                {reviews.map((review, index) => (
                                    <li key={index}>
                                        <strong>
                                            {review.title ||
                                                'Название недоступно'}
                                            :
                                        </strong>{' '}
                                        {review.rating} -{' '}
                                        {review.review || 'Отзыв отсутствует'}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="none-items">У вас нет отзывов(</p>
                        )}
                    </section>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage

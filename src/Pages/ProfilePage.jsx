import React, { useContext, useState } from 'react'
import { AuthContext } from '../Context/AuthContext'
import '../Styles/ProfilePage/ProfilePage.css'
import AnimeCard from '../Components/AnimeCard.jsx'
import usePageTransition from '../Hooks/usePageTransition'
import axios from 'axios'

const ProfilePage = () => {
    const { user, reviews, favorites, logout, updateUserData } =
        useContext(AuthContext)
    const { handleSwitch } = usePageTransition()

    const [isEditing, setIsEditing] = useState(false)
    const [updatedUser, setUpdatedUser] = useState({
        username: user?.username || '',
        description: user?.description || '',
    })
    const [avatar, setAvatar] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)

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

    const startEditing = () => {
        setUpdatedUser({
            username: user.username || '',
            description: user.description || '',
        })
        setAvatarPreview(null) // Убираем превью при переходе в режим редактирования
        setIsEditing(true)
    }

    const handleSave = async () => {
        try {
            let avatarPath = user.avatar
            if (avatar) {
                const formData = new FormData()
                formData.append('avatar', avatar)

                const response = await axios.post(
                    'http://localhost:5000/api/upload-avatar',
                    formData,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    }
                )
                avatarPath = response.data.filePath
            }

            await updateUserData(user.id, {
                ...updatedUser,
                avatar: avatarPath,
            })
            setIsEditing(false)
        } catch (error) {
            console.error('Ошибка при сохранении изменений:', error)
        }
    }

    if (!user) return <div></div>

    return (
        <div className="profile-container container">
            <div className="margin-container">
                <div className="left-container">
                    <div className="profile-image-container">
                        <img
                            src={avatarPreview || `/avatars/${user.avatar}`}
                            alt="avatar"
                            className="profile-image blurred"
                        />

                        <img
                            src={avatarPreview || `/avatars/${user.avatar}`}
                            alt="avatar"
                            className="profile-image main"
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
                                    placeholder="Имя пользователя"
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
                        </>
                    )}
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

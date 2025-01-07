import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../Styles/AdminPage/AdminPage.css'

const AdminPage = () => {
    const [animeList, setAnimeList] = useState([])
    const [reviews, setReviews] = useState([])
    const [users, setUsers] = useState([])
    const [genres, setGenres] = useState([])
    const [animeGenres, setAnimeGenres] = useState([])
    const [loading, setLoading] = useState(true)

    // Состояния для добавления/редактирования
    const [newAnime, setNewAnime] = useState({
        title: '',
        description: '',
        release_year: '',
        image_url: '',
    })
    const [editAnime, setEditAnime] = useState(null)

    const [newGenre, setNewGenre] = useState({ name: '' })
    const [editGenre, setEditGenre] = useState(null)

    const [newReview, setNewReview] = useState({
        user_id: '',
        anime_id: '',
        rating: '',
        review: '',
    })
    const [editReview, setEditReview] = useState(null)

    const [newUser, setNewUser] = useState({
        username: '',
        role: 'user',
    })
    const [editUser, setEditUser] = useState(null)

    const [newAnimeGenre, setNewAnimeGenre] = useState({
        anime_id: '',
        genre_id: '',
    })

    // Состояние для активной вкладки
    const [activeTab, setActiveTab] = useState('anime')

    // Получение данных при загрузке
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token')

                const animeResponse = await axios.get(
                    'http://localhost:3000/api/admin/anime',
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                setAnimeList(animeResponse.data)

                const reviewsResponse = await axios.get(
                    'http://localhost:3000/api/admin/reviews',
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                setReviews(reviewsResponse.data)

                const usersResponse = await axios.get(
                    'http://localhost:3000/api/admin/users',
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                setUsers(usersResponse.data)

                const genresResponse = await axios.get(
                    'http://localhost:3000/api/admin/genres',
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                setGenres(genresResponse.data)

                const animeGenresResponse = await axios.get(
                    'http://localhost:3000/api/admin/anime-genres',
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                setAnimeGenres(animeGenresResponse.data)
            } catch (error) {
                console.error('Error fetching admin data:', error)
                alert('Ошибка при загрузке данных')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // ==================== Обработчики для аниме ====================
    const handleAddAnime = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.post(
                'http://localhost:3000/api/admin/anime',
                newAnime,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setAnimeList([...animeList, { ...newAnime, id: response.data.id }])
            setNewAnime({
                title: '',
                description: '',
                release_year: '',
                image_url: '',
            })
        } catch (error) {
            console.error('Error adding anime:', error)
        }
    }

    const handleEditAnime = async () => {
        try {
            const token = localStorage.getItem('token')
            await axios.put(
                `http://localhost:3000/api/admin/anime/${editAnime.id}`,
                editAnime,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setAnimeList(
                animeList.map((anime) =>
                    anime.id === editAnime.id ? editAnime : anime
                )
            )
            setEditAnime(null)
        } catch (error) {
            console.error('Error editing anime:', error)
        }
    }

    const handleDeleteAnime = async (id) => {
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`http://localhost:3000/api/admin/anime/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setAnimeList(animeList.filter((anime) => anime.id !== id))
        } catch (error) {
            console.error('Error deleting anime:', error)
        }
    }

    // ==================== Обработчики для жанров ====================
    const handleAddGenre = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.post(
                'http://localhost:3000/api/admin/genres',
                newGenre,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setGenres([...genres, { ...newGenre, id: response.data.id }])
            setNewGenre({ name: '' })
        } catch (error) {
            console.error('Error adding genre:', error)
        }
    }

    const handleEditGenre = async () => {
        try {
            const token = localStorage.getItem('token')
            await axios.put(
                `http://localhost:3000/api/admin/genres/${editGenre.id}`,
                editGenre,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setGenres(
                genres.map((genre) =>
                    genre.id === editGenre.id ? editGenre : genre
                )
            )
            setEditGenre(null)
        } catch (error) {
            console.error('Error editing genre:', error)
        }
    }

    const handleDeleteGenre = async (id) => {
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`http://localhost:3000/api/admin/genres/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setGenres(genres.filter((genre) => genre.id !== id))
        } catch (error) {
            console.error('Error deleting genre:', error)
        }
    }

    // ==================== Обработчики для отзывов ====================
    const handleAddReview = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.post(
                'http://localhost:3000/api/admin/reviews',
                newReview,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setReviews([...reviews, { ...newReview, id: response.data.id }])
            setNewReview({
                user_id: '',
                anime_id: '',
                rating: '',
                review: '',
            })
        } catch (error) {
            console.error('Error adding review:', error)
        }
    }

    const handleEditReview = async () => {
        try {
            const token = localStorage.getItem('token')
            await axios.put(
                `http://localhost:3000/api/admin/reviews/${editReview.id}`,
                editReview,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setReviews(
                reviews.map((review) =>
                    review.id === editReview.id ? editReview : review
                )
            )
            setEditReview(null)
        } catch (error) {
            console.error('Error editing review:', error)
        }
    }

    const handleDeleteReview = async (id) => {
        try {
            const token = localStorage.getItem('token')
            await axios.delete(
                `http://localhost:3000/api/admin/reviews/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            setReviews(reviews.filter((review) => review.id !== id))
        } catch (error) {
            console.error('Error deleting review:', error)
        }
    }

    // ==================== Обработчики для пользователей ====================
    const handleAddUser = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.post(
                'http://localhost:3000/api/admin/users',
                newUser,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setUsers([...users, { ...newUser, id: response.data.id }])
            setNewUser({ username: '', role: 'user' })
        } catch (error) {
            console.error('Error adding user:', error)
        }
    }

    const handleEditUser = async () => {
        try {
            const token = localStorage.getItem('token')
            await axios.put(
                `http://localhost:3000/api/admin/users/${editUser.id}`,
                editUser,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setUsers(
                users.map((user) => (user.id === editUser.id ? editUser : user))
            )
            setEditUser(null)
        } catch (error) {
            console.error('Error editing user:', error)
        }
    }

    const handleDeleteUser = async (id) => {
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`http://localhost:3000/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setUsers(users.filter((user) => user.id !== id))
        } catch (error) {
            console.error('Error deleting user:', error)
        }
    }

    // ==================== Обработчики для связей аниме и жанров ====================
    const handleAddAnimeGenre = async () => {
        try {
            const token = localStorage.getItem('token')
            await axios.post(
                'http://localhost:3000/api/admin/anime-genres',
                newAnimeGenre,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setNewAnimeGenre({ anime_id: '', genre_id: '' })
            alert('Связь добавлена')
        } catch (error) {
            console.error('Error adding anime-genre link:', error)
        }
    }

    const handleDeleteAnimeGenre = async (animeId, genreId) => {
        try {
            const token = localStorage.getItem('token')
            await axios.delete(
                `http://localhost:3000/api/admin/anime-genres/${animeId}/${genreId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            alert('Связь удалена')
        } catch (error) {
            console.error('Error deleting anime-genre link:', error)
        }
    }

    if (loading) {
        return <div></div>
    }

    return (
        <div className="container admin-container">
            <div className="admin-margin-container">
                {/* Вкладки для переключения между таблицами */}
                <div className="tabs">
                    <button
                        onClick={() => setActiveTab('anime')}
                        className={`standard-input button ${activeTab === 'anime' ? 'active' : ''}`}
                    >
                        Аниме
                    </button>
                    <button
                        onClick={() => setActiveTab('genres')}
                        className={`standard-input button ${activeTab === 'genres' ? 'active' : ''}`}
                    >
                        Жанры
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`standard-input button ${activeTab === 'reviews' ? 'active' : ''}`}
                    >
                        Отзывы
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`standard-input button ${activeTab === 'users' ? 'active' : ''}`}
                    >
                        Пользователи
                    </button>
                    <button
                        onClick={() => setActiveTab('anime-genres')}
                        className={`standard-input button ${activeTab === 'anime-genres' ? 'active' : ''}`}
                    >
                        Связи аниме и жанров
                    </button>
                </div>

                {/* Управление аниме */}
                {activeTab === 'anime' && (
                    <section>
                        <h2>Управление аниме</h2>
                        <div className="edit-buttons">
                            <input
                                type="text"
                                placeholder="Название"
                                value={newAnime.title}
                                onChange={(e) =>
                                    setNewAnime({
                                        ...newAnime,
                                        title: e.target.value,
                                    })
                                }
                                className="standard-input"
                            />
                            <input
                                type="text"
                                placeholder="Описание"
                                value={newAnime.description}
                                onChange={(e) =>
                                    setNewAnime({
                                        ...newAnime,
                                        description: e.target.value,
                                    })
                                }
                                className="standard-input"
                            />
                            <input
                                type="number"
                                placeholder="Год выпуска"
                                value={newAnime.release_year}
                                onChange={(e) =>
                                    setNewAnime({
                                        ...newAnime,
                                        release_year: e.target.value,
                                    })
                                }
                                className="standard-input"
                            />
                            <input
                                type="text"
                                placeholder="Ссылка на изображение"
                                value={newAnime.image_url}
                                onChange={(e) =>
                                    setNewAnime({
                                        ...newAnime,
                                        image_url: e.target.value,
                                    })
                                }
                                className="standard-input"
                            />
                            <button
                                onClick={handleAddAnime}
                                className="standard-input button"
                            >
                                Добавить аниме
                            </button>
                        </div>

                        <ul>
                            {animeList.map((anime) => (
                                <li key={anime.id}>
                                    {editAnime?.id === anime.id ? (
                                        <div className="edit-container">
                                            <input
                                                type="text"
                                                placeholder="Название"
                                                value={editAnime.title}
                                                onChange={(e) =>
                                                    setEditAnime({
                                                        ...editAnime,
                                                        title: e.target.value,
                                                    })
                                                }
                                                className="standard-input"
                                            />
                                            <textarea
                                                placeholder="Описание"
                                                value={editAnime.description}
                                                onChange={(e) =>
                                                    setEditAnime({
                                                        ...editAnime,
                                                        description:
                                                            e.target.value,
                                                    })
                                                }
                                                className="standard-input textarea"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Год выпуска"
                                                value={editAnime.release_year}
                                                onChange={(e) =>
                                                    setEditAnime({
                                                        ...editAnime,
                                                        release_year:
                                                            e.target.value,
                                                    })
                                                }
                                                className="standard-input"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Ссылка на изображение"
                                                value={editAnime.image_url}
                                                onChange={(e) =>
                                                    setEditAnime({
                                                        ...editAnime,
                                                        image_url:
                                                            e.target.value,
                                                    })
                                                }
                                                className="standard-input"
                                            />
                                            <div className="buttons-container">
                                                <button
                                                    onClick={handleEditAnime}
                                                    className="standard-input button"
                                                >
                                                    Сохранить
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setEditAnime(null)
                                                    }
                                                    className="standard-input button"
                                                >
                                                    Отмена
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="table-item">
                                            {anime.title} - {anime.release_year}
                                            <div className="buttons-container">
                                                <button
                                                    onClick={() =>
                                                        setEditAnime(anime)
                                                    }
                                                    className="standard-input button"
                                                >
                                                    Редактировать
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteAnime(
                                                            anime.id
                                                        )
                                                    }
                                                    className="standard-input button"
                                                >
                                                    Удалить
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <div className="line" />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Управление жанрами */}
                {activeTab === 'genres' && (
                    <section>
                        <h2>Управление жанрами</h2>
                        <div className="edit-buttons">
                            <input
                                type="text"
                                placeholder="Название жанра"
                                value={newGenre.name}
                                onChange={(e) =>
                                    setNewGenre({
                                        ...newGenre,
                                        name: e.target.value,
                                    })
                                }
                                className="standard-input"
                            />
                            <button
                                onClick={handleAddGenre}
                                className="standard-input button"
                            >
                                Добавить жанр
                            </button>
                        </div>

                        <ul>
                            {genres.map((genre) => (
                                <li key={genre.id}>
                                    {editGenre?.id === genre.id ? (
                                        <div className="edit-container">
                                            <input
                                                type="text"
                                                placeholder="Название жанра"
                                                value={editGenre.name}
                                                onChange={(e) =>
                                                    setEditGenre({
                                                        ...editGenre,
                                                        name: e.target.value,
                                                    })
                                                }
                                                className="standard-input"
                                            />
                                            <div className="buttons-container">
                                                <button
                                                    onClick={handleEditGenre}
                                                    className="standard-input button"
                                                >
                                                    Сохранить
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setEditGenre(null)
                                                    }
                                                    className="standard-input button"
                                                >
                                                    Отмена
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="table-item">
                                            {genre.name}
                                            <div className="buttons-container">
                                                <button
                                                    onClick={() =>
                                                        setEditGenre(genre)
                                                    }
                                                    className="standard-input button"
                                                >
                                                    Редактировать
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteGenre(
                                                            genre.id
                                                        )
                                                    }
                                                    className="standard-input button"
                                                >
                                                    Удалить
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <div className="line" />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Управление отзывами */}
                {activeTab === 'reviews' && (
                    <section>
                        <h2>Управление отзывами</h2>
                        <div className="edit-buttons">
                            <input
                                type="text"
                                placeholder="ID пользователя"
                                value={newReview.user_id}
                                onChange={(e) =>
                                    setNewReview({
                                        ...newReview,
                                        user_id: e.target.value,
                                    })
                                }
                                className="standard-input"
                            />
                            <input
                                type="text"
                                placeholder="ID аниме"
                                value={newReview.anime_id}
                                onChange={(e) =>
                                    setNewReview({
                                        ...newReview,
                                        anime_id: e.target.value,
                                    })
                                }
                                className="standard-input"
                            />
                            <input
                                type="number"
                                placeholder="Рейтинг"
                                value={newReview.rating}
                                onChange={(e) =>
                                    setNewReview({
                                        ...newReview,
                                        rating: e.target.value,
                                    })
                                }
                                className="standard-input"
                            />
                            <input
                                type="text"
                                placeholder="Отзыв"
                                value={newReview.review}
                                onChange={(e) =>
                                    setNewReview({
                                        ...newReview,
                                        review: e.target.value,
                                    })
                                }
                                className="standard-input"
                            />
                            <button
                                onClick={handleAddReview}
                                className="standard-input button"
                            >
                                Добавить отзыв
                            </button>
                        </div>

                        <ul>
                            {reviews.map((review) => (
                                <li key={review.id}>
                                    {editReview?.id === review.id ? (
                                        <div className="edit-container">
                                            <input
                                                type="text"
                                                placeholder="ID пользователя"
                                                value={editReview.user_id}
                                                onChange={(e) =>
                                                    setEditReview({
                                                        ...editReview,
                                                        user_id: e.target.value,
                                                    })
                                                }
                                                className="standard-input"
                                            />
                                            <input
                                                type="text"
                                                placeholder="ID аниме"
                                                value={editReview.anime_id}
                                                onChange={(e) =>
                                                    setEditReview({
                                                        ...editReview,
                                                        anime_id:
                                                            e.target.value,
                                                    })
                                                }
                                                className="standard-input"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Рейтинг"
                                                value={editReview.rating}
                                                onChange={(e) =>
                                                    setEditReview({
                                                        ...editReview,
                                                        rating: e.target.value,
                                                    })
                                                }
                                                className="standard-input"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Отзыв"
                                                value={editReview.review}
                                                onChange={(e) =>
                                                    setEditReview({
                                                        ...editReview,
                                                        review: e.target.value,
                                                    })
                                                }
                                                className="standard-input"
                                            />
                                            <div className="buttons-container">
                                                <button
                                                    onClick={handleEditReview}
                                                    className="standard-input button"
                                                >
                                                    Сохранить
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setEditReview(null)
                                                    }
                                                    className="standard-input button"
                                                >
                                                    Отмена
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="table-item">
                                            Пользователь: {review.user_id},
                                            Аниме: {review.anime_id}, Рейтинг:{' '}
                                            {review.rating}
                                            <div className="buttons-container">
                                                <button
                                                    onClick={() =>
                                                        setEditReview(review)
                                                    }
                                                    className="standard-input button"
                                                >
                                                    Редактировать
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteReview(
                                                            review.id
                                                        )
                                                    }
                                                    className="standard-input button"
                                                >
                                                    Удалить
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <div className="line" />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Управление пользователями */}
                {activeTab === 'users' && (
                    <section>
                        <h2>Управление пользователями</h2>
                        <div className="edit-buttons">
                            <input
                                type="text"
                                placeholder="Имя пользователя"
                                value={newUser.username}
                                onChange={(e) =>
                                    setNewUser({
                                        ...newUser,
                                        username: e.target.value,
                                    })
                                }
                                className="standard-input"
                            />
                            <select
                                value={newUser.role}
                                onChange={(e) =>
                                    setNewUser({
                                        ...newUser,
                                        role: e.target.value,
                                    })
                                }
                                className="standard-input"
                            >
                                <option value="user">Пользователь</option>
                                <option value="admin">Админ</option>
                            </select>
                            <button
                                onClick={handleAddUser}
                                className="standard-input button"
                            >
                                Добавить пользователя
                            </button>
                        </div>

                        <ul>
                            {users.map((user) => (
                                <li key={user.id}>
                                    {editUser?.id === user.id ? (
                                        <div className="edit-container">
                                            <input
                                                type="text"
                                                placeholder="Имя пользователя"
                                                value={editUser.username}
                                                onChange={(e) =>
                                                    setEditUser({
                                                        ...editUser,
                                                        username:
                                                            e.target.value,
                                                    })
                                                }
                                                className="standard-input"
                                            />
                                            <select
                                                value={editUser.role}
                                                onChange={(e) =>
                                                    setEditUser({
                                                        ...editUser,
                                                        role: e.target.value,
                                                    })
                                                }
                                                className="standard-input"
                                            >
                                                <option value="user">
                                                    Пользователь
                                                </option>
                                                <option value="admin">
                                                    Админ
                                                </option>
                                            </select>
                                            <div className="buttons-container">
                                                <button
                                                    onClick={handleEditUser}
                                                    className="standard-input button"
                                                >
                                                    Сохранить
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setEditUser(null)
                                                    }
                                                    className="standard-input button"
                                                >
                                                    Отмена
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="table-item">
                                            {user.username} - {user.role}
                                            <div className="buttons-container">
                                                <button
                                                    onClick={() =>
                                                        setEditUser(user)
                                                    }
                                                    className="standard-input button"
                                                >
                                                    Редактировать
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteUser(
                                                            user.id
                                                        )
                                                    }
                                                    className="standard-input button"
                                                >
                                                    Удалить
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <div className="line" />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Управление связями между аниме и жанрами */}
                {activeTab === 'anime-genres' && (
                    <section>
                        <h2>Управление связями аниме и жанров</h2>
                        <div className="edit-buttons">
                            <select
                                value={newAnimeGenre.anime_id}
                                onChange={(e) =>
                                    setNewAnimeGenre({
                                        ...newAnimeGenre,
                                        anime_id: e.target.value,
                                    })
                                }
                                className="standard-input"
                            >
                                <option value="">Выберите аниме</option>
                                {animeList.map((anime) => (
                                    <option key={anime.id} value={anime.id}>
                                        {anime.title}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={newAnimeGenre.genre_id}
                                onChange={(e) =>
                                    setNewAnimeGenre({
                                        ...newAnimeGenre,
                                        genre_id: e.target.value,
                                    })
                                }
                                className="standard-input"
                            >
                                <option value="">Выберите жанр</option>
                                {genres.map((genre) => (
                                    <option key={genre.id} value={genre.id}>
                                        {genre.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleAddAnimeGenre}
                                className="standard-input button"
                            >
                                Добавить связь
                            </button>
                        </div>

                        <ul>
                            {animeGenres.map((link) => (
                                <li key={`${link.anime_id}-${link.genre_id}`}>
                                    <div className="table-item">
                                        Аниме:{' '}
                                        {
                                            animeList.find(
                                                (a) => a.id === link.anime_id
                                            )?.title
                                        }
                                        , Жанр:{' '}
                                        {
                                            genres.find(
                                                (g) => g.id === link.genre_id
                                            )?.name
                                        }
                                        <div className="buttons-container">
                                            <button
                                                onClick={() =>
                                                    handleDeleteAnimeGenre(
                                                        link.anime_id,
                                                        link.genre_id
                                                    )
                                                }
                                                className="standard-input button"
                                            >
                                                Удалить связь
                                            </button>
                                        </div>
                                    </div>
                                    <div className="line" />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </div>
    )
}

export default AdminPage

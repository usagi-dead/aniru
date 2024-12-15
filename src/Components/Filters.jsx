import React, { useEffect, useState } from 'react'
import '../Styles/Filters.css'

export default function Filters({ onClose, applyFilters }) {
    const [genres, setGenres] = useState([])
    const [selectedGenres, setSelectedGenres] = useState([])
    const [yearRange, setYearRange] = useState([2000, 2024])
    const [rating, setRating] = useState(0)

    useEffect(() => {
        setGenres(['Экшен', 'Приключения', 'Драма', 'Фэнтези', 'Комедия']) // Заглушка
    }, [])

    const handleGenreChange = (genre) => {
        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter((g) => g !== genre))
        } else {
            setSelectedGenres([...selectedGenres, genre])
        }
    }

    const handleApplyFilters = () => {
        applyFilters({ selectedGenres, yearRange, rating })
        onClose()
    }

    const handleResetFilters = () => {
        setSelectedGenres([])
        setYearRange([2000, 2024])
        setRating(0)
    }

    return (
        <>
            <div className="filters-overlay" onClick={onClose} />
            <div className="filters-container container">
                <div className="filters-top-container">
                    <h1 className="filters-title">Фильтры</h1>
                    <button
                        className="standard-input button filters-close"
                        onClick={onClose}
                    >
                        <img src="/close.svg" alt="x" />
                    </button>
                </div>
                <div className="filters-content-container">
                    <div className="filter-group">
                        <h3>Жанры</h3>
                        <div className="filter-genres">
                            {genres.map((genre) => (
                                <label key={genre}>
                                    <input
                                        type="checkbox"
                                        value={genre}
                                        checked={selectedGenres.includes(genre)}
                                        onChange={() =>
                                            handleGenreChange(genre)
                                        }
                                    />
                                    {genre}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <h3>Год выпуска</h3>
                        <div className="filter-range">
                            <input
                                type="number"
                                min="1900"
                                max="2024"
                                value={yearRange[0]}
                                onChange={(e) =>
                                    setYearRange([
                                        +e.target.value,
                                        yearRange[1],
                                    ])
                                }
                            />
                            <span> - </span>
                            <input
                                type="number"
                                min="1900"
                                max="2024"
                                value={yearRange[1]}
                                onChange={(e) =>
                                    setYearRange([
                                        yearRange[0],
                                        +e.target.value,
                                    ])
                                }
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <h3>Минимальный рейтинг</h3>
                        <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={rating}
                            onChange={(e) => setRating(+e.target.value)}
                        />
                    </div>

                    <div className="filters-actions">
                        <button
                            className="standard-input button"
                            onClick={handleResetFilters}
                        >
                            Сбросить
                        </button>
                        <button
                            className="standard-input button"
                            onClick={handleApplyFilters}
                        >
                            Применить
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

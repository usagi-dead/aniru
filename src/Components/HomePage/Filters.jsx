import React, { useEffect, useState } from 'react'
import '../../Styles/Filters.css'

export default function Filters({
    onClose,
    applyFilters,
    check,
    initialFilters,
}) {
    const [genres, setGenres] = useState([])
    const [selectedGenres, setSelectedGenres] = useState(
        initialFilters.selectedGenres || []
    )
    const [yearRange, setYearRange] = useState(initialFilters.yearRange)
    const [rating, setRating] = useState(initialFilters.rating)

    const handleKeyDown = (e) => {
        const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete']
        if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
            e.preventDefault()
        }
    }

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/genres')
                const data = await response.json()
                data.sort()
                setGenres(data)
            } catch (error) {
                console.error('Ошибка при загрузке фильтров:', error)
            }
        }

        fetchFilters()
    }, [])

    useEffect(() => {
        if (check) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }

        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [check])

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
        setYearRange([])
        setRating('')
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
                        <h3 className="filter-title">Жанры</h3>
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
                                    <span className="filters-checkbox">
                                        {genre}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <h3 className="filter-title">Год выпуска</h3>
                        <div className="filter-range">
                            <input
                                className="standard-input filter-input"
                                type="number"
                                placeholder="от"
                                value={yearRange[0] || ''}
                                onKeyDown={handleKeyDown}
                                onChange={(e) =>
                                    setYearRange([
                                        +e.target.value,
                                        yearRange[1],
                                    ])
                                }
                            />
                            <input
                                className="standard-input filter-input"
                                type="number"
                                placeholder="до"
                                value={yearRange[1] || ''}
                                onKeyDown={handleKeyDown}
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
                        <h3 className="filter-title">Минимальный рейтинг</h3>
                        <input
                            className="standard-input filter-input"
                            type="number"
                            value={rating}
                            placeholder="0"
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setRating(e.target.value)}
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

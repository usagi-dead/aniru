import React, { useEffect, useState } from 'react'
import '../Styles/AnimeList.css'
import { loadAnimeData } from '../Database/loadAnimeData.js'
import AnimeCard from './AnimeCard.jsx'
import Filters from './Filters.jsx'

export default function AnimeList() {
    const filters = null
    const [sortMenuVisible, setSortMenuVisible] = useState(false)
    const [animeList, setAnimeList] = useState([])
    const [originalAnimeList, setOriginalAnimeList] = useState([])
    const [loading, setLoading] = useState(true)
    const [imagesLoad, setImagesLoad] = useState(false)
    const [sortType, setSortType] = useState(null)
    const [sortButtonText, setSortButtonText] = useState('Сортировать')
    const [key, setKey] = useState(0)
    const [activeButton, setActiveButton] = useState(null)
    const [filtersVisible, setFiltersVisible] = useState(false)
    const [currentFilters, setCurrentFilters] = useState({
        selectedGenres: [],
        yearRange: [],
        rating: '',
    })

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const data = await loadAnimeData()
                setAnimeList(data)
                setOriginalAnimeList(data)
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const handleFiltersApply = (filters) => {
        setCurrentFilters(filters)

        const filteredList = originalAnimeList.filter((anime) => {
            const matchesGenres =
                filters.selectedGenres.length === 0 ||
                filters.selectedGenres.every((genre) =>
                    anime.genres.includes(genre)
                )

            const matchesYear =
                (!filters.yearRange[0] ||
                    anime.release_year >= filters.yearRange[0]) &&
                (!filters.yearRange[1] ||
                    anime.release_year <= filters.yearRange[1])

            const matchesRating =
                !filters.rating || anime.rating >= filters.rating

            return matchesGenres && matchesYear && matchesRating
        })

        setAnimeList(filteredList)
        setKey((prevKey) => prevKey + 1)
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const data = await loadAnimeData()
                setAnimeList(data)
                setOriginalAnimeList(data)
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const handleClick = (id) => {
        setActiveButton(id)
        sortAnimeList(sortType, id)
    }

    const toggleSortMenu = () => setSortMenuVisible(!sortMenuVisible)

    const sortAnimeList = (type, direction = activeButton || 'descending') => {
        const sortedList = [...animeList]

        switch (type) {
            case 'name':
                sortedList.sort((a, b) =>
                    direction === 'ascending'
                        ? a.title.localeCompare(b.title)
                        : b.title.localeCompare(a.title)
                )
                setSortButtonText('По имени')
                break
            case 'rating':
                sortedList.sort((a, b) =>
                    direction === 'ascending'
                        ? a.rating - b.rating
                        : b.rating - a.rating
                )
                setSortButtonText('По рейтингу')
                break
            case 'year':
                sortedList.sort((a, b) =>
                    direction === 'ascending'
                        ? a.release_year - b.release_year
                        : b.release_year - a.release_year
                )
                setSortButtonText('По году')
                break
            default:
                return
        }

        setAnimeList(sortedList)
        setSortType(type)
        setActiveButton(direction)
        setKey((prevKey) => prevKey + 1)
    }

    const resetSort = () => {
        setAnimeList(originalAnimeList)
        setSortButtonText('Сортировать')
        setSortType(null)
        setKey((prevKey) => prevKey + 1)
        setSortMenuVisible(false)
        setActiveButton(null)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                !event.target.closest('.sort-menu') &&
                !event.target.closest('.sort-button')
            ) {
                setSortMenuVisible(false)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    if (loading) {
        return <div>Загрузка...</div>
    }

    setTimeout(() => {
        setImagesLoad(true)
    }, 200)

    return (
        <>
            {filtersVisible && (
                <Filters
                    check={filtersVisible}
                    onClose={() => setFiltersVisible(false)}
                    applyFilters={handleFiltersApply}
                    initialFilters={currentFilters}
                />
            )}

            <div
                className={`container anime-catalog ${imagesLoad ? 'loaded' : ''}`}
            >
                <div className="anime-top-container">
                    <h1 className="anime-list-title">Каталог Аниме</h1>

                    <div className="buttons-container">
                        <div className="sort-container">
                            <button
                                className="standard-input button image-button sort-button"
                                onClick={toggleSortMenu}
                            >
                                <img
                                    src="/sort.svg"
                                    alt="?"
                                    className="button-icon"
                                />
                                {sortButtonText}
                            </button>
                            {sortMenuVisible && (
                                <div className="sort-menu">
                                    <button
                                        className="standard-input button sort-item"
                                        onClick={() => sortAnimeList('name')}
                                    >
                                        По имени
                                    </button>
                                    <button
                                        className="standard-input button sort-item"
                                        onClick={() => sortAnimeList('rating')}
                                    >
                                        По рейтингу
                                    </button>
                                    <button
                                        className="standard-input button sort-item"
                                        onClick={() => sortAnimeList('year')}
                                    >
                                        По году
                                    </button>
                                    <button
                                        className="standard-input button sort-item"
                                        onClick={resetSort}
                                    >
                                        Сбросить
                                    </button>
                                    <div className="sort-direction">
                                        {['ascending', 'descending'].map(
                                            (label) => (
                                                <button
                                                    key={label}
                                                    onClick={() =>
                                                        handleClick(label)
                                                    }
                                                    className={`standard-input button image-button sort-item direction-button + ${activeButton === label ? 'active' : ''}`}
                                                >
                                                    <img
                                                        src={
                                                            '/' + label + '.svg'
                                                        }
                                                        className="button-icon direction-image"
                                                        alt=""
                                                    />
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            className="standard-input button image-button"
                            onClick={() => setFiltersVisible(!filters)}
                        >
                            Фильтры
                            <img
                                src="/filters.svg"
                                alt="?"
                                className="button-icon"
                            />
                        </button>
                    </div>
                </div>
                <div className="anime-cards">
                    {animeList.map((anime) => (
                        <AnimeCard key={`${anime.id}-${key}`} anime={anime} />
                    ))}
                </div>
            </div>
        </>
    )
}

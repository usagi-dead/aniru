import React, { useEffect, useState } from 'react'
import '../../Styles/HomePage/AnimeList.css'
import AnimeCard from '../AnimeCard.jsx'
import Filters from './Filters.jsx'
import SortMenu from './SortMenu.jsx'

export default function AnimeList() {
    const filters = null
    const [sortMenuVisible, setSortMenuVisible] = useState(false)
    const [animeList, setAnimeList] = useState([])
    const [originalAnimeList, setOriginalAnimeList] = useState([])
    const [loading, setLoading] = useState(true)
    const [imagesLoad, setImagesLoad] = useState(false)
    const [sortButtonText, setSortButtonText] = useState('Сортировать')
    const [key, setKey] = useState(0)
    const [activeButton, setActiveButton] = useState(null)
    const [filtersVisible, setFiltersVisible] = useState(false)
    const [currentFilters, setCurrentFilters] = useState({
        selectedGenres: [],
        yearRange: [],
        rating: '',
    })

    // загрузка списка аниме
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await fetch('http://localhost:3000/api/anime')
                const data = await response.json()

                if (Array.isArray(data)) {
                    setAnimeList(data)
                    setOriginalAnimeList(data)
                } else {
                    console.error(
                        'Полученные данные не являются массивом:',
                        data
                    )
                    setAnimeList([])
                }
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error)
                setAnimeList([])
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // применение фильтров
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
                !filters.rating || anime.average_rating >= filters.rating

            return matchesGenres && matchesYear && matchesRating
        })

        setAnimeList(filteredList)
        setKey((prevKey) => prevKey + 1)
    }

    // переключение сортировки и ее вызов
    const handleClick = (_sortType, id) => {
        setActiveButton(id)
        sortAnimeList(_sortType, id)
    }

    // видимость меню сортировки
    const toggleSortMenu = () => setSortMenuVisible(!sortMenuVisible)

    // сортировка списка аниме
    const sortAnimeList = (type, direction = activeButton || false) => {
        const sortedList = [...animeList]

        switch (type) {
            case 'name':
                sortedList.sort((a, b) =>
                    direction === true
                        ? a.title.localeCompare(b.title)
                        : b.title.localeCompare(a.title)
                )
                setSortButtonText('По алфавиту')
                break
            case 'rating':
                sortedList.sort((a, b) =>
                    direction === true
                        ? a.average_rating - b.average_rating
                        : b.average_rating - a.average_rating
                )
                setSortButtonText('По рейтингу')
                break
            case 'year':
                sortedList.sort((a, b) =>
                    direction === true
                        ? a.release_year - b.release_year
                        : b.release_year - a.release_year
                )
                setSortButtonText('По году')
                break
            default:
                return
        }

        setAnimeList(sortedList)
        setActiveButton(direction)
        setKey((prevKey) => prevKey + 1)
    }

    // сброс сортировки
    const resetSort = () => {
        setAnimeList(originalAnimeList)
        setSortButtonText('Сортировать')
        setKey((prevKey) => prevKey + 1)
        setSortMenuVisible(false)
        setActiveButton(null)
    }

    // обработка клика за пределами меню сортировки
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
        return <div></div>
    }

    setTimeout(() => {
        setImagesLoad(true)
    }, 200)

    return (
        <>
            <Filters
                check={filtersVisible}
                onClose={() => setFiltersVisible(false)}
                applyFilters={handleFiltersApply}
                initialFilters={currentFilters}
            />

            <div
                className={`container anime-catalog ${imagesLoad ? 'loaded' : ''}`}
            >
                <div className="anime-top-container">
                    <h1 className="anime-list-title">Каталог Аниме</h1>

                    <div className="buttons-container">
                        <SortMenu
                            activeButton={activeButton}
                            sortAnimeList={sortAnimeList}
                            resetSort={resetSort}
                            handleClick={handleClick}
                            toggleSortMenu={toggleSortMenu}
                            sortButtonText={sortButtonText}
                            sortMenuVisible={sortMenuVisible}
                            closeSortMenu={() => setSortMenuVisible(false)}
                        />
                        <button
                            className="standard-input button image-button"
                            onClick={() => setFiltersVisible(!filters)}
                        >
                            Фильтры
                            <img
                                src="/media/filters.svg"
                                alt="?"
                                className="button-icon"
                            />
                        </button>
                    </div>
                </div>
                <div className="anime-cards">
                    {animeList.length > 0
                        ? animeList.map((anime) => (
                              <AnimeCard
                                  key={`${anime.id}-${key}`}
                                  anime={anime}
                              />
                          ))
                        : 'Ничего не найдено'}
                </div>
            </div>
        </>
    )
}

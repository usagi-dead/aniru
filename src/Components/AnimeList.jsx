import React, { useEffect, useState } from 'react'
import '../Styles/AnimeList.css'
import { loadAnimeData } from '../Database/loadAnimeData.js'
import AnimeCard from './AnimeCard.jsx'
import Filters from './Filters.jsx'

export default function AnimeList() {
    const [filters, setFilters] = useState(false)
    const [sortMenuVisible, setSortMenuVisible] = useState(false)
    const [animeList, setAnimeList] = useState([])
    const [originalAnimeList, setOriginalAnimeList] = useState([])
    const [loading, setLoading] = useState(true)
    const [imagesLoad, setImagesLoad] = useState(false)
    const [sortType, setSortType] = useState(null)
    const [sortButtonText, setSortButtonText] = useState('Сортировать')

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

    const toggleSortMenu = () => setSortMenuVisible(!sortMenuVisible)

    const sortAnimeList = (type) => {
        const sortedList = [...animeList]
        switch (type) {
            case 'name':
                sortedList.sort((a, b) => a.title.localeCompare(b.title))
                setSortButtonText('По имени')
                break
            case 'rating':
                sortedList.sort((a, b) => b.rating - a.rating)
                setSortButtonText('По рейтингу')
                break
            case 'year':
                sortedList.sort((a, b) => b.release_year - a.release_year)
                setSortButtonText('По году')
                break
            default:
                return
        }
        setAnimeList(sortedList)
        setSortType(type)
        setSortMenuVisible(false)
    }

    const resetSort = () => {
        setAnimeList(originalAnimeList)
        setSortButtonText('Сортировать')
        setSortType(null)
        setSortMenuVisible(false)
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
            {filters && (
                <Filters check={filters} onClose={() => setFilters(false)} />
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
                                </div>
                            )}
                        </div>

                        <button
                            className="standard-input button image-button"
                            onClick={() => setFilters(!filters)}
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
                        <AnimeCard key={anime.id} anime={anime} />
                    ))}
                </div>
            </div>
        </>
    )
}

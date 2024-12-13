import React, { useEffect, useState } from 'react'
import '../Styles/AnimeList.css'
import { loadAnimeData } from '../Database/loadAnimeData.js'
import AnimeCard from './AnimeCard.jsx'
import Filters from './Filters.jsx'

export default function AnimeList() {
    const [filters, setFilters] = useState(false)
    const [animeList, setAnimeList] = useState([])
    const [loading, setLoading] = useState(true)
    const [imagesLoad, setImagesLoad] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const data = await loadAnimeData()
                setAnimeList(data)
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
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
                    <button
                        className="standard-input button filter-button"
                        onClick={() => setFilters(!filters)}
                    >
                        Фильтры
                        <img
                            src="/filters.svg"
                            alt="?"
                            className="filters-icon"
                        />
                    </button>
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

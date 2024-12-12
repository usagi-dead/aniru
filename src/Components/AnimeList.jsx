import React, { useEffect, useState } from 'react'
import '../Styles/AnimeList.css'
import { loadAnimeData } from '../database'
import AnimeCard from './AnimeCard.jsx'

export default function AnimeList() {
    const [animeList, setAnimeList] = useState([])
    const [loading, setLoading] = useState(true)

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

    return (
        <div className="anime-catalog">
            <div className="anime-top-container">
                <h1 className="anime-list-title">Каталог Аниме</h1>
                <button className="standard-input button filter-button">
                    Фильтры
                    <img src="/filters.svg" alt="?" className="filters-icon" />
                </button>
            </div>
            <div className="anime-cards">
                {animeList.map((anime) => (
                    <AnimeCard key={anime.id} anime={anime} />
                ))}
            </div>
        </div>
    )
}

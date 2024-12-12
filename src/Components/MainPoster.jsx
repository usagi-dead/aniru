import React, { useEffect, useState } from 'react'
import '../Styles/MainPoster.css'
import { loadAnimeData } from '../Database/loadAnimeData.js'

export default function MainPoster() {
    const [loading, setLoading] = useState(true)
    const [mainAnime, setMainAnime] = useState(null)

    useEffect(() => {
        const fetchMainAnime = async () => {
            setLoading(true)
            try {
                const animeList = await loadAnimeData()
                if (animeList.length > 0) {
                    setMainAnime(animeList[10])
                }
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchMainAnime()
    }, [])

    if (loading) {
        return <div>Загрузка...</div>
    }

    return (
        <>
            <div className="main-anime-container">
                <div className="image-container">
                    <img
                        src={'/posters/' + mainAnime.image_url + '.jpg'}
                        alt="main-poster"
                        className="main-anime blurred"
                    />
                    <img
                        src={'/posters/' + mainAnime.image_url + '.jpg'}
                        alt="main-poster"
                        className="main-anime"
                    />
                </div>

                <div className="content-container">
                    <img
                        src={'/logos/' + mainAnime.image_url + '.png'}
                        alt="main-anime-logo"
                        className="main-anime-logo"
                    />
                </div>
            </div>
        </>
    )
}

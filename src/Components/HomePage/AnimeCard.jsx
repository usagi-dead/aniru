import React, { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import '../../Styles/HomePage/AnimeCard.css'
import AnimeRating from './AnimeRating.jsx'

export default function AnimeCard({ anime }) {
    const [fasterTransition, setFasterTransition] = useState(false)
    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
    })

    if (inView) {
        setTimeout(() => {
            setFasterTransition(true)
        }, 900)
    }

    return (
        <div
            className={`anime-wrapper 
                ${inView ? 'visible' : ''} 
                ${fasterTransition ? 'faster' : ''}`}
            ref={ref}
        >
            <img
                src={'/posters/' + anime.image_url + '.jpg'}
                alt=""
                className="anime-blurred"
            />

            <div
                key={anime.id}
                className={`anime-card ${inView ? 'visible' : ''}`}
            >
                <img
                    src={'/posters/' + anime.image_url + '.jpg'}
                    alt=""
                    className="anime-poster"
                />

                <div className="anime-content-container">
                    <AnimeRating rating={anime.rating} />

                    <div className="anime-text">
                        <p>
                            <strong>Год:</strong> {anime.release_year}
                        </p>
                        <p>
                            <strong>Жанры:</strong>{' '}
                            {anime.genres || 'Не указаны'}
                        </p>
                    </div>

                    <img
                        src={'/logos/' + anime.image_url + '.png'}
                        alt=""
                        className="anime-logo"
                    />
                </div>
            </div>
        </div>
    )
}

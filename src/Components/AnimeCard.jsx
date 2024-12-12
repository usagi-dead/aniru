import React from 'react'
import '../Styles/AnimeCard.css'
import AnimeRating from './AnimeRating.jsx'

export default function AnimeCard(anime) {
    anime = anime.anime

    return (
        <div className="anime-wrapper">
            <img
                src={'/posters/' + anime.image_url + '.jpg'}
                alt={anime.title}
                className="anime-blurred"
            />

            <div key={anime.id} className="anime-card">
                <img
                    src={'/posters/' + anime.image_url + '.jpg'}
                    alt={anime.title}
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
                        alt={anime.title}
                        className="anime-logo"
                    />
                </div>
            </div>
        </div>
    )
}

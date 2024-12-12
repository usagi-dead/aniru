import React from 'react'
import '../Styles/AnimeCard.css'

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
                    {/*<h2>{anime.title}</h2>*/}
                    {/*<p>{anime.description}</p>*/}

                    <div
                        className={`anime-rating ${anime.rating >= 9 ? 'green' : 'yellow'}`}
                    >
                        <img
                            src="/star.svg"
                            alt="star"
                            className="anime-star"
                        />
                        <span className="anime-rating-text">
                            {anime.rating?.toFixed(1)}
                        </span>
                    </div>

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

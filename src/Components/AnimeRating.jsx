import React from 'react'
import '../Styles/AnimeRating.css'

export default function AnimeRating({ rating }) {
    return (
        <div className={`anime-rating ${rating >= 9 ? 'green' : 'yellow'}`}>
            <img src="/star.svg" alt="star" className="anime-star" />
            <span className="anime-rating-text">{rating}</span>
        </div>
    )
}

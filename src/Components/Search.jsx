import React, { useEffect, useState } from 'react'
import '../Styles/Search.css'
import AnimeRating from './AnimeRating.jsx'
import axios from 'axios'

const Search = () => {
    const [isActive, setIsActive] = useState(false)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)

    const handleBlur = () => {
        setIsActive(false)
        setQuery('')
        setResults([])
    }

    useEffect(() => {
        if (isActive) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = 'auto'

        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                setQuery('')
                setIsActive(false)
                setResults([])
                const inputElement = document.getElementById('anime')
                if (inputElement) {
                    inputElement.blur()
                }
            }
        }

        window.addEventListener('keydown', handleKeydown)

        return () => {
            document.body.style.overflow = 'auto'
            window.removeEventListener('keydown', handleKeydown)
        }
    }, [isActive])

    const handleFormSubmit = (e) => {
        e.preventDefault()
    }

    useEffect(() => {
        if (!query || query === '') return

        setLoading(true)
        setResults([])

        const timeoutId = setTimeout(() => {
            axios
                .get(
                    `http://localhost:5000/api/search?q=${encodeURIComponent(query)}`
                )
                .then((response) => {
                    setResults(response.data)
                    setLoading(false)
                })
                .catch(() => {
                    setLoading(false)
                })
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [query])

    const handleChange = (e) => {
        setQuery(e.target.value)
        if (e.target.value) {
            setIsActive(true)
        } else {
            setIsActive(false)
        }
    }

    return (
        <>
            <div
                className={`overlay ${isActive ? 'active' : ''}`}
                onClick={handleBlur}
            />

            <search className={`${isActive ? 'active' : ''}`}>
                <form onSubmit={handleFormSubmit}>
                    <input
                        type="search"
                        id="anime"
                        name="q"
                        placeholder="Поиск"
                        className="standard-input"
                        value={query}
                        onChange={handleChange}
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                    />
                    <img
                        src="/media/search.svg"
                        alt="🔍"
                        className="search-icon"
                    />
                </form>
            </search>

            <div
                className={`search-results container ${isActive ? 'active' : ''}`}
            >
                <div className="results-content">
                    {loading && <div className="comment">Загрузка...</div>}
                    {!loading && results.length === 0 && query && (
                        <div className="comment">Ничего не найдено</div>
                    )}
                    {results.map((result) => (
                        <div key={result.id} className="search-card">
                            <AnimeRating rating={result.average_rating} />

                            <img
                                src={`/posters/${result.image_url}.jpg`}
                                alt=""
                                className="search-card__img blurred"
                            />

                            <img
                                src={`/posters/${result.image_url}.jpg`}
                                alt=""
                                className="search-card__img"
                            />

                            <div className="text-container">
                                <h1>{result.title}</h1>
                                <p>{result.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Search

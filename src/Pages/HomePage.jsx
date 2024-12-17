import React, { useEffect, useState } from 'react'
import AnimeList from '../Components/HomePage/AnimeList.jsx'
import MainPoster from '../Components/HomePage/MainPoster.jsx'
import '../Styles/HomePage/HomePage.css'

export default function App() {
    const [showAnimeList, setShowAnimeList] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAnimeList(true)
        }, 200)

        return () => clearTimeout(timer)
    }, [])

    return (
        <>
            <MainPoster />
            {showAnimeList && <AnimeList />}
        </>
    )
}

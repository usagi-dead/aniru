import React, { useEffect } from 'react'
import '../Styles/Filters.css'

export default function Filters({ onClose, check }) {
    useEffect(() => {
        if (check) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }

        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [])

    return (
        <>
            <div className="filters-overlay" onClick={onClose} />

            <div className="filters-container container">
                <div className="filters-top-container">
                    <h1 className="filters-title">Фильтры</h1>
                    <button
                        className="standard-input button filters-close"
                        onClick={onClose}
                    >
                        <img src="/close.svg" alt="x" />
                    </button>
                </div>
            </div>
        </>
    )
}

import React, { useEffect } from 'react'
import '../../Styles/HomePage/SortMenu.css'

export default function SortMenu({
    activeButton,
    resetSort,
    handleClick,
    toggleSortMenu,
    sortButtonText,
    sortMenuVisible,
    closeSortMenu,
}) {
    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeSortMenu()
        }

        window.addEventListener('keydown', handleKeydown)
    }, [])

    return (
        <div className="sort-container">
            <button
                className="standard-input button image-button sort-button"
                onClick={toggleSortMenu}
            >
                <img
                    src="/media/sort.svg"
                    alt="?"
                    className={`button-icon ${activeButton ? 'reflect' : ''}`}
                />
                {sortButtonText}
            </button>

            <div className={`sort-menu ${sortMenuVisible ? 'active' : ''}`}>
                <button
                    className="standard-input image-button sort-item"
                    onClick={() => {
                        handleClick(
                            'name',
                            sortButtonText === 'По алфавиту'
                                ? !activeButton
                                : activeButton
                        )
                    }}
                >
                    По алфавиту
                </button>
                <button
                    className="standard-input image-button sort-item"
                    onClick={() => {
                        handleClick(
                            'rating',
                            sortButtonText === 'По рейтингу'
                                ? !activeButton
                                : activeButton
                        )
                    }}
                >
                    По рейтингу
                </button>
                <button
                    className="standard-input image-button sort-item"
                    onClick={() => {
                        handleClick(
                            'year',
                            sortButtonText === 'По году'
                                ? !activeButton
                                : activeButton
                        )
                    }}
                >
                    По году
                </button>
                <button
                    className="standard-input button sort-item"
                    onClick={resetSort}
                >
                    Сбросить
                </button>
            </div>
        </div>
    )
}

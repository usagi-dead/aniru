import React from 'react'
import '../../Styles/SortMenu.css'

export default function SortMenu({
    activeButton,
    sortAnimeList,
    resetSort,
    handleClick,
    toggleSortMenu,
    sortButtonText,
    sortMenuVisible,
}) {
    return (
        <div className="sort-container">
            <button
                className="standard-input button image-button sort-button"
                onClick={toggleSortMenu}
            >
                <img src="/sort.svg" alt="?" className="button-icon" />
                {sortButtonText}
            </button>
            {sortMenuVisible && (
                <div className="sort-menu">
                    <button
                        className="standard-input button sort-item"
                        onClick={() => sortAnimeList('name')}
                    >
                        По имени
                    </button>
                    <button
                        className="standard-input button sort-item"
                        onClick={() => sortAnimeList('rating')}
                    >
                        По рейтингу
                    </button>
                    <button
                        className="standard-input button sort-item"
                        onClick={() => sortAnimeList('year')}
                    >
                        По году
                    </button>
                    <button
                        className="standard-input button sort-item"
                        onClick={resetSort}
                    >
                        Сбросить
                    </button>
                    <div className="sort-direction">
                        {['ascending', 'descending'].map((label) => (
                            <button
                                key={label}
                                onClick={() => handleClick(label)}
                                className={`standard-input button image-button sort-item direction-button + ${activeButton === label ? 'active' : ''}`}
                            >
                                <img
                                    src={'/' + label + '.svg'}
                                    className="button-icon direction-image"
                                    alt=""
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

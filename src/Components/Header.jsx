import React from 'react';
import "../Styles/Header.css";

const AnimeCatalog = () => {
    return (
        <header>
            <img src="/aniru.svg" alt="aniru" className="logo" />

            <search>
                <form action="./search/">
                    <input type="search" id="anime" name="q" placeholder="Поиск" className="standard-input"/>
                    <img src="/search.svg" alt="🔍" className="search-icon"/>
                </form>
            </search>

            <button className="standard-input log-in">Войти</button>
        </header>
    );
};

export default AnimeCatalog;
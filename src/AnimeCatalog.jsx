import React, { useEffect, useState } from 'react';
import "./AnimeCatalog.css";
import initSqlJs from 'sql.js';

const AnimeCatalog = () => {
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDatabase = async () => {
            try {
                const SQL = await initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}` });

                const response = await fetch('/anime.db');
                if (!response.ok) {
                    throw new Error('Не удалось загрузить базу данных.');
                }

                const buffer = await response.arrayBuffer();
                const db = new SQL.Database(new Uint8Array(buffer));

                // Выполняем запрос для получения аниме с жанрами
                const query = `
                    SELECT a.id, a.title, a.description, a.release_year, a.rating, a.image_url, 
                        GROUP_CONCAT(g.name, ', ') AS genres
                    FROM Anime a
                    LEFT JOIN AnimeGenres ag ON a.id = ag.anime_id
                    LEFT JOIN Genres g ON ag.genre_id = g.id
                    GROUP BY a.id
                    LIMIT 10;
                `;
                const result = db.exec(query);

                if (result.length > 0) {
                    const columns = result[0].columns;
                    const values = result[0].values;
                    const animeData = values.map(row => {
                        const anime = {};
                        columns.forEach((col, index) => {
                            anime[col] = row[index];
                        });
                        return anime;
                    });
                    setAnimeList(animeData);
                } else {
                    console.warn('Нет данных в таблице Anime.');
                }

                db.close();
            } catch (error) {
                console.error('Ошибка при работе с базой данных:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDatabase();
    }, []);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="anime-catalog">
            <h1>Каталог Аниме</h1>
            <div className="anime-cards">
                {animeList.map(anime => (
                    <div key={anime.id} className="anime-card">
                        <img src={anime.image_url || '/placeholder.jpg'} alt={anime.title} />
                        <h2>{anime.title}</h2>
                        <p>{anime.description}</p>
                        <p><strong>Год выпуска:</strong> {anime.release_year}</p>
                        <p><strong>Рейтинг:</strong> {anime.rating?.toFixed(1)}</p>
                        <p><strong>Жанры:</strong> {anime.genres || 'Не указаны'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnimeCatalog;

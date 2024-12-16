import { initializeDatabase } from './database'
import { compileToArray } from './compileToArray'

export const loadAnimeData = async () => {
    const db = await initializeDatabase()

    const query = `
        SELECT a.id, a.title, a.description, a.release_year, a.rating, a.image_url, 
            GROUP_CONCAT(g.name, ', ') AS genres
        FROM Anime a
        LEFT JOIN AnimeGenres ag ON a.id = ag.anime_id
        LEFT JOIN Genres g ON ag.genre_id = g.id
        GROUP BY a.id;
    `

    const result = db.exec(query)
    return compileToArray(result)
}

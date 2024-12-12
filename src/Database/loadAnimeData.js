import { initializeDatabase } from './database'

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

    if (result.length > 0) {
        const columns = result[0].columns
        const values = result[0].values
        return values.map((row) => {
            const anime = {}
            columns.forEach((col, index) => {
                anime[col] = row[index]
            })
            return anime
        })
    } else {
        return []
    }
}

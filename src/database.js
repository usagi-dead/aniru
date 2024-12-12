import initSqlJs from 'sql.js'

export const loadAnimeData = async () => {
    const SQL = await initSqlJs({
        locateFile: (file) =>
            `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`,
    })

    const response = await fetch('/anime.db')
    if (!response.ok) {
        throw new Error('Не удалось загрузить базу данных.')
    }

    const buffer = await response.arrayBuffer()
    const db = new SQL.Database(new Uint8Array(buffer))

    const query = `
        SELECT a.id, a.title, a.description, a.release_year, a.rating, a.image_url, 
            GROUP_CONCAT(g.name, ', ') AS genres
        FROM Anime a
        LEFT JOIN AnimeGenres ag ON a.id = ag.anime_id
        LEFT JOIN Genres g ON ag.genre_id = g.id
        GROUP BY a.id
        LIMIT 10;
    `

    const result = db.exec(query)

    if (result.length > 0) {
        const columns = result[0].columns
        const values = result[0].values
        const animeData = values.map((row) => {
            const anime = {}
            columns.forEach((col, index) => {
                anime[col] = row[index]
            })
            return anime
        })
        db.close()
        return animeData
    } else {
        db.close()
        return []
    }
}

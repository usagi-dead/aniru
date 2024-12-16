import { initializeDatabase } from './database'

export const getFilters = async () => {
    const db = await initializeDatabase()

    const query = `SELECT name FROM Genres;`

    const result = db.exec(query)

    if (result.length > 0) {
        return result[0].values.map((row) => row[0])
    }

    return []
}

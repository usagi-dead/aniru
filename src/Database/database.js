import initSqlJs from 'sql.js'

let dbInstance = null

export const initializeDatabase = async () => {
    if (dbInstance) {
        return dbInstance
    }

    const SQL = await initSqlJs({
        locateFile: (file) =>
            `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`,
    })

    const response = await fetch('/anime.db')
    if (!response.ok) {
        throw new Error('Не удалось загрузить базу данных.')
    }

    const buffer = await response.arrayBuffer()
    dbInstance = new SQL.Database(new Uint8Array(buffer))
    return dbInstance
}

export const closeDatabase = () => {
    if (dbInstance) {
        dbInstance.close()
        dbInstance = null
    }
}

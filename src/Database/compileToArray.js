export const compileToArray = async (result) => {
    if (result.length > 0) {
        const columns = result[0].columns
        const values = result[0].values

        return values.map((row) => {
            const output = {}

            columns.forEach((col, index) => {
                output[col] = row[index]
            })

            return output
        })
    } else {
        return []
    }
}

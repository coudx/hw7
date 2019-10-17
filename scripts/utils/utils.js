// utility modules for config module to preset
;`use strict`
import fs from 'fs'

export const get_attr = async key => {
    try {
        const { data } = await fs.readFile(
            `${__basedir}/${user}_${data}.json`,
            'utf-8'
        )
        return (value = JSON.parse(data)[key])
    } catch {
        return console.log(err)
    }
}

export const get_repos = async () => {
    try {
        const { data } = await fs.readFile(
            `${__basedir}/${user}_${repos}.json`,
            'utf-8'
        )
        return (value = JSON.parse(data))
    } catch {
        return console.log(err)
    }
}

// This module will request userData using API get
`use strict`

import axios from 'axios'
import interact from './interact'

const { user, color } = interact()

global.user = user

export default async () => {
    const { data } = await axios.get(`https://api.github.com/users/${user}`)
    data.color = color
    return data
}

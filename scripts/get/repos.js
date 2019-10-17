// This module gets repos info
`use strict`

import axios from 'axios'

export default async () =>
    await axios.get(`https://api.github.com/users/${user}/repos`)

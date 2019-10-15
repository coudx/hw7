'use strict'

import inquirer from 'inquirer'
import axios from 'axios'
import fs from 'fs'

const question = [
  {
    name: 'username',
    message: 'Github Username: '
  },
  {
    name: 'color',
    message: 'Favorite Color:'
  }
]

const write2File = (file, data, color) => {
  data.color = color
  fs.writeFile(file, JSON.stringify(data, null, 2), err => { err ? console.log(err) : console.log('success')} )
}

async function init() {
  try {
    var { username, color } = await inquirer.prompt(question)
    var file = `${username.toLowerCase()}.json`
    const { data } = await axios.get(`https://api.github.com/users/${username}`)
    await write2File(file, data, color)
  } catch (err) {
    console.log(err)
  }
}

init()

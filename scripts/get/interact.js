// This JS will prompt the user for required inputs
;`use strict`

import inquirer from 'inquirer'

const question = [
    {
        name: 'username',
        message: 'Github Username: '
    },
    {
        name: 'color'
    }
]

export default async () => {
    await inquirer.prompt(question)
}

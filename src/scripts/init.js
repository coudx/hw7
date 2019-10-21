;`use strict`

import inquirer from 'inquirer'
import axios from 'axios'
import head from './head'
import headcss from './images'
import fs from 'fs'
import path from 'path'

const dir = path.resolve('.')

async function init() {
    const ans = await inquirer.prompt([
        { name: 'user', message: 'Github Username: ' },
        { name: 'color', message: 'Favorite Color: ' }
    ])
    const userdata = await axios.get(`https://api.github.com/users/${ans.user}`)
    userdata.data.color = ans.color
    const repodata = await axios.get(
        `https://api.github.com/users/${ans.user}/repos`
    )
    var { user, repo } = { user: userdata.data, repo: repodata.data }

    //****************************************************************************
    //---------------- entering messy stage --------------------------------------
    //****************************************************************************
    const safeQuotes = str => str.replace(/"/g, '&quot;')

    /*
     * data
     */
    const repositories = repo
    const repositoriesMore = 25
    const canShowMoreRepositories =
        repositoriesMore && repositoriesMore < repositories.length
    const svg = {
        blog:
            '<svg aria-label="Blog" viewBox="0 -20 512 511" xmlns="http://www.w3.org/2000/svg"><path d="m67.179688 48.394531h-.101563c-5.523437 0-10 4.476563-10 10 0 5.523438 4.476563 10 10 10h.101563c5.523437 0 10-4.476562 10-10 0-5.523437-4.476563-10-10-10zm0 0"/><path d="m116.710938 48.394531h-.101563c-5.523437 0-10 4.476563-10 10 0 5.523438 4.476563 10 10 10h.101563c5.523437 0 10-4.476562 10-10 0-5.523437-4.476563-10-10-10zm0 0"/><path d="m166.242188 48.394531h-.101563c-5.523437 0-10 4.476563-10 10 0 5.523438 4.476563 10 10 10h.101563c5.523437 0 10-4.476562 10-10 0-5.523437-4.476563-10-10-10zm0 0"/><path d="m444.308594 48.394531h-192.929688c-5.523437 0-10 4.476563-10 10 0 5.519531 4.476563 10 10 10h192.929688c5.523437 0 10-4.480469 10-10 0-5.523437-4.476563-10-10-10zm0 0"/><path d="m262.890625 452.4375c-2.628906 0-5.199219 1.070312-7.070313 2.929688-1.859374 1.859374-2.929687 4.441406-2.929687 7.070312s1.070313 5.210938 2.929687 7.070312c1.871094 1.859376 4.441407 2.929688 7.070313 2.929688s5.210937-1.070312 7.070313-2.929688c1.867187-1.859374 2.929687-4.441406 2.929687-7.070312s-1.0625-5.210938-2.929687-7.070312c-1.859376-1.859376-4.441407-2.929688-7.070313-2.929688zm0 0"/><path d="m480.230469.5h-448.460938c-17.515625 0-31.769531 14.253906-31.769531 31.769531v408.398438c0 17.519531 14.253906 31.769531 31.769531 31.769531h189.230469c5.523438 0 10-4.476562 10-10s-4.476562-10-10-10h-189.230469c-6.488281 0-11.769531-5.277344-11.769531-11.769531v-324.378907h472v324.378907c0 6.488281-5.28125 11.769531-11.769531 11.769531h-176.5625c-5.523438 0-10 4.476562-10 10s4.476562 10 10 10h176.5625c17.515625 0 31.769531-14.25 31.769531-31.769531v-408.398438c0-17.515625-14.253906-31.769531-31.769531-31.769531zm-460.230469 95.785156v-64.015625c0-6.488281 5.28125-11.769531 11.769531-11.769531h448.460938c6.488281 0 11.769531 5.28125 11.769531 11.769531v64.019531h-472zm0 0"/><path d="m178.039062 230.5c0-19.851562-16.148437-36-36-36h-33.667968c-5.523438 0-10 4.476562-10 10v104c0 5.523438 4.476562 10 10 10h33.667968c19.851563 0 36-16.148438 36-36 0-10.214844-4.28125-19.441406-11.140624-26 6.859374-6.558594 11.140624-15.785156 11.140624-26zm-20 52c0 8.820312-7.179687 16-16 16h-23.667968v-32h23.667968c8.820313 0 16 7.175781 16 16zm-39.667968-36v-32h23.667968c8.824219 0 16 7.179688 16 16s-7.175781 16-16 16zm0 0"/><path d="m206.648438 194.5c-5.523438 0-10 4.476562-10 10v80.871094c0 18.269531 14.863281 33.128906 33.128906 33.128906 5.523437 0 10-4.476562 10-10s-4.476563-10-10-10c-7.238282 0-13.128906-5.890625-13.128906-13.128906v-80.871094c0-5.523438-4.476563-10-10-10zm0 0"/><path d="m324.867188 282.289062c0-19.96875-16.242188-36.214843-36.210938-36.214843s-36.210938 16.246093-36.210938 36.214843 16.246094 36.210938 36.210938 36.210938c19.96875 0 36.210938-16.242188 36.210938-36.210938zm-52.421876 0c0-8.941406 7.273438-16.214843 16.210938-16.214843s16.210938 7.273437 16.210938 16.214843c0 8.9375-7.269532 16.210938-16.210938 16.210938s-16.210938-7.273438-16.210938-16.210938zm0 0"/><path d="m377.414062 346.5c-8.9375 0-16.210937-7.273438-16.210937-16.210938 0-5.523437-4.476563-10-10-10s-10 4.476563-10 10c0 19.96875 16.246094 36.210938 36.210937 36.210938 19.96875 0 36.214844-16.242188 36.214844-36.210938v-48c0-19.96875-16.246094-36.214843-36.214844-36.214843-19.964843 0-36.210937 16.246093-36.210937 36.214843s16.246094 36.210938 36.210937 36.210938c5.828126 0 11.332032-1.390625 16.214844-3.847656v15.636718c0 8.9375-7.273437 16.210938-16.214844 16.210938zm0-48c-8.9375 0-16.210937-7.273438-16.210937-16.210938 0-8.941406 7.273437-16.214843 16.210937-16.214843 8.941407 0 16.214844 7.273437 16.214844 16.214843 0 8.9375-7.273437 16.210938-16.214844 16.210938zm0 0"/><path d="m108.371094 416.5h295.257812c5.523438 0 10-4.476562 10-10s-4.476562-10-10-10h-295.257812c-5.519532 0-10 4.476562-10 10s4.480468 10 10 10zm0 0"/></svg>',
        github: `<svg aria-label="Github" fill="#181717" role="img" viewBox="0 0 24 24">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>`,
        map: `<svg aria-label="Map" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        	 viewBox="0 0 52 52" style="enable-background:new 0 0 52 52;" xml:space="preserve">
        <path style="fill:#1081E0;" d="M38.853,5.324L38.853,5.324c-7.098-7.098-18.607-7.098-25.706,0h0
        	C6.751,11.72,6.031,23.763,11.459,31L26,52l14.541-21C45.969,23.763,45.249,11.72,38.853,5.324z M26.177,24c-3.314,0-6-2.686-6-6
        	s2.686-6,6-6s6,2.686,6,6S29.491,24,26.177,24z"/>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        </svg>`
    }

    function generateRepositoriesHtml(repo) {
        var output = ''
        for (var i = 0; i < repo.length; i++) {
            output += `<div>
    <a href="${
        repo[i].html_url
    }" class="repository uk-card uk-card-default uk-card-small uk-card-hover"
        uk-scrollspy="cls: uk-animation-scale-up" target="_blank" rel="noopener">
      <div class="repository__name uk-card-title">${repo[i].full_name}</div>
      <p class="repository__description">${repo[i].description || '-'}</p>
      <div class="repository__bottom">
        <div class="repository__bottom__language">
          <span uk-icon="code"></span>
          <span>${repo[i].language || '-'}</span>
        </div>
        <div class="repository__bottom__star">
          <span uk-icon="star"></span>
          <span>${repo[i].stargazers_count}</span>
        </div>
        <div class="repository__bottom__forks">
          <span uk-icon="git-fork"></span>
          <span>${repo[i].forks_count}</span>
        </div>
      </div>
    </a>
  </div>`
        }
        return output
    }

    const pageHead = function generateHead() {
        let h = head(user)
        let i = headcss(
            user.color,
            user.avatar_url,
            '../src/assets/background.png'
        )
        return `<head>
  ${h}
  ${i}
  <link href="index.css" rel="stylesheet">
</head>`
    }

    const pageHeader = function generateHeader() {
        const social = [
            {
                name: 'Location',
                icon: 'map',
                link: `https://www.google.com/maps/@?api=1&map_action=map&query=${user.location
                    .split(' ')
                    .join('+')}`
            },
            { name: 'Github', icon: 'github', link: user.html_url },
            { name: 'Blog', icon: 'blog', link: `http://${user.blog}` }
        ]
        if (social.length > 0) {
            var output = '<div class="header__wrap__social">'
            for (const media of social) {
                output += `<a href="${media.link}" title="${safeQuotes(
                    media.name
                )}" target="_blank" rel="noopener">`
                let addr = svg[media.icon]
                output += `${addr}</a>`
            }
            return output + '</div>'
        }
    }
    const pageRepo = function generateMain() {
        let content = generateRepositoriesHtml(
            canShowMoreRepositories
                ? repositories.slice(0, repositoriesMore)
                : repositories
        )
        const main =
            repositories.length > 0
                ? `<section class="repositories-section uk-section uk-section-default">
  <div class="uk-container">
    <h2 class="uk-heading-line">
      <span>
        <span uk-icon="grid"></span>
        <span>Repositories</span>
      </span>
    </h2>
    <div class="repositories uk-child-width-1-3@l uk-child-width-1-2@m uk-grid-small" uk-grid="masonry: true">
       ${content}
    </div>`
                : ''
        const sub = canShowMoreRepositories
            ? `<div class="show-more-wrap">
        <button id="github-more" class="uk-button uk-button-default">Show more</button>
      </div>
     }
  </div>
</section>`
            : ''
        return `<main>
  ${main}
  ${sub}
</main>`
    }

    const pageDate = new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        day: '2-digit',
        month: '2-digit'
    })

    const pageMore = canShowMoreRepositories
        ? generateRepositoriesHtml.toString()
        : ''

    const create = function() {
        return `<!DOCTYPE html>
  <html lang="en" data-template="default" data-compiled="${Date.now()}">
  ${pageHead()}
<body>
<header>
  <div class="header__background uk-background-cover background--image" uk-parallax="bgy: -100"></div>
  <div class="header__wrap">
    <div class="header__wrap__image">
      <div class="avatar--image uk-background-cover"></div>
    </div>
    <h1 class="header__wrap__name uk-h1"><${user.name}></h1>
    <span class="header__wrap__position">Repos: ${
        user.public_repos
    } Followers: ${user.followers} Github Star: - Following: ${
            user.following
        }</span>
    ${pageHeader()}
    </div>
</header>
${pageRepo()}
<footer>
  <hr class="uk-divider-icon">
  <span>${pageDate}</span>
</footer>
${pageMore}
<script
  src="https://code.jquery.com/jquery-3.4.1.min.js"
  integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
  crossorigin="anonymous"></script>
<script src="index.js"></script>
</body>
</html>`
    }
    const htmlpage = create()
    fs.writeFile(path.resolve(dir, 'dist/index.html'), htmlpage, err => err)
}
init()

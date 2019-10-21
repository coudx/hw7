$(document).ready(function() {
    render()
})

function render() {
    const h2e = function(html) {
        var template = document.createElement('template')
        template.innerHTML = html
        return template.content.childNodes
    }

    if (canShowMoreRepositories) {
        var repositories = JSON.stringify(modules.github.repositories)
    }

    window.addEventListener('DOMContentLoaded', function() {
        if (canShowMoreRepositories) {
            var btnMoreGithubRepsEl = document.querySelector('#github-more')
            if (btnMoreGithubRepsEl) {
                var sectionGithubRepsEl = document.querySelector(
                    '.repositories'
                )
                var per_page = repositoriesMore
                var len = repositories.length
                var page = 1
                btnMoreGithubRepsEl.addEventListener('click', function() {
                    var current = page * per_page
                    var next = current + per_page
                    var html = generateRepositoriesHtml(
                        repositories.slice(current, next)
                    )
                    var nodes = h2e(html)
                    for (var i = 0; i < nodes.length; i++) {
                        sectionGithubRepsEl.append(nodes[i])
                    }
                    if (len <= next) {
                        var showMoreWrapEl = document.querySelector(
                            '.repositories-section .show-more-wrap'
                        )
                        if (showMoreWrapEl) {
                            showMoreWrapEl.remove()
                        }
                    }
                    page++
                })
            }
        }
    })
}

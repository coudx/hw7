;`use strict`

import utils from 'utils'

global.__basedir = __dirname

export default Object = {
    global: {
        /**
         * The value is the name of the folder, all templates
         * you can find by the current path:
         *    ./src/templates
         * You can also create your own template, which is
         * described in this file:
         *    README.md
         * @type {string}
         * @default default
         */
        template: 'default',
        /**
         * If the repository is called: <username>.github.io
         *  Then the value is empty
         * If the repository is called: portfolio, or any other name
         *  Then the value of <name of repository>
         * @type {string}
         */
        base: '',
        /**
         * The Open Graph protocol
         *  key - property
         *  value - content
         * @type {Object}
         * @see http://ogp.me/
         * @example
         *  'og:title': 'My portfolio'
         * @default
         *  og:title => Portfolio by {name from Github},
         *  og:type => profile,
         *  og:image => {avatar url from Github},
         *  og:url => {site url},
         *  profile:username => {username}
         */
        opg: {
            'profile:user_name': '',
            'profile:first_name': '',
            'profile:last_name': ''
        },
        /**
         * Override options for WebpackPwaManifest plugin
         * @type {Object}
         * @see https://github.com/arthurbergmz/webpack-pwa-manifest
         * @example
         *  For change description and background color:
         *    { description: 'My portfolio', background_color: '#333' }
         */
        pwa: {
            //
        },
        /**
         * If you are deploying to a custom domain
         * @type {string}
         * @example
         *  www.example.com
         */
        customDomain: ''
    },
    data: {
        /**
         * Your name
         * @type {string}
         */
        name: async function() {
            try {
                return await utils.get_attr('name')
            } catch {
                return console.log(err)
            }
        },
        /**
         * Profile picture
         * @type {string}
         */
        avatar_url: async function() {
            try {
                return await utils.get_attr('avatar_url')
            } catch {
                return console.log(err)
            }
        },
        /**
         * @type {string}
         */
        location: async function() {
            try {
                return await utils.get_attr('location')
            } catch {
                return console.log(err)
            }
        },
        /**
         * You are in social networks
         * @type {Array}
         */
        socialMedia: [
            {
                name: 'Github',
                icon: 'github',
                link: async function() {
                    try {
                        return await utils.get_attr('html_url')
                    } catch {
                        return console.log(err)
                    }
                }
            },
            {
                name: 'Blog',
                icon: 'blog',
                link: async function() {
                    try {
                        return await utils.get_attr('blog')
                    } catch {
                        return console.log(err)
                    }
                }
            }
        ]
    },
    modules: {
        github: {
            /**
             * @type {array}
             * @default an array contaiing all the repos info of the user
             */
            repositories: async () => await utils.getRepos(),
            profile: { name: this.repositories.full_name },
            parse: {
                /** @see https://developer.github.com/v3/repos/#list-user-repositories docs */
                repositories: {
                    /**
                     * Not used if token is present. Instead, use: visibility, affiliation.
                     * @type {string} - all, owner, member
                     * @default owner
                     */
                    type: 'owner',
                    /**
                     * @type {string} - created, updated, pushed, full_name
                     * @default full_name
                     */
                    sort: 'full_name',
                    /**
                     * @type {string} - asc, desc
                     * @default asc when using full_name, otherwise desc
                     */
                    direction: 'asc',
                    /**
                     * ONLY IF THE TOKEN IS SPECIFIED
                     * @type {string} - all, public, private
                     * @default all
                     */
                    visibility: 'public',
                    /**
                     * ONLY IF THE TOKEN IS SPECIFIED
                     * Comma-separated list of values
                     * @type {string}
                     *  owner: Repositories that are owned by the authenticated user.
                     *  collaborator: Repositories that the user has been added to as a collaborator.
                     *  organization_member: Repositories that the user has access to through being a member
                     *    of an organization. This includes every repository on every team that the user is on.
                     * @default owner,collaborator,organization_member
                     */
                    affiliation: 'owner,collaborator,organization_member'
                }
            },
            filter: {
                /**
                 * @type {IFilters[]}
                 * @see core/interfaces/IGithib.ts identify attributes
                 * @see docs/config.md #Filters
                 */
                repositories: [
                    //
                ]
            },
            sort: {
                /**
                 * @type {ISort}
                 * @see core/interfaces/IGithib.ts identify attributes
                 * @example
                 *  { attr: 'stargazers_count', enable: true, sortByDesc: true }
                 *  { attr: 'owner.id', enable: true, sortByDesc: false }
                 */
                repositories: {
                    attr: 'stargazers_count',
                    enable: false,
                    sortByDesc: true
                }
            }
        }
    },
    templates: {
        default: {
            /**
             * @type {string}
             * @see docs/config.md #Image
             */
            background: '',
            /**
             * Number of items to display, the rest will be hidden and displayed
             * when you click on the button (for the same number of elements)
             *  0 - display all
             * @type {number}
             */
            github_repositories_more: 25
        }
    }
}

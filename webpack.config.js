/* tslint:disable:no-implicit-dependencies */
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import WebpackPwaManifest from 'webpack-pwa-manifest'
import { GenerateSW } from 'workbox-webpack-plugin'
import path from 'path'
import fs from 'fs'
import config from './config'
import pull from './scripts/get/pull'

export default async argv => {
    /**
     * Check that the required data has been entered
     * @throws
     *  prompt user to enter github username and fav color
     *  pull the data using api and save it locally
     */

    await pull()
    /**
     * Change data from settings to data from social networks
     * @see see docs/config.md #Data
     */
    const modules = config.modules
    /** @type {string} */
    const template = config.global.template || 'default'

    /** @type {boolean} */
    const isProd = argv.mode === 'production'

    const webpackConfig = {
        devServer: {
            clientLogLevel: 'error',
            contentBase: [
                path.resolve(__dirname, `./src/template/${template}/index.js`)
            ],
            hot: true,
            inline: true,
            watchContentBase: true
        },
        devtool: isProd ? false : 'source-map',
        entry: {
            main: [
                `./src/template/${template}/index.js`,
                `./src/template/${template}/index.scss`
            ]
        },
        mode: argv.mode,
        module: {
            rules: [
                {
                    test: /\.(gif|png|jpe?g)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'static/images'
                            }
                        }
                    ]
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'static/files'
                            }
                        }
                    ]
                },
                {
                    test: /\.s?css$/,
                    use: [
                        isProd ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader',
                        'resolve-url-loader',
                        'postcss-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.js$/,
                    use: ['babel-loader']
                }
            ]
        },
        output: {
            chunkFilename: 'static/js/[name].[hash].js',
            filename: 'static/[name].[hash].js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/'
        },
        plugins: [
            /**
             * Remove build folder(s) before building.
             * @see https://github.com/johnagan/clean-webpack-plugin
             */
            new CleanWebpackPlugin(),
            /**
             * Copies individual files or entire directories to the build directory.
             * @see https://github.com/webpack-contrib/copy-webpack-plugin
             */
            new CopyWebpackPlugin(
                (() => {
                    const output = []

                    // Upload config.ts to dist folder for save all config data
                    if (process.env.UPLOAD_CONFIG === 'true') {
                        output.push({
                            from: 'config.js',
                            to: '_cache',
                            ignore: []
                        })
                    }

                    return [
                        ...output,
                        { from: 'public', ignore: ['.gitignore'] }
                    ]
                })()
            ),
            /**
             * Simplifies creation of HTML files to serve your webpack bundles.
             * @see https://github.com/jantimon/html-webpack-plugin
             * @example
             *  In the .ejs file you can get a profile and repositories from GitHub.
             *    Example: htmlWebpackPlugin.options.modules.github.profile
             *  Get a variable:
             *    <% if (htmlWebpackPlugin.options.modules.github.profile.id === 1) { /\* code *\/ } %>
             *  Insert data from a variable:
             *    <%= htmlWebpackPlugin.options.modules.github.profile.id %>
             */
            new HtmlWebpackPlugin({
                filename: 'index.html',
                inject: 'head',
                meta: {
                    description: `Portfolio by ${modules.github.profile.name}`,
                    robots: 'index, follow',
                    viewport:
                        'width=device-width, initial-scale=1, shrink-to-fit=no'
                },
                minify: isProd
                    ? {
                          collapseWhitespace: true,
                          removeComments: true,
                          removeRedundantAttributes: true,
                          removeScriptTypeAttributes: true,
                          removeStyleLinkTypeAttributes: true
                      }
                    : false,
                template: `./src/template/${template}/index.ejs`,
                templateParameters: {
                    config,
                    isProd
                }
            }),
            /**
             * Creates a CSS file per JS/TS file which contains CSS
             * @see https://github.com/webpack-contrib/mini-css-extract-plugin
             */
            new MiniCssExtractPlugin({
                chunkFilename: 'static/css/[name].[hash].css',
                filename: 'static/[name].[hash].css'
            })
        ],
        resolve: {
            /**
             * @see https://webpack.js.org/configuration/resolve/
             * @example
             *  Import from .ts files
             *  - import '@/main' - get file './src/template/{template}/main.ts'
             *  - import '@/styles/index.scss' - get file './src/template/{template}/styles/index.scss'
             *  Import from .scss files
             *  - @import "@/styles/index"; - get file './src/template/{template}/styles/index.scss'
             *
             *  {template} - insert the path of the current template, for example - default
             */
            alias: {
                '@': path.resolve(__dirname, `./src/template/${template}/`),
                '@asset': path.resolve(__dirname, './assets/'),
                '@root': __dirname,
                '@src': path.resolve(__dirname, './src')
            },
            /**
             * Attempt to resolve these extensions in order
             */
            extensions: ['.js', '.json']
        }
    }
    if (isProd) {
        /**
         * Add all folders and files to navigateFallbackWhitelist (PWA)
         * @type {RegExp[]}
         */
        const ignorePublicFolder = fs
            .readdirSync(path.resolve(__dirname, './public'))
            .map(pathDir => {
                if (fs.lstatSync('./public/' + pathDir).isDirectory()) {
                    return new RegExp('^' + pathDir)
                }

                return new RegExp('^' + pathDir.replace(/\./g, '\\.') + '$')
            })

        webpackConfig.plugins.push(
            /**
             * Progressive Web App Manifest Generator for Webpack,
             * with auto icon resizing and fingerprinting support.
             * @see https://github.com/arthurbergmz/webpack-pwa-manifest
             */
            new WebpackPwaManifest({
                ...{
                    background_color: '#fff',
                    description: `Portfolio by ${modules.github.profile.name}`,
                    filename: 'static/manifest.[hash].json',
                    icons: [
                        {
                            destination: 'static/icons',
                            sizes: [96, 128, 192, 256, 384, 512],
                            src: path.resolve('demo/icon.png')
                        }
                    ],
                    name: `${modules.github.profile.name}`,
                    short_name: config.modules.github.username,
                    start_url: variables.siteUrl,
                    theme_color: '#fff'
                },
                ...config.global.pwa
            }),
            /**
             * Workbox is a collection of JavaScript libraries for Progressive Web Apps.
             * @see https://github.com/googlechrome/workbox
             */
            new GenerateSW({
                clientsClaim: true,
                exclude: [/\.gitignore/, /_cache\//],
                importWorkboxFrom: 'local',
                importsDirectory: 'static/pwa',
                navigateFallback: '/index.html',
                navigateFallbackWhitelist: [
                    // Output build
                    /^static/,
                    /^sw\.js$/,
                    /^index\.html$/,
                    /^favicon\.ico$/,
                    // Public folder
                    ...ignorePublicFolder
                ],
                runtimeCaching: [
                    {
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'github-content'
                        },
                        urlPattern: new RegExp(
                            '^https://.*.githubusercontent.com/'
                        )
                    },
                    {
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'github-api'
                        },
                        urlPattern: new RegExp('^https://api.github.com/')
                    },
                    {
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'other-websites'
                        },
                        urlPattern: new RegExp('.+')
                    }
                ],
                skipWaiting: true,
                swDest: 'sw.js'
            })
        )
    }

    return webpackConfig
}

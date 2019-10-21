;`use strict`

export default function head(user) {
    return `<meta charset="utf-8">
  <title><${user.name}></title>
    <!-- START: Open Graph -->
    <meta property="og:title" content="Portfolio by ${user.name}" />
    <meta property="og:type" content="profile" />
    <meta property="og:image" content="${user.avatar_url}" />
    <meta property="og:url" content="${user.html_url}" />
    <meta property="og:description" content="${user.bio}" />
    <meta property="profile:username" content="${user.login}" />
    <!-- END: Open Graph -->`
}

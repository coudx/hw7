;`use strict`

export default function headcss(color, avatar, background) {
    let avator_style =
        typeof avatar !== 'undefined' && avatar
            ? `.avatar--image {
        background: url(${avatar});
      }`
            : ''
    let background_style = background
        ? `.background--image {
      background: linear-gradient( ${color}, transparent), url("${background}");
    }`
        : ''
    return `<style>
    ${avator_style}
    ${background_style}
  </style>`
}

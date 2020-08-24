import projectConfig from '@configs'

/**
 * 获取当前用户的皮肤缓存键
 */
function getUserThemeKey () {
  const { projectContext, userKey } = projectConfig
  const user = JSON.parse(sessionStorage.getItem(userKey))
  return `${projectContext}_${user.id}_theme_color`
}

let chalk = ''

/**
 * 更改文档样式
 * @param document 文档对象
 * @param {Object} themeParam 样式对象
 * @param {string} themeParam.defaultTheme 默认样式
 * @param {string} themeParam.newTheme 新样式
 * @param {string} themeParam.oldTheme 旧样式
 */
function changeTheme (document, { defaultTheme, newTheme, oldTheme }) {
  if (typeof newTheme !== 'string') return
  const themeCluster = getThemeCluster(newTheme.replace('#', ''))
  const originalCluster = getThemeCluster(oldTheme.replace('#', ''))
  const getHandler = (variable, id) => {
    return () => {
      const originalCluster = getThemeCluster(defaultTheme.replace('#', ''))
      const newStyle = updateStyle(chalk, originalCluster, themeCluster)

      let styleTag = document.getElementById(id)
      if (!styleTag) {
        styleTag = document.createElement('style')
        styleTag.setAttribute('id', id)
        document.head.appendChild(styleTag)
      }
      styleTag.innerText = newStyle
    }
  }
  const chalkHandler = getHandler('chalk', 'chalk-style')
  if (!chalk) {
    const url = `/common-assets/css/element-variables.css`
    getCSSString(url, chalkHandler)
  } else {
    chalkHandler()
  }
  const styles = [].slice.call(document.querySelectorAll('style')).filter(style => {
    const text = style.innerText
    return new RegExp(oldTheme, 'i').test(text) && !/Chalk Variables/.test(text)
  })
  styles.forEach(style => {
    const { innerText } = style
    if (typeof innerText !== 'string') return
    style.innerText = updateStyle(innerText, originalCluster, themeCluster)
  })
}

function getCSSString (url, callback) {
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      chalk = xhr.responseText.replace(/@font-face{[^}]+}/, '')
      callback()
    }
  }
  xhr.open('GET', url)
  xhr.send()
}

function getThemeCluster (theme) {
  const tintColor = (color, tint) => {
    let red = parseInt(color.slice(0, 2), 16)
    let green = parseInt(color.slice(2, 4), 16)
    let blue = parseInt(color.slice(4, 6), 16)
    if (tint === 0) { // when primary color is in its rgb space
      return [red, green, blue].join(',')
    } else {
      red += Math.round(tint * (255 - red))
      green += Math.round(tint * (255 - green))
      blue += Math.round(tint * (255 - blue))
      red = red.toString(16)
      green = green.toString(16)
      blue = blue.toString(16)
      return `#${red}${green}${blue}`
    }
  }
  const shadeColor = (color, shade) => {
    let red = parseInt(color.slice(0, 2), 16)
    let green = parseInt(color.slice(2, 4), 16)
    let blue = parseInt(color.slice(4, 6), 16)
    red = Math.round((1 - shade) * red)
    green = Math.round((1 - shade) * green)
    blue = Math.round((1 - shade) * blue)
    red = red.toString(16)
    green = green.toString(16)
    blue = blue.toString(16)
    return `#${red}${green}${blue}`
  }
  const clusters = [theme]
  for (let i = 0; i <= 9; i++) {
    clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
  }
  clusters.push(shadeColor(theme, 0.1))
  return clusters
}

function updateStyle (style, oldCluster, newCluster) {
  let newStyle = style
  oldCluster.forEach((color, index) => {
    newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
  })
  return newStyle
}

export default {
  changeTheme,
  getUserThemeKey,
}
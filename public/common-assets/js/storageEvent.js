// 新打开页签，设置一个storage值触发事件
if (!sessionStorage.length) {
  localStorage.removeItem('clearSessionStorage')
  localStorage.setItem('getSessionStorage', Date.now().toString())
}
// 注册storage变更监听事件
window.addEventListener('storage', function (event) {
  if (event.key === 'getSessionStorage') {
    // 有新打开的页签调取storage，将值放在全局，然后移除掉
    localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage))
    localStorage.removeItem('sessionStorage')
  } else if (event.key === 'clearSessionStorage') {
    // 有其他页签登出，本页签跟随登出
    sessionStorage.clear()
    window.location.replace(event.newValue)
  } else if (event.key === 'sessionStorage' && !sessionStorage.length) {
    if (event.newValue) {
      var value = JSON.parse(event.newValue)
      if (value) {
        // 新页签收到放全局的变更事件，存放在本页签
        var keys = Object.keys(value)
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i]
          sessionStorage.setItem(key, value[key])
        }
      }
    }
  }
})
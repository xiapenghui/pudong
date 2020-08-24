<template>
    <iframe scrolling="no" :ref="$route.path" :src="iframeSrc">
    </iframe>
</template>

<script>
  export default {
    name: 'IFramePage',
    props: {
      url: String,
    },
    data () {
      const themeKey = this.$$utils.theme.getUserThemeKey()
      const { defaultTheme } = this.$$config
      return {
        intervalIndex: -1,
        defaultTheme,
        themeKey,
        themeUpdated: false,
        currentTheme: '',
        oldTheme: '',
        iframeSrc: this.url || this.$route.meta.url,
      }
    },
    methods: {
      /**
       * 重设IFRAME高度
       * @param obj iframe
       */
      resizeIframe (obj) {
        const vm = this
        // 对同域页面进行高度调整消除滚动条
        if (obj.contentWindow && obj.contentWindow.document
          && (window.location.origin === obj.contentWindow.location.origin || window.location.origin ===
            obj.contentWindow.origin)) {
          const { document } = obj.contentWindow
          if (document.body) {
            let iframeHeight = Number(obj.style.height.split('px')[0])
            let iframeBodyHeight = document.body.scrollHeight
            if (iframeHeight !== iframeBodyHeight) {
              obj.style.height = `${iframeBodyHeight}px`
            }
            // 获取当前皮肤
            let theme = localStorage.getItem(vm.themeKey)
            // 若与页面内皮肤不一致，则进行更新
            if (theme !== vm.currentTheme) {
              vm.themeUpdated = false
            }
            // 判断皮肤是否添加成功，未添加或有更新，则执行更换方法
            const style = document.getElementById('chalk-style')
            if (!vm.themeUpdated || !style) {
              vm.themeUpdated = true
              vm.$$utils.theme.changeTheme(document, {
                defaultTheme: vm.defaultTheme,
                newTheme: theme,
                oldTheme: vm.currentTheme || vm.defaultTheme,
              })
              vm.currentTheme = theme
            }
          }
        } else {
          window.clearInterval(this.intervalIndex)
        }
      },
    },
    mounted () {
      const vm = this
      const iframeEl = vm.$refs[vm.$route.path]
      // 设置定时器实时调整页面高度和皮肤
      vm.intervalIndex = setInterval(function () {
        vm.resizeIframe(iframeEl)
      }, 200)
    },
  }
</script>

<style scoped>
    iframe {
        width: 100%;
        height: 100%;
        border: none;
    }
</style>
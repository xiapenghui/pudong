<template>
    <el-color-picker
            v-model="theme"
            class="theme-picker"
            :predefine="predefineColors"
            popper-class="theme-picker-dropdown"
    />
</template>

<script>
  import utils from '@utils'
  import config from '@configs'

  const { defaultTheme } = config
  const themeKey = utils.theme.getUserThemeKey()

  let theme = localStorage.getItem(themeKey)
  if (!theme) {
    localStorage.setItem(themeKey, defaultTheme)
    theme = defaultTheme
  }

  export default {
    data () {
      return {
        theme,
        /**
         * 预定义颜色
         */
        predefineColors: [
          '#0b8b7d', // 国网绿
          '#2f4050', // 默认深
          '#910000', // 恒能红
          // '#006CD2',
        ],
      }
    },
    watch: {
      theme (val, oldVal) {
        utils.theme.changeTheme(document, { defaultTheme, newTheme: val, oldTheme: oldVal })
        localStorage.setItem(themeKey, val)
      },
    },
    methods: {},
    created () {
      if (defaultTheme !== theme) {
        utils.theme.changeTheme(document, { defaultTheme, newTheme: theme, oldTheme: defaultTheme })
        localStorage.setItem(themeKey, theme)
      }
    },
  }
</script>

<style>
    .theme-picker .el-color-picker__trigger {
        vertical-align: middle;
    }

    .theme-picker-dropdown .el-color-dropdown__link-btn {
        display: none;
    }
</style>

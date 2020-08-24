<template>
    <div id="direwolfVueApp">
        <router-view name="login"></router-view>
        <router-view></router-view>
    </div>
</template>

<script>
  export default {
    name: 'direwolfVueApp',
    data () {
      return {
        utils: this.$$utils,
        confirm: this.$confirm,
      }
    },
  }
</script>

<style lang="scss">
</style>

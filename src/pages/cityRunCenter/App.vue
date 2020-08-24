<template>
    <!-- <div id="cityRunCenterVueApp"> -->
    <div id="bigScrenVueApp">
        <router-view name="cityRunCenterLogin"></router-view>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'cityRunCenterVueApp',
        data () {
            return {
                utils: this.$$utils,
                confirm: this.$confirm
            }
        },
    }
</script>

<style lang="scss">
</style>

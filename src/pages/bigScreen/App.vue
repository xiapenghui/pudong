<template>
    <div id="bigScrenVueApp">
        <router-view name="bigLogin"></router-view>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'bigScrenVueApp',
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

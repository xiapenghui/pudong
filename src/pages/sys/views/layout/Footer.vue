<template>
  <div class="footer">
    <div class="version">
      <b>Version</b> {{ $$config.version }}
    </div>
    <span>Copyright © 2018-2019 {{ $$config.siteName }}.</span>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    methods: {}
  }
</script>
<style lang="scss">
  .footer {
    width: 100%;
    font-size: 14px;
    background: #fff;
    line-height: 50px;
    padding: 0 12px;
    height: 50px;
    color: #444;
    border-top: 1px solid #d2d6de;
    .version {
      float: right;
      b {
        font-weight: 700;
      }
      .github{
        color: #444;
        font-size: 20px;
        margin-left: 8px;
        &:hover{
          color: #8BC34A;
        }
      }
    }
  }
</style>

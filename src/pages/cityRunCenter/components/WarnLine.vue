<template>
  <div :class="className">
    <div v-for="i in itemSize" :key="i" :class="itemClassName"></div>
  </div>
</template>

<script>
export default {
  props: {
    className: {
      type: Array,
      required: true,
      default: ["cLine"]
    },
    itemClassName: {
      type: Array,
      required: true,
      default: ["cLineItem"]
    },

    itemSize: {
      type: Number,
      required: true,
      default: 15
    }
  }
};
</script>
<style scoped>
.cLine {
  float: left;
  width: 148px;
  height: 100%;
  box-sizing: border-box;
  padding: 8px 0;
}
.cLineItem {
  width: 6px;
  height: 100%;
  margin-right: 6px;
  background: #32b16c;
  float: left;
}
.cLineItem.cLineItem2 {
  margin-right: 0;
}
.cLineItem.warnItem{
  background: #ec6941;
}
</style>


<template>
  <div class="widget-div" v-if="data && data.length">
    <div class="icon-div">
      <span v-if="textStacked" class="fa-stack fa-1x">
        <i :class="icon" class="fa-stack-2x"/>
        <span class="fa fa-stack-1x icon-text">{{ textStacked }}</span>
      </span>
      <span v-else>
        <i :class="icon"/>
      </span>
    </div>
    <div class="text-div">
      <span v-if="typeof data === 'string'" class="text-center">
        {{ data }}
      </span>
      <span v-else v-for="(item, i) of data" :key="i">
        {{ (typeof item === 'object') ? item[field] : item }}
        <br v-if="data.length > 1 && data.length !== i + 1">
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "IconTextWidget",
  props: {
    data: {
      type: [Array, String],
      default: [],
      required: true
    },
    field: {
      type: String,
      default: undefined
    },
    icon: {
      type: String,
      default: undefined,
      required: true
    },
    textStacked: {
      type: String,
      default: undefined
    }
  }
};
</script>

<style lang="sass" scoped>
  .widget-div
    margin: .5rem 0px
    display: flex
    align-items: center

    .icon-div 
      display: inline
      margin-left: .5rem
      span
        .icon-text
          font-size: 1.2rem

    .text-div
      display: inline
      margin-left: .5rem

</style>
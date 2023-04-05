<template>
  <div class="editor-read-only ql-editor" v-html="content"/>
</template>

<script>
export default {
  props: {
    content: String,
  },
}
</script>

<style lang="sass" scoped>
@import '~quill/dist/quill.core.css';

.ql-editor
  display: inline
  padding: 0
  overflow: hidden
  line-height: 27px
  min-height: 0px
  height: 100%
  font-size: initial
</style>

<template>
  <div :style="{'border-left-color': node.color }" :class="{'first-style' : node.level == 1, 'other-style' : node.level > 1 }">
    <div class="label"  :class="[{'minus-padding': !node.children},{'title menu':  node.level== 0}]" >
      <span @click="setCollapse()" v-if="node.children && node.children.length && node.level>0"  :style="{'color': node.color, 'font-size': '2rem', 'width': '30px'}"><i v-if="!collapsed" class="fas fa-angle-down"></i><i v-else class="fas fa-angle-right"></i> &nbsp; </span>
      <span @click="setCollapse()" v-else-if="node.children && node.children.length && node.level==0"  :style="{'color': '#FFF','font-size': '2rem', 'width': '30px'}"><i v-if="!collapsed" class="fas fa-angle-down"></i><i v-else class="fas fa-angle-right"></i> &nbsp; </span>
      <span v-else :style="{'font-size': '2rem', 'color': node.color, 'width': '30px'}"> <i class="fas fa-minus"></i> &nbsp; </span> 
      <img v-if="node.url" :src="getImgURL(node.url)" :class="{'more-padding': !node.children}">
      <img node.level class="img-shot" v-else :class="{'more-padding': !node.children}">
      <span @click="onClickButton(node.id)" class="name" v-html="'&nbsp;' + node.label" v-b-tooltip.hover.html :title="node.label"
        :style="node.level <= 1 ? 'font-weight: 600' : ''"
      ></span>
    </div>
    <div v-if="node.children && node.children.length"  :class="{'collapse': collapsed}">
        <node v-for="(child,i) in node.children" :key="i" :node="child" @emitId="onClickChild" :isSearching="isSearching" ></node>
    </div>
  </div>
</template>

<script>
import S_UTIL from "../../util/sipsder_util";
export default {
  name: "node",
  props: {
    node: Object,
    isSearching: Boolean
  },
  data(){
      return{
          collapsed: false,
          firstStyle: {
              'border-left-style': 'solid',
              'border-left-width': '10px'
          },
          otherStyle: {
              'border-left-style': 'solid',
              'border-left-width': '5px'
          }
      }
  },
  watch: {
    isSearching: function (val) {
        if(val === true) {
          this.collapsed = false
        } else if( val === false) {
          this.node.level == 1 ? this.collapsed = false : this.collapsed = true
        }
          
    },
  },
  mounted(){
    if(this.node.level >= 1)
        this.collapsed = true
  },
  methods:{
    getImgURL (url) {
          return S_UTIL.getImgURL(url);
    },
    setCollapse(){
        this.collapsed =  !this.collapsed
    },
    onClickChild (event) {
      this.$emit('emitId', event)
    },
    onClickButton (event) {
     this.$emit('emitId', event)
    }
  }
};
</script>

<style lang="sass" scoped>
    @import '../../stylesheets/style.sass'
    .menu
        cursor: pointer
        height: 40px
    .title
        background: $colorTitle
        color: #fff
        padding: 0 10px
        font-weight: bold
    span
        display: inline-block
    .first-style
        border-left-style: solid
        border-left-width: 8px
        padding-left: 7px
    .other-style
        border-left-style: solid
        border-left-width: 7px
        padding-left: 8px
    .collapse
        height: 0
    .minus-padding
        margin-left: -8px
    .more-padding
        margin-left: 8px
    .label
        cursor: pointer
        min-height: 20px
        max-height: 40px
        width: 100% 
        white-space: nowrap
        line-height: 20px
        .name
          margin-top: 7px
          width: 82% 
          text-overflow: ellipsis
          overflow: hidden
        img
          margin-top: -7px
          max-height: 20px
          width: 20px
          background: $colorTitle
        .img-shot
          margin-top: -7px
          background: transparent
          border: none
          border-color: #fff
          max-height: 20px
          width: 20px

</style>

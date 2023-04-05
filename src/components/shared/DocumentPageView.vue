<template>
    <div>
        <div class="feed-title">{{$t( 'library.visor.title' )}}</div>
        <div class="col-90 container-form">
            <div>
                <document-view :id="id"></document-view>
            </div>
        </div>
    </div>
</template>

<script>
import DocumentView from './DocumentView.vue';
export default {
    components:{
        "document-view": DocumentView
    },
    data(){
      return{
            id: null
      }
    },
    created() {
        this.id = this.$route.params.id
    }
}
</script>

<style lang="sass" scoped>
@import '../../stylesheets/style.sass'
.feed-title
  position: relative
  display: inline-block
  color: #fff
  background: url(../../assets/title/barra_sola_2.png)
  background-repeat: no-repeat
  background-size: 100% 100%
  height: 90px
  width: 105%
  font-size: 40px
  font-weight: bold
  font-family: $fontBody
  margin-left: -10%
  margin-top: 15px
  margin-bottom: 3%
  padding-left: calc(10% + 20px)
  padding-top: 20px
  a
    text-decoration: none
    color: #fff
.col-90
    width: 90%
    margin-left: auto
    margin-right: auto
    .message
        padding: 10px
        text-align: center
        background: $colorTitleDark
        color: #fff
        font-size: 1.5rem
        font-family: $fontBody
        font-weight: bold
.info
    padding: 20px
    border: 3px solid $colorTitle
    position: relative
    .info-document
        display: grid
        grid-gap: 15px
        grid-template-columns: 18% 82%
        .icon
            width: 80%
            text-align: center
            justify-self: start
            img
                width: 80%
        .text
            position: relative
            .load
                position: absolute
                bottom: 0
            .colors-container
                width: 100%
                height: 30px
                .colors
                    margin: 5px 0 0 5px
                    width: 25px
                    height: 25px
                    border-radius: 50%
                    float: left
    .share-grid
        position: absolute
        bottom: 10px
        right: 0px
        margin-top: 25px
        .load
            line-height: 60px
        .share
            height: 50px
            display: -webkit-box
            justify-content: end
            div
                display: inline-block
                height: 50px
                margin-right: 25px
</style>

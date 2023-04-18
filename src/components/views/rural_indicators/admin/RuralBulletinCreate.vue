<template>
    <div>
        <div class="col-90 container-form">
            <div>
                <document-admin :id="id" :tracking-bulletin="true"></document-admin>
            </div>
        </div>
    </div>
</template>

<script>
import DocumentAdmin from '@/components/views/rural_library/DocumentAdmin';
export default {
    components:{
        DocumentAdmin
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
@import '../../../../stylesheets/style.sass'

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

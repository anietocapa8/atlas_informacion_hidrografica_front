<template>
<div>    
  <b-modal ref="imageModal" id="image-modal" size="lg" centered hide-footer>
    <b-row>
      <b-col cols="12">
        <img class="image-modal" :src="getImgURL(attachments[index].url)" >
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" class="d-flex justify-content-center" >
        <sipsder-btn @onClick="closeMagnifyImage" btnType="accept" :title="$t('signature.error_modal_accept_button')">
        </sipsder-btn>
      </b-col>
    </b-row>
  </b-modal>

  <div class="carousel-wrapper">
    <div 
      v-if="attachments[ index ]" 
      class="image text-center" 
      :style="`min-height: ${height}px`"
    >
      <div 
        v-if="attachments[ index ].typeName == 'Video' || (attachments[ index ].type && attachments[ index ].type.type == 'Video')" 
        :style="`min-height: ${height}px; height: ${height}px`"
      >
        <iframe :src="attachments[index].url" frameborder="0" 
          class="image-img"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
          :style="{ border: '3px solid ' + this.colors[0] }">
        </iframe>
      </div>
      <div v-else :style="`min-height: ${height}px; height: ${height}px`">
        <img 
          v-if="magnify"
          class="image-img"
          @click="magnifyImage(attachments[index].url)"
          :src="getImgURL(attachments[index].url)" 
          :style="{ cursor: 'pointer', border: '3px solid ' + this.colors[0], objectFit: `${fillImage ? 'fill' : 'contain'}` }"
        >
        <img 
          v-else
          class="image-img"
          :src="getImgURL(attachments[index].url)" 
          :style="{ border: '3px solid ' + this.colors[0], objectFit: `${fillImage ? 'fill' : 'contain'}`  }"
        >
      </div>
      <button class="button previmg" @click="prevImg()" v-if="attachments.length>1 && index!=0">
      	<i class="fas fa-chevron-left"></i>
      </button>
      <button class="nextimg" @click="nextImg()" v-if="attachments.length>1 && index!=attachments.length-1">
      	<i class="fas fa-chevron-right"></i>
      </button>
    </div>
    <div v-if="showInfo">
      <b-row v-if="attachments[ index ] && ruralModels">
        <b-col class="left-aligned" div v-if="fields">
          <div v-for="(field, i) in fields" :key="i">
            <span v-if="field.style === undefined || !field.style.includes('strong')">{{ (field.prev ? field.prev : '') + attachments[index][field.name] }}</span>
            <span v-else><strong>{{ attachments[index][field.name] }}</strong></span><br>
          </div>
        </b-col>
        <b-col v-else class="left-aligned">
          <span><strong>{{attachments[ index ].title}}</strong></span><br>
          <span>{{attachments[ index ].description}}</span><br>
          <span>Autor: {{attachments[ index ].author}}</span><br>
        </b-col>
        <b-col class="right-aligned mt-1" cols="auto" v-if="colors.length">
          <b-row align-h="end">
            <div v-for="(color, i) in this.colors" :key="i"
              class="circle" :style="{ background: color }"
              v-b-tooltip.hover="ruralModels[ i ].name">
            </div>
          </b-row>
        </b-col>
      </b-row>
    </div>
  </div>
</div>
</template>

<script>
import S_UTIL from "@/util/sipsder_util";

	export default {
    mounted( ) {
      this.setDelay();
    },
		data: () => ({
      index: 0,
      colorTitle: '#FF00FF',
      interval: undefined,
		}),
		props: {
			attachments: {
				type: Array,
				default: []
			},
			fields: {
				type: Array,
				default: undefined
			},
      ruralModels: {
        type: Array, 
        default: []
      },
      delay: {
        type: Number,
        default: -1
      },
      showInfo: {
        type: Boolean,
        default: true
      },
      height: {
        type: Number,
        required: false,
        default: 250
      },
      magnify: {
        type: Boolean,
        default: false
      },
      fillImage: {
        type: Boolean,
        default: false
      }
		},
		methods: {
      getImgURL (url) {
        return S_UTIL.getImgURL(url);
      },
      magnifyImage (img) {
        this.imageSelected = img;
        this.$refs.imageModal.show();
      },
      closeMagnifyImage () {
        this.$refs.imageModal.hide();
      },
			nextImg( ) {
        this.setDelay();
        if( ( this.index + 1 ) > ( this.attachments.length - 1 ) )
          this.index = 0;
        else
          this.index += 1; 
      },
      prevImg( ) {
        this.setDelay();
        if( ( this.index-1 ) <= 0 )
          this.index = 0;
        else
          this.index -= 1;
      },
      setDelay( ) {
        if (this.interval) 
          clearInterval(this.interval);
        if (this.delay > 0) {
          this.interval = setInterval(() => {
            this.nextImg();
          }, this.delay * 1000 ) ;
        }
      }    
		},
    computed: {
      colors( ){
        let colors = [ ];
        this.ruralModels.forEach(ruralModel => {
          colors.push( ruralModel.color );
        });
        return colors;
      }
    },
	}	
</script>
<style lang="sass" scoped>
  @import '../../../stylesheets/style.sass'
  .image-modal
    width: 100%
  .carousel-wrapper
    height: 100%
    width: 100%
    align-self: center
    .left-aligned
      padding-left: 60px
    .right-aligned
      padding-right: 60px
    .circle
      border-radius: 50%
      height: 20px
      width: 20px
      border: 3px solid transparent
      margin: 0px 5px 0px 5px
    .title
      text-align: center
      font-size: 24px
      color: $colorTitle
      padding: 15px
      font-weight: bold
    .image
      position: relative
      min-height: 250px
      div
        height: 250px
        min-height: 250px
        img
          object-fit: contain
          width: calc(100% - 75px)
          height: 100%
        iframe
          width: calc(100% - 75px)
          height: 100%
      button
        background: transparent
        border: 3px solid transparent
        border-radius: 3px
        font-size: 30px
        color: black
        font-weight: bold
      .previmg
        position: absolute
        left: 5px
        top: 0
        height: 100%
        border-right: 1px solid transparent
        outline: none
      .nextimg
        position: absolute
        right: 5px
        top: 0
        height: 100%
        border-left: 1px solid transparent
        outline: none

  @media screen and (max-width: $widthMobile)
    .image-img
      width: calc(100% - 40px) !important
    .previmg
      transform: translateX(-50%) !important
    .nextimg
      transform: translateX(50%) !important

</style>
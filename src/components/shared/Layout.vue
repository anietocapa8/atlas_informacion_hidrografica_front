<template>
  <div class="container-sipsder">
    <app-header></app-header>
    <router-view
    :key="$i18n.locale"
    tag="div"
    class="container-box"
    @move-up="moveUp"/>
    <app-footer></app-footer>
    <div class="vld-parent">
      <loading :active.sync="isLoading" 
        :can-cancel="false" 
        :on-cancel="onCancel"
        :is-full-page="fullPage">
      </loading>
    </div>
    <b-modal ref="requestError" :title="$t('requestError.title')" hideFooter>
      <p class="info-msg"> {{ $t(`requestError.${getErrorCode}`) }} </p>
      <p class="info-msg"> {{ getCurrentDate() }} </p>
      <br>
      <sipsder-btn btnType="accept" @onClick="hideModal()"></sipsder-btn>
    </b-modal>
  </div>
</template>

<script>
import Header from './Header.vue';
import Footer from './Footer.vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import 'vue-cal/dist/vuecal.css';
import { HTTP_STATUS } from '../../sipsder_constants';
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  data(){
    return {
      fullPage: true,
      errorMessage: ''
    }
  },
  methods: {
    getCurrentDate() {
      return moment().format('MM/DD/YYYY hh:mm')
    },
    showModal() {
        this.$refs.requestError.show();
    },
    hideModal() {
        this.$refs.requestError.hide();
        this.$store.dispatch('clearErrorCode');
    },
    moveUp(){
      this.$scrollTo('.container-sipsder', 500);
    },
    onCancel() {
      // console.log('User cancelled the loader.')
    }
  },
  computed: {
    ...mapGetters(['getErrorCode']),
    isLoading() {
      return this.$store.getters.isLoading > 0;
    }
  },
  watch: {
    getErrorCode (val) {
      if (val) {
        this.showModal();
      }
    }
  },
  components: {
    "app-header": Header,
    "app-footer": Footer,
    "loading": Loading
  },
  beforeCreate(){
    this.$store.dispatch('setLogosColors')
    this.$store.dispatch('fetchPublicPermissions');
  },
  mounted() {
    let self = this
    this.$store.dispatch('setActiveSocialNetworks', {
      active: 1
    })
    this.$store.dispatch('setScreenWidth', {
      width: document.documentElement.clientWidth
    })
    this.$nextTick(function() {
      window.addEventListener('resize', function(e) {
        self.$store.dispatch('setScreenWidth', {
          width: document.documentElement.clientWidth
        })
      })
    })
  },
};
</script>
<style lang="sass">
  @import '../../stylesheets/style.sass'
  .container-sipsder
    +flexbox
    +flex-wrap(wrap)
    +align-items(stretch)
    width: 100%
    overflow-y: auto
    overflow-x: hidden
    .container-box
      width: 100%
      min-height: calc(100vh)
</style>

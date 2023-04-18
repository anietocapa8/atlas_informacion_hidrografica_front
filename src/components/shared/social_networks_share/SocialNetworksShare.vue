<template>
  <div>
    <div v-if="isLogged">
      <a @click="shareFacebook" class="facebook-style"> 
        <i class="fab fa-facebook"></i>
      </a>
      <a @click="shareWhatsApp" class="whatsApp-style"> 
        <i class="fab fa-whatsapp"></i>
      </a>
      <vue-goodshare-twitter button_design="gradient" has_icon :page_url="getShareUrl( )"
      ></vue-goodshare-twitter>
    </div>
    <div v-else >
      <span v-b-tooltip.hover :title="$t('util.loginMSg')">
        <a class="dissable-style"> 
          <i class="fab fa-facebook"></i>
        </a>
        <a class="dissable-style"> 
          <i class="fab fa-whatsapp"></i>
        </a>
        <a class="dissable-style"> 
          <i class="fab fa-twitter"></i>
        </a>
      </span>
    </div>
  </div>
  
</template>

<script>
import VueGoodshareTwitter from "vue-goodshare/src/providers/Twitter.vue";

import axios from "axios";

export default {
  components: {
    VueGoodshareTwitter,
  },
  props: {
    detailedUrl: null,
    exactUrl: null
  },
  data() {
    return {
    };
  },
  beforeCreate() {},
  methods: {
    getShareUrl( ) {
      let url = window.location.href;
      if( this.exactUrl != null )
        url = this.exactUrl;
      else if( this.detailedUrl != null )
        url = url + this.detailedUrl
      url = url.replace("#", "%23");
      return url;
    },
    shareWhatsApp() {
      window.open(
        'https://api.whatsapp.com/send?text=' + this.getShareUrl( ),

        '', 'witdh=100px'
      );
    },
    shareFacebook(){
      window.open(
        'https://www.facebook.com/sharer/sharer.php?u=' + this.getShareUrl( ),

        '', 'witdh=100px'
      );
    }
  },
  computed: {
    isLogged( ) {
        return this.$store.getters.isAuthenticated;
    },
  }
};
</script>
<style lang="scss">
.whatsApp-style{
    background: #00D34F;
    border-radius: 3px;
    padding: 7.5px 12px;
    margin: 3px 1.5px;
    cursor: pointer;
    &:hover {
       background: #25D366; 
    };

    i{
          font-size: 17px;
    }
}

.facebook-style{
    
    background: #3b5998;
    border-radius: 3px;
    padding: 7.5px 12px;
    margin: 3px 1.5px;
    cursor: pointer;
    &:hover {
       background: #8b9dc3; 
    };

    i{
          font-size: 17px;
    }
}
.whatsApp-margin{
    margin: 6px;
}

.dissable-style{
    color: #fff;
    background: rgb(63, 71, 66);
    border-radius: 3px;
    padding: 7.5px 12px;
    margin: 3px 1.5px;
    cursor: pointer;
    &:hover {
       background: rgb(16, 20, 17); 
    };

    i{
          font-size: 17px;
    }
}
</style>

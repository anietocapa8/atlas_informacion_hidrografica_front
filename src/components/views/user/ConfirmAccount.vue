<template>
    <div class="confirm-email container-form">

          <sipsder-title :title="$t('email_validation.title')"
                        type="user"
                        section="Contáctenos"></sipsder-title>  
          <b-row class="text-center" v-if="confirm">
            <b-col cols="12">
              <h2>{{$t('email_validation.correct_message')}}</h2>
            </b-col>
            <b-col cols="12">
              <sipsder-btn text="Redireccionarme al inicio"
                        btnType="accept"
                        @onClick="goHome()"></sipsder-btn>
            </b-col>
          </b-row>
          <b-row class="text-center" v-if="error">
            <b-col cols="12">
              <h2>{{$t('email_validation.error_message')}}</h2>
            </b-col>
            <b-col cols="12">
              <sipsder-btn text="Redireccionarme al inicio"
                        btnType="accept"
                        @onClick="goHome()"></sipsder-btn>
            </b-col>
          </b-row>


    </div>
</template>

<script>
import VAPI from '../../../http_common';
//import VueRecaptcha from "vue-recaptcha";
import { SERVICE_NAMES, HTTP_STATUS,/* RECAPTCHA_SITE_KEY */} from '../../../sipsder_constants';

export default {
    data: function() {
        return {
            confirm: false,
            error: false,
            //sitekey: RECAPTCHA_SITE_KEY,
        }
    },
    async created(){

      var token = this.$route.query.token

      try{
        let path = `${SERVICE_NAMES.USER_REGISTRATION}/confirm-email?token=${token}`
        let response = await VAPI.get(path);

        if(response.status == 200){

          this.confirm = true;
        }else{
          this.error = true;  
        }
        
      }catch(error){
        this.error = true;
        console.log(error);
      }

    },
    methods: {
      goHome(){
        this.$router.push({ name: 'Home'})
      }
    },
    /*components: {
        "vue-recaptcha": VueRecaptcha,
    }*/
}
</script>


<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'

.confirm-email
  width: 100%
  margin: 0 10%


</style>


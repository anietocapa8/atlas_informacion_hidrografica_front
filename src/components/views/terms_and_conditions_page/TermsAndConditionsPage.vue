<template>
  <div class="terms-detail div-90">
    <b-container>
        <div class="detail-header">
          <sipsder-title :title="$t('terms_conditions.tittle')"></sipsder-title>
        </div>
        <div class="detail-body">
          <b-form-textarea id="textarea1"
              :rows="4"
              :max-rows="6" readonly
              v-model="content">
          </b-form-textarea>
        </div>
        <div>
            <p style="text-align: right"> {{$t('terms_conditions.vigency')}} {{startDate}}</p>    
        </div>
        <div>
            <sipsder-btn @onClick='$router.go(-1)' btnType='back'></sipsder-btn>
        </div>
    </b-container>
    
  </div>

</template>

<script>
import VAPI from "../../../http_common";
import { SERVICE_NAMES } from "@/sipsder_constants";

  export default {

    props: {
        
    },
    data(){
      return {
        content: '',
        endDate: null,
        startDate: '',
        status: null,
        text_terms: null,
      }
    },
    created() {
        VAPI.get(`${SERVICE_NAMES.POLICY_TOOL}/find-one`)
            .then(response => {
                this.content= response.data.content;
                this.startDate = response.data.startDate;
    
            })
            .catch(function(error) {
                console.error("Error al Consumir servicio Termns and conditions: " + error.toString());
            });
    },
    
  }

</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
.terms-detail
  width: 100%
  height: 500px
  margin: 5% 4%

.detail-header
  padding-botton: 1.5rem
  padding-top: 1.5rem
  width: 100%

.detail-body
  margin: 4% 0
.status
  width: 30%

@media screen  and (max-width: $widthTablet)
    .div-90
        width: 80% !important
        margin: 0 auto  
</style>
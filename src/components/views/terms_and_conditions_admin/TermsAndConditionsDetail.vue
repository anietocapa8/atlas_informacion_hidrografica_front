<template>

  <div class="terms-detail">
    <div class="detail-header">

      <div class="status">
        <b-form-select @change="onChange()" v-model="status" :options="options" :disabled="!term.status || term.typeId !== 2" />
      </div>

      <div class="title">
        <h3>{{ $t('terms_n_conditions.tool_policies') }}</h3>
      </div>

    </div>

    <div class="detail-body">
      <div class="information">
        <h4>{{ $t('terms_n_conditions.type_lbl') + term.typeName}}</h4>
        <h4 v-if="typeId === '2'">{{ $t('terms_n_conditions.page_lbl') + term.pageName}}</h4>
        <h4>{{ $t('terms_n_conditions.start_date_lbl') + term.startDate}}</h4>
      </div>
      <b-form-textarea id="textarea1"
          class="text-details"
          :value="term.content"
          :rows="3"
          :max-rows="6" readonly>
          {{ term.content }}
      </b-form-textarea>
    </div>
    
  </div>

</template>


<script>

  export default {

    props: {

      term: {
        type: Object,
        required: false,
        default: () => { return [] }

      }

    },
    data(){
      return {
        content: null,
        endDate: null,
        status: null,
        before: null,
        options: [
          "Activo",
          "Inactivo"
        ]
      }
    },
    created(){

      this.before = this.term.id
      if( !this.term.status ){
        this.status = "Inactivo"
      }else{
        this.status = "Activo"
      }

    },
    watch: {

      term: function (newVal,oldVal){
        
        if( !this.term.status ){
          this.status = "Inactivo"
        }else{
          this.status = "Activo"
        }
        this.before = oldVal.id
      }

    },
    methods: {
      onChange() {
        this.$emit('warning', this.term )
      }
    }

  }


</script>

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'

.terms-detail
  width: 100%
  margin: 10px 0 
  padding: 5% 5%
  border: 1px solid black
  border-radius: 20px
  .detail-body
    margin: 4% 0
  .information
    +flexbox
    +flex-direction(column)
    align-items: flex-start
    margin: 40px 0

.detail-header
  width: 100%


.status
  width: 30%


</style>

<template>
  <div class="filter-table">
    <br>
     <b-container fluid>
          <!-- User Interface controls -->
          <b-row >
            <b-col md="12" class="my-1" center>
              <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="center my-0 pagination-top" ref="pagination-top"/>
            </b-col>
          </b-row>
          <!-- Main table element -->
          <b-table v-if="itemsArray && itemsArray.length" style='font-size:80%'
                  stacked="md"
                  :items="itemsArray"
                  :fields="fields"
                  :current-page="1"
                  :per-page="perPage"
                  :filter="filter"
                  :sort-by.sync="sortBy"
                  :sort-desc.sync="sortDesc"
                  striped
                  fixed
          >
            <template slot="name" slot-scope="row">{{row.value.first}} {{row.value.last}}</template>
            <template slot="isActive" slot-scope="row">{{row.value?'Yes :)':'No :('}}</template>
            <template slot="vanilaDate" slot-scope="row">{{ row.value | moment("DD MMM YYYY - h:mm a")}}</template>
            <!-- Control de Estado habilitado por medio de checkbox ☑ ☒ ☐-->
            <template v-for="(field, k) in fields.filter(f => f.type === Boolean)" :slot="field.key" slot-scope="row">
              <i :key="k" class="far" :class="row.value ? 'fa-check-square': 'fa-square'"/>
            </template>
            <template slot="status" slot-scope="row"><i class="far" :class="row.value ? 'fa-check-square': 'fa-square'"/></template> 
            <template slot="state" slot-scope="row"><i class="far" :class="row.value ? 'fa-check-square': 'fa-square'"/></template> 
            <template slot="contestState" slot-scope="row"><i class="far" :class="row.value ? 'fa-check-square': 'fa-square'"/></template> 
            <template slot="actions" slot-scope="row">
              <div class="text-center">
              <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
                <sipsder-btn
                  v-for="(value,key) in optionsTable"
                  :text="value.label"
                  :btnType="value.icon"
                  :key="key" @click.native.stop="action(row.item, value.id, key,$event.target)"
                />
              </div>
            </template>
            <template slot="row-details" slot-scope="row">
              <b-card>
                <ul>
                  <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value}}</li>
                  <p></p>
                </ul>
              </b-card>
            </template>
          </b-table>
          <p v-else class="p-5 border border-dark">{{$t('policiesAdmin.no_records')}}</p>

          <b-row>
            <b-col md="12" class="my-1" center>
              <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="center my-0" />
            </b-col>
          </b-row>

        </b-container>
  </div>
</template>

<script>
const items = ''
import { mapGetters } from 'vuex'
import moment from 'moment';

export default {
  props: {
    fields: {
      type: Array,
      required: true,
      default: () => { return [] }
    },
    externalQuery: {
      type: Object,
      required: true,
      default: () => { return null }
    },
    optionsTable:{
      type: Object,
      required: false,
      default: () => { return null }
    },
    items:{
      type: String,
      required: false,
      default: () => { return null }
    },
    perPage:{
      type: Number,
      required: false,
      default: () => { return null }
    }
  },
  data() {
    return {
      currentPage: 1,
      totalRows: 2,
      numberOfRegister: 0,
      query: { 
        "page": 1,
        "drop": false
      },
      pageOptions: [ 1, 5, 10, 15 ],
      sortBy: null,
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      modalInfo: { title: '', content: '' },
    }
  },
  watch: {

    currentPage: function (val){
      this.query['page'] = val;
      this.$store.dispatch(this.items + 'Query', this.query);
      this.$store.dispatch(this.items + 'Pages', { ...this.query,  ...this.externalQuery});
      this.$scrollTo('.pagination-top', 500, {offset: -100,});
    },
    externalQuery: function (val){
      this.currentPage = 1
      this.query['drop'] = true
      this.$store.dispatch(this.items + 'Query', this.query)
      this.$store.dispatch(this.items + 'Pages', { ...this.query,  ...this.externalQuery})
    },
    sortDesc:  function (val){
      if( !this.sortDesc ){
        if( this.sortBy !== null ){
          this.changeQuery("sort", this.sortBy + ",ASC");
        }
      }else{
        if( this.sortBy !== null ){
          this.changeQuery("sort", this.sortBy + ",DESC");
        }
      }
    },
    sortBy:  function (val){
      if( !this.sortDesc ){
        this.changeQuery("sort", this.sortBy + ",ASC");
      }else{
        this.changeQuery("sort", this.sortBy + ",DESC");
      }
    }
  },
  computed: {
    sortOptions () {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => { return { text: f.label, value: f.key } })
    },
    itemsArray() {
      
      if (this.$store.getters[this.items] && this.$store.getters[this.items] !== undefined) {
        this.itemsMeta
        return this.$store.getters[this.items]
      }else{
        if(this.query != undefined){
          this.$store.dispatch(this.items + 'Pages', { ...this.query,  ...this.externalQuery})
        }
      }
      
    },
    itemsQuery() {
      if (this.$store.getters[this.items + 'Query'] && this.$store.getters[this.items + 'Query'] !== undefined) {
        return this.$store.getters[this.items + 'Query']
      }else{

        this.$store.dispatch(this.items + 'Query', this.query)
      }

    },
    itemsMeta() {
      this.totalRows = this.$store.getters[this.items + 'Meta']
    }
  },
  methods: {
    action (item, id, name ,button) {
      this.$emit('action', { id, item })
    },
    changeQuery(key,value){
      this.query[key] = value
      this.query['drop'] = true
      this.$store.dispatch(this.items + 'Query', this.query)
      this.$store.dispatch(this.items + 'Pages', { ...this.query,  ...this.externalQuery} )
    },
  }
}
</script>

<style lang="sass" scoped>
  .my-1
    display: flex
    justify-content: center
    align-items: center

  .filter-table .container-fluid
    border-radius: 30px
</style>

<style lang="sass">
  .table
    border: 1px solid #dee2e6
    background-color:#dee2e6 !important
    border-radius: 6px 6px 6px 6px !important
    border-collapse: separate !important
    border-spacing: 1px
    td
      vertical-align: middle !important
      padding: 0px !important
      font-size: 1.3rem !important
      border: 1px solid #dee2e6 !important
      td:first-child
        border-left: medium none !important
    th
      vertical-align: middle !important
      font-size: 1.3rem !important
      border: 1px solid #dee2e6 !important
      th:first-child
        border-left: medium none !important
        border-radius: 6px 0 0 0 !important
      th:last-child
        border-radius: 0 6px 0 0 !important
    thead
      background-color:#989ea4 !important
  .table-striped tbody tr:nth-of-type(n)
    background-color: #fff !important
  .table-striped tbody tr:nth-of-type(2n+1)
    background-color: #D7F3F4 !important
  .page-item.active .page-link
    background-color: #00b7ba !important
    border-color: #00b7ba !important

</style>

<template>
  <div class="most-visited">
    <span>{{$t( 'home.newsFeed.mostVisitedNews')}}</span>
     <ol>
        <li v-for="(v, i) in most_visited" :key="i"><router-link :to="{ name: 'NewsDetail', params: { id: v.id, url: v.url }}">{{v.headline}}</router-link></li>
      </ol>
  </div>
</template>

<script>
  import VAPI from '../../../http_common';
  import { SERVICE_NAMES } from '@/sipsder_constants';

  export default {
    data(){
      return {
        most_visited: []
      }
    },
    methods: {
    
    },
    components:{
      
    },
    mounted() {
    
    },
    beforeMount(){
      VAPI.get(`${SERVICE_NAMES.NEWS}/most-visited`).then((output) => {
        this.most_visited=output.data.data;
      }).catch((e) => {
        
      });
    }
  };
</script>

<style lang="sass" scoped>
  @import '../../../stylesheets/style.sass'
  .most-visited
    height: auto
    min-height: 150px
    width: 100% !important
    margin: 0 !important
    ol
      font-size: 14px
      padding-right: 20px
      padding-top: 30px
      height: 100% !important
      width: 100% !important
      overflow: auto
      li
        margin-bottom: 10px
        text-align: justify
      a
        color: #333 !important
        text-decoration: none
        font-size: 14px
        &:hover 
          text-decoration: underline
    span
      font-weight: bold
      font-size: 20px
      padding: 10px
     

</style>
<template>
    <div style="height: 100px; width: 100px">
        <cloud :data="wordFrequency" :fontSizeMapper="fontSizeMapper"
        :width="250"
        :height="250" />
    </div>
</template>

<script>
    import Cloud from 'vue-d3-cloud'
    import VAPI from '../../http_common'
    import {SERVICE_NAMES} from "../../sipsder_constants";

    export default {
        name: "WordCloud",
        components:{
            Cloud
        },
        data(){
          return{
              news: [],
              wordFrequency: [],
              dict: {},
              temp: [],
              fontSizeMapper: word => word.value * 15
          }
        },
        methods:{
          loadNews(){
              let self = this;
              VAPI.get('/' + SERVICE_NAMES.NEWS).then(response => {
                  self.news = response.data.data;
                  this.getFrequency();
              }).catch(ex => {
                  console.log("Error Loading "+ ex.error())
              })
          },
          getFrequency(){
              for (let i=0; i<this.news.length; i++){
                  let t = this.news[i].tags.split(',');
                  for(let j = 0; j< t.length; j++){
                      this.temp.push(t[j]);
                  }
              }
              while(this.temp.length){
                  let tempKey = this.temp.pop();
                  if (this.dict[tempKey] === undefined){
                      this.dict[tempKey] = 1;
                  }else{
                        this.dict[tempKey] += 1;
                  }
              }
              for (let key in this.dict){
                  let value = this.dict[key];
                  this.wordFrequency.push({text:key, value:value})
              }
          }
        },
        beforeMount:function () {
            this.loadNews();
        }




    }
</script>

<style scoped>

</style>
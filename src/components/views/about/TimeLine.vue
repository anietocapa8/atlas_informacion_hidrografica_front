<template>
  <div class="timeline">
	  <!-- // Vertical Timeline -->
    <div class="grid-timeline">
      <div class="grid-events">
        <div class="title"></div>
        <div class="eventItems" v-for="(v, i) in hechos" :key="i" @click="selectEvent(v)" :class="{active : v.id == selectedEvent.id}"><div class="dateBox" v-if="selectedEvent.date" >{{getDate(v.date)}}</div><div class="infoBox">{{i+1 | number}} - {{v.event}}</div></div>
        <div class="title"></div>
      </div>
      <div class="events-detail">
        <div class="title">{{selectedEvent.event}}<hr></div>
        <div class="image" v-if="eventAttach[index]">
          <div v-if="eventAttach[index].type=='Video'">
            <iframe :src="eventAttach[index].url" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
          <div v-else>
            <img :src="getImgURL(eventAttach[index].url)">
          </div>
          <button class="button previmg" @click="prevImg()" v-if="eventAttach.length>1 && index!=0"><i class="fas fa-caret-left"></i></button>
          <button class="nextimg" @click="nextImg()" v-if="eventAttach.length>1 && index!=eventAttach.length-1"><i class="fas fa-caret-right"></i></button>
        </div>
        <div class="dateItem" v-if="selectedEvent.date"><hr> {{getDate(selectedEvent.date)}}</div>
        <rich-text-preview class="description" :content="selectedEvent.description"/>
        
      </div>
    </div>
  </div>
</template>

<script>

  import VAPI from '../../../http_common';
  import RichTextPreview from "../../shared/RichTextPreview";
  import S_UTIL from "../../../util/sipsder_util";
  import { SERVICE_NAMES, HTTP_STATUS } from '@/sipsder_constants';

  export default {  
    props: {
      selectedIdx : {
        type: Number,
        default: 0,
      },
    },
    components: {
      RichTextPreview,
    },
    
    data() {
  
      return {
        index: 0,
        hechos: [],
        body: null,
        selectedEvent:{},
        eventAttach:[]
      }
  
    },
    beforeMount(){
      VAPI.get(`${SERVICE_NAMES.ABOUT}/events-list`).then((output) => {
         this.hechos=output.data.data;
         this.selectedEvent=this.hechos[this.selectedIdx];
         VAPI.get(`${SERVICE_NAMES.ABOUT}/event/attach/${this.selectedEvent.id}`).then((output) => {
            this.eventAttach=output.data.data;
            this.order()
          }).catch((e) => {
            console.error("Error Cargando eventos");
          });
        }).catch((e) => {
          console.error("Error Cargando eventos");
        });
    },
		methods: {
      getImgURL (url) {
        return S_UTIL.getImgURL(url);
      },
      getMoreInformation(i) {
        this.body = this.hechos[i].description
        this.index = i
      },
      order() {
          this.eventAttach.sort((a,b) => (a.principal < b.principal) ? 1 : ((b.principal < a.principal) ? -1 : 0));
      },
      nextImg(){
        if((this.index+1)>=(this.eventAttach.length-1)){
          this.index=this.eventAttach.length-1
        }
        else{
          this.index++
        }
      },
      prevImg(){
        if((this.index-1)<=0){
          this.index=0
        }
        else{
          this.index--
        }
      },
      selectEvent(event){
        VAPI.get(`${SERVICE_NAMES.ABOUT}/event/attach/${event.id}`).then((output) => {
          this.index=0
          this.eventAttach=[]
          this.eventAttach=output.data.data;
          this.order()
          this.selectedEvent=event
        }).catch((e) => {
          
        });
      },
      getDate:function(date){
        let dateBreak = date.split("-")
        let newDate = dateBreak[2] + " " + this.$t( 'util.months.'+ dateBreak[1]) + " " + dateBreak[0]
        return newDate
      }
		},
		filters: {
			number: function (value) {
			    if (parseInt(value) < 10){
			    	return "0" + value
			    }else {
			    	return value
			    }
			}
		},
		mounted: function() {
		}
  
  }
</script>

<style lang="sass" scoped>
  @import '../../../stylesheets/style.sass'
  @media screen  and (max-width: 1720px)
    .infoBox:before
      content: none !important
      display: none !important
  @media screen  and (max-width: 1300px)
    .grid-timeline
        grid-template-columns: 1fr !important
        .grid-events
          max-height: 200px !important

  @media screen  and (max-width: 700px)
    .grid-timeline
        grid-template-columns: 1fr !important
        .grid-events
          max-height: 200px !important
          .eventItems
            .dateBox
              font-size: 12px
            .infoBox
              font-size: 12px
              margin-left: 0 !important
              padding-left: 9px !important
              padding-top: 9px !important
              overflow: hidden
        .events-detail
          .image
            min-height: 100px !important
            div
              height: auto !important
              min-height: 100px !important
              img
                width: 100%
                height: auto !important
            .previmg
              left: -10px !important
            .nextimg
              right: -10px !important
  .timeline
    width: 100%
    font-size: 18px
  *, *:before, *:after 
    box-sizing: border-box
  .active
    .infoBox
      background: $colorTitle
      color: #ffffff
      transition: 0.5s
  .grid-timeline
    display: grid
    grid-template-columns: 1fr 1fr
    // background-color: #ffffff
    border: 3px solid $colorTitle
    border-radius: 5px
    padding: 30px
    width: 97%
    margin-left: auto
    margin-right: auto
    .grid-events
      //display: grid
      //grid-template-columns: 1fr
      // max-height: 850px
      overflow-y: auto
      .title
        background: $colorTitle
        color: #ffffff
        padding: 15px
        text-align: center
        width: 5em
        height: 5em
        border-radius: 5em
        border-radius: 3em
      .eventItems
        margin-left: 2.5em
        border-left: 5px solid $colorTitle
        padding: 15px 0 15px 15px
        margin-top: -5px
        margin-bottom: -5px  
        display: grid
        grid-template-columns: 20% 70%
        .dateBox
          display: inline-block
          width: 5em
          height: 5em
          border-radius: 5em
          margin-left: -3.5em
          background: $colorTitle
          color: #ffffff
          text-align: center
          padding-top: 1em
        .infoBox
          cursor: pointer
          display: inline-block
          height: 5em
          padding-top: 1.5em
          padding-left: 30px
          margin-left: -3em
          border-radius: 3em
          box-shadow: 0px 0px 3px
          &:before
            content: ""
            position: relative
            display: inline-block
            width: 0px
            height: 0px
            border-top: 10px solid transparent
            border-bottom: 10px solid transparent
            border-left: 10px solid $colorTitle
            border-radius: 5px
            left: -60px
          &:hover
            background: $colorTitle
            color: #ffffff
            transition: 0.5s
    .events-detail
      height: 100%
      align-self: center
      .title
        text-align: center
        font-size: 24px
        color: $colorTitle
        padding: 15px
        font-weight: bold
      .image
        min-height: 300px
        padding: 15px
        position: relative
        div
          width: 90%
          height: 300px
          min-height: 300px
          margin: 0 auto
          text-align: center
          img
            height: 100%
            margin: 0 auto
          iframe
            width: 100%
            height: 300px
            margin: 0 auto
        button
          background: transparent
          border: 3px solid $colorTitle
          border-radius: 3px
          font-size: 24px
          color: $colorTitle
          font-weight: bold
        .previmg
          position: absolute
          left: 10px
          top: 0
          height: 100%
          border-right: 1px solid transparent
        .nextimg
          position: absolute
          right: 10px
          top: 0
          height: 100%
          border-left: 1px solid transparent

      .dateItem
        text-align: center
        padding: 15px
      .description
        text-align: justify
        padding: 15px
        max-height: 300px
        overflow-y: auto
       
      


</style>

<style scoped>
@import '../../../stylesheets/style.sass';

.timeline{
  width: 100%;
}
  *, *:before, *:after {
  box-sizing: border-box;
}


/*===== Vertical Timeline =====*/
.container-timeline {
  width: 100%;
  background: #e6e6e6;
  display: flex;
  justify-content: left;
  align-items: left;
  align-content: flex-start;
  flex-wrap: wrap;
  position: relative;
}


.information-container {
	display: flex;
	justify-content: left;
	align-items: left;
	width: 100%;
	position: relative;
}

.information-container i {
	position: absolute;
	left: 73.5%;
    top: -2%;
	font-size: 1.5rem;
	cursor: pointer;
	
}

.information-container i:hover {
	color: red;
	
}

.information {
	background: #e6e6e6;
	font-size: 1.2rem;
	width: 50%;
	color: white;
	font-weight: bold;
	text-align: center;
	padding: 2.5%
}


.container-timeline .timeline-line {
  position: absolute;
  width: 3px;
  height: 100%;
  top: 0;
  left: 3%;
  margin-left: -2px;
  background: #00b0bd;
  z-index: 2;
	
}

.timeline-content {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: left;
	align-items: left;
}

.row-timeline {
	margin-top: 2.5%;
	margin-bottom: 2.5%;
	width: 50%;
	justify-content: flex-start;
	align-items: left;
	display: flex;
	flex-wrap: nowrap;
	position: relative;
}

.content {
   cursor: pointer;
   display: flex;
   justify-content: flex-start;
   align-items: left;
  
   
}

.content .number {
    height: 150px;
	width: 30%;
	color: #00b0bd;
	font-size: 2.5rem;
	background: white;
	display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.5s ease-in;
    border-radius: 60px 0 0 60px;
    
}

.content .title-timeline {
   height: 150px;
   color: black;
   width: 70%;
   font-size: 1.2rem;
   background: white;
   display: flex;
   justify-content: flex-start;
   align-items: center;
   transition: all 1s ease-in;
   border-radius: 0 60px 60px 0;
   
}

.number.selected {
	background: #00B84D !important;
}
.title-timeline.selected {
	background: #00B84D !important;
}

.row-timeline .content {
	width: 80%;
	padding: 5.5% 0;
	
}

.date {
	top: 25%;
	left: 100%;
	margin-left: 50px;
	background: #00b0bd;
	width: 100px;
    height: 100px;
    border-radius: 50%;
    color: white;
	display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    font-weight: bold;
    position: absolute;
    z-index: 2;
}

.row-timeline {
	align-self: flex-end;
	justify-content: flex-end;
} 

.row-timeline .content {
	margin-right: 5.5%;	
} 

.row-timeline .content:after {
	right: 85.5%;
	top: 50%;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
	pointer-events: none;
	border-color: rgba(255, 255, 255, 0);
	border-right-color: #ffffff;
	border-width: 15px;
	margin-top: -15px;
}

.row-timeline .date {
	left: 0%;
	margin-left: -50px;
} 


.container-timeline .title {
	width: 25%;
	text-align: center;
	font-size: 2.5rem;
	background: #00b0bd;
	color: white;
	padding: 2%;
	font-weight: 600;
	z-index: 2;
	
}

.portlet-header {
	display: none;
}

@media only screen and (max-width: 800px) {
  .row-timeline .content {
	width: 70%;
	padding: 5.5% 0;
  }
  
  .row-timeline:nth-child(2n + 1) .content:after {
	left: 75.5%;
  }
  
  .row-timeline:nth-child(2n) .content:after {
	right: 75.5%;
  }
  .content .number {
    height: 250px;
    font-size: 2.0rem;
    
  }

  .content .title-timeline {
    height: 250px;
   
  }
  .date {
  	top: 33%
  }
	
}

@media only screen and (max-width: 400px) {
    /*===== Vertical Timeline =====*/
  .container-timeline {
    justify-content: flex-end;
  }


  .information-container i {
    left: 93.5%
  }

  .information {
    font-size: 2.0rem;
    width: 100%;
  }


  .container-timeline .timeline-line {
    left: 100%;	
  }

  .row-timeline {
    width: 100%;
  }


  .content .number {
      height: 250px;
      display: none;    
      
  }

  .content .title-timeline {
    height: 250px;
    width: 100%;
    border-radius: 60px
    
  }

  .row-timeline .content {
    width: 75%;
    padding: 5.5% 0;
    
  }

  .date {
    top: 35%;
    left: 100%;
    width: 75px;
    height: 75px;
  }


  .row-timeline:nth-child(2n + 1) {
    align-self: flex-start;
  }

  .row-timeline:nth-child(2n + 1) .content:after {
    content: none;
  }

  .row-timeline:nth-child(2n + 1) .content {
    margin-left: 2.5%;
    margin-right: 0%;
  } 

  .row-timeline:nth-child(2n + 1) .date {
    margin-right: -50px;
  } 

  .row-timeline:nth-child(2n) {
    align-self: flex-start;
    justify-content: flex-start;
  } 

  .row-timeline:nth-child(2n) .content {
    margin-left: 2.5%;
    margin-right: 0%;	
  } 

  .row-timeline:nth-child(2n) .content:after {
    content: none;
  }


  .row-timeline:nth-child(2n) .date {
    left: 100%;
    margin-left: -50px;
  } 


  .container-timeline .title {
    width: 50%;
    
  }

}

</style>

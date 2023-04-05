<template>
  <div>
    
    <div class="row">
      <div class="col-sm-12">
        <sipsder-btn v-if="isGoogleChrome" btnType="print" text="Imprimir" class="w-100" @onClick="print_advice()" ></sipsder-btn>
        <sipsder-btn v-if="!isGoogleChrome" btnType="print" text="Imprimir" class="w-100" @onClick="print()" ></sipsder-btn>
      </div>
    </div>
    <div id="printSection" style="visibility: hidden; width: 100%">
      

      <div id="background"
          style="position:absolute;
                 z-index:0;
                 background:white;
                 width: 100%">
            
          <img v-for="index in pages" :key="index" :src="'data:image/png;base64, ' + watermark" style="width: 100%" />

      </div>
      <!-- Este es div que se va a imprimir, su contenido puede ser modificado por el programador -->
      <div ref="infoCanvas" class="printCanvas" 
        style="text-align: center;
               position:absolute;
               z-index:1;">

        <div>
          <div>
            <h2>{{title}}</h2>
          </div>
          <div>
            <h4>{{description}}</h4>
          </div>

          <div style="margin: 4% 0">
            <div style="width: 80%; display: inline-block">
              <img v-if="news.attachments[0].attachment.type.type === 'Video'" :src="getYTvideoCode(news.attachments[0].attachment.url)" :alt="news.attachments[0].attachment.description"
              style="width: 70%; display: inline-block"
              :style="{'border-color': news.models[0].ruralModel.color, 'border-style': 'solid','border-width': '7px'}">
              <img v-else :src="getImgURL(news.attachments[0].attachment.url)" :alt="news.attachments[0].attachment.description"
              :style="{'border-color': news.models[0].ruralModel.color, 'border-style': 'solid','border-width': '7px'}">
            </div>
            <div style="width: 20%; display: inline-block;" align="left">
              <div>
                {{news.attachments[0].attachment.title}}
              </div>
              <div>
                {{news.attachments[0].attachment.description}}
              </div>
              <div>
                {{$t('news.detail.author')}}: {{news.attachments[0].attachment.author}}
              </div>
            </div>
          
          </div>

          <div style="margin: 0 0 4%">
            <div :key="index">
              <span>{{ news.news.date | moment("DD MMM YYYY - h:mm:ss a") }}</span><br>
              <span>Por: {{news.news.author}}</span>
              <div>
                <div v-for="(v,i) in news.institutions" :key="i">
                  {{v.institution.name}}<template v-if="i !== news.institutions.length -1">,</template>
                </div>
              </div>
            </div>
          </div>

          <div>
            <rich-text-preview :content="content" style="text-align: justify;"/>
            <div>
              <h2>{{$t('news.detail.related')}}</h2> 
            </div>
            <div>
              {{news.news.tags}}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Advice modal -->
    <b-modal ref="advice" :title="$t('news.print.title').toUpperCase()" centered hideFooter>
      <div>
        <b-row>

          <b-col cols="12">
            <b><label >{{$t('news.print.description')}} </label></b>
          </b-col>

        </b-row>

      </div>
      <div>
        <b-row>
          <b-col class="text-center">
            <sipsder-btn @onClick="print()" btnType="print" title="Entiendo">
            </sipsder-btn>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>
import VAPI from '../../../http_common';
import { SERVICE_NAMES, HTTP_STATUS } from '../../../sipsder_constants';
import RichTextPreview from "../../shared/RichTextPreview";
import S_UTIL from "../../../util/sipsder_util";

export default {
  component: {
    RichTextPreview,
  },
  props: {

    news: {
      type: Object,
      required: true,
      default: () => { return [] }

    }

  },
  data(){
    return  {
      //Variables propias de noticias, a ser usadas a convencia - Opcional
      related: null,
      title: '',
      description: '',
      content: '',
      //Variables obligatorias para la impresion - Obligatorio
      repeat: 1,
      watermark: '',
      options: {
        name: '_blank',
        specs: [
          'fullscreen=yes',
          'titlebar=no',
          'scrollbars=no',
          'menubar=no',
          'top=150'
        ],
        styles: [
          //Version de bootstrap usada, deberia ser un archivo traido del mismo servidor del sipsder
          'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'
        ]
      }
    }
  },
  async beforeMount(){
    //Agregar a conveniencia - Opcional
    this.title = this.news.news.headline
    this.description = this.news.news.description
    this.content = this.news.news.content
    
    //Solicitud para traer marca de agua - obligatoria
    try {
      const response = await VAPI.get( `${SERVICE_NAMES.TEMPLATE_IMAGE}/report` );
      this.watermark = response.data.data;
      
    }
    catch( error ) {
      alert( error );
    }


  },
  mounted(){
    // Obligatorio
    if( this.isGoogleChrome ){
      this.repeat = Math.ceil(this.$refs.infoCanvas.clientHeight / 1000 );
    }else{
      this.repeat = Math.ceil(this.$refs.infoCanvas.clientHeight / 900 );
    }
  },
  computed: {
      //Ambos computeds son obligatorios - Obligatorio
      pages() {
        return this.repeat;
      },
      isGoogleChrome() {
        return !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);;
      }
    },
  methods:{
      getImgURL (url) {
          return S_UTIL.getImgURL(url);
      },
      print_advice() {
        //Metodo obligatorio
        this.$refs.advice.show()
      },
      async print() {
        //Metodo obligatorio

        
        if( this.isGoogleChrome ){
          this.$refs.advice.hide();
        }
        
        // Coloque el id a imprimir
        this.printDocument('printSection', this.options);
      },
      addStyles(win, styles) {
        styles.forEach(style => {
          let link = win.document.createElement('link');
          link.setAttribute('rel', 'stylesheet');
          link.setAttribute('type', 'text/css');
          link.setAttribute('href', style);
          win.document.getElementsByTagName('head')[0].appendChild(link);
        });
      },
      printDocument(el, opts = options) {
        //Metodo obligatorio
        let {
          name,
          specs,
          replace,
          styles
        } = opts;
        specs = !!specs.length ? specs.join(',') : '';

        const element = document.getElementById(el);

        if(!element) {
          alert(`Element to print #${el} not found!`);
          return;
        }
        
        const url = '';
        const win = window.open(url, name, specs, replace);

        win.document.write(`
          <html>
            <head>
              <link rel="stylesheet" media="print" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
            </head>
            <body>
              ${element.innerHTML}
            </body>
            <style>
              @media print 
              {
                  @page {
                    size: letter;
                    margin: 25mm 10mm;
                  }
              }
              -webkit-print-color-adjust: exact;
            </style> 
          </html>
          


        `);

        this.addStyles(win, styles);
        
        setTimeout(() => {
          win.document.close();
          win.focus();
          win.print();
          win.close();
        }, 1000);          
        return true;
      },
      //Metodo especifico de noticias - Opcional
      getYTvideoCode(url){
        if(url.search("youtube")>0){
          var res = url.split("/")
          var rel = res[4].split("?")
          return "https://img.youtube.com/vi/"+rel[0]+"/hqdefault.jpg"
        }
        else{
          return this.getImgURL(url);
        }
      }
  }
}
</script>

<style lang="sass" scoped>

</style>

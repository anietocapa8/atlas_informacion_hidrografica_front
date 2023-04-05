<template>
  <div>
    <div class="row d-flex align-items-center">
      <div class="col-sm-12">
        <sipsder-btn
          btnType="print"
          class="w-100"
          @onClick="isGoogleChrome ? print_advice() : print()"
        />
      </div>
    </div>
    <div id="printSection" style="width: 100%; display: none;">
      <div
        class="print-background"
        style="position:absolute;
                 z-index:0;
                 background:white;
                 width: 100%;"
      >
        
      </div>
      <div
        ref="infoCanvas"
        class="printCanvas"
        
      >
        <!-- Este slot es el que se va a imprimir, su contenido debe ser definido en el llamado al componente -->
        <slot />
      </div>
    </div>

    <!-- Advice modal -->
    <b-modal ref="advice" :title="$t('print.title').toUpperCase()" centered hideFooter>
      <div>
        <b-row>
          <b-col cols="12">
            <b>
              <label>{{$t('print.description')}}</label>
            </b>
          </b-col>
        </b-row>
      </div>
      <div>
        <b-row>
          <b-col class="text-center">
            <sipsder-btn @onClick="print()" btnType="accept" title="Entiendo"></sipsder-btn>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>
import VAPI from "../../http_common";
import { SERVICE_NAMES, HTTP_STATUS } from "../../sipsder_constants";

export default {
  props: {
    cssText : {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      //Variables obligatorias para la impresion - Obligatorio
      repeat: 1,
      watermark: "",
      options: {
        name: "_blank",
        specs: [
          "fullscreen=yes",
          "titlebar=no",
          "scrollbars=no",
          "menubar=no",
          "top=150"
        ],
        styles: [
          //Version de bootstrap usada, deberia ser un archivo traido del mismo servidor del sipsder
          "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        ]
      }
    };
  },
  async beforeMount() {
    //Solicitud para traer marca de agua - obligatoria
    try {
      const response = await VAPI.get(
        `${SERVICE_NAMES.TEMPLATE_IMAGE}/report`
      );
      this.watermark = response.data.data;
    } catch (error) {
      console.log(error);
    }
  },
  mounted() {
    // Obligatorio
    if (this.isGoogleChrome) {
      this.repeat = Math.ceil(this.$refs.infoCanvas.clientHeight / 1000);
    } else {
      this.repeat = Math.ceil(this.$refs.infoCanvas.clientHeight / 900);
    }
  },
  computed: {
    //Ambos computeds son obligatorios - Obligatorio
    pages() {
      return this.repeat;
    },
    isGoogleChrome() {
      return (
        !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
      );
    }
  },
  methods: {
    print_advice() {
      //Metodo obligatorio
      this.$refs.advice.show();
    },
    async print() {
      //Metodo obligatorio

      if (this.isGoogleChrome) {
        this.$refs.advice.hide();
      }

      // Coloque el id a imprimir
      this.printDocument("printSection", this.options);
    },
    addStyles(win, styles) {
      styles.forEach(style => {
        let link = win.document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.setAttribute("href", style);
        win.document.getElementsByTagName("head")[0].appendChild(link);
      });
    },
    printDocument(el, opts = options) {
      //Metodo obligatorio
      let { name, specs, replace, styles } = opts;
      specs = !!specs.length ? specs.join(",") : "";
      const element = document.getElementById(el);
      if (!element) {
        console.log(`Error: Element to print #${el} not found!`);
        return;
      }

      let stylesHtml = '';
      for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
        stylesHtml += node.outerHTML;
      }

      const url = "";
      const win = window.open(url, name, specs, replace);

      win.document.write(`
          <html>
            <head>
              <link rel="stylesheet" media="print" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
              <style>
                .printCanvas {
                  position:absolute;
                  z-index:1;
                  width: 100%;
                  background-image: url("data:image/png;base64,${this.watermark}");
                }
                @media print 
                {
                  .print-background {
                    // content: url("data:image/png;base64,${this.watermark}");
                  }
                    @page {
                      size: letter;
                      background-image: url("data:image/png;base64,${this.watermark}");
                    }
                }
                -webkit-print-color-adjust: exact;
                
              </style>
              ${stylesHtml}
            </head>
            <body>
              ${element.innerHTML}
            </body> 
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
    getYTvideoCode(url) {
      if (url.search("youtube") > 0) {
        var res = url.split("/");
        var rel = res[4].split("?");
        return "https://img.youtube.com/vi/" + rel[0] + "/hqdefault.jpg";
      } else {
        return url;
      }
    }
  }
};
</script>

<style lang="sass" scoped>

</style>
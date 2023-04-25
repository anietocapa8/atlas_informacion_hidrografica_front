<template>
    <!-- <div > -->
        <b-btn variant="Light" @click="click" :type="type" class="sipsder-button" :disabled="disabled">
            <b-img :class="[cssImg]" :src="currentIcon"> </b-img>
            <b-badge :class="[cssButton]" :variant="variant" v-if="text != ''"> 
                {{currentText}} 
            </b-badge>
        </b-btn>
    <!-- </div> -->
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            default: undefined,
        },
        btnType: {
            type: String,
            default: ""
        },
        cssImg : {
            type: String,
            default: ""
        },
        cssButton : {
            type: String,
            default: ""
        },
        variant : {
            type: String,
            default: "secondary"
        },
        icon : {
            type: String,
            default: ""
        },
        type: {
            type: String,
            default: "button", // available types: button, submit or reset
        },
        emptyText: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        }
    },
    data: function() {
        return {
            urlIcon: {
                "" : "",
                uploadImage : require("@/assets/icons-button-svg/subir_imagen_fondo.svg"),
                clean : require("@/assets/icons-button-svg/limpiar_fondo.svg"),
                delete : require("@/assets/icons-button-svg/eliminar_fondo.svg"),
                newSearch: require("@/assets/icons-button-svg/nueva_busqueda.svg"),
                login : require("@/assets/icons-button-svg/acceder_key.svg"),
                link : require("@/assets/icons-button-svg/link_fondo.svg"),
                ubication : require("@/assets/icons-button-svg/ubicar_fondo.svg"),
                export: require("@/assets/icons-button-svg/subir_fondo.svg"),
                download: require("@/assets/icons-button-svg/descargar_fondo.svg"),
                add: require("@/assets/icons-button-svg/agregar_fondo.svg"),
                send: require("@/assets/icons-button-svg/enviar_fondo.svg"),
                edit_pen: require("@/assets/icons-button-svg/editar_fondo.svg"),
                edit: require("@/assets/icons-button-svg/editar_llave_fondo.svg"),
                imageMedia: require("@/assets/icons-button-svg/imagen_media_fondo.svg"),
                preview: require("@/assets/icons-button-svg/previsualizar_fondo.svg"),
                message: require("@/assets/icons-button-svg/dialogo_fondo.svg"),
                search: require("@/assets/icons-button-svg/buscar_fondo.svg"),
                cancel: require("@/assets/icons-button-svg/cancelar_fondo.svg"),
                accept: require("@/assets/icons-button-svg/aceptar_fondo.svg"),
                back: require("@/assets/icons-button-svg/regresar_fondo.svg"),
                export_data: require("@/assets/icons-button-svg/exp_datos.svg"),
                save: require("@/assets/icons-button-svg/guardar.svg"),
                admin_ins: require("@/assets/icons-button-svg/admin_instituciones.svg"),
                generate_process: require("@/assets/icons-button-svg/generar_proceso.svg"),
                closeContent: require("@/assets/icons-button-svg/cerrar_contenido.svg"),
                load_more: require("@/assets/icons-button-svg/generar_proceso.svg"),
                partial_save: require("@/assets/icons-button-svg/guardar_parcialmente.svg"),
                next: require("@/assets/icons-button-svg/siguiente.svg"),
                previous: require("@/assets/icons-button-svg/atras.svg"),
                print: require("@/assets/icons-button-svg/imprimir@240x.png"),
            },
            messages: {
                "" : "",
                uploadImage : this.$t('button.uploadImage'),
                clean : this.$t('button.clean'),
                delete : this.$t('button.delete'),
                newSearch: this.$t('button.newSearch'),
                login : this.$t('button.login'),
                link: this.$t('button.link'),
                ubication : this.$t('button.ubication'),
                export: this.$t('button.export'),
                download: this.$t('button.download'),
                add: this.$t('button.add'),
                send: this.$t('button.send'),
                edit_pen: this.$t('button.edit_pen'),
                edit: this.$t('button.edit'),
                imageMedia: this.$t('button.imageMedia'),
                preview: this.$t('button.preview'),
                message: this.$t('button.message'),
                search: this.$t('button.search'),
                cancel: this.$t('button.cancel'),
                accept: this.$t('button.accept'),
                back: this.$t('button.back'),
                export_data: this.$t('button.export'),
                save: this.$t('button.save'),
                admin_ins: this.$t('button.admin_ins'),
                generate_process: this.$t('button.generate_process'),
                closeContent: this.$t('button.closeContent'),
                load_more: this.$t('button.load_more'),
                partial_save: this.$t('button.partial_save'),
                next: this.$t('button.next'),
                previous: this.$t('button.previous'),
                print: this.$t('button.print'),
            },
            containText : true,
        };
    },
    methods: {
        click(){
            this.$emit('onClick');
        }
    },
    computed : {
        currentIcon() {
            if (this.icon != "") {
                return this.icon;
            } 
            return this.urlIcon[this.btnType];
        },
        currentText() {
            if (this.text !== undefined) {
                return this.text;
            } else {
                return this.messages[this.btnType];
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.sipsder-button {

    font-family: "PT Sans Narrow";
}
    button.sipsder-button {
        background: none;
        padding: 0px;
        border-width: 0px;
        span {
            opacity: 0.7;
            z-index: 1;
            margin-left: -2rem;
            font-size: 1.5rem;
            font-weight: 200;
            padding-left: 15px;
            padding-right: 15px;
        };

        img {
            z-index: 2;
            margin-left: -1rem;
            height: 6rem;
            position: relative;
        };

        &:hover {
            span {
                opacity: 0.85;
            };
        };

        &:focus {
            background: none;
            padding: 0px;
            border-width: 0px;
            box-shadow: none;
            span {
                opacity: 1;
            };
        };

        &:active {
            background: none;
            padding: 0px;
            border-width: 0px;
        }
    };

    // span {
    //     z-index: 1;
    //     margin-left: -2rem;
    //     font-size: 1.5rem;
    //     font-weight: 200;
    //     padding-left: 15px;
    //     padding-right: 15px;
    // };
// }
@media screen and (max-width: 425px) {
    button.sipsder-button {
        span {
            font-size: 1rem !important; 
        }
        img {
            height: 4rem !important;
        };
    }
}
@media screen and (max-width: 800px) and (min-width: 426px){
    button.sipsder-button {
        span {
            font-size: 1.2rem !important;
        }
        img {
            height: 5rem !important;
        };
    }
}
</style>


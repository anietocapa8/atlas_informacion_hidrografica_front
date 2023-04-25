<template>
    <div class="title-page">
        <b-row>
            <b-col cols="12" sm="11">
                <b-row class="title-header">
                    <b-col cols="12" class="header-center">
                        <!-- <img src='@/assets/title/configuracion.png' alt="icon header"> -->
                        <img :src='currentIcon' alt="icon-section">
                        <slot name="title">
                            <div class="title-inner-text" :class="{'title-inner-md': longText}">
                                {{currentTitle}}
                            </div>
                            <div class="title-inner-img">
                                <img src='@/assets/title/title-icons.png' alt="icon header">
                            </div>
                        </slot>
                    </b-col>
                </b-row>
                
                
                <b-row class="title-content">
                    <b-col cols="12">
                        <slot name="content">
                            {{text}}
                        </slot>
                    </b-col>
                </b-row>
            </b-col>
            <b-col cols="1" class="header-rigth">
                <img :src="diamondImage" alt="rombo-section">
            </b-col>
        </b-row>

    </div>

</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ""
        },
        text : {
            type: String,
            default : ""
        },
        section : { // puede ser registry o configuration
            type: String,
            default: "configuration",
        },
        type : { // puede ser user o admin
            type: String,
            default: "user",
        }
    },
    data() {
        return {
            urlIcon: {
                admin : require('@/assets/title/icono_seccion_configuracion.png'),
                configuration: require('@/assets/title/icono_seccion_configuracion.png'),
                registry: require('@/assets/title/icono_seccion_registro.png'),
                sitemap: require('@/assets/title/icono_mapa_sitio.png')
            },
            titleIcon: {
                admin : require('@/assets/title/cabezote_adm.png'),
                user : require('@/assets/title/cabezote_usuario.png'),
            },
            messageTitle : {
                admin: this.$t('title.admin'),
                configuration: this.$t('title.configuration'),
                registry: this.$t('title.register'),
            },
            possibleTypes : {
                admin : "admin",
                user : "user"
            }
        }
    },
    computed: {
        currentIcon() {
            if (this.urlIcon.hasOwnProperty(this.section)) {
                return this.urlIcon[this.section];
            }
            return this.urlIcon.configuration;
        },
        currentTitle() {
            if (this.title != null && this.title != "") {
                return this.title;
            }
            if (this.messageTitle.hasOwnProperty(this.section)) {
                return this.messageTitle[this.section];
            }
            return this.messageTitle.configuration;
        },
        diamondImage() {
            if (this.type == this.possibleTypes.admin) {
                return this.titleIcon.admin;
            }
            return this.titleIcon.user;
        },
        longText() {
            return this.title.length >  27;
        }
    }
}
</script>


<style lang="scss" scoped>
@import '@/stylesheets/helpers/_variables.sass';
// $small = 576px;

.title-page {
    min-height: 8rem;
    margin-top: 1rem;
    margin-bottom: 3rem;
}

.title-content {
    font-size: 1.5rem;
    padding-left: 2rem;
}

.title-header {
    min-height: 2rem;
}

.title-inner-md {
    font-size: 1.6rem;
}

.header-center {
    padding-left: 0px;
    color: white;
    font-size: 2rem;
    font-weight: 600;
    font-style: italic;
    display: flex;
    align-items: center;
    text-align: justify;
    
    img {
        height: 5rem;
        // margin-right: 10px;
        z-index: 1;
    }

    @media screen and (max-width: $small-sz) {
        // img {
        //     height: 8rem;
        //     margin-right: 10px;
        //     z-index: 1;
        // }
        font-size: 1.5rem;
    }

    .title-inner-img {
        background: $colorTitle;
        float: right;
        max-height: 4rem;
        min-height: 4rem;
        margin-right: -35px;
        display: flex;
        align-items: center;
        @media screen and (max-width: $large-sz) {
            display: none;
        }
    }
}
.title-inner-text {
    background-color: $colorTitle;
    display: flex;
    align-items: center;
    width: 100%;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 3rem;
    margin-left: -20px;
    margin-right: -3rem;
    min-height: 4rem;
    overflow-x: hidden;
    word-wrap: break-word;

    // border-bottom-right-radius: 20%;
    // border-top-right-radius: 20%;
    // margin-right: -40px;
}
.header-rigth {
    padding-left: 0px;
    padding-right: 0px;
    z-index: 2;
    img {
        height: 10rem;
        margin-left:  -10px;
        margin-top: 6px;
    }

    @media screen and (max-width: $medium-sz) {
        overflow-x: hidden;
    }

    @media screen and (max-width: $small-sz) {
        display: none;
    }
}
</style>


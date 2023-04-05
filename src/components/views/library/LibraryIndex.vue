<template>
    <div class="library-index">
      <div :class="{'feed-title':isCommunityPage , 'feed-title2':!isCommunityPage}">{{title}}</div>
        <div class="container-form col-90">
          <div v-if="isCommunityPage">
            <b-row>
              <b-col>
                <s-note-rich-text
                  :showEdition="isAdminHome" :module="modules.RURAL_LIBRARY" 
                  keyVal="welcome" :textPenEdition="$t('note.editText')"
                ></s-note-rich-text>
              </b-col>
            </b-row>
          </div>
          <document-list :ruralModel="ruralModelId"></document-list>
        </div>
        <div style="text-align:center"><sipsder-btn btnType="back" @onClick="$router.go(-1)"></sipsder-btn></div>

        <b-modal ref="notLogged" :title="$t( 'library.modal.alert' )" hideFooter size="xl"
            :noCloseOnEsc="true" :noCloseOnBackdrop="true" :hideHeaderClose="true">      
            <b-row align-v="center" align-h="center">
                <b-col cols="12">
                  <p>{{$t('library.modal.textWelcome')}}</p>
                  <p>{{$t('library.modal.textContent')}}</p>
                  <p>{{$t('library.modal.textAlert')}}</p>
                </b-col>
            </b-row>
            <b-row>
                
                <b-col class="d-flex justify-content-center">
                    <sipsder-btn btnType="accept" 
                        :text="$t( 'library.modal.btnClose' )" 
                        @onClick="hideModal('notLogged')">
                    </sipsder-btn>

                    <sipsder-btn btnType="login" 
                        v-b-modal.login
                        :text="$t( 'library.modal.btnAction' )" 
                        @onClick="showLogin( )">
                    </sipsder-btn>
                </b-col>
            </b-row>
        </b-modal>
        
    </div>
</template>

<script>
import DocumentList from '../../shared/DocumentList.vue';
import NoteRichText from '@/components/shared/editableMessages/NoteRichText.vue'
import { PERMISSIONS_TYPES, MODULES} from '../../../domain_constants'

export default {
   components:{
    "document-list": DocumentList,
    "s-note-rich-text": NoteRichText,
  },
  data(){
     return{
          ruralModelId: null,
          editionMode: false,
          currentText: "",
          customToolbar: [
            [ { 'font': [ ] } ],
            [ { 'size': [ 'small', false, 'large', 'huge' ] } ],
            [ "bold", "italic", "underline" ],
            [ { list: "ordered" }, { list: "bullet" } ],
            [ 'link', 'image', 'video', 'formula' ],
            [ {'align': ''}, {'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' } ],
            [ { 'color': [ ] }, { 'background': [ ] } ],
            [ { 'script': 'sub' }, { 'script': 'super' } ],
            [ { 'header': [ false, 1, 2, 3, 4, 5, 6, ] } ]
          ]
      }
  },
   watch:{
    
  },
  computed: {
    title(){
      let title = this.$t( 'library.title' );
      if(this.isCommunityPage) {
        title = this.$t( 'library.titleCommunity' );
      }
      return title;
    },
    isCommunityPage() {
      return (this.$route.meta.community);
    },
    isLogged() {
      return this.$store.getters.isAuthenticated;
    },
    isAdministrator( ) {
        let isAdmin = false;
        if (this.isLogged)
            if(	this.$store.getters.hasPermission( PERMISSIONS_TYPES.ADMIN )) 
                isAdmin = true     
        return isAdmin;
    },
    isAdminHome() {
      return this.isLogged && this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
    },
    modules() {
      return MODULES;
    }
  },
  beforeMount() {
    if(this.$route.params.ruralModelId != null && this.$route.params.ruralModelId != undefined )
      this.ruralModelId = this.$route.query.ruralModelId
  },
  async mounted() {
    if(!this.isLogged && this.isCommunityPage) {
      this.showModal('notLogged');
    }
  },
  methods:{
    setAnswer( value ) {
      this.currentText = value;
    },
    changeMode() {
      this.editionMode = !this.editionMode;
    },
    hideModal(modal) {
        this.$refs[modal].hide();
    },
    showModal(modal) {
        this.$refs[modal].show();
    },
    showLogin() {
      this.hideModal('notLogged');
    }
  }
}
</script>


<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'
.feed-title
  position: relative
  display: inline-block
  color: #fff
  background: url(../../../assets/title/barra_sola_3.png)
  background-repeat: no-repeat
  background-size: 100% 100%
  width: 105%
  font-size: 40px
  font-weight: bold
  font-family: $fontBody
  margin-left: -10%
  margin-top: 15px
  margin-bottom: 3%
  padding-left: calc(10% + 20px)
  padding-top: 20px
  a
      text-decoration: none
      color: #fff
.feed-title2
  position: relative
  display: inline-block
  color: #fff
  background: url(../../../assets/title/barra_sola_7.png)
  background-repeat: no-repeat
  background-size: 100% 100%
  width: 105%
  font-size: 40px
  font-weight: bold
  font-family: $fontBody
  margin-left: -10%
  margin-top: 15px
  margin-bottom: 3%
  padding-left: calc(10% + 20px)
  padding-top: 20px
  a
      text-decoration: none
      color: #fff
.library-index
  width: 100%
.col-90
    width: 90%
    margin-left: auto
    margin-right: auto
@media screen  and (max-width: $widthTablet)
  .col-90
    width: 80% !important
@media screen  and (max-width: $widthMobile)
  .col-90
    width: 80% !important
  .feed-title
    padding-left: calc(10% + 40px) !important
    font-size: 20px !important
  .feed-title2
    padding-left: calc(10% + 40px) !important
    font-size: 20px !important
</style>
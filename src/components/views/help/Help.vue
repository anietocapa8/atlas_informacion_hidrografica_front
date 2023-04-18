<template>
  <div v-if="help && helpModel" class="container container-form">
    <sipsder-title
      :title="$t('help.main.title').toUpperCase()"
      :type="isAdmin ? 'admin' : ''"
      section="configuration"
    >
      <div slot="content">
        <div class="right-btn-container" v-if="isAdmin">
          <sipsder-btn v-show="editMode" class="button-group" btnType="accept" :text="$t('button.save')" @onClick="save"/>
          <sipsder-btn v-show="editMode" class="button-group" btnType="cancel" @onClick="cancel"/>
          <sipsder-btn
            v-show="!editMode"
            :text="$t('help.main.edit_btn')"
            btnType="edit_pen"
            @onClick="editMode = !editMode"
          />
        </div>
        <div v-show="!editMode">{{ help.description }}</div>
        <div v-show="editMode">
          <b-form-textarea
            type="text"
            v-validate="'required'"
            name="description"
            :placeholder="$t('help.main.description')"
            :data-vv-as="$t('help.main.description')"
            v-model="helpModel.description"
            rows="3"
            max-rows="5"
            no-resize
          />
          <b-alert
            variant="danger"
            :show="errors.has('description')"
          >{{ errors.first("description") }}</b-alert>
        </div>
      </div>
    </sipsder-title>
    
    <b-form @submit.prevent="save">
      <b-container>
        <b-row>
          <b-col cols="12" md="6" class="container-row-bordered">
            <b-col>
              <icon-text-widget
                class="h3"
                :data="$t('help.main.user_manual')"
                field="value"
                icon="fa fa-book"
              />
            </b-col>
            <b-col v-if="manuals.length">
              <div v-for="manual of manuals" :key="manual.id">
                <div
                  class="link"
                  v-bind:class="{ 'disabled-manual': !manual.enabled }"
                  @click="toDetail(manual)"
                >{{ manual.title }}</div>
              </div>
            </b-col>
            <b-col v-else>{{ $t('help.main.no_manuals') }}</b-col>
            <div class="text-center">
              <sipsder-btn
                v-if="isAdmin"
                v-show="editMode"
                :text="$t('help.main.manual_admin')"
                btnType="edit_pen"
                @onClick="goTo('HelpAdmin')"
              />
            </div>
          </b-col>
          <b-col cols="12" md="6" class="container-row-bordered">
            <b-col @click="goTo('FrequentlyAskedQuestionsIndex')">
              <icon-text-widget
                class="h3 clickable"
                :data="[$t('help.main.faqs')]"
                field="value"
                icon="fa fa-question"
              />
            </b-col>
            <b-col v-show="!editMode">{{ help.question }}</b-col>
            <b-col v-show="editMode">
              <b-form-textarea
                type="text"
                v-validate="'required'"
                name="question"
                :placeholder="$t('help.main.question')"
                :data-vv-as="$t('help.main.question')"
                v-model="helpModel.question"
                rows="3"
                max-rows="5"
                no-resize
              />
              <b-alert
                variant="danger"
                :show="errors.has('question')"
              >{{ errors.first("question") }}</b-alert>
            </b-col>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12" md="6" class="container-row-bordered">
            <b-col @click="goTo('ProcedureIndex')">
              <icon-text-widget
                class="h3 clickable"
                :data="[$t('help.main.procedures')]"
                field="value"
                icon="fa fa-user"
              />
            </b-col>
            <b-col v-show="!editMode">{{ help.procedure }}</b-col>
            <b-col v-show="editMode">
              <b-form-textarea
                type="text"
                v-validate="'required'"
                name="procedure"
                :placeholder="$t('help.main.procedure')"
                :data-vv-as="$t('help.main.procedure')"
                v-model="helpModel.procedure"
                rows="3"
                max-rows="5"
                no-resize
              />
              <b-alert
                variant="danger"
                :show="errors.has('procedure')"
              >{{ errors.first("procedure") }}</b-alert>
            </b-col>
          </b-col>
          <b-col cols="12" md="6" class="container-row-bordered">
            <b-col @click="goTo('ContactIndex')">
              <icon-text-widget
                class="h3 clickable"
                :data="[$t('help.main.contact_us')]"
                field="value"
                icon="far fa-envelope"
              />
            </b-col>
            <b-col v-show="!editMode">{{ help.contact }}</b-col>
            <b-col v-show="editMode">
              <b-form-textarea
                type="text"
                v-validate="'required'"
                name="contact"
                :placeholder="$t('help.main.contact')"
                :data-vv-as="$t('help.main.contact')"
                v-model="helpModel.contact"
                rows="3"
                max-rows="5"
                no-resize
              />
              <b-alert variant="danger" :show="errors.has('contact')">{{ errors.first("contact") }}</b-alert>
            </b-col>
          </b-col>
        </b-row>
      </b-container>
      <div class="text-center">
        <sipsder-btn class="button-group" btnType="back" @onClick="$router.go(-1)"/>
      </div>
    </b-form>
  </div>
</template>

<script>
import IconTextWidget from "@/components/shared/IconTextWidget";
import { PERMISSIONS_TYPES } from "@/domain_constants";
import { SERVICE_NAMES, HTTP_STATUS } from "@/sipsder_constants";
import VAPI from "@/http_common";

export default {
  name: "Help",
  components: {
    IconTextWidget
  },
  data() {
    return {
      editMode: false,
      helpModel: undefined
    };
  },
  watch: {
    help() {
      this.setHelpModel();
    },
  },
  computed: {
    isAdmin() {
      return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
    },
    isControl() {
      return this.$store.getters.hasPermission(PERMISSIONS_TYPES.CONTROL);
    },
    isParticipate() {
      return this.$store.getters.hasPermission(PERMISSIONS_TYPES.PARTICIPATE);
    },
    isLogged() {
      return this.$store.getters.isAuthenticated;
    },
    help() {
      return this.$store.getters.getHelp;
    },
    manuals() {
      let manuals = [];
      if(this.isAdmin){
        manuals = this.help.helpDocuments;
      } else if(this.isControl) {
          manuals = this.help.helpDocuments.filter(
            hd => hd.enabled && hd.title.includes("inst")
          );
      } else {
          manuals = this.help.helpDocuments.filter(
            hd => hd.enabled && hd.title.includes("ciudadano")
          );
      }
      return manuals;
    }
  },
  beforeCreate() {
    this.$store.dispatch("getHelp");
  },
  methods: {
    goTo(componentName, params) {
      this.$router.push({ name: componentName, params });
    },
    setHelpModel() {
      if (this.help) {
        this.helpModel = {
          description: this.help.description,
          question: this.help.question,
          procedure: this.help.procedure,
          contact: this.help.contact
        };
      } else {
        this.helpModel = undefined;
      }
    },
    toDetail(manual) {
      const params = {
        id: manual.cryptedId,
        title: manual.title.split(' ').join('-')
      };
      this.goTo("HelpDetail", params);
    },
    save() {
      this.$validator.validateAll().then(result => {
        if (result) {
          VAPI.put(`/${SERVICE_NAMES.HELP}`, this.helpModel)
            .then(response => {
              if (response && response.status === HTTP_STATUS.OK) {
                this.$store.dispatch("setHelp", response.data);
                this.editMode = false;
              } else {
                throw new Error("Response error");
              }
            })
            .catch(e => {
              console.error("An error occurred saving Help " + e.toString());
            });
        }
      });
    },
    cancel() {
      this.setHelpModel();
      this.editMode = false;
    }
  }
};
</script>

<style lang="sass" scoped>
.clickable:hover
  font-size: 1.75rem;
  font-weight: 600;
  text-decoration: underline;

.right-btn-container
  text-align: right
  margin-bottom: 20px

.container-row-bordered
  padding-top: 15px
  padding-bottom: 15px

.form-control
  font-size: 1.5rem
  border-color: lightgray

@mixin bottomBordered()
  content: ""
  display: block
  position: absolute
  background: #e0e0e0
  width: calc(100% - 60px)
  height: 1px
  top: 100%
  right: 30px

.row:not(:last-child) .container-row-bordered:before
  @include bottomBordered

@media (max-width: 767px) 
  .row:last-child .container-row-bordered.col-12:not(:last-child):before
    @include bottomBordered

@media (min-width: 768px) 
  .container-row-bordered:not(:last-child):after
    content: ""
    display: block
    position: absolute
    background: #e0e0e0
    width: 1px
    height: calc(100% - 60px)
    top: 30px
    right: 0
    min-height: 100px

.link
  color: #007bff
  user-select: none;
  
.link:hover
  color: #0056b3
  text-decoration: underline

.disabled-manual
  color: #ff007b
  
.disabled-manual:hover
  color: #b30056

.widget-div
  margin: 1rem 0
  > :not(span)
    padding: 0.5rem
</style>
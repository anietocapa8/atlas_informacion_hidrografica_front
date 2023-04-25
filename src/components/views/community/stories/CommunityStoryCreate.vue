<template>
  <div>
    <div class="feed-title">{{ $t( 'rurality_stories.create.title') }}</div>
    <b-container class="container container-form">
      <p v-if="!isAdmin" class="info">{{ $t('rurality_stories.create.advise') }}</p>
      <br />
      <b-form @submit.prevent="validateStory" v-if="loadedDomains">
        <b-row v-if="isAdmin">
          <b-col class="row-margin">
            <b-form-group :label="$t('rurality_stories.create.created_by')">
              <b-form-input readonly class="text-uppercase" v-model="story.userName" />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="6" v-if="isAdmin">
            <b-form-group
              class="form-group required"
              label-class="font-weight-bold"
              :label="$t('rurality_stories.create.state')"
            >
              <b-form-select
                v-model="story.state"
                :options="opts.states"
                :disabled="alreadyPublished || creating"
                name="state"
                :data-vv-as="$t('rurality_stories.create.state')"
                v-validate="'required'"
              />
              <b-alert variant="danger" :show="errors.has('state')">{{ errors.first("state") }}</b-alert>
            </b-form-group>
          </b-col>
          <b-col class="valign flex-right-align">
            <div>
              <b-form-checkbox
                v-model="story.enabled"
                :disabled="story.state === STORY_STATES.REJECTED"
              />
              <span>{{ $t('rurality_stories.create.enabled') }}</span>
            </div>
          </b-col>
        </b-row>
        <b-form-group
          class="form-group required"
          label-class="font-weight-bold"
          :label="$t('rurality_stories.create.reason')"
          v-show="!story.enabled"
        >
          <b-form-input
            name="reason"
            type="text"
            :data-vv-as="$t('rurality_stories.create.reason')"
            v-validate="'required|max:800'"
            v-model="story.reason"
            :disabled="story.enabled"
          />
          <b-alert variant="danger" :show="errors.has('reason')">{{ errors.first("reason") }}</b-alert>
        </b-form-group>
        <b-row>
          <b-col>
            <b-form-group class="form-group required" :label="$t('rurality_stories.create.name')">
              <b-form-input
                name="name"
                type="text"
                :data-vv-as="$t('rurality_stories.create.name')"
                v-validate="'required|max:100'"
                v-model="story.name"
              />
              <b-alert variant="danger" :show="errors.has('name')">{{ errors.first("name") }}</b-alert>
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group
          class="form-group required"
          :label="$t('rurality_stories.create.summary_lbl')"
        >
          <b-form-textarea
            type="text"
            name="summary"
            v-validate="'required|max:280'"
            :data-vv-as="$t('rurality_stories.create.summary')"
            v-model="story.summary"
            rows="3"
            max-rows="5"
            no-resize
          />
          <b-alert variant="danger" :show="errors.has('summary')">{{ errors.first("summary") }}</b-alert>
        </b-form-group>
        <b-form-group
          class="form-group required"
          label-class="font-weight-bold"
          :label="$t('rurality_stories.create.category')"
        >
          <s-table-select
            v-model="story.categories"
            name="categories"
            :data-vv-as="$t('rurality_stories.create.category')"
            v-validate="'required'"
            label-select="name"
            :options="opts.categories"
            :table-fields="tableFields.category"
          />
          <b-alert
            class="mt-3"
            variant="danger"
            :show="errors.has('categories')"
          >{{ errors.first("categories") }}</b-alert>
        </b-form-group>
        <b-form-group class="form-group required" :label="$t('rurality_stories.create.locality')">
          <s-table-select
            v-model="story.localities"
            name="localities"
            :data-vv-as="$t('rurality_stories.create.locality')"
            v-validate="'required'"
            label-select="name"
            :options="opts.localities"
            :table-fields="tableFields.locality"
          />
          <b-alert
            class="mt-3"
            variant="danger"
            :show="errors.has('localities')"
          >{{ errors.first("localities") }}</b-alert>
        </b-form-group>
        <b-form-group
          class="form-group required"
          :label="$t('rurality_stories.create.description')"
        >
          <rich-text
            v-model="story.description"
            name="description"
            :data-vv-as="$t('rurality_stories.create.description')"
            v-validate="'required'"
          />
          <b-alert
            variant="danger"
            :show="errors.has('description')"
          >{{ errors.first("description") }}</b-alert>
        </b-form-group>
        <b-form-group
          :label="$t('rurality_stories.create.rural_housing')"
          label-cols="10"
          horizontal
          class="required"
        >
          <b-form-radio-group
            class="text-right"
            v-model="story.ruralHousing"
            :disabled="isHousing"
            name="ruralHousing"
            v-validate="'required'"
            :data-vv-as="$t('rurality_stories.create.housing')"
          >
            <b-form-radio :value="true">{{$t('util.yes')}}</b-form-radio>
            <b-form-radio :value="false">{{$t('util.no')}}</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
        <b-alert
          variant="danger"
          :show="errors.has('ruralHousing')"
        >{{ errors.first("ruralHousing") }}</b-alert>
        <b-form-group
          :label="$t('rurality_stories.create.project_radio_lbl')"
          label-cols="10"
          horizontal
          class="required"
        >
          <b-form-radio-group
            class="text-right"
            :label="$t('rurality_stories.create.project_radio_lbl')"
            v-model="projectLink"
            name="projectLink"
            v-validate="'required'"
            :data-vv-as="$t('rurality_stories.create.project_link')"
          >
            <b-form-radio :value="true">{{$t('util.yes')}}</b-form-radio>
            <b-form-radio :value="false">{{$t('util.no')}}</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
        <b-alert
          variant="danger"
          :show="errors.has('projectLink')"
        >{{ errors.first("projectLink") }}</b-alert>
        <b-form-group
          v-show="projectLink"
          class="required"
          :label="$t('rurality_stories.create.project_opt_lbl')"
        >
          <b-table
            responsive
            striped
            hover
            class="w-50 mx-auto"
            :fields="tableFields.project"
            :items="opts.projects"
            tbody-tr-class="table-height"
          >
            <template slot="select" slot-scope="row">
              <div class="text-center">
                <b-checkbox
                  class="position-static"
                  v-model="story.project"
                  :value="row.item"
                  v-validate="{ required: projectLink }"
                  name="project"
                  :data-vv-as="$t('rurality_stories.create.project')"
                />
              </div>
            </template>
          </b-table>
          <b-alert
            class="mt-3"
            variant="danger"
            :show="errors.has('project')"
          >{{ errors.first("project") }}</b-alert>
        </b-form-group>
        <b-form-group class="required" :label="$t('rurality_stories.create.rural_model')">
          <s-table-select
            v-model="story.ruralModels"
            name="ruralModels"
            :data-vv-as="$t('rurality_stories.create.rural_model')"
            v-validate="'required'"
            status-col="main"
            :options="opts.ruralModels"
            :table-fields="tableFields.ruralModel"
            treeselect
            clearable
            disable-branch
          />
          <b-alert
            class="mt-3"
            variant="danger"
            :show="errors.has('ruralModels')"
          >{{ errors.first("ruralModels") }}</b-alert>
        </b-form-group>
        <b-form-group class="form-group required" :label="$t('rurality_stories.create.tags')">
          <tags-input
            class="w-100"
            name="tags"
            v-model="tag"
            :data-vv-as="$t('rurality_stories.create.tags')"
            :placeholder="$t('util.tags_hint')"
            :tags="story.tags"
            @tags-changed="tags => story.tags = tags"
          />
          <b-alert variant="danger" :show="errors.has('tags')">{{ errors.first("tags") }}</b-alert>
        </b-form-group>
      </b-form>
      <hr />
      <b-row>
        <b-col>
          <p class="h3 font-weight-bold">{{ $t('rurality_stories.create.preview') }}</p>
          <p>{{ $t('rurality_stories.create.preview_description') }}</p>
        </b-col>
      </b-row>
      <admin-carousel
        :attachments="story.attachments"
        :upload-button-text="$t('rurality_stories.create.upload_btn')"
      />

      <div class="centered btn-group">
        <sipsder-btn class="button-group" btn-type="back" @onClick="shownModal = 'discard'" />
        <sipsder-btn
          class="button-group"
          btn-type="save"
          @onClick="validateStory"
          :text="!isAdmin ? $t('rurality_stories.create.save_request_btn') : undefined"
        />
      </div>
    </b-container>

    <modal
      :modals="modals"
      :active-modal-name="shownModal"
      i18n="rurality_stories.create"
      @closed="shownModal = undefined"
    />

    <b-modal
      v-if="!isAdmin"
      :title="creating
        ? $t('rurality_stories.create.add_title_mdl')
        : $t('rurality_stories.create.edit_title_mdl')"
      hide-header-close
      no-close-on-esc
      no-close-on-backdrop
      hide-footer
      v-model="saving"
    >
      <b-row class="mb-3">
        <b-col class="text-justify mx-3">
          <span v-if="creating" v-html="$t('rurality_stories.create.add_content_mdl')" />
          <span v-else v-html="$t('rurality_stories.create.edit_content_mdl')" />
        </b-col>
      </b-row>
      <b-row>
        <b-col class="text-justify mx-3">
          <b-form-group
            class="form-group required"
            :label="creating
            ? $t('rurality_stories.create.add_lbl_mdl')
            : $t('rurality_stories.create.edit_lbl_mdl')"
          >
            <b-form-textarea
              v-if="saving"
              type="text"
              name="saveText"
              v-validate="'required'"
              :data-vv-as="creating
              ? $t('rurality_stories.create.add_lbl_mdl')
              : $t('rurality_stories.create.edit_lbl_mdl')"
              v-model="story.saveText"
              rows="3"
              max-rows="3"
              no-resize
            />
            <b-alert variant="danger" :show="errors.has('saveText')">{{ errors.first("saveText") }}</b-alert>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="btn-group">
          <sipsder-btn btn-type="accept" @onClick="validateModal" />
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import {
  SERVICE_NAMES,
  HTTP_STATUS
} from "../../../../sipsder_constants";
import TableSelect from "@/components/shared/TableSelect";
import {
  ATTACHMENT_TYPE,
  GEOGRAPHY_TYPE,
  STORY_STATES,
  PERMISSIONS_TYPES,
  RURALMODEL
} from "../../../../domain_constants";
import VAPI from "../../../../http_common";
import AdminCarousel from "../../../shared/AdminCarousel";
import Modal from "../../../shared/Modal";
import RichText from "../../../shared/RichText";

export default {
  components: { AdminCarousel, Modal, RichText, "s-table-select": TableSelect },
  data() {
    return {
      STORY_STATES,
      tag: "",
      projectLink: undefined,
      isHousing: false,
      story: {
        enabled: true,
        name: "",
        summary: "",
        description: "",
        categories: [],
        localities: [],
        ruralModels: [],
        attachments: [],
        tags: [],
        project: undefined,
        ruralHousing: undefined
      },
      alreadyPublished: false,
      loadedDomains: false,
      saving: false,
      ruralModels: {},
      ruralHousingModels: undefined,
      tableFields: {
        category: [
          {
            key: "name",
            label: this.$t("rurality_stories.create.categories_header")
          },
          {
            key: "actions",
            label: ""
          }
        ],
        locality: [
          {
            key: "name",
            label: this.$t("rurality_stories.create.locality")
          },
          {
            key: "actions",
            label: ""
          }
        ],
        project: [
          {
            key: "name",
            label: this.$t("rurality_stories.create.project"),
            sortable: true
          },
          {
            key: "select",
            label: this.$t("rurality_stories.create.select_header")
          }
        ],
        ruralModel: [
          {
            key: "theme",
            label: this.$t("rurality_stories.create.structure_header"),
            sortable: true
          },
          {
            key: "component",
            label: this.$t("rurality_stories.create.component_header"),
            sortable: true
          },
          {
            key: "subComponent",
            label: this.$t("rurality_stories.create.subcomponent_header"),
            sortable: true
          },
          {
            key: "main",
            label: this.$t("rurality_stories.create.main")
          },
          {
            key: "actions",
            label: ""
          }
        ]
      },
      opts: {
        categories: [],
        localities: [],
        ruralModels: [],
        states: [],
        projects: []
      },
      /*            MODAL VALUES            */
      shownModal: undefined,
      modals: {
        success: {
          nonClosable: true,
          cancelable: false,
          onAccept: () =>
            this.$router.push({
              name: "CommunityStoryDetail",
              params: { id: this.story.encryptedId }
            })
        },
        error: {
          nonClosable: false,
          cancelable: false,
          onAccept: () => (this.shownModal = undefined)
        },
        discard: {
          nonClosable: true,
          cancelable: true,
          onAccept: () => this.$router.go(-1),
          onCancel: () => (this.shownModal = undefined)
        },
        invalid: {
          nonClosable: true,
          cancelable: false,
          onAccept: () => (this.shownModal = undefined)
        }
      }
    };
  },
  computed: {
    creating() {
      return this.story.id === undefined;
    },
    isLogged() {
      return this.$store.getters.isAuthenticated;
    },
    isAdmin() {
      return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
    },
    mainRuralModel() {
      return this.story.ruralModels.filter(r => r.main).map(r => r.label);
    }
  },
  watch: {
    projectLink(newVal) {
      if (!newVal) {
        this.story.project = undefined;
      }
    },
    "story.project": function(newValue, oldValue) {
      if (oldValue && oldValue.ruralModels) {
        oldValue.ruralModels.forEach(r => delete r.nonRemovable);
        if (this.story.ruralModels && this.story.ruralModels.pushElements) {
          this.story.ruralModels.removeElements(oldValue.ruralModels);
        }
      }
      if (newValue) {
        if (newValue.ruralModels) {
          newValue.ruralModels.forEach(r => (r.nonRemovable = true));
          if (this.story.ruralModels && this.story.ruralModels.pushElements) {
            this.story.ruralModels.pushElements(newValue.ruralModels);
          }
        }
      } else {
        this.story.project = undefined;
      }
    },
    "story.ruralHousing": function(value) {
      if (value) {
        this.ruralHousingModels.forEach(r => (r.nonRemovable = true));
        if (this.story.ruralModels && this.story.ruralModels.pushElements) {
          this.story.ruralModels.pushElements(this.ruralHousingModels);
        }
      } else {
        this.ruralHousingModels.forEach(r => delete r.nonRemovable);
        if (this.story.ruralModels && this.story.ruralModels.pushElements) {
          this.story.ruralModels.removeElements(this.ruralHousingModels);
        }
      }
    },
    "story.enabled": function(enabled) {
      if (enabled) {
        this.story.reason = undefined;
      }
    },
    "story.state": function(n, o) {
      if (n === STORY_STATES.REJECTED) {
        this.story.enabled = false;
      } else if (n === STORY_STATES.PUBLISHED && o !== undefined) {
        this.story.enabled = true;
      }
    },
    "story.tags": function(n, o) {
      if (n !== o) this.validateTags();
    }
  },
  async created() {
    if (!this.isLogged) {
      this.$router.go(-1);
      return;
    }
    const id = this.$route.params.id;
    if (id) {
      try {
        const response = await VAPI.get(`${SERVICE_NAMES.STORY}/${id}`);
        if (response && response.status === HTTP_STATUS.OK) {
          if (
            this.isAdmin ||
            response.data.userId === this.$store.getters.getCurrentUser.id
          ) {
            if (response.data.tags)
              response.data.tags = response.data.tags.map(tag => ({
                text: tag
              }));
            this.story = Object.assign({}, this.story, response.data);
            this.story.localities = this.story.localities.map(l => l.id);
            this.story.categories = this.story.categories.map(c => c.id);
            this.story.ruralModels = this.story.ruralModels.map(r => r.id);
            this.projectLink = this.story.project !== null;
            this.story.state = this.story.state.id;
            this.alreadyPublished = this.story.state === STORY_STATES.PUBLISHED;
          } else {
            throw new Error("Unauthorized");
          }
        } else {
          throw new Error("Response error");
        }
      } catch (error) {
        console.error("Error fetching story", error);
        this.$router.go(-1);
      }
    } else if (this.isAdmin) {
      this.story.state = STORY_STATES.PUBLISHED;
    }
    this.getDomains();
  },
  methods: {
    validateStory() {
      const areTagsValid = this.validateTags();
      this.$validator.validateAll().then(result => {
        if (result && areTagsValid) {
          if (this.isAdmin) {
            this.saveStory();
          } else {
            this.saving = true;
          }
        } else {
          this.shownModal = "invalid";
        }
      });
    },
    validateTags() {
      if (this.story.tags.length === 0) {
        if (!this.$validator.errors.has("tags")) {
          this.$validator.errors.add({
            field: "tags",
            msg: this.$t("rurality_stories.create.tags_required")
          });
        }
        return false;
      } else {
        this.$validator.errors.remove("tags");
        return true;
      }
    },
    validateModal() {
      this.$validator.validate("saveText").then(result => {
        if (result) {
          this.saveStory();
        }
      });
    },
    saveStory() {
      const body = { ...this.story };
      body.tags = body.tags.map(tag => tag.text);
      if (body.state === undefined) {
        if (this.isAdmin) {
          body.state = { id: STORY_STATES.PUBLISHED };
        } else {
          body.state = { id: STORY_STATES.AWAIT };
        }
      } else {
        body.state = { id: body.state };
      }
      if (body.project) {
        body.project = { id: body.project.id };
      }
      body.categories = body.categories.map(cat => ({ id: cat.id }));
      body.localities = body.localities.map(loc => ({ id: loc.id }));
      body.ruralModels = body.ruralModels.map(r => ({
        id: r.id,
        main: r.main
      }));
      let request, msg;
      if (body.id) {
        request = VAPI.put("/" + SERVICE_NAMES.STORY, body);
        msg = "updat";
      } else {
        request = VAPI.post("/" + SERVICE_NAMES.STORY, body);
        msg = "creat";
      }
      request
        .then(response => {
          if (response && response.status === HTTP_STATUS.OK) {
            if (this.creating)
              this.story.encryptedId = response.data.encryptedId;
            this.shownModal = "success";
          } else {
            throw new Error("response error");
          }
        })
        .catch(e => {
          console.error("Error " + msg + "ing story " + e.toString());
        });
    },
    getDomains() {
      const ruralModelPromise = VAPI.get(`/${SERVICE_NAMES.RURAL_MODEL}/tree`);
      const projectPromise = VAPI.get(`/${SERVICE_NAMES.PROJECT}/simple`);
      const geographyPromise = VAPI.get(
        `${SERVICE_NAMES.GEOGRAPHY}?type=${GEOGRAPHY_TYPE.LOCALIDAD}`
      );
      let statePromise;
      const categoryPromise = VAPI.get(`/${SERVICE_NAMES.STORY}/categories`);
      ruralModelPromise
        .then(response => {
          if (response && response.status == HTTP_STATUS.OK) {
            this.opts.ruralModels = this.toRuralFormat(response.data.data);
            if (this.$route.query.housing) {
              this.isHousing = true;
              this.story.ruralModels = this.ruralHousingModels;
              this.story.ruralModels[0].main = true;
              this.story.ruralHousing = true;
            }
          } else {
            throw new Error("Response error");
          }
        })
        .catch(e => {
          console.error(
            "An error occurred loading rural models " + e.toString()
          );
        });

      projectPromise
        .then(response => {
          if (response && response.status == HTTP_STATUS.OK) {
            this.opts.projects = response.data;
          } else {
            throw new Error("Response error");
          }
        })
        .catch(e => {
          console.error("An error occurred loading projects " + e.toString());
        });

      geographyPromise
        .then(response => {
          if (response && response.status == HTTP_STATUS.OK) {
            this.opts.localities = response.data;
            if (!this.creating) {
              this.opts.localities.forEach(l => {
                const idx = this.story.localities.indexOf(l.id);
                if (idx >= 0) this.story.localities[idx] = l;
              });
            }
          } else {
            throw new Error("Response error");
          }
        })
        .catch(e => {
          console.error("An error occurred loading localities " + e.toString());
        });

      categoryPromise
        .then(response => {
          if (response && response.status == HTTP_STATUS.OK) {
            this.opts.categories = response.data;
            if (!this.creating) {
              this.opts.categories.forEach(c => {
                const idx = this.story.categories.indexOf(c.id);
                if (idx >= 0) this.story.categories[idx] = c;
              });
            }
          } else {
            throw new Error("Response error");
          }
        })
        .catch(e => {
          console.error("An error occurred loading categories " + e.toString());
        });

      if (this.isAdmin) {
        statePromise = VAPI.get(`/${SERVICE_NAMES.STORY}/states`);
        statePromise
          .then(response => {
            if (response && response.status == HTTP_STATUS.OK) {
              this.opts.states = response.data.map(state => {
                return {
                  text: state.state,
                  value: state.id,
                  disabled:
                    state.id === STORY_STATES.AWAIT ||
                    this.story.state === STORY_STATES.PUBLISHED
                };
              });
            } else {
              throw new Error("Response error");
            }
          })
          .catch(e => {
            console.error("An error occurred loading states " + e.toString());
          });
      }
      
      Promise.all([
        ruralModelPromise,
        projectPromise,
        geographyPromise,
        statePromise,
        categoryPromise
      ])
        .then(() => {
          this.setStory();
          this.loadedDomains = true;
        })
        .catch(e => {
          console.error("An error ocurred loading domains" + e.toString());
        });
    },
    setStory() {
      if (!this.creating) {
        this.story.ruralModels = this.story.ruralModels.map(
          id => this.ruralModels[id]
        );
        if (this.story.ruralModels.length) {
          this.story.ruralModels[0].main = true;
        }
        this.story.ruralHousing = this.ruralHousingModels.every(r =>
          this.story.ruralModels.includes(r)
        );
      }
      this.opts.projects.forEach(p => {
        p.ruralModels = p.ruralModels.map(id => this.ruralModels[id]);
        if (
          !this.creating &&
          this.story.project &&
          this.story.project.id === p.id
        ) {
          this.story.project = p;
        }
      });
    },
    toRuralFormat(list) {
      for (let group of list || []) {
        this.setRuralModelFields(group);
        group.theme = group.label;
        for (let l1 of group.children || []) {
          this.setRuralModelFields(l1, l1.label);
          for (let l2 of l1.children || []) {
            this.setRuralModelFields(l2, l1.label, l2.label);
            for (let l3 of l2.children || []) {
              this.setRuralModelFields(l3, l1.label, l2.label, l3.label);
            }
          }
        }
      }
      return list;
    },
    setRuralModelFields(ruralModel, theme, component, subComponent) {
      this.addToRuralMap(ruralModel.id, ruralModel);
      ruralModel.main = false;
      ruralModel.theme = theme;
      if (component) ruralModel.component = component;
      if (subComponent) ruralModel.subComponent = subComponent;
      if (ruralModel.id === RURALMODEL.HOUSING) {
        if (ruralModel.children) {
          this.ruralHousingModels = ruralModel.children;
        } else {
          this.ruralHousingModels = [RURALMODEL.HOUSING];
        }
      }
    },
    addToRuralMap(id, value) {
      this.ruralModels[id] = value;
    }
  }
};
</script>

<style lang="sass">

.form-group.required legend:after
  content: " *"
  color: red
.table-height
  height: 3rem
  
</style>
    
<style lang="sass" scoped>   
@import '../../../../stylesheets/style.sass'

.feed-title
  position: relative
  display: inline-block
  color: #fff
  background: url(../../../../assets/title/barra_sola_3.png)
  background-repeat: no-repeat
  background-size: 100% 100%
  height: 90px
  width: 110%
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

.valign
  display: inline-flex
  align-items: center

.flex-right-align
  flex-direction: row-reverse

.w-100
  width: 100% !important
  max-width: 100% !important

.centered
  display: flex
  justify-content: center
  align-items: center

.form-group
  margin-bottom: 15px

  *
    border-color: #CED4DA !important
    border-radius: 0.25rem !important

  .container
    padding: 0px
    height: auto
</style>

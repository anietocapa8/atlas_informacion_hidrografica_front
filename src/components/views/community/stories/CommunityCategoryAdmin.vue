<template>
  <div class="container container-form">
    <b-container v-if="categories">
      <sipsder-title
        :title="$t('rurality_stories.categories_admin.title').toUpperCase()"
        html-field="title"
        type="admin"
        section="configuration"
      />
      <b-form @submit.prevent="validateCategory">
        <b-row>
          <b-col>
            <b-form-group
              class="form-group"
              label-cols="5"
              :label="$t('rurality_stories.categories_admin.category_lbl')"
              horizontal
            >
              <b-form-select :options="categories" v-model="selected" />
            </b-form-group>
          </b-col>
        </b-row>
        <hr />
        <template v-if="category">
          <h2 class="w-100 text-center my-4">{{ $t('rurality_stories.categories_admin.subtitle') }}</h2>
          <b-row class="my-2">
            <b-col>
              <b-form-group
                class="form-group required"
                label-cols="5"
                :label="$t('rurality_stories.categories_admin.name')"
              >
                <b-form-input
                  name="name"
                  type="text"
                  :data-vv-as="$t('rurality_stories.categories_admin.name')"
                  v-validate="'required|max:200'"
                  v-model="category.name"
                />
                <b-alert variant="danger" :show="errors.has('name')">{{ errors.first("name") }}</b-alert>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="my-2">
            <b-col>
              <b-form-group
                class="form-group required"
                :label="$t('rurality_stories.categories_admin.description_lbl')"
                x
              >
                <b-form-textarea
                  type="text"
                  v-validate="'required|max:280'"
                  name="description"
                  :placeholder="$t('rurality_stories.categories_admin.description')"
                  :data-vv-as="$t('rurality_stories.categories_admin.description')"
                  v-model="category.description"
                  rows="3"
                  max-rows="5"
                  no-resize
                />
                <b-alert
                  variant="danger"
                  :show="errors.has('description')"
                >{{ errors.first("description") }}</b-alert>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group
                class="form-group required"
                label-cols="4"
                :label="$t('rurality_stories.categories_admin.image_lbl')"
              >
                <input
                  ref="uploadImage"
                  type="file"
                  accept="image/x-png, image/jpeg"
                  v-show="false"
                  @change="uploadFile($event)"
                />
                <sipsder-btn
                  btnType="uploadImage"
                  :text="$t('rurality_stories.categories_admin.image_btn')"
                  @onClick="onUpload"
                />
                <div class="valign ml-4">
                  <span v-if="file">{{ file.name }}</span>
                  <span v-else>{{ $t('rurality_stories.categories_admin.no_file') }}</span>
                </div>
                <b-alert
                  variant="danger"
                  :show="errorUpload"
                >{{ $t('rurality_stories.categories_admin.invalid_image') }}</b-alert>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="4">
              <span class="h3">{{ $t('rurality_stories.categories_admin.preview') }}</span>
              <b-card
                v-b-tooltip="category.description"
                :title="category.name"
                :img-src="fileUrl || getImgURL(category.attachment.url)"
                img-alt="Image"
                class="cat-card my-3"
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col class="text-center btn-group">
              <sipsder-btn btnType="back" @onClick="shownModal = 'discard'" />
            </b-col>
            <b-col class="text-center btn-group">
              <sipsder-btn btnType="save" @onClick="validateCategory" />
            </b-col>
          </b-row>
        </template>
      </b-form>
    </b-container>
    <modal
      :modals="modals"
      :activeModalName="shownModal"
      i18n="rurality_stories.categories_admin"
      @closed="shownModal = undefined"
    />
  </div>
</template>

<script>
import {
  SERVICE_NAMES,
  HTTP_STATUS
} from "../../../../sipsder_constants";
import { ATTACHMENT_TYPE, PERMISSIONS_TYPES } from "../../../../domain_constants";
import VAPI from "../../../../http_common";
import S_UTIL from "@/util/sipsder_util";
import Modal from "../../../shared/Modal";

export default {
  components: { Modal },
  data() {
    return {
      category: undefined,
      selected: undefined,
      file: undefined,
      fileUrl: undefined,
      errorUpload: false,
      /*            MODAL VALUES            */
      shownModal: undefined,
      modals: {
        save: {
          nonClosable: false,
          cancelable: true,
          onAccept: () => this.saveCategory(),
          onCancel: () => (this.shownModal = undefined)
        },
        success: {
          nonClosable: true,
          cancelable: false,
          onAccept: () => this.$router.push({ name: "CommunityStory" })
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
    categories() {
      if (this.$store.getters.getStoryGeneral !== undefined)
        return this.$store.getters.getStoryGeneral.categories.map(category => ({
          value: category,
          text: category.name
        }));
      return null;
    },
    isLogged() {
      return this.$store.getters.isAuthenticated;
    },
    isAdmin() {
      return this.$store.getters.hasPermission(PERMISSIONS_TYPES.ADMIN);
    }
  },
  watch: {
    categories(categories) {
      if (categories && this.selected === undefined) this.selected = categories[0].value;
    },
    selected(selected) {
      this.category = { ...selected };
    }
  },
  created() {
    this.$store.dispatch("getStoryGeneral");
    if (!this.isAdmin) {
      this.$router.push({ name: 'CommunityStory' })
      return;
    }
  },
  methods: {
    onUpload() {
      this.$refs.uploadImage.value = "";
      this.$refs.uploadImage.click();
      this.errorUpload = false;
    },
    uploadFile(e) {
      if (e.target.files.length) {
        const accTypes = ["image/png", "image/x-png", "image/jpeg"];
        if (accTypes.includes(e.target.files[0].type)) {
          this.errorUpload = false;
          this.file = e.target.files[0];
          this.fileUrl = URL.createObjectURL(this.file);
        } else {
          this.errorUpload = true;
          this.file = undefined;
          this.fileUrl = undefined;
        }
      }
    },
    validateCategory() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.shownModal = "save";
        } else {
          this.shownModal = "invalid";
        }
      });
    },
    saveCategory() {
      const body = new FormData();
      
      const category = { ...this.category };
      delete category.attachment;
      body.append(
        "category",
        new Blob([JSON.stringify(category)], {
          type: "application/json"
        })
      );

      let attachment = null;
      if (this.file !== undefined) {
        const user = this.$store.getters.getCurrentUser;
        const name = user.firstName + ' ' + user.lastName;
        attachment = {
          title: category.name,
          description: category.description,
          author: name,
          source: name,
          enabled: true,
          typeId: ATTACHMENT_TYPE.LOGO,
        }
      }
      body.append(
        "attachment",
        new Blob([JSON.stringify(attachment)], {
          type: "application/json"
        })
      );
      
      body.append("file", this.file);
      const headers = { headers: { "Content-Type": "multipart/form-data" } };
      VAPI.put(`/${SERVICE_NAMES.STORY}/categories`, body, headers)
        .then(response => {
          if (response && response.status === HTTP_STATUS.OK) {
            this.shownModal = "success";
          } else {
            throw new Error("Response error");
          }
        })
        .catch(e => {
          console.error("An error occurred saving the category " + e.toString());
        });
    },
    getImgURL (url) {
      return S_UTIL.getImgURL(url);
    }
  }
};
</script>

<style lang="sass">
.form-group.required legend:after
  content: " *"
  color: red
</style>

<style lang="sass" scoped>
.valign
  display: inline-flex
  align-items: center

.cat-card
  height: 300px
  background: rgba(0, 183, 186, .3)
  border-radius: 1rem

  &:hover
    cursor: pointer
    filter: drop-shadow(0px 0px 1px rgba(0, 113, 115, .5)) drop-shadow(0px 0px 10px rgba(0, 113, 115, .3))

  .card-img
    height: 250px
    border-radius: 1.5rem
    object-fit: cover
    padding: 5px
    filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, .3)) drop-shadow(0px 0px 10px rgba(0, 0, 0, .3))

  .card-body > .card-title
    text-align: center
    font-size: large
</style>
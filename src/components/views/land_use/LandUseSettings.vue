<template>
  <div class="land-use">
    <sipsder-title 
      :title="$t('land_use.title')"
      section="configuration"
      type="admin"
    />
    <div class="div-90">
      <div class="tabs">
        <div class="A">
          <div class="tab-design" :class="{active : layerTab}" @click="layerTab=true">
            <div>
              <span v-t="'land_use.layer_title'" />
            </div>
          </div>
          <div class="tab-design" :class="{active : !layerTab}" @click="layerTab=false">
            <div>
              <span v-t="'land_use.rule_title'" />
            </div>
          </div>
        </div>
        <div class="B">
          <div>
            <div>
              <div v-show="layerTab">
                <p v-t="'land_use.layer_description'" />
                <b-row>
                  <b-col class="text-right">
                    <sipsder-btn btn-type="add" :text="$t('land_use.layer_add')" @onClick="showLayerForm = true" />
                  </b-col>
                </b-row>
                <b-table responsive striped :items="rows.layer" :fields="fields.layer" :empty-text="$t('land_use.layer_empty')" show-empty>
                  <template slot="actions" slot-scope="row">
                    <sipsder-btn btn-type="delete" text @onClick="showDeleteModal = true; item = { type: 'layer', name: row.item.name, row }" />
                  </template>
                </b-table>
              </div>
              <div v-show="!layerTab">
                <p v-t="'land_use.rule_description'" />
                <b-row>
                  <b-col class="text-right">
                    <template v-if="editOrder">
                      <sipsder-btn btn-type="accept" :text="$t('button.save')" @onClick="saveOrder" />
                      <sipsder-btn btn-type="cancel" :text="$t('button.cancel')" @onClick="discardOrder" />
                    </template>
                    <template v-else>
                      <span id="edit-order-btn">
                        <sipsder-btn :disabled="rows.rule.length < 2" btn-type="edit" :text="$t('land_use.edit_order')" @onClick="editRuleOrder" />
                      </span>
                      <span id="new-rule-btn">
                        <sipsder-btn :disabled="rows.layer.length === 0" btn-type="add" :text="$t('land_use.rule_add')" @onClick="createRule" />
                      </span>
                      <b-tooltip v-if="rows.rule.length < 2" target="edit-order-btn">{{$t('land_use.edit_order_msg')}}</b-tooltip>
                      <b-tooltip v-if="rows.layer.length === 0" target="new-rule-btn">{{$t('land_use.new_rule_msg')}}</b-tooltip>
                    </template>
                  </b-col>
                </b-row>
                <div class="text-center">
                <b-table ref="ruleTable" class="mw-50 mx-auto" :items="rows.rule" :fields="fields.rule" tbody-tr-class="pr-3" :empty-text="$t('land_use.rule_empty')" show-empty striped>
                  <template v-slot:empty="scope">
                    <h4>{{ scope.emptyText }}</h4>
                  </template>
                  <template slot="actions" slot-scope="row">
                    <template v-if="editOrder">
                      <sipsder-btn btn-type="export" text :disabled="row.index === 0" @onClick="order(row, -1)" />
                      <sipsder-btn btn-type="download" text :disabled="row.index === rows.rule.length - 1" @onClick="order(row, 1)" />
                    </template>
                    <template v-else>
                      <sipsder-btn btn-type="edit_pen" text @onClick="editRule(row.item)" />
                      <sipsder-btn btn-type="delete" text @onClick="showDeleteModal = true; item = { type: 'rule', name: row.item.name, row }" />
                    </template>
                  </template>
                </b-table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal
      :title="$t('land_use.layer_title')"
      v-model="showLayerForm"
      size="lg"
      no-close-on-backdrop
      hide-footer
    >
      <b-form data-vv-scope="layer" @submit.prevent="validateLayer">
        <b-form-group class="required" :label="$t('land_use.layer_name')">
          <b-form-input v-model="layer.name" v-validate="'required'" name="name" :data-vv-as="$t('land_use.layer_name')" />
          <b-alert variant="danger" :show="layerConflict || errors.has('layer.name')">
            <template v-if="errors.has('layer.name')">{{ errors.first("layer.name") }}</template>
            <template v-else-if="layerConflict">{{ $t("land_use.layer_conflict") }}</template>
          </b-alert>
        </b-form-group>
        <b-form-group class="required" :label="$t('land_use.layer_url')">
          <b-form-input v-model="layer.url" v-validate="{ required: true, url: { require_protocol: true }}" name="url" :data-vv-as="$t('land_use.layer_url')" />
          <b-alert variant="danger" :show="layerInvalidUrl || errors.has('layer.url')">
            <template v-if="errors.has('layer.url')">{{ errors.first("layer.url") }}</template>
            <template v-else-if="layerInvalidUrl">{{ $t("land_use.layer_invalid_url") }}</template>
          </b-alert>
        </b-form-group>
        <div>
          <b-alert :show="invalidForm" variant="danger" v-t="$t('land_use.invalid_form')" />
        </div>
        <div class="text-center">
          <sipsder-btn btn-type="cancel" @onClick="showLayerForm = false" />
          <sipsder-btn type="submit" btn-type="accept" :text="$t('button.save')" />
        </div>
      </b-form>
    </b-modal>

    <b-modal
      :title="$t('land_use.rule_title')"
      v-model="showRuleForm"
      size="lg"
      no-close-on-backdrop
      hide-footer
    >
      <b-form data-vv-scope="rule" @submit.prevent="validateRule">
        <b-form-group class="required" :label="$t('land_use.rule_name')">
          <b-form-input v-model="rule.name" v-validate="'required'" name="name" :data-vv-as="$t('land_use.rule_name')" />
          <b-alert variant="danger" :show="ruleConflict || errors.has('rule.name')">
            <template v-if="errors.has('rule.name')">{{ errors.first("rule.name") }}</template>
            <template v-else-if="ruleConflict">{{ $t("land_use.rule_conflict") }}</template>
          </b-alert>
        </b-form-group>
        <b-form-group class="required" :label="$t('land_use.rule_layer')">
          <vue-select v-model="rule.idLayer" :options="rows.layer" v-validate="'required'" name="layer" :data-vv-as="$t('land_use.rule_layer')" label="name" index="id" />
          <b-alert variant="danger" :show="errors.has('rule.layer')">{{ errors.first("rule.layer") }}</b-alert>
        </b-form-group>
        <b-form-group :label="$t('land_use.rule_value')">
          <vue-select :disabled="rule.idLayer === undefined" v-model="rule.idValue" :options="values" label="name" index="id">
            <div slot="no-options">{{ $t('land_use.rule_no_values') }}</div>
          </vue-select>
        </b-form-group>
        <b-form-group class="required" :label="$t('land_use.rule_text')">
          <rich-text v-model="rule.htmlText" v-validate="'required'" name="text" :data-vv-as="$t('land_use.rule_text')" />
          <b-alert variant="danger" :show="errors.has('rule.text')">{{ errors.first("rule.text") }}</b-alert>
        </b-form-group>
        <div>
          <b-alert :show="invalidForm" variant="danger" v-t="$t('land_use.invalid_form')" />
        </div>
        <div class="text-center">
          <sipsder-btn btn-type="cancel" @onClick="showRuleForm = false" />
          <sipsder-btn type="submit" btn-type="accept" :text="$t('button.save')" />
        </div>
      </b-form>
    </b-modal>


    <b-modal
      :title="$t(`land_use.${item.type}_delete_title`, { name: item.name })"
      v-model="showDeleteModal"
      hide-footer
    >
      <div v-t="$t(`land_use.${item.type}_delete_text`)" />
      <b-row class="text-center">
        <b-col>
          <sipsder-btn btnType="accept" @onClick="deleteItem()"/>
        </b-col>
        <b-col>
          <sipsder-btn btnType="cancel" @onClick="showDeleteModal = false"/>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import VueSelect from "vue-select";
import { HTTP_STATUS, SERVICE_NAMES } from "@/sipsder_constants";
import { ARCGIS_TAGS } from "@/domain_constants";
import RichText from "@/components/shared/RichText";
import VAPI from "@/http_common";

export default {
  components: {
    RichText,
    VueSelect,
  },
  data() {
    return {
      fields: {
        layer: [ 
          { key: "name", label: "Nombre" },
          { key: "url", label: "URL" },
          { key: "actions", label: "Acciones" },
        ],
        rule: [
          { key: "name", label: "Nombre" },
          { key: "actions", label: "Acciones" },
        ],
      },
      rows: {
        layer: [],
        rule: []
      },
      values: [],
      layer: {
        name: undefined,
        url: undefined,
      },
      rule: {
        name: undefined,
        idLayer: undefined,
        idValue: undefined,
        text: undefined,
      },
      layerTab: true,
      layerOpts: {
        delete: {
          id: 0,
          class: "btn-success",
          label: "",
          icon: "delete",
        },
      },
      editOrder: false,
      showLayerForm: false,
      showRuleForm: false,
      showDeleteModal: false,
      item: {
        name: undefined,
        row: undefined,
        type: undefined,
      },
      invalidForm: false,
      layerConflict: false,
      layerInvalidUrl: false,
      ruleConflict: false,
    };
  },
  watch: {
    showLayerForm(value) {
      this.invalidForm = false;
      this.layerConflict = false;
      this.layerInvalidUrl = false;
    },
    showRuleForm(value) {
      this.invalidForm = false;
      this.ruleConflict = false;
    },
    "rule.idLayer": function(id) {
      if (id) {
        this.loadLayerValues(id);
      }
    },
  },
  created() {
    this.loadRules();
    this.loadLayers();
  },
  methods: {
    order(row, order) {
      const rule = row.item;
      this.rows.rule.splice(row.index, 1);
      this.rows.rule.splice(row.index + order, 0, row.item)
    },
    editRuleOrder() {
      this.editOrder = true;
    },
    async saveOrder() {
      this.rows.rule.forEach((val, idx) => {
        val.order = idx;
      });
      try {
        const response = await VAPI.put(SERVICE_NAMES.RULE, this.rows.rule);
        if (response.status === HTTP_STATUS.OK) {
          this.rows.rule = response.data;
          this.editOrder = false;
        } else {
          throw new Error("Response error");
        }
      } catch (error) {
        console.error("Error adding layer " + error.toString());
        return;
      }
    },
    discardOrder() {
      this.rows.rule.sort((rule1, rule2) => rule1.order - rule2.order);
      this.editOrder = false;
    },
    loadLayerValues(id) {
      VAPI.get(`${SERVICE_NAMES.LAYER}/values/${id}`)
        .then(response => {
          if (response.status === HTTP_STATUS.OK) {
            this.values = response.data;
            if (!this.values.map(v => v.id).includes(this.rule.idValue)) {
              this.rule.idValue = undefined;
            }
          } else if (response.status === HTTP_STATUS.NO_CONTENT) {
            this.rule.idValue = undefined;
            this.values = [];
          }
        }).catch(error => {
          this.rule.idValue = undefined;
          this.values = [];
          console.error("Error fetching layer values " + error.toString());
        });
    },
    loadLayers() {
      VAPI.get(SERVICE_NAMES.LAYER)
        .then(response => {
          this.rows.layer = response.data;
        }).catch(error => {
          console.error("Error fetching layers " + error.toString());
        });
    },
    loadRules() {
      VAPI.get(SERVICE_NAMES.RULE)
        .then(response => {
          this.rows.rule = response.data;
        }).catch(error => {
          console.error("Error fetching rules " + error.toString());
        });
    },
    createRule() {
      this.rule.id = undefined;
      this.rule.name = undefined;
      this.rule.idLayer = undefined;
      this.rule.idValue = undefined;
      this.rule.htmlText = undefined;
      this.showRuleForm = true;
      this.errors.clear();
      this.$validator.reset();
    },
    editRule(rule) {
      VAPI.get(`${SERVICE_NAMES.RULE}/${rule.id}`)
        .then(response => {
          this.rule.id = response.data.id;
          this.rule.name = response.data.name;
          this.rule.idLayer = response.data.layer.id;
          this.rule.idValue = response.data.idValue;
          this.rule.htmlText = response.data.htmlText;
          this.showRuleForm = true;
        }).catch(error => {
          console.error("Error loading rule " + error.toString());
        });
    },
    deleteItem() {
      VAPI.delete(`${SERVICE_NAMES[this.item.type.toUpperCase()]}/${this.item.row.item.id}`)
        .then(response => {
          if (response.status === HTTP_STATUS.OK) {
            this.rows[this.item.type].splice(this.item.row.index, 1);
            if (this.item.type === 'layer') {
              this.loadRules();
            }
            this.showDeleteModal = false;
          } else {
            throw new Error("Response error");
          }
        }).catch(error => {
          console.error(`Error deleting ${this.item.type} ` + error.toString());
        });
    },
    validateLayer() {
      this.invalidForm = false;
      this.layerConflict = false;
      this.layerInvalidUrl = false;
      this.$validator.validateAll("layer").then(result => {
        if (result) {
          this.saveLayer();
        } else {
          this.invalidForm = true;
        }
      });
    },
    async saveLayer() {
      try {
        const model = { ...this.layer };
        if (model.url.slice(-1) !== "/") {
          model.url += "/";
        }
        const response = await VAPI.post(SERVICE_NAMES.LAYER, model);
        if (response.status === HTTP_STATUS.OK) {
          this.rows.layer.push(response.data);
        } else {
          throw new Error("Response error");
        }
        this.errors.clear();
        this.$validator.reset();
      } catch (error) {
        if (error.response.status === HTTP_STATUS.CONFLICT) {
          this.layerConflict = true;
          return;
        } else if (error.response.status === HTTP_STATUS.UNPROCESSABLE_ENTITY) {
          this.layerInvalidUrl = true;
          return;
        }
        console.error("Error adding layer " + error.toString());
        return;
      }
      this.layer = {
        name: undefined,
        url: undefined,
      };
      this.showLayerForm = false;
    },
    validateRule() {
      this.invalidForm = false;
      this.ruleConflict = false;
      this.$validator.validateAll("rule").then(result => {
        if (result) {
          this.saveRule();
        } else {
          this.invalidForm = true;
        }
      })
    },
    async saveRule() {
      try {
        let response;
        const entity = { ...this.rule };
        if (this.rule.id) {
          response = await VAPI.put(`${SERVICE_NAMES.RULE}/${this.rule.id}`, entity);
        } else {
          response = await VAPI.post(SERVICE_NAMES.RULE, entity);
        }
        if (response.status === HTTP_STATUS.OK) {
          if (this.rule.id) {
            const idx = this.rows.rule.findIndex(el => el.id === this.rule.id);
            this.rows.rule.splice(idx, 1, response.data);
          } else {
            this.rows.rule.push(response.data);
          }
        } else {
          throw new Error("Response error");
        }
        this.errors.clear();
        this.$validator.reset();
        this.rule = {
          name: undefined,
          idLayer: undefined,
          idValue: undefined,
          htmlText: undefined,
        };
        this.showRuleForm = false;
      } catch (error) {
        if (error.response.status === HTTP_STATUS.CONFLICT) {
          this.ruleConflict = true;
          return;
        }
        if (this.rule.id) {
          console.error("Error updating rule " + error.toString());
        } else {
          console.error("Error adding rule " + error.toString());
        }
        return;
      }
    },
  }
};
</script>

<style lang="sass">
.form-group.required legend:after
  content: " *"
  color: red
</style>  

<style lang="sass" scoped>
@import '../../../stylesheets/style.sass'

.mw-50
  width: auto
  min-width: 50%

.land-use
  padding: 0 15px
  font-size: 1.5rem
  font-family: "Open Sans", sans-serif

.tabs
  display: grid
  grid-template-columns: 1fr
  grid-template-rows: 70px auto
  .A
    margin-left: 15px
    display: inline-flex
  .B
    padding: 10px
    margin-top: -25px
    background: #fff
    box-shadow: 0px 0px 3px #555
    border-radius: 3px
    z-index: 3
    border: 5px solid #fff

.tab-design  
  margin-bottom: 10px !important
  transform: rotate(3deg)
  max-width: 50%
  margin-right: 20px
  font-size: 1.34rem
  div
    cursor: pointer
    width: 105%
    background: $colorTitle
    color: white
    border-radius: 10px
    min-height: 70px
    padding: 10px 3.5em 14px 1em
    span
      display: block
      transform: rotate(-4deg)
  &.active
    div
      box-shadow: 0px 0px 3px #555
      background: $colorTitleDark
      color: white
      border-color: unset
      transition: 0.5s
  &:hover
    div
      box-shadow: 0px 0px 3px #555
.div-90
      width: 90% !important
      margin: 0 auto
@media screen  and (max-width: $widthDesktop)
  .tab-design
    font-size: 1.1rem !important
@media screen  and (max-width: $widthTablet)
  .tab-design
    font-size: 1.2rem !important
  .div-90
      width: 80% !important
  .tab-design
      font-size: 1.1rem !important
@media screen  and (max-width: $widthMobile)
  .div-90
      width: 80% !important
  .feed-title
      padding-left: calc(10% + 40px) !important
      font-size: 20px !important
  .tabs
      min-height: unset !important
      grid-template-rows: unset !important
      .A
          display: flex !important
          flex-wrap: wrap
          width: 100%
          margin-left: 0 !important
      .B
          width: 100%
  .tab-design  
      height: 70px !important
      max-width: unset !important
      margin: 5px
      width: 40%
      div
          height: 70px !important
          span
              height: 70px !important

</style>

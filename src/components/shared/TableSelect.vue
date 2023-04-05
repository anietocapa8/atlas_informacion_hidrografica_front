<template>
    <div class="table-select">
        <b-row>
            <b-col cols="11" v-if="treeselect">
                <b-form-group                                 
                    :label="label"
                    :label-class="[{'font-weight-bold': labelBold}]"
                >
                    <treeselect
                        v-model="selected" 
                        :options="options" 
                        :searchable="true"
                        :openDirection="'below'"
                        :placeholder="defaultText"
                        :clearable="true"
                        :disable-branch-nodes="disableBranch"
                    >
                        <label slot="option-label" slot-scope="{ node }">
                            <img v-if="node.raw && node.raw.url != null" 
                                    :src="getImgURL(node.raw.url)" height="16" width="16">
                            <span v-else-if="node.raw && node.raw.color" class="dot" :style="{backgroundColor: node.raw.color}"></span>
                            <span> {{ node.label.split('/')[0] }} </span>
                            <span class="grey-label-text" v-if="node.label.split('/')[1] !== undefined"> {{ ' / ' + node.label.split('/')[1] }} </span>
                        </label>
                    </treeselect>
                </b-form-group>
            </b-col>
            <b-col cols="11" v-else>
                <b-form-group                                 
                    :label="label"
                    :label-class="[{'font-weight-bold': labelBold}]"
                >
                    <vue-select required v-model="selected" 
                        :placeholder="defaultText"
                        :label="labelSelect" 
                        :options="options" 
                        :taggable="taggable"
                    ></vue-select>
                </b-form-group>
            </b-col>
            <b-col cols="1" class="btn-padding">
                <sipsder-btn 
                    btnType="add" text="" @onClick="addElement"
                ></sipsder-btn>
            </b-col>
        </b-row>

        <b-row>
            <b-col cols=12 
                v-if="selectedOptions.length > 0"
                class="d-flex justify-content-center"
            >
                <b-table responsive striped hover small :fields="tableFields" :items="selectedOptions">

                    <template :slot="statusCol" slot-scope="row">
                        <div  class="d-flex justify-content-center" v-if="multiple">
                            <b-check
                                v-model="row.item[statusCol]"
                                switch
                                @change="changeStatus(row.index)"
                            ></b-check>
                        </div>
                        <div  class="d-flex justify-content-center" v-else>
                            <b-radio
                                v-model="currMain"
                                name="radio-table"
                                :value="row.item"
                                @change="changeRadioStatus(row.item)"
                            ></b-radio>
                        </div>
                    </template>
                    <!-- Columna definida para la acciones -->
                    <template slot="actions" slot-scope="row">
                        <div class="d-flex justify-content-center">
                            <sipsder-btn btnType="delete" text="" @onClick="removeElement(row.item)" :disabled="row.item.nonRemovable">
                            </sipsder-btn>
                            <slot name="actionsCol" :row="row">
                            </slot>
                        </div>
                    </template>
                </b-table>
            </b-col>
            <b-col cols=12 v-else class="d-flex justify-content-center">
                {{empty}}
            </b-col>
        </b-row>
    </div>
</template>

<script>
import vSelect from "vue-select";
import Treeselect from '@riophae/vue-treeselect';
import S_UTIL from "../../util/sipsder_util";

export default {
    name: "TableSelect",
    props: {
        emptyMessage: {
            type: String,
            default: null,
        },
        placeholder: {
            type: String,
            default: null,
        },
        treeselect: {
            type: Boolean,
            default: false,
        },
        label: {
            type: String,
            default: "",
        },
        labelSelect: {
            type: String,
            default: "text",
        },
        // opciones que pueden ser elegidas. si no son en treeselect deben tener el campo label
        options: {
            type: Array,
            defaul: []
        },
        taggable : {
            type: Boolean,
            default: false,
        },
        value : {
            required: true,
        },
        tableFields: {
            type: Array,
            required: true,
        },
        //Nombre de la columna que guardara el status del listado.
        statusCol: {
            type: String,
            default: "status"
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        disableBranch: {
            type: Boolean,
            default: false,
        },
        labelBold: {
            type: Boolean, 
            default: false
        }
    },
    computed: {
        empty() {
            if (this.emptyMessage) {
                return this.emptyMessage;
            }

            return this.$t('util.no_elements');
        },
        defaultText () {
            if (this.placeholder) {
                return this.placeholder;
            }
            return this.$t('util.select_option');
        }
    },
    components: {
        "vue-select": vSelect,
        Treeselect,
    },
    data() {
        return {
            prevMain: undefined,
            currMain: undefined,
            selected: null,
            selectedOptions: [],
        }
    },
    methods: {
        getImgURL (url) {
            return S_UTIL.getImgURL(url);
        },
        emitResult(){
            this.$emit('input', this.selectedOptions)
        },
        isDuplicated(element) {
            if (!element) {
                return false;
            }
            var duplicated = this.selectedOptions.includes(element);
            if (this.taggable && !element.id) {
                this.selectedOptions.forEach(val =>{
                    if (val.value == element.value){
                        duplicated = true;
                    }
                });
            }
            return duplicated;
        },
        addElement() {
            var element = this.selected;
            if (element && !element.id && this.taggable && !element.value) {
                element = {value: element};
            }

            if (this.treeselect) {
                element = this.findElement(this.selected);
            }
            if (this.pushElement(element)) {
                this.selected = null;
            }
        },
        pushElement(element) {
            var duplicated = this.isDuplicated(element);
            if (element && !duplicated) {
                this.selectedOptions.push(element);
                // this.tableFields.keys().includes(this.statusCol) && 
                if(!this.taggable && this.selectedOptions.length == 1){
                    this.selectedOptions[0][this.statusCol] = true;
                    this.currMain = this.selectedOptions[0];
                    this.prevMain = this.selectedOptions[0];
                }
                this.emitResult();
                return true;
            }
            return false;
        },
        removeElement(deleteVal) {
            if (this.selectedOptions.includes(deleteVal)) {
                // this.selectedOptions = this.selectedOptions.filter(value => {
                //     return value != deleteVal;
                // });
                const idx = this.selectedOptions.indexOf(deleteVal);
                this.selectedOptions.splice(idx, 1);
                if (deleteVal[this.statusCol]) {
                    deleteVal[this.statusCol] = false;
                    if (idx > 0 && idx === this.selectedOptions.length) {
                        this.selectedOptions[idx - 1][this.statusCol] = true;
                        this.currMain = this.selectedOptions[idx-1];
                        this.prevMain = this.selectedOptions[idx-1];
                    } else if (this.selectedOptions.length) {
                        this.selectedOptions[idx][this.statusCol] = true;
                        this.currMain = this.selectedOptions[idx];
                        this.prevMain = this.selectedOptions[idx];
                    } else {
                        this.currMain = undefined;
                        this.prevMain = undefined;                        
                    }
                }
                this.emitResult();
            }
        },
        findElement(id) {
            var n = this.options.length;
            var ret = null;
            for (var idx = 0; idx < n; idx++) {
                ret = this.findNode(this.options[idx], id);
                if (ret) {
                    break;
                }
            }

            return ret;
        },
        findNode (node, id) {
            if (node && node.id == id) {
                return node;
            }
            var ret = null;
            if (node.children){
                var n = node.children.length;
                for (var idx = 0; idx < n; idx++) {
                    ret = this.findNode(node.children[idx], id);
                    if(ret) {
                        break;
                    }
                }
            }
            return ret;
        },
        hasStatusField () {
            this.tableFields.forEach(field =>{
                if (field.key == 'status') {
                    return true;
                }
            });
            return false;
        },
        changeStatus (index) {
            if (!this.selectedOptions[index][this.statusCol]) {
                this.selectedOptions[index][this.statusCol] = true;
            } else {
                this.selectedOptions[index][this.statusCol] = false;
            }
            this.emitResult();
        },
        changeRadioStatus (item) {
            if (this.currMain !== undefined) {
                this.currMain[this.statusCol] = false;    
            }
            this.prevMain = this.currMain;
            item[this.statusCol] = true;
            this.currMain = item;
            this.emitResult();
        }
    },
    async created() {
        if (this.value) {
            this.selectedOptions = await this.value;
            if (!this.multiple) {
                let n = this.selectedOptions.length;
                for (let idx = 0; idx < n; idx++) {
                    if (this.selectedOptions[idx][this.statusCol]) {
                        this.currMain = this.selectedOptions[idx];
                        this.prevMain = this.selectedOptions[idx];
                        break;
                    }
                }
            }
            this.selectedOptions.pushElements = (array) => {
                array.forEach(value => this.pushElement(value));
            }
            this.selectedOptions.removeElements = (array) => {
                array.forEach(value => this.removeElement(value));
            }
            this.emitResult();
        } 
    }
}
</script>

<style lang="scss" scoped>
.dot {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  display: inline-block;
}
.btn-padding {
    padding-top: 1rem;
}
.grey-label-text {
  color: grey;
}
</style>
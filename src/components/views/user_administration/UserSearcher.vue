<template>
    <div class="container">
        <!--<h4 align="center">{{$t("userAdmin.searcherForm.title")}}</h4>-->
        <b-form @onReset="onReset">
            <b-form-group>
                <b-row>
                    <b-col>
                        <b-form-input id="idName"
                                      type="text"
                                      v-model="form.name"
                                      :placeholder="$t('userAdmin.searcherForm.namePlaceholder')">
                        </b-form-input>
                    </b-col>
                    <b-col>
                        <b-form-select id="idState"
                                       v-model="form.state"
                                       :options="states"
                        >
                        </b-form-select>
                    </b-col>
                </b-row>
                <b-row class="row-margin">
                    <b-col>
                        <b-form-input id="idEmail"
                                      type="email"
                                      v-model="form.email"
                                      :placeholder="$t('userAdmin.searcherForm.emailPlaceholder')">
                        </b-form-input>
                    </b-col>
                    <b-col>
                        <b-form-select id="idUserType"
                                       v-model="form.userType"
                                       :options="userTypes"
                        >
                        </b-form-select>
                    </b-col>
                </b-row>
                <b-row class="row-margin">
                    <b-col>
                        <VueBootstrapTypeahead :placeholder="$t('userAdmin.searcherForm.institutionPlaceholder')"
                                               :data="institutions"
                                               :serializer="s => s.name"
                                               v-model="institutionSearch"
                                               @hit="selectOption"
                                               ref="institutionType"
                        />
                    </b-col>
                    <b-col>
                    </b-col>
                </b-row>
            </b-form-group>
            <b-row class="buttons-container" >
                <b-col>
                    <sipsder-btn :text="$t('userAdmin.searcherForm.searchBtn')"
                                 btnType="search"
                                 @onClick="onSubmit"></sipsder-btn>
                </b-col>
                <b-col>
                    <sipsder-btn :text="$t('userAdmin.searcherForm.clearBtn')"
                                 btnType="clean"
                                 @onClick="onReset"></sipsder-btn>
                </b-col>
            </b-row>
        </b-form>
    </div>
</template>

<script>
    import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
    import VAPI from '../../../http_common'
    import { SERVICE_NAMES } from '../../../sipsder_constants';
    import { USER_STATUS } from '../../../domain_constants';
    export default {
        name: "UserSearcher",
        components:{
            VueBootstrapTypeahead
        },
        data(){
            return {
                form:{
                    name:null,
                    state:null,
                    email:null,
                    userType:null,
                    institution:null
                },
                userTypes:[
                    {text: this.$t('userAdmin.tableTitles.userType'), value:null}
                ],
                states: USER_STATUS,
                institutions:[],
                institutionSearch: ''
            }
        },
        methods:{
            onSubmit:function (event) {
                // emit event to inform parent
                this.form.institution = this.institutionSearch;
                this.$emit('searchEvent', event, this.form);
            },
            onReset:function () {
                this.form.name='';
                this.form.state=null;
                this.form.institution=null;
                this.form.userType=null;
                this.form.email='';
                this.form.institution = '';
                this.institutionSearch = '';
                this.$refs.institutionType.inputValue="";
                this.$emit('resetSearch');
            },
            selectOption: function (){
                this.form.institution = this.institutionSearch;
            },
            getInstitutions(query){
                let self = this;
                VAPI.get('/' + SERVICE_NAMES.INSTITUTION + '?name=' + query).then(response =>{
                        if (response.data.data){
                            self.institutions = response.data.data;
                        } else {
                            self.institutions = []
                        }
                    }
                ).catch(ex => {
                    console.log("Error trying to load institutions name", ex)
                })
            },
            loadUserTypes(array){
                VAPI.get(SERVICE_NAMES.USER_TYPE).then(response => {
                    let dataArray = response.data.data;
                    // load values inside array passed
                    let i=0;
                    for (i=0; i < dataArray.length; i++){
                        array.push({text: dataArray[i].type, value: dataArray[i].id});
                    }
                }).catch(e => {
                    console.info("An error has ocurred loading user type ", e);
                })
            }
        },

        watch: {
            institutionSearch: _.debounce(function(inst){this.getInstitutions(inst)}, 500)
        },

        created: function(){
            let self = this;
            self.loadUserTypes(self.userTypes);
        }
    }
</script>

<style lang="sass" scoped>
.buttons-search
    margin: 2% 2%
.buttons-container
    text-align: center
</style>
<style scoped>
    .row-margin {
        margin-top: 2%;
        display: flex;
    }
</style>
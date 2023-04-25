<template>
    <div class="container">
        <b-container class="container-form">
                <b-row>
                    <b-col md="6">
                        <b-form-group>
                            <vue-bootstrap-typeahead 
                                    :placeholder="$t('institutionAdmin.placeholderInstitution')"
                                    :data="institutions"
                                    v-model="institution.name"
                                    :min-matching-chars="1"
                                    ref="institutionAutocomplete"
                            ></vue-bootstrap-typeahead>
                        </b-form-group>
                    </b-col>
                    <b-col md="6">
                        <b-form-group>
                            <b-form-select :options="stateOptions" v-model="institution.state" />
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row align-v="center">
                    <b-col md="6">
                        <b-form-group>
                            <b-form-input :placeholder="$t('institutionAdmin.placeholderDomian')"
                                        id="idDominio"
                                        v-model="institution.domain" />
                        </b-form-group>
                    </b-col>
                    <b-col md="6">
                        <b-row>
                            <b-col align="center">
                                <sipsder-btn :text="$t('institutionAdmin.searchBtn')" @onClick="search" btnType="search">
                                </sipsder-btn>
                            </b-col>
                            <b-col align="center">
                                <sipsder-btn :text="$t('institutionAdmin.clearBtn')" @onClick="clear" btnType="clean">
                                </sipsder-btn>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>

        </b-container>
    </div>
</template>

<script>
    import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
    import VAPI from '../../../http_common'
    import { HTTP_STATUS, SERVICE_NAMES } from "../../../sipsder_constants";

    export default {
        name: "InstitutionSearcher",
        components: {
            VueBootstrapTypeahead
        },
        data() {
            return {
                stateOptions: [
                    {
                        value: null,
                        text: this.$t("institutionAdmin.placeholderStatus")
                    },
                    {
                        value: true,
                        text: this.$t("institutionAdmin.statusActive")
                    },
                    {
                        value: false,
                        text: this.$t("institutionAdmin.statusInactive")
                    }
                ],
                institution: {
                    name: "",
                    domain: "",
                    state: null
                },
                institutions: []

            }
        },
        created(){
            VAPI.get(SERVICE_NAMES.INSTITUTION + '?unpaged').then(response => {
                if (response.status === HTTP_STATUS.OK && response.data.data) {
                    this.institutions = response.data.data.map(inst => inst.name);
                }
            }).catch(e => console.error("Error trying to load institutions name", e));
        },
        methods: {
            search() {
                const instFilter = Object.fromEntries(
                    Object.entries(this.institution)
                        .filter(v => v[1] !== null && v[1] !== "")
                        .map(v => [v[0], encodeURI(v[1])])
                    )
                if (instFilter.domain) {
                    instFilter.domain = instFilter.domain.replace("@", "")
                }
                this.$emit("searchEvent", instFilter)
            },
            clear() {
                this.institution = {
                    name: "",
                    domain: "",
                    state: null
                };
                this.$refs.institutionAutocomplete.inputValue = "";
                this.$emit("clearEvent");
            },
        },
    }
</script>

<style scoped>
    .col-center {
        margin-left: 2%;
        text-align: center;
    }
</style>
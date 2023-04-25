<template>
    <div class="container">
        <b-container>
            <b-form class="form-group required">
                <b-row>
                    <b-col cols="6">
                        <b-row>
                            <b-col cols="3" sm="12"><label class="control-label">{{$t("audiovisual_media.ResourceDescriptionForm.title")}}</label>
                            </b-col>
                            <b-col>
                                <b-form-input v-validate="'required|max:80'" :disabled="resourceDescription.id!==-1"
                                              name="Title" v-model="resourceDescription.title"></b-form-input>
                                <span class="error">{{errors.first("Title")}}</span>
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col>
                        <b-row>
                            <b-col cols="3" sm="12"><label class="control-label">{{$t("audiovisual_media.ResourceDescriptionForm.source")}}</label>
                            </b-col>
                            <b-col>
                                <b-form-input v-validate="'required|max:150'" :disabled="resourceDescription.id!==-1"
                                              name="Source" v-model="resourceDescription.source"></b-form-input>
                                <span class="error">{{errors.first("Source")}}</span>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
                <b-row class="row-padding">
                    <b-col cols="6">
                        <b-row>
                            <b-col cols="3" sm="12"><label class="control-label">{{$t("audiovisual_media.ResourceDescriptionForm.author")}}</label>
                            </b-col>
                            <b-col>
                                <b-form-input v-validate="'required|max:120'" :disabled="resourceDescription.id!==-1"
                                              name="Author" v-model="resourceDescription.author"></b-form-input>
                                <span class="error">{{errors.first("Author")}}</span>
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col>
                        <b-row>
                            <b-col sm="12"><label class="control-label">{{$t("audiovisual_media.ResourceDescriptionForm.description")}}</label>
                            </b-col>
                            <b-col>
                                <b-form-input v-validate="'required|max:280'" name="Description"
                                              :disabled="resourceDescription.id!==-1"
                                              v-model="resourceDescription.description"></b-form-input>
                                <span class="error">{{errors.first("Description")}}</span>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </b-form>
        </b-container>
    </div>
</template>

<script>
    export default {
        name: "ResourceDescriptionForm",
        props: {
            resourceDescription: {
                type: Object,
                default: {
                    id: -1,
                    title: '',
                    url: '',
                    author: '',
                    source: '',
                    description: '',
                    status: true,
                    type: {
                        id: 0
                    }
                }
            },
        },
        data() {
            return {
                validation: false
                // resource description object
                // resourceDescription:{
                //     id: -1,
                //     title: '',
                //     url: '',
                //     author: '',
                //     source: '',
                //     description: '',
                //     status: true,
                //     type: {
                //         id: 0
                //     }
                // }

            }
        },
        methods: {
            clearValidationResults() {
                this.$validator.errors.clear();
                this.$validator.reset();
            },
            getValidateResults() {
                return this.$validator.validateAll();
            },

            getResourceDescription() {
                return this.resourceDescription;
            }
        }
    }
</script>

<style scoped>
    .form-group.required .control-label:after {
        content: "*";
        color: red;
    }

    .error {
        color: red;
    }

    .row-padding {
        margin-top: 2%;
    }
</style>
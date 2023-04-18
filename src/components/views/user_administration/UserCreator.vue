<template>
    <div class="container">
        <!--<h4 align="center">{{$t("userAdmin.createUserForm.title")}}</h4>-->
        <b-form @onSubmit="onSubmit" @onReset="onReset">
            <b-form-group>
                <b-row>
                    <b-col>
                        <b-form-input id="idSearchUser"
                                      type="text"
                                      :placeholder="$t('userAdmin.createUserForm.userPlaceholder')"
                                      v-model="create.user">
                        </b-form-input>
                    </b-col>
                    <b-col>
                        <b-form-select id="idSelectState"
                                       :options="states"
                                       v-model="create.state">
                        </b-form-select>
                    </b-col>
                </b-row>
                <b-row class="row-margin">
                    <b-col>
                    </b-col>
                    <b-col>
                        <b-form-select id="idUserT"
                                       :options="userTypes"
                                       v-model="create.userType">
                        </b-form-select>
                    </b-col>
                </b-row>
            </b-form-group>

            <div class="button-container">
                <sipsder-btn :text="$t('userAdmin.createUserForm.addBtn')"
                             btnType="add"
                             @onClick="onSubmit"></sipsder-btn>
            </div>
        </b-form>

        <b-modal ref="warningModal"
                 :title = "$t('userAdmin.createUserForm.warningModalTitle')">
            {{$t("userAdmin.createUserForm.warningMessage")}}
        </b-modal>

    </div>
</template>

<script>
    export default {
        name: "UserCreator",
        data() {
            return {
                create: {
                    user: '',
                    state: null,
                    userType: null,
                },
                userTypes: [
                    {text: 'Tipo Usuario', value: null},
                    "Público Urbano", "Público Rural",
                    "Institucional academico",
                    "Institucional empresarial",
                    "Institucional gubernamental",
                    "Institucional SDP",
                    "Administrador"
                ],
                states: [
                    {text: "Estado", value: null},
                    "Activo",
                    "Inactivo"
                ]

            }
        },
        methods: {
            onSubmit: function () {
                this.$refs.warningModal.show();

            },
            onReset: function () {

            }
        }
    }
</script>

<style lang="sass" scoped>
.button-container
    text-align: center
    margin-top: 2%
</style>
<style scoped>
    .row-margin {
        margin-top: 2%;
        display: flex;
    }
</style>
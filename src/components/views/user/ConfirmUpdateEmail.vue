<template>
    <div id="rural_document">
        <b-container class="container-form">
            <sipsder-title :title="$t('email_update_confirmation.title')"
            ></sipsder-title>  
            <b-row>
                <b-col cols="12" v-if="confirm == status.OK" class="d-flex justify-content-center" >
                    <h2>{{$t('email_update_confirmation.correct_message')}}</h2>
                </b-col>
                <b-col cols="12" v-else-if="confirm == status.REJECT" class="d-flex justify-content-center" >
                    <h2>{{$t('email_update_confirmation.error_message')}}</h2>
                </b-col>
                <b-col cols="12" v-else class="d-flex justify-content-center" >
                    <h2>{{$t('email_update_confirmation.loading')}}</h2>
                </b-col>
                <b-col cols="12" class="d-flex justify-content-center" >
                    <sipsder-btn 
                            :text="$t('email_update_confirmation.redirectHome')"
                            btnType="accept"
                            @onClick="goHome()"
                    ></sipsder-btn>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import VAPI from '../../../http_common';
import { SERVICE_NAMES, HTTP_STATUS } from '../../../sipsder_constants';

export default {
    name: "ConfirmUpdateEmail",
    data: function() {
        return {
            status: {
                CARGANDO: 0,
                OK: 1,
                REJECT: 2,
            },
            confirm: 0,
        }
    },
    methods: {
        goHome(){
            this.$router.push({ name: 'Home'})
        }
    },
    async created() {
        var token = this.$route.query.token;
        this.confirm = this.status.CARGANDO;
        try {
            let path = `${SERVICE_NAMES.USER_REGISTRATION}/change-email?token=${token}`;
            let response = await VAPI.get(path);

            if (response.status == HTTP_STATUS.OK) {
                this.confirm = this.status.OK;
            } else {
                this.confirm = this.status.REJECT;
            }
            
        } catch (error) {
            this.confirm = this.status.REJECT;
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
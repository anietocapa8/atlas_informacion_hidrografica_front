<template>
    <div class="fluid-container">

        <div class="center-align">
            <h5>{{message}}</h5>
        </div>
        <b-row class="center-align">
            <b-col>
                <sipsder-btn :text="$t('institutionAdmin.yesBtn')"
                             btnType="accept"
                             @onClick="accept"></sipsder-btn>

            </b-col>
            <b-col>
                <sipsder-btn :text="$t('institutionAdmin.noBtn')"
                             btnType="cancel"
                             @onClick="decline"
                ></sipsder-btn>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    export default {
        name: "DeleteConfirm",
        props:{
          message:String
        },
        data(){
            return {
            }
        },
        methods:{
            accept:function () {
                this.$emit("acceptEvent");
            },
            decline:function () {
                this.$emit("declineEvent");
            }
        }
    }
</script>

<style scoped>
.center-align {
    text-align: center;
}
</style>
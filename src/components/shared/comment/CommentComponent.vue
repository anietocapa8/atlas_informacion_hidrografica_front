<template>
    <div class="comment-content">
        <h3 @click="show = !show" class="link-text">
            {{$t('comment.comments')}}
            <i class="fa fa-caret-right" v-if="!show"></i>
            <i class="fa fa-caret-down" v-if="show"></i>
        </h3>
        <div v-show="show">
            <b-row>
                <b-col cols="12" md="7">
                    {{getMessage}}
                </b-col>
                <b-col cols="12" md="5">
                     <b-form-group horizontal
                            :label-cols="4"
                            label-class="font-weight-bold"
                            :label="$t('comment.order_by')"
                    >
                        <b-form-select :options="options" v-model="selected"/>
                     </b-form-group>
                </b-col>
            </b-row>
            
            <b-row>
                <b-col cols="12">
                    <comment-list :parentId="parentId" :mxDepth="mxDepth" 
                            :typeParent="typeParent" :pageSize="pageSize"
                            :sortBy="selected" 
                            >
                    </comment-list>
                </b-col> 
            </b-row>
        </div>
    </div>
</template>

<script>
import CommentList from "./CommentList.vue"
export default {
    props : {
        message: {
            type: String,
            default: undefined,
        },
        mxDepth :{
            type: Number,
            default: 1,
        },
        parentId:  {
            type: Number,
            required: true,
        },
        typeParent : {
            type: String,
            required: true,
        },
        pageSize : {
            type: Number,
            default: 10,
        },
        show :{
            type: Boolean,
            default: true,
        }
    },
    data() {
        return {
            selected : "creationDate",
            options: [
                {text: this.$t("comment.options.date"), value: "creationDate"},
                {text: this.$t("comment.options.popular"), value: "cntLikes"},
                {text: this.$t("comment.options.commented"), value: "cntAns"}
            ]
        }
    },
    components: {
        CommentList,
    },
    computed: {
        getMessage() {
            let msg = this.$t('comment.defaultMsg');
            if (this.message) {
                msg = this.message;
            }
            return msg;
        },
    }
}
</script>

<style lang="scss" scoped>
.comment-content {
    font-size: 17px;
}

.link-text {
    cursor: pointer;
    &:hover {
        color: rgb(9, 114, 156);
    }
}
</style>



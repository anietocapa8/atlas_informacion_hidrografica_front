<template>
    <div class="container-list-comment" v-if="depth <= mxDepth" :class="{'container-border': depth==0}">
        <b-row  :style="indent" >
            <b-col cols="12" v-if="haveUser">
                <b-row v-if="depth <= mxDepth" :style="indent" >
                    <h3 class="comment-list-text comment-link" @click="activeForm= true">{{ depthTextLink }}</h3>
                </b-row>
                <b-row>
                    <b-col cols="11" v-if="activeForm" class="form-col-comment">
                        <comment-form  :parentId="parentId" 
                            :typeParent="depthParent" @addToList="addToList">
                        </comment-form>
                    </b-col>
                    <b-col cols="1" class="form-col-cancel">
                        <!-- <i class="fas fa-times icon-cancel comment-link" v-if="activeForm" @click="activeForm= false"></i> -->
                        <sipsder-btn v-if="activeForm" btnType="cancel" text="" @onClick="activeForm= false"></sipsder-btn>
                    </b-col>
                </b-row>
                <hr>
            </b-col>
        </b-row>
        
        <b-row :style="indent">
            <b-col v-if="comments.length > 0">
                <h2 class="comment-list-text">{{ depthText }}</h2>
                <hr/>
            </b-col>
        </b-row>
        
        <b-row :style="indent">
            <b-col cols="12">
                <div v-for="cmt in comments" :key="cmt.id">
                    <div >
                        <comment-tx  :comment="cmt" >
                        </comment-tx>
                    </div>
                    <div >
                        <comment-list :depth="depth + 1" :mxDepth="mxDepth"
                                :parentId="cmt.id" typeParent="comment">
                        </comment-list>
                    </div>
                </div>
                <span class="comment-link msg-text" @click="loadMore" v-if="this.metaQuery.totalElements > 0">
                    {{viewMoreMsg}}
                </span>
                <hr>
            </b-col>
        </b-row>
        <hr v-if="depth == 0"/>
    </div>    
</template>

<script>
import SipsderComment from "./Comment.vue"
import CommentForm from "./CommentForm.vue"
import VAPI from '@/http_common'
import { SERVICE_NAMES } from '../../../sipsder_constants';

export default {
    name: 'comment-list',
    props: {
        sortBy: {
            type: String,
            default: "creationDate"
        },
        depth : {
            type: Number,
            default: 0,
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
        }
    },
    data() {
        return {
            comments: [],
            auxComments: [],
            page : 0,
            activeForm : false,
            metaQuery : {},
        }
    },
    created() {
        let query;
        let minSz = 1;
        if (!this.parentId || this.parentId === undefined) 
            return;
        query = this.queryNextPage();
        if (this.depth == 0) {
            minSz = 5;
        }

        VAPI.get(query).then(response => {
            this.auxComments.push.apply(this.auxComments, response.data.data);

            if (this.auxComments.length <= minSz) {
                this.comments = this.auxComments;
                this.page = 1;
            } else {
                this.comments.push.apply(this.comments, this.auxComments.slice(0, minSz));
            }

            this.metaQuery = response.data.meta;
            
        }).catch(error => {
            console.log("Error al obtener comentarios:", error);
        });
    },
    components : {
        "comment-tx" : SipsderComment,
        "comment-form" : CommentForm,
    },
    computed: {
        haveUser () {
            let isLogged = false;
            let user = this.$store.getters.getCurrentUser;
                
            if (user) {                
                isLogged = true;
            }
            
            return isLogged;
        },
        depthText() {
            var text = this.$t('comment.comments');
            if (this.depth > 0) {
                text = this.$t('comment.replies');
            }
            return text;
        },
        depthTextLink() {
            var text = this.$t('comment.comment');
            if (this.depth > 0) {
                text = this.$t('comment.reply');
            }
            return text;
        },
        depthParent() {
            var typeParent = this.typeParent;
            if (this.depth > 0) {
                typeParent = 'comment';
            }
            return typeParent;
        },
        indent() {
            return { 'margin-left': `${this.depth * 10}px` };
        },
        viewMoreMsg() {
            let nextCnt = Math.min(this.pageSize, 
                Math.max(this.metaQuery.totalElements, this.comments.length - this.metaQuery.totalElements) );
            
            let msg = "";
            if (this.comments.length < this.metaQuery.totalElements) {
                msg = this.$t('comment.viewMore')
                .replace("#comentMesage", nextCnt + " " + this.depthText)
                .replace("#numComments", this.metaQuery.totalElements);
            }
            return msg;
        }
    },
    methods: {
        addToList(comment) {
            this.comments.unshift(comment);
            
        },
        loadMore () {
            if (this.page == 0) {
                this.comments = this.auxComments;
                this.auxComments = [];
                this.page += 1;
            } else {
                let query = this.queryNextPage();
                
                VAPI.get(query).then(response => {
                    this.comments.push.apply(this.comments, response.data.data);
                    this.metaQuery = response.data.meta;
                    this.page += 1;
                }).catch(error => {
                    console.log("Error al obtener comentarios:", error);
                });
            }
        },
        queryNextPage() {
            let query = "";
            query = `/${SERVICE_NAMES.COMMENTS}/type/${this.typeParent}/parent/${this.parentId}?page=${this.page}&size=${this.pageSize}&sort=${this.sortBy},desc` ;
            return query;
        }
    },
    watch: {
        sortBy: function (newVal, oldVal) {
            if (newVal === oldVal) {
                return;
            }
            this.comments = [];
            this.auxComments = [];
            this.page = 0;
            this.activeForm = false;
            this.metaQuery = {};

            let query;
            let minSz = 1;
            if (!this.parentId || this.parentId === undefined) 
                return;
            query = this.queryNextPage();
            
            if (this.depth == 0) {
                minSz = 5;
            }

            VAPI.get(query).then(response => {
                this.auxComments.push.apply(this.auxComments, response.data.data);

                if (this.auxComments.length <= minSz) {
                    this.comments = this.auxComments;
                    this.page = 1;
                } else {
                    this.comments.push.apply(this.comments, this.auxComments.slice(0, minSz));
                }

                this.metaQuery = response.data.meta;
            }).catch(error => {
                console.log("Error al obtener comentarios:", error);
            });
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../../stylesheets/style.sass';
.container-border{
    border: 3px solid $colorTitle ;
    border-radius: 15px;
    padding: 15px;
}
.container-list-comment {
    background-color: #fff;
}
.comment-list-text {
    color: rgb(95, 89, 89);        
} 

.comment-link {
    cursor: pointer;
    &:hover {
        color: rgb(9, 114, 156);
    }
}

.msg-text {
    font-size: 14px;
}

.icon-cancel {
    margin-left: 0.5rem;
    font-size: 2rem;
    color: #ff0000;
    margin-top: 3px;
}

.form-col-comment {
    padding-right: 0px;
}
.form-col-cancel {
    padding-left: 0rem;
}

</style>

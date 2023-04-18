<template>
    <div>
        <b-row>
            <span v-b-tooltip.hover :title="$t('score_comment.like')">
                <b-col class="d-flex">
                    <b-button @click="likeFunc" ref="likeBtn">
                        <i class="far fa-thumbs-up"></i>
                    </b-button>
                    <span class="num-label">{{myLikes}}</span>
                </b-col>
            </span>
            <span v-b-tooltip.hover :title="$t('score_comment.dislike')">
                <b-col class="d-flex">
                    <b-button @click="dislikeFunc" ref="dislikeBtn">
                        <i class="far fa-thumbs-down"></i>
                    </b-button>
                    <span class="num-label">{{myDislikes}}</span>
                    <!-- <b-tooltip target="likeBtn" :title="$t('score_comment.dislike')"></b-tooltip> -->
                </b-col>
            </span>
        </b-row>

        <!--notLoggedModal -->
        <b-modal ref="notLoggedModal"
                 :title="$t('score_comment.notLoggedModal.title')"
                 :hide-footer="true"
        >
            {{$t('score_comment.notLoggedModal.message')}}
            <br>
            <sipsder-btn :text="$t('score_comment.notLoggedModal.buttonText')"
                         @onClick="hideModal"
                         btnType="accept"
            ></sipsder-btn>

        </b-modal>
    </div>
</template>

<script>
    import VAPI from '../../http_common';
    import {SERVICE_NAMES, SCORE_REPORT_ANSWER} from "../../sipsder_constants";
    import {PERMISSIONS_TYPES} from "../../domain_constants";

    export default {
        name: "ScoreComponent",
        props: {
            idContent: {
                type: Number,
                required: true
            },
            idType: {
                type: Number,
                required: true
            },
            likes : {
                type: Number,
                default: 0,
            },
            dislikes : {
                type: Number,
                default: 0,
            }
        },
        data() {
            return {
                scored: false,
                scoredVal : -1,
                myLikes : 0,
                myDislikes : 0,
                scoreObject: {
                    score: {
                        id: -1,
                        status: 0
                    },
                    type: this.idType,
                    contentId: this.idContent
                }
            }
        },

        methods: {
            hideModal() {
                this.$refs.notLoggedModal.hide();
            },
            likeFunc() {
                let self = this;
                if (this.logged && this.hasPermission) {
                    // save like
                    this.scoreObject.score.status = 1;
                    // verify if user already score the content
                    if (!this.scored || this.scoredVal != 1) {
                        
                        VAPI.post('/' + SERVICE_NAMES.SCORE, this.scoreObject).then(response => {

                            if (response.data) {
                                let new_score = response.data;
                                this.scored = true;
                                this.scoredVal = 1;
                                switch (new_score.answer) {
                                    case SCORE_REPORT_ANSWER.SAVED:
                                        this.myLikes += 1;
                                        break;
                                    case SCORE_REPORT_ANSWER.UPDATED:
                                        this.myLikes += 1;
                                        this.myDislikes -= 1;
                                        break;
                                    case SCORE_REPORT_ANSWER.NO_CHANGE:
                                        break;
                                }

                            }
                            
                        }).catch(ex => {
                            console.log("Fail with error " + ex.toString());
                        });
                    }
                }
                else {
                    // show modal
                    this.$refs.notLoggedModal.show();
                }
            },
            dislikeFunc() {
                let self = this;
                if (this.logged && this.hasPermission) {
                    // save like
                    this.scoreObject.score.status = 0;
                    // verify if user already score the content
                    if (!this.scored || this.scoredVal != 0) {
                        
                        VAPI.post('/' + SERVICE_NAMES.SCORE, this.scoreObject).then(response => {

                            if (response.data) {
                                let new_score = response.data;
                                this.scored = true;
                                this.scoredVal = 0;
                                switch (new_score.answer) {
                                    case SCORE_REPORT_ANSWER.SAVED:
                                        this.myDislikes += 1;
                                        break;
                                    case SCORE_REPORT_ANSWER.UPDATED:
                                        this.myLikes -= 1;
                                        this.myDislikes += 1;
                                        break;
                                    case SCORE_REPORT_ANSWER.NO_CHANGE:
                                        break;
                                }

                            }
                            
                            
                        }).catch(ex => {
                            console.log("Fail with error " + ex.toString());
                        });
                    }
                }
                else {
                    // show modal
                    this.$refs.notLoggedModal.show();
                }
            }
        },
        computed: {

            logged: function () {
                return this.$store.getters.isAuthenticated;
            },
            hasPermission: function() {
                return this.$store.getters.hasPermission(PERMISSIONS_TYPES.PARTICIPATE);
            }
        },
        mounted() {
            let self = this;
            this.myLikes = this.likes;
            this.myDislikes = this.dislikes;
        }
    }
</script>

<style scoped>
    .num-label {
        padding-left: 3px; 
        font-weight: 700;
    }
</style>

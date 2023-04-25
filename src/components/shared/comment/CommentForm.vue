<template>
  <div class="comment-box">
        <b-form method="post" @submit.prevent="submit">
            <div class="loader" v-show="loading" >
                <span class="fa fa-spinner"></span>  
            </div>
            <b-row class="row-comment">
                <b-col cols="11" class="text-area-comment">
                    <b-form-group
                    :invalid-feedback="errors.first('message')">
                        <b-form-textarea v-model="message" class="input-message" 
                                name="message"  rows="2"  :disabled="loading"
                                :data-vv-as="$t('comment.fieldText')"
                                v-validate="{required: true, max: 4000}"
                                :state="validateState(`message`)"
                                :placeholder="placeholderText" noResize required>
                        </b-form-textarea>
                    </b-form-group>   
                </b-col>
                <b-col cols="1" class="bnt-comment" style="text-align:right">
                    <sipsder-btn :disabled="loading" btnType="send" 
                            type="submit" text="">
                    </sipsder-btn>
                </b-col>
            </b-row>
        </b-form>
    </div>
</template>


<script>
import VAPI from "../../../http_common";
import { SERVICE_NAMES } from '../../../sipsder_constants';

export default {
    props: {
        parentId : {
            type: Number,
            required : true,
        },
        typeParent  : {
            type: String,
            required : true,
        },
    },
    data() {
        return {
            loading: false,
            message: "",
        }
    },
    computed: {
        placeholderText() {
            let text = this.$t('comment.writeComment');
            
            if (this.typeParent < 0) {
                text = this.$t('comment.writeReply');
            }

            return text;
        }
    },
    methods: {
        submit() {
            this.loading = true;
            // Save Comment
            let valid = this.validateState('message');
            if (!valid) {
                return;
            }
            
            let comment= {
                idParent : this.parentId,
                type : this.typeParent,
                comment: {
                    content: this.message.trim(),
                    status : true,
                }
            }
            
            let path = `/${SERVICE_NAMES.COMMENTS}`;
            VAPI.post(path, comment).then( (response) => {
                var newComment = response.data;
                
                this.loading = false;
                this.$emit('addToList', newComment);
                this.message = "";
                this.$validator.reset();
            }).catch(error => {
                
                if (error && error.response && error.response.status && error.response.status == 401)
                    alert("Usuario no autenticado");

                this.loading = false;
            });

        },

        validateState(name) {

            if (this.veeFields[name] && (this.veeFields[name].dirty || this.veeFields[name].validated)) {
                
                return !this.errors.has(name);
            }
            return null;
        },
    }
}
</script>

<style lang="scss" scoped>
.comment-box {
    padding-left: 1rem;

    .spinner {
        margin-top: 5em;
        z-index: 999;
        
    }

    .loader {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(255, 255, 255, 0.8);
        z-index: 2;
    }
}


.text-area-comment {
    padding-right: 0rem;
}

textarea.form-control {
    border-radius: 10px;
    border-width: 1.5px;
    border-color: #63bedc;
}

.bnt-comment {
    padding-left: 0rem;
    padding-right: 0rem;
}

</style>

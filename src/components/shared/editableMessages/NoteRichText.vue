<template>
    <div id="note">
        <div v-if="showEdition">
            <sipsder-btn btnType="edit_pen" :text="textPenEdition"
                @onClick="changeEditMode(true)"  v-if="!isEditMode"></sipsder-btn>
            <sipsder-btn btnType="cancel" 
                @onClick="editCancel()" v-if="isEditMode"></sipsder-btn>
            <sipsder-btn btnType="save"  
                @onClick="updateNote()" v-if="isEditMode"></sipsder-btn>
        </div>
        <rich-text-preview :content="note.content" v-if="!isEditMode"/>
        <rich-text v-model="note.content" v-if="isEditMode"/>
    </div>
</template>

<script>
import VAPI from '../../../http_common';
import RichText from '../../shared/RichText.vue';
import RichTextPreview from '../RichTextPreview';
import {SERVICE_NAMES, HTTP_STATUS} from "../../../sipsder_constants";

export default {
    name: "NoteRichText",
    components: {
        RichTextPreview,
        RichText,
    },
    props: {
        showEdition: {
            type: Boolean,
            default: false,
        },
        textPenEdition: {
            type: String,
            default: ""
        },
        //Modulo del cual se realiza la consulta, estos se pueden buscar en las constantes MODULES.
        module: {
            required: true,
        },
        keyVal: {
            required: true,
        }
    },
    data() {
        return {
            isEditMode: false,
            note: {
                content: "",
            },
            prevNote: null,
        }
    },
    methods: {
        editCancel() {
            this.changeEditMode(false);
            this.note = JSON.parse(JSON.stringify(this.prevNote));
        },
        changeEditMode(val) {
            this.isEditMode = val;
        },
        async updateNote() {
            let path = `/${SERVICE_NAMES.SIPSDER_NOTE}/update`;
            try {
                let response = await VAPI.put(path, this.note);
                if (response.status === HTTP_STATUS.OK) {
                    // this.note = response.data.data;
                    this.prevNote = JSON.parse(JSON.stringify(this.note));
                    this.changeEditMode(false);
                } else {
                    console.error("Error actualizando Nota.", response);    
                }
            } catch (e) {
                alert("Error actualizando Nota. ")
                console.error("Error actualizando Nota.", e);
            }

        }
    },
    async created() {
        try {
            let response = await VAPI.get( `/${SERVICE_NAMES.SIPSDER_NOTE}/${this.module}` );
            if (response.status == HTTP_STATUS.OK) {
                this.note = response.data.data.find(val => (val.key === this.keyVal));
                this.prevNote = JSON.parse(JSON.stringify(this.note));
            } else {
                console.log("Error consultando Notas.", response);
            }
        } catch (e) {
            alert("Problemas al cargas notas.");
            console.log("Error consultando Notas.", e);
        }
    }
}
</script>

<style lang="scss" scoped>

</style>

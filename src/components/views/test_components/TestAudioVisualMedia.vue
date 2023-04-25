<template>
    <div class="container">
        <b-container>
            <b-row>
                <b-col>Selected Image Title: {{selectedImage.title}}</b-col>
                <b-col>Selected Image Author: {{selectedImage.author}}</b-col>
            </b-row>
            <b-row>
                <b-col>Selected Image Source: {{selectedImage.source}}</b-col>
                <b-col>Selected Image Description: {{selectedImage.description}}</b-col>
            </b-row>
            <b-row>
                <b-img thumbnail fluid :src="selectedImage.url"></b-img>
            </b-row>
            <b-row>
                    <b-button @click="showModal">Abrir Modal</b-button>

            </b-row>

        </b-container>
        <b-modal
                title="Audiovisual Modal"
                ref="modal"
                :hide-footer="true"
                size="lg"
        >
            <audiovisual-index @selectEvent="selectionResponse" :popup="false"></audiovisual-index>
        </b-modal>
    </div>
</template>

<script>
    import AudiovisualIndex from '../../views/audiovisual_media/AudiovisualIndex'

    export default {
        name: "TestAudioVisualMedia",
        components: {
            AudiovisualIndex
        },
        data() {
            return {
                selectedImage: ''
            }
        },
        methods: {
            showModal() {
                this.$refs.modal.show();
            },
            selectionResponse(response) {
                this.selectedImage = response;
                this.$refs.modal.hide();
            }
        }
    }
</script>

<style scoped>
</style>
<template>
    <!-- Include stylesheet -->
    <div class="lab-rich">
            
        <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">

        
        <div id="editor" style="padding-top: 131px; z-index=1">
            <div  id="customToolbar"  >
                <select class="ql-size">
                <option value="small"></option>
                <option selected></option>
                <option value="large"></option>
                <option value="huge"></option>
                </select>
                <button class="ql-bold"></button>
                <button class="ql-link"></button>
                <button class="ql-image"></button>
                <button @click="TestFunction">Custom</button>
            </div>
            <vue-editor v-model="htmlForEditor" :editorToolbar="customToolbar" :editorOptions="editorSettings"></vue-editor>
        </div>
   
    </div>
    

</template>



<script>



import { VueEditor, Quill } from 'vue2-editor'

export default {


    data() {
           return {
                editor: null,
                container: null,
                options: null,
                toolbarOptions: null,
                customButton: null,
                htmlForEditor: null,
                content: '<h1>Html For Editor</h1>',
                customToolbar: null,
                setEditorContent: null,
                editorSettings: {
                    modules: {
                        history: { 
                        delay: 2000,
                        maxStack: 500,
                        userOnly: true,
                        },
                        toolbar: {
                            container: "#customToolbar",
                            handlers: {
                                customBtn: () => {
                                    this.htmlForEditor="custom button was clicked";
                                }
                            }
                        },
                    },
                },
            }  
        },
    methods: {
        TestFunction: function(){
            this.htmlForEditor += "hereee 2";
        }
    },

    mounted(){
          
    },
    components:{
         VueEditor
    }

    
}   
</script>

<style lang="sass" scoped>
      
</style>>
<template>
  <div class="editor-container">
    <vue-editor
      v-model="content"
      v-resize-quill
      :editor-options="settings"
      :editor-toolbar="options"
      @imageAdded="handleImageAdded"
      @image-added="handleImageAdded"
      @text-change="changeText"
      use-custom-image-handler
      :class="[{ 'min-height-fixed': fixedSize }]"
    />
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
// Quill modules
import ImageResize from "quill-image-resize-module";

// Setting quill modules
if (!Quill.imports.hasOwnProperty("modules/imageResize")) {
  Quill.register("modules/imageResize", ImageResize);
}

export default {
  data() {
    return {
      content: this.newContent ? this.newContent : this.value,
      settings: {
        modules: {
          imageResize: true,
        }
      }
    };
  },
  directives: {
    resizeQuill: {
      componentUpdated: el => {
        const toolbarHeight = el.children[0].offsetHeight;
        const containerHeight = el.parentElement.offsetHeight;
        if (containerHeight - toolbarHeight > 100) {
          const heightStyle = `calc(${containerHeight}px - ${toolbarHeight}px)`;
          el.children[1].style.height = heightStyle;
        }
      }
    }
  },
  watch: {
    newContent: function(val) {
      this.content = val;
    },
    value(value) {
      this.content = value;
    }
  },
  props: {
    value: {},
    fixedSize: {
      type: Boolean,
      default: false
    },
    newContent: {
      type: String,
      default: ""
    },
    options: {
      type: Array,
      default: () => [
        [{ font: [] }],
        [{ size: [] }],
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "video", "formula"],
        [
          { align: "" },
          { align: "center" },
          { align: "right" },
          { align: "justify" }
        ],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
      ]
    }
  },
  methods: {
    changeText() {
      this.$emit("changeValue", this.content);
      this.$emit("input", this.content);
    },
    handleImageAdded(file, editor, cursorLocation, resetUploader) {
      const reader = new FileReader();
      reader.onload = readerEvent => {
        const image = new Image();
        image.onload = imageEvent => {
          // Resize image
          const canvas = document.createElement("canvas"),
            MAX_SIZE = 1280;
          let width = image.width,
            height = image.height;
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (width <= height && height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(image, 0, 0, width, height);
          let url = canvas.toDataURL("image/jpeg");
          editor.insertEmbed(cursorLocation, "image", url);
          resetUploader();
        };
        image.src = readerEvent.target.result;
      };
      reader.readAsDataURL(file);
    }
  },
  components: {
    VueEditor
  }
}
</script>

<style lang="sass">
  .editor-container
    .ql-container
      .ql-editor
        padding: 12px 15px
        overflow-y: auto
        line-height: 1.42
        height: 250px
  .min-height-fixed
    min-height: 300px
</style>
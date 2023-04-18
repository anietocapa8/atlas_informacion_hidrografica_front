<template>
  <div v-if="modal">
    <b-modal
      ref="modal"
      :title="modal.text.title"
      v-model="show"
      :hide-header-close="modal.value.nonClosable"
      :no-close-on-esc="modal.value.nonClosable"
      :no-close-on-backdrop="modal.value.nonClosable"
      hide-footer
      @hidden="$emit('closed')"
    >
      <div class="modal-msg text-center" v-html="modal.text.message"/>
      <b-row class="text-center">
        <b-col>
          <sipsder-btn btnType="accept" @onClick="modal.value.onAccept"/>
        </b-col>
        <b-col v-if="modal.value.cancelable">
          <sipsder-btn btnType="cancel" @onClick="modal.value.onCancel"/>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>


<script>
export default {
  props: {
    modals: Object,
    activeModalName: String,
    i18n: String
  },
  data() {
    return {
      show: false,
      modal: {
        text: {
          title: "",
          message: ""
        },
        value: {
          nonClosable: true,
          cancelable: true,
          onAccept: () => {},
          onCancel: () => (this.activeModalName = false)
        }
      }
    };
  },
  computed: {},
  watch: {
    activeModalName(name) {
      if (name) {
        // Sets modal fields
        for (let field in this.modal.value)
          if (this.modals[name].hasOwnProperty(field))
            this.modal.value[field] = this.modals[name][field];
        // Sets modal
        const nameSnakeCase = name
          .split(/(?=[A-Z])/)
          .join("_")
          .toLowerCase();
        for (let field in this.modal.text) {
          if (this.modals[name].hasOwnProperty(field))
            this.modal.text[field] = this.modals[name][field];
          else {
            let i18nField = this.i18n + "." + nameSnakeCase + "_" + field;
            this.modal.text[field] = this.$t(i18nField);
            if (i18nField === this.modal.text[field]) {
              i18nField = "modal." + nameSnakeCase + "_" + field;
              this.modal.text[field] = this.$t(i18nField);
              if (i18nField === this.modal.text[field]) {
                i18nField = "modal." + field;
                this.modal.text[field] = this.$t(i18nField);
              }
            }
          }
        }
        this.show = true;
      } else {
        this.show = false;
      }
    }
  }
};
</script>


<style lang="scss" scoped>
</style>
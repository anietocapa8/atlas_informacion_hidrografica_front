<template>
  <div class="container container-form">
    <b-container>
      <sipsder-title
        :title="$t('institutionAdmin.title').toUpperCase()"
        type="admin"
        section="configuration"
      ></sipsder-title>
      <institution-searcher @searchEvent="searchMade" @clearEvent="clearName" ref="searcherRef" />
      <b-row align-v="center" class="mt-3">
        <b-col md="4" offset-md="4">
          <h4
            align="center"
            v-if="!searchActionMade"
          >{{$t("institutionAdmin.tableTitle").toUpperCase()}}</h4>
          <h4 align="center" v-else>{{$t("institutionAdmin.searchTitle").toUpperCase()}}</h4>
        </b-col>
        <b-col md="4" class="right-button-container">
          <sipsder-btn
            btnType="add"
            v-b-modal.idInstRegistradas
            :text="$t('institutionAdmin.addInstitutionBtn')"
            @onClick="createInst"
          />
        </b-col>
      </b-row>
      <div id="Table">
        <filter-table
          :options-table="options_table"
          :perPage="InstitutionsQuery['size']"
          :items="items"
          @action="action($event)"
          :externalQuery="InstitutionsQuery"
          :fields="fields_in"
        ></filter-table>
      </div>
      <div class="button-container">
        <sipsder-btn btnType="back" @onClick="$router.go(-1)"></sipsder-btn>
      </div>

      <b-modal
        ref="successModal"
        :title="$t('institutionAdmin.successSaveModal.title')"
        :hide-footer="true"
        @hidden="refreshTable"
      >
        {{$t("institutionAdmin.successSaveModal.message")}}
        <sipsder-btn
          :text="$t('institutionAdmin.successBtn')"
          btnType="accept"
          @onClick="hideModal"
        ></sipsder-btn>
      </b-modal>

      <b-modal ref="AddDomainModal">
        <add-domain />
      </b-modal>
    </b-container>
  </div>
</template>

<script>
import InstitutionSearcher from "./InstitutionSearcher";
import InstitutionFormAdmin from "./InstitutionFormAdmin";
import AddDomain from "./AddDomain";
import FilterTable from "../../shared/FilterTable";
import DeleteConfirm from "./DeleteConfirm";
export default {
  name: "InstitutionAdmin",
  data() {
    return {
      searchActionMade: false,
      items: "getInstitutions",
      options_table: {
        detail: {
          id: 0,
          class: "btn-success",
          label: "",
          icon: "edit_pen"
        }
      },
      id: undefined,
      size: 5,
      fields_in: [
        {
          key: "instName",
          label: this.$t("institutionAdmin.tableInstitution"),
          sortable: true,
          sortDirection: "asc"
        },
        {
          key: "userTypeName",
          label: this.$t("institutionAdmin.tableUserType"),
          sortable: true,
          sortDirection: "desc"
        },
        {
          key: "statusName",
          label: this.$t("institutionAdmin.tableStatus"),
          sortable: true
        },
        {
          key: "creationDate",
          label: this.$t("institutionAdmin.tableCreationDate"),
          sortable: true
        },
        {
          key: "lastModifiedDate",
          label: this.$t("institutionAdmin.tableLastModifiedDate"),
          sortable: true
        },
        {
          key: "actions",
          label: this.$t("institutionAdmin.tableActions")
        }
      ],
      sort: "name,asc",
      InstitutionsQuery: {
        size: this.size
      },

      domainDetail: {},
      showInstReg: false
    };
  },
  methods: {
    searchMade(form) {
      this.searchActionMade = true;
      this.InstitutionsQuery = {
        ...form,
        drop: true,
        size: this.size
      };
    },
    goToForm() {
      this.$store
        .dispatch("getInstitution", this.id)
        .then(() => this.$router.push({ name: "InstitutionFormAdmin" }));
    },
    hideModal() {
      this.id = undefined;
      this.$refs.instForm.clearStatus();
      this.$refs.successModal.hide();
      if (this.searchActionMade) {
        this.$refs.searcherRef.search();
      }
    },
    cancelModal() {
      this.id = undefined;
      this.$refs.instForm.clearStatus();
      this.$refs.modal.hide();
    },
    clearName() {
      this.InstitutionsQuery = {
        drop: true,
        size: this.size
      };
      this.searchActionMade = false;
    },
    refreshTable() {
      if (this.searchActionMade) {
        this.$refs.searcherRef.search();
      } else {
        this.InstitutionsQuery = {
          drop: true,
          size: this.size
        };
        this.searchActionMade = false;
      }
    },
    saveSuccess() {
      this.$refs.instForm.clearStatus();
      if (!this.searchActionMade) {
        this.InstitutionsQuery = {
          drop: true,
          size: this.size
        };
      } else {
        this.$refs.searcherRef.search();
      }
      this.$refs.modal.hide();
      // show success modal
      this.$refs.successModal.show();
    },
    showModal() {
      this.$refs.instForm.loadUserType();
    },
    createInst() {
      this.id = undefined;
      this.goToForm();
    },
    action(index) {
      switch (index.id) {
        case 0:
          this.domainDetail = index.item;
          this.id = index.item.id;
          // call method inside
          //this.$refs.modal.loadData(this.id);
          this.goToForm();
          break;
      }
    }
  },
  components: {
    InstitutionSearcher,
    InstitutionFormAdmin,
    AddDomain,
    FilterTable,
    DeleteConfirm
  },
  mounted() {
    this.clearName();
  }
};
</script>

<style lang="sass" scoped>
    .button-container
        text-align: center
    .right-button-container
        text-align: right
</style>
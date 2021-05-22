<template>
  <layout-content
    page-title="Configuraciones"
    v-loading="pageloading"
    :breadcrumb="[
      { name: 'Clientes', to: '/customers' },
      { name: 'Configuraciones', to: null },
    ]"
  >
    <el-form
      label-position="top"
      :model="integrationSettingForm"
      ref="integrationSettingForm"
      @submit.native.prevent="
        submitSettingsIntegrations(
          'integrationSettingForm',
          integrationSettingForm
        )
      "
    >
      <el-tabs
        v-model="tab"
        @tab-click="
          $router
            .replace({
              path: `/customers/settings`,
              query: { tab },
            })
            .catch(() => {})
        "
      >
        <el-tab-pane
          label="Integraciones"
          name="integrations"
          class="space-y-2"
        >
          <Notification
            class="w-full"
            type="info"
            title="Integraciones"
            message="En esta sección se realizan las configuraciones de integración con otros modulos de manera general. Estas configuraciones se aplicarán a todos los servicios que no tengan una configuración individual."
          />
          <div class="grid grid-cols-12 gap-4">
            <el-form-item label="Seleccione una cuenta" class="col-span-4">
              <el-select
                v-model="integrationSettingForm.accountingCatalog"
                placeholder="Ingrese el codigo o nombre de la cuenta"
                size="small"
                clearable
                filterable
                remote
                class="w-full"
                default-first-option
                :remote-method="findAccount"
              >
                <el-option
                  v-for="c in filteredCatalog"
                  :key="c.id"
                  :label="`${c.code}-${c.name}`"
                  :value="c.id"
                  :disabled="c.isParent == true"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-tab-pane>

        <div class="flex justify-end">
          <el-button type="primary" size="small" native-type="submit"
            >Guardar</el-button
          >
          <el-button size="small" @click="$router.push('/customers')"
            >Cancelar</el-button
          >
        </div>
      </el-tabs>
    </el-form>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";

export default {
  name: "CustomerSettings",
  components: { LayoutContent, Notification },
  fetch() {
    const catalog = () => this.$axios.get("/entries/catalog");
    const settingIntegration = () =>
      this.$axios.get("/customers/setting/integrations");
    Promise.all([catalog(), settingIntegration()])
      .then((res) => {
        const [catalog, settingIntegration] = res;
        this.catalogs = catalog.data.accountingCatalog;
        this.integrationSettingForm.accountingCatalog =
          settingIntegration.data.integrations.catalog;
        this.filteredCatalog = this.catalogs.filter(
          (c) => c.id == this.integrationSettingForm.accountingCatalog
        );
        this.pageloading = false;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message
          ? err.response.message
          : "Comunicate con el adminstrador del Sistema";
      });
  },
  fetchOnServer: false,
  data() {
    return {
      pageloading: true,
      cogInfo: "",
      catalogs: [],
      filteredCatalog: [],
      tab: "integrations",
      integrationSettingForm: {
        accountingCatalog: "",
      },
    };
  },
  methods: {
    async fetchSettingCustumerIntegration() {
      const { data } = await this.$axios.get("/customers/setting/integrations");
      this.pageloading = false;
      this.integrationSettingForm.accountingCatalog = data.integrations.catalog;
    },
    findAccount(query) {
      if (query !== "") {
        this.$axios
          .get("entries/catalog", { params: { search: query.toLowerCase() } })
          .then((res) => {
            this.filteredCatalog = res.data.accountingCatalog;
          })
          .catch((err) => (this.errorMessage = err.response.data.message));
      } else {
        this.filteredCatalog = [];
      }
    },
    submitSettingsIntegrations(formName, { accountingCatalog }) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$confirm(
          "¿Estás seguro que deseas guardar esta configuración?",
          "Confirmación",
          {
            confirmButtonText: "Si, guardar",
            cancelButtonText: "Cancelar",
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "Procesando...";
                this.$axios
                  .put("/customers/setting/integrations", {
                    accountingCatalog,
                  })
                  .then((res) => {
                    this.$notify.success({
                      title: "Exito",
                      message: res.data.message,
                    });
                    this.pageloading = true;
                    this.filteredCatalog = [];
                    this.fetchSettingCustumerIntegration();
                  })
                  .catch((err) => {
                    this.$notify.error({
                      title: "Error",
                      message: err.response.data.message,
                    });
                  })
                  .then((alw) => {
                    instance.confirmButtonLoading = false;
                    instance.confirmButtonText = "Si, guardar";
                    done();
                  });
              } else {
                done();
              }
            },
          }
        );
      });
    },
  },
};
</script>
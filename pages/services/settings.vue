<template>
  <layout-content
    page-title="Configuraciones"
    :breadcrumb="[
      { name: 'Servicios', to: '/services' },
      { name: 'Configuraciones', to: null },
    ]"
  >
    <el-tabs
      v-model="tab"
      @tab-click="
        $router
          .replace({
            path: `/services/settings`,
            query: { tab },
          })
          .catch(() => {})
      "
    >
      <el-tab-pane label="Integraciones" name="integrations" class="space-y-2">
        <Notification
          class="w-full"
          type="info"
          title="Integraciones"
          message="En esta sección se realizan las configuraciones de integración con otros modulos de manera general. Estas configuraciones se aplicarán a todos los servicios que no tengan una configuración individual."
        />
        <el-form
          label-position="top"
          :model="integrationSettingForm"
          :rules="integrationSettingFormRuler"
          ref="integratioSettingForm"
          @submit.native.prevent="
            submitSettingsIntegrations(
              'integratioSettingForm',
              integrationSettingForm
            )
          "
        >
          <div class="flex flex-col space-y-2">
            <div class="grid grid-cols-12 gap-4">
              <el-form-item
                label="Seleccione una cuenta"
                class="col-span-4"
                prop="accountingCatalog"
              >
                <el-select
                  v-model="integrationSettingForm.accountingCatalog"
                  size="small"
                  class="w-full"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="c in catalogs"
                    :key="c.id"
                    :label="c.name"
                    :value="c.id"
                    :disabled="c.isParent == true"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="flex flex-row justify-end">
            <el-button type="primary" size="small" native-type="submit"
              >Guardar</el-button
            >
            <el-button size="small" @click="$router.push('/services')"
              >Cancelar</el-button
            >
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
import { getIcon, hasModule, selectValidation } from "../../tools";

export default {
  name: "ServiceSettings",
  components: { LayoutContent, Notification },
  fetch() {
    this.$axios.get("/services/setting/integrations").then(({ data }) => {
      const catalog = () => this.$axios.get("/entries/catalog");
      Promise.all([catalog()]).then((res) => {
        const [catalog] = res;
        this.catalogs = catalog.data.accountingCatalog;
        this.integrationSettingForm.accountingCatalog =
          data.integrations.catalog;
        this.pageloading = false;
      });
    });
  },
  fetchOnServer: false,
  data() {
    return {
      tab: "integrations",
      catalogs: [],
      integrationSettingForm: {
        accountingCatalog: "",
      },
      integrationSettingFormRuler: {
        accountingCatalog: selectValidation(true),
      },
    };
  },
  methods: {
    async fetchSettingServicesIntegration() {
      const { data } = await this.$axios.get("/services/setting/integrations");
      this.pageloading = false;
      this.integrationSettingForm.accountingCatalog = data.integrations.catalog;
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
                  .put("/services/setting/integrations", {
                    accountingCatalog,
                  })
                  .then((res) => {
                    this.$notify.success({
                      title: "Exito",
                      message: res.data.message,
                    });
                    this.pageloading = true;
                    this.fetchSettingServicesIntegration();
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
                instance.confirmButtonLoading = false;
                instance.confirmButtonText = "Si, guardar";
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

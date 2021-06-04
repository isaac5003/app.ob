<template>
  <layout-content
    v-loading="pageloading"
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
      <el-tab-pane label="Integraciones" name="integrations" class="space-y-2" v-if="hasModule()">
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
                  placeholder="Ingrese el codigo o el  Nombre de la cuenta"
                  size="small"
                  :loading="loadingAccount"
                  remote
                  class="w-full"
                  clearable
                  filterable
                  default-first-option
                  :remote-method="findAccount"
                  @focus="filteredCatalog = []"
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
import { getIcon, hasModule, selectValidation, parseErrors} from "../../tools";

export default {
  name: "ServiceSettings",
  components: { LayoutContent, Notification },
  fetch() {
    const catalog = () => this.$axios.get("/entries/catalog");
    const settingIntegration = () =>
      this.$axios.get("/services/setting/integrations");
    Promise.all([catalog(), settingIntegration()])
      .then((res) => {
        const [catalog, settingIntegration] = res;
        this.catalogs = catalog.data.data;
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
      loadingAccount: false,
      pageloading: true,
      tab: "integrations",
      catalogs: [],
      filteredCatalog: [],
      integrationSettingForm: {
        accountingCatalog: "",
      },
      integrationSettingFormRuler: {
        accountingCatalog: selectValidation(true),
      },
    };
  },
  methods: {
    findAccount(query) {
      if (query !== "") {
        this.loadingAccount = true;
        this.$axios
          .get("entries/catalog", { params: { search: query.toLowerCase() } })
          .then((res) => {
            this.filteredCatalog = res.data.data;
            this.loadingAccount = false;
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
                  .put("/services/setting/integrations", {
                    accountingCatalog,
                  })
                  .then((res) => {
                    this.$notify.success({
                      title: "Exito",
                      message: res.data.message,
                    });
                    this.pageloading = false;
                  })
                .catch((err) => {
                    this.$notify.error({
                      title: "Error",
                      dangerouslyUseHTMLString: true,
                      message:parseErrors(err.response.data.message),
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
       hasModule() {
      return hasModule(["f6000cbb-1e6d-4f7d-a7cc-cadd78d23076"], this.$auth.user);
    },
  },
};
</script>

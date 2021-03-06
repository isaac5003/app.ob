 <template>
  <layout-content
    v-loading="pageloading"
    page-title="Editar servicio"
    :breadcrumb="[
      { name: 'Servicios', to: '/services' },
      { name: 'Editar servicio', to: null },
    ]"
  >
    <el-form
      :model="servicesEditForm"
      :rules="servicesEditFormRules"
      status-icon
      ref="servicesEditForm"
      @submit.native.prevent="
        submitEditService('servicesEditForm', servicesEditForm)
      "
    >
      <el-tabs
        v-model="tab"
        @tab-click="
          $router
            .replace({
              path: `/services/edit?ref=${$route.query.ref}`,
              query: { tab },
            })
            .catch(() => {})
        "
      >
        <el-tab-pane label="Información general" name="general-information">
          <div class="grid grid-cols-12 gap-4">
            <el-form-item
              label="Nombre del servicio"
              prop="name"
              class="col-span-8"
            >
              <el-input
                ref="name"
                type="text"
                v-model="servicesEditForm.name"
                size="small"
                autocomplete="off"
                minlength="5"
                maxlength="60"
                show-word-limit
                @change="setStorage(servicesEditForm)"
              />
            </el-form-item>
            <el-form-item label="Costo" prop="cost" class="col-span-2">
              <el-input-number
                ref="cost"
                type="number"
                :min="0.01"
                :step="0.01"
                v-model="servicesEditForm.cost"
                size="small"
                autocomplete="off"
                style="width: 100%"
                @change="setStorage(servicesEditForm)"
              />
            </el-form-item>
            <el-form-item label=" " prop="incRenta" class="col-span-2 mt-4">
              <el-checkbox
                v-model="servicesEditForm.incRenta"
                class="w-full"
                border
                size="small"
                >Desc. 10% Renta</el-checkbox
              >
            </el-form-item>
          </div>
          <div class="grid grid-cols-12 gap-4">
            <el-form-item
              label="Tipo de venta"
              prop="sellingType"
              class="col-span-5"
            >
              <el-radio-group
                ref="sellingType"
                v-model="servicesEditForm.sellingType"
                class="w-full"
                @change="
                  setStorage(servicesEditForm),
                    changeIva(servicesEditForm.sellingType)
                "
              >
                <el-row :gutter="15">
                  <el-col :span="8" v-for="(s, k) in sellingTypes" :key="k">
                    <el-radio
                      :label="s.id"
                      border
                      class="w-full"
                      size="small"
                      >{{ s.name }}</el-radio
                    >
                  </el-col>
                </el-row>
              </el-radio-group>
            </el-form-item>
            <el-form-item label=" " prop="incIva" class="col-span-2 mt-4">
              <el-checkbox
                v-model="servicesEditForm.incIva"
                class="w-full"
                border
                size="small"
                :disabled="servicesEditForm.sellingType !== 3"
                >Inc. IVA</el-checkbox
              >
            </el-form-item>
          </div>
          <el-form-item label="Descripción del servicio" prop="description">
            <el-input
              ref="description"
              type="textarea"
              :rows="4"
              v-model="servicesEditForm.description"
              minlength="5"
              maxlength="5000"
              show-word-limit
              class="mt-1"
              @change="setStorage(servicesEditForm)"
            />
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane
          label="Integraciones"
          name="integrations"
          class="space-y-2"
          v-if="hasModule(['a98b98e6-b2d5-42a3-853d-9516f64eade8'])"
        >
          <Notification
            class="w-full"
            type="info"
            title="Integraciones"
            message="En esta sección se realizan las configuraciones de integración con otros modulos de manera general. Estas configuraciones se aplicarán a todos los servicios que no tengan una configuración individual."
          />
          <div class="grid grid-cols-12 gap-4">
            <el-form-item
              label="Seleccione una cuenta"
              prop="accountingCatalog"
              class="col-span-4"
              v-if="hasModule('a98b98e6-b2d5-42a3-853d-9516f64eade8')"
            >
              <el-select
                v-model="servicesEditForm.accountingCatalog"
                placeholder="Seleccione una cuenta"
                size="small"
                remote
                clearable
                filterable
                class="w-full"
                :loading="loadingAccount"
                :remote-method="findAccount"
                @focus="filteredCatalog = []"
              >
                <el-option
                  v-for="c in filteredCatalog"
                  :key="c.id"
                  :label="`${c.code} - ${c.name}`"
                  :value="c.id"
                  :disabled="c.isParent == true"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="flex justify-end">
        <el-button type="primary" size="small" native-type="submit"
          >Guardar</el-button
        >
        <el-button size="small" @click="$router.push('/services')"
          >Cancelar</el-button
        >
      </div>
    </el-form>
  </layout-content>
</template>
<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
import { hasModule, parseErrors } from "../../tools/index.js";
import {
  checkBeforeEnter,
  checkBeforeLeave,
  inputValidation,
  selectValidation,
} from "../../tools";

const storagekey = "edit-service";

export default {
  name: "ServicesEdit",
  head: {
    titleTemplate: `%s | Editar servicio`,
  },
  components: { LayoutContent, Notification },
  fetch() {
    if (this.$route.query.tab) {
      this.tab = this.$route.query.tab;
    }
    const sellingTypes = () => this.$axios.get("/services/selling-types");
    const service = () => this.$axios.get(`/services/${this.$route.query.ref}`);
    const catalog = () => this.$axios.get("/entries/catalog");
    const integrationServiceAccount = () =>
      this.$axios.get(`/services/${this.$route.query.ref}/integrations`);
    Promise.all([
      sellingTypes(),
      service(),
      catalog(),
      integrationServiceAccount(),
    ])
      .then((res) => {
        const [sellingTypes, service, catalog, integration] = res;
        this.sellingTypes = sellingTypes.data.data;
        this.servicesEditForm = {
          ...service.data.data,
          sellingType: service.data.data.sellingType.id,
          accountingCatalog: integration.data.integrations.catalog,
        };

        this.catalogs = catalog.data.data;
        this.filteredCatalog = this.catalogs.filter(
          (c) => c.id == integration.data.integrations.catalog
        );
        this.pageloading = false;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message;
      })
      .then((alw) => (this.pageloading = false));
    checkBeforeEnter(this, storagekey, "servicesEditForm");
  },
  fetchOnServer: false,
  data() {
    return {
      filteredCatalog: [],
      catalogs: [],
      tab: "general-information",
      acountGeneral: "",
      loadingAccount: false,
      pageloading: true,
      sellingTypes: [],
      servicesEditForm: {
        name: "",
        cost: "",
        sellingType: "",
        description: "",
        incIva: false,
        incRenta: false,
        accountingCatalog: "",
      },
      servicesEditFormRules: {
        name: inputValidation(true, 5, 60),
        cost: inputValidation(true, 0, null, "number"),
        sellingType: selectValidation(true),
        description: inputValidation(false, 5),
        accountingCatalog: selectValidation(true),
      },
      accountingCatalogs: [],
    };
  },
  methods: {
    setStorage(servicesEditForm) {
      localStorage.setItem(storagekey, JSON.stringify(servicesEditForm));
    },
    findAccount(query) {
      if (query !== "") {
        this.loadingAccount = true;
        this.$axios
          .get("/entries/catalog", { params: { search: query.toLowerCase() } })
          .then((res) => {
            this.filteredCatalog = res.data.data;
            this.loadingAccount = false;
          })
          .catch((err) => (this.errorMessage = err.response.data.message));
      } else {
        this.filteredCatalog = [];
      }
    },
    submitEditService(
      formName,
      {
        name,
        cost,
        sellingType,
        description,
        incIva,
        incRenta,
        accountingCatalog,
      }
    ) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$confirm(
          "¿Estás seguro que deseas actualizar este servicio?",
          "Confirmación",
          {
            confirmButtonText: "Si, actualizar",
            cancelButtonText: "Cancelar",
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "Procesando...";
                const service = () =>
                  this.$axios.put(`/services/${this.$route.query.ref}`, {
                    name,
                    cost,
                    sellingType,
                    description,
                    incIva,
                    incRenta,
                    accountingCatalog,
                  });
                const integration = () =>
                  this.$axios.put(
                    `/services/${this.$route.query.ref}/integrations`,
                    {
                      accountingCatalog,
                    }
                  );
                Promise.all([service(), integration()])
                  .then((res) => {
                    const [service, integrationCatalog] = res;
                    this.$notify.success({
                      title: "Exito",
                      message: `${service.data.message} y ${integrationCatalog.data.message}`,
                    });
                    setTimeout(() => {
                      this.$router.push("/services");
                    }, 300);
                  })
                  .catch((err) => {
                    this.$notify.error({
                      title: "Error",
                      dangerouslyUseHTMLString: true,
                      message: parseErrors(err.response.data.message),
                    });
                  })
                  .then((alw) => {
                    instance.confirmButtonLoading = false;
                    instance.confirmButtonText = "Si, actualizar";
                    localStorage.removeItem(storagekey);
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
    changeIva(sellingTypeValue) {
      if (sellingTypeValue !== 3) {
        this.servicesEditForm.incIva = false;
      } else {
        this.servicesEditForm.incIva = false;
      }
    },
    hasModule(modules) {
      return hasModule(modules, this.$auth.user);
    },
    changeIva(sellingTypeValue) {
      if (sellingTypeValue !== 3) {
        this.servicesEditForm.incIva = false;
      } else {
        this.servicesEditForm.incIva = false;
      }
    },
  },
};
</script>

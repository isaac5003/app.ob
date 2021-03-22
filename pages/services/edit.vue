<template>
  <layout-content
    v-loading="pageloading"
    page-title="Editar servicio"
    :breadcrumb="[
      { name: 'Servicios', to: '/services' },
      { name: 'Editar servicio', to: null },
    ]"
  >
    <el-tabs
      v-model="tab"
      @tab-click="
        $router
          .replace({
            path: `/services/edit`,
            query: { ref: $route.query.ref, tab },
          })
          .catch(() => {})
      "
    >
      <el-tab-pane label="Información general" name="general-information">
        <el-form
          :model="servicesEditForm"
          :ruler="servicesEditFormRules"
          status-icon
          ref="servicesEditForm"
          @submit.native.prevent="
            submitEditService('servicesEditForm', servicesEditForm)
          "
        >
          <div class="grid grid-cols-12 gap-4">
            <el-form-item
              label="Nombre del servicio"
              prop="name"
              class="col-span-5"
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
              />
            </el-form-item>
            <el-form-item
              label="Tipo de venta"
              prop="sellingType"
              class="col-span-5"
            >
              <el-radio-group
                ref="sellingType"
                v-model="servicesEditForm.sellingType"
                class="w-full"
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
          </div>

          <el-form-item label="Descripción del servicio" prop="description">
            <el-input
              ref="description"
              type="textarea"
              :rows="4"
              v-model="servicesEditForm.description"
              @change="setStorage(servicesNewForm)"
              minlength="5"
              maxlength="5000"
              show-word-limit
              class="mt-1"
            />
          </el-form-item>

          <div class="flex justify-end">
            <el-button type="primary" size="small" native-type="submit"
              >Guardar</el-button
            >
            <el-button size="small" @click="$router.push('/services')"
              >Cancelar</el-button
            >
          </div>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="Integraciones" name="integrations" class="space-y-4">
        <Notification
          class="w-full"
          type="info"
          title="Información"
          message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        />
        <el-form :model="servicesCatalogForm" ref="servicesCatalogForm">
          <div class="grid grid-cols-12 gap-4">
            <el-form-item label="Seleccione una cuenta" class="col-span-4">
              <el-select
                v-model="servicesCatalogForm.accountingCatalog"
                placeholder="Seleccione una cuenta"
                size="small"
                clearable
                filterable
                class="w-full"
              >
                <el-option
                  v-for="c in catalogList"
                  :key="c.id"
                  :label="c.name"
                  :value="c.id"
                  :disabled="c.isParent == true"
                >
                  <div class="flex flex-row justify-between">
                    <span class="mr-5 text-xs">
                      {{ c.name }}
                    </span>
                    <span class="mr-5 text-xs">
                      {{ c.code }}
                    </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="flex justify-end">
            <el-button
              type="primary"
              size="small"
              @click.native="
                saveServiceIntegration(
                  'servicesCatalogForm',
                  servicesCatalogForm
                )
              "
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
    Promise.all([sellingTypes(), service(), catalog()])
      .then((res) => {
        const [sellingTypes, service, catalog] = res;
        this.sellingTypes = sellingTypes.data.types;
        this.servicesEditForm = {
          ...service.data.service,
          sellingType: service.data.service.sellingType.id,
        };
        this.catalogList = catalog.data.accountingCatalog;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message;
      })
      .then((alw) => (this.pageloading = false));

    checkBeforeEnter(this, storagekey, "servicesNewForm");
  },
  fetchOnServer: false,
  beforeRouteLeave(to, from, next) {
    checkBeforeLeave(this, storagekey, next);
  },
  data() {
    return {
      catalogList: [],
      catalag: "",
      tab: "general-information",
      acountGeneral: "",
      pageloading: true,
      sellingTypes: [],
      servicesEditForm: {
        name: "",
        cost: "",
        sellingType: "",
        description: "",
        incIva: false,
        incRenta: false,
      },
      servicesEditFormRules: {
        name: inputValidation(true, 5, 60),
        cost: inputValidation(true, 0, null, "number"),
        sellingType: selectValidation(true),
        description: inputValidation(false, 5),
      },
      servicesCatalogForm: {
        accountingCatalog: "",
      },
    };
  },
  methods: {
    submitEditService(
      formName,
      { name, cost, sellingType, description, incIva, incRenta }
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
                this.$axios
                  .put(`/services/${this.$route.query.ref}`, {
                    name,
                    cost,
                    sellingType,
                    description,
                    incIva,
                    incRenta,
                  })
                  .then((res) => {
                    this.$notify.success({
                      title: "Exito",
                      message: res.data.message,
                    });
                    this.$router.push("/services");
                  })
                  .catch((err) => {
                    this.$notify.error({
                      title: "Error",
                      message: err.response.data.message,
                    });
                  })
                  .then((alw) => {
                    instance.confirmButtonLoading = false;
                    instance.confirmButtonText = "Si, actualizar";
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
    saveServiceIntegration(formName, { accountingCatalog }) {
      this.$confirm("Esta seguro que desea guardar la cuenta", "Confirmar", {
        confirmButtonText: "Si, guardar",
        cancelButtonText: "Cancelar",
        type: "warning",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "Procesando...";

            this.$axios
              .put(`/services/${this.$route.query.ref}/integrations`, {
                accountingCatalog,
              })
              .then((res) => {
                this.$notify.success({
                  title: "Exito",
                  message: res.data.message,
                });
                // this.fetchGeneral();
                instance.confirmButtonLoading = false;
                instance.confirmButtonText = "Si, guardar";
                done();
              })

              .catch((err) => {
                this.errorMessage = err.response.data.messag;
              });
          } else {
            instance.confirmButtonLoading = false;
            instance.confirmButtonText = "Si, guardar";
            done();
          }
        },
      });
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

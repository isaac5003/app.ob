<template>
  <layout-content
    page-title="Editar proveedor"
    :breadcrumb="[
      { name: 'Proveedores', to: '/providers' },
      { name: 'Editar proveedor', to: null },
    ]"
  >
    <el-form
      :model="providerEditForm"
      status-icon
      ref="providerEditForm"
      @submit.native.prevent="
        submitEditCustomer('providerEditForm', providerEditForm)
      "
      class="flex flex-col"
    >
      <el-tabs
        v-model="activeTab"
        @tab-click="
          $router.push({
            path: `/providers/edit?ref=${$route.query.ref}`,
            query: { tab: activeTab },
          })
        "
      >
        <el-tab-pane label="Información general" name="general-information">
          <div class="grid grid-cols-12 gap-4">
            <el-form-item
              label="Nombre o razón social"
              prop="name"
              class="col-span-7"
            >
              <el-input
                clearable
                type="text"
                v-model="providerEditForm.name"
                size="small"
                autocomplete="off"
                maxlength="100"
                minlength="5"
                show-word-limit
                @change="setStorage(providerEditForm)"
              />
            </el-form-item>
            <el-form-item
              label="Identificador"
              prop="shortName"
              class="col-span-3"
            >
              <el-input
                clearable
                type="text"
                v-model="providerEditForm.shortName"
                size="small"
                autocomplete="off"
                maxlength="15"
                minlength="3"
                show-word-limit
                @change="setStorage(providerEditForm)"
              />
            </el-form-item>
            <el-form-item
              label="Es tambien proveedor"
              prop="isCustomer"
              class="col-span-2"
              v-if="false"
            >
              <el-radio-group
                v-model="providerEditForm.isCustomer"
                class="w-full"
                @change="setStorage(providerEditForm)"
              >
                <el-radio :label="true">Si</el-radio>
                <el-radio :label="false">No</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="grid grid-cols-12 gap-4">
            <el-form-item
              label="Dirección 1"
              prop="address1"
              class="col-span-6"
            >
              <el-input
                clearable
                type="text"
                v-model="providerEditForm.address1"
                size="small"
                autocomplete="off"
                maxlength="150"
                minlength="5"
                show-word-limit
                @change="setStorage(providerEditForm)"
              />
            </el-form-item>
            <el-form-item
              label="Dirección 2"
              prop="address2"
              class="col-span-6"
            >
              <el-input
                clearable
                type="text"
                v-model="providerEditForm.address2"
                size="small"
                autocomplete="off"
                maxlength="150"
                minlength="5"
                show-word-limit
                @change="setStorage(providerEditForm)"
              />
            </el-form-item>
          </div>
          <div class="grid grid-cols-12 gap-4">
            <el-form-item label="País" prop="country" class="col-span-4">
              <el-select
                class="w-full"
                v-model="providerEditForm.country"
                size="small"
                placeholder="Seleccionar país"
                filterable
                clearable
                @change="clearSelect('state')"
                default-first-option
              >
                <el-option
                  v-for="country in countries"
                  :key="country.id"
                  :label="country.name"
                  :value="country.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Departamento" prop="state" class="col-span-4">
              <el-select
                class="w-full"
                v-model="providerEditForm.state"
                size="small"
                placeholder="Seleccionar país"
                filterable
                clearable
                @change="clearSelect('city')"
                default-first-option
              >
                <el-option
                  v-for="state in states"
                  :key="state.id"
                  :label="state.name"
                  :value="state.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Municipio" prop="city" class="col-span-4">
              <el-select
                class="w-full"
                v-model="providerEditForm.city"
                size="small"
                placeholder="Seleccionar país"
                filterable
                clearable
                default-first-option
                @change="setStorage(providerEditForm)"
              >
                <el-option
                  v-for="city in cities"
                  :key="city.id"
                  :label="city.name"
                  :value="city.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="grid grid-cols-12 gap-4">
            <el-form-item
              label="Contacto"
              prop="contactName"
              class="col-span-4"
            >
              <el-input
                clearable
                type="text"
                v-model="providerEditForm.contactName"
                size="small"
                autocomplete="off"
                maxlength="50"
                minlength="5"
                show-word-limit
                @change="setStorage(providerEditForm)"
              />
            </el-form-item>
            <el-form-item label="Teléfono" prop="cellphone" class="col-span-4">
              <el-input
                clearable
                type="text"
                v-model="providerEditForm.phone"
                size="small"
                autocomplete="off"
                placeholder="####-####"
                v-mask="'####-####'"
                @change="setStorage(providerEditForm)"
              />
            </el-form-item>
            <el-form-item
              label="Correo electrónico"
              prop="email"
              class="col-span-4"
            >
              <el-input
                clearable
                type="text"
                v-model="providerEditForm.email"
                size="small"
                autocomplete="off"
                @change="setStorage(providerEditForm)"
              />
            </el-form-item>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="Información tributaria"
          name="tributary-information"
        >
          <div class="grid grid-cols-12 gap-4">
            <el-form-item
              label="Tipo de cliente"
              prop="customerType"
              class="col-span-4"
            >
              <el-select
                class="w-full"
                v-model="providerEditForm.customerType"
                size="small"
                placeholder="Seleccionar tipo de cliente"
                filterable
                clearable
                default-first-option
                @change="setStorage(providerEditForm)"
              >
                <el-option
                  v-for="ct in customerTypes"
                  :key="ct.id"
                  :label="ct.name"
                  :value="ct.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="Tipo de persona natural"
              prop="customerTypeNatural"
              class="col-span-4"
              v-if="providerEditForm.customerType == 2"
            >
              <el-select
                class="w-full"
                v-model="providerEditForm.customerTypeNatural"
                size="small"
                placeholder="Seleccionar tipo de persona natural"
                filterable
                clearable
                default-first-option
                @change="setStorage(providerEditForm)"
              >
                <el-option
                  v-for="ct in customerTypeNaturals"
                  :key="ct.id"
                  :label="ct.name"
                  :value="ct.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="grid grid-cols-12 gap-4">
            <el-form-item
              label="DUI"
              prop="dui"
              class="col-span-4"
              v-if="providerEditForm.customerType == 2"
            >
              <el-input
                type="text"
                v-model="providerEditForm.dui"
                size="small"
                autocomplete="off"
                placeholder="########-#"
                v-mask="'########-#'"
                @change="setStorage(providerEditForm)"
              />
            </el-form-item>
            <el-form-item label="NIT" prop="nit" class="col-span-6">
              <el-input
                type="text"
                v-model="providerEditForm.nit"
                size="small"
                autocomplete="off"
                placeholder="####-######-###-#"
                v-mask="'####-######-###-#'"
                @change="setStorage(providerEditForm)"
              />
            </el-form-item>
            <el-form-item
              label="NRC"
              prop="nrc"
              class="col-span-2"
              v-if="providerEditForm.customerType == 1"
            >
              <el-input
                type="text"
                v-model="providerEditForm.nrc"
                size="small"
                autocomplete="off"
                @change="setStorage(providerEditForm)"
              />
            </el-form-item>
          </div>
          <div
            class="grid grid-cols-12 gap-4"
            v-if="
              providerEditForm.customerType == 1 ||
              providerEditForm.customerTypeNatural == 2
            "
          >
            <el-form-item
              label="Tipo de contribuyente"
              prop="customerTaxerType"
              class="col-span-4"
            >
              <el-select
                class="w-full"
                v-model="providerEditForm.customerTaxerType"
                size="small"
                placeholder="Seleccionar tipo de contribuyente"
                filterable
                clearable
                default-first-option
                @change="setStorage(providerEditForm)"
              >
                <el-option
                  v-for="ct in customerTaxerTypes"
                  :key="ct.id"
                  :label="ct.name"
                  :value="ct.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Giro" prop="giro" class="col-span-8">
              <el-input
                type="text"
                v-model="providerEditForm.giro"
                size="small"
                autocomplete="off"
                @change="setStorage(providerEditForm)"
              />
            </el-form-item>
          </div>
        </el-tab-pane>
         <el-tab-pane
          label="Integraciones"
          name="integrations"
          class="space-y-2"
          v-if="hasModule()"
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
                filterable
                remote
                v-model="providerEditForm.accountingCatalog"
                placeholder="Seleccione una cuenta"
                size="small"
                clearable
                class="w-full"
                :remote-method="findAccount"
                :loading="loadingAccount"
              >
                <el-option
                  v-for="a in filteredCatalog"
                  :key="a.id"
                  :label="`${a.code} - ${a.name}`"
                  :value="a.id"
                  :disabled="a.isParent == true"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="flex justify-end" >
        <el-button type="primary" size="small" native-type="submit"
          >Actualizar</el-button
        >
        <el-button size="small" @click="$router.push('/providers')"
          >Cancelar</el-button
        >
      </div>
    </el-form>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import {hasModule} from "../../tools/index.js"
import {
  inputValidation,
  selectValidation,
  checkBeforeLeave,
  checkBeforeEnter,
} from "../../tools";
import Notification from "../../components/Notification";

const storagekey = "edit-provider";

export default {
  name: "ProviderEdit",
  head: {
    titleTemplate: `%s | Editar proveedor`,
  },
  components: { LayoutContent, Notification },
  fetch() {
    const customer = () =>
      this.$axios.get(`/providers/${this.$route.query.ref}`);
    const customerTypes = () => this.$axios.get(`/customers/types`);
    const customerTypeNaturals = () =>
      this.$axios.get(`/customers/type-naturals`);
    const customerTaxerTypes = () => this.$axios.get(`/customers/taxer-types`);
    const countries = () => this.$axios.get(`/others/countries`);
    const states = () => this.$axios.get(`/others/states`);
    const cities = () => this.$axios.get(`/others/cities`);
       const settingsIntegrations = () =>
      this.$axios.get(`/providers/${this.$route.query.ref}/integrations`);
    const catalog = () => this.$axios.get("/entries/catalog");

    Promise.all([
      customerTypes(),
      customerTypeNaturals(),
      customerTaxerTypes(),
      customer(),
      countries(),
      states(),
      cities(),
      settingsIntegrations(),
catalog()
    ])
      .then((res) => {
        // Se ubica en el tab seleccionado
        if (this.$route.query.tab) {
          this.activeTab = this.$route.query.tab;
        }

        const [
          customerTypes,
          customerTypeNaturals,
          customerTaxerTypes,
          customerData,
          countries,
          states,
          cities,
          settingsIntegrations,
          catalog,
        ] = res;

        this.customerTypes = customerTypes.data.data;
        this.customerTypeNaturals = customerTypeNaturals.data.data;
        this.customerTaxerTypes = customerTaxerTypes.data.data;
        const customer = customerData.data.data;
        let branch = customer.customerBranches[0];
        this.customer = customer;

        this.countries = countries.data.data;
        this.rawStates = states.data.data;
        this.rawCities = cities.data.data;
this.catalogs = catalog.data.data;

        const phone = branch.contactInfo.phones
          ? branch.contactInfo.phones[0]
          : branch.contactInfo.cellphone;
        const email = branch.contactInfo.emails
          ? branch.contactInfo.emails[0]
          : branch.contactInfo.email;
        this.providerEditForm = {
          name: customer.name,
          shortName: customer.shortName,
          isCustomer: customer.isCustomer,
          dui: customer.dui,
          nit: customer.nit,
          nrc: customer.nrc,
          giro: customer.giro,
          customerType:
            customer.customerType != null ? customer.customerType.id : null,
          customerTypeNatural:
            customer.customerTypeNatural != null
              ? customer.customerTypeNatural.id
              : null,
          customerTaxerType:
            customer.customerTaxerType != null
              ? customer.customerTaxerType.id
              : null,
          contactName: branch.contactName,
          address1: branch.address1,
          address2: branch.address2,
          phone,
          email,
          country: branch.country.id,
          state: branch.state.id,
          city: branch.city.id,
           accountingCatalog: settingsIntegrations.data.integrations.catalog,
        };
 this.filteredCatalog = this.catalogs.filter(
          (c) => c.id == settingsIntegrations.data.integrations.catalog
        );
        this.loading = false;
      })
      .catch((err) => {
        console.log(err);
        this.$message.error(err.response.data.message);
        this.$router.push("/providers");
      })
      .then((alw) => (this.pageloading = false));

    checkBeforeEnter(this, storagekey, "providerEditForm");
  },
  fetchOnServer: false,
  beforeRouteLeave(to, from, next) {
    checkBeforeLeave(this, storagekey, next);
  },
  data() {
    return {
      pageloading: true,
      activeTab: "general-information",
      countries: [],
      rawStates: [],
      rawCities: [],
      customerTypes: [],
      customerTypeNaturals: [],
      customerTaxerTypes: [],
      providerEditForm: {
        name: "",
        shortName: "",
        isCustomer: false,
        dui: "",
        nit: "",
        nrc: "",
        giro: "",
        customerType: "",
        customerTypeNatural: "",
        customerTaxerType: "",
        contactName: "",
        address1: "",
        address2: "",
        phone: "",
        email: "",
        country: "",
        state: "",
        city: "",
        accountingCatalog:""
      },
      customer: null,
      filteredCatalog: [],
      loadingAccount: false,
      catalogs: [],
    };
  },
  methods: {
   
    setStorage(providerEditForm) {
      localStorage.setItem(storagekey, JSON.stringify(providerEditForm));
    },
    clearSelect(name) {
      switch (name) {
        case "state":
          this.providerEditForm.state = "";
          this.providerEditForm.city = "";
          break;
        case "city":
          this.providerEditForm.city = "";
          break;
      }
      this.setStorage(this.providerEditForm);
    },
    submitEditCustomer(formName, formData) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$confirm(
          "¿Estás seguro que deseas actualizar este proveedor?",
          "Confirmación",
          {
            confirmButtonText: "Si, actualizar",
            cancelButtonText: "Cancelar",
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "Procesando...";
                 const provider = () =>
                  this.$axios.put(`/providers/${this.$route.query.ref}`, {
                     name: formData.name,
                    shortName: formData.shortName,
                    isCustomer: formData.isCustomer,
                    dui: formData.dui,
                    nit: formData.nit,
                    nrc: formData.nrc,
                    giro: formData.giro,
                    customerType:
                      formData.customerType == ""
                        ? null
                        : formData.customerType,
                    customerTypeNatural:
                      formData.customerTypeNatural == ""
                        ? null
                        : formData.customerTypeNatural,
                    customerTaxerType:
                      formData.customerTaxerType == ""
                        ? null
                        : formData.customerTaxerType,
                    branch: {
                      id: this.customer.customerBranches[0].id,
                      contactName: formData.contactName,
                      contactInfo: {
                        phones: [formData.phone],
                        emails: [formData.email],
                      },
                      address1: formData.address1,
                      address2: formData.address2,
                      country: formData.country,
                      state: formData.state,
                      city: formData.city,
                    },
                  });
                const integration = () =>
                  this.$axios.put(
                    `/providers/${this.$route.query.ref}/integrations`,
                    {
                      accountingCatalog: formData.accountingCatalog,
                    }
                  );
                Promise.all([provider(), integration()])
                  .then((res) => {
                    const [provider, integration] = res;

                    this.$notify.success({
                      title: "Exito",
                      message: `${provider.data.message} y ${integration.data.message}`,
                    });
                    setTimeout(() => {
                      this.$router.push("/providers");
                    }, 300);
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
                    localStorage.removeItem(storagekey);
                    done();
                  });
              }  else {
                done();
              }
            },
          }
        );
      });
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
     hasModule() {
      return hasModule(["f6000cbb-1e6d-4f7d-a7cc-cadd78d23076"], this.$auth.user);
   },
  },
  computed: {
    states() {
      return this.rawStates.filter(
        (s) => s.country.id == this.providerEditForm.country
      );
    },
    cities() {
      return this.rawCities.filter(
        (c) => c.state.id == this.providerEditForm.state
      );
    },
  },
};
</script>
<template>
  <layout-content
    page-title="Editar proveedor"
    :breadcrumb="[
      { name: 'Clientes', to: '/providers' },
      { name: 'Editar proveedor', to: null },
    ]"
  >
    <el-form
      :model="providerEditForm"
      status-icon
      ref="providerEditForm"
      @submit.native.prevent="
        submitEditProviders('providerEditForm', providerEditForm)
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
                v-model="providerEditForm.providersTypeNatural"
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
              v-if="providerEditForm.providersType == 1"
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
              providerEditForm.providersType == 1 ||
              providerEditForm.providersTypeNatural == 2
            "
          >
            <el-form-item
              label="Tipo de contribuyente"
              prop="customerTaxerType"
              class="col-span-4"
            >
              <el-select
                class="w-full"
                v-model="providerEditForm.providersTaxerType"
                size="small"
                placeholder="Seleccionar tipo de contribuyente"
                filterable
                clearable
                default-first-option
                @change="setStorage(providerEditForm)"
              >
                <el-option
                  v-for="ct in providersTaxerTypes"
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
      </el-tabs>
      <div class="flex justify-end" v-if="activeTab != 'integrations'">
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
    const providers = () =>
      this.$axios.get(`/providers/${this.$route.query.ref}`);
    const providersTypes = () => this.$axios.get(`/providers/types`);
    const providersTypeNaturals = () =>
      this.$axios.get(`/providers/type-naturals`);
    const providersTaxerTypes = () => this.$axios.get(`/providers/taxer-types`);
    const countries = () => this.$axios.get(`/others/countries`);
    const states = () => this.$axios.get(`/others/states`);
    const cities = () => this.$axios.get(`/others/cities`);

    Promise.all([
      providersTypes(),
      providersTypeNaturals(),
      providersTaxerTypes(),
      providers(),
      countries(),
      states(),
      cities(),
    ])
      .then((res) => {
        // Se ubica en el tab seleccionado
        if (this.$route.query.tab) {
          this.activeTab = this.$route.query.tab;
        }

        const [
          providersTypes,
          providersTypeNaturals,
          providersTaxerTypes,
          providers,
          countries,
          states,
          cities,
        ] = res;

        this.providersTypes = customerTypes.data.types;
        this.providersTypeNaturals = customerTypeNaturals.data.typeNaturals;
        this.providersTaxerTypes = customerTaxerTypes.data.taxerTypes;
        const customer = customerData.data.customer;
        let branch = customer.customerBranches[0];
        this.customer = customer;

        this.countries = countries.data.countries;
        this.rawStates = states.data.states;
        this.rawCities = cities.data.cities;

        const phone = branch.contactInfo.phones
          ? branch.contactInfo.phones[0]
          : branch.contactInfo.cellphone;
        const email = branch.contactInfo.emails
          ? branch.contactInfo.emails[0]
          : branch.contactInfo.email;
        this.customersEditForm = {
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
        };

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
      providersTypes: [],
      providersTypeNaturals: [],
      providersTaxerTypes: [],
      providerEditForm: {
        name: "",
        shortName: "",
        isCustomer: false,
        dui: "",
        nit: "",
        nrc: "",
        giro: "",
        providersType: "",
        providersTypeNatural: "",
        providersTaxerType: "",
        contactName: "",
        address1: "",
        address2: "",
        phone: "",
        email: "",
        country: "",
        state: "",
        city: "",
      },
      customer: null,
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
    submitEditProviders(formName, formData) {
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
                this.$axios
                  .put(`/providers/${this.$route.query.ref}`, {
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
                  })
                  .then((res) => {
                    this.$notify.success({
                      title: "Exito",
                      message: res.data.message,
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
              } else {
                done();
              }
            },
          }
        );
      });
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
<template>
  <layout-content
    v-loading="loading"
    page-title="Editar cliente"
    :breadcrumb="[
      { name: 'Clientes', to: '/customers' },
      { name: 'Listado de clientes', to: '/customers' },
      { name: 'Editar cliente', to: null },
    ]"
  >
    <el-form
      :model="customersEditForm"
      status-icon
      ref="customersEditForm"
      @submit.native.prevent="
        submitEditCustomer('customersEditForm', customersEditForm)
      "
      class="flex flex-col space-y-4"
    >
      <el-tabs
        v-model="activeTab"
        @tab-click="
          $router
            .replace({
              path: `/customers/edit?ref=${$route.query.ref}`,
              query: { tab: activeTab },
            })
            .catch(() => {})
        "
      >
        <el-tab-pane label="Información general" name="general-information">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-7">
              <el-form-item label="Nombre o razón social" prop="name">
                <el-input
                  clearable
                  type="text"
                  v-model="customersEditForm.name"
                  size="small"
                  autocomplete="off"
                />
              </el-form-item>
            </div>
            <div class="col-span-3">
              <el-form-item label="Identificador" prop="shortName">
                <el-input
                  clearable
                  type="text"
                  v-model="customersEditForm.shortName"
                  size="small"
                  autocomplete="off"
                />
              </el-form-item>
            </div>
            <div class="col-span-2" v-show="false">
              <el-form-item label="Es tambien proveedor" prop="isProvider">
                <el-radio-group
                  v-model="customersEditForm.isProvider"
                  class="w-full"
                >
                  <el-radio :label="true">Si</el-radio>
                  <el-radio :label="false">No</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-6">
              <el-form-item label="Dirección 1" prop="address1">
                <el-input
                  clearable
                  type="text"
                  v-model="customersEditForm.address1"
                  size="small"
                  autocomplete="off"
                />
              </el-form-item>
            </div>
            <div class="col-span-6">
              <el-form-item label="Dirección 2" prop="address2">
                <el-input
                  clearable
                  type="text"
                  v-model="customersEditForm.address2"
                  size="small"
                  autocomplete="off"
                />
              </el-form-item>
            </div>
          </div>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4">
              <el-form-item label="País" prop="country">
                <el-select
                  class="w-full"
                  v-model="customersEditForm.country"
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
            </div>
            <div class="col-span-4">
              <el-form-item label="Departamento" prop="state">
                <el-select
                  class="w-full"
                  v-model="customersEditForm.state"
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
            </div>
            <div class="col-span-4">
              <el-form-item label="Municipio" prop="city">
                <el-select
                  class="w-full"
                  v-model="customersEditForm.city"
                  size="small"
                  placeholder="Seleccionar país"
                  filterable
                  clearable
                  default-first-option
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
          </div>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4">
              <el-form-item label="Contacto" prop="contactName">
                <el-input
                  clearable
                  type="text"
                  v-model="customersEditForm.contactName"
                  size="small"
                  autocomplete="off"
                />
              </el-form-item>
            </div>
            <div class="col-span-4">
              <el-form-item label="Teléfono" prop="cellphone">
                <el-input
                  clearable
                  type="text"
                  v-model="customersEditForm.cellphone"
                  size="small"
                  autocomplete="off"
                  placeholder="####-####"
                  v-mask="'####-####'"
                />
              </el-form-item>
            </div>
            <div class="col-span-4">
              <el-form-item label="Correo electrónico" prop="email">
                <el-input
                  clearable
                  type="text"
                  v-model="customersEditForm.email"
                  size="small"
                  autocomplete="off"
                />
              </el-form-item>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="Información tributaria"
          name="tributary-information"
        >
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4">
              <el-form-item label="Tipo de cliente" prop="customerType">
                <el-select
                  class="w-full"
                  v-model="customersEditForm.customerType"
                  size="small"
                  placeholder="Seleccionar tipo de cliente"
                  filterable
                  clearable
                  default-first-option
                >
                  <el-option
                    v-for="ct in customerTypes"
                    :key="ct.id"
                    :label="ct.name"
                    :value="ct.id"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div
              class="col-span-4"
              v-show="customersEditForm.customerType == 2"
            >
              <el-form-item
                label="Tipo de persona natural"
                prop="customerTypeNatural"
              >
                <el-select
                  class="w-full"
                  v-model="customersEditForm.customerTypeNatural"
                  size="small"
                  placeholder="Seleccionar tipo de persona natural"
                  filterable
                  clearable
                  @change="changeNatural(customersEditForm.customerTypeNatural)"
                  default-first-option
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
          </div>
          <div class="grid grid-cols-12 gap-4">
            <div
              class="col-span-4"
              v-show="customersEditForm.customerType == 2"
            >
              <el-form-item label="DUI" prop="dui">
                <el-input
                  type="text"
                  v-model="customersEditForm.dui"
                  size="small"
                  autocomplete="off"
                  placeholder="########-#"
                  v-mask="'########-#'"
                />
              </el-form-item>
            </div>
            <div class="col-span-6">
              <el-form-item label="NIT" prop="nit">
                <el-input
                  type="text"
                  v-model="customersEditForm.nit"
                  size="small"
                  autocomplete="off"
                  placeholder="####-######-###-#"
                  v-mask="'####-######-###-#'"
                />
              </el-form-item>
            </div>
            <div
              class="col-span-2"
              v-show="customersEditForm.customerType == 1"
            >
              <el-form-item label="NRC" prop="nrc">
                <el-input
                  type="text"
                  v-model="customersEditForm.nrc"
                  size="small"
                  autocomplete="off"
                />
              </el-form-item>
            </div>
          </div>
          <div
            class="grid grid-cols-12 gap-4"
            v-show="customersEditForm.customerType == 1"
          >
            <div class="col-span-4">
              <el-form-item
                label="Tipo de contribuyente"
                prop="customerTaxerType"
              >
                <el-select
                  class="w-full"
                  v-model="customersEditForm.customerTaxerType"
                  size="small"
                  placeholder="Seleccionar tipo de contribuyente"
                  filterable
                  clearable
                  default-first-option
                >
                  <el-option
                    v-for="ct in customerTaxerTypes"
                    :key="ct.id"
                    :label="ct.name"
                    :value="ct.id"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="col-span-8">
              <el-form-item label="Giro" prop="giro">
                <el-input
                  type="text"
                  v-model="customersEditForm.giro"
                  size="small"
                  autocomplete="off"
                />
              </el-form-item>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Integraciones" name="integrations">
          <Notification
            class="w-full"
            type="info"
            title="Integraciones"
            message="En esta sección se muestran las configuraciones necesarias para poder integrar otros modulos del sistema cuando estos están disponibles."
          />
        </el-tab-pane>
      </el-tabs>
      <div class="flex justify-end" v-if="activeTab != 'integrations'">
        <el-button type="primary" size="small" native-type="submit"
          >Actualizar</el-button
        >
        <el-button size="small" @click="cancel()">Cancelar</el-button>
      </div>
    </el-form>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import { inputValidation, selectValidation } from "../../tools";
import Notification from "../../components/Notification";

export default {
  name: "CustomerEdit",
  components: { LayoutContent, Notification },
  fetch() {
    const customer = () =>
      this.$axios.get(`/customers/${this.$route.query.ref}`);
    const customerTypes = () => this.$axios.get(`/customers/customer-types`);
    const customerTypeNaturals = () =>
      this.$axios.get(`/customers/customer-type-naturals`);
    const customerTaxerTypes = () =>
      this.$axios.get(`/customers/customer-taxer-types`);
    const countries = () => this.$axios.get(`/others/countries`);
    const states = () => this.$axios.get(`/others/states`);
    const cities = () => this.$axios.get(`/others/cities`);

    Promise.all([
      customerTypes(),
      customerTypeNaturals(),
      customerTaxerTypes(),
      customer(),
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
          customerTypes,
          customerTypeNaturals,
          customerTaxerTypes,
          customerData,
          countries,
          states,
          cities,
        ] = res;

        this.customerTypes = customerTypes.data.types;
        this.customerTypeNaturals = customerTypeNaturals.data.typeNaturals;
        this.customerTaxerTypes = customerTaxerTypes.data.taxerTypes;
        const customer = customerData.data.customer;
        const branch = customer.customerBranches[0];

        this.countries = countries.data.countries;
        this.rawStates = states.data.states;
        this.rawCities = cities.data.cities;
        this.customersEditForm = {
          name: customer.name,
          shortName: customer.shortName,
          isProvider: customer.isProvider,
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
          cellphone: branch.contactInfo.cellphone,
          email: branch.contactInfo.email,
          country: branch.country.id,
          state: branch.state.id,
          city: branch.city.id,
        };

        this.loading = false;
      })
      .catch((err) => {
        this.$message.error(err.response.data.message);
        this.$router.push("/customers");
      });
  },
  fetchOnServer: false,
  data() {
    return {
      loading: true,
      activeTab: "general-information",
      countries: [],
      rawStates: [],
      rawCities: [],
      customerTypes: [],
      customerTypeNaturals: [],
      customerTaxerTypes: [],
      customersEditForm: {
        name: "",
        shortName: "",
        isProvider: false,
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
      },
    };
  },
  methods: {
    cancel() {
      this.$confirm("¿Estás seguro que deseas salir?", "Confirmación", {
        confirmButtonText: "Si, salir",
        cancelButtonText: "Cancelar",
        type: "warning",
      }).then(() => {
        this.$router.push("/customers");
      });
    },
    submitEditCustomer() {},
  },
  computed: {
    states() {
      return this.rawStates.filter(
        (s) => s.country.id == this.customersEditForm.country
      );
    },
    cities() {
      return this.rawCities.filter(
        (c) => c.state.id == this.customersEditForm.state
      );
    },
  },
};
</script>

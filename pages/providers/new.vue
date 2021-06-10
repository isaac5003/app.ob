<template>
  <layout-content
    v-loading="pageloading"
    page-title="Nuevo proveedor"
    :breadcrumb="[
      { name: 'Proveedores', to: '/providers' },
      { name: 'Nuevo proveedor', to: null },
    ]"
  >
    <el-form
      :model="providerNewForm"
      :rules="providerNewFormRules"
      status-icon
      ref="providerNewForm"
      @submit.native.prevent="
        submitNewProvider('providerNewForm', providerNewForm)
      "
      class="flex flex-col"
    >
      <div class="flex flex-col">
        <div class="flex flex-col space-y-2">
          <span class="text-sm font-semibold">Informacion general</span>
          <div class="flex flex-col">
            <div class="grid grid-cols-12 gap-4">
              <el-form-item
                label="Nombre o razón social"
                prop="name"
                class="col-span-6"
              >
                <el-input
                  clearable
                  type="text"
                  v-model="providerNewForm.name"
                  size="small"
                  autocomplete="off"
                  maxlength="100"
                  minlength="5"
                  show-word-limit
                  @change="setStorage(providerNewForm)"
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
                  v-model="providerNewForm.shortName"
                  size="small"
                  autocomplete="off"
                  maxlength="15"
                  minlength="3"
                  show-word-limit
                  @change="setStorage(providerNewForm)"
                />
              </el-form-item>
              <el-form-item
                prop="isCostumers"
                class="col-span-3"
                label="¿Es tambien cliente?"
                v-if="hasModule('f6000cbb-1e6d-4f7d-a7cc-cadd78d23076')"
              >
                <el-radio-group
                  v-model="providerNewForm.isCostumer"
                  class="w-full"
                  @change="setStorage(providerNewForm)"
                >
                  <el-row :gutter="15">
                    <el-col :span="8">
                      <el-radio :label="true" size="small" class="w-full"
                        >Si</el-radio
                      >
                    </el-col>
                    <el-col :span="8">
                      <el-radio :label="false" size="small" class="w-full"
                        >no</el-radio
                      >
                    </el-col>
                  </el-row>
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
                  v-model="providerNewForm.address1"
                  size="small"
                  autocomplete="off"
                  maxlength="150"
                  minlength="5"
                  show-word-limit
                  @change="setStorage(providerNewForm)"
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
                  v-model="providerNewForm.address2"
                  size="small"
                  autocomplete="off"
                  maxlength="150"
                  minlength="5"
                  show-word-limit
                  @change="setStorage(providerNewForm)"
                />
              </el-form-item>
            </div>
            <div class="grid grid-cols-12 gap-4">
              <el-form-item label="País" prop="country" class="col-span-4">
                <el-select
                  class="w-full"
                  v-model="providerNewForm.country"
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
              <el-form-item
                label="Departamento"
                prop="state"
                class="col-span-4"
              >
                <el-select
                  class="w-full"
                  v-model="providerNewForm.state"
                  size="small"
                  placeholder="Seleccionar departamento"
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
                  v-model="providerNewForm.city"
                  size="small"
                  placeholder="Seleccionar municipio"
                  filterable
                  clearable
                  default-first-option
                  @change="setStorage(providerNewForm)"
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
              <div class="col-span-4">
                <el-form-item label="Contacto" prop="contactName">
                  <el-input
                    clearable
                    type="text"
                    v-model="providerNewForm.contactName"
                    size="small"
                    autocomplete="off"
                    maxlength="50"
                    minlength="5"
                    show-word-limit
                    @change="setStorage(providerNewForm)"
                  />
                </el-form-item>
              </div>
              <div class="col-span-4">
                <el-form-item label="Teléfono" prop="phone">
                  <el-input
                    clearable
                    type="text"
                    v-model="providerNewForm.phone"
                    size="small"
                    autocomplete="off"
                    placeholder="####-####"
                    v-mask="'####-####'"
                    @change="setStorage(providerNewForm)"
                  />
                </el-form-item>
              </div>
              <div class="col-span-4">
                <el-form-item label="Correo electrónico" prop="email">
                  <el-input
                    clearable
                    type="text"
                    v-model="providerNewForm.email"
                    size="small"
                    autocomplete="off"
                    @change="setStorage(providerNewForm)"
                  />
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col space-y-2">
          <span class="text-sm font-semibold">Informacion tributaria</span>
          <div class="flex flex-col">
            <div class="grid grid-cols-12 gap-4">
              <el-form-item
                label="Tipo de cliente"
                prop="customerType"
                class="col-span-4"
              >
                <el-select
                  class="w-full"
                  v-model="providerNewForm.customerType"
                  size="small"
                  placeholder="Seleccionar tipo de cliente"
                  filterable
                  clearable
                  default-first-option
                  @change="setStorage(providerNewForm)"
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
                v-if="providerNewForm.customerType == 2"
              >
                <el-select
                  class="w-full"
                  v-model="providerNewForm.customerTypeNatural"
                  size="small"
                  placeholder="Seleccionar tipo de persona natural"
                  filterable
                  clearable
                  default-first-option
                  @change="setStorage(providerNewForm)"
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
              <div class="col-span-4" v-if="providerNewForm.customerType == 2">
                <el-form-item label="DUI" prop="dui">
                  <el-input
                    type="text"
                    v-model="providerNewForm.dui"
                    size="small"
                    autocomplete="off"
                    placeholder="########-#"
                    v-mask="'########-#'"
                    @change="setStorage(providerNewForm)"
                  />
                </el-form-item>
              </div>
              <div class="col-span-6">
                <el-form-item label="NIT" prop="nit">
                  <el-input
                    type="text"
                    v-model="providerNewForm.nit"
                    size="small"
                    autocomplete="off"
                    placeholder="####-######-###-#"
                    v-mask="'####-######-###-#'"
                    @change="setStorage(providerNewForm)"
                  />
                </el-form-item>
              </div>
              <div
                class="col-span-2"
                v-if="
                  providerNewForm.customerType == 1 ||
                  providerNewForm.customerTypeNatural == 2
                "
              >
                <el-form-item label="NRC" prop="nrc">
                  <el-input
                    type="text"
                    v-model="providerNewForm.nrc"
                    size="small"
                    autocomplete="off"
                    @change="setStorage(providerNewForm)"
                  />
                </el-form-item>
              </div>
            </div>
            <div
              class="grid grid-cols-12 gap-4"
              v-if="
                providerNewForm.customerType == 1 ||
                providerNewForm.customerTypeNatural == 2
              "
            >
              <div class="col-span-4">
                <el-form-item
                  label="Tipo de contribuyente"
                  prop="customerTaxerType"
                >
                  <el-select
                    class="w-full"
                    v-model="providerNewForm.customerTaxerType"
                    size="small"
                    placeholder="Seleccionar tipo de contribuyente"
                    filterable
                    clearable
                    default-first-option
                    @change="setStorage(providerNewForm)"
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
                    v-model="providerNewForm.giro"
                    size="small"
                    autocomplete="off"
                    maxlength="150"
                    minlength="5"
                    show-word-limit
                    @change="setStorage(providerNewForm)"
                  />
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end">
        <el-button type="primary" size="small" native-type="submit"
          >Guardar</el-button
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
  parseErrors,
  hasModule,
} from "../../tools";
import Notification from "../../components/Notification";

const storagekey = "new-provider";

export default {
  name: "ProviderNew",
  head: {
    titleTemplate: `%s | Nuevo provider`,
  },
  components: { LayoutContent, Notification },
  fetch() {
    const customerTypes = () => this.$axios.get(`/customers/types`);
    const customerTypeNaturals = () =>
      this.$axios.get(`/customers/type-naturals`);
    const customerTaxerTypes = () => this.$axios.get(`/customers/taxer-types`);
    const countries = () => this.$axios.get(`/others/countries`);
    const states = () => this.$axios.get(`/others/states`);
    const cities = () => this.$axios.get(`/others/cities`);

    Promise.all([
      customerTypes(),
      customerTypeNaturals(),
      customerTaxerTypes(),
      countries(),
      states(),
      cities(),
    ])
      .then((res) => {
        const [
          customerTypes,
          customerTypeNaturals,
          customerTaxerTypes,
          countries,
          states,
          cities,
        ] = res;

        this.customerTypes = customerTypes.data.data;
        this.customerTypeNaturals = customerTypeNaturals.data.data;
        this.customerTaxerTypes = customerTaxerTypes.data.data;
        this.countries = countries.data.data;
        this.rawStates = states.data.data;
        this.rawCities = cities.data.data;
      })
      .catch((err) => {
        this.$message.error(err.response.data.message);
        this.$router.push("/customers");
      })
      .then((alw) => (this.pageloading = false));

    checkBeforeEnter(this, storagekey, "customersNewForm");
  },
  fetchOnServer: false,
  beforeRouteLeave(to, from, next) {
    checkBeforeLeave(this, storagekey, next);
  },
  data() {
    return {
      pageloading: true,
      countries: [],
      rawStates: [],
      rawCities: [],
      customerTypes: [],
      customerTypeNaturals: [],
      customerTaxerTypes: [],
      providerNewForm: {
        name: "",
        shortName: "",
        isCustomer: false,
        dui: null,
        nit: "",
        nrc: "",
        giro: "",
        customerType: null,
        customerTypeNatural: null,
        customerTaxerType: null,
        contactName: "",
        address1: "",
        address2: "",
        phone: "",
        email: "",
        country: 1,
        state: "",
        city: "",
      },
      providerNewFormRules: {
        name: inputValidation(true, 5, 100),
        shortName: inputValidation(true, 3, 15),
        isCustomer: false,
        address1: inputValidation(true, 5, 150),
        address2: inputValidation(false, 5, 150),
        country: selectValidation(true),
        state: selectValidation(true),
        city: selectValidation(true),
        contactName: inputValidation(false, 5, 50),
        phone: inputValidation(false),
        email: inputValidation(false, null, null, "email"),
        customerType: selectValidation(true),
        nit: inputValidation(true),
        nrc: inputValidation(true, 3),
        customerTaxerType: selectValidation(true),
        giro: inputValidation(true, 5, 150),
        customerTypeNatural: selectValidation(true),
      },
    };
  },
  methods: {
    setStorage(providerNewForm) {
      localStorage.setItem(storagekey, JSON.stringify(providerNewForm));
    },
    clearSelect(name) {
      switch (name) {
        case "state":
          this.providerNewForm.state = "";
          this.providerNewForm.city = "";
          break;
        case "city":
          this.providerNewForm.city = "";
          break;
      }
      this.setStorage(this.providerNewForm);
    },
    submitNewProvider(formName, formData) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$confirm(
          "¿Estás seguro que deseas guardar este nuevo proveedor?",
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
                  .post("/providers", {
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
                      contactName: formData.contactName,
                      contactInfo: {
                        phones: [formData.phone ? formData.phone : ""],
                        emails: [formData.email ? formData.email : ""],
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
                    localStorage.removeItem(storagekey);
                    setTimeout(() => {
                      this.$confirm(
                        "¿Deseas crear un nuevo proveedor?",
                        "Confirmación",
                        {
                          confirmButtonText: "Si, porfavor",
                          cancelButtonText: "No, gracias",
                          type: "warning",
                          closeOnClickModal: false,
                          closeOnPressEscape: false,
                        }
                      )
                        .then(() => {
                          this.$refs[formName].resetFields();
                        })
                        .catch(() => {
                          this.$router.push("/providers");
                        });
                    }, 500);
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
    hasModule(modules) {
      return hasModule(modules, this.$auth.user);
    },
  },
  computed: {
    states() {
      return this.rawStates.filter(
        (s) => s.country.id == this.providerNewForm.country
      );
    },
    cities() {
      return this.rawCities.filter(
        (c) => c.state.id == this.providerNewForm.state
      );
    },
  },
};
</script>

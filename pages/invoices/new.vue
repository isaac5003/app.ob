<template>
  <layout-content
    v-loading="loading"
    page-title="Nueva Factura"
    :breadcrumb="[
      { name: 'Facturas', to: '/invoices' },
      
      { name: 'Nueva factura', to: null },
    ]"
  >
    <el-form
      :model="customersNewForm"
      :rules="customersNewFormRules"
      status-icon
      ref="customersNewForm"
      @submit.native.prevent="
        submitNewCustomer('customersNewForm', customersNewForm)
      "
    
    >
    <div class="flex flex-col ">
        <!-- first row -->
        <div class="grid grid-cols-12 gap-4">
          <!-- tipo de documento -->
          <div class="col-span-5 flex">
           <div class="isRequired">
             <el-form-item label="Tipo de documento" prop="name">
                <el-select v-model="value" size="small" placeholder="Select">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
             </el-form-item>
           </div>
          </div>
          <!-- n° autorizacion -->
          <div class="col-span-2">
           <div class="isRequired">
             <el-form-item label="N° de autorización" >
                <el-input
                  size="small"
                  placeholder=""
                  v-model="input"
                  :disabled="true">
              </el-input>
             </el-form-item>
           </div>
          </div>
           <!-- n° Correlativo -->
          <div class="col-span-2">
           <div class="isRequired">
             <el-form-item label="N° de correlativo" >
                <el-input
                  size="small"
                  placeholder=""
                  v-model="input"
                  :disabled="true">
              </el-input>
             </el-form-item>
           </div>
          </div>
          <!-- Fecha Factura -->
          <div class="col-span-2">
           <div class="isRequired">
             <el-form-item label="Fecha de factura" >
                 <el-date-picker
                    size="small"
                    type="date"
                    placeholder=""
                    :picker-options="pickerOptions">
                 </el-date-picker>
             </el-form-item>
           </div>
          </div>
        </div>

        <!-- second row -->
        <div class="grid grid-cols-12 gap-4">
          <!-- cliente -->
          <div class="col-span-3">
            <div class="isRequired">
             <el-form-item label="Cliente" prop="name">
                <el-select v-model="value" size="small" placeholder="Select">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
             </el-form-item>
           </div>
          </div>
          <!-- sucursal -->
          <div class="col-span-2">
            <el-form-item label="Sucursal" prop="name">
                <el-select v-model="value" size="small" placeholder="Select">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
             </el-form-item>
          </div>
          <!-- condiciones de pago -->
          <div class="col-span-3">
            <el-form-item label="Condiciones de pago" prop="name">
                <el-select v-model="value" size="small" placeholder="Select">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
             </el-form-item>
            </div>
          
          <!-- Venta a cuenta de -->
          <div class="col-span-4"></div>
            
             <el-form-item label="Venta a cuenta de" prop="name">
                <el-select v-model="value" size="small" placeholder="Select">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
             </el-form-item>
          
        </div>

        <!-- third row -->
        <div class="flex flex-row grid grid-cols-12 gap-4">
         
          <!-- NRC -->
          <div class="col-span-1">
            <span>NRC</span>
          </div>
          <!-- NIT -->
          <div class="col-span-2"> 
            <span>NIT</span>
          </div>
          <!-- Direccion -->
          <div class="col-span-3">
            <span>Dirección</span>
          </div>
          <!-- departamento -->
          <div class="col-span-2">
            <span>Departamento</span>
          </div>
          <!-- Municipio -->
          <div class="col-span-2">
            <span>Municipio</span>
          </div>
          <!-- Giro -->
          <div class="col-span-2">
            <span>Giro</span>
          </div>
        </div>

        <!-- fourth row -->
        <div class="grid grid-cols-12 ">
         <div class="cols-span-12 col-start-11 col-end-12 my-4">
              <el-button type="primary" size="small"  native-type="submit"
              >Agregar Servicio</el-button>
        </div>
        </div>
     </div>


      <div class="flex justify-end " v-if="activeTab != 'integrations'">
        <el-button type="primary" size="small" native-type="submit"
          >Guardar</el-button
        >
        <el-button size="small" @click="$router.push('/customers')"
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

const storagekey = "new-customer";

export default {
  name: "CustomerNew",
  components: { LayoutContent, Notification },
  fetch() {
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
          countries,
          states,
          cities,
        ] = res;

        this.customerTypes = customerTypes.data.types;
        this.customerTypeNaturals = customerTypeNaturals.data.typeNaturals;
        this.customerTaxerTypes = customerTaxerTypes.data.taxerTypes;
        this.countries = countries.data.countries;
        this.rawStates = states.data.states;
        this.rawCities = cities.data.cities;
        this.loading = false;
      })
      .catch((err) => {
        this.$message.error(err.response.data.message);
        this.$router.push("/customers");
      });

    checkBeforeEnter(this, storagekey, "customersNewForm");
  },
  fetchOnServer: false,
  beforeRouteLeave(to, from, next) {
    checkBeforeLeave(this, storagekey, next);
  },
  data() {
    return {
      loading: false,
      activeTab: "general-information",
      countries: [],
      rawStates: [],
      rawCities: [],
      customerTypes: [],
      customerTypeNaturals: [],
      customerTaxerTypes: [],
      customersNewForm: {
        name: "",
        shortName: "",
        isProvider: false,
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
        country: "",
        state: "",
        city: "",
      },
      customersNewFormRules: {
        name: inputValidation(true, 5, 100),
        shortName: inputValidation(true, 3, 15),
        isProvider: false,
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
      },
    };
  },
  methods: {
    setStorage(customersNewForm) {
      localStorage.setItem(storagekey, JSON.stringify(customersNewForm));
    },
    clearSelect(name) {
      switch (name) {
        case "state":
          this.customersNewForm.state = "";
          this.customersNewForm.city = "";
          break;
        case "city":
          this.customersNewForm.city = "";
          break;
      }
      this.setStorage(this.customersNewForm);
    },
    submitNewCustomer(formName, formData) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$confirm(
          "¿Estás seguro que deseas guardar este nuevo cliente?",
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
                  .post("/customers", {
                    name: formData.name,
                    shortName: formData.shortName,
                    isProvider: formData.isProvider,
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
                    localStorage.removeItem(storagekey);
                    setTimeout(() => {
                      this.$confirm(
                        "¿Deseas crear un nuevo cliente?",
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
                          this.$router.push("/customers");
                        });
                    }, 500);
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
  computed: {
    states() {
      return this.rawStates.filter(
        (s) => s.country.id == this.customersNewForm.country
      );
    },
    cities() {
      return this.rawCities.filter(
        (c) => c.state.id == this.customersNewForm.state
      );
    },
  },
};
</script>

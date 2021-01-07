<template>
  <layout-content v-loading="loading" page-title="Reportes" :breadcrumb="[
      { name: 'Ventas', to: '/invoices' },
      { name: 'Reportes', to: null },
    ]">
    <div class="flex flex-col space-y-2">
      <div class="flex justify-center" v-if="errorMessage">
        <Notification class="w-1/2" type="danger" title="Error de comunicación" :message="errorMessage" :action="{
            title: 'Intentar nuevamente',
            function: () => $router.go(),
          }" />
      </div>
    </div>
    <div class="flex flex-col">
      <el-form 
      label-position="top"
       :model="filterForm"
      :rules="rulesInputData"
       status-icon
       ref="reportsForm"
       @submit.native.prevent="generateReport('reportsForm')"
      >
      <div class="grid grid-cols-12 gap-4">
        <div class="col-start-1 col-span-3">
            <el-form-item prop="name">
            <span slot="label">Seleccione el reporte</span>
            <el-select
              filterable
              clearable
              v-model="filterForm.reportType"
              placeholder="Seleccione el reporte"
              size="small"
              class="w-full"
              default-first-option
            >
              <el-option
                v-for="report in reports"
                :key="report.id"
                :label="report.name"
                :value="report.id"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div class="flex flex-col " v-if="filterForm.reportType !='' ">
      <div class="grid grid-cols-12 gap-4">
          <div class="col-span-4">
            <el-form-item label="Rango de fechas:" prop="dateRange">
              <el-date-picker
                v-model="filterForm.dateRange"
                style="width:100%"
                size="small"
                type="daterange"
                range-separator="-"
                start-placeholder="Fecha inicial"
                end-placeholder="Fecha final"
                editable="false"
                format="dd/MM/yyyy"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="col-span-4">
            <el-form-item label="Cliente:">
              <el-select
                v-model="filterForm.customer"
                size="small"
                class="w-full"
                clearable
                filterable
                default-first-option
                placeholder="Todos los clientes:"
              >
                <el-option-group key="ACTIVOS" label="ACTIVOS">
                  <el-option
                  label="Todos los clientes"
                  value=""/>
                  <el-option
                    v-for="item in activeCustomers"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-option-group>
                <el-option-group key="INACTIVOS" label="INACTIVOS">
                  <el-option
                    v-for="item in inactiveCustomers"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item label="Tipo fact:">
              <el-select
                v-model="filterForm.invoiceType"
                size="small"
                clearable
                placeholder="Todos los tipos:"
                class="w-full"
              >
              <el-option label="Todos los tipos" value=""/>
                <el-option
                  v-for="item in documentTypes"
                  :key="item.id"
                  :label="`${item.code} - ${item.name}`"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item label="Estado:">
              <el-select
                v-model="filterForm.status"
                size="small"
                clearable
                placeholder="Todos los estados:"
                class="w-full"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <!-- div vendedor, zona servicio-->
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-3">
            <el-form-item label="Vendedor:">
              <el-select
                v-model="filterForm.seller"
                size="small"
                clearable
                filterable
                default-first-option
                placeholder="Todos los clientes:"
                class="w-full"
              >
                <el-option-group key="ACTIVOS" label="ACTIVOS">
                    <el-option label="Todos los clientes" value=""/>
                  <el-option
                    v-for="item in activeSellers"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-option-group>
                <el-option-group key="INACTIVOS" label="INACTIVOS">
                  <el-option
                    v-for="item in inactiveSellers"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-3">
            <el-form-item label="Zona:">
              <el-select
                v-model="filterForm.zone"
                size="small"
                clearable
                filterable
                default-first-option
                placeholder="Todos las Zonas"
                class="w-full"
              >
                <el-option-group key="ACTIVOS" label="ACTIVOS">
                    <el-option label="Tados las zonas" value=""/>
                  <el-option
                    v-for="item in activeZones"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-option-group>
                <el-option-group key="INACTIVOS" label="INACTIVOS">
                  <el-option
                    v-for="item in inactiveZones"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </div>
          <div class=" col-span-3">
            <el-form-item label="Servicios:">
              <el-select
                v-model="filterForm.service"
                size="small"
                clearable
                default-first-option
                placeholder="Todos los servicios"
                class="w-full"
              >
                <el-option-group key="ACTIVOS" label="ACTIVOS">
                    <el-option label="Todos los servicios" value=""/>
                  <el-option
                    v-for="item in activeService"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-option-group>
                <el-option-group key="INACTIVOS" label="INACTIVOS">
                  <el-option
                    v-for="item in inactiveService"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </div>
        </div>
          </div>
               <div class="flex justify-end gap-4">
          <el-form-item>
            <el-button 
            type="primary" 
            size="small" 
            icon="el-icon-download"
            :disabled="filterForm.reportType ? false : true" 
            :loading="generating">Descargar
            </el-button>
          </el-form-item>

          <el-form-item>
            <el-button 
            @click="cancel"
            size="small"
                       >
            Cancelar
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </layout-content>
</template>
<script>
  import LayoutContent from "../../components/layout/Content";
  import Notification from "../../components/Notification";
  import { inputValidation, selectValidation } from "../../tools";
  export default {
    name: "InvoicesIndex",
    components: {
      LayoutContent,
      Notification
    },
    fetch() {
    const activeCustomers = () =>
      this.$axios.get("/customers", { params: { active: true } });
    const inactiveCustomers = () =>
      this.$axios.get("/customers", { params: { active: false } });
    const documentTypes = () => this.$axios.get("/invoices/document-types");
    const activeSellers = () =>
      this.$axios.get("/invoices/sellers", { params: { active: true } });
    const inactiveSellers = () =>
      this.$axios.get("/invoices/sellers", { params: { active: false } });
    const activeZones = () =>
      this.$axios.get("/invoices/zones", { params: { active: true } });
    const inactiveZones = () =>
      this.$axios.get("/invoices/zones", { params: { active: false } });
    const activeService = () =>
      this.$axios.get("/services", { params: { active: true } });
    const inactiveService = () =>
      this.$axios.get("/services", { params: { active: false } });
    
    //  const zonaActiva = () => 
    //  this.$axios.get("/invoice/details")
    Promise.all([
      activeCustomers(),
      inactiveCustomers(),
      activeSellers(),
      inactiveSellers(),
      activeZones(),
      inactiveZones(),
      activeService(),
      inactiveService(),
      documentTypes(),
    ])
      .then((res) => {
        const [
          activeCustomers,
          inactiveCustomers,
          activeSellers,
          inactiveSellers,
          activeZones,
          inactiveZones,
          activeService,
          inactiveService,
          documentTypes,
        ] = res;
        this.activeCustomers = activeCustomers.data.customers;
        this.inactiveCustomers = inactiveCustomers.data.customers;
        this.documentTypes = documentTypes.data.documentTypes;
        this.activeSellers = activeSellers.data.sellers;
        this.inactiveSellers = inactiveSellers.data.sellers;
        this.activeZones = activeZones.data.zones;
        this.inactiveZones = inactiveZones.data.zones;
        this.activeService = activeService.data.services;
        this.inactiveService = inactiveService.data.services;
        this.loading = false;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message
          ? err.response.data.message
          : "Comunicate con el administrador del sistema.";
      });
  },
  fetchOnServer: false,
    data() {
      return {
        centerDialogVisible: false,
        loading: false,
        errorMessage: "",

     filterForm:{
     reportType:"",
      dateRange:"",
      customer:"",
      invoiceType:"",
      status:"",
      seller:"",
      zone:"",
      service:"",
      },
      rulesInputData:{ 
       dateRange: selectValidation("blur", true),
        },
      reports:[
        {
          id: 1,
          name:"Detalle de reportes"
        }
      ],
        page: {
          limit: 10,
          page: 1,
        },
      };
      
    },
     activeCustomers:   [],
      inactiveCustomers: [],
      documentTypes:     [],
      activeSellers:     [],
      inactiveSellers:   [],
      activeZones:       [],
      inactiveZones:     [],
      activeService:     [],
      inactiveService:   [],
    methods: {  
      cancel(){
        this.$confirm('¿Estás seguro que deseas salir?', 'Confirmación',{
          confirmButtonText: 'Si, salir',
          cancelButtonText:  'Cancel',
          type: 'warning'
          
          }).then(()=>{
            this.$router.push("/invoices");
          });

      },
      fetchInvoices() {
        let params = this.page;
        if (this.status !== "") {
          params = {
            ...params,
            active: this.status
          };
        }
        if (this.searchValue !== "") {
          params = {
            ...params,
            search: this.searchValue.toLowerCase()
          };
        }

        this.$axios
          .get("/invoices", {
            params
          })
          .then((res) => {
            this.invoices = res.data;
          })
          .catch((err) => {
            this.errorMessage = err.response.data.message;
          });
      },
      handleSizeChange(val) {
        this.page.limit = val;
        this.fetchInvoices();
      },
      changeActive({
        id,
        isActiveInvoice
      }) {
        const action = isActiveInvoice ? "desactivar" : "activar";
        this.$confirm(
          `¿Estás seguro que deseas ${action} este cliente?`,
          "Confirmación", {
            confirmButtonText: `Si, ${action}`,
            cancelButtonText: "Cancelar",
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "Procesando...";
                this.$axios
                  .put(`/invoices/status/${id}`, {
                    status: !isActiveInvoice
                  })
                  .then((res) => {
                    this.$notify.success({
                      title: "Éxito",
                      message: res.data.message,
                    });
                    this.fetchInvoices();
                  })
                  .catch((err) => {
                    this.$notify.error({
                      title: "Error",
                      message: err.response.data.message,
                    });
                  })
                  .then((alw) => {
                    instance.confirmButtonLoading = false;
                    instance.confirmButtonText = `Si, ${action}`;
                    done();
                  });
              }
              done();
            },
          }
        );
      },
      deleteInvoice({
        id
      }) {
        this.$confirm(
          `¿Estás seguro que deseas eliminar este cliente?`,
          "Confirmación", {
            confirmButtonText: `Si, eliminar`,
            cancelButtonText: "Cancelar",
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "Procesando...";
                this.$axios
                  .delete(`/invoices/${id}`)
                  .then((res) => {
                    this.$notify.success({
                      title: "Éxito",
                      message: res.data.message,
                    });
                    this.fetchInvoices();
                  })
                  .catch((err) => {
                    this.$notify.error({
                      title: "Error",
                      message: err.response.data.message,
                    });
                  })
                  .then((alw) => {
                    instance.confirmButtonLoading = false;
                    instance.confirmButtonText = `Si, eliminar`;
                    done();
                  });
              }
              done();
            },
          }
        );
      },
      async openInvoicePreview({
        id
      }) {
        const {
          data
        } = await this.$axios.get(`/invoices/${id}`);
        this.selectedInvoice = data.invoice;
        this.showInvoicePreview = true;
      },
    },
  };
</script>
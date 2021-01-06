<template>
  <layout-content 
  v-loading="loading" 
  page-title="Reportes" 
  :breadcrumb="[
      { name: 'Contabilidad', to: '/entries' },
      { name: 'Reportes', to: null },
    ]">

    <div class="flex flex-col space-y-2">
      <div class="flex justify-center" v-if="errorMessage">
        <Notification 
        class="w-1/2" 
        type="danger" 
        title="Error de comunicación" 
        :message="errorMessage" 
        :action="{
            title: 'Intentar nuevamente',
            function: () => $router.go(),
          }" />
      </div>
      <el-form 
      label-position="top" 
      :model="filterForm" 
      :rules="selectValidation1"
      status-icon 
      ref="reportsForm"
      @submit.native.prevent="generateReport('reportsForm')">

        <div class="grid grid-cols-12 gap-4">
          <div class="col-start-1 col-span-3">
            <el-form-item label="Selecciones el reporte" prop="reportType" >
              <el-select 
              v-model="filterForm.reportType"
              placeholder="Seleccione reporte" 
              size="small" 
              class="w-full"
              default-first-option
               filterable 
               clearable>
                <el-option-group
                v-for="report in reports"
                :key="report.label"
                :label="report.label"
                :value="report.id"
                 >
                 <el-option 
               v-for="report in report.reports" 
               :key="report.id" 
               :label="report.name" 
               :value="report.id">
                </el-option>
                <el-option
                v-for="report in report.reports1"
                :key="report.id"
                :label="report.name"
                :value="report.id"
                >

                </el-option>
                </el-option-group>

          
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div>
        </div>
        <div class="flex flex-col " v-if="filterForm.reportType !='' ">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4">
              <el-form-item label="Seleccione la fechas:" prop="month">
                <el-date-picker 
                v-model="filterForm.month" 
                style="width:100%" 
                size="small" 
                type="month"
                filterable 
                clearable
                defaul-first-option 
                >
                </el-date-picker>
              </el-form-item>
            </div>
          </div>
          </div>
          <div class=" flex flex-col" v-if="filterForm.catalogo != '' " >
          </div>
        <div class="flex justify-end gap-4">
          <el-form-item>
            <el-button 
            type="primary" 
            size="small" 
            icon="el-icon-download" 
            :loading="generating">Descargar
            </el-button>
          </el-form-item>

          <el-form-item>
            <el-button size="small"  @click="cancel">
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
import { selectValidation } from '../../tools';
  export default {
    name: "EntriesIndex",
    components: {
      LayoutContent,
      Notification
    },
    // fetch() {
    //   const invoices = () => {
    //     return this.$axios.get("/invoices", { params: this.page });
    //   };

    //   Promise.all([invoices()])
    //     .then((res) => {
    //       const [invoices] = res;
    //       this.invoices = invoices.data;
    //       this.loading = false;
    //     })
    //     .catch((err) => {
    //       this.errorMessage = err.response.data.message;
    //     });
    // },
    // fetchOnServer: false,
    data() {
      return {
        loading: false,
        errorMessage: "",
        filterForm: {
          reportType: "",
          catalogo:"",
          month:""
        },
         selectValidation1:{
          reportType:selectValidation("change", true),
          month:selectValidation("change", true),
         },

        entries: {
          entries: [],
          count: 0,
        },

        reports: [
         {
           reports:[
           {id: 1, name: "Balance General" },
           {id: 2, name: "Balance de comprobación"}
          
           ],
           
         },
         {
          label:"AXULIARES",
           reports1:[
           {id: 3, name: "Libro diario mayor" },
           {id: 4, name: "Libro de auxiliares"},
           {id:"5", name: "Catalógo de cuentas" },
           {id: 6, name: "Detalle de movimiento cuentas"}
           ],
         },
           ],
           


      };

    },
    
    methods: {
     cancel(){
       this.$confirm('¿Estás seguro que deseas salir?', 'Confirmación',{
         confirmButtonText:'Si, salir',
         cancelButtonText: 'Cancel',
         type:'warning'
       }).then(()=>{
         this.$router.push("/entries");
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
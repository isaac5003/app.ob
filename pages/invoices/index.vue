<template>
  <layout-content
    v-loading="loading"
    page-title="Listado de facturas"
    :breadcrumb="[
      { name: 'Facturación', to: '/invoices' },
      { name: 'Listado de facturas', to: null },
    ]"
       >
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
          }"
        />
      </div>
      
      <el-form label-position="top" class="flex flex-col ">
        <div class="grid grid-cols-12 space-x-4">

          <div class="col-start-10 col-span-3">
            <el-form-item>
                <el-input
              suffix-icon="el-icon-search"
              placeholder="Buscar..."
              v-model="searchValue"
              size="small"
              clearable
              v-debounce:500ms="fetchInvoices"
              @change="fetchInvoices"
            />
               </el-form-item>
          </div>
        </div>
        <!-- Colocamos los input corespondientes-->
        <!--No hay etiquetas que agregar-->
        <div class="grid grid-cols-12 gap-x-4  ">
              <div class="col-span-4 w-full">
    <span class="text-gray-700 text-xs">Rango de fechas:</span>
      <el-form-item>
        <el-date-picker
      v-model="value1"
      style="width:100%"
      size="small"
      type="datetimerange"
      range-separator="-"
      start-placeholder="Fecha inicial"
      end-placeholder="Fecha final">
    </el-date-picker>
      </el-form-item>
    </div>
 
       <div class="col-span-4 w-full">
          <span class="text-gray-700 text-xs" > Cliente:</span>
         <el-form-item>
         <el-select 
         v-model="clienV" 
         size="small"
          style="width:100%"
        clearable placeholder="Todos los clientes:">
   <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
         </el-form-item>
  </div>

   <div class="col-span-2 w-full ">
         <span class="text-gray-700 text-xs" > Tipo fact:</span>
         <el-form-item> 
         <el-select 
         v-model="TypeFact" 
         size="small"
        
         clearable placeholder="Todos los tipos:">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
    
       </el-form-item>  
  </div>
   <div class="col-span-2 w-full">
     <span class="text-gray-700 text-xs" > Estado:</span>
     <el-form-item>
    <el-select v-model="status"
           size="small"
          
           clearable placeholder="Todos los estados:">
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
   <!-- div vendedor, zona-->
      <div class="grid grid-cols-12 space-x-4 gap-x-4"  >
        <div class="col-span-3  ">
          <span class="text-gray-700 text-xs" > Vendedor:</span>
          <el-form-item>
            <el-select v-model="VendClie" 
           size="small"
           
          clearable placeholder="Todos los clientes:">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
    </el-select>
          </el-form-item>
            
        
        </div>
                <div class="col-span-3">
          <span class="text-gray-700 text-xs" > Zona:</span>
          <el-form-item>
                 <el-select v-model="zonaValue" 
           size="small"
          
          clearable placeholder="Todos las Zona:">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
          </el-form-item>

        </div>
        <div class=" col-span-3">
          <span class="text-gray-700 text-xs" > Servicio:</span>
          <el-form-item>
            <el-select v-model="servVlue" 
           size="small"
        
          clearable placeholder="Todos los servicio:">
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
      </el-form>
      <el-table :data="resultados" stripe size="mini">
        <el-table-column prop="index" min-width="40" />
        <el-table-column label="Nombre" prop="nombre" min-width="350" />
        <el-table-column label="Tipo" prop="tipo" min-width="120" />
        <el-table-column label="NIT" prop="nit" min-width="160" />
        <el-table-column label="NRC" prop="nrc" min-width="90" />
        <el-table-column label="NIT" prop="nit" min-width="160" />
        <el-table-column label="NRC" prop="nrc" min-width="90" />
        <el-table-column label="Estado" min-width="90">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.isActiveInvoice"
              >Activo</el-tag
            >
            <el-tag size="small" type="warning" v-else>Inactivo</el-tag>
          </template>
        </el-table-column>
        <el-table-column label min-width="60" align="center">
          <template slot-scope="scope">
            <el-dropdown trigger="click" szie="mini">
              <el-button icon="el-icon-more" size="mini" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="openInvoicePreview(scope.row)">
                  <i class="el-icon-view"></i> Vista previa
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="
                    $router.push(`/invoices/edit?ref=${scope.row.id}`)
                  "
                >
                  <i class="el-icon-edit-outline"></i> Editar cliente
                </el-dropdown-item>
                <el-dropdown-item @click.native="changeActive(scope.row)">
                  <span v-if="scope.row.isActiveInvoice">
                    <i class="el-icon-close"></i> Desactivar
                  </span>
                  <span v-else> <i class="el-icon-check"></i> Activar </span>
                  cliente
                </el-dropdown-item>
                <el-dropdown-item
                  :divided="true"
                  class="text-red-500 font-semibold"
                  @click.native="deleteInvoice(scope.row)"
                >
                  <i class="el-icon-delete"></i> Eliminar cliente
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="fetchInvoices"
          :current-page.sync="page.page"
          :page-sizes="[5, 10, 15, 25, 50, 100]"
          :page-size="page.size"
          layout="total, sizes, prev, pager, next"
          :total="parseInt(invoices.count)"
          :pager-count="5"
        />
      </div>
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
export default {
  name: "InvoicesIndex",
  components: { LayoutContent, Notification },
  fetch() {
    const invoices = () => {
      return this.$axios.get("/invoices", { params: this.page });
    };

    Promise.all([invoices()])
      .then((res) => {
        const [invoices] = res;
        this.invoices = invoices.data;
        this.loading = false;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message;
      });
  },
  fetchOnServer: false,
  data() {
    return {
      loading: false,
      errorMessage: "",
      searchValue: "",
      rangFech:"",
      clienV:"",
      TypeFact:"",
      status:"",
      VendClie:"",
      zonaValue:"",
      servVlue:"",
    
    invoices: {
        invoices: [],
        count: 0,
      },
      options: [{
          value: 'Option1',
          label: 'Option1'
        }, {
          value: 'Option2',
          label: 'Option2'
        }, {
          value: 'Option3',
          label: 'Option3'
        }, {
          value: 'Option4',
          label: 'Option4'
        }, {
          value: 'Option5',
          label: 'Option5'
        }],
        
        value: '',
      page: {
        limit: 10,
        page: 1,
      },

      resultados:[
        {
      
          nombre: 'Isaac',
          tipo: 'moreno',
          nit: '123434',
          nrc:'123',
          nit:'1223',
          nrc:'12322'        
                }
      ]
    };
  },
  methods: {
    fetchInvoices() {
      let params = this.page;
      if (this.status !== "") {
        params = { ...params, active: this.status };
      }
      if (this.searchValue !== "") {
        params = { ...params, search: this.searchValue.toLowerCase() };
      }

      this.$axios
        .get("/invoices", { params })
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
    changeActive({ id, isActiveInvoice }) {
      const action = isActiveInvoice ? "desactivar" : "activar";
      this.$confirm(
        `¿Estás seguro que deseas ${action} este cliente?`,
        "Confirmación",
        {
          confirmButtonText: `Si, ${action}`,
          cancelButtonText: "Cancelar",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "Procesando...";
              this.$axios
                .put(`/invoices/status/${id}`, { status: !isActiveInvoice })
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
    deleteInvoice({ id }) {
      this.$confirm(
        `¿Estás seguro que deseas eliminar este cliente?`,
        "Confirmación",
        {
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
    async openInvoicePreview({ id }) {
      const { data } = await this.$axios.get(`/invoices/${id}`);
      this.selectedInvoice = data.invoice;
      this.showInvoicePreview = true;
    },
  },
};
</script>

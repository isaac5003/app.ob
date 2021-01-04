<template>
  <layout-content
    v-loading="loading"
    page-title="Listado de ventas"
    :breadcrumb="[
      { name: 'Ventas', to: '/invoices' },
      { name: 'Listado de ventas', to: null },
    ]"
  >
    <div class="flex flex-col space-y-4">
      <Notification
        v-if="errorMessage"
        class="w-full"
        type="danger"
        title="Error de comunicación"
        :message="errorMessage"
      />
      <el-form label-position="top" class="flex flex-col ">
        <div class="grid grid-cols-12 gap-4">
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
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-4">
            <el-form-item label="Rango de fechas:">
              <el-date-picker
                v-model="filter.dateRange"
                style="width:100%"
                size="small"
                type="daterange"
                range-separator="-"
                start-placeholder="Fecha inicial"
                end-placeholder="Fecha final"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="col-span-4">
            <el-form-item label="Cliente:">
              <el-select
                v-model="filter.customer"
                size="small"
                class="w-full"
                clearable
                filterable
                default-first-option
                placeholder="Todos los clientes:"
                  @change="fetchInvoices"
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
                v-model="filter.invoiceType"
                size="small"
                clearable
                placeholder="Todos los tipos:"
                class="w-full"
                  @change="fetchInvoices"
              >
              <el-option label="Todos los tipos" value=""/>
                <el-option
                  v-for="item in documentTypes"
                  :key="item.id"
                  :label="`${item.code} - ${item.name}` "
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <!-- <div class="col-span-2">
            <el-form-item label="Estado:">
              <el-select
                v-model="filter.status"
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
          </div> -->
        </div>
        <!-- div vendedor, zona servicio-->
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-3">
            <el-form-item label="Vendedor:">
              <el-select
                v-model="filter.seller"
                size="small"
                clearable
                filterable
                default-first-option
                placeholder="Todos los clientes:"
                class="w-full"
                  @change="fetchInvoices"
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
                v-model="filter.zone"
                size="small"
                clearable
                filterable
                default-first-option
                placeholder="Todos las Zonas"
                class="w-full"
                  @change="fetchInvoices"
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
                v-model="filter.service"
                size="small"
                clearable
                default-first-option
                placeholder="Todos los servicios"
                class="w-full"
                  @change="fetchInvoices"
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
      </el-form>

      <el-table :data="getInvoices" stripe size="small">
        <el-table-column prop="index" min-width="40" />
        <el-table-column label="# Factura"   min-width="120">
         <template slot-scope="scope">
           <span>
             {{ scope.row.authorization }} - {{ scope.row.sequence }}
           </span>
          </template> 
        </el-table-column>
        <el-table-column label="Tipo fact." prop="tipof" min-width="75" />
        <el-table-column label="Fecha" prop="invoiceDate" min-width="90" />
        <el-table-column label="Cliente" prop="customerName" min-width="350" />
        <el-table-column label="Estado" prop="true" min-width="80">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.isActiveInvoice"
              >Activo</el-tag
            >
            <el-tag size="small" type="warning" v-else>Inactivo</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="total" prop="ventaTotal" min-width="80" />
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
                  <i class="el-icon-edit-outline"></i> Editar factura
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="
                    $router.push(`/invoices/edit?ref=${scope.row.id}`)
                  "
                >
                  <i class="el-icon-printer"></i>Imprimir factura
                </el-dropdown-item>
                 <el-dropdown-item @click.native="changeActive(scope.row)">
                  <span v-if="scope.row.isActiveInvoice">
                    <i class="el-icon-close"></i> Desactivar
                  </span>
                  <span v-else> <i class="el-icon-check"></i> Activar </span>
                  cliente
                </el-dropdown-item> -->
                <el-dropdown-item
                  :divided="true"
                  class="text-red-500 font-semibold"
                  @click.native="deleteInvoice(scope.row)"
                >
                  <i class="el-icon-delete"></i>Eliminar factura
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
          :current-page.sync="filter.page.page"
          :page-sizes="[5, 10, 15, 25, 50, 100]"
          :page-size="filter.page.size"
          layout="total, sizes, prev, pager, next"
          :total="parseInt(filter.getInvoices.count)"
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
       
    const getInvoices = () => this.$axios.get("/invoices", {params: this.page});
       
    

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
      getInvoices(),
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
          getInvoices,
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
        this.getInvoices = getInvoices.data.invoices;
      //  console.log(getInvoices.data.invoices);
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
      loading: false,
      errorMessage:  "",
      filter:{
        searchValue:"",
      dateRange:"",
      customer:"",
      invoiceType:"",
      status:"",
      seller:"",
      zone:"",
      service:"",
      getInvoices:{
      getInvoices:[],
      count:0,
       },
      page: {
      limit: 10,
       page:1,
      }
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
    };
  },
 methods: {
    handleSizeChange(val) {
      this.filter.page.limit = val;
      this.fetchInvoices();
    },
    fetchInvoices() {
      let params = this.page;
      if (this.status !== "") {
        params = { ...params, active: this.status };
      }
      if (this.searchValue !== "") {
        params = { ...params, search: this.filter.searchValue.toLowerCase() };
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

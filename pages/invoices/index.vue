<template>
  <layout-content
    v-loading="loading"
    page-title="Listado de ventas"
    :breadcrumb="[
      { name: 'Ventas', to: '/invoices' },
      { name: 'Listado de ventas', to: null },
    ]"
  >
    <div class="flex flex-col space-4">
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
      <el-form label-position="top">
        <div class="grid grid-cols-12 gap-4">
          <div class=" col-start-10 col-span-4">
            <el-form-item>
              <el-input
            suffix-icon="el-icon-search"
            placeholder="Buscar..."
            v-model="searchValue"
            size="small"
              v-debounce:500ms="fetchInvoices"
              @change="fetchInvoices"
          />
            </el-form-item>
          </div>
        </div>
        <div class="flex flex-col">
        <div class="grid grid-cols-12 gap-4">
            <div class=" col-span-4">
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
              v-debounce:500ms="fetchInvoices"
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
              v-debounce:500ms="fetchInvoices"
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
          <div class="col-span-2">
            <el-form-item label="Estado:">
              <el-select
                v-model="filter.status"
                size="small"
                clearable
                placeholder="Todos los estados:"
                class="w-full"
                v-debounce:500ms="fetchInvoices"
              @change="fetchInvoices"
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
                v-debounce:500ms="fetchInvoices"
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
               v-debounce:500ms="fetchInvoices"
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
                v-debounce:500ms="fetchInvoices"
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
        </div>
      </el-form>
      <!--  -->
     <el-dialog
     title="Vista previa"
     size="mini"
     :visible.sync="showInvoicePreview"
     width="900px"
     :append-to-body="true"
     >
  <div class=" flex flex-col space-y-4">
    <div class=" grid grid-cols-12 gap-4">
            <div class="col-span-4 flex flex-col">
              <span class="text-gray-700 font-bold text-sm w-full" >Tipo de documento</span>
              <span>
                {{ Object.keys(selectedInvoice).length > 0 ?  `${selectedInvoice.documentTypes.code} - ${selectedInvoice.documentType.name}` : ""
                }}
              </span>
            </div>
                 <div class=" col-span-2 flex flex-col">
       <span class="text-gray-700 font-bold text-sm w-full" >No. autorización</span>
       <span>{{ selectedInvoice ? selectedInvoice.authorization : ""}}</span>
    </div>
     <div class=" col-span-2 flex flex-col">
       <span class="text-gray-700 font-bold text-sm w-full" > Correlativo</span>
       <span>{{ selectedInvoice   ? selectedInvoice.sequence : ""}}</span>
    </div>
     <div class=" col-span-2  flex flex-col">
       <span class="text-gray-700 font-bold text-sm w-full" > Fecha de factura</span>
       <span>{{ selectedInvoice   ? selectedInvoice.invoiceDate : ""}}</span>
    </div>
     <div class=" col-span-2   flex  flex-col">
           <span class="font-semibold">Estado</span>
            <div v-if="selectedInvoice">
              <el-tag
                size="small"
                type="success"
                v-if="selectedInvoice.isActiveInvoice"
                >Activo</el-tag
              >
              <el-tag size="small" type="warning" v-else>Inactivo</el-tag>
            </div>

     </div>
       
    </div>
  <div class=" grid grid-cols-12 gap-4">
      <div class=" col-span-4 flex flex-col">
       <span class="text-gray-700 font-bold text-sm w-full" >Cliente:</span>
       <span>{{ selectedInvoice ? selectedInvoice.customerName : ""}}</span>
    </div>
     <div class=" col-span-2 flex flex-col">
       <span class="text-gray-700 font-bold text-sm w-full" >Sucursal:</span>
       <span> Casa matriz</span>
    </div>
     <div class=" col-span-3 flex flex-col">
       <span class="text-gray-700 font-bold text-sm w-full" >Condiciones de pago:</span>
       <span>{{ selectedInvoice  ? `${selectedInvoice.paymentConditionName}` : ""}}</span>
    </div>
     <div class=" col-span-3 flex flex-col">
       <span class="text-gray-700 font-bold text-sm w-full" >Venta a cuenta de: </span>
       <span>{{ selectedInvoice  ? `${selectedInvoice.sellerName}` : ""}}></span>
    </div>
  </div>

       <div class=" grid grid-cols-12 gap-4">
      <div class=" col-span-4 flex flex-col">
       <span class="text-gray-700 font-bold text-sm w-full" >Dirección 1:</span>
       <span>{{ selectedInvoice ? selectedInvoice.customerAddress1 : ""}}</span>
    </div>
     <div class=" col-span-4 flex flex-col">
       <span class="text-gray-700 font-bold text-sm w-full" >Dirección 2:</span>
       <span> {{selectedInvoice ? selectedInvoice.customerAddress2 :""}}</span>
    </div>
     <div class=" col-span-2 flex flex-col">
       <span class="text-gray-700 font-bold text-sm w-full" >Departamento:</span>
       <span>{{ selectedInvoice  ? `${selectedInvoice.customerState}` : ""}}</span>
    </div>
     <div class=" col-span-2 flex flex-col">
       <span class="text-gray-700 font-bold text-sm w-full" >Municipio: </span>
       <span>{{ selectedInvoice  ? `${selectedInvoice.customerCity}` : ""}}</span>
    </div>
  </div>

  
       <div class=" grid grid-cols-12 gap-4">
      <div class=" col-span-3 flex flex-col">
       <span class="text-gray-700 font-bold text-sm w-full" >NIT:</span>
       <span>{{ selectedInvoice ? selectedInvoice.customerNit : ""}}</span>
    </div>
     <div class=" col-span-3 flex flex-col">
       <span class="text-gray-700 font-bold text-sm w-full" >DUI:</span>
       <span> {{selectedInvoice ? selectedInvoice.customerDui : ""}}</span>
    </div>
     <div class=" col-span-2 flex flex-col">
       <span class="text-gray-700 font-bold text-sm w-full" >NRC:</span>
       <span>{{ selectedInvoice  ? `${selectedInvoice.customerNrc}` : ""}}</span>
    </div>
     <div class=" col-span-4 flex flex-col">
       <span class="text-gray-700 font-bold text-sm w-full" >GIRO: </span>
       <span>{{selectedInvoice  ? selectedInvoice.customerGiro : "" }}</span>
    </div>
  </div>
   
<el-table
      :data="selectedInvoice.details"
      style="width: 100%">
       <el-table-column
       type="index"
        prop="quantity"
        label="#"
        width="30" 
        />
      <el-table-column
        prop="quantity"
        label="Cant."
        width="55">
      </el-table-column>
      <el-table-column
        prop="chargeDescription" 
        label="Description"
        width="375"/>
     
      <el-table-column
        prop="unitPrice"
        label="Precio Unit."
        width="100"
        >
          <template slot-scope="scope">
                  <span>{{
                    calcUniPrice(selectedInvoice.documentType, scope.row)
                      | formatMoney
                  }}</span>
                </template>
      </el-table-column>
       <el-table-column
        prop="address"
        label="V. No sujeta"
        width="100"
        >
      </el-table-column>
       <el-table-column
        prop="address"
        label="V. Extenta"
        width="100"
        >
      </el-table-column>
       <el-table-column
        prop="ventaPrice"
        label="V. Grabada" 
        width="100"
        >
          <template slot-scope="scope">
                  <span>{{
                    calcUniPrice(selectedInvoice.ventaTotal, scope.row)
                      | formatMoney
                  }}</span>
                </template>
      </el-table-column>
    </el-table>
  
   <!-- sumas -->
        <table class="flex justify-end">
          <tbody class="text-sm divide-y divide-gray-300">
            <tr class="flex space-x-16">
              <td align="right" class="text-blue-900 w-50">SUMAS:</td>
              <td align="right" class="text-gray-800">
                {{ selectedInvoice.sum | formatMoney }}
              </td>
            </tr>
            <tr class="flex space-x-16" >
              <td align="right" class="text-blue-900 w-50">13% Iva:</td>
              <td align="right" class="text-gray-800">
                {{ selectedInvoice.iva | formatMoney }}
              </td>
            </tr>
            <tr class="flex space-x-16">
              <td align="right" class="text-blue-900 w-50">Subtotal:</td>
              <td align="right" class="text-gray-800">
                {{ selectedInvoice.subtotal | formatMoney }}
              </td>
            </tr>
            <tr class="flex space-x-16">
              <td align="right" class="text-blue-900 w-50">Iva retenido:</td>
              <td align="right" class="text-gray-800">
                {{ selectedInvoice.ivaRetenido | formatMoney }}
              </td>
            </tr>
            <tr class="flex space-x-16">
              <td align="right" class="text-blue-900 w-50">Ventas exentas:</td>
              <td align="right" class="text-gray-800">
                {{ selectedInvoice.ventasExentas | formatMoney }}
              </td>
            </tr>
            <tr class="flex space-x-16">
              <td align="right" class="text-blue-900 w-50">
                Ventas no sujetas:
              </td>
              <td align="right" class="text-gray-800">
                {{ selectedInvoice.ventasNoSujetas  | formatMoney }}
              </td>
            </tr>
            <tr class="flex space-x-16">
              <td align="right" class="text-blue-900 font-semibold w-50">
                Venta total:
              </td>
              <td align="right" class="text-gray-800">
                {{ selectedInvoice.ventaTotal | formatMoney }}
              </td>
            </tr>
          </tbody>
        </table>
  </div>

     </el-dialog>
     <!--  -->
        <el-table :data="invoices.invoices" stripe size="small">
        <el-table-column prop="index" min-width="40" />
        <el-table-column label="# Factura"   min-width="120">
         <template slot-scope="scope">
           <span>
             {{ scope.row.authorization }} - {{ scope.row.sequence }}
           </span>
          </template> 
        </el-table-column>
        <!-- <el-table-column label="Tipo fact." prop="tipof" min-width="75" /> -->
        <el-table-column label="Fecha" prop="invoiceDate" min-width="90" />
        <el-table-column label="Cliente" prop="customerName" min-width="350" />
        <el-table-column label="Estado" min-width="80">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.isActiveInvoice"
              >Activo</el-tag
            >
            <el-tag size="small" type="warning" v-else>Inactivo</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Total" min-width="80" align="right">
            <template slot-scope="scope">
              <span>{{ scope.row.ventaTotal | formatMoney }}</span>
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
                  <span class=" text-red-500">
                    <i class="el-icon-delete"></i> Eliminar cliente
                  </span>
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
          :total="invoicesTotal"
          :pager-count="5"
        />
      </div>
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
import { selectValidation } from '../../tools';
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

      const invoices = () =>
        this.$axios.get("/invoices", {params: this.page});

        const invoicesTotal = () =>
        this.$axios.get("/invoices");

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
      invoices(),
      invoicesTotal(),
     
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
          invoices,
          invoicesTotal,
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
        this.invoices=invoices.data;
        this.invoicesTotal=invoicesTotal.data.count;
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
     r:[],
      loading: false,
      errorMessage: "",
      searchValue:"",
      activeCustomers:   [],
      inactiveCustomers: [],
      documentTypes:     [],
      activeSellers:     [],
      inactiveSellers:   [],
      activeZones:       [],
      inactiveZones:     [],
      activeService:     [],
      inactiveService:   [],
      invoicesTotal:[],
      options:[],
     showInvoicePreview:false,
     selectedInvoice:{},
      invoices: {
        invoices: [],
        details:[],
        count: 0,
      },
      page: {
        limit: 10,
        page: 1,
      },
       filter:{
      dateRange:"",
      customer:"",
      invoiceType:"",
      status:"",
      seller:"",
      zone:"",
      service:"",
       },
    };
  },
  methods: {
    fetchInvoices() {
      let params = this.page.size;
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
       calcUniPrice(documentType, { unitPrice, incTax, sellingType }) {
      let uniPrice = null;
      const amount = parseFloat(unitPrice);
      let message = null;
      if ((sellingType.id == 1) | (sellingType.id == 2)) {
        unitPrice = amount;
      } else {
        if (documentType) {
          switch (documentType.id) {
            case 1:
              unitPrice = amount * (incTax ? 1 : 1.13);
              
              break;
            case 2:
              unitPrice = amount / (incTax ? 1.13 : 1);
             
              break;
          }
        } else {
          message = "Debe seleccionar un tipo de docuemnto";
        }
      }
      return unitPrice;
    },
      //  const {data} = await this.$axios.get(`/business/${id}`);
      //  this.selecetedBusiness =data.busine;
      //  this.showInvoicePreview = true;
    

  },
   computed: {
    filteredInvoices() {
      const searchValue = this.searchValue.trim().toLowerCase();
      const {
       dateRange,
      customer,
      invoiceType,
      status,
      seller,
      zone,
      service,
      } = this.filter;

      let filteredInvoices = this.rawInvoices;

      // Filtra por  buscador general
      if (!R.isEmpty(searchValue)) {
        filteredInvoices = filteredInvoices.filter(selectedInvoice => {
          return (
            selectedInvoice.customerName
              .trim()
              .toLowerCase()
              .includes(searchValue) ||
            selectedInvoice.status.name
              .trim()
              .toLowerCase()
              .includes(searchValue) ||
            selectedInvoice.ventaTotal
              .toFixed(2)
              .trim()
              .toLowerCase()
              .includes(searchValue) ||
            selectedInvoice.documentType.code.toLowerCase().includes(searchValue) ||
            selectedInvoice.authorization.toLowerCase().includes(searchValue) ||
            selectedInvoice.sequence.toLowerCase().includes(searchValue)
          );
        });
      }

      // Filtra por rango de fechas
      if (!R.isNil(dateRange)) {
        filteredInvoices = filteredInvoices.filter(selectedInvoice => {
          let date = new Date(selectedInvoice.invoiceDate);
          return moment(date)
            .add(1, "days")
            .isBetween(dateRange[0], moment(dateRange[1]).add(1, "days"));
        });
      }

      // Filtra por cliente
      if (!R.isNil(customer)) {
        filteredInvoices = filteredInvoices.filter(
          selectedInvoice => selectedInvoice.customer.id === customer
        );
      }

      // Filtra por tipo de factura
      if (!R.isNil(invoiceDocumentType)) {
        filteredInvoices = filteredInvoices.filter(
          selectValidation => selectedInvoice.documentType.id === invoiceDocumentType
        );
      }

      // Filtra por estado
      if (!R.isNil(status)) {
        filteredInvoices = filteredInvoices.filter(
          selectedInvoice => selectedInvoice.status.id === status
        );
      }

      // Filtra por vendedor
      if (!R.isNil(seller)) {
        filteredInvoices = filteredInvoices.filter(
          selectedInvoice => selectedInvoice.invoicesSeller.id === seller
        );
      }

      // Filtra por zona
      if (!R.isNil(zone)) {
        filteredInvoices = filteredInvoices.filter(
          invoice => invoice.invoicesZone.id === zone
        );
      }

      // Filtra por servicio
      if (!R.isNil(service)) {
        filteredInvoices = filteredInvoices.filter(
          invoice => invoice.service.id === service
        );
      }

      return filteredInvoices.sort((a, b) => {
        const dateA = new Date(a.invoiceDate);
        const dateB = new Date(b.invoiceDate);
        return dateB - dateA;
      });
    },
    paginatedInvoices() {
      return this.filteredInvoices.slice(
        this.page.number * this.page.size - this.page.size,
        this.page.size * this.page.number
      );
    },
    activeCustomers() {
      return this.rawCustomers.filter(customer => customer.isActiveCustomer);
    },
    inactiveCustomers() {
      return this.rawCustomers.filter(customer => !customer.isActiveCustomer);
    },
    activeServices() {
      return this.rawServices.filter(service => service.active);
    },
    inactiveServices() {
      return this.rawServices.filter(service => !service.active);
    },
    activeSellers() {
      return this.rawSellers.filter(seller => seller.active);
    },
    inactiveSellers() {
      return this.rawSellers.filter(seller => !seller.active);
    },
    activeZones() {
      return this.rawZones.filter(zone => zone.active);
    },
    inactiveZones() {
      return this.rawZones.filter(zone => !zone.active);
    }
  }

};
</script>

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
          <div class="col-start-10 col-span-4">
            <el-form-item>
              <el-input
                suffix-icon="el-icon-search"
                placeholder="Buscar..."
                v-model="filter.searchValue"
                size="small"
                clearable
                v-debounce:500ms="fetchInvoices"
                @change="fetchInvoices"
              />
            </el-form-item>
          </div>
        </div>
        <div class="flex flex-col">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4">
              <el-form-item label="Rango de fechas:">
                <el-date-picker
                  v-model="filter.dateRange"
                  style="width: 100%"
                  size="small"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="Fecha inicial"
                  end-placeholder="Fecha final"
                  format="dd/MM/yyyy"
                  value-format="yyyy-MM-dd"
                  @change="fetchInvoices"
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
                    <el-option label="Todos los clientes" value="" />
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
                  v-model="filter.documentType"
                  size="small"
                  clearable
                  placeholder="Todos los tipos:"
                  class="w-full"
                  v-debounce:500ms="fetchInvoices"
                  @change="fetchInvoices"
                >
                  <el-option label="Todos los tipos" value="" />
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
                  v-model="filter.status"
                  size="small"
                  clearable
                  placeholder="Todos los estados:"
                  class="w-full"
                  v-debounce:500ms="fetchInvoices"
                  @change="fetchInvoices"
                >
                  <el-option label="Todos los estados" value="" />
                  <el-option
                    v-for="status1 in status"
                    :key="status1.id"
                    :label="status1.name"
                    :value="status1.id"
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
                    <el-option label="Todos los clientes" value="" />
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
                    <el-option label="Tados las zonas" value="" />
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
            <div class="col-span-3">
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
                    <el-option label="Todos los servicios" value="" />
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
        <div class="flex flex-col space-y-4">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4 flex flex-col">
              <span class="text-gray-700 font-bold text-sm w-full"
                >Tipo de documento</span
              >
              <span>
                {{
                  Object.keys(selectedInvoice).length > 0
                    ? `${selectedInvoice.documentType.code} - ${selectedInvoice.documentType.name}`
                    : ""
                }}
              </span>
            </div>
            <div class="col-span-2 flex flex-col">
              <span class="text-gray-700 font-bold text-sm w-full"
                >No. autorización</span
              >
              <span>{{
                selectedInvoice ? selectedInvoice.authorization : ""
              }}</span>
            </div>
            <div class="col-span-2 flex flex-col">
              <span class="text-gray-700 font-bold text-sm w-full">
                Correlativo</span
              >
              <span>{{ selectedInvoice ? selectedInvoice.sequence : "" }}</span>
            </div>
            <div class="col-span-2 flex flex-col">
              <span class="text-gray-700 font-bold text-sm w-full">
                Fecha de factura</span
              >
              <span>{{
                selectedInvoice ? selectedInvoice.invoiceDate : ""
              }}</span>
            </div>
            <div class="col-span-2 flex flex-col">
              <span class="font-semibold">Estado</span>

              <el-tag
                size="small"
                type="info"
                v-if="
                  selectedInvoice.status ? selectedInvoice.status.id == '1' : ''
                "
              >
                {{ selectedInvoice.status.name }}
              </el-tag>
              <el-tag
                size="small"
                type="success"
                v-if="
                  selectedInvoice.status ? selectedInvoice.status.id == '2' : ''
                "
              >
                {{ `${selectedInvoice.status.name}` }}
              </el-tag>

              <el-tag
                size="small"
                type="danger"
                v-if="
                  selectedInvoice.status ? selectedInvoice.status.id == '3' : ''
                "
              >
                {{ `${selectedInvoice.status.name}` }}
              </el-tag>
            </div>
          </div>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4 flex flex-col">
              <span class="text-gray-700 font-bold text-sm w-full"
                >Cliente:</span
              >
              <span>{{
                selectedInvoice ? selectedInvoice.customerName : ""
              }}</span>
            </div>
            <div class="col-span-2 flex flex-col">
              <span class="text-gray-700 font-bold text-sm w-full"
                >Sucursal:</span
              >
              <span> Casa matriz</span>
            </div>
            <div class="col-span-3 flex flex-col">
              <span class="text-gray-700 font-bold text-sm w-full"
                >Condiciones de pago:</span
              >
              <span>{{
                selectedInvoice ? `${selectedInvoice.paymentConditionName}` : ""
              }}</span>
            </div>
            <div class="col-span-3 flex flex-col">
              <span class="text-gray-700 font-bold text-sm w-full"
                >Venta a cuenta de:
              </span>
              <span>{{
                selectedInvoice ? `${selectedInvoice.sellerName}` : ""
              }}</span>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4 flex flex-col">
              <span class="text-gray-700 font-bold text-sm w-full"
                >Dirección 1:</span
              >
              <span>{{
                selectedInvoice ? selectedInvoice.customerAddress1 : ""
              }}</span>
            </div>
            <div class="col-span-4 flex flex-col">
              <span class="text-gray-700 font-bold text-sm w-full"
                >Dirección 2:</span
              >
              <span>
                {{
                  selectedInvoice ? selectedInvoice.customerAddress2 : ""
                }}</span
              >
            </div>
            <div class="col-span-2 flex flex-col">
              <span class="text-gray-700 font-bold text-sm w-full"
                >Departamento:</span
              >
              <span>{{
                selectedInvoice ? `${selectedInvoice.customerState}` : ""
              }}</span>
            </div>
            <div class="col-span-2 flex flex-col">
              <span class="text-gray-700 font-bold text-sm w-full"
                >Municipio:
              </span>
              <span>{{
                selectedInvoice ? `${selectedInvoice.customerCity}` : ""
              }}</span>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-3 flex flex-col">
              <span class="text-gray-700 font-bold text-sm w-full">NIT:</span>
              <span>{{
                selectedInvoice ? selectedInvoice.customerNit : ""
              }}</span>
            </div>
            <div class="col-span-3 flex flex-col">
              <span class="text-gray-700 font-bold text-sm w-full">DUI:</span>
              <span>
                {{ selectedInvoice ? selectedInvoice.customerDui : "" }}</span
              >
            </div>
            <div class="col-span-2 flex flex-col">
              <span class="text-gray-700 font-bold text-sm w-full">NRC:</span>
              <span>{{
                selectedInvoice ? `${selectedInvoice.customerNrc}` : ""
              }}</span>
            </div>
            <div class="col-span-4 flex flex-col">
              <span class="text-gray-700 font-bold text-sm w-full">GIRO: </span>
              <span>{{
                selectedInvoice ? selectedInvoice.customerGiro : ""
              }}</span>
            </div>
          </div>

          <el-table :data="selectedInvoice.details" style="width: 100%">
            <el-table-column
              type="index"
              prop="quantity"
              label="#"
              width="30"
            />
            <el-table-column prop="quantity" label="Cant." width="55">
            </el-table-column>
            <el-table-column
              prop="chargeDescription"
              label="Description"
              width="375"
            />

            <el-table-column prop="unitPrice" label="Precio Unit." width="100">
              <template slot-scope="scope">
                <span>{{
                  calcUniPrice(selectedInvoice.documentType, scope.row)
                    | formatMoney
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="V. No sujeta" width="100">
            </el-table-column>
            <el-table-column prop="address" label="V. Extenta" width="100">
            </el-table-column>
            <el-table-column prop="ventaPrice" label="V. Grabada" width="100">
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
              <tr
                class="flex space-x-16"
                v-if="
                  selectedInvoice.documentType
                    ? selectedInvoice.documentType.id == 2
                    : ''
                "
              >
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
                <td align="right" class="text-blue-900 w-50">
                  Ventas exentas:
                </td>
                <td align="right" class="text-gray-800">
                  {{ selectedInvoice.ventasExentas | formatMoney }}
                </td>
              </tr>
              <tr class="flex space-x-16">
                <td align="right" class="text-blue-900 w-50">
                  Ventas no sujetas:
                </td>
                <td align="right" class="text-gray-800">
                  {{ selectedInvoice.ventasNoSujetas | formatMoney }}
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
        <el-table-column label="# Factura" min-width="120">
          <template slot-scope="scope">
            <span>
              {{ scope.row.authorization }} - {{ scope.row.sequence }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="Tipo fact."
          prop="documentType.code"
          min-width="75"
        >
        </el-table-column>
        <el-table-column label="Fecha" prop="invoiceDate" min-width="90" />
        <el-table-column label="Cliente" prop="customerName" min-width="350" />
        <el-table-column label="Estado" min-width="80">
          <template slot-scope="scope">
            <el-tag
              size="small"
              type="info"
              v-if="scope.row.status.id == '1'"
              >{{ scope.row.status.name }}</el-tag
            >
            <el-tag
              size="small"
              type="success"
              v-else-if="scope.row.status.id == '2'"
              >{{ scope.row.status.name }}</el-tag
            >
            <el-tag
              size="small"
              type="warning"
              v-else-if="scope.row.status.id == '4'"
              >{{ scope.row.status.name }}</el-tag
            >
            <el-tag
              size="small"
              type="danger"
              v-else-if="scope.row.status.id == '3'"
              >{{ scope.row.status.name }}</el-tag
            >
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
                <el-dropdown-item
                  @click.native="openInvoicePreview(scope.row, 'view')"
                >
                  <i class="el-icon-view"></i> Vista previa
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="$router.push(`/invoices/edit/${scope.row.id}`)"
                  v-if="scope.row.status.id == '1'"
                >
                  <i class="el-icon-edit-outline"></i> Editar factura
                </el-dropdown-item>

                <el-dropdown-item
                  v-if="scope.row.status.id == 1"
                  @click.native="printInvoice(scope.row)"
                >
                  <i class="el-icon-printer"></i> Imprimir factura
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status.id == 2">
                  <i class="el-icon-printer"></i> Re imprimir factura
                </el-dropdown-item>
                <el-dropdown-item
                  :divided="true"
                  v-if="
                    scope.row.status.id == '2' || scope.row.status.id == '3'
                  "
                >
                  <i class="el-icon-arrow-left"></i> Revertir estado
                </el-dropdown-item>

                <el-dropdown-item
                  :divided="true"
                  class="text-red-500 font-semibold"
                  v-if="scope.row.status.id == '1'"
                >
                  <i class="el-icon-delete"></i> Eliminar factura
                </el-dropdown-item>
                <el-dropdown-item
                  :divided="true"
                  class="text-red-500 font-semibold"
                  v-if="
                    scope.row.status.id == '2' && scope.row.status.id != '3'
                  "
                >
                  <i class="el-icon-circle-close"></i> Anular factura
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
          :total="invoices.count"
          :pager-count="5"
        />
      </div>
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
import { numeroALetras, calculatedAmount } from "../../tools";
import jsPDF from "jspdf";
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

    const invoices = () => this.$axios.get("/invoices", { params: this.page });

    const invoicesTotal = () => this.$axios.get("/invoices");

    const status = () => this.$axios.get("/invoices/status");

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
      status(),
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
          status,
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
        this.invoices = invoices.data;
        this.invoicesTotal = invoicesTotal.data.count;
        this.status = status.data.statuses;
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
      r: [],
      loading: false,
      errorMessage: "",

      activeCustomers: [],
      inactiveCustomers: [],
      documentTypes: [],
      activeSellers: [],
      inactiveSellers: [],
      activeZones: [],
      inactiveZones: [],
      activeService: [],
      inactiveService: [],
      invoicesTotal: [],
      status: [],
      options: [],
      showInvoicePreview: false,
      selectedInvoice: {},
      invoices: {
        invoices: [],
        details: [],
        count: 0,
      },
      page: {
        limit: 10,
        page: 1,
      },
      filter: {
        dateRange: null,
        customer: "",
        invoiceType: "",
        status: "",
        seller: "",
        zone: "",
        service: "",
        searchValue: "",
        documentType: "",
      },
    };
  },
  methods: {
    //Aqui estamos filtrando todos los select
    fetchInvoices() {
      let params = this.page;

      if (this.filter.customer !== "") {
        params = { ...params, customer: this.filter.customer };
      }
      if (this.filter.searchValue !== "") {
        params = { ...params, search: this.filter.searchValue.toLowerCase() };
      }
      if (this.filter.documentType !== "") {
        params = { ...params, documentType: this.filter.documentType };
      }
      if (this.filter.seller !== "") {
        params = { ...params, seller: this.filter.seller };
      }
      if (this.filter.zone !== "") {
        params = { ...params, zone: this.filter.zone };
      }
      if (this.filter.status !== "") {
        params = { ...params, status: this.filter.status };
      }
      if (this.filter.dateRange !== null) {
        params = {
          ...params,
          startDate: this.filter.dateRange[0],
          endDate: this.filter.dateRange[1],
        };
      }
      if (this.filter.service !== "") {
        params = { ...params, service: this.filter.service };
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
      console.log(val);
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

    async openInvoicePreview({ id }, type) {
      const { data } = await this.$axios.get(`/invoices/${id}`);
      this.selectedInvoice = data.invoice;

      switch (type) {
        case "print":
          this.showInvoicePreview = false;
          break;
        case "view":
          this.showInvoicePreview = true;
          break;
      }
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
    printInvoice({ id }) {
      this.$confirm(
        `¿Estás seguro que deseas imprimir esta factura?`,
        "Confirmación",
        {
          confirmButtonText: `Si, imprimir`,
          cancelButtonText: "Cancelar",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "Procesando...";
              this.$axios
                .get(`/invoices/${id}`)
                .then((res) => {
                  const data = res.data;
                  if (data) {
                    try {
                      const vadd = 1;
                      const hadd = 3;
                      const conf = {
                        configuration: "positions",
                        resolution: [216, 140],
                        header: [
                          {
                            position: [[90, 20]],
                            lenght: 30,
                            value: "invoice_autorization",
                            type: "text",
                          },
                          {
                            position: [[110, 20]],
                            lenght: 15,
                            value: "invoice_number",
                            type: "text",
                          },
                          {
                            position: [[20, 54]],
                            lenght: 100,
                            value: "customer_name",
                            type: "text",
                          },
                          {
                            position: [[83, 60]],
                            lenght: 60,
                            value: "invoice_date",
                            type: "date",
                          },
                          {
                            position: [[25, 60]],
                            lenght: 130,
                            value: "customer_address1",
                            type: "text",
                          },
                          {
                            position: [[60, 66]],
                            lenght: 70,
                            value: "customer_address2",
                            type: "text",
                          },
                          {
                            position: [[90, 67]],
                            lenght: 55,
                            value: "customer_nit",
                            type: "text",
                          },

                          {
                            position: [[105, 73]],
                            lenght: 35,
                            value: "payment_condition",
                            type: "text",
                          },
                        ],
                        details: {
                          position_y: 86,
                          size: 7.5,
                          quantity: {
                            position: [16],
                            value: "charge_quantity",
                            type: "text",
                          },
                          description: {
                            position: [30],
                            value: "charge_description",
                            lenght: 110,
                            type: "text",
                          },
                          price: {
                            position: [89],
                            value: "unit_price",
                            type: "text",
                          },
                          sujeto: {
                            position: [106],
                            value: "unit_price",
                            type: "text",
                          },
                          exento: {
                            position: [99],
                            value: "unit_price",
                            type: "text",
                          },
                          afecto: {
                            position: [115],
                            value: "venta_price",
                            type: "text",
                          },
                        },
                        totals: [
                          { position: [115, 156], value: "sum", type: "money" },
                          {
                            position: [115, 182],
                            value: "iva_retenido",
                            type: "money",
                          },
                          {
                            position: [115, 169],
                            value: "subtotal",
                            type: "money",
                          },
                          {
                            position: [115, 176],
                            value: "ventas_exentas",
                            type: "money",
                          },
                          {
                            position: [115, 189],
                            value: "venta_total",
                            type: "money",
                          },
                        ],
                      };

                      // Crea el documento base
                      const pdfDocument = new jsPDF({
                        orientation: "portrait",
                        unit: "mm",
                        format: conf.resolution,
                      });
                      pdfDocument.setFontSize(9);

                      // Agrega el encabezado
                      for (const header of conf.header) {
                        let value = "";
                        switch (header.value) {
                          case "invoice_autorization":
                            value = data.invoice.authorization;
                            break;
                          case "invoice_number":
                            value = data.invoice.sequence;
                            break;
                          case "customer_name":
                            value = data.invoice.customerName;
                            break;
                          case "invoice_date":
                            value = data.invoice.invoiceDate;
                            break;
                          case "customer_address1":
                            value = data.invoice.customerAddress1;
                            break;
                          case "customer_address2":
                            value = data.invoice.customerAddress2;
                            break;
                          case "customer_nrc":
                            value = data.invoice.customerNrc;
                            break;
                          case "customer_nit":
                            value = data.invoice.customerNit;
                            break;
                          case "customer_city":
                            value = data.invoice.customerCity;
                            break;
                          case "customer_giro":
                            value = data.invoice.customerGiro;
                            break;
                          case "customer_state":
                            value = data.invoice.customerState;
                            break;
                          case "seller_name":
                            value = data.invoice.invoicesSeller.name;
                            break;
                          case "payment_condition":
                            value = data.invoice.invoicesPaymentsCondition.name;
                            break;
                        }

                        const splitText = pdfDocument.splitTextToSize(
                          value,
                          header.lenght
                        );

                        pdfDocument.text(
                          splitText[0],
                          parseInt(header.position[0][0]) + vadd,
                          parseInt(header.position[0][1]) + hadd
                        );
                      }

                      // Agrega los detalles
                      let acumRows = 0;
                      for (const detail of data.invoice.details) {
                        const acumHeight = acumRows * 5;
                        const position_x = 1;
                        const position_y =
                          acumHeight + hadd + conf.details.position_y;
                        const {
                          quantity,
                          chargeDescription,
                          unitPrice,
                          sellingType,
                          incTax,
                          ventaPrice,
                        } = detail;

                        // Quantity
                        pdfDocument.text(
                          parseFloat(quantity).toFixed(2),
                          conf.details.quantity.position[0] + position_x,
                          position_y
                        );
                        // Description
                        const splitDescription = pdfDocument.splitTextToSize(
                          chargeDescription,
                          conf.details.description.lenght
                        );
                        acumRows = acumRows + splitDescription.length;
                        pdfDocument.text(
                          splitDescription,
                          conf.details.description.position[0] + position_x,
                          position_y
                        );
                        // Price
                        pdfDocument.text(
                          new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(unitPrice),
                          conf.details.price.position[0] + position_x,
                          position_y
                        );

                        // Ventas sujetas
                        pdfDocument.text(
                          sellingType.id == 1
                            ? new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(
                                calculatedAmount(
                                  sellingType.id,
                                  data.invoice.documentType.id,
                                  unitPrice,
                                  quantity,
                                  incTax
                                ).sujeta
                              )
                            : "",
                          conf.details.sujeto.position[0] + position_x,
                          position_y
                        );
                        // Ventas exentas
                        pdfDocument.text(
                          sellingType.id == 2
                            ? new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(
                                calculatedAmount(
                                  sellingType.id,
                                  data.invoice.documentType.id,
                                  unitPrice,
                                  quantity,
                                  incTax
                                ).exenta
                              )
                            : "",
                          conf.details.exento.position[0] + position_x,
                          position_y
                        );
                        // Ventas afectas
                        pdfDocument.text(
                          sellingType.id == 3
                            ? new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(
                                calculatedAmount(
                                  sellingType.id,
                                  data.invoice.documentType.id,
                                  unitPrice,
                                  quantity,
                                  incTax
                                ).gravada
                              )
                            : "",
                          conf.details.afecto.position[0] + position_x,
                          position_y
                        );
                      }

                      // Agrega los totales
                      for (const total of conf.totals) {
                        let value = "";
                        switch (total.value) {
                          case "sum":
                            value = new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(data.invoice.sum);
                            break;
                          case "iva":
                            value = new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(data.invoice.iva);
                            break;
                          case "subtotal":
                            value = new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(data.invoice.subtotal);
                            break;
                          case "iva_retenido":
                            value = new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(data.invoice.ivaRetenido);
                            break;
                          case "ventas_no_sujetas":
                            value = new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(data.invoice.ventasNoSujetas);
                            break;
                          case "ventas_exentas":
                            value = new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(data.invoice.ventasExentas);
                            break;
                          case "venta_total":
                            value = new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(data.invoice.ventaTotal);
                            break;
                          case "venta_total_text":
                            value = numeroALetras(data.invoice.ventaTotal);
                            break;
                        }
                        const splitText = pdfDocument.splitTextToSize(
                          value,
                          total.lenght
                        );
                        pdfDocument.text(
                          splitText,
                          parseInt(total.position[0]) + vadd,
                          parseInt(total.position[1]) + hadd
                        );
                      }

                      pdfDocument.autoPrint();

                      window.open(pdfDocument.output("bloburl"), "_blank");
                    } catch (error) {
                      this.$message.error(
                        "Error al generar el PDF, contacta con tu administrador."
                      );
                    }
                  } else {
                    this.$notify({
                      title: "Error",
                      message:
                        "Ha ocurrido un error al obtener la informacion. Contacta con tu administrador.",
                      type: "error",
                      duration: 3500,
                    });
                  }
                  instance.confirmButtonLoading = false;
                  instance.confirmButtonText = `Si, imprimir`;
                  done();
                })
                .catch((err) => this.$message.error(err));
            } else {
              done();
            }
          },
        }
      );
    },
  },
};
</script>

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
            v-model="searchValue"
            size="small"
              v-debounce:500ms="fetchInvoices"
              @change="fetchInvoices"
          />
            </el-form-item>
          </div>
        </div>
       
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
                />
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
                  <el-option label="Todos los clientes" value="" />
                  <el-option-group key="ACTIVOS" label="ACTIVOS">
                    <el-option
                      v-for="item in activeCustomers"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-option-group>
                  <el-option-group key="INACTIVOS" label="INACTIVOS">
                    <el-option
                      v-for="item in inactiveCustomers"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
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
                  @change="fetchInvoices"
                >
                  <el-option label="Todos los tipos" value="" />
                  <el-option
                    v-for="item in documentTypes"
                    :key="item.id"
                    :label="`${item.code} - ${item.name}`"
                    :value="item.id"
                  />
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
                  @change="fetchInvoices"
                >
                  <el-option label="Todos los estados" value="" />
                  <el-option
                    v-for="status in statuses"
                    :key="status.id"
                    :label="status.name"
                    :value="status.id"
                  />
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
                  placeholder="Todos los vendedores:"
                  class="w-full"
                  @change="fetchInvoices"
                >
                  <el-option label="Todos los vendedores" value="" />
                  <el-option-group key="ACTIVOS" label="ACTIVOS">
                    <el-option
                      v-for="seller in activeSellers"
                      :key="seller.id"
                      :label="seller.name"
                      :value="seller.id"
                    />
                  </el-option-group>
                  <el-option-group key="INACTIVOS" label="INACTIVOS">
                    <el-option
                      v-for="seller in inactiveSellers"
                      :key="seller.id"
                      :label="seller.name"
                      :value="seller.id"
                    />
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
                  <el-option label="Tados las zonas" value="" />
                  <el-option-group key="ACTIVOS" label="ACTIVOS">
                    <el-option
                      v-for="zone in activeZones"
                      :key="zone.id"
                      :label="zone.name"
                      :value="zone.id"
                    />
                  </el-option-group>
                  <el-option-group key="INACTIVOS" label="INACTIVOS">
                    <el-option
                      v-for="zone in inactiveZones"
                      :key="zone.id"
                      :label="zone.name"
                      :value="zone.id"
                    />
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
                  @change="fetchInvoices"
                >
                  <el-option label="Todos los servicios" value="" />
                  <el-option-group key="ACTIVOS" label="ACTIVOS">
                    <el-option
                      v-for="service in activeServices"
                      :key="service.id"
                      :label="service.name"
                      :value="service.id"
                    />
                  </el-option-group>
                  <el-option-group key="INACTIVOS" label="INACTIVOS">
                    <el-option
                      v-for="service in inactiveServices"
                      :key="service.id"
                      :label="service.name"
                      :value="service.id"
                    />
                  </el-option-group>
                </el-select>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
      <el-dialog
        title="Vista previa"
        :visible.sync="showInvoicePreview"
        width="1000px"
        :append-to-body="true"
      >
        <div class="flex flex-col space-y-4">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4 flex flex-col">
              <span class="font-semibold text-sm">Tipo de documento</span>
              <span>
                {{
                  selectedInvoice.documentType
                    ? `${selectedInvoice.documentType.code} - ${selectedInvoice.documentType.name}`
                    : ""
                }}
              </span>
            </div>
            <div class="col-span-2 flex flex-col">
              <span class="font-semibold text-sm">No. autorización</span>
              <span>{{
                selectedInvoice ? selectedInvoice.authorization : ""
              }}</span>
            </div>
            <div class="col-span-2 flex flex-col">
              <span class="font-semibold text-sm">Correlativo</span>
              <span>{{ selectedInvoice ? selectedInvoice.sequence : "" }}</span>
            </div>
            <div class="col-span-2 flex flex-col">
              <span class="font-semibold text-sm"> Fecha de factura</span>
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
              <span class="font-semibold text-sm">Cliente:</span>
              <span>{{
                selectedInvoice ? selectedInvoice.customerName : ""
              }}</span>
            </div>
            <div class="col-span-2 flex flex-col">
              <span class="font-semibold text-sm">Sucursal:</span>
              <span> Casa matriz</span>
            </div>
            <div class="col-span-3 flex flex-col">
              <span class="font-semibold text-sm">Condiciones de pago:</span>
              <span>{{
                selectedInvoice ? `${selectedInvoice.paymentConditionName}` : ""
              }}</span>
            </div>
            <div class="col-span-3 flex flex-col">
              <span class="font-semibold text-sm">Venta a cuenta de: </span>
              <span>{{
                selectedInvoice ? `${selectedInvoice.sellerName}` : ""
              }}</span>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4 flex flex-col">
              <span class="font-semibold text-sm">Dirección 1:</span>
              <span>{{
                selectedInvoice ? selectedInvoice.customerAddress1 : ""
              }}</span>
            </div>
            <div class="col-span-4 flex flex-col">
              <span class="font-semibold text-sm">Dirección 2:</span>
              <span>
                {{
                  selectedInvoice ? selectedInvoice.customerAddress2 : ""
                }}</span
              >
            </div>
            <div class="col-span-2 flex flex-col">
              <span class="font-semibold text-sm">Departamento:</span>
              <span>{{
                selectedInvoice ? `${selectedInvoice.customerState}` : ""
              }}</span>
            </div>
            <div class="col-span-2 flex flex-col">
              <span class="font-semibold text-sm">Municipio: </span>
              <span>{{
                selectedInvoice ? `${selectedInvoice.customerCity}` : ""
              }}</span>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-3 flex flex-col">
              <span class="font-semibold text-sm">NIT:</span>
              <span>{{
                selectedInvoice ? selectedInvoice.customerNit : ""
              }}</span>
            </div>
            <div class="col-span-3 flex flex-col">
              <span class="font-semibold text-sm">DUI:</span>
              <span>
                {{ selectedInvoice ? selectedInvoice.customerDui : "" }}</span
              >
            </div>
            <div class="col-span-2 flex flex-col">
              <span class="font-semibold text-sm">NRC:</span>
              <span>{{
                selectedInvoice ? `${selectedInvoice.customerNrc}` : ""
              }}</span>
            </div>
            <div class="col-span-4 flex flex-col">
              <span class="font-semibold text-sm">GIRO: </span>
              <span>{{
                selectedInvoice ? selectedInvoice.customerGiro : ""
              }}</span>
            </div>
          </div>

          <el-table :data="selectedInvoice.details" class="w-full">
            <el-table-column prop="quantity" label="Cant." min-width="55" />
            <el-table-column
              prop="chargeDescription"
              label="Description"
              min-width="375"
            />
            <el-table-column label="Precio Unit." min-width="100">
              <template slot-scope="scope">
                <span>{{
                  calcUniPrice(selectedInvoice.documentType, scope.row)
                    | formatMoney
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="V. No sujeta" min-width="100" />
            <el-table-column label="V. Extenta" min-width="100" />
            <el-table-column label="V. Gravada" min-width="100">
              <template slot-scope="scope">
                <span>{{
                  calcUniPrice(selectedInvoice.documentType, scope.row)
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
      <el-table :data="invoices.invoices" stripe size="small">
        <el-table-column prop="index" min-width="40" />
        <el-table-column label="# Factura" min-width="120">
          <template slot-scope="scope">
            <span>
              {{ scope.row.authorization }}-{{ scope.row.sequence }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="Tipo fact."
          prop="documentType.code"
          min-width="75"
        />
        <el-table-column label="Fecha" prop="invoiceDate" min-width="90" />
        <el-table-column label="Cliente" prop="customerName" min-width="380" />
        <el-table-column label="Estado" min-width="90">
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
        <el-table-column label min-width="65" align="center">
          <template slot-scope="scope">
            <el-dropdown trigger="click" szie="mini">
              <el-button icon="el-icon-more" size="mini" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="openInvoicePreview(scope.row)">
                  <i class="el-icon-view"></i> Vista previa
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="$router.push(`/invoices/edit/${scope.row.id}`)"
                  v-if="scope.row.status.id == '1'"
                >
                  <i class="el-icon-edit-outline"></i> Editar factura
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status.id == 1">
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
                  <i class="el-icon-refresh-left"></i> Revertir estado
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
  name: "Invoices",
  components: { LayoutContent, Notification },
  fetch() {
    const documentTypes = () => this.$axios.get("/invoices/document-types");
    const customers = () => this.$axios.get("/customers");
    const sellers = () => this.$axios.get("/invoices/sellers");
    const zones = () => this.$axios.get("/invoices/zones");
    const services = () => this.$axios.get("/services");
    const invoices = () => this.$axios.get("/invoices", { params: this.page });
    const statuses = () => this.$axios.get("/invoices/status");

    Promise.all([
      documentTypes(),
      customers(),
      sellers(),
      zones(),
      services(),
      invoices(),
      statuses(),
    ])
      .then((res) => {
        const [
          documentTypes,
          customers,
          sellers,
          zones,
          services,
          invoices,
          statuses,
        ] = res;
        this.documentTypes = documentTypes.data.documentTypes;
        this.customers = customers.data.customers;
        this.sellers = sellers.data.sellers;
        this.zones = zones.data.zones;
        this.services = services.data.services;
        this.invoices = invoices.data;
        this.statuses = statuses.data.statuses;
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
      errorMessage: "",
      loading: false,
      documentTypes: [],
      customers: [],
      sellers: [],
      zones: [],
      services: [],
      statuses: [],
      invoices: {
        invoices: [],
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
      showInvoicePreview: false,
      selectedInvoice: {},
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
      this.page.limit = val;
      this.fetchInvoices();
    },
    // changeActive({ id, isActiveInvoice }) {
    //   const action = isActiveInvoice ? "desactivar" : "activar";
    //   this.$confirm(
    //     `¿Estás seguro que deseas ${action} este cliente?`,
    //     "Confirmación",
    //     {
    //       confirmButtonText: `Si, ${action}`,
    //       cancelButtonText: "Cancelar",
    //       type: "warning",
    //       beforeClose: (action, instance, done) => {
    //         if (action === "confirm") {
    //           instance.confirmButtonLoading = true;
    //           instance.confirmButtonText = "Procesando...";
    //           this.$axios
    //             .put(`/invoices/status/${id}`, { status: !isActiveInvoice })
    //             .then((res) => {
    //               this.$notify.success({
    //                 title: "Éxito",
    //                 message: res.data.message,
    //               });
    //               this.fetchInvoices();
    //             })
    //             .catch((err) => {
    //               this.$notify.error({
    //                 title: "Error",
    //                 message: err.response.data.message,
    //               });
    //             })
    //             .then((alw) => {
    //               instance.confirmButtonLoading = false;
    //               instance.confirmButtonText = `Si, ${action}`;
    //               done();
    //             });
    //         }
    //         done();
    //       },
    //     }
    //   );
    // },
    async openInvoicePreview({ id }) {
      const { data } = await this.$axios.get(`/invoices/${id}`);
      this.selectedInvoice = data.invoice;
      this.showInvoicePreview = true;
    },
    calcUniPrice(documentType, { unitPrice, incTax, sellingType }) {
      const amount = parseFloat(unitPrice);
      let message = null;
      if (sellingType.id == 1 || sellingType.id == 2) {
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
  },
  computed: {
    activeCustomers() {
      return this.customers.filter((c) => c.isActiveCustomer);
    },
    inactiveCustomers() {
      return this.customers.filter((c) => !c.isActiveCustomer);
    },
    activeSellers() {
      return this.sellers.filter((i) => i.active);
    },
    inactiveSellers() {
      return this.sellers.filter((i) => !i.active);
    },
    activeZones() {
      return this.zones.filter((i) => i.active);
    },
    inactiveZones() {
      return this.zones.filter((i) => !i.active);
    },
    activeServices() {
      return this.services.filter((i) => i.active);
    },
    inactiveServices() {
      return this.services.filter((i) => !i.active);
    },
  },
};
</script>

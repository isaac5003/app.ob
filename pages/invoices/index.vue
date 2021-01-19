<template>
  <layout-content
    v-loading="pageloading"
    page-title="Listado de ventas"
    :breadcrumb="[
      { name: 'Ventas', to: '/invoices' },
      { name: 'Listado de ventas', to: null },
    ]"
  >
    <el-dialog
      title="Vista previa"
      size="mini"
      :visible.sync="showInvoicePreview"
      width="1000px"
      :append-to-body="true"
    >
      <div class="flex flex-col space-y-3">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-5">
            <span class="font-semibold">Cliente:</span>
            <p>{{ selectedInvoice ? selectedInvoice.customerName : "" }}</p>
          </div>
          <div class="col-span-2">
            <span class="font-semibold">Sucursal:</span>
            <p>Casa matriz</p>
          </div>
          <div class="col-span-3">
            <span class="font-semibold">Condiciones de pago:</span>
            <p>
              {{
                selectedInvoice ? `${selectedInvoice.paymentConditionName}` : ""
              }}
            </p>
          </div>
          <div class="col-span-2">
            <span class="font-semibold">Venta a cuenta de: </span>
            <p>{{ selectedInvoice ? `${selectedInvoice.sellerName}` : "" }}</p>
          </div>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-4">
            <span class="font-semibold">Dirección 1:</span>
            <p>{{ selectedInvoice ? selectedInvoice.customerAddress1 : "" }}</p>
          </div>
          <div class="col-span-4">
            <span class="font-semibold">Dirección 2:</span>
            <p>
              {{ selectedInvoice ? selectedInvoice.customerAddress2 : "" }}
            </p>
          </div>
          <div class="col-span-2">
            <span class="font-semibold">Departamento:</span>
            <p>
              {{ selectedInvoice ? `${selectedInvoice.customerState}` : "" }}
            </p>
          </div>
          <div class="col-span-2">
            <span class="font-semibold">Municipio: </span>
            <p>
              {{ selectedInvoice ? `${selectedInvoice.customerCity}` : "" }}
            </p>
          </div>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-3">
            <span class="font-semibold">NIT:</span>
            <p>{{ selectedInvoice ? selectedInvoice.customerNit : "" }}</p>
          </div>
          <div class="col-span-2">
            <span class="font-semibold">DUI:</span>
            <p>
              {{ selectedInvoice ? selectedInvoice.customerDui : "" }}
            </p>
          </div>
          <div class="col-span-2">
            <span class="font-semibold">NRC:</span>
            <p>{{ selectedInvoice ? `${selectedInvoice.customerNrc}` : "" }}</p>
          </div>
          <div class="col-span-5">
            <span class="font-semibold">GIRO: </span>
            <p>{{ selectedInvoice ? selectedInvoice.customerGiro : "" }}</p>
          </div>
        </div>
        <el-table :data="selectedInvoice.details" size="mini">
          <el-table-column prop="quantity" label="Cant." min-width="55" />
          <el-table-column
            prop="chargeDescription"
            label="Description"
            min-width="500"
          />
          <el-table-column
            prop="unitPrice"
            label="Precio Unit."
            min-width="100"
          >
            <template slot-scope="scope">
              <span>{{
                calcUnitPrice(selectedInvoice.documentType, scope.row)
                  | formatMoney
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="ventasNoSujetas"
            label="V. No sujeta"
            min-width="100"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.sellingType.id == 1">{{
                calcSujeta(selectedInvoice.documentType, scope.row)
                  | formatMoney
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="ventasExentas"
            label="V. Extenta"
            min-width="100"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.sellingType.id == 2">{{
                calcExenta(selectedInvoice.documentType, scope.row)
                  | formatMoney
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="V. Gravada" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.sellingType.id == 3">{{
                calcGravada(selectedInvoice.documentType, scope.row)
                  | formatMoney
              }}</span>
            </template>
          </el-table-column>
        </el-table>

        <table class="flex justify-end">
          <tbody class="divide-y divide-gray-300">
            <tr>
              <td align="right" class="w-40">SUMAS:</td>
              <td align="right" class="w-25">
                {{ selectedInvoice.sum | formatMoney }}
              </td>
            </tr>
            <tr
              v-if="
                selectedInvoice.documentType
                  ? selectedInvoice.documentType.id == 2
                  : ''
              "
            >
              <td align="right" class="w-40">13% Iva:</td>
              <td align="right" class="w-25">
                {{ selectedInvoice.iva | formatMoney }}
              </td>
            </tr>
            <tr>
              <td align="right" class="w-40">Subtotal:</td>
              <td align="right" class="w-25">
                {{ selectedInvoice.subtotal | formatMoney }}
              </td>
            </tr>
            <tr>
              <td align="right" class="w-40">Iva retenido:</td>
              <td align="right" class="w-25">
                {{ selectedInvoice.ivaRetenido | formatMoney }}
              </td>
            </tr>
            <tr>
              <td align="right" class="w-40">Ventas exentas:</td>
              <td align="right" class="w-25">
                {{ selectedInvoice.ventasExentas | formatMoney }}
              </td>
            </tr>
            <tr>
              <td align="right" class="w-40">Ventas no sujetas:</td>
              <td align="right" class="w-25">
                {{ selectedInvoice.ventasNoSujetas | formatMoney }}
              </td>
            </tr>
            <tr>
              <td align="right" class="ont-semibold w-40">Venta total:</td>
              <td align="right" class="w-25">
                {{ selectedInvoice.ventaTotal | formatMoney }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-dialog>

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
          <el-form-item class="col-start-10 col-span-4">
            <el-input
              suffix-icon="el-icon-search"
              placeholder="Buscar..."
              v-model="filter.searchValue"
              size="small"
              v-debounce:500ms="fetchInvoices"
              clearable
              @change="fetchInvoices"
            />
          </el-form-item>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <el-form-item label="Rango de fechas:" class="col-span-4">
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
          <el-form-item label="Cliente:" class="col-span-4">
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
          <el-form-item label="Tipo de documento:" class="col-span-2">
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
          <el-form-item label="Estado:" class="col-span-2">
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
        <div class="grid grid-cols-12 gap-4">
          <el-form-item label="Vendedor:" class="col-span-3">
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
          <el-form-item label="Zona:" class="col-span-3">
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
          <el-form-item label="Servicios:" class="col-span-3">
            <el-select
              v-model="filter.service"
              size="small"
              clearable
              default-first-option
              placeholder="Todos los servicios"
              class="w-full"
              filterable
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
      </el-form>
      <div class="flex flex-col space-y-2">
        <el-table
          :data="invoices.invoices"
          stripe
          size="mini"
          v-loading="tableloading"
        >
          <el-table-column prop="index" min-width="40" />
          <el-table-column label="# Venta" min-width="120">
            <template slot-scope="scope">
              <span>
                {{ scope.row.authorization }}-{{ scope.row.sequence }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="Tipo doc."
            prop="documentType.code"
            min-width="80"
          />
          <el-table-column label="Fecha" prop="invoiceDate" min-width="90" />
          <el-table-column
            label="Cliente"
            prop="customerName"
            min-width="385"
          />
          <el-table-column label="Estado" min-width="110">
            <template slot-scope="scope">
              <el-tag
                size="small"
                type="info"
                v-if="scope.row.status.id == '1'"
              >
                <i class="el-icon-warning"></i>
                {{ scope.row.status.name }}
              </el-tag>
              <el-tag
                size="small"
                type="success"
                v-else-if="scope.row.status.id == '2'"
              >
                <i class="el-icon-success"></i>
                {{ scope.row.status.name }}</el-tag
              >
              <el-tag
                size="small"
                type="danger"
                v-else-if="scope.row.status.id == '3'"
              >
                <i class="el-icon-error"></i>
                {{ scope.row.status.name }}</el-tag
              >
              <el-tag
                size="small"
                type="warning"
                v-else-if="scope.row.status.id == '4'"
              >
                <i class="el-icon-question"></i>
                {{ scope.row.status.name }}</el-tag
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
                  <el-dropdown-item
                    @click.native="openInvoicePreview(scope.row)"
                  >
                    <i class="el-icon-view"></i> Vista previa
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="
                      $router.push(`/invoices/edit/${scope.row.id}`)
                    "
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
                    class="font-semibold"
                    v-if="scope.row.status.id == '1'"
                    @click.native="deleteInvoice(scope.row)"
                  >
                    <i class="el-icon-delete"></i> Eliminar factura
                  </el-dropdown-item>
                  <el-dropdown-item
                    :divided="true"
                    icon="el-icon-circle-close"
                    class="font-semibold"
                    v-if="
                      scope.row.status.id == '2' && scope.row.status.id != '3'
                    "
                  >
                    Anular factura
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
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message
          ? err.response.data.message
          : "Comunicate con el administrador del sistema.";
      })
      .then((alw) => (this.pageloading = false));
  },
  fetchOnServer: false,
  data() {
    return {
      errorMessage: "",
      pageloading: true,
      tableloading: false,
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
    fetchInvoices() {
      this.tableloading = true;
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
        })
        .then((alw) => (this.tableloading = false));
    },
    handleSizeChange(val) {
      this.page.limit = val;
      this.fetchInvoices();
    },
    async openInvoicePreview({ id }) {
      const { data } = await this.$axios.get(`/invoices/${id}`);
      this.selectedInvoice = data.invoice;
      this.showInvoicePreview = true;
    },
    deleteInvoice({ id }) {
      this.$confirm(
        `¿Estás seguro que deseas eliminar esta venta?`,
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

    calcUnitPrice(documentType, { unitPrice, incTax, sellingType }) {
      let uniPrice = null;
      const amount = parseFloat(unitPrice);
      let message = null;
      if (sellingType.id == 1 || sellingType.id == 2) {
        uniPrice = amount;
      } else {
        if (documentType) {
          switch (documentType.id) {
            case 1:
              uniPrice = amount * (incTax ? 1 : 1.13);
              break;
            case 2:
              uniPrice = amount / (incTax ? 1.13 : 1);
              break;
          }
        } else {
          message = "Debe seleccionar un tipo de docuemnto";
        }
      }
      return uniPrice;
    },
    calcSujeta(documentType, { unitPrice, incTax, sellingType, quantity }) {
      let uniPrice = null;
      const amount = parseFloat(unitPrice);

      if ((sellingType.id == 1) | (sellingType.id == 2)) {
        uniPrice = amount * quantity;
      }

      return uniPrice;
    },
    calcGravada(documentType, { unitPrice, incTax, sellingType, quantity }) {
      let uniPrice = null;
      const amount = parseFloat(unitPrice);
      switch (documentType.id) {
        case 1:
          uniPrice = amount * (incTax ? 1 : 1.13) * quantity;

          break;
        case 2:
          uniPrice = (amount / (incTax ? 1.13 : 1)) * quantity;

          break;
      }

      return uniPrice;
    },
    calcExenta(documentType, { unitPrice, incTax, sellingType, quantity }) {
      let uniPrice = null;
      const amount = parseFloat(unitPrice);

      if ((sellingType.id == 1) | (sellingType.id == 2)) {
        uniPrice = amount * quantity;
      }

      return uniPrice;
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
      return this.sellers.filter((s) => s.active);
    },
    inactiveSellers() {
      return this.sellers.filter((s) => !s.active);
    },
    activeZones() {
      return this.zones.filter((z) => z.active);
    },
    inactiveZones() {
      return this.zones.filter((z) => !z.active);
    },
    activeServices() {
      return this.services.filter((s) => s.active);
    },
    inactiveServices() {
      return this.services.filter((s) => !s.active);
    },
  },
};
</script>

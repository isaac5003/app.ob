<template>
  <layout-content
    v-loading="pageloading"
    page-title="Listado de documentos"
    :breadcrumb="[
      { name: 'Ventas', to: '/invoices' },
      { name: 'Listado de documentos', to: null },
    ]"
  >
    <el-dialog
      title="Vista previa"
      size="mini"
      v-if="selectedInvoice"
      :visible.sync="showInvoicePreview"
      width="1000px"
      :append-to-body="true"
    >
      <div class="flex flex-col space-y-2 text-xs">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-3 flex flex-col">
            <span class="font-semibold">Tipo de documento</span>
            <span>{{
              selectedInvoice
                ? `${selectedInvoice.documentType.code} -
                  ${selectedInvoice.documentType.name}`
                : ""
            }}</span>
          </div>
          <div class="col-span-2 flex flex-col">
            <span class="font-semibold">No. autorización</span>
            <span>{{
              selectedInvoice ? `${selectedInvoice.authorization}` : ""
            }}</span>
          </div>
          <div class="col-span-2 flex flex-col">
            <span class="font-semibold">Correlativo</span>
            <span>{{
              selectedInvoice ? `${selectedInvoice.sequence}` : ""
            }}</span>
          </div>
          <div class="col-span-3 flex flex-col">
            <span class="font-semibold">Fecha de factura</span>
            <span>{{
              selectedInvoice ? `${selectedInvoice.invoiceDate}` : ""
            }}</span>
          </div>
          <div class="col-span-2 flex flex-col">
            <span class="font-semibold">Estado</span>
            <el-tag
              size="small"
              type="info"
              v-if="selectedInvoice && selectedInvoice.status.id === 1"
            >
              <i class="el-icon-warning"></i>
              {{ selectedInvoice.status.name }}</el-tag
            >
            <el-tag
              size="small"
              type="success"
              v-else-if="selectedInvoice && selectedInvoice.status.id === 2"
            >
              <i class="el-icon-success"></i
              >{{ selectedInvoice.status.name }}</el-tag
            >
            <el-tag
              size="small"
              type="warning"
              v-else-if="selectedInvoice && selectedInvoice.status.id === 4"
            >
              <i class="el-icon-question"></i
              >{{ selectedInvoice.status.name }}</el-tag
            >
            <el-tag
              size="small"
              type="warning"
              v-else-if="selectedInvoice && selectedInvoice.status.id === 5"
            >
              <i class="el-icon-question"></i
              >{{ selectedInvoice.status.name }}</el-tag
            >
            <el-tag
              size="small"
              type="danger"
              v-else-if="selectedInvoice && selectedInvoice.status.id === 3"
            >
              <i class="el-icon-error"></i
              >{{ selectedInvoice.status.name }}</el-tag
            >
          </div>
        </div>
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
            label="Descripción"
            width="270"
          />
          <el-table-column label="Precio Unit." min-width="75" align="right">
            <template slot-scope="scope">
              <span>
                {{
                  (selectedInvoice.documentType.id == 1
                    ? parseFloat(scope.row.unitPrice) *
                      (scope.row.incTax ? 1 : 1.13)
                    : selectedInvoice.documentType.id == 2
                    ? parseFloat(scope.row.unitPrice) /
                      (scope.row.incTax ? 1.13 : 1)
                    : parseFloat(scope.row.unitPrice)) | formatMoney
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="vnosujeta"
            :label="selectedInvoice.documentType.id != 3 ? 'V. No sujeta' : ''"
            min-width="75"
            align="right"
          >
            <template slot-scope="scope">
              <span
                v-if="
                  scope.row.sellingType.id == 1 &&
                    selectedInvoice.documentType.id != 3
                "
                >{{ parseFloat(scope.row.ventaPrice) | formatMoney }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="vexenta"
            :label="selectedInvoice.documentType.id != 3 ? 'V. Exenta' : ''"
            min-width="75"
            align="right"
          >
            <template slot-scope="scope">
              <span
                v-if="
                  scope.row.sellingType.id == 2 &&
                    selectedInvoice.documentType.id != 3
                "
                >{{ parseFloat(scope.row.ventaPrice) | formatMoney }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="vgrabada"
            label="V. Gravada"
            min-width="75"
            align="right"
          >
            <template slot-scope="scope">
              <span
                v-if="
                  scope.row.sellingType.id == 3 ||
                    selectedInvoice.documentType.id == 3
                "
                >{{
                  (selectedInvoice.documentType.id == 1
                    ? parseFloat(scope.row.ventaPrice) *
                      (scope.row.incTax ? 1 : 1.13)
                    : selectedInvoice.documentType.id == 2
                    ? parseFloat(scope.row.ventaPrice) /
                      (scope.row.incTax ? 1.13 : 1)
                    : parseFloat(scope.row.ventaPrice)) | formatMoney
                }}</span
              >
            </template>
          </el-table-column>
        </el-table>
        <table class="flex justify-end">
          <tbody class="divide-y divide-gray-300">
            <tr v-if="selectedInvoice.documentType.id != 3">
              <td align="right" class="w-40">SUMAS:</td>
              <td align="right" class="w-25">
                {{
                  selectedInvoice.documentType.id == 1
                    ? selectedInvoice.subtotal
                    : selectedInvoice.sum | formatMoney
                }}
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
            <tr v-if="selectedInvoice.documentType.id != 3">
              <td align="right" class="w-40">Subtotal:</td>
              <td align="right" class="w-25">
                {{ selectedInvoice.subtotal | formatMoney }}
              </td>
            </tr>
            <tr v-if="selectedInvoice.documentType.id != 3">
              <td align="right" class="w-40">Iva retenido:</td>
              <td align="right" class="w-25">
                {{ selectedInvoice.ivaRetenido | formatMoney }}
              </td>
            </tr>
            <tr v-if="selectedInvoice.documentType.id != 3">
              <td align="right" class="w-40">Ventas exentas:</td>
              <td align="right" class="w-25">
                {{ selectedInvoice.ventasExentas | formatMoney }}
              </td>
            </tr>
            <tr v-if="selectedInvoice.documentType.id != 3">
              <td align="right" class="w-40">Ventas no sujetas:</td>
              <td align="right" class="w-25">
                {{ selectedInvoice.ventasNoSujetas | formatMoney }}
              </td>
            </tr>
            <tr>
              <td align="right" class="font-semibold w-40">Venta total:</td>
              <td align="right" class="w-25">
                {{ selectedInvoice.ventaTotal | formatMoney }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showInvoicePreview = false" size="small"
          >Cerrar</el-button
        >
      </span>
    </el-dialog>

    <div class="flex flex-col space-4">
      <Notification
        v-if="errorMessage"
        class="w-full"
        type="danger"
        title="Error de comunicación"
        :message="errorMessage"
        :action="{
          title: 'Intentar nuevamente',
          function: () => $router.go(),
        }"
      />
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
          <template>
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
                    style="height: 60px"
                    v-for="item in activeCustomers"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                    <div
                      class="flex flex-row justify-between items-end py-1 leading-normal"
                    >
                      <div class="flex flex-col">
                        <span class="text-xs text-gray-500">{{
                          item.shortName
                        }}</span>
                        <span>{{ item.name }}</span>
                      </div>
                      <span class="text-xs text-gray-500">{{ item.nrc }}</span>
                    </div>
                  </el-option>
                </el-option-group>
                <!-- toda esbien -->
                <el-option-group key="INACTIVOS" label="INACTIVOS">
                  <el-option
                    style="height: 50px"
                    v-for="item in inactiveCustomers"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                    <div
                      class="flex flex-row justify-between items-end py-1 leading-normal"
                    >
                      <div class="flex flex-col">
                        <span class="text-xs text-gray-500">{{
                          item.shortName
                        }}</span>
                        <span>{{ item.name }}</span>
                      </div>
                      <span class="text-xs text-gray-500">{{ item.nrc }}</span>
                    </div>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </template>
          <template>
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
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>

          <template>
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
                  class="text:center"
                  v-for="status in statuses"
                  :key="status.id"
                  :label="status.name"
                  :value="status.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </div>
        <template></template>
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
                >
                </el-option>
              </el-option-group>
              <el-option-group key="INACTIVOS" label="INACTIVOS">
                <el-option
                  v-for="seller in inactiveSellers"
                  :key="seller.id"
                  :label="seller.name"
                  :value="seller.id"
                >
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <template>
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
                  >
                  </el-option>
                </el-option-group>
                <el-option-group key="INACTIVOS" label="INACTIVOS">
                  <el-option
                    v-for="zone in inactiveZones"
                    :key="zone.id"
                    :label="zone.name"
                    :value="zone.id"
                  >
                  </el-option>
                </el-option-group>
              </el-select> </el-form-item
          ></template>
          <template>
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
                  >
                  </el-option>
                </el-option-group>
                <el-option-group key="INACTIVOS" label="INACTIVOS">
                  <el-option
                    v-for="service in inactiveServices"
                    :key="service.id"
                    :label="service.name"
                    :value="service.id"
                  >
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </template>
        </div>
      </el-form>
      <div class="flex flex-col space-y-2">
        <!-- La tabla esta en la medida establecida -->
        <el-table
          @sort-change="sortBy"
          :data="invoices.invoices"
          stripe
          size="mini"
          v-loading="tableloading"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" />
          <el-table-column prop="index" width="50" label=" #" />
          <el-table-column
            label="# Documento"
            prop="sequence"
            width="140"
            sortable="custom"
          >
            <template slot-scope="scope">
              <span>
                {{ scope.row.authorization }}-{{ scope.row.sequence }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="Tipo"
            prop="documentType.id"
            width="75"
            sortable="custom"
          >
            <template slot-scope="scope">
              <span>
                {{ scope.row.documentType.code }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="Fecha"
            prop="invoiceDate"
            width="100"
            sortable="custom"
          />
          <el-table-column
            label="Cliente"
            prop="customerName"
            min-width="290"
            sortable="custom"
          />

          <el-table-column
            label="Estado"
            prop="status.id"
            width="110"
            sortable="custom"
          >
            <template slot-scope="scope">
              <el-tag
                size="small"
                type="info"
                v-if="scope.row.status.id == '1'"
              >
                <i class="el-icon-circle-plus"></i>
                {{ scope.row.status.name }}
              </el-tag>
              <el-tag size="small" v-else-if="scope.row.status.id == '2'">
                <i class="el-icon-warning"></i>
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
              <el-tag
                size="small"
                type="success"
                v-else-if="scope.row.status.id == '5'"
              >
                <i class="el-icon-success"></i>
                {{ scope.row.status.name }}</el-tag
              >
            </template>
          </el-table-column>

          <el-table-column
            label="Total"
            width="80"
            align="right"
            prop="ventaTotal"
            sortable="custom"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.ventaTotal | formatMoney }}</span>
            </template>
          </el-table-column>
          <el-table-column label width="70" align="center">
            <!-- dropdpwn selecction -->
            <template slot="header" v-if="multipleSelection.length > 0">
              <el-dropdown>
                <el-button
                  trigger="click"
                  icon="el-icon-more"
                  type="primary"
                  size="mini"
                  class="transition ease-out duration-700"
                ></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <i class="el-icon-view"></i>Vista previa
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <i class="el-icon-printer"></i>Imprimir documento
                  </el-dropdown-item>
                  <el-dropdown-item :divided="true">
                    <i class="el-icon-refresh-left"></i> Revertir estados
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <!-- dropdown 1 -->
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
                      $router.push(`/invoices/edit?ref=${scope.row.id}`)
                    "
                    v-if="scope.row.status.id == '1'"
                  >
                    <i class="el-icon-edit-outline"></i> Editar documento
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.status.id == 1"
                    @click.native="
                      printInvoice(scope.row.id, scope.row.documentType)
                    "
                  >
                    <i class="el-icon-printer"></i>
                    Imprimir documento
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.status.id == 2"
                    @click.native="
                      printInvoice(scope.row.id, scope.row.documentType)
                    "
                  >
                    <i class="el-icon-printer"></i> Re imprimir documento
                  </el-dropdown-item>
                  <el-dropdown-item
                    :divided="true"
                    v-if="
                      scope.row.status.id == '2' || scope.row.status.id == '3'
                    "
                    @click.native="reverseDocument(scope.row)"
                  >
                    <i class="el-icon-refresh-left"></i> Revertir estado
                  </el-dropdown-item>
                  <el-dropdown-item
                    :divided="true"
                    class="font-semibold"
                    v-if="
                      scope.row.status.id == '1' &&
                        !isLastInvoice(
                          scope.row.sequence,
                          scope.row.documentType.id,
                          scope.row.authorization
                        )
                    "
                    @click.native="deleteInvoice(scope.row)"
                  >
                    <i class="el-icon-delete"></i> Eliminar documento
                  </el-dropdown-item>
                  <el-dropdown-item
                    :divided="true"
                    class="text-red-500 font-semibold"
                    @click.native="voidDocument(scope.row)"
                    v-if="
                      scope.row.status.id === '2' ||
                        (isLastInvoice(
                          scope.row.sequence,
                          scope.row.documentType.id,
                          scope.row.authorization
                        ) &&
                          scope.row.status.id != '3')
                    "
                  >
                    <i class="el-icon-circle-close"></i>
                    Anular documento
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
      multipleSelection: [],
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
        prop: "",
        order: null,
      },

      showInvoicePreview: false,
      selectedInvoice: null,
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    sortBy({ column, prop, order }) {
      this.filter.prop = prop;
      this.filter.order = order;
      this.fetchInvoices();
    },
    isLastInvoice(sequence, documentTypeId, authorization) {
      // Filtra las facturas del mismo tipo y numero de autorizacion.
      const invoices = this.invoices.invoices.filter(
        (invoice) =>
          invoice.documentType.id === documentTypeId &&
          invoice.authorization === authorization
      );

      // Obtiene la secuencia maxima de las facturas
      const maxSequence = Math.max.apply(
        Math,
        invoices.map((invoice) => invoice.sequence)
      );

      // Verifica si la secuencia a analizar es menor que la secuencia maxima
      return sequence < maxSequence;
    },
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
      if (this.filter.order) {
        params = {
          ...params,
          prop: this.filter.prop,
          order: this.filter.order,
        };
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
    voidDocument({ id }) {
      this.$confirm(
        `¿Estás seguro que deseas anular este documento?`,
        "Confirmación",
        {
          confirmButtonText: `Si, anular`,
          cancelButtonText: "Cancelar",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "Procesando...";
              this.$axios
                .put(`/invoices/status/void/${id}`)
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
                  instance.confirmButtonText = `Si, anular`;
                  done();
                });
            }
            done();
          },
        }
      );
    },
    reverseDocument({ id }) {
      this.$confirm(
        `¿Estás seguro que deseas revertir el estado de este documento?`,
        "Confirmación",
        {
          confirmButtonText: `Si, revertir`,
          cancelButtonText: "Cancelar",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "Procesando...";
              this.$axios
                .put(`/invoices/status/reverse/${id}`)
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
                  instance.confirmButtonText = `Si, revertir`;
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
    printInvoice(id, documentType) {
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
              const invoice = () => this.$axios.get(`/invoices/${id}`);
              const document = () =>
                this.$axios.get(
                  `/invoices/documents/${documentType.id}/layout`
                );
              Promise.all([invoice(), document()])
                .then((res) => {
                  const [invoice, document] = res;
                  try {
                    const vadd = 1;
                    const hadd = 3;
                    const conf = document.data.layout;

                    // Crea el documento base
                    const pdfDocument = new jsPDF({
                      orientation: conf.orientation
                        ? conf.orientation
                        : "portrait",
                      unit: "mm",
                      format: conf.resolution,
                    });
                    pdfDocument.setFontSize(9.5);

                    // Agrega el encabezado
                    for (const header of conf.header) {
                      let value = "";
                      switch (header.value) {
                        case "invoice_autorization":
                          value = invoice.data.invoice.authorization;
                          break;
                        case "invoice_number":
                          value = invoice.data.invoice.sequence;
                          break;
                        case "customer_name":
                          value = invoice.data.invoice.customerName;
                          break;
                        case "invoice_date":
                          value = invoice.data.invoice.invoiceDate;
                          break;
                        case "customer_address1":
                          value = invoice.data.invoice.customerAddress1;
                          break;
                        case "customer_address2":
                          value = invoice.data.invoice.customerAddress2;
                          break;
                        case "customer_nrc":
                          value = invoice.data.invoice.customerNrc;
                          break;
                        case "customer_nit":
                          value = invoice.data.invoice.customerNit;
                          break;
                        case "customer_city":
                          value = invoice.data.invoice.customerCity;
                          break;
                        case "customer_giro":
                          value = invoice.data.invoice.customerGiro;
                          break;
                        case "customer_state":
                          value = invoice.data.invoice.customerState;
                          break;
                        case "seller_name":
                          value = invoice.data.invoice.invoicesSeller.name;
                          break;
                        case "payment_condition":
                          value =
                            invoice.data.invoice.invoicesPaymentsCondition.name;
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
                    for (const detail of invoice.data.invoice.details) {
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
                      const documentType = invoice.data.invoice.documentType;
                      // Price
                      pdfDocument.text(
                        sellingType.id == 3 || documentType.id == 3
                          ? documentType.id == 1
                            ? this.$options.filters.formatMoney(
                                parseFloat(unitPrice) * (incTax ? 1 : 1.13)
                              )
                            : documentType.id == 2
                            ? this.$options.filters.formatMoney(
                                parseFloat(unitPrice) / (incTax ? 1.13 : 1)
                              )
                            : this.$options.filters.formatMoney(
                                parseFloat(unitPrice)
                              )
                          : "",
                        conf.details.price.position[0] + position_x,
                        position_y
                      );

                      // Ventas no sujetas
                      pdfDocument.text(
                        sellingType.id == 1 && documentType.id != 3
                          ? this.$options.filters.formatMoney(ventaPrice)
                          : "",
                        conf.details.sujeto.position[0] + position_x,
                        position_y
                      );
                      // Ventas exentas
                      pdfDocument.text(
                        sellingType.id == 2 && documentType.id != 3
                          ? this.$options.filters.formatMoney(ventaPrice)
                          : "",
                        conf.details.exento.position[0] + position_x,
                        position_y
                      );
                      // Ventas afectas
                      pdfDocument.text(
                        sellingType.id == 3 || documentType.id == 3
                          ? documentType.id == 1
                            ? this.$options.filters.formatMoney(
                                parseFloat(ventaPrice) * (incTax ? 1 : 1.13)
                              )
                            : documentType.id == 2
                            ? this.$options.filters.formatMoney(
                                parseFloat(ventaPrice) / (incTax ? 1.13 : 1)
                              )
                            : this.$options.filters.formatMoney(
                                parseFloat(ventaPrice)
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
                          let sum =
                            parseFloat(invoice.data.invoice.sum) +
                            (invoice.data.invoice.documentType.id == 1
                              ? parseFloat(invoice.data.invoice.iva)
                              : 0);
                          value = this.$options.filters.formatMoney(sum);
                          break;
                        case "iva":
                          value = this.$options.filters.formatMoney(
                            invoice.data.invoice.iva
                          );
                          break;
                        case "subtotal":
                          value = this.$options.filters.formatMoney(
                            invoice.data.invoice.subtotal
                          );
                          break;
                        case "iva_retenido":
                          value = this.$options.filters.formatMoney(
                            invoice.data.invoice.ivaRetenido
                          );
                          break;
                        case "ventas_exentas":
                          value = this.$options.filters.formatMoney(
                            invoice.data.invoice.ventasExentas
                          );
                          break;
                        case "ventas_no_sujetas":
                          value = this.$options.filters.formatMoney(
                            invoice.data.invoice.ventasNoSujetas
                          );
                          break;
                        case "venta_total":
                          value = this.$options.filters.formatMoney(
                            invoice.data.invoice.ventaTotal
                          );
                          break;
                        case "venta_total_text":
                          value = numeroALetras(
                            invoice.data.invoice.ventaTotal
                          );
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

                    setTimeout(() => {
                      this.$confirm(
                        "¿Se ha impreso la factura correctamente?",
                        "Confirmación",
                        {
                          confirmButtonText: "Si, gracias",
                          cancelButtonText: "No",
                          type: "warning",
                          beforeClose: (action, instance, done) => {
                            if (action === "confirm") {
                              //PUT invoices/status/printed/:id
                              //esta parte imagino que no esta todacia
                              this.$axios
                                .put(`/invoices/status/printed/${id}`)
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
                                });
                              done();
                            } else {
                              done();
                            }
                          },
                        }
                      ).catch(() => {
                        this.$confirm(
                          "¿Deseas intentar imprimirlo nuevamente?",
                          "Confirmación",
                          {
                            confirmButtonText: "Si, porfavor",
                            cancelButtonText: "No, gracias",
                            type: "warning",
                          }
                        )
                          .then(() => {
                            this.printInvoice(id, documentType);
                          })
                          .catch(() => {
                            done();
                          });
                      });
                    }, 3000);

                    pdfDocument.autoPrint();

                    window.open(pdfDocument.output("bloburl"), "_blank");
                  } catch (error) {
                    this.$message.error(
                      "Error al generar el PDF, contacta con tu administrador."
                    );
                  }
                })
                .catch((err) => {
                  this.errorMessage = err.response.data.message;
                })
                .then((alw) => {
                  instance.confirmButtonLoading = false;
                  instance.confirmButtonText = `Si, imprimir`;
                  done();
                });
            } else {
              done();
            }
          },
        }
      );
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

<template>
  <layout-content
    v-loading="loading"
    page-title="Editar Factura"
    :breadcrumb="[
      { name: 'Facturas', to: '/sales' },

      { name: 'Editar factura', to: null },
    ]"
  >
    <!-- dialogo addservicio-->
    <el-dialog
      title="Agregar Servicio"
      :visible.sync="showAddService"
      width="550px"
      :close-on-click-modal="false"
      :append-to-body="true"
      @open="resetForm('newServiceForm')"
    >
      <el-form
        :model="newServiceForm"
        status-icon
        :rules="newServiceFormRules"
        ref="newServiceForm"
      >
        <!-- first row -->
        <div class="grid grid-cols-12">
          <!-- Servicio -->
          <div class="col-span-12">
            <el-form-item label="Servicio" prop="service">
              <el-select
                v-model="newServiceForm.service"
                clearable
                filterable
                @change="selectService(newServiceForm.service, 'new', services)"
                size="small"
                class="w-full"
                placeholder="Seleccionar servicio"
              >
                <el-option
                  v-for="s in services"
                  :key="s.id"
                  :label="s.name"
                  :value="s.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <!-- second row -->
        <div class="grid grid-cols-12 gap-4">
          <!-- Cantidad -->
          <div class="col-span-6">
            <el-form-item label="Cantidad" prop="quantity" ref="quantity">
              <el-input-number
                ref="quantity"
                type="number"
                :min="0"
                :step="1"
                v-model="newServiceForm.quantity"
                size="small"
                autocomplete="off"
                style="width: 100%"
                :disabled="newServiceForm.service === ''"
              >
              </el-input-number>
            </el-form-item>
          </div>
          <!-- precio -->
          <div class="col-span-6">
            <el-form-item label="Precio" prop="unitPrice">
              <div class="w-full flex items-end">
                <el-input-number
                  class="w-full mt-1"
                  type="number"
                  :min="0.0"
                  :step="0.01"
                  v-model="newServiceForm.unitPrice"
                  size="small"
                  autocomplete="off"
                  style="width: 100%"
                  :disabled="newServiceForm.service === ''"
                  :precision="2"
                >
                </el-input-number>
                <el-checkbox
                  v-if="newServiceForm.sellingType == 3"
                  border
                  v-model="newServiceForm.incTax"
                  size="small"
                  class="px-3 mt-1"
                  :disabled="newServiceForm.service === ''"
                  >IVA incl.</el-checkbox
                >
              </div>
            </el-form-item>
          </div>
        </div>
        <!-- third row -->
        <div class="grid grid-cols-12">
          <!--Descripcion -->
          <div class="col-span-12">
            <el-form-item label="Descripción" prop="chargeDescription">
              <el-input
                type="textarea"
                :rows="5"
                size="small"
                v-model="newServiceForm.chargeDescription"
                maxlength="5000"
                minlength="5"
                show-word-limit
                :disabled="newServiceForm.service === ''"
              >
              </el-input>
            </el-form-item>
          </div>
        </div>
        <!-- boton guardar cancelar -->
        <div class="flex justify-end dialog-footer">
          <el-button
            type="primary"
            size="small"
            @click.native="
              addToDetails('service', 'newServiceForm', newServiceForm)
            "
            >Guardar</el-button
          >
          <el-button @click="showAddService = false" size="small"
            >Cancelar</el-button
          >
        </div>
      </el-form>
    </el-dialog>
    <!-- dialogo editservicio -->
    <el-dialog
      title="Editar servicio"
      :visible.sync="showEditService"
      width="35%"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editServiceForm"
        status-icon
        :rules="newServiceFormRules"
        ref="editServiceForm"
        @submit.prevent.native="
          updateDetail(editingDetail, 'editServiceForm', editServiceForm)
        "
      >
        <!-- first row -->
        <div class="grid grid-cols-12">
          <!-- Servicio -->
          <div class="col-span-12">
            <el-form-item label="Servicio" prop="service">
              <el-select
                v-model="editServiceForm.service"
                clearable
                filterable
                @change="
                  selectService(editServiceForm.service, 'edit', services)
                "
                size="small"
                class="w-full"
                placeholder="Seleccionar servicio"
              >
                <el-option
                  v-for="s in services"
                  :key="s.id"
                  :label="s.name"
                  :value="s.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <!-- second row -->
        <div class="grid grid-cols-12 gap-4">
          <!-- Cantidad -->
          <div class="col-span-6">
            <el-form-item label="Cantidad" prop="quantity">
              <el-input-number
                ref="quantity"
                type="number"
                :min="0"
                :step="1"
                v-model="editServiceForm.quantity"
                size="small"
                autocomplete="off"
                style="width: 100%"
                :disabled="editServiceForm.service === ''"
              />
            </el-form-item>
          </div>
          <!-- precio -->
          <div class="col-span-6">
            <el-form-item label="Precio" prop="unitPrice">
              <div class="w-full flex items-end">
                <el-input-number
                  class="w-full mt-1"
                  ref="cost"
                  type="number"
                  :min="0.0"
                  :step="0.01"
                  v-model="editServiceForm.unitPrice"
                  size="small"
                  autocomplete="off"
                  style="width: 100%"
                  :disabled="editServiceForm.service === ''"
                  :precision="2"
                />
                <el-checkbox
                  border
                  v-if="editServiceForm.sellingType == 3"
                  v-model="editServiceForm.incTax"
                  size="small"
                  class="px-3 mt-1"
                  :disabled="editServiceForm.service === ''"
                  >IVA incl.</el-checkbox
                >
              </div>
            </el-form-item>
          </div>
        </div>
        <!-- third row -->
        <div class="grid grid-cols-12">
          <!--Descripcion -->
          <div class="col-span-12">
            <el-form-item label="Descripción" prop="chargeDescription">
              <el-input
                type="textarea"
                :rows="5"
                size="small"
                v-model="editServiceForm.chargeDescription"
                maxlength="5000"
                minlength="5"
                show-word-limit
                :disabled="editServiceForm.service === ''"
              >
              </el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click.native="
            updateDetail(editingDetail, 'editServiceForm', editServiceForm)
          "
          >Guardar</el-button
        >
        <el-button @click="showEditService = false" size="small"
          >Cancelar</el-button
        >
      </span>
    </el-dialog>
    <!-- noticication -->
    <!-- <div class="grid grid-cols-12">
      <div class="col-span-12">
        <Notification
          
          class="mb-4 w-full"
          type="danger"
          title="Atención"
          message="No puede dar crédito fiscal a un cliente que no declare IVA."
        />
      </div>
    </div> -->
    <el-form
      :model="salesEditForm"
      :rules="salesEditFormRules"
      status-icon
      @submit.prevent.native="
        saveUpdateInvoice('salesEditForm', salesEditForm, details)
      "
      ref="salesEditForm"
    >
      <div class="flex flex-col space-y-4">
        <div class="flex flex-col">
          <!-- first row -->
          <div class="grid grid-cols-12 gap-4">
            <!-- tipo de documento -->
            <div class="col-span-3">
              <el-form-item label="Tipo de documento" prop="documentType">
                <el-select
                  v-model="salesEditForm.documentType"
                  class="w-full"
                  size="small"
                  clearable
                  placeholder="Seleccionar"
                  disabled
                >
                  <el-option
                    v-for="d in documents"
                    :key="d.id"
                    :label="`${d.code} - ${d.name}`"
                    :value="d.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <!-- n° autorizacion -->
            <div class="col-span-2 col-start-7">
              <el-form-item label="N° de autorización">
                <el-input
                  size="small"
                  placeholder=""
                  v-model="salesEditForm.authorization"
                  :disabled="true"
                >
                </el-input>
              </el-form-item>
            </div>
            <!-- n° Correlativo -->
            <div class="col-span-2">
              <el-form-item label="N° de correlativo">
                <el-input
                  size="small"
                  placeholder=""
                  v-model="salesEditForm.sequence"
                  :disabled="true"
                >
                </el-input>
              </el-form-item>
            </div>
            <!-- Fecha Factura -->
            <div class="col-span-2">
              <el-form-item label="Fecha de factura" prop="invoiceRawDate">
                <el-date-picker
                  v-model="salesEditForm.invoiceRawDate"
                  size="small"
                  type="date"
                  placeholder=""
                  :picker-options="pickerOptions"
                  style="width: 100%"
                  format="dd/MM/yyyy"
                >
                </el-date-picker>
              </el-form-item>
            </div>
          </div>
          <!-- second row -->
          <div class="grid grid-cols-12 gap-4">
            <!-- cliente -->
            <div class="col-span-4">
              <el-form-item label="Cliente" prop="customer">
                <el-select
                  v-model="salesEditForm.customer"
                  size="small"
                  class="w-full"
                  clearable
                  filterable
                  default-first-option
                  placeholder="Seleccionar"
                  disabled
                >
                  <el-option
                    v-for="c in customers"
                    :key="c.id"
                    :label="c.name"
                    :value="c.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <!-- sucursal -->
            <div class="col-span-2">
              <el-form-item label="Sucursal" prop="customerBranch">
                <el-select
                  v-model="salesEditForm.customerBranch"
                  class="w-full"
                  clearable
                  filterable
                  default-first-option
                  size="small"
                  placeholder="Seleccionar"
                  @change="selectBranch(salesEditForm.branch, branches)"
                >
                  <el-option
                    v-for="br in branches"
                    :key="br.id"
                    :label="br.name"
                    :value="br.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <!-- condiciones de pago -->
            <div class="col-span-3">
              <el-form-item
                label="Condiciones de pago"
                prop="invoicesPaymentsCondition"
              >
                <el-select
                  v-model="salesEditForm.invoicesPaymentsCondition"
                  size="small"
                  class="w-full"
                  clearable
                  filterable
                  default-first-option
                  placeholder="Seleccionar"
                >
                  <el-option
                    v-for="p in paymentConditions"
                    :key="p.value"
                    :label="p.name"
                    :value="p.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>

            <!-- Venta a cuenta de -->
            <div class="col-span-3">
              <el-form-item label="Venta a cuenta de" prop="invoicesSellers">
                <el-select
                  v-model="salesEditForm.invoicesSellers"
                  class="w-full"
                  size="small"
                  clearable
                  filterable
                  default-first-option
                  placeholder="Seleccionar"
                >
                  <el-option
                    v-for="s in sellers"
                    :key="s.value"
                    :label="s.name"
                    :value="s.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <!-- third row -->
          <div class="grid grid-cols-12 gap-4 text-xs">
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
          <div
            v-if="!activeNotification"
            class="grid grid-cols-12 gap-4 text-xs text-gray-700"
          >
            <!-- NRC -->
            <div class="col-span-1">
              <span>{{ tributary != null ? tributary.customerNrc : "" }}</span>
            </div>
            <!-- NIT -->
            <div class="col-span-2">
              <span>{{ tributary != null ? tributary.customerNit : "" }}</span>
            </div>
            <!-- Direccion -->
            <div class="col-span-3">
              <span>{{
                Object.keys(branch).length > 0 ? branch.address1 : ""
              }}</span>
            </div>
            <!-- departamento -->
            <div class="col-span-2">
              <span>{{
                Object.keys(branch).length > 0 ? branch.state.name : ""
              }}</span>
            </div>
            <!-- Municipio -->
            <div class="col-span-2">
              <span>{{
                Object.keys(branch).length > 0 ? branch.city.name : ""
              }}</span>
            </div>
            <!-- Giro -->
            <div class="col-span-2">
              <span>{{ tributary != null ? tributary.customerGiro : "" }}</span>
            </div>
          </div>

          <!-- fourth row btn agregarservicio -->
          <div class="flex justify-end">
            <el-button type="primary" size="small" @click="openDialog('new')"
              >Agregar Servicio</el-button
            >
          </div>
        </div>
        <!-- table row -->
        <div class="grid grid-cols-12">
          <div class="col-span-12">
            <el-table :data="details" style="width: 100%" stripe size="small">
              <el-table-column type="index" label="#" />
              <el-table-column prop="quantity" label="Cant." min-width="50" />
              <el-table-column
                prop="chargeDescription"
                label="Descripción"
                width="270"
              />
              <el-table-column
                label="Precio Unit."
                min-width="75"
                align="right"
              >
                <template slot-scope="scope">
                  <span>{{
                    calcUniPrice(salesEditForm.documentType, scope.row)
                      | formatMoney
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="vnosujeta"
                label="V. No sujeta"
                min-width="75"
                align="right"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.sellingType == 1">{{
                    calcSujeta(salesEditForm.documentType, scope.row)
                      | formatMoney
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="vexenta"
                label="V. Exenta"
                min-width="75"
                align="right"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.sellingType == 2">{{
                    calcExenta(salesEditForm.documentType, scope.row)
                      | formatMoney
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="vgravada"
                label="V. Gravada"
                min-width="75"
                align="right"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.sellingType == 3">{{
                    calcGravada(salesEditForm.documentType, scope.row)
                      | formatMoney
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column min-width="80">
                <template slot-scope="scope">
                  <div class="flex flex-row items-center justify-center">
                    <el-button
                      type="primary"
                      @click="openEditDetail(scope.$index, scope.row)"
                      size="small"
                      icon="el-icon-edit"
                      circle
                    ></el-button>
                    <el-button
                      type="danger"
                      @click="deleteDetail(scope.$index)"
                      size="small"
                      icon="el-icon-delete"
                      circle
                    ></el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- sumas -->
        <table class="flex justify-end">
          <tbody class="text-sm divide-y divide-gray-300">
            <tr class="flex space-x-16">
              <td align="right" class="text-blue-900 w-50">SUMAS:</td>
              <td align="right" class="text-gray-800">
                {{ sumas | formatMoney }}
              </td>
            </tr>
            <tr class="flex space-x-16" v-if="salesEditForm.documentType === 2">
              <td align="right" class="text-blue-900 w-50">13% Iva:</td>
              <td align="right" class="text-gray-800">
                {{ taxes | formatMoney }}
              </td>
            </tr>
            <tr class="flex space-x-16">
              <td align="right" class="text-blue-900 w-50">Subtotal:</td>
              <td align="right" class="text-gray-800">
                {{ subtotal | formatMoney }}
              </td>
            </tr>
            <tr class="flex space-x-16">
              <td align="right" class="text-blue-900 w-50">Iva retenido:</td>
              <td align="right" class="text-gray-800">
                {{ ivaRetenido | formatMoney }}
              </td>
            </tr>
            <tr class="flex space-x-16">
              <td align="right" class="text-blue-900 w-50">Ventas exentas:</td>
              <td align="right" class="text-gray-800">
                {{ ventasExentas | formatMoney }}
              </td>
            </tr>
            <tr class="flex space-x-16">
              <td align="right" class="text-blue-900 w-50">
                Ventas no sujetas:
              </td>
              <td align="right" class="text-gray-800">
                {{ ventasNoSujetas | formatMoney }}
              </td>
            </tr>
            <tr class="flex space-x-16">
              <td align="right" class="text-blue-900 font-semibold w-50">
                Venta total:
              </td>
              <td align="right" class="text-gray-800">
                {{ ventaTotal | formatMoney }}
              </td>
            </tr>
          </tbody>
        </table>
        <!-- boton guardar cancelar -->
        <div class="flex justify-end">
          <el-button
            v-if="!activeNotification"
            type="primary"
            size="small"
            native-type="submit"
            >Guardar</el-button
          >
          <el-button size="small">Cancelar</el-button>
        </div>
      </div>
    </el-form>
  </layout-content>
</template>

<script>
import LayoutContent from "../../../components/layout/Content";
import {
  inputValidation,
  selectValidation,
  checkBeforeLeave,
  checkBeforeEnter,
  amountValidate,
} from "../../../tools";
import Notification from "../../../components/Notification";

const storagekey = "Edit-sales";

export default {
  name: "InvoicesEdit",
  components: { LayoutContent, Notification },
  fetch() {
    this.$axios
      .get(`/invoices/${this.$route.params.id}`)
      .then(({ data }) => {
        const customer = () =>
          this.$axios.get(`/customers/${data.invoice.customer.id}`, {
            params: { isActiveCustomer: true },
          });
        const branches = () =>
          this.$axios.get(`/customers/${data.invoice.customer.id}/branches`);
        const sellers = () =>
          this.$axios.get("/invoices/sellers", {
            params: { active: true },
          });
        const paymentsConditions = () =>
          this.$axios.get("/invoices/payment-condition");

        const documentTypes = () => this.$axios.get("/invoices/document-types");

        Promise.all([
          customer(),
          sellers(),
          paymentsConditions(),
          documentTypes(),
          branches(),
        ])
          .then((res) => {
            const [
              customer,
              sellers,
              paymentConditions,
              documentTypes,
              branches,
            ] = res;

            this.customers = [customer.data.customer];
            this.documents = documentTypes.data.documentTypes;
            this.sellers = sellers.data.sellers;
            this.paymentConditions = paymentConditions.data.paymentConditions;
            this.branches = branches.data.branches;
            this.salesEditForm = {
              ...data.invoice,
              customer: data.invoice.customer.id,
              branch: data.invoice.customerBranch.id,
              invoicesPaymentsConditions:
                data.invoice.invoicesPaymentsCondition.id,
              invoicesSellers: data.invoice.invoicesSeller.id,
              documentType: data.invoice.documentType.id,
            };

            this.tributary = {
              customerNrc: data.invoice.customerNrc,
              customerNit: data.invoice.customerNit,
              customerGiro: data.invoice.customerGiro,
            };
            this.details = data.invoice.details.map((de) => {
              return {
                ...de,

                types: de.service ? "service" : "",
                sellingType: de.sellingType.id,
                service: de.service.id,
              };
            });
            this.branch = {
              address1: data.invoice.customerAddress1,
              state: { name: data.invoice.customerState },
              city: { name: data.invoice.customerCity },
            };

            this.loading = false;
          })
          .catch((err) => {
            console.log(err);
            this.errorMessage = err.response.data.message;
          });
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message;
      });

    // checkBeforeEnter(this, storagekey, "salesNewForm");
  },
  fetchOnServer: false,
  beforeRouteLeave(to, from, next) {
    checkBeforeLeave(this, storagekey, next);
  },
  data() {
    return {
      errorMessage: {},
      branch: {},
      details: [],
      activeNotification: false,
      sales: [],
      loading: false,
      selectedInvoice: {},
      salesEditForm: {
        documentType: "",
        authorization: "",
        sequence: "",
        invoiceDate: "",
        customer: "",
        customerBranch: "",
        invoicesPaymentsCondition: null,
        invoicesSellers: null,
        invoiceRawDate: "",
      },
      salesEditFormRules: {
        documentType: selectValidation(true),
        invoiceRawDate: selectValidation(true),
        customer: selectValidation(true),
        customerBranch: selectValidation(true),
        invoicesPaymentsCondition: selectValidation(true),
        invoicesSellers: selectValidation(true),
      },
      sellers: [],
      paymentConditions: [],
      branches: null,
      customers: [],
      documents: [],
      dialogVisible: false,
      pickerOptions: {
        shortcuts: [
          {
            text: "Ahora",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "Ayer",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "Mañana",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      newServiceForm: {
        service: "",
        quantity: null,
        chargeDescription: null,
        incTax: false,
        sellingType: null,
        unitPrice: null,
      },
      editServiceForm: {
        service: "",
        quantity: null,
        unitPrice: null,
        chargeDescription: null,
        incTax: false,
        sellingType: null,
      },
      newServiceFormRules: {
        service: selectValidation(true),
        quantity: amountValidate("blur", true, 1),
        unitPrice: amountValidate("blur", true, 0),
        chargeDescription: inputValidation(true, 5, 5000),
      },
      services: [],
      tributary: null,
      documentInfo: null,
      showAddService: false,
      service: null,
      showEditService: false,
    };
  },
  methods: {
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
        this.newServiceForm.incTax = false;
      }
    },
    openDialog(type) {
      this.$axios
        .get("/services", { params: { active: true } })
        .then((res) => {
          this.services = res.data.services;
          switch (type) {
            case "new":
              this.showAddService = true;
              break;
            case "edit":
              this.showAddService = false;
              break;
          }
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        });
    },
    selectService(id, type, services) {
      const service = services.find((s) => s.id == id);
      switch (type) {
        case "new":
          this.newServiceForm.unitPrice = service.cost;
          this.newServiceForm.chargeDescription = service.description;
          this.newServiceForm.sellingType = service.sellingType.id;
          break;
        case "edit":
          this.editServiceForm.unitPrice = service.cost;
          this.editServiceForm.chargeDescription = service.description;
          this.editServiceForm.sellingType = service.sellingType.id;

          break;
      }
    },
    selectBranch(id, branches) {
      if (id) {
        const branch = branches.find((b) => b.id == id);
        this.branch = { ...branch };
        this.salesEditForm.branch = this.branch;
      } else {
        this.branch = {};
      }
    },
    getCustomerDetails(id) {
      if (id) {
        const branches = () => {
          return this.$axios.get(`/customers/${id}/branches`);
        };
        const tributary = () => {
          return this.$axios.get(`/customers/${id}/tributary`);
        };

        Promise.all([branches(), tributary()])
          .then((res) => {
            const [branches, tributary, taxerType] = res;
            this.branches = branches.data.branches;
            // this.$refs.branch.resetField()
            this.branch = {};
            this.tributary = tributary.data.customer;
            this.loading = false;
            this.validateDocumentType(
              this.salesEditForm.documentType,
              this.tributary
            );
            console.log(this.salesEditForm.documentType, this.tributary);
            this.$refs.branch.resetField();
            this.branch = {};
            this.selectBranch(this.salesEditForm.customer, this.branches);
          })
          .catch((err) => {
            this.errorMessage = err.response.data.message;
          });
      } else {
        this.salesEditForm.branch = "";
        this.branches = null;
        this.branch = {};
        this.tributary = {};
      }
    },
    validateDocumentType(id, tributary) {
      this.setStorage(this.salesEditForm);
      if (tributary) {
        switch (id) {
          case 2:
            if (
              tributary.customerType.id == 2 &&
              tributary.customerTypeNatural.id == 1
            ) {
              this.activeNotification = true;
            } else {
              this.activeNotification = false;
            }
            break;
          case 1:
            this.activeNotification = false;
            break;
        }
      }
    },
    addToDetails(types, formName, data) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }
        this.details.push({
          types,
          ...data,
          ventaPrice: data.unitPrice * data.quantity,
        });
        this.showAddService = false;
      });
    },
    openEditDetail(index, details) {
      this.openDialog("edit");
      const { types } = details;
      this.editingDetail = index;
      switch (types) {
        case "service":
          this.editServiceForm = { ...details };
          this.showEditService = true;
          break;
      }
    },
    deleteDetail(index) {
      this.$confirm(
        "¿Estás seguro que deseas eliminar este detalle?",
        "Confirmación",
        {
          confirmButtonText: "Si, eliminar",
          cancelButtonText: "Cancelar",
          type: "warning",
        }
      ).then(() => {
        this.details.splice(index, 1);
      });
    },
    updateDetail(index, formName, form) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }
        const types = this.details[index].types;
        const sellingType = this.details[index].sellingType;
        this.details.splice(index, 1, { ...form, sellingType, types });
        this.showEditService = false;
      });
    },
    saveUpdateInvoice(formName, formData, details) {
      console.log(formData);
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$confirm(
          "¿Estás seguro que deseas actualizar esta  venta?",
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
                  .put(`/invoices/${this.$route.params.id}`, {
                    header: {
                      documentType: formData.documentType,
                      authorization: formData.authorization,
                      sequence: formData.sequence,
                      invoiceDate: formData.invoiceRawDate,

                      customer: formData.customer,
                      customerBranch: formData.customerBranch.id,
                      invoicesPaymentsCondition:
                        formData.invoicesPaymentsCondition.id,
                      invoicesSeller: formData.invoicesSellers,
                      sum: this.sumas,
                      iva: this.taxes,
                      subtotal: this.subtotal,
                      ivaRetenido: this.ivaRetenido,
                      ventasExentas: this.ventasExentas,
                      ventasNoSujetas: this.ventasNoSujetas,
                      ventaTotal: this.ventaTotal,
                    },
                    details: details.map((d) => {
                      return {
                        chargeDescription: d.chargeDescription,
                        quantity: d.quantity,
                        unitPrice: d.unitPrice,
                        incTax: d.incTax,
                        ventaPrice: d.ventaPrice,
                        service: d.service,
                        sellingType: d.sellingType,
                      };
                    }),
                  })
                  .then((res) => {
                    this.$notify.success({
                      title: "Exito",
                      message: res.data.message,
                    });
                    localStorage.removeItem(storagekey);
                    setTimeout(() => {
                      this.$router.push("/invoices");
                    }, 300);
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

    calcUniPrice(documentType, { unitPrice, incTax, sellingType }) {
      let uniPrice = null;
      const amount = parseFloat(unitPrice);
      let message = null;
      if ((sellingType == 1) | (sellingType == 2)) {
        uniPrice = amount;
      } else {
        if (documentType) {
          switch (documentType) {
            case 1:
              uniPrice = amount * (incTax ? 1 : 1.13);

              break;
            case 2:
              uniPrice = amount / (incTax ? 1.13 : 1);

              break;
          }
        }
      }
      return uniPrice;
    },
    calcSujeta(documentType, { unitPrice, incTax, sellingType, quantity }) {
      let uniPrice = null;
      const amount = parseFloat(unitPrice);

      if ((sellingType == 1) | (sellingType == 2)) {
        uniPrice = amount * quantity;
      }

      return uniPrice;
    },
    calcGravada(documentType, { unitPrice, incTax, sellingType, quantity }) {
      let uniPrice = null;
      const amount = parseFloat(unitPrice);
      switch (documentType) {
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

      if ((sellingType == 1) | (sellingType == 2)) {
        uniPrice = amount * quantity;
      }

      return uniPrice;
    },
  },
  computed: {
    sumas() {
      const details = this.details;
      let sumas = 0;
      if (details) {
        switch (this.salesEditForm.documentType) {
          case 1:
            for (const d of details) {
              if (d.sellingType === 3) {
                sumas +=
                  parseInt(d.quantity) *
                  parseFloat(d.unitPrice) *
                  (d.incTax ? 1 : 1.13);
              }
            }
            break;
          case 2:
            for (const d of details) {
              if (d.sellingType === 3) {
                sumas +=
                  (parseInt(d.quantity) * parseFloat(d.unitPrice)) /
                  (d.incTax ? 1.13 : 1);
              }
            }
            break;
        }
      }
      return sumas;
    },
    taxes() {
      const details = this.details;
      let taxes = 0;
      if (details) {
        switch (this.salesEditForm.documentType) {
          case 2:
            for (const d of details) {
              if (d.sellingType === 3) {
                if (d.incTax) {
                  const total = parseInt(d.quantity) * parseFloat(d.unitPrice);
                  taxes += total - total / 1.13;
                } else {
                  const total = parseInt(d.quantity) * parseFloat(d.unitPrice);
                  taxes += total * 1.13 - total;
                }
              }
            }
            break;
        }
      }
      return taxes;
    },
    subtotal() {
      return this.sumas + this.taxes;
    },

    ventasExentas() {
      const details = this.details.filter((d) => d.sellingType == 2);
      return details.reduce(
        (a, b) => {
          return {
            total: a.total + b.unitPrice * b.quantity,
          };
        },
        { total: 0 }
      ).total;
    },
    ventasNoSujetas() {
      const details = this.details.filter((d) => d.sellingType == 1);
      return details.reduce(
        (a, b) => {
          return {
            total: a.total + b.unitPrice * b.quantity,
          };
        },
        { total: 0 }
      ).total;
    },
    ventaTotal() {
      return (
        this.subtotal +
        this.ventasExentas +
        this.ventasNoSujetas +
        this.ivaRetenido
      );
    },
    ivaRetenido() {
      let ivaRetenido = 0;
      const tributary = this.tributary;

      if (
        tributary != null &&
        tributary.customerTaxerType != null &&
        tributary.customerTaxerType === 3
      ) {
        switch (this.salesEditForm.documentType) {
          case 1:
            ivaRetenido = this.sumas > 100 ? (this.sumas / 1.13) * 0.01 : 0;
            break;
          case 2:
            ivaRetenido = this.sumas * (this.sumas > 100 ? 0.01 : 0);
            break;
        }
      }
      return ivaRetenido;
    },
  },
};
</script>




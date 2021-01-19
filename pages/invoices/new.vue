<template>
  <layout-content
    v-loading="loading"
    page-title="Nueva Venta"
    :breadcrumb="[
      { name: 'Ventas', to: '/sales' },

      { name: 'Nueva Venta', to: null },
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
    <div class="grid grid-cols-12">
      <div class="col-span-12">
        <Notification
          v-if="activeNotification"
          class="mb-4 w-full"
          type="danger"
          title="Atención"
          message="No puede dar crédito fiscal a un cliente que no declare IVA."
        />
      </div>
    </div>
    <el-form
      :model="salesNewForm"
      :rules="salesNewFormRules"
      status-icon
      @submit.native.prevent="
        submitNewSale('salesNewForm', salesNewForm, details)
      "
      ref="salesNewForm"
    >
      <div class="flex flex-col space-y-4">
        <div class="flex flex-col">
          <!-- first row -->
          <div class="grid grid-cols-12 gap-4">
            <!-- tipo de documento -->
            <div class="col-span-3">
              <el-form-item label="Tipo de documento" prop="documentType">
                <el-select
                  v-model="salesNewForm.documentType"
                  class="w-full"
                  size="small"
                  clearable
                  placeholder="Seleccionar"
                  @change="
                    validateDocumentType(salesNewForm.documentType, tributary)
                  "
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
                  v-model="salesNewForm.authorization"
                  :disabled="true"
                  readonly
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
                  v-model="salesNewForm.sequence"
                  :disabled="true"
                  readonly
                >
                </el-input>
              </el-form-item>
            </div>
            <!-- Fecha Factura -->
            <div class="col-span-2">
              <el-form-item label="Fecha de venta" prop="invoiceDate">
                <el-date-picker
                  v-model="salesNewForm.invoiceDate"
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
                  v-model="salesNewForm.customer"
                  size="small"
                  class="w-full"
                  clearable
                  filterable
                  default-first-option
                  placeholder="Seleccionar"
                  @change="getCustomerDetails(salesNewForm.customer)"
                >
                  <el-option
                    v-for="c in customers"
                    :key="c.id"
                    :label="c.name"
                    :value="c.id"
                    @change="setStorage(salesNewForm)"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <!-- sucursal -->
            <div class="col-span-2">
              <el-form-item label="Sucursal" prop="branch">
                <el-select
                  v-model="salesNewForm.customerBranch"
                  class="w-full"
                  clearable
                  filterable
                  default-first-option
                  size="small"
                  placeholder="Seleccionar"
                  @change="selectBranch(salesNewForm.customerBranch, branches)"
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
                  v-model="salesNewForm.invoicesPaymentsCondition"
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
                  v-model="salesNewForm.invoicesSellers"
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
              <span>{{ tributary != null ? tributary.nrc : "" }}</span>
            </div>
            <!-- NIT -->
            <div class="col-span-2">
              <span>{{ tributary != null ? tributary.nit : "" }}</span>
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
              <span>{{ tributary != null ? tributary.giro : "" }}</span>
            </div>
          </div>

          <!-- fourth row btn agregarservicio -->
          <div class="flex justify-end">
            <el-button type="primary" size="small" @click="openDialog()"
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
                    calcUnitPrice(salesNewForm.documentType, scope.row)
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
                    calcSujeta(salesNewForm.documentType, scope.row)
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
                    calcExenta(salesNewForm.documentType, scope.row)
                      | formatMoney
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="vgrabada"
                label="V. Gravada"
                min-width="75"
                align="right"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.sellingType == 3">{{
                    calcGravada(salesNewForm.documentType, scope.row)
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
            <tr class="flex space-x-16" v-if="salesNewForm.documentType === 2">
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
          <el-button size="small" @click="$router.push('/invoices')">Cancelar</el-button>
        </div>
      </div>
    </el-form>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import {
  inputValidation,
  selectValidation,
  checkBeforeLeave,
  checkBeforeEnter,
  amountValidate,
} from "../../tools";
import Notification from "../../components/Notification";

const storagekey = "new-sales";

export default {
  name: "InvoicesNew",
  components: { LayoutContent, Notification },
  fetch() {
    const sellers = () => {
      return this.$axios.get("/invoices/sellers", { params: { active: true } });
    };
    const paymentsConditions = () => {
      return this.$axios.get("/invoices/payment-condition");
    };
    const customers = () => {
      return this.$axios.get("/customers", {
        params: { isActiveCustomer: true },
      });
    };
    const documentTypes = () => {
      return this.$axios.get("/invoices/document-types");
    };

    Promise.all([sellers(), paymentsConditions(), customers(), documentTypes()])
      .then((res) => {
        const [sellers, paymentConditions, customers, documents] = res;

        this.sellers = sellers.data.sellers;
        this.paymentConditions = paymentConditions.data.paymentConditions;
        this.customers = customers.data.customers;
        this.documents = documents.data.documentTypes;
        this.loading = false;
        this.salesNewForm.documentType = 1;
        this.validateDocumentType(
          this.salesNewForm.documentType,
          this.tributary
        );
      })
      .catch((err) => {
        console.log(err);
        this.errorMessage = err.response.data.message;
      });
  },
  fetchOnServer: false,
  data() {
    return {
      branch: {},
      details: [],
      activeNotification: false,
      sales: [],
      loading: false,
      salesNewForm: {
        documentType: "",
        authorization: "",
        sequence: "",
        invoiceDate: "",
        customer: "",
        customerBranch: "",
        invoicesPaymentsCondition: null,
        invoicesSellers: null,
      },
      salesNewFormRules: {
        documentType: selectValidation(true),
        invoiceDate: selectValidation(true),
        customer: selectValidation(true),
        customerBranch: selectValidation(true),
        invoicesPaymentConditions: selectValidation(true),
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
    openDialog() {
      this.$axios
        .get("/services", { params: { active: true } })
        .then((res) => {
          this.services = res.data.services;
          this.showAddService = true;
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

            this.tributary = tributary.data.customer;
            this.loading = false;
            this.validateDocumentType(
              this.salesNewForm.documentType,
              this.tributary
            );

            this.branch = {};
            this.salesNewForm.customerBranch = "";
            this.selectBranch(this.salesNewForm.customer, this.branches);
          })
          .catch((err) => {
            console.log(err);
            this.errorMessage = err.response.data.message;
          });
      } else {
        this.salesNewForm.customerBranch = "";
        this.branches = null;
        this.branch = {};
        this.tributary = {};
      }
    },
    validateDocumentType(id, tributary) {
      if (id) {
        this.$axios
          .get("/invoices/documents", { params: { type: id } })
          .then((res) => {
            this.documentInfo = res.data.documents;
            this.salesNewForm.authorization =
              res.data.documents[0].authorization;
            this.salesNewForm.sequence = res.data.documents[0].current;
          })
          .catch((err) => {
            this.errorMessage = err.response.data.message;
          });
      } else {
        this.salesNewForm.auth = "";
        this.salesNewForm.next = "";
      }
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
    submitNewSale(formName, formData, details) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$confirm(
          "¿Estás seguro que deseas guardar esta nueva venta?",
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
                  .post("/invoices", {
                    header: {
                      documentType: formData.documentType,
                      authorization: formData.authorization,
                      sequence: formData.sequence,
                      invoiceDate: this.$dateFns.format(
                        formData.invoiceDate,
                        "yyyy-MM-dd"
                      ),
                      customer: formData.customer,
                      customerBranch: formData.customerBranch,
                      invoicesPaymentsCondition:
                        formData.invoicesPaymentsCondition,
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
                      this.$confirm(
                        "¿Deseas crear una nueva venta?",
                        "Confirmación",
                        {
                          confirmButtonText: "Si, porfavor",
                          cancelButtonText: "No, gracias",
                          type: "warning",
                          closeOnClickModal: false,
                          closeOnPressEscape: false,
                        }
                      )
                        .then(() => {
                          this.resetForm("salesNewForm");
                          this.salesNewForm.documentType = 1;
                          this.salesNewForm.customerBranch = "";
                          this.details = [];
                          this.branches = [];
                          this.branch = {};
                          this.tributary = {};
                        })
                        .catch(() => {
                          this.$router.push("/invoices");
                        });
                    }, 500);
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

    calcUnitPrice(documentType, { unitPrice, incTax, sellingType }) {
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
              this.newServiceForm.unitPrice = uniPrice;
              break;
            case 2:
              uniPrice = amount / (incTax ? 1.13 : 1);
              this.newServiceForm.unitPrice = uniPrice;
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
        switch (this.salesNewForm.documentType) {
          case 1:
            for (const d of details) {
              if (d.sellingType === 3) {
                sumas +=
                  parseFloat(d.quantity) *
                  parseFloat(d.unitPrice) *
                  (d.incTax ? 1 : 1.13);
              }
            }
            break;
          case 2:
            for (const d of details) {
              if (d.sellingType === 3) {
                sumas +=
                  (parseFloat(d.quantity) * parseFloat(d.unitPrice)) /
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
        switch (this.salesNewForm.documentType) {
          case 2:
            for (const d of details) {
              if (d.sellingType === 3) {
                if (d.incTax) {
                  const total =
                    parseFloat(d.quantity) * parseFloat(d.unitPrice);
                  taxes += total - total / 1.13;
                } else {
                  const total =
                    parseFloat(d.quantity) * parseFloat(d.unitPrice);
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
        switch (this.salesNewForm.documentType) {
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

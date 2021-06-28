<template>
  <layout-content
    page-title="Editar registro"
    :breadcrumb="[
      { name: 'IVA', to: '/taxes' },
      { name: 'Editar registro', to: null },
    ]"
  >
    <div class="flex flex-col space-y-2">
      <el-form
        :model="taxesEditForm"
        :rules="taxesEditFormRules"
        ref="taxesEditForm"
        @submit.prevent.native="submitEditTax('taxesEditForm', taxesEditForm)"
      >
        <div class="grid grid-cols-12 gap-4">
          <el-form-item
            label="Tipo de registro"
            class="col-span-3"
            prop="registerType"
          >
            <el-select
              v-model="taxesEditForm.registerType"
              class="w-full"
              clearable
              filterable
              size="small"
              @change="entity(taxesEditForm.registerType)"
              disabled
            >
              <el-option
                v-for="item in registerType"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="Tipo de documento"
            class="col-span-3"
            prop="documentType"
          >
            <el-select
              v-model="taxesEditForm.documentType"
              class="w-full"
              clearable
              filterable
              size="small"
            >
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
        <div class="grid grid-cols-12 gap-4">
          <el-form-item
            label="Cliente / Proveedor"
            class="col-span-5"
            prop="entity"
          >
            <el-select
              class="w-full"
              clearable
              filterable
              size="small"
              v-model="taxesEditForm.entity"
              placeholder="Seleccionar"
            >
              <el-option-group key="ACTIVOS" label="ACTIVOS">
                <el-option
                  v-for="item in activeEntity"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                  <div
                    class="
                      flex flex-row
                      justify-between
                      items-end
                      py-1
                      leading-normal
                    "
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
              <el-option-group key="INACTIVOS" label="INACTIVOS">
                <el-option
                  style="height: 50px"
                  v-for="item in inactiveEntity"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                  <div
                    class="
                      flex flex-row
                      justify-between
                      items-end
                      py-1
                      leading-normal
                    "
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
          <el-form-item
            class="col-span-3"
            label="Fecha de emisión del documento"
            prop="date"
          >
            <el-date-picker
              v-model="taxesEditForm.date"
              size="small"
              class="w-full"
              type="date"
              placeholder="Selecciona un mes"
              :picker-options="pickerOptions"
              style="width: 100%"
              format="dd/MM/yyyy"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item
            label="N° de autorización"
            class="col-span-2"
            prop="authorization"
          >
            <el-input
              placeholder="000000"
              v-model="taxesEditForm.authorization"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="N° de correlativo"
            class="col-span-2"
            prop="sequence"
          >
            <el-input
              placeholder="000000"
              v-model="taxesEditForm.sequence"
              size="small"
            ></el-input>
          </el-form-item>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <el-form-item label="Sumas" class="col-span-2" prop="sum">
            <el-input-number
              v-model="taxesEditForm.sum"
              type="number"
              :min="0.0"
              :step="0.01"
              size="small"
              autocomplete="off"
              :precision="2"
              style="width: 100%"
            >
            </el-input-number>
          </el-form-item>

          <el-form-item label="IVA" class="col-span-2" prop="iva">
            <el-input-number
              v-model="taxesEditForm.iva"
              :value="taxes"
              type="number"
              :min="0.0"
              :step="0.01"
              size="small"
              autocomplete="off"
              :precision="2"
              style="width: 100%"
              :disabled="true"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item
            label="Subtotal"
            prop="subtotal"
            class="col-span-2"
            v-if="taxesEditForm.subtotal != 'invoices'"
          >
            <el-input-number
              v-model="taxesEditForm.subtotal"
              :value="subTotal"
              type="number"
              :min="0.0"
              :step="0.01"
              size="small"
              autocomplete="off"
              :precision="2"
              style="width: 100%"
              :disabled="true"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item
            label="Iva retenido"
            prop="ivaRetenido"
            class="col-span-2"
            v-if="taxesEditForm.registerType != 'purchases'"
          >
            <el-input-number
              v-model="taxesEditForm.ivaRetenido"
              :value="taxesDetained"
              type="number"
              :min="0.0"
              :step="0.01"
              size="small"
              autocomplete="off"
              :precision="2"
              style="width: 100%"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="Total" class="col-span-2" prop="total">
            <el-input-number
              v-model="taxesEditForm.total"
              style="width: 100%"
              size="small"
              :minlength="0.01"
              :step="0.01"
              :disabled="true"
              :value="totals"
              :precision="2"
            >
            </el-input-number>
          </el-form-item>
        </div>
        <div class="flex flex-row justify-end">
          <el-button type="primary" size="small" native-type="submit"
            >Guardar
          </el-button>
          <el-button size="small" @click="$router.push('/taxes')"
            >Cancelar</el-button
          >
        </div>
      </el-form>
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import {
  amountValidate,
  checkBeforeEnter,
  checkBeforeLeave,
  fixDate,
  inputValidation,
  parseErrors,
  selectValidation,
} from "../../tools";

export default {
  name: "TaxesEdit",
  head: {
    titleTemplate: `%s | Editar registro`,
  },
  components: { LayoutContent },
  fetch() {
    const customers = () => this.$axios.get("/customers");
    const providers = () => {
      return this.$axios.get("/providers");
    };
    const invoiceDocumentTypes = () =>
      this.$axios.get("/invoices/document-types");
    const tax = () => {
      return this.$axios.get(`/taxes/${this.$route.query.ref}`);
    };
    Promise.all([customers(), providers(), tax(), invoiceDocumentTypes()]).then(
      (res) => {
        const [customers, providers, tax, invoiceDocTypes] = res;
        this.customers = customers.data.data;
        this.providers = providers.data.data;
        this.taxesEditForm = {
          ...this.taxesEditForm,
          ...tax.data.data,
          entity: tax.data.data.entity.id,
        };
        this.invoiceDocumentTypes = invoiceDocTypes.data.data;
        this.entity(this.taxesEditForm.registerType);
      }
    );
  },
  fetchOnServer: false,
  data() {
    return {
      taxesEditForm: {
        registerType: "",
        documentType: "",
        authorization: "",
        sequence: "",
        date: "",
        sum: "",
        iva: "",
        subtotal: "",
        ivaRetenido: 0,
        total: "",
        entity: "",
      },
      taxesEditFormRules: {
        registerType: selectValidation(true),
        documentType: selectValidation(true),
        authorization: inputValidation,
        sequence: inputValidation(true),
        date: selectValidation(true),
        sum: amountValidate(true),
        authorization: inputValidation(true),
        entity: selectValidation(true),
      },
      customers: [],
      providers: [],
      documentTypes: [],
      registerType: [
        {
          id: "purchases",
          name: "Crédito Fiscal",
        },
        {
          id: "invoices",
          name: "Débito Fiscal",
        },
      ],
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
      inactiveEntity: [],
      activeEntity: [],
      purchasesDocumentTypes: [
        {
          id: 1,
          name: "Nacional",
          code: "N",
        },
      ],
      invoiceDocumentTypes: [],
    };
  },
  methods: {
    entity(registerType) {
      if (registerType == "invoices") {
        this.activeEntity = this.customers.filter((c) => c.isActiveCustomer);
        this.inactiveEntity = this.customers.filter((c) => !c.isActiveCustomer);
        this.documentType = this.invoiceDocumentTypes;
      } else if (registerType == "purchases") {
        this.activeEntity = this.providers.filter((c) => c.isActiveProvider);
        this.inactiveEntity = this.providers.filter((c) => !c.isActiveProvider);
        this.documentTypes = this.purchasesDocumentTypes;
      }
    },
    submitEditTax(formName, taxData) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$confirm(
          "¿Estás seguro que deseas actualizar este registro?",
          "Confirmación",
          {
            confirmButtonText: "Si, actualizar",
            cancelButtonText: "Cancelar",
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "Procesando...";
                this.$axios
                  .put(`/taxes/${taxData.id}`, {
                    ...taxData,
                    documentType: taxData.documentType.id,
                    entity: taxData.entity.id,
                  })
                  .then((res) => {
                    this.$notify.success({
                      title: "Exito",
                      message: res.data.message,
                    });
                    this.$router.push("/taxes");
                  })
                  .catch((err) => {
                    this.$notify.error({
                      title: "Error",
                      dangerouslyUseHTMLString: true,
                      message: parseErrors(err.response.data.message),
                    });
                  })
                  .then((alw) => {
                    instance.confirmButtonLoading = false;
                    instance.confirmButtonText = "Si, actualizar";
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
  },

  computed: {
    taxes() {
      const taxes = this.taxesEditForm.sum * 0.13;
      this.taxesEditForm.iva = this.taxesEditForm.sum * 0.13;
      return taxes;
    },
    taxesDetained() {
      const taxesDetained =
        this.taxesEditForm.subtotal - this.taxesEditForm.ivaRetenido;
      return taxesDetained;
    },
    subTotal() {
      const subtotal = this.taxes + this.taxesEditForm.sum;
      this.taxesEditForm.subtotal = this.taxes + this.taxesEditForm.sum;
      return subtotal;
    },
    totals() {
      const totals = this.subTotal;
      const totalDetained = this.taxesDetained;
      this.taxesEditForm.total = this.subTotal;
      this.taxesEditForm.total = this.taxesDetained;
      return totals, totalDetained;
    },
  },
};
</script>

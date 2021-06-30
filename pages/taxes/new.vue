<template>
  <layout-content
    page-title="Nuevo registro"
    :breadcrumb="[
      { name: 'IVA', to: '/taxes' },
      { name: 'Nuevo registro', to: null },
    ]"
  >
    <div class="flex flex-col space-4">
      <el-form
        :model="taxesNewForm"
        :rules="taxesNewFormRules"
        ref="taxesNewForm"
        @submit.prevent.native="newTaxe('taxesNewForm', taxesNewForm)"
      >
        <div class="grid grid-cols-12 gap-4">
          <el-form-item
            label="Tipo de registro"
            class="col-span-3"
            prop="registerType"
          >
            <el-select
              v-model="taxesNewForm.registerType"
              class="w-full"
              clearable
              filterable
              size="small"
              @change="entity('taxesNewForm', taxesNewForm.registerType)"
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
              v-model="taxesNewForm.documentType"
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
          <!-- <el-form-item
            label="Cliente"
            class="col-span-5"
            prop="entity"
            v-if="taxesNewForm.registerType != 'purchases'"
          >
            <el-select
              class="w-full"
              clearable
              filterable
              size="small"
              v-model="taxesNewForm.entity"
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
          </el-form-item> -->
          <el-form-item
            :label="
              taxesNewForm.registerType == 'invoices' ? 'Cliente' : 'Proveedor'
            "
            class="col-span-5"
            prop="entity"
          >
            <el-select
              class="w-full"
              clearable
              filterable
              size="small"
              v-model="taxesNewForm.entity"
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
              v-model="taxesNewForm.date"
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
              v-model="taxesNewForm.authorization"
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
              v-model="taxesNewForm.sequence"
              size="small"
            ></el-input>
          </el-form-item>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <el-form-item label="Sumas" class="col-span-2" prop="sum">
            <el-input-number
              v-model="taxesNewForm.sum"
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
              v-model="taxesNewForm.iva"
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
            label="Fovial"
            class="col-span-2"
            prop="fovial"
            v-if="taxesNewForm.registerType != 'invoices'"
          >
            <el-input-number
              v-model="taxesNewForm.fovial"
              type="number"
              :value="taxesFovialContrans"
              :min="0.0"
              :step="0.01"
              size="small"
              autocomplete="off"
              :precision="2"
              style="width: 100%"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item
            label="Contrans"
            class="col-span-2"
            prop="contrans"
            v-if="taxesNewForm.registerType != 'invoices'"
          >
            <el-input-number
              v-model="taxesNewForm.contrans"
              type="number"
              :value="taxesFovialContrans"
              :min="0.0"
              :step="0.01"
              size="small"
              autocomplete="off"
              :precision="2"
              style="width: 100%"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item
            label="Subtotal"
            prop="subtotal"
            class="col-span-2"
            v-if="taxesNewForm.subtotal != 'invoices'"
          >
            <el-input-number
              v-model="taxesNewForm.subtotal"
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
            v-if="taxesNewForm.registerType != 'purchases'"
          >
            <el-input-number
              v-model="taxesNewForm.ivaRetenido"
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
          <el-form-item label="Total" class="col-span-2">
            <el-input-number
              v-model="taxesNewForm.total"
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
  hasModule,
  inputValidation,
  parseErrors,
  selectValidation,
} from "../../tools";
export default {
  name: "TaxesNew",
  head: {
    titleTemplate: `%s | Nuevo registro`,
  },
  components: { LayoutContent },
  fetch() {
    const customers = () => this.$axios.get("/customers");
    const providers = () => this.$axios.get("/providers");
    const invoiceDocumentTypes = () =>
      this.$axios.get("/invoices/document-types");
    //valida si el usuario posee el modulo de facturacion
    if (hasModule("cf5e4b29-f09c-438a-8d82-2ef482a9a461", this.$auth.user)) {
      this.registerType = this.registerType.slice(1);
    }
    //valida si el usuario posee el modulo de compras
    if (hasModule("cfb8addb-541b-482f-8fa1-dfe5db03fdf4", this.$auth.user)) {
      this.registerType = this.registerType.slice(0, -1);
    }
    Promise.all([customers(), providers(), invoiceDocumentTypes()]).then(
      (res) => {
        const [customers, providers, invoiceDocTypes] = res;
        this.customers = customers.data.data;
        this.providers = providers.data.data;
        this.taxesNewForm.registerType = this.registerType[0].id;
        this.invoiceDocumentTypes = invoiceDocTypes.data.data;
        this.entity("taxesNewForm", this.taxesNewForm.registerType);
      }
    );
  },
  fetchOnServer: false,
  data() {
    return {
      taxesNewForm: {
        registerType: "",
        documentType: "",
        authorization: "",
        sequence: "",
        date: "",
        sum: "",
        iva: "",
        fovial: "",
        contrans: "",
        subtotal: "",
        ivaRetenido: "",
        total: "",
        entity: "",
      },
      taxesNewFormRules: {
        registerType: selectValidation(true),
        documentType: selectValidation(true),
        authorization: inputValidation(true),
        sequence: inputValidation(true),
        date: selectValidation(true),
        sum: amountValidate(true),

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
    newTaxe(formName, dataTaxe) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$confirm(
          "¿Estás seguro que deseas guardar este nuevo registro?",
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
                  .post("/taxes", { ...dataTaxe })
                  .then((res) => {
                    this.$notify.success({
                      title: "Exito",
                      message: res.data.message,
                    });
                    setTimeout(() => {
                      this.$confirm(
                        "¿Deseas crear un nuevo registro?",
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
                          this.$refs[formName].resetFields();
                        })
                        .catch(() => {
                          this.$router.push("/taxes");
                        });
                    }, 500);
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
    entity(formName, registerType) {
      if (registerType == "invoices") {
        this.activeEntity = this.customers.filter((c) => c.isActiveCustomer);
        this.inactiveEntity = this.customers.filter((c) => !c.isActiveCustomer);
        this.documentTypes = this.invoiceDocumentTypes;
        this.$refs[formName].fields
          .find((f) => f.prop == "documentType")
          .resetField();
      } else if (registerType == "purchases") {
        this.activeEntity = this.providers.filter((c) => c.isActiveCustomer);
        this.inactiveEntity = this.providers.filter((c) => !c.isActiveCustomer);
        this.documentTypes = this.purchasesDocumentTypes;
        this.$refs[formName].fields
          .find((f) => f.prop == "documentType")
          .resetField();
      }
    },
  },

  computed: {
    taxes() {
      const taxes = this.taxesNewForm.sum * 0.13;
      this.taxesNewForm.iva = this.taxesNewForm.sum * 0.13;
      return taxes;
    },
    taxesDetained() {
      let taxesDetained = 0;
      if (this.taxesNewForm.registerType == "invoices") {
        taxesDetained =
          this.taxesNewForm.subtotal - this.taxesNewForm.ivaRetenido;
      }
      return taxesDetained;
    },
    taxesFovialContrans() {
      let fovialContrans = 0;
      if (this.taxesNewForm.registerType == "purchases") {
        fovialContrans = this.taxesNewForm.fovial + this.taxesNewForm.contrans;
      }
      return fovialContrans;
    },
    subTotal() {
      let subtotal = 0;
      if (this.taxesNewForm.registerType == "purchases") {
        subtotal =
          this.taxes + this.taxesFovialContrans + this.taxesNewForm.sum;
      } else {
        subtotal = this.taxes + this.taxesNewForm.sum;
      }

      this.taxesNewForm.subtotal = subtotal;
      return subtotal;
    },
    totals() {
      let totals = this.subTotal;
      const totalDetained = this.taxesDetained;
      this.taxesNewForm.total = this.subTotal;
      if (this.taxesNewForm.registerType == "invoices") {
        this.taxesNewForm.total = this.taxesDetained;
      }

      return totals, totalDetained;
    },
  },
};
</script>

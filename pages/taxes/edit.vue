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
        ref="taxesEditForm"
        @submit.prevent.native="newTaxe('taxesEditForm', taxesEditForm)"
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
          <el-form-item label="Tipo de documento" class="col-span-3">
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
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <el-form-item
            label="Cliente"
            class="col-span-5"
            v-if="taxesEditForm.typeRegister != 'credifical'"
          >
            <el-select
              class="w-full"
              clearable
              filterable
              size="small"
              v-model="taxesEditForm.customers"
            >
              <el-option label="Todos los clientes" value="" />
              <el-option-group key="ACTIVOS" label="ACTIVOS">
                <el-option
                  v-for="item in activeCustomers"
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
                  v-for="item in inactiveCustomers"
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
          <el-form-item label="Proveedores:" class="col-span-5" v-else>
            <el-select
              class="w-full"
              size="small"
              filterable
              clearable
              v-model="taxesEditForm.providers"
            >
              <el-option label="Todos los proveedores" value="" />
              <el-option-group key="ACTIVOS" label="ACTIVOS">
                <el-option
                  v-for="item in activeProviders"
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
                  v-for="item in inactiveProviders"
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
          >
            <el-date-picker
              v-model="taxesEditForm.date"
              size="small"
              class="w-full"
              type="date"
              placeholder="Selecciona un mes"
              :picker-options="pickerOptions"
              style="width: 100%"
              format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="N° de autorización" class="col-span-2">
            <el-input
              placeholder="000000"
              v-model="taxesEditForm.authorization"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="N° de correlativo" class="col-span-2">
            <el-input
              placeholder="000000"
              v-model="taxesEditForm.sequence"
              size="small"
            ></el-input>
          </el-form-item>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <el-form-item label="Sumas" class="col-span-2" prop="sumas">
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
            v-if="taxesEditForm.subTotal != 'consuFinal'"
          >
            <el-input-number
              v-model="taxesEditForm.subTotal"
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
            v-if="taxesEditForm.typeRegister != 'credifical'"
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
          <el-form-item label="Total" class="col-span-2">
            <el-input-number
              v-model="taxesEditForm.totals"
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
  checkBeforeEnter,
  checkBeforeLeave,
  inputValidation,
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
    const tax = () => {
      return this.$axios.get(`/taxes/${this.$route.query.ref}`);
    };
    Promise.all([customers(), providers(), tax()]).then((res) => {
      const [customers, providers, tax] = res;
      this.customers = customers.data.data;
      this.providers = providers.data.data;
      this.taxesEditForm = {
        ...tax.data.data,
        customer: tax.data.customer.id,
        iva: tax.data.iva,
        date: tax.data.invoiceDate
          ? tax.data.invoiceDate
          : tax.data.purchaseDate,
      };
    });
  },
  fetchOnServer: false,
  data() {
    return {
      taxesEditForm: {
        authorization: "",
        customer: "",
        provider: "",
        documentType: "",
        date: "",
        iva: "",
        subtotal: "",
        registerType: "",
        sequence: "",
        ventaTotal: "",
        compraTotal: "",
      },
      customers: [],
      providers: [],

      documentTypes: [
        {
          id: 1,
          name: "FCF - Consumidor Final",
        },
        {
          id: 2,
          name: "CFC - Crédito Fiscal",
        },
      ],
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
    };
  },
  methods: {},

  computed: {
    activeCustomers() {
      return this.customers.filter((c) => c.isActiveCustomer);
    },
    inactiveCustomers() {
      return this.customers.filter((c) => !c.isActiveCustomer);
    },
    activeProviders() {
      return this.providers.filter((c) => c.isActiveProvider);
    },
    inactiveProviders() {
      return this.providers.filter((c) => !c.isActiveProvider);
    },
    taxes() {
      const taxes = this.taxesEditForm.sum * 0.13;
      this.taxesEditForm.iva = this.taxesEditForm.sum * 0.13;
      return taxes;
    },
    taxesDetained() {
      const taxesDetained =
        this.taxesEditForm.subTotal - this.taxesEditForm.ivaRetenido;
      return taxesDetained;
    },
    subTotal() {
      const subtotal = this.taxes + this.taxesEditForm.sum;
      this.taxesEditForm.subTotal = this.taxes + this.taxesEditForm.sum;
      return subtotal;
    },
    totals() {
      const totals = this.subTotal;
      const totalDetained = this.taxesDetained;
      this.taxesEditForm.totals = this.subTotal;
      this.taxesEditForm.totals = this.taxesDetained;
      return totals, totalDetained;
    },
  },
};
</script>

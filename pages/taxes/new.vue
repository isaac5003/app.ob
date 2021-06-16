code 
<template>
  <layout-content
    page-title="Nuevo registro"
    :breadcrumb="[
      { name: 'IVA', to: '/taxes' },
      { name: 'Nuevo registro', to: null },
    ]"
  >
    <div class="flex flex-col space-y-2">
      <el-form label-position="top" :model="taxesNewForm" ref="taxesNewForm">
        <div class="grid grid-cols-12 gap-4">
          <el-form-item
            label="Tipo de registro"
            class="col-span-3"
            prop="typeRegister"
          >
            <el-select
              v-model="taxesNewForm.typeRegister"
              class="w-full"
              clearable
              filterable
              size="small"
            >
              <el-option label="Tipo de registro" value="" />
              <el-option
                v-for="item in filetype"
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
            prop="typeDocument1"
            v-if="taxesNewForm.typeRegister != 'credifical'"
          >
            <el-select
              v-model="taxesNewForm.typeDocument1"
              class="w-full"
              clearable
              filterable
              size="small"
              :disabled="taxesNewForm.typeRegister ? false : true"
            >
              <el-option label="Tipo de documento" value="" />
              <el-option
                v-for="item in filetype1"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Tipo de documento" class="col-span-3" v-else>
            <el-select
              v-model="taxesNewForm.typeDocument2"
              class="w-full"
              clearable
              filterable
              size="small"
            >
              <el-option
                v-for="item in filetype2"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            class="col-span-3 col-start-10"
            prop="dateRange"
            label="Fecha de ingreso del registro"
          >
            <el-date-picker
              type="month"
              format="MMMM yyyy"
              placeholder="Selecciona un mes"
              size="small"
              style="width: 100%"
            />
          </el-form-item>
        </div>
        <div class="class grid grid-cols-12 gap-4">
          <el-form-item
            label="Cliente"
            class="col-span-5"
            v-if="taxesNewForm.typeRegister != 'credifical'"
          >
            <el-select
              class="w-full"
              clearable
              filterable
              size="small"
              v-model="taxesNewForm.customers"
              :disabled="taxesNewForm.typeRegister ? false : true"
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
              v-model="taxesNewForm.providers"
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
              type="month"
              format="MMMM yyyy"
              placeholder="Selecciona un mes"
              size="small"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="N° de autorización" class="col-span-2">
            <el-input size="small" placeholder="000000" readonly> </el-input>
          </el-form-item>
          <el-form-item label="N° de correlativo" class="col-span-2">
            <el-input size="small" placeholder="000000" readonly> </el-input>
          </el-form-item>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <el-form-item label="Sumas" class="col-span-2" prop="sumas">
            <el-input-number
              v-model="taxesNewForm.sumas"
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
            label="Subtotal"
            prop="subtotal"
            class="col-span-2"
            v-if="taxesNewForm.subTotal != 'consuFinal'"
          >
            <el-input-number
              v-model="taxesNewForm.subTotal"
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
            prop="ivaDetained"
            class="col-span-2"
            v-if="taxesNewForm.typeRegister != 'credifical'"
          >
            <el-input-number
              v-model="taxesNewForm.ivaDetained"
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
            <el-input
              v-model="taxesNewForm.totals"
              style="width: 100%"
              size="small"
              :minlength="0.01"
              :disabled="true"
              :value="totals"
            >
            </el-input>
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
  name: "TaxesNew",
  head: {
    titleTemplate: `%s | Nuevo registro`,
  },
  components: { LayoutContent },
  fetch() {
    const customers = () => this.$axios.get("/customers");
    const providers = () => {
      return this.$axios.get("/providers");
    };
    Promise.all([customers(), providers()]).then((res) => {
      const [customers, providers] = res;
      this.customers = customers.data.data;
      this.providers = providers.data.data;
    });
  },
  fetchOnServer: false,
  data() {
    return {
      taxesNewForm: {
        typeRegister: "",
        typeDocument1: "",
        typeDocument2: "",
        sumas: "",
        iva: "",
        subTotal: "",
        ivaDetained: "",
        providers: "",
        totals: "",
      },
      customers: [],
      providers: [],

      filetype: [
        { name: "Débito Fiscal", id: "deviFilcal" },
        { name: "Credito fiscal", id: "credifical" },
      ],
      filetype1: [
        { name: "Credito fiscal", id: "crediFilcal" },
        { name: "Consumidor final", id: "consuiFinal" },
        { name: "Nota de debito", id: "notadevi" },
        { name: "Factura de exportación", id: "factExport" },
      ],
      filetype2: [
        { name: "Credito fiscal", id: "crediFilcal1" },
        { name: "Consumidor final", id: "consuFinal" },
        { name: "Otros", id: "others" },
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
      const taxes = this.taxesNewForm.sumas * 0.13;
      this.taxesNewForm.iva = this.taxesNewForm.sumas * 0.13;
      return taxes;
    },
    taxesDetained() {
      const taxesDetained =
        this.taxesNewForm.subTotal - this.taxesNewForm.ivaDetained;
      return taxesDetained;
    },
    subTotal() {
      const subtotal = this.taxes + this.taxesNewForm.sumas;
      this.taxesNewForm.subTotal = this.taxes + this.taxesNewForm.sumas;
      return subtotal;
    },
    totals() {
      const totals = this.subTotal;
      const totalDetained = this.taxesDetained;
      this.taxesNewForm.totals = this.subTotal;
      this.taxesNewForm.totals = this.taxesDetained;
      return totals, totalDetained;
    },
  },
};
</script>

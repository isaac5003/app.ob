<template>
  <layout-content
    v-loading="loading"
    page-title="Nuevo Cobro electrónico"
    :breadcrumb="[
      { name: 'Cobros electronicos', to: '/echarges' },
      { name: 'Nuevo cobro', to: null },
    ]"
  >
    <el-form :model="eChargesNewForm" :rules="eChargesNewFormRules" status-icon>
      <!-- firstRow -->
      <div class="grid grid-cols-12 gap-4">
        <!-- cliente -->
        <!-- <el-form-item class="col-span-3" label="Cliente" prop="customer">
          <el-select
            v-model="eChargesNewForm.customer"
            class="w-full"
            size="small"
            clearable
            placeholder="Seleccionar"
          >
            <el-option
              v-for="c in customers"
              :key="c.is"
              :label="c.name"
              :value="c.id"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item class="col-span-3" label="Ventas" prop="invoices">
          <el-select
            v-model="eChargesNewForm.invoices"
            class="w-full"
            size="small"
            clearable
            placeholder="Seleccionar"
          >
            <el-option
              v-for="c in invoices"
              :key="c.id"
              :label="`${c.authorization} - ${c.sequence}`"
              :value="c.id"
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
                <span>{{ c.authorization }} - {{ c.sequence }}</span>
                <span class="text-xs text-gray-500">{{ c.status.name }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- correo -->
        <div class="col-span-3">
          <el-form-item class="col-span-12" label="Introduzca el correo:">
            <el-input
              v-model="eChargesNewForm.email"
              size="small"
              class="w-full"
              type="email"
              placeholder="example@openbox.cloud"
            ></el-input>
          </el-form-item>
        </div>
        <div class="col-span-2 col-start-7">
          <el-form-item label="N° de autorización">
            <el-input size="small" placeholder="" :disabled="true" readonly>
            </el-input>
          </el-form-item>
        </div>
        <!-- n° Correlativo -->
        <div class="col-span-2">
          <el-form-item label="N° de correlativo">
            <el-input
              size="small"
              placeholder=""
              v-model="eChargesNewForm.sequence"
              :disabled="true"
              readonly
            >
            </el-input>
          </el-form-item>
        </div>
        <!-- total -->
        <div class="col-span-2">
          <el-form-item label="Total" prop="total">
            <el-input-number
              type="number"
              :min="0"
              :step="0.01"
              v-model="eChargesNewForm.total"
              size="small"
              autocomplete="off"
              :precision="2"
              style="width: 100%"
              :disabled="true"
            >
            </el-input-number>
          </el-form-item>
        </div>
      </div>
      <!-- secondRow -->
      <div class="grid grid-cols-12">
        <!--Descripcion -->
        <div class="col-span-12">
          <el-form-item label="Descripción" prop="description">
            <el-input
              type="textarea"
              :rows="5"
              size="small"
              v-model="eChargesNewForm.description"
              maxlength="500"
              minlength="5"
              show-word-limit
              :disabled="true"
            >
            </el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <!-- boton guardar cancelar -->
    <div class="flex justify-end">
      <el-button type="primary" size="small" native-type="submit"
        >Guardar</el-button
      >
      <el-button size="small" @click="$router.push('/echarges')"
        >Cancelar</el-button
      >
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import { inputValidation, selectValidation, hasModule } from "../../tools";
import Notification from "../../components/Notification";

export default {
  name: "echargesNew",
  components: { LayoutContent, Notification },
  fetch() {
    const customers = () => {
      return this.$axios.get("/customers", {
        params: { active: true },
      });
    };

    const invoices = () => this.$axios.get("/invoices");

    Promise.all([customers(), invoices()])
      .then((res) => {
        const [customers, invoices] = res;
        this.customers = customers.data.customers;
        this.rawInvoices = invoices.data.data;
        this.loading = false;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message;
        console.log(this.errorMessage);
      });
  },
  fetchOnServer: false,
  data() {
    return {
      loading: false,
      eChargesNewForm: {
        customer: "",
        invoices: "",
        sequence: "",
        description: "",
        total: "",
        email: "",
      },
      customers: [],
      rawInvoices: [],
      eChargesNewFormRules: {
        customer: selectValidation(true),
        description: inputValidation(true, 5, 500),
        total: inputValidation(true),
        email: inputValidation(false, null, null, "email"),
      },
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
    };
  },
  methods: {
    hasModule(module) {
      return hasModule(module, this.$auth.user);
    },
  },
  computed: {
    invoices() {
      return this.rawInvoices.filter(
        (i) => i.status.d == 1 || i.status.id == 2
      );
    },
  },
};
</script>

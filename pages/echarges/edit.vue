<template>
  <layout-content
    v-loading="loading"
    page-title="Editar cobro electrónico"
    :breadcrumb="[
      { name: 'Cobros electronicos', to: '/echarges' },
      { name: 'Editar cobro', to: null },
    ]"
  >
    <el-form
      :model="eChargesEditForm"
      :rules="eChargesEditFormRules"
      status-icon
    >
      <!-- firstRow -->
      <div class="grid grid-cols-12 gap-4">
        <!-- invoice -->
        <el-form-item
          class="col-span-3"
          label="Ventas"
          prop="invoices"
          v-if="hasModule('cfb8addb-541b-482f-8fa1-dfe5db03fdf4')"
        >
          <el-select
            v-model="eChargesEditForm.invoice"
            class="w-full"
            size="small"
            clearable
            placeholder="Seleccionar"
            @change="getInvoiceDetails(eChargesEditForm.invoice)"
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
        <!-- cliente -->
        <el-form-item class="col-span-3" label="Cliente" prop="customer" v-else>
          <el-select
            v-model="eChargesEditForm.customer"
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
        </el-form-item>
        <!-- correo -->
        <div class="col-span-3">
          <el-form-item
            class="col-span-12"
            label="Introduzca el correo:"
            prop="email"
          >
            <el-input
              v-model="eChargesEditForm.email"
              size="small"
              class="w-full"
              type="email"
              placeholder="example@openbox.cloud"
              clearable
            ></el-input>
          </el-form-item>
        </div>
        <!-- authorization -->
        <div class="col-span-2 col-start-7">
          <el-form-item label="N° de autorización">
            <el-input
              v-model="eChargesEditForm.authorization"
              size="small"
              placeholder=""
              :readonly="hasModule('cfb8addb-541b-482f-8fa1-dfe5db03fdf4')"
            >
            </el-input>
          </el-form-item>
        </div>
        <!-- n° Correlativo -->
        <div class="col-span-2">
          <el-form-item label="N° de correlativo" prop="sequence">
            <el-input
              size="small"
              placeholder=""
              v-model="eChargesEditForm.sequence"
              :readonly="hasModule('cfb8addb-541b-482f-8fa1-dfe5db03fdf4')"
            >
            </el-input>
          </el-form-item>
        </div>
        <!-- total -->
        <div class="col-span-2">
          <el-form-item label="Total" prop="total">
            <!-- invoice -->
            <el-input
              v-model="eChargesEditForm.total"
              size="small"
              style="width: 100%"
              readonly
              v-if="hasModule('cfb8addb-541b-482f-8fa1-dfe5db03fdf4')"
            />
            <el-input-number
              v-else
              type="number"
              :min="0"
              :step="0.01"
              v-model="eChargesEditForm.total"
              size="small"
              autocomplete="off"
              :precision="2"
              style="width: 100%"
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
              v-model="eChargesEditForm.description"
              maxlength="500"
              minlength="5"
              show-word-limit
              :readonly="hasModule('cfb8addb-541b-482f-8fa1-dfe5db03fdf4')"
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
      eChargesEditForm: {
        customer: "",
        invoice: "",
        sequence: "",
        description: "",
        total: "",
        email: "",
      },
      customers: [],
      rawInvoices: [],
      eChargesEditFormRules: {
        customer: selectValidation(true),
        sequence: selectValidation(true),
        description: inputValidation(true, 5, 500),
        total: inputValidation(true),
        email: inputValidation(true, null, null, "email"),
      },
    };
  },
  methods: {
    hasModule(module) {
      return hasModule(module, this.$auth.user);
    },
    getInvoiceDetails(id) {
      this.$axios
        .get(`/invoices/${id}`)
        .then(({ data }) => {
          console.log(data);
          let description = "";
          for (const d of data.data.details) {
            description += `(${d.quantity}) - ${d.chargeDescription}\n`;
          }
          this.eChargesEditForm.authorization = data.data.authorization;
          this.eChargesEditForm.sequence = data.data.sequence;
          this.eChargesEditForm.total = parseFloat(
            data.data.ventaTotal
          ).toFixed(2);
          this.eChargesEditForm.description = description;
        })
        .catch();
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

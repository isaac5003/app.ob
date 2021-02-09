<template>
  <layout-content
    v-loading="loading"
    page-title="Nuevo Cobro"
    :breadcrumb="[
      { name: 'Cobros electrónicos', to: '/echarges' },

      { name: 'Nuevo cobro electrónico', to: null },
    ]"
  >
    <el-form :model="eChargesNewForm" :rules="eChargesNewFormRules" status-icon>
      <!-- firstRow -->
      <div class="flex flex-col space-y-4">
        <div class="grid grid-cols-12-gap-4">
          <div class="col-span-3">
            <el-form-item label="Serie">
              <el-input
                v-model="eChargesNewForm.serie"
                disabled
                class="w-full"
                size="small"
              />
            </el-form-item>
          </div>
          <div class="col-span-3 col-start-9">
            <el-form-item label="Fecha de venta" prop="date">
              <el-date-picker
                v-model="eChargesNewForm.date"
                size="small"
                class="w-full"
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
      </div>
      <!-- secondRow -->
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-5">
          <el-form-item label="Cliente" prop="customer">
            <el-select
              v-model="eChargesNewForm.customer"
              size="small"
              class="w-full"
              clearable
              filterable
              default-first-option
              placeholder="Seleccionar"
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
      </div>
      <!-- thirdRow -->
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
            >
            </el-input>
          </el-form-item>
        </div>
      </div>
      <!-- total -->
      <div class="grid grid cols-12-gap-4">
        <div class="col-span-6">
          <el-form-item label="Total" prop="total">
            <el-input-number
              type="number"
              :min="0"
              :step="0.01"
              v-model="eChargesNewForm.total"
              size="small"
              autocomplete="off"
              :precision="2"
              style="width:100%"
            >
            </el-input-number>
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
import { inputValidation, selectValidation } from "../../tools";
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
    Promise.all([customers()])
      .then((res) => {
        const [customers] = res;

        this.customers = customers.data.customers;

        this.loading = false;
      })
      .catch((err) => {
        console.log(err);
        this.errorMessage = err.response.data.message;
      });
  },
  fetchOnServer: false,
  data() {
    return {
      loading: false,
      eChargesNewForm: {
        customer: "",
        date: "",
        ser: "",
        description: "",
        total: "",
      },
      customers: null,
      eChargesNewFormRules: {
        customer: selectValidation(true),
        date: selectValidation(true),
        description: inputValidation(true, 5, 500),
        total: inputValidation(true),
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
};
</script>

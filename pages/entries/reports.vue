<template>
  <layout-content
    v-loading="loading"
    page-title="Reportes"
    :breadcrumb="[
      { name: 'Contabilidad', to: '/entries' },
      { name: 'Reportes', to: null },
    ]"
  >
    <div class="flex justify-center" v-if="errorMessage">
      <Notification
        class="w-1/2"
        type="danger"
        title="Error de comunicación"
        :message="errorMessage"
        :action="{
          title: 'Intentar nuevamente',
          function: () => $router.go(),
        }"
      />
    </div>

    <el-form :model="reportForm" :rules="reportFormRules" status-icon>
      <!-- first row -->
      <div class="grid grid-cols-12 gap-4">
        <!-- Tipos de reporte -->
        <div class="col-span-3">
          <el-form-item label="Seleccione el reporte" prop="reportType">
            <el-select
              v-model="reportForm.reportType"
              placeholder="Seleccione reporte"
              size="small"
              class="w-full"
              default-first-option
              filterable
              clearable
              @change="showRequirements(reportForm.reportType)"
            >
              <el-option
                v-for="report in reports"
                :key="report.id"
                :label="report.name"
                :value="report.id"
              />
              <el-option-group label="AUXILIARES">
                <el-option
                  v-for="report in auxiliarReports"
                  :key="report.id"
                  :label="report.name"
                  :value="report.id"
                ></el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
        </div>
      </div>

      <!-- seleccionar fecha -->
      <div class="grid grid-cols-12 gap-4" v-if="requirementForm == 'compact'">
        <div class="col-span-4">
          <el-form-item prop="dateRange" label="Seleccione la fecha">
            <el-date-picker
              v-model="reportForm.dateRange"
              type="month"
              format="MMMM yyyy"
              placeholder="Selecciona un mes"
              size="small"
            />
          </el-form-item>
        </div>
      </div>
      <!-- seleccion date range y cuentas -->
      <div class="grid grid-cols-12 gap-4" v-if="requirementForm == 'extended'">
        <div class="col-span-4">
          <el-form-item label="Rango de fechas:">
            <el-date-picker
              size="small"
              v-model="reportForm.dateRange"
              type="daterange"
              unlink-panels
              range-separator="-"
              start-placeholder="Fecha inicio"
              end-placeholder="Fecha final"
              :editable="false"
              format="dd/MM/yyyy"
              style="width: 100%"
            />
          </el-form-item>
        </div>
        <div class="col-span-4">
          <el-form-item label="Cuentas:">
            <el-select
              v-model="reportForm.catalogs"
              placeholder="Seleccionar cuentas"
              size="small"
              clearable
              filterable
              multiple
              default-first-option
            >
              <el-option
                v-for="catalog in accountingCatalog"
                :key="catalog.id"
                :label="catalog.code"
                :value="catalog.id"
              >
                <div class="flex flex-row justify-between">
                  <span class="mr-5 text-sm">{{ catalog.name }}</span>
                  <span class="text-gray-600">{{ catalog.code }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>

      <!-- Guardar y Cancelar -->
      <div class="grid grid-cols-12 gap-4">
        <div class="col-start-9 col-span-2">
          <el-button
            :disabled="reportForm.reportType == null"
            type="primary"
            class="w-full"
            size="small"
            icon="el-icon-download"
            >Descargar</el-button
          >
        </div>
        <div class="col-start-11 col-span-2">
          <el-button class="w-full" size="small">Cancelar</el-button>
        </div>
      </div>
    </el-form>
  </layout-content>
</template>
<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
import { selectValidation } from "../../tools";
export default {
  name: "EntriesReports",
  components: {
    LayoutContent,
    Notification,
  },
  // fetch() {
  //   const invoices = () => {
  //     return this.$axios.get("/invoices", { params: this.page });
  //   };

  //   Promise.all([invoices()])
  //     .then((res) => {
  //       const [invoices] = res;
  //       this.invoices = invoices.data;
  //       this.loading = false;
  //     })
  //     .catch((err) => {
  //       this.errorMessage = err.response.data.message;
  //     });
  // },
  // fetchOnServer: false,
  data() {
    return {
      loading: false,
      errorMessage: "",
      reportForm: {
        reportType: "",
        catalogo: "",
        dateRange: new Date(),
      },
      reportFormRules: {
        reportType: selectValidation("change", true),
        dateRange: selectValidation("change", true),
      },
      catalog: [],
      reports: [
        { name: "Balance general", id: "balanceGeneral" },

        { name: "Balance de comprobación", id: "balanceComprobacion" },
      ],
      auxiliarReports: [
        { name: "Libro diario mayor", id: "diarioMayor" },
        { name: "Libro de auxiliares", id: "libroAuxiliares" },
        { name: "Catalógo de cuentas", id: "catalogoCuentas" },
        //{ name: "Detalle de cuentas", id: "detalleCuentas" },
        { name: "Detalle de movimiento cuentas", id: "movimientoCuentas" },
      ],
      requirementForm: null,
      accountingCatalog: [],
    };
  },

  methods: {
    showRequirements(id) {
      if (!id) {
        this.requirementForm = null;
      } else {
        switch (id) {
          case "balanceGeneral":
          case "estadoResultados":
          case "balanceComprobacion":
          case "diarioMayor":
          case "libroAuxiliares":
            this.requirementForm = "compact";
            break;
          case "detalleCuentas":
          case "movimientoCuentas":
            this.requirementForm = "extended";
            this.getCalogs();
            break;
          default:
            this.requirementForm = "none";
            break;
        }
      }
    },
    async getCalogs() {
      const { data } = await this.$axios.get("/entries/catalog");
      this.accountingCatalog = data.accountingCatalog;
    },
  },
};
</script>
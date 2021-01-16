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

    <el-form
      :model="reportForm"
      :rules="reportFormRules"
      ref="reportForm"
      @submit.native.prevent="
        generateReport('reportForm', reportForm, auxiliarReports)
      "
      status-icon
    >
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
              value-format="yyyy-MM-dd"
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
            :disabled="reportForm.reportType ? false : true"
            type="primary"
            class="w-full"
            size="small"
            icon="el-icon-download"
            native-type="submit"
            :loading="generating"
            >Descargar</el-button
          >
        </div>
        <div class="col-start-11 col-span-2">
          <el-button class="w-full" size="small" @click="cancel()"
            >Cancelar</el-button
          >
        </div>
      </div>
    </el-form>
  </layout-content>
</template>
<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { selectValidation } from "../../tools";
import { getHeader, getFooter } from "../../tools/utils";
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
      generating: false,
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
          case "catalogoCuentas":
            break;
          case "movimientoCuentas":
            this.requirementForm = "extended";
            break;
          default:
            this.requirementForm = "none";
            break;
        }
      }
    },
    generateReport(formName, { dateRange, reportType, catalogs }, catalogList) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        }

        this.generating = true;
        switch (reportType) {
          case "balanceGeneral":
            this.generateBalanceGeneral(dateRange);
            break;
          case "estadoResultados":
            this.generateEstadoResultados(dateRange);
            break;
          case "balanceComprobacion":
            this.generateBalanceComprobacion(dateRange);
            break;
          case "diarioMayor":
            this.getDiarioMayor(dateRange);
            break;
          case "libroAuxiliares":
            this.generateLibroAuxiliares(dateRange);
            break;
          case "catalogoCuentas":
            this.getAccountingCatalog(dateRange);
            break;
          case "detalleCuentas":
            this.generateDetalleCuentas(dateRange, catalogs, catalogList);
            break;
          case "movimientoCuentas":
            this.generateMovimientoCuentas(dateRange, catalogs, catalogList);
            break;
        }
      });
    },
    getAccountingCatalog() {
      const catalog = () => this.$axios.get("/entries/catalog");
      const bussinesInfo = () => this.$axios.get("/business/info");
      Promise.all([catalog(), bussinesInfo()]).then((res) => {
        const [catalog, bussinesInfo] = res;
        const catalogReport = catalog.data.accountingCatalog;
        const { name, nit, nrc } = bussinesInfo.data.info;
        const values = catalogReport.map((c) => {
          return [
            { bold: c.level === 1, text: c.code },
            { bold: c.level === 1, text: c.name },
            {
              bold: c.level === 1,
              text: c.isParent ? "N" : "S",
              alignment: "center",
            },
          ];
        });

        const docDefinition = {
          pageSize: "LETTER",
          pageOrientation: "portrait",
          pageMargins: [20, 60, 20, 40],
          header: getHeader(name, nit, nrc, null, "CATALOGO DE CUENTAS"),
          footer: getFooter(),
          content: [
            {
              fontSize: 9,
              layout: "noBorders",
              table: {
                headerRows: 1,
                widths: ["20%", "70%", "10%"],
                heights: -5,
                body: [
                  [
                    {
                      text: "CUENTA",
                      style: "tableHeader",
                    },
                    {
                      text: "DESCRIPCIÓN LA CUENTA",
                      style: "tableHeader",
                    },
                    {
                      alignment: "center",
                      text: "ASIGNABLE",
                      style: "tableHeader",
                    },
                  ],
                  ...values,
                ],
              },
            },
          ],
          styles: {
            tableHeader: {
              bold: true,
              fontSize: 9,
            },
          },
        };
        this.generating = false;
        pdfMake.createPdf(docDefinition).open();
      });
    },
    getDiarioMayor(dateRange) {
      console.log(dateRange);
      const bussinesInfo = () => this.$axios.get("/business/info");
      const libroMayor = () => {
        return this.$axios.get("/entries/report/diario-mayor", {
          params: {
            date: dateRange,
          },
        });
      };
      Promise.all([bussinesInfo(), libroMayor()]).then((res) => {
        const [bussinesInfo, libroMayor] = res;
        const { name, nit, nrc } = bussinesInfo.data.info;
        const lib = libroMayor.data.accounts;
        const values = [];
        const emptyRow = [{}, {}, {}, {}, {}, {}];

        for (const i of lib) {
          values.push(emptyRow);
          values.push([
            {
              bold: true,
              text: i.code,
            },
            {
              bold: true,
              text: i.name,
            },
            {
              bold: true,
              text: "Saldo inicial",
              alignment: "center",
            },
            {},
            {},
            {
              bold: true,
              text: this.$options.filters.formatMoney(i.initialBalance),
              alignment: "right",
            },
          ]);

          for (const j of i.movements) {
            // values.push(emptyRow);
            values.push([
              {},
              {
                text: "MOVIMIENTOS DEL DIA",
              },
              {
                text: j.date,
                alignment: "center",
              },
              {
                text: this.$options.filters.formatMoney(j.cargo),
                alignment: "right",
              },
              {
                text: this.$options.filters.formatMoney(j.abono),
                alignment: "right",
              },
              {
                text: this.$options.filters.formatMoney(j.balance),
                alignment: "right",
              },
            ]);
          }

          values.push([
            {},
            {},
            {
              bold: true,
              text: "Saldo actual",
              alignment: "center",
            },
            {
              bold: true,
              text: this.$options.filters.formatMoney(i.totalCargo),
              alignment: "right",
            },
            {
              bold: true,
              text: this.$options.filters.formatMoney(i.totalAbono),
              alignment: "right",
            },
            {
              bold: true,
              text: this.$options.filters.formatMoney(i.currentBalance),
              alignment: "right",
            },
          ]);
        }
        console.log(this.$dateFns.lastDayOfMonth(new Date(dateRange)));
        const docDefinition = {
          pageSize: "LETTER",
          pageOrientation: "portrait",
          pageMargins: [15, 60, 15, 40],
          header: getHeader(
            name,
            nit,
            nrc,
            this.$dateFns.lastDayOfMonth(new Date(dateRange)),
            "LIBRO DIARIO MAYOR",
            "month"
          ),
          footer: getFooter(),
          content: [
            {
              fontSize: 9,
              layout: "noBorders",
              table: {
                headerRows: 2,
                widths: ["12%", "auto", "10%", "9%", "9%", "10%"],
                heights: -5,
                body: [
                  [
                    {
                      text: "CÓD. DE LA CUENTA",
                      style: "tableHeader",
                      rowSpan: 2,
                    },
                    {
                      text: "NOMBRE DE LA CUENTA",
                      style: "tableHeader",
                      rowSpan: 2,
                    },
                    {
                      alignment: "center",
                      text: "FECHA DE\nPARTIDA",
                      style: "tableHeader",
                      rowSpan: 2,
                    },
                    {
                      alignment: "center",
                      text: "MES ACTUAL",
                      style: "tableHeader",
                      colSpan: 2,
                    },
                    {},
                    {
                      alignment: "center",
                      text: "SALDO DEL\nPERÍODO",
                      style: "tableHeader",
                      rowSpan: 2,
                    },
                  ],
                  [
                    {},
                    {},
                    {},
                    {
                      alignment: "center",
                      text: "CARGOS",
                      style: "tableHeader",
                    },
                    {
                      alignment: "center",
                      text: "ABONOS",
                      style: "tableHeader",
                    },
                    {},
                  ],
                  ...values,
                ],
              },
            },
          ],
          styles: {
            tableHeader: {
              bold: true,
              fontSize: 9,
            },
          },
        };
        this.generating = false;
        pdfMake.createPdf(docDefinition).open();
      });
    },
    cancel() {
      this.$confirm("¿Estás seguro que deseas salir?", "Confirmación", {
        confirmButtonText: "Si, salir",
        cancelButtonText: "Cancelar",
        type: "warning",
      }).then(() => {
        this.$router.push("/entries");
      });
    },
  },
};
</script>
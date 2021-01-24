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
        generateReport('reportForm', reportForm, catalogos)
      "
      status-icon
    >
      <!-- first row -->
      <div class="grid grid-cols-12 gap-4">
        <!-- Tipos de reporte -->
        <div class="col-span-4">
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

        <div class="col-span-5">
          <el-form-item prop="" label="Formato de reporte">
            <el-radio-group
              v-model="reportForm.radio"
              :disabled="reportForm.reportType ? false : true"
              class="w-full"
            >
              <el-radio border size="small" label="pdf">PDF</el-radio>
              <el-radio border size="small" label="excel">Excel</el-radio>
            </el-radio-group>
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
              value-format="yyyy-MM-dd"
              style="width: 100%"
            />
          </el-form-item>
        </div>
        <div class="col-span-4">
          <el-form-item label="Cuentas:">
            <el-select
              v-model="catalogos"
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
                :disabled="catalog.isParent == true"
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
import XLSX from "xlsx";
import { selectValidation, getHeader, getFooter } from "../../tools";
export default {
  name: "EntriesReports",
  components: {
    LayoutContent,
    Notification,
  },
  // fetch() {
  //   const catalog = () => {
  //     return this.$axios.get("/entries/catalog" );
  //   };

  //   Promise.all([catalog()])
  //     .then((res) => {
  //       const [catalog] = res;
  //       this.catalog = catalog.data.catalog;
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
        dateRange: new Date(),
        radio: "pdf",
      },
      reportFormRules: {
        reportType: selectValidation("change", true),
        dateRange: selectValidation("change", true),
      },
      catalogos: [],
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
    generateReport(formName, { dateRange, reportType, radio }, catalogos) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        }

        this.generating = true;
        switch (reportType) {
          case "balanceGeneral":
            this.balanceGeneral(dateRange, radio);
            break;
          case "estadoResultados":
            this.generateEstadoResultados(dateRange);
            break;
          case "balanceComprobacion":
            this.generateBalanceComprobacion(dateRange, radio);
            break;
          case "diarioMayor":
            this.getDiarioMayor(dateRange, radio);
            break;
          case "libroAuxiliares":
            this.getAuxiliares(dateRange, radio);
            break;
          case "catalogoCuentas":
            this.getAccountingCatalog(radio);
            break;
            // case "detalleCuentas":
            // this.generateDetalleCuentas(dateRange, catalogList);
            break;
          case "movimientoCuentas":
            this.generateDetalleCuentas(dateRange, catalogos, radio);
            break;
        }
      });
    },
    generateBalanceComprobacion(dateRange, fileType) {
      const bussinesInfo = () => this.$axios.get("/business/info");
      const balanceComprobacion = () =>
        this.$axios.get("/entries/report/balance-comprobacion", {
          params: { date: dateRange },
        });

      switch (fileType) {
        case "pdf":
          Promise.all([bussinesInfo(), balanceComprobacion()]).then((res) => {
            const [bussinesInfo, balanceComprobacion] = res;
            const { name, nit, nrc } = bussinesInfo.data.info;
            const comprobationBalance =
              balanceComprobacion.data.balanceComprobacion;

            const values = [];
            const emptyRow = [{}, {}, {}, {}, {}, {}, {}];
            const mayores = comprobationBalance.filter(
              (d) => d.code.length == 1
            );

            for (const m of mayores) {
              values.push(emptyRow);
              const mresults = comprobationBalance.filter((d) =>
                d.code.startsWith(m.code)
              );
              for (const i of mresults) {
                values.push([
                  {
                    bold: i.code.length == 1,
                    text: i.code,
                  },
                  {
                    bold: i.code.length == 1,
                    text: i.name,
                  },

                  {
                    bold: i.code.length == 1,
                    text:
                      i.code.length == 1
                        ? ""
                        : this.$options.filters.formatMoney(i.initialBalance),
                    alignment: "right",
                  },
                  {
                    bold: i.code.length == 1,
                    text:
                      i.code.length == 1
                        ? ""
                        : this.$options.filters.formatMoney(i.cargo),
                    alignment: "right",
                  },
                  {
                    bold: i.code.length == 1,
                    text:
                      i.code.length == 1
                        ? ""
                        : this.$options.filters.formatMoney(i.abono),
                    alignment: "right",
                  },
                  {
                    bold: i.code.length == 1,
                    text:
                      i.code.length == 1
                        ? ""
                        : this.$options.filters.formatMoney(i.currentBalance),
                    alignment: "right",
                  },
                  {
                    bold: i.code.length == 1,
                    text:
                      i.code.length == 1
                        ? ""
                        : this.$options.filters.formatMoney(i.actualBalance),
                    alignment: "right",
                  },
                ]);
              }
              values.push([
                {
                  bold: true,
                  text: `*** TOTAL ${m.code} ${m.name} ***`,
                  colSpan: 2,
                },
                {},
                {
                  bold: true,
                  text: this.$options.filters.formatMoney(m.initialBalance),
                  alignment: "right",
                },
                {
                  bold: true,
                  text: this.$options.filters.formatMoney(m.cargo),
                  alignment: "right",
                },
                {
                  bold: true,
                  text: this.$options.filters.formatMoney(m.abono),
                  alignment: "right",
                },
                {
                  bold: true,
                  text: this.$options.filters.formatMoney(m.currentBalance),
                  alignment: "right",
                },
                {
                  bold: true,
                  text: this.$options.filters.formatMoney(m.actualBalance),
                  alignment: "right",
                },
              ]);
            }
            const docDefinition = {
              pageSize: "LETTER",
              pageOrientation: "portrait",
              pageMargins: [15, 60, 15, 40],
              header: getHeader(
                name,
                nit,
                nrc,
                this.$dateFns.lastDayOfMonth(new Date(dateRange)),
                "BALANCE DE COMPROBACIÓN"
              ),
              footer: getFooter(),
              content: [
                {
                  fontSize: 9,
                  layout: "noBorders",
                  table: {
                    headerRows: 2,
                    widths: ["12%", "auto", "10%", "9%", "9%", "9%", "10%"],
                    heights: -5,
                    body: [
                      [
                        {
                          text: "CÓDIGO\nDE LA CUENTA",
                          style: "tableHeader",
                          rowSpan: 2,
                        },
                        {
                          text: "NOMBRE\nDE LA CUENTA",
                          style: "tableHeader",
                          rowSpan: 2,
                        },
                        {
                          alignment: "center",
                          text: "BALANCE\nINICIAL",
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
                        {
                          alignment: "center",
                          text: "SALDO\nACTUAL",
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
          break;
        case "excel":
          Promise.all([bussinesInfo(), balanceComprobacion()]).then((res) => {
            const [bussinesInfo, balanceComprobacion] = res;
            const { name, nit, nrc } = bussinesInfo.data.info;
            const comprobationBalance =
              balanceComprobacion.data.balanceComprobacion;

            const data = [];

            const mayores = comprobationBalance.filter(
              (d) => d.code.length == 1
            );

            for (const m of mayores) {
              const mresults = comprobationBalance.filter((d) =>
                d.code.startsWith(m.code)
              );
              for (const i of mresults) {
                data.push([
                  i.code,

                  i.name,

                  i.code.length == 1
                    ? ""
                    : this.$options.filters.formatMoney(i.initialBalance),

                  i.code.length == 1
                    ? ""
                    : this.$options.filters.formatMoney(i.cargo),

                  i.code.length == 1
                    ? ""
                    : this.$options.filters.formatMoney(i.abono),

                  i.code.length == 1
                    ? ""
                    : this.$options.filters.formatMoney(i.currentBalance),

                  i.code.length == 1
                    ? ""
                    : this.$options.filters.formatMoney(i.actualBalance),
                ]);
              }
              data.push([
                `*** TOTAL ${m.code} ${m.name} ***`,

                "",

                this.$options.filters.formatMoney(m.initialBalance),

                this.$options.filters.formatMoney(m.cargo),

                this.$options.filters.formatMoney(m.abono),

                this.$options.filters.formatMoney(m.currentBalance),
                this.$options.filters.formatMoney(m.actualBalance),
              ]);
            }
            const document = [
              [name],
              [
                `BALANCE DE COMPROBACIÓN AL ${this.$dateFns.format(
                  new Date(dateRange),
                  "dd/MM/yyyy"
                )}`,
                "",
                "",
                "",
                `NIT: ${nit}`,
                `NRC: ${nrc}`,
              ],
              [""],
              [
                "CÓD. DE LA CUENTA",
                "NOMBRE DE LA CUENTA",
                "BALANCE INICIAL",
                "MES ACTUAL",
                "",
                "SALDO DEL",
                "SALDO ACTUAL",
              ],
              ["", "", "", "CARGOS", "ABONO", "PERIODO"],
              [""],
              ...data,
            ];

            const sheet = XLSX.utils.aoa_to_sheet(document);
            const workbook = XLSX.utils.book_new();
            const fileName = "report";
            XLSX.utils.book_append_sheet(workbook, sheet, fileName);
            XLSX.writeFile(workbook, `${fileName}.xlsx`);
            this.generating = false;
          });
          break;
      }
    },
    balanceGeneral(dateRange, fileType) {
      const general = () =>
        this.$axios.get("/entries/report/balance-general", {
          params: {
            date: dateRange,
          },
        });
      const bussinesInfo = () => this.$axios.get("/business/info");
      switch (fileType) {
        case "pdf":
          Promise.all([general(), bussinesInfo()]).then((res) => {
            const [general, bussinesInfo] = res;
            const [activo, pasivo, patrimonio] = general.data.balanceGeneral;
            const { name, nit, nrc } = bussinesInfo.data.info;
            let activoValues = [];
            let pasivoValues = [];
            let patrimonioValues = [];

            activoValues.push([
              {
                fontSize: 10,
                alignment: "center",
                text: activo.name,
                style: "tableHeader",
                colSpan: 3,
              },
              "",
              "",
            ]);
            for (const a of activo.accounts) {
              activoValues.push([
                [
                  {
                    text: a.name,
                    style: "tableHeader",
                  },
                ],
                "",
                {
                  text: this.$options.filters.formatMoney(a.total),
                  style: "tableHeader",
                },
              ]);
              for (const ch of a.accounts) {
                activoValues.push([
                  { text: ch.name, margin: [10, 0, 0, 0] },
                  this.$options.filters.formatMoney(ch.total),
                  "",
                ]);
              }
            }

            pasivoValues.push([
              {
                fontSize: 10,
                alignment: "center",
                text: pasivo.name,
                style: "tableHeader",
                colSpan: 3,
              },
              "",
              "",
            ]);
            for (const a of pasivo.accounts) {
              pasivoValues.push([
                [
                  {
                    text: a.name,
                    style: "tableHeader",
                  },
                ],
                "",
                {
                  text: this.$options.filters.formatMoney(a.total),
                  style: "tableHeader",
                },
              ]);
              for (const ch of a.accounts) {
                pasivoValues.push([
                  { text: ch.name, margin: [10, 0, 0, 0] },
                  this.$options.filters.formatMoney(ch.total),
                  "",
                ]);
              }
            }

            patrimonioValues.push([
              {
                fontSize: 10,
                alignment: "center",
                text: patrimonio.name,
                style: "tableHeader",
                colSpan: 3,
              },
              "",
              "",
            ]);
            for (const a of patrimonio.accounts) {
              patrimonioValues.push([
                [
                  {
                    text: a.name,
                    style: "tableHeader",
                  },
                ],
                "",
                {
                  text: this.$options.filters.formatMoney(a.total),
                  style: "tableHeader",
                },
              ]);
              for (const ch of a.accounts) {
                patrimonioValues.push([
                  { text: ch.name, margin: [10, 0, 0, 0] },
                  this.$options.filters.formatMoney(ch.total),
                  "",
                ]);
              }
            }

            const docDefinition = {
              pageSize: "LETTER",
              pageOrientation: "landscape",
              pageMargins: [15, 55, 15, 40],
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
                    widths: ["49.5%", "1%", "49.5%"],
                    body: [
                      [
                        {
                          layout: "noBorders",
                          table: {
                            widths: ["*", "auto", "auto"],
                            body: activoValues,
                          },
                        },
                        "",
                        {
                          layout: "noBorders",
                          table: {
                            widths: ["*", "auto", "auto"],
                            body: [
                              ...pasivoValues,
                              ["", "", ""],
                              ...patrimonioValues,
                            ],
                          },
                        },
                      ],
                      [
                        {
                          text: "",
                          margin: [0, 10, 0, 0],
                        },
                        {},
                        {},
                      ],
                      [
                        {
                          table: {
                            widths: ["*", "*"],
                            body: [
                              [
                                {
                                  fontSize: 10,
                                  text: "TOTAL ACTIVO:",
                                  style: "tableHeader",
                                  border: [false, true, false, true],
                                },
                                {
                                  alignment: "right",
                                  fontSize: 10,
                                  text: this.$options.filters.formatMoney(
                                    activo.total
                                  ),
                                  style: "tableHeader",
                                  border: [false, true, false, true],
                                },
                              ],
                            ],
                          },
                        },
                        {},
                        {
                          table: {
                            widths: ["*", "*"],
                            body: [
                              [
                                {
                                  fontSize: 10,
                                  text: "TOTAL PASIVO Y PATRIMONIO:",
                                  style: "tableHeader",
                                  border: [false, true, false, true],
                                },
                                {
                                  alignment: "right",
                                  fontSize: 10,
                                  text: this.$options.filters.formatMoney(
                                    pasivo.total + patrimonio.total
                                  ),
                                  style: "tableHeader",
                                  border: [false, true, false, true],
                                },
                              ],
                            ],
                          },
                        },
                      ],
                      [
                        {
                          text: "",
                          margin: [0, 60, 0, 0],
                        },
                        {},
                        {},
                      ],
                      [
                        {
                          colSpan: 3,
                          table: {
                            widths: ["*", "2%", "*", "2%", "*"],
                            body: [
                              [
                                {
                                  alignment: "center",
                                  text: [
                                    {
                                      style: "tableHeader",
                                      text: "Nombre Apellido\n",
                                    },
                                    "Representante legal",
                                  ],
                                  border: [false, true, false, false],
                                },
                                {
                                  text: "",
                                  border: [false, false, false, false],
                                },
                                {
                                  alignment: "center",
                                  text: [
                                    {
                                      text: "Nombre Apellido\n",
                                      style: "tableHeader",
                                    },
                                    "Contador",
                                  ],
                                  border: [false, true, false, false],
                                },
                                {
                                  text: "",
                                  border: [false, false, false, false],
                                },
                                {
                                  alignment: "center",
                                  text: [
                                    {
                                      text: "Nombre Apellido\n",
                                      style: "tableHeader",
                                    },
                                    "Auditor",
                                  ],
                                  border: [false, true, false, false],
                                },
                              ],
                            ],
                          },
                        },
                        {},
                        {},
                      ],
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
          console.log("Generando PDF");
          break;
        case "excel":
          Promise.all([general(), bussinesInfo()]).then((res) => {
            const [general, bussinesInfo] = res;
            const [activo, pasivo, patrimonio] = general.data.balanceGeneral;
            const { name, nit, nrc } = bussinesInfo.data.info;
            let activoValues = [];
            let pasivoValues = [];
            let patrimonioValues = [];

            activoValues.push([activo.name]);

            for (const ac of activo.accounts) {
              activoValues.push([ac.name, "", ac.total]);
              for (const acc of ac.accounts) {
                activoValues.push([acc.name, acc.total]);
              }
            }
            activoValues.push([""]);
            activoValues.push(["TOTAL ACTIVO:", "", activo.total]);
            activoValues.push([""]);
            activoValues.push([""]);

            //Empieza pasivos
            pasivoValues.push([pasivo.name]);

            for (const ac of pasivo.accounts) {
              pasivoValues.push([ac.name, "", ac.total]);
              for (const acc of ac.accounts) {
                pasivoValues.push([acc.name, acc.total]);
              }
            }
            pasivoValues.push([""]);

            //Empieza patrimonio

            patrimonioValues.push([patrimonio.name]);

            for (const p of patrimonio.accounts) {
              patrimonioValues.push([p.name, "", p.total]);
              for (const pp of p.accounts) {
                patrimonioValues.push([pp.name, pp.total]);
              }
            }

            patrimonioValues.push([""]);
            patrimonioValues.push([
              "TOTAL PASIVOS Y PATRIMONIO:",
              "",
              pasivo.total + patrimonio.total,
            ]);

            const document = [
              [name],
              ["BALANCE GENERAL", `NIT: ${nit}`, `NRC: ${nrc}`],
              [""],
              ...activoValues,
              ...pasivoValues,
              ...patrimonioValues,
              [""],
              [""],
              [
                "_____________________________\nNombre Apellido\nRepresentante legal",
                "_____________________________\nNombre Apellido\nContador",
                "_____________________________\nNombre Apellido\nAuditor",
              ],
            ];

            const sheet = XLSX.utils.aoa_to_sheet(document);
            const workbook = XLSX.utils.book_new();
            const fileName = "report";
            XLSX.utils.book_append_sheet(workbook, sheet, fileName);
            XLSX.writeFile(workbook, `${fileName}.xlsx`);
            this.generating = false;
          });

          console.log("Generando EXCEL");
          break;

        default:
          break;
      }
    },
    getAccountingCatalog(fileType) {
      const catalog = () => this.$axios.get("/entries/catalog");
      const bussinesInfo = () => this.$axios.get("/business/info");
      switch (fileType) {
        case "pdf":
          Promise.all([catalog(), bussinesInfo()]).then((res) => {
            const [catalog, bussinesInfo] = res;
            const catalogReport = catalog.data.accountingCatalog;
            const { name, nit, nrc } = bussinesInfo.data.info;
            const data = catalogReport.map((c) => {
              return [
                { bold: c.isParent, text: c.code },
                { bold: c.isParent, text: c.name },

                {
                  bold: c.isParent,
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
          break;
        case "excel":
          Promise.all([catalog(), bussinesInfo()]).then((res) => {
            const [catalog, bussinesInfo] = res;
            const { name, nit, nrc } = bussinesInfo.data.info;
            const data = [];
            for (const acc of catalog.data.accountingCatalog) {
              data.push([
                acc.code,
                acc.name,
                acc.isParent || acc.subAccounts ? "N" : "S",
              ]);
            }
            const document = [
              [name],
              ["CATALOGO DE CUENTAS", `NIT: ${nit}`, `NRC: ${nrc}`],
              [""],
              ...data,
            ];

            const sheet = XLSX.utils.aoa_to_sheet(document);
            const workbook = XLSX.utils.book_new();
            const fileName = "report";
            XLSX.utils.book_append_sheet(workbook, sheet, fileName);
            XLSX.writeFile(workbook, `${fileName}.xlsx`);
            this.generating = false;
          });
          break;
      }
    },
    getDiarioMayor(dateRange, fileType) {
      const bussinesInfo = () => this.$axios.get("/business/info");
      const libroMayor = () => {
        return this.$axios.get("/entries/report/diario-mayor", {
          params: {
            date: dateRange,
          },
        });
      };
      switch (fileType) {
        case "pdf":
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

            const docDefinition = {
              pageSize: "LETTER",
              pageOrientation: "portrait",
              pageMargins: [20, 60, 20, 40],
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
          break;
        case "excel":
          Promise.all([bussinesInfo(), libroMayor()]).then((res) => {
            const [bussinesInfo, libroMayor] = res;
            const { name, nit, nrc } = bussinesInfo.data.info;

            const data = [];
            for (const account of libroMayor.data.accounts) {
              data.push([
                account.code,
                account.name,
                "Saldo inicial",
                "",
                "",
                account.initialBalance,
              ]);
              for (const movement of account.movements) {
                data.push([
                  "",
                  "MOVIMIENTOS DEL DIA",
                  movement.date,
                  movement.cargo,
                  movement.abono,
                  movement.balance,
                ]);
              }
              data.push([
                "",
                "",
                "Saldo actual",
                account.totalCargo,
                account.totalAbono,
                account.currentBalance,
              ]);
              data.push([""]);
            }
            const document = [
              [name],
              [
                `LIBRO DIARIO MAYOR PARA EL MES DE ${this.$dateFns.format(
                  new Date(dateRange),
                  "MMMM - yyyy"
                )}`,
                "",
                "",
                "",
                `NIT: ${nit}`,
                `NRC: ${nrc}`,
              ],
              [""],
              [
                "CÓD. DE LA",
                "NOMBRE DE LA CUENTA",
                "FECHA DE",
                "MES ACTUAL",
                "",
                "SALDO DEL",
              ],
              ["CUENTA", "", "PARTIDA", "CARGOS", "ABONO", "PERIODO"],
              [""],
              ...data,
            ];

            const sheet = XLSX.utils.aoa_to_sheet(document);
            const workbook = XLSX.utils.book_new();
            const fileName = "report";
            XLSX.utils.book_append_sheet(workbook, sheet, fileName);
            XLSX.writeFile(workbook, `${fileName}.xlsx`);
            this.generating = false;
          });
          break;
      }
    },
    getAuxiliares(dateRange, fileType) {
      const bussinesInfo = () => this.$axios.get("/business/info");
      const auxiliares = () => {
        return this.$axios.get("/entries/report/auxiliares", {
          params: {
            date: dateRange,
          },
        });
      };
      switch (fileType) {
        case "pdf":
          Promise.all([bussinesInfo(), auxiliares()]).then((res) => {
            const [bussinesInfo, auxiliares] = res;
            const { name, nit, nrc } = bussinesInfo.data.info;
            const reporteAuxiliares = auxiliares.data.accounts;
            const values = [];
            const emptyRow = [{}, {}, {}, {}, {}, {}];

            for (const i of reporteAuxiliares) {
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
                  {
                    text: j.entryNumber,
                    alignment: "right",
                  },
                  {
                    text: j.entryName,
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

            const docDefinition = {
              pageSize: "LETTER",
              pageOrientation: "portrait",
              pageMargins: [20, 60, 20, 40],
              header: getHeader(
                name,
                nit,
                nrc,
                this.$dateFns.lastDayOfMonth(new Date(dateRange)),
                "LIBROS DE AUXILIARES",
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
                          text: "CÓD. DE LA CUENTA\nN° DE PARTIDA",
                          style: "tableHeader",
                          rowSpan: 2,
                        },
                        {
                          text: "NOMBRE DE LA CUENTA\nCONCEPTO",
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
          break;
        case "excel":
          Promise.all([bussinesInfo(), auxiliares()]).then((res) => {
            const [bussinesInfo, auxiliares] = res;
            const { name, nit, nrc } = bussinesInfo.data.info;

            const data = [];
            for (const account of auxiliares.data.accounts) {
              data.push([
                account.code,
                account.name,
                "Saldo inicial",
                "",
                "",
                account.initialBalance,
              ]);
              for (const movement of account.movements) {
                data.push([
                  movement.entryNumber,
                  movement.entryName,
                  movement.date,
                  movement.cargo,
                  movement.abono,
                  movement.balance,
                ]);
              }
              data.push([
                "",
                "",
                "Saldo actual",
                account.totalCargo,
                account.totalAbono,
                account.currentBalance,
              ]);
              data.push([""]);
            }
            const document = [
              [name],
              [
                `LIBROS DE AUXILIARES PARA EL MES DE ${this.$dateFns.format(
                  new Date(dateRange),
                  "MMMM - yyyy"
                )}`,
                "",
                "",
                "",
                `NIT: ${nit}`,
                `NRC: ${nrc}`,
              ],
              [""],
              [
                "CÓD. DE LA CUENTA",
                "NOMBRE DE LA CUENTA",
                "FECHA DE",
                "MES ACTUAL",
                "",
                "SALDO DEL",
              ],
              [
                "N° DE PARTIDA",
                "CONCEPTO",
                "PARTIDA",
                "CARGOS",
                "ABONO",
                "PERIODO",
              ],
              [""],
              ...data,
            ];

            const sheet = XLSX.utils.aoa_to_sheet(document);
            const workbook = XLSX.utils.book_new();
            const fileName = "report";
            XLSX.utils.book_append_sheet(workbook, sheet, fileName);
            XLSX.writeFile(workbook, `${fileName}.xlsx`);
            this.generating = false;
          });
          break;
      }
    },
    generateDetalleCuentas(dateRange, catalogos, fileType) {
      const bussinesInfo = () => this.$axios.get("/business/info");
      const movements = () =>
        this.$axios.get("/entries/report/account-movements", {
          params: {
            startDate: this.$dateFns.format(dateRange[0], "yyyy-MM-dd"),
            endDate: this.$dateFns.format(dateRange[1], "yyyy-MM-dd"),
            selectedAccounts: JSON.stringify(catalogos),
          },
        });
      switch (fileType) {
        case "pdf":
          Promise.all([bussinesInfo(), movements()]).then((res) => {
            const [bussinesInfo, movements] = res;
            const { name, nit, nrc } = bussinesInfo.data.info;
            const movementsReport = movements.data.accounts;

            const values = [];
            const emptyRow = [{}, {}, {}, {}, {}, {}];

            for (const i of movementsReport) {
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
                  text: "Saldo\ninicial",
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
                  {
                    text: j.entryNumber,
                    alignment: "right",
                  },
                  {
                    text: j.entryName,
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
                  text: "Saldo\nactual",
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

            const docDefinition = {
              pageSize: "LETTER",
              pageOrientation: "portrait",
              pageMargins: [20, 60, 20, 40],
              header: getHeader(
                name,
                nit,
                nrc,
                [new Date(dateRange[0]), new Date(dateRange[1])],
                "DETALLE DE MOVIMIENTO DE CUENTAS",
                "period"
              ),
              footer: getFooter(),
              content: [
                {
                  fontSize: 9,
                  layout: "noBorders",
                  table: {
                    headerRows: 2,
                    widths: ["12%", "52%", "9%", "9%", "9%", "9%"],
                    heights: -5,
                    body: [
                      [
                        {
                          text: "CÓD. DE LA CUENTA\nN° DE PARTIDA",
                          style: "tableHeader",
                          rowSpan: 2,
                        },
                        {
                          text: "NOMBRE DE LA CUENTA\nCONCEPTO",
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

          break;
        case "excel":
          Promise.all([bussinesInfo(), movements()]).then((res) => {
            const [bussinesInfo, movements] = res;
            const { name, nit, nrc } = bussinesInfo.data.info;

            const data = [];
            for (const account of movements.data.accounts) {
              data.push([
                account.code,
                account.name,
                "Saldo inicial",
                "",
                "",
                account.initialBalance,
              ]);
              for (const movement of account.movements) {
                data.push([
                  movement.entryNumber,
                  movement.entryName,
                  movement.date,
                  movement.cargo,
                  movement.abono,
                  movement.balance,
                ]);
              }
              data.push([
                "",
                "",
                "Saldo actual",
                account.totalCargo,
                account.totalAbono,
                account.currentBalance,
              ]);
              data.push([""]);
            }
            const document = [
              [name],
              [
                `DETALLE DE MOVIMIENTO DE CUENTAS EN EL PERÍODO DEL ${this.$dateFns.format(
                  new Date(dateRange[0]),
                  "dd/MM/yyyy"
                )} AL ${this.$dateFns.format(
                  new Date(dateRange[1]),
                  "dd/MM/yyyy"
                )}`,
                "",
                "",
                "",
                `NIT: ${nit}`,
                `NRC: ${nrc}`,
              ],
              [""],
              [
                "CÓD. DE LA CUENTA",
                "NOMBRE DE LA CUENTA",
                "FECHA DE",
                "MES ACTUAL",
                "",
                "SALDO DEL",
              ],
              [
                "N° DE PARTIDA",
                "CONCEPTO",
                "PARTIDA",
                "CARGOS",
                "ABONO",
                "PERIODO",
              ],
              [""],
              ...data,
            ];

            const sheet = XLSX.utils.aoa_to_sheet(document);
            const workbook = XLSX.utils.book_new();
            const fileName = "report";
            XLSX.utils.book_append_sheet(workbook, sheet, fileName);
            XLSX.writeFile(workbook, `${fileName}.xlsx`);
            this.generating = false;
          });
          break;
      }
    },
    async getCalogs() {
      const { data } = await this.$axios.get("/entries/catalog");
      this.accountingCatalog = data.accountingCatalog;
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

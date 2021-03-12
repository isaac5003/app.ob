<template>
  <layout-content
    v-loading="pageLoading"
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
              <el-row :gutter="15">
                <el-col :span="8">
                  <el-radio border label="pdf" size="small" class="w-full"
                    >PDF</el-radio
                  >
                </el-col>
                <el-col :span="8">
                  <el-radio border label="excel" size="small" class="w-full"
                    >EXCEL</el-radio
                  >
                </el-col>
              </el-row>
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
              placeholder="Selecciona un mes"
              size="small"
              style="width: 100%"
            />
          </el-form-item>
        </div>
      </div>
      <!-- seleccion date range y cuentas -->
      <div class="grid grid-cols-12 gap-4" v-if="requirementForm == 'extended'">
        <div class="col-span-4">
          <el-form-item label="Rango de fechas:" prop="dateRanges">
            <el-date-picker
              size="small"
              v-model="reportForm.dateRanges"
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
        <div class="col-span-8">
          <el-form-item label="Cuentas:" prop="accounts">
            <el-select
              v-model="reportForm.accounts"
              placeholder="Seleccionar cuentas"
              size="small"
              clearable
              filterable
              multiple
              default-first-option
              class="w-full"
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
      <div class="flex flex-row justify-end">
        <el-button
          :disabled="reportForm.reportType ? false : true"
          type="primary"
          size="small"
          icon="el-icon-download"
          native-type="submit"
          :loading="generating"
          >Descargar</el-button
        ><el-button size="small" @click="cancel()">Cancelar</el-button>
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
import { selectValidation, getHeader, getFooter, fixDate } from "../../tools";

export default {
  name: "EntriesReports",
  components: {
    LayoutContent,
    Notification,
  },
  data() {
    return {
      generating: false,
      pageLoading: false,
      loading: false,
      errorMessage: "",
      reportForm: {
        reportType: "",
        dateRange: new Date(),
        radio: "pdf",
        dateRanges: "",
        accounts: [],
      },
      reportFormRules: {
        reportType: selectValidation("change", true),
        dateRange: selectValidation("change", true),
        dateRanges: selectValidation("change", true),
        accounts: selectValidation("change", true),
      },
      catalogos: [],
      reports: [
        { name: "Balance general anual", id: "balanceAnual" },
        { name: "Balance general mensual", id: "balanceGeneral" },
        { name: "Estado de resultados anual", id: "estadoResultadosAnual" },
        { name: "Estado de resultados mensual", id: "estadoResultados" },
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
          case "estadoResultados":
          case "balanceGeneral":
          case "balanceComprobacion":
          case "diarioMayor":
          case "libroAuxiliares":
            this.requirementForm = "compact";
            break;

          case "movimientoCuentas":
            this.requirementForm = "extended";
            this.getCalogs();
            this.pageLoading = true;
            break;
          default:
            this.requirementForm = "none";
            break;
        }
      }
    },
    generateReport(
      formName,
      { dateRange, reportType, radio, dateRanges },
      catalogos
    ) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        }

        this.generating = true;
        switch (reportType) {
          case "balanceAnual":
            this.balanceAnual(radio);
            break;
          case "balanceGeneral":
            this.balanceGeneral(
              this.$dateFns.format(new Date(dateRange), "yyyy-MM-dd"),
              radio
            );
            break;
          case "estadoResultados":
            this.generateEstadoResultados(
              this.$dateFns.format(new Date(dateRange), "yyyy-MM-dd"),
              radio
            );

            break;
          case "estadoResultadosAnual":
            this.generateEstadoResultadosAnual(
              this.$dateFns.format(new Date(dateRange), "yyyy-MM-dd"),
              radio
            );

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
            this.generateDetalleCuentas(dateRanges, catalogos, radio);
            break;
        }
      });
    },
    generateEstadoResultados(dateRange, fileType) {
      const bussinesInfo = () => this.$axios.get("/business/info");
      const estadoResultados = () =>
        this.$axios.get("/entries/report/estado-resultados", {
          params: {
            endDate: fixDate(dateRange),
          },
        });
      const signatures = () => this.$axios.get("/entries/setting/signatures");
      switch (fileType) {
        case "pdf":
          Promise.all([bussinesInfo(), estadoResultados(), signatures()]).then(
            (res) => {
              const [bussinesInfo, estadoResultados, signatures] = res;
              const { name, nit, nrc } = bussinesInfo.data.info;
              const reportTitleName = estadoResultados.data.name;
              const estadoResultado = estadoResultados.data.estadoResultados.map(
                (er) => {
                  return {
                    ...er,
                    section: true,
                  };
                }
              );
              const signature = signatures.data.signatures;
              const postTitle =
                "(Expresado en dólares de los Estados Unidos de América)";
              const values = [];
              const emptyRow = [
                {
                  text: "",
                  border: [false, false],
                },
                {
                  text: "",
                  border: [false, false],
                },
                {
                  text: "",
                  border: [false, false],
                },
              ];

              for (const er of estadoResultado) {
                values.push(emptyRow);
                values.push([
                  {
                    bold: er.type == "total" || er.section,
                    text:
                      er.section || er.type == "total"
                        ? er.name.toUpperCase()
                        : er.name,
                    border: [false, false],
                  },
                  {
                    text: "",
                    border:
                      er.type == "total" && er.children
                        ? [false, true, false, false]
                        : [false, false],
                  },
                  {
                    bold: er.type == "total",
                    text: this.$options.filters.formatMoney(er.total),
                    alignment: "right",
                    border:
                      estadoResultado.indexOf(er) == estadoResultado.length - 1
                        ? [false, true, false, true]
                        : er.type == "total"
                        ? [false, true, false, false]
                        : [false, false],
                  },
                ]);
                if (er.children) {
                  for (const ch of er.children) {
                    values.push([
                      {
                        bold: false,
                        text: ch.name,
                        margin: [5, 0, 0, 0],
                        border: [false, false],
                      },
                      {
                        bold: false,
                        text: this.$options.filters.formatMoney(ch.total),
                        alignment: "right",
                        border: [false, false],
                      },
                      {
                        text: "",
                        border: [false, false],
                      },
                    ]);
                  }
                }
                values.push([
                  {
                    text: "",
                    border: [false, false],
                  },
                  {
                    text: "",
                    border: er.children
                      ? [false, true, false, false]
                      : [false, false],
                  },
                  {
                    text: "",
                    border: [false, false],
                  },
                ]);
              }

              const docDefinition = {
                info: {
                  title: `estado_resultados_al_${this.$dateFns.format(
                    new Date(dateRange),
                    "yyyyMMdd"
                  )}`,
                },
                pageSize: "LETTER",
                pageOrientation: "porttrait",
                pageMargins: [20, 80, 20, 40],
                header: getHeader(
                  name,
                  nit,
                  nrc,
                  null,
                  reportTitleName,
                  null,
                  null,
                  postTitle
                ),
                footer: getFooter(),
                content: [
                  {
                    fontSize: 9,

                    table: {
                      widths: ["*", "10%", "10%"],
                      body: [
                        ...values,
                        [
                          {
                            text: "",
                            margin: [0, 60, 0, 0],
                            border: [false, false, false, false],
                          },
                          {
                            text: "",
                            border: [false, false, false, false],
                          },
                          {
                            text: "",
                            border: [false, false, false, false],
                          },
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
                                        text: `${signature.legal}\n`,
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
                                    text: "",
                                    border: [false, false, false, false],
                                  },
                                  {
                                    alignment: "center",
                                    text: "",
                                    border: [false, false],
                                  },
                                  {
                                    alignment: "center",
                                    text: [
                                      {
                                        text: `${signature.accountant}\n`,
                                        style: "tableHeader",
                                      },
                                      "Contador",
                                    ],
                                    border: [false, true, false, false],
                                  },
                                ],
                              ],
                            },
                            border: [false, false, false, false],
                          },
                          {
                            text: "",
                            border: [false, false, false, false],
                          },
                          {
                            text: "",
                            border: [false, false, false, false],
                          },
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
            }
          );
          break;
        case "excel":
          Promise.all([bussinesInfo(), estadoResultados(), signatures()]).then(
            (res) => {
              const [bussinesInfo, estadoResultados, signatures] = res;
              const { name, nit, nrc } = bussinesInfo.data.info;
              const reportTitleName = estadoResultados.data.name;
              const estadoResultado = estadoResultados.data.estadoResultados.map(
                (er) => {
                  return {
                    ...er,
                    section: true,
                  };
                }
              );
              const signature = signatures.data.signatures;
              const postTitle =
                "(Expresado en dólares de los Estados Unidos de América)";
              const data = [];
              for (const er of estadoResultado) {
                data.push([""]);
                data.push([
                  er.section || er.type == "total"
                    ? er.name.toUpperCase()
                    : er.name,
                  ,
                  "",
                  er.total,
                ]);
                if (er.children) {
                  for (const ch of er.children) {
                    data.push([ch.name, ch.total, ""]);
                  }
                }
              }
              const document = [
                [name],
                [reportTitleName],
                [postTitle, `NIT: ${nit}`, `NRC: ${nrc}`],
                [""],

                [""],
                [""],
                ...data,
                [""],
                [""],
                [
                  `_____________________________\n${signature.legal}\nRepresentante legal`,
                  ``,
                  `_____________________________\n${signature.accountant}\nContador`,
                ],
              ];

              const sheet = XLSX.utils.aoa_to_sheet(document);
              const workbook = XLSX.utils.book_new();
              const fileName = `estado_resultados_al_${this.$dateFns.format(
                new Date(dateRange),
                "yyyyMMdd"
              )}`;
              XLSX.utils.book_append_sheet(workbook, sheet, fileName);
              XLSX.writeFile(workbook, `${fileName}.xlsx`);
              this.generating = false;
            }
          );
          break;
      }
    },
    generateEstadoResultadosAnual(dateRange, fileType) {
      const bussinesInfo = () => this.$axios.get("/business/info");
      const settingsGeneral = () => this.$axios.get("/entries/setting/general");
      const signatures = () => this.$axios.get("/entries/setting/signatures");
      switch (fileType) {
        case "pdf":
          Promise.all([bussinesInfo(), signatures(), settingsGeneral()]).then(
            (res) => {
              const [bussinesInfo, signatures, settingsGeneral] = res;
              const { name, nit, nrc } = bussinesInfo.data.info;
              const generales = settingsGeneral.data.general;
              const signature = signatures.data.signatures;
              const postTitle =
                "(Expresado en dólares de los Estados Unidos de América)";
              this.$axios
                .get("/entries/report/estado-resultados", {
                  params: {
                    startDate: generales.periodStart,
                    endDate: generales.peridoEnd,
                  },
                })
                .then((estadoResultados) => {
                  const reportTitleName = estadoResultados.data.name;

                  const estadoResultado = estadoResultados.data.estadoResultados.map(
                    (er) => {
                      return {
                        ...er,
                        section: true,
                      };
                    }
                  );
                  const values = [];
                  const emptyRow = [
                    {
                      text: "",
                      border: [false, false],
                    },
                    {
                      text: "",
                      border: [false, false],
                    },
                    {
                      text: "",
                      border: [false, false],
                    },
                  ];

                  for (const er of estadoResultado) {
                    values.push(emptyRow);
                    values.push([
                      {
                        bold: er.type == "total" || er.section,
                        text:
                          er.section || er.type == "total"
                            ? er.name.toUpperCase()
                            : er.name,
                        border: [false, false],
                      },
                      {
                        text: "",
                        border:
                          er.type == "total" && er.children
                            ? [false, true, false, false]
                            : [false, false],
                      },
                      {
                        bold: er.type == "total",
                        text: this.$options.filters.formatMoney(er.total),
                        alignment: "right",
                        border:
                          estadoResultado.indexOf(er) ==
                          estadoResultado.length - 1
                            ? [false, true, false, true]
                            : er.type == "total"
                            ? [false, true, false, false]
                            : [false, false],
                      },
                    ]);
                    if (er.children) {
                      for (const ch of er.children) {
                        values.push([
                          {
                            bold: false,
                            text: ch.name,
                            margin: [5, 0, 0, 0],
                            border: [false, false],
                          },
                          {
                            bold: false,
                            text: this.$options.filters.formatMoney(ch.total),
                            alignment: "right",
                            border: [false, false],
                          },
                          {
                            text: "",
                            border: [false, false],
                          },
                        ]);
                      }
                    }
                    values.push([
                      {
                        text: "",
                        border: [false, false],
                      },
                      {
                        text: "",
                        border: er.children
                          ? [false, true, false, false]
                          : [false, false],
                      },
                      {
                        text: "",
                        border: [false, false],
                      },
                    ]);
                  }

                  const docDefinition = {
                    info: {
                      title: `estado_resultados_al_${this.$dateFns.format(
                        new Date(dateRange),
                        "yyyyMMdd"
                      )}`,
                    },
                    pageSize: "LETTER",
                    pageOrientation: "porttrait",
                    pageMargins: [20, 80, 20, 40],
                    header: getHeader(
                      name,
                      nit,
                      nrc,
                      null,
                      reportTitleName,
                      null,
                      null,
                      postTitle
                    ),
                    footer: getFooter(),
                    content: [
                      {
                        fontSize: 9,

                        table: {
                          widths: ["*", "10%", "10%"],
                          body: [
                            ...values,
                            [
                              {
                                text: "",
                                margin: [0, 60, 0, 0],
                                border: [false, false, false, false],
                              },
                              {
                                text: "",
                                border: [false, false, false, false],
                              },
                              {
                                text: "",
                                border: [false, false, false, false],
                              },
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
                                            text: `${signature.legal}\n`,
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
                                            text: `${signature.accountant}\n`,
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
                                            text: `${signature.auditor}\n`,
                                            style: "tableHeader",
                                          },
                                          "Auditor",
                                        ],
                                        border: [false, true, false, false],
                                      },
                                    ],
                                  ],
                                },
                                border: [false, false, false, false],
                              },
                              {
                                text: "",
                                border: [false, false, false, false],
                              },
                              {
                                text: "",
                                border: [false, false, false, false],
                              },
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
            }
          );
          break;
        case "excel":
          Promise.all([bussinesInfo(), signatures(), settingsGeneral()]).then(
            (res) => {
              const [bussinesInfo, signatures, settingsGeneral] = res;
              const { name, nit, nrc } = bussinesInfo.data.info;
              const generales = settingsGeneral.data.general;
              const signature = signatures.data.signatures;
              const postTitle =
                "(Expresado en dólares de los Estados Unidos de América)";
              this.$axios
                .get("/entries/report/estado-resultados", {
                  params: {
                    endDate: generales.peridoEnd,
                  },
                })
                .then((estadoResultados) => {
                  const reportTitleName = estadoResultados.data.name;

                  const estadoResultado = estadoResultados.data.estadoResultados.map(
                    (er) => {
                      return {
                        ...er,
                        section: true,
                      };
                    }
                  );
                  const data = [];

                  for (const er of estadoResultado) {
                    data.push([""]);
                    data.push([
                      er.section || er.type == "total"
                        ? er.name.toUpperCase()
                        : er.name,
                      ,
                      "",
                      er.total,
                    ]);
                    if (er.children) {
                      for (const ch of er.children) {
                        data.push([ch.name, ch.total, ""]);
                      }
                    }
                  }
                  const document = [
                    [name],
                    [reportTitleName],
                    [postTitle, `NIT: ${nit}`, `NRC: ${nrc}`],
                    [""],

                    [""],
                    [""],
                    ...data,
                    [""],
                    [""],
                    [
                      `_____________________________\n${signature.legal}\nRepresentante legal`,
                      `_____________________________\n${signature.accountant}\nContador`,
                      `_____________________________\n${signature.auditor}\nAuditor`,
                    ],
                  ];

                  const sheet = XLSX.utils.aoa_to_sheet(document);
                  const workbook = XLSX.utils.book_new();
                  const fileName = `estado_resultados_al_${this.$dateFns.format(
                    new Date(dateRange),
                    "yyyyMMdd"
                  )}`;
                  XLSX.utils.book_append_sheet(workbook, sheet, fileName);
                  XLSX.writeFile(workbook, `${fileName}.xlsx`);
                  this.generating = false;
                });
            }
          );
          break;
      }
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
            const reportTitleName = balanceComprobacion.data.name;
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
              info: {
                title: `balance_comprobacion_al_${this.$dateFns.format(
                  new Date(dateRange),
                  "yyyyMMdd"
                )}`,
              },
              pageSize: "LETTER",
              pageOrientation: "portrait",
              pageMargins: [15, 60, 15, 40],
              header: getHeader(name, nit, nrc, null, reportTitleName),
              footer: getFooter(),
              content: [
                {
                  fontSize: 9,
                  layout: "noBorders",
                  table: {
                    headerRows: 2,
                    widths: [
                      "12%",
                      "auto",
                      "10%",
                      "9.5%",
                      "9.5%",
                      "9.5%",
                      "10%",
                    ],
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
            const reportTitleName = balanceComprobacion.data.name;
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

                  i.code.length == 1 ? "" : i.initialBalance,

                  i.code.length == 1 ? "" : i.cargo,

                  i.code.length == 1 ? "" : i.abono,

                  i.code.length == 1 ? "" : i.currentBalance,

                  i.code.length == 1 ? "" : i.actualBalance,
                ]);
              }
              data.push([
                `*** TOTAL ${m.code} ${m.name} ***`,

                "",

                m.initialBalance,

                m.cargo,

                m.abono,

                m.currentBalance,
                m.actualBalance,
              ]);
            }
            const document = [
              [name],
              [reportTitleName, "", "", "", `NIT: ${nit}`, `NRC: ${nrc}`],
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
            const fileName = `balancecomprobacion_al_${this.$dateFns.format(
              new Date(dateRange),
              "yyyyMMdd"
            )}`;
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
            endDate: fixDate(dateRange),
          },
        });
      const bussinesInfo = () => this.$axios.get("/business/info");
      const signatures = () => this.$axios.get("/entries/setting/signatures");
      switch (fileType) {
        case "pdf":
          Promise.all([general(), bussinesInfo(), signatures()]).then((res) => {
            const [general, bussinesInfo, signatures] = res;
            const [activo, pasivo, patrimonio] = general.data.balanceGeneral;
            const reportTitleName = general.data.name;
            const { name, nit, nrc } = bussinesInfo.data.info;
            const { accountant, auditor, legal } = signatures.data.signatures;
            const postTitle =
              "(Expresado en dólares de los Estados Unidos de América)";
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
                  alignment: "right",
                  style: "tableHeader",
                },
              ]);
              for (const ch of a.accounts) {
                activoValues.push([
                  { text: ch.name, margin: [10, 0, 0, 0] },
                  {
                    text: this.$options.filters.formatMoney(ch.total),
                    alignment: "right",
                  },
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
                  alignment: "right",
                },
              ]);
              for (const ch of a.accounts) {
                pasivoValues.push([
                  { text: ch.name, margin: [10, 0, 0, 0] },
                  {
                    text: this.$options.filters.formatMoney(ch.total),
                    alignment: "right",
                  },
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
                  alignment: "right",
                },
              ]);
              for (const ch of a.accounts) {
                patrimonioValues.push([
                  { text: ch.name, margin: [10, 0, 0, 0] },
                  {
                    text: this.$options.filters.formatMoney(ch.total),
                    alignment: "right",
                  },
                  "",
                ]);
              }
            }

            const docDefinition = {
              info: {
                title: `balance_general_${this.$dateFns.format(
                  new Date(dateRange),
                  "yyyyMMdd"
                )}`,
              },
              pageSize: "LETTER",
              pageOrientation: "landscape",
              pageMargins: [20, 80, 20, 40],
              header: getHeader(
                name,
                nit,
                nrc,
                null,
                reportTitleName,
                "period",
                null,
                postTitle
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
                                      text: `${legal}\n`,
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
                                      text: `${accountant}\n`,
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
                                      text: `${auditor}\n`,
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
          break;
        case "excel":
          Promise.all([general(), bussinesInfo(), signatures()]).then((res) => {
            const [general, bussinesInfo, signatures] = res;
            const [activo, pasivo, patrimonio] = general.data.balanceGeneral;
            const { name, nit, nrc } = bussinesInfo.data.info;
            const { accountant, auditor, legal } = signatures.data.signatures;
            const reportTitleName = general.data.name;
            const postTitle =
              "(Expresado en dólares de los Estados Unidos de América)";
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
              [reportTitleName],
              [postTitle, `NIT: ${nit}`, `NRC: ${nrc}`],
              [""],
              ...activoValues,
              ...pasivoValues,
              ...patrimonioValues,
              [""],
              [""],
              [
                `_____________________________\n${legal}\nRepresentante legal`,
                `_____________________________\n${accountant}\nContador`,
                `_____________________________\n${auditor}\nAuditor`,
              ],
            ];

            const sheet = XLSX.utils.aoa_to_sheet(document);
            const workbook = XLSX.utils.book_new();
            const fileName = `balance_general_al_${this.$dateFns.format(
              new Date(dateRange),
              "yyyyMMdd"
            )}`;
            XLSX.utils.book_append_sheet(workbook, sheet, fileName);
            XLSX.writeFile(workbook, `${fileName}.xlsx`);
            this.generating = false;
          });

          break;
      }
    },
    balanceAnual(fileType) {
      const bussinesInfo = () => this.$axios.get("/business/info");
      const settingsGeneral = () => this.$axios.get("/entries/setting/general");
      const signatures = () => this.$axios.get("/entries/setting/signatures");
      switch (fileType) {
        case "pdf":
          Promise.all([bussinesInfo(), settingsGeneral(), signatures()]).then(
            (res) => {
              const [bussinesInfo, settingsGeneral, signatures] = res;
              const { name, nit, nrc } = bussinesInfo.data.info;
              const { periodStart, peridoEnd } = settingsGeneral.data.general;
              const { accountant, auditor, legal } = signatures.data.signatures;
              const startDate = periodStart;
              const endDate = peridoEnd;
              const postTitle =
                "(Expresado en dólares de los Estados Unidos de América)";

              this.$axios
                .get("/entries/report/balance-general", {
                  params: {
                    startDate,
                    endDate,
                  },
                })
                .then((res) => {
                  const [activo, pasivo, patrimonio] = res.data.balanceGeneral;
                  const reportTitleName = res.data.name;
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
                        alignment: "right",
                        text: this.$options.filters.formatMoney(a.total),
                        style: "tableHeader",
                      },
                    ]);
                    for (const ch of a.accounts) {
                      activoValues.push([
                        {
                          text: ch.name,
                          margin: [10, 0, 0, 0],
                        },
                        {
                          alignment: "right",
                          text: this.$options.filters.formatMoney(ch.total),
                        },
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
                        alignment: "right",
                        text: this.$options.filters.formatMoney(a.total),
                        style: "tableHeader",
                      },
                    ]);
                    for (const ch of a.accounts) {
                      pasivoValues.push([
                        { text: ch.name, margin: [10, 0, 0, 0] },
                        {
                          alignment: "right",
                          text: this.$options.filters.formatMoney(ch.total),
                        },

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
                        alignment: "right",
                        text: this.$options.filters.formatMoney(a.total),
                        style: "tableHeader",
                      },
                    ]);
                    for (const ch of a.accounts) {
                      patrimonioValues.push([
                        { text: ch.name, margin: [10, 0, 0, 0] },
                        {
                          alignment: "right",
                          text: this.$options.filters.formatMoney(ch.total),
                        },

                        "",
                      ]);
                    }
                  }

                  const docDefinition = {
                    info: {
                      title: `balance_general_${this.$dateFns.format(
                        new Date(startDate),
                        "yyyyMMdd"
                      )}`,
                    },
                    pageSize: "LETTER",
                    pageOrientation: "landscape",
                    pageMargins: [20, 80, 20, 40],
                    header: getHeader(
                      name,
                      nit,
                      nrc,
                      null,
                      reportTitleName,
                      "period",
                      null,
                      postTitle
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
                                            text: `${legal}\n`,
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
                                            text: `${accountant}\n`,
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
                                            text: `${auditor}\n`,
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
            }
          );
          break;
        case "excel":
          Promise.all([bussinesInfo(), settingsGeneral(), signatures()]).then(
            (res) => {
              const [bussinesInfo, settingsGeneral, signatures] = res;
              const { name, nit, nrc } = bussinesInfo.data.info;
              const { periodStart, peridoEnd } = settingsGeneral.data.general;
              const { accountant, auditor, legal } = signatures.data.signatures;
              const startDate = periodStart;
              const endDate = peridoEnd;
              const postTitle =
                "(Expresado en dólares de los Estados Unidos de América)";

              this.$axios
                .get("/entries/report/balance-general", {
                  params: {
                    startDate,
                    endDate,
                  },
                })
                .then((res) => {
                  const [activo, pasivo, patrimonio] = res.data.balanceGeneral;
                  const reportTitleName = res.data.name;
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
                    [reportTitleName],
                    [postTitle, `NIT: ${nit}`, `NRC: ${nrc}`],
                    [""],
                    ...activoValues,
                    ...pasivoValues,
                    ...patrimonioValues,
                    [""],
                    [""],
                    [
                      `_____________________________\n${legal}\nRepresentante legal`,
                      `_____________________________\n${accountant}\nContador`,
                      `_____________________________\n${auditor}\nAuditor`,
                    ],
                  ];

                  const sheet = XLSX.utils.aoa_to_sheet(document);
                  const workbook = XLSX.utils.book_new();
                  const fileName = `balance_general_al_${this.$dateFns.format(
                    new Date(periodStart),
                    "yyyyMMdd"
                  )}`;
                  XLSX.utils.book_append_sheet(workbook, sheet, fileName);
                  XLSX.writeFile(workbook, `${fileName}.xlsx`);
                  this.generating = false;
                });
            }
          );
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
            const values = catalogReport.map((c) => {
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
              info: {
                title: `catalogo_cuentas_al_${this.$dateFns.format(
                  new Date(),
                  "yyyyMMdd"
                )}`,
              },
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
            const fileName = `catalogo_cuentas_al_${this.$dateFns.format(
              new Date(),
              "yyyyMMdd"
            )}`;
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
            const reportTitleName = libroMayor.data.name;
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
              info: {
                title: `libro_diario_mayor_al_${this.$dateFns.format(
                  new Date(dateRange),
                  "yyyyMMdd"
                )}`,
              },
              pageSize: "LETTER",
              pageOrientation: "portrait",
              pageMargins: [20, 60, 20, 40],
              header: getHeader(name, nit, nrc, null, reportTitleName, "month"),
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
            const reportTitleName = libroMayor.data.name;

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
              [reportTitleName, "", "", "", `NIT: ${nit}`, `NRC: ${nrc}`],
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
            const fileName = `libro_diario_mayor_al_${this.$dateFns.format(
              new Date(dateRange),
              "yyyyMMdd"
            )}`;
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
            const reportTitleName = auxiliares.data.name;
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
              info: {
                title: `libro_auxiliares_al_${this.$dateFns.format(
                  new Date(dateRange),
                  "yyyyMMdd"
                )}`,
              },
              pageSize: "LETTER",
              pageOrientation: "portrait",
              pageMargins: [20, 60, 20, 40],
              header: getHeader(name, nit, nrc, null, reportTitleName, "month"),
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
            const reportTitleName = auxiliares.data.name;
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
              [reportTitleName, "", "", "", `NIT: ${nit}`, `NRC: ${nrc}`],
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
            const fileName = `libro_axuliares_al_${this.$dateFns.format(
              new Date(dateRange),
              "yyyyMMdd"
            )}`;
            XLSX.utils.book_append_sheet(workbook, sheet, fileName);
            XLSX.writeFile(workbook, `${fileName}.xlsx`);
            this.generating = false;
          });
          break;
      }
    },
    generateDetalleCuentas(dateRange, catalogos, fileType) {
      const movements = () =>
        this.$axios.get("/entries/report/account-movements", {
          params: {
            startDate: this.$dateFns.format(dateRange[0], "yyyy-MM-dd"),
            endDate: this.$dateFns.format(dateRange[1], "yyyy-MM-dd"),
            selectedAccounts: JSON.stringify(this.reportForm.accounts),
          },
        });
      switch (fileType) {
        case "pdf":
          Promise.all([movements()]).then((res) => {
            const [movements] = res;
            const movementsReport = movements.data.accounts;
            const reportTitleName = movements.data.name;
            const bussinesInfo = movements.data.company;
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
              info: {
                title: `detalle_de_cuentas_al_${this.$dateFns.format(
                  new Date(dateRange[0]),
                  "yyyyMMdd"
                )}_${this.$dateFns.format(new Date(dateRange[1]), "yyyyMMdd")}`,
              },
              pageSize: "LETTER",
              pageOrientation: "portrait",
              pageMargins: [20, 60, 20, 40],
              header: getHeader(
                bussinesInfo.name,
                bussinesInfo.nit,
                bussinesInfo.nrc,
                null,
                reportTitleName,
                null,
                null
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
          Promise.all([movements()]).then(([res]) => {
            const data = [];
            for (const account of res.data.accounts) {
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
              [res.data.company.name],
              [
                res.data.name,
                "",
                "",
                "",
                `NIT: ${res.data.company.nit}`,
                `NRC: ${res.data.company.nrc}`,
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
            const fileName = `detallecuenta_${this.$dateFns.format(
              new Date(dateRange[0]),
              "yyyyMMdd"
            )}_${this.$dateFns.format(new Date(dateRange[1]), "yyyyMMdd")}`;
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
      this.pageLoading = false;
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

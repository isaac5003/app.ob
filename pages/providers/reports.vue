<template>
  <layout-content
    v-loanding=""
    page-title="Reportes"
    :breadcrumb="[
      { name: 'Provedores', to: '/providers/reports' },
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
      @submit.native.prevent="generateReport('reportForm', reportForm)"
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
                  <el-radio border size="small" label="pdf" class="w-full"
                    >PDF</el-radio
                  >
                </el-col>
                <el-col :span="8">
                  <el-radio border size="small" label="excel" class="w-full"
                    >EXCEL</el-radio
                  >
                </el-col>
              </el-row>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4" v-if="requirementForm == 'proveedores'">
        <div class="col-span-5">
          <el-form-item label="Clientes" prop="customers">
            <el-select
              v-model="reportForm.providers"
              placeholder="Seleccione el cliente"
              size="small"
              class="w-full"
              default-first-option
              filterable
              clearable
            >
              <el-option
                v-for="c in providers"
                :key="c.id"
                :label="c.name"
                :value="c.id"
              />
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
        >
        <el-button size="small" @click="cancel()">Cancelar</el-button>
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
import { eachMonthOfInterval } from "date-fns";
export default {
  name: "providerReports",
  components: {
    LayoutContent,
    Notification,
  },

  data() {
    return {
      errorMessage: "",
      generating: false,
      loading: false,
      errorMessage: "",
      reportForm: {
        reportType: "",
        radio: "pdf",
        providers: "",
      },
      reportFormRules: {
        reportType: selectValidation("change", true),
        dateRange: selectValidation("change", true),
        providers: selectValidation(true),
      },
      reports: [
        { name: "Listado de proveedores", id: "Proveedores" },
        { name: "Perfil de cliente", id: "perfil" },
      ],
      requirementForm: null,
      accountingCatalog: [],
      providers: null,
    };
  },

  methods: {
    showRequirements(id) {
      if (!id) {
        this.requirementForm = null;
      } else {
        switch (id) {
          case "perfil":
            this.$axios
              .get("/providers")
              .then((res) => {
                this.providers = res.data.providers;
                this.requirementForm = "proveedores";
              })
              .catch((err) => err.data.errorMessage);
            break;
          default:
            this.requirementForm = "";
        }
      }
    },

    reportProviders(fileType) {
      const providers = () => this.$axios.get("/providers");
      const bussinesInfo = () => this.$axios.get("/bussiness/info");
      switch (fileType) {
        case "pdf":
          Promise.all([providers(), bussinesInfo()]).then((res) => {
            const [providers, bussinesInfo] = res;
            const providersData = providers.data.providers;
            const { name, nit, nrc } = bussinesInfo.data.info;
            const values = [];
            const emtyRow = [{}, {}, {}, {}, {}];

            for (const c of providersData) {
              values.push(emptyRow);
              values.push([
                {
                  text: c.name,
                },
                {
                  text: c.customerType.name,
                },
                {
                  text: c.nit,
                },
                {
                  text: c.nrc,
                },
                {
                  text: c.isActiveProviders ? "Activo" : "Inactivo",
                },
              ]);
            }
            const docDefinition = {
              pageSize: "LETTER",
              pageOrientation: "portrait",
              pageMargins: [20, 60, 20, 40],
              header: getHeader(name, nit, nrc, null, "REPORTE DE PROVEEDORES"),
              footer: getFooter(),
              content: [
                {
                  fontSize: 9,
                  layout: "noBorders",
                  table: {
                    headerRows: 1,
                    widths: ["auto", "15%", "15%", "10%", "10%"],
                    heights: -5,
                    body: [
                      [
                        {
                          text: "NOMBRE",
                          style: "tableHeader",
                        },
                        {
                          text: "TIPO",
                          style: "tableHeader",
                        },
                        {
                          text: "NIT",
                          style: "tableHeader",
                        },
                        {
                          text: "NRC",
                          style: "tableHeader",
                        },
                        {
                          text: "ESTADO",
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
            pdfMake.createPDF(docDefinition).open();
          });
          break;
        case "exel":
          Promise.all([customers(), bussinesInfo()]).then((res) => {
            const [providers, bussinesInfo] = res;
            const { name, nit, nrc } = bussinesInfo.data.info;
            const providersData = providers.data.customers;
            const values = [];
            for (const c of providersData) {
              values.push([
                c.name,
                c.customerType.name,
                c.nit,
                c.nrc,
                c.isActiveProvider ? "Activo" : "Inactivo",
              ]);
            }
            const document = [
              [name],
              ["REPORTE CLIENTES", `NIT: ${nit}`, `NRC: ${nrc}`],
              [""],
              ["NOMBRE", "TIPO", "NIT", "NRC", "ESTADO"],
              ...values,
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
       reportProvider(providersId, fileType) {
      const providers = () => this.$axios.get(`/providers/${providersId}`);
      const branches = () =>
        this.$axios.get(`/providers/${proviadersId}/branches`);
      const bussinesInfo = () => this.$axios.get("/business/info");
      switch (fileType) {
        case "pdf":
          Promise.all([bussinesInfo(), providers(), branches()])
            .then((res) => {
              const [bussinesInfo, providers, branch] = res;

              const { name, nit, nrc } = bussinesInfo.data.info;
              const providersData = providers.data.providers;
              const branches = branch.data.branches;
              const values = [];
              const valuesTable = [];
              const valuesGeneral = [];
              const valuesTributary = [];

              valuesGeneral.push([
                {
                  bold: true,

                  text: "Nombre:",
                },
                {
                  text: providersData.name,
                },
                {
                  bold: true,

                  text: "Identificador:",
                },
                {
                  text: providersData.shortName,
                },
                {
                  bold: true,

                  text: "Estado:",
                },
                {
                  text: providersData.isActiveProvider ? "Activo" : "Inactivo",
                },
              ]);
              valuesGeneral.push([
                { bold: true, text: "Contacto: " },
                {
                  text: providersData.customerBranches.contacName
                    ? providersData.customersBranches.contacName
                    : "----------------",
                },
                {
                  bold: true,

                  text: "Telefono: ",
                },
                {
                  text: providersData.customerBranches.contactInfo
                    ? customerData.customerBranches.contactInfo
                    : "--------",
                },
                {
                  bold: true,

                  text: "Correo: ",
                },
                {
                  text: providersData.customerBranches.contactInfo
                    ? customerData.customerBranches.contactInfo
                    : "-------",
                },
              ]);
              values.push([
                {
                  text: "  ",
                },
              ]);
              values.push([
                {
                  bold: true,
                  text: "INFORMACIÓN TRIBUTARIA",
                  style: "generalInfo",
                },
              ]);
              valuesTributary.push([
                {
                  bold: true,
                  text: "DUI: ",
                },
                {
                  text: providersData.dui ? customerData.dui : "-------",
                },
                {
                  bold: true,
                  text: "NRC: ",
                },
                {
                  text: providersData.nrc ? customerData.nrc : "-------",
                },
                {
                  bold: true,
                  text: "NIT: ",
                },
                { text: providersData.nit ? customerData.nit : "-------" },
                {
                  bold: true,
                  text: "GIRO: ",
                },
                {
                  text: providersData.giro ? customerData.giro : " -------",
                },
              ]);
              valuesTributary.push([
                {
                  bold: true,
                  text: "Tipo de cliente: ",
                },
                {
                  text: providersData.customerType.name,
                },
                {
                  bold: true,
                  text:
                    providersData.customerType.id == 2
                      ? "Tipo de persona natural: "
                      : "",
                  colSpan: 2,
                },
                {},
                {
                  text:
                    providersData.customerType.id == 2
                      ? providersData.customerTypeNatural.name
                      : "",
                },
                {
                  bold: true,
                  text: "Tipo de contribuyente: ",
                  colSpan: 2,
                },
                {},
                {
                  text: providersData.customerTaxerType
                    ? providersData.customerTaxerType.name
                    : "---------------",
                },
              ]);

              values.push([
                {
                  bold: true,
                  text: "SUCURSALES",
                  style: "generalInfo",
                },
              ]);
              values.push([
                {
                  text: "  ",
                },
              ]);
              for (const br of branches) {
                valuesTable.push([
                  {
                    text: br.name,
                  },
                  {
                    text: br.address1,
                  },
                  {
                    text: br.address2,
                  },
                  { text: br.city.name },
                  {
                    text: br.state.name,
                  },

                  {
                    text: br.country.name,
                  },
                ]);
              }

              const docDefinition = {
                info: {
                  title: `reporte_perfil_cliente_${providersData.name}`,
                },
                pageSize: "LETTER",
                pageOrientation: "portrait",
                pageMargins: [20, 60, 20, 40],
                header: getHeader(name, nit, nrc, null, `PERFIL DE CLIENTE`),
                footer: getFooter(),
                content: [
                  {
                    fontSize: 9,
                    layout: "noBorders",
                    table: {
                      headerRows: 1,
                      widths: ["10%", "45%", "11%", "14%", "10%", "10%"],
                      heights: -5,
                      body: [
                        [
                          {
                            text: "INFORMACIÓN GENERAL",
                            style: "tableHeader",
                            colSpan: 2,
                          },
                          {},
                          {},
                          {},
                          {},
                          {},
                        ],
                        ...valuesGeneral,
                      ],
                    },
                  },
                  values[0],

                  {
                    fontSize: 9,
                    layout: "noBorders",
                    table: {
                      headerRows: 1,
                      widths: [
                        "15%",
                        "15%",
                        "10%",
                        "9%",
                        "15%",
                        "16%",
                        "10%",
                        "10%",
                      ],
                      heights: -5,
                      body: [
                        [
                          {
                            text: "INFORMACIÓN TRIBUTARIA",
                            style: "tableHeader",
                            colSpan: 2,
                          },
                          {},
                          {},
                          {},
                          {},
                          {},
                          {},
                          {},
                        ],
                        ...valuesTributary,
                      ],
                    },
                  },
                  values[3],
                  values[2],
                  {
                    fontSize: 9,
                    layout: "noBorders",
                    table: {
                      headerRows: 1,

                      widths: ["auto", "25%", "25%", "10%", "15%", "10%"],
                      heights: -5,
                      body: [
                        [
                          {
                            text: "NOMBRE",
                            style: "tableHeader",
                          },
                          {
                            text: "DIRECCION 1",
                            style: "tableHeader",
                          },
                          {
                            text: "DIRECCIÓN 2",
                            style: "tableHeader",
                          },

                          {
                            text: "MUNICIPIO",
                            style: "tableHeader",
                          },
                          {
                            text: "DEPARTAMENTO",
                            style: "tableHeader",
                          },
                          {
                            text: "PAIS",
                            style: "tableHeader",
                          },
                        ],
                        ...valuesTable,
                      ],
                    },
                  },
                ],
                styles: {
                  tableHeader: {
                    bold: true,
                    fontSize: 9,
                  },
                  generalInfo: {
                    fontSize: 9,
                  },
                },
                defaultStyle: {
                  fontSize: 9,
                },
              };
              this.generating = false;
              pdfMake.createPdf(docDefinition).open();
            })
            .catch((err) => {
              this.errorMessage =
                "Error al generar el PDF, contacta con tu administrador";
            });
          break;
        case "excel":
          Promise.all([bussinesInfo(), providers(), branches()])
            .then((res) => {
              const [bussinesInfo, providers, branch] = res;

              const { name, nit, nrc } = bussinesInfo.data.info;
              const providersData = providers.data.customer;
              const branches = branch.data.branches;
              const values = [];
              const valuesTable = [];
              const valuesGeneral = [];
              const valuesTributary = [];

              valuesGeneral.push([
                `Nombre:`,
                providersData.name,
                `Identificador:`,
                providersData.shortName,
                `Estado:`,
                providersData.isActiveProvider ? "Activo" : "Inactivo",
              ]);
              valuesGeneral.push([
                "Contacto:",
                providersData.customerBranches.contacName
                  ? providersData.customerBranches.contacName
                  : "----------------",
                "Telefono: ",
                providersData.customerBranches.contactInfo
                  ? providersData.customerBranches.contactInfo
                  : "--------",
                "Correo: ",
                providersData.customerBranches.contactInfo
                  ? providersData.customerBranches.contactInfo
                  : "-------",
              ]);

              valuesTributary.push([
                "DUI: ",
                providersData.dui ? providersData.dui : "-------",
                "NRC: ",
                providersData.nrc ?providersData.nrc : "-------",
                "NIT: ",
                providersData.nit ? providersData.nit : "-------",
                "GIRO: ",
                providersData.giro ? providersData.giro : " -------",
              ]);
              valuesTributary.push([
                "Tipo de cliente:",
                providersData.customerType.name,
                providersData.customerType.id == 2
                  ? "Tipo de persona natural: "
                  : "",
                providersData.customerType.id == 2
                  ? providersData.customerTypeNatural.name
                  : "",
                "Tipo de contribuyente: ",
                providersData.customerTaxerType
                  ?providersData.customerTaxerType.name
                  : "---------------",
              ]);

              for (const br of branches) {
                valuesTable.push([
                  br.name,
                  br.address1,
                  br.address2,
                  br.city.name,
                  br.state.name,
                  br.country.name,
                ]);
              }

              const document = [
                [name],
                [`PERFIL DE CLIENTE`, `NIT: ${nit}`, `NRC: ${nrc}`],
                [""],
                ["INFORMACIÓN GENERAL"],
                ...valuesGeneral,
                [""],
                ["INFORMACIÓN TRIBUTARIA"],
                ...valuesTributary,
                [""],
                ["SUCURSALES"],
                [
                  "NOMBRE",
                  "DIRECCIÓN 1",
                  "DIRECCIÓN 2",
                  "CIUDAD",
                  "DEPARTAMENTO",
                  "PAIS",
                ],
                ...valuesTable,
              ];

              const sheet = XLSX.utils.aoa_to_sheet(document);
              const workbook = XLSX.utils.book_new();
              const fileName = `reporte_cliente_${providersData.shortName}`;
              XLSX.utils.book_append_sheet(workbook, sheet, fileName);
              XLSX.writeFile(workbook, `${fileName}.xlsx`);
              this.generating = false;
            })
            .catch((err) => {
              this.errorMessage =
                "Error al generar el EXCEL, contacta con tu administrador";
            });
          break;
      }
    },
       cancel() {
      this.$confirm("¿Estás seguro que deseas salir?", "Confirmación", {
        confirmButtonText: "Si, salir",
        cancelButtonText: "Cancelar",
        type: "warning",
      }).then(() => {
        this.$router.push("/providers");
      });
    },
  },
};
</script>
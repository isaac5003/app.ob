<template>
  <layout-content
    v-loading="loading"
    page-title="Reportes"
    :breadcrumb="[
      { name: 'Clientes', to: '/customers' },
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

      <div class="grid grid-cols-12 gap-4" v-if="requirementForm == 'clientes'">
        <div class="col-span-5">
          <el-form-item label="Clientes" prop="customers">
            <el-select
              v-model="reportForm.customers"
              placeholder="Seleccione el cliente"
              size="small"
              class="w-full"
              default-first-option
              filterable
              clearable
            >
              <el-option
                v-for="c in customers"
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
  name: "customerReports",
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
        customers: "",
      },
      reportFormRules: {
        reportType: selectValidation("change", true),
        dateRange: selectValidation("change", true),
        customers: selectValidation(true),
      },
      reports: [
        { name: "Listado de clientes", id: "clientes" },
        { name: "Perfil de cliente", id: "perfil" },
      ],
      requirementForm: null,
      accountingCatalog: [],
      customers: null,
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
              .get("/customers")
              .then((res) => {
                this.customers = res.data.data;
                this.requirementForm = "clientes";
              })
              .catch((err) => err.data.errorMessage);

            break;
          default:
            this.requirementForm = "";
        }
      }
    },
    generateReport(formName, { reportType, radio, customers }) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        }

        this.generating = true;
        switch (reportType) {
          case "clientes":
            this.reportCustomers(radio);
            break;
          case "perfil":
            this.reportCustomer(customers, radio);
            break;
        }
      });
    },
    reportCustomers(fileType) {
      const report = () => this.$axios.get("/customers/report/general");

      switch (fileType) {
        case "pdf":
          Promise.all([report()]).then((res) => {
            const [report] = res;
            const customersData = report.data.customers;
            const { name, nrc, nit } = report.data.company;
            const nameReport = report.data.name;
            const values = [];
            const emptyRow = [{}, {}, {}, {}, {}];

            for (const c of customersData) {
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
                  text: c.isActiveCustomer ? "Activo" : "Inactivo",
                },
              ]);
            }
            const docDefinition = {
              pageSize: "LETTER",
              pageOrientation: "portrait",
              pageMargins: [20, 60, 20, 40],
              header: getHeader(name, nit, nrc, null, nameReport),
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
            pdfMake.createPdf(docDefinition).open();
          });
          break;
        case "excel":
          Promise.all([report()]).then((res) => {
            const [report] = res;
            const { name, nit, nrc } = report.data.company;
            const nameReport = report.data.name;
            const customersData = report.data.customers;
            const values = [];
            for (const c of customersData) {
              values.push([
                c.name,
                c.customerType.name,
                c.nit,
                c.nrc,
                c.isActiveCustomer ? "Activo" : "Inactivo",
              ]);
            }
            const document = [
              [name],
              [nameReport, `NIT: ${nit}`, `NRC: ${nrc}`],
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
    reportCustomer(customerId, fileType) {
      const report = () => this.$axios.get(`/customers/report/${customerId}`);
      switch (fileType) {
        case "pdf":
          Promise.all([report()])
            .then((res) => {
              const [report] = res;
              const customerData = report.data.customer;
              const branches = report.data.customer.customerBranches;
              const { name, nrc, nit } = report.data.company;
              const nameReport = report.data.name;
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
                  text: customerData.name,
                },
                {
                  bold: true,

                  text: "Identificador:",
                },
                {
                  text: customerData.shortName,
                },
                {
                  bold: true,

                  text: "Estado:",
                },
                {
                  text: customerData.isActiveCustomer ? "Activo" : "Inactivo",
                },
              ]);

              valuesGeneral.push([
                { bold: true, text: "Contacto: " },
                {
                  text: customerData.customerBranches[0].contactName
                    ? customerData.customerBranches[0].contactName
                    : "--------",
                },
                {
                  bold: true,

                  text: "Telefono: ",
                },
                {
                  text: customerData.constactPhone
                    ? customerData.constactPhone
                    : "--------",
                },
                {
                  bold: true,

                  text: "Correo: ",
                },
                {
                  text: customerData.contactEmail
                    ? customerData.contactEmail
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
                  text: customerData.dui ? customerData.dui : "-------",
                },
                {
                  bold: true,
                  text: "NRC: ",
                },
                {
                  text: customerData.nrc ? customerData.nrc : "-------",
                },
                {
                  bold: true,
                  text: "NIT: ",
                },
                { text: customerData.nit ? customerData.nit : "-------" },
                {},
                {},
              ]);
              valuesTributary.push([{}, {}, {}, {}, {}, {}, {}, {}]);
              valuesTributary.push([
                {
                  bold: true,
                  text: "GIRO: ",
                },
                {
                  text: customerData.giro ? customerData.giro : " -------",
                  colSpan: 6,
                },
                {},
                {},
                {},
                {},
                {},
                {},
              ]);
              valuesTributary.push([{}, {}, {}, {}, {}, {}, {}, {}]);
              valuesTributary.push([
                {
                  bold: true,
                  text: "Tipo de cliente: ",
                },
                {
                  text: customerData.customerType.name,
                },
                {
                  bold: true,
                  text:
                    customerData.customerType.id == 2
                      ? "Tipo de persona natural: "
                      : "",
                  colSpan: 2,
                },
                {},
                {
                  text:
                    customerData.customerType.id == 2
                      ? customerData.customerTypeNatural.name
                      : "",
                },
                {
                  bold: true,
                  text: "Tipo de contribuyente: ",
                  colSpan: 2,
                },
                {},
                {
                  text: customerData.customerTaxerType
                    ? customerData.customerTaxerType.name
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
                  title: `reporte_perfil_cliente_${customerData.name}`,
                },
                pageSize: "LETTER",
                pageOrientation: "portrait",
                pageMargins: [20, 60, 20, 40],
                header: getHeader(name, nit, nrc, null, nameReport),
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
              console.error(err);
              this.errorMessage =
                "Error al generar el PDF, contacta con tu administrador";
            });

          break;
        case "excel":
          Promise.all([report()])
            .then((res) => {
              const [report] = res;
              const customerData = report.data.customer;
              const branches = report.data.customer.customerBranches;
              const { name, nrc, nit } = report.data.company;
              const nameReport = report.data.name;
              const values = [];
              const valuesTable = [];
              const valuesGeneral = [];
              const valuesTributary = [];

              valuesGeneral.push([
                `Nombre:`,
                customerData.name,
                `Identificador:`,
                customerData.shortName,
                `Estado:`,
                customerData.isActiveCustomer ? "Activo" : "Inactivo",
              ]);
              valuesGeneral.push([
                "Contacto:",
                customerData.customerBranches.contacName
                  ? customerData.customerBranches.contacName
                  : "----------------",
                "Telefono: ",
                customerData.customerBranches.contactInfo
                  ? customerData.customerBranches.contactInfo
                  : "--------",
                "Correo: ",
                customerData.customerBranches.contactInfo
                  ? customerData.customerBranches.contactInfo
                  : "-------",
              ]);

              valuesTributary.push([
                "DUI: ",
                customerData.dui ? customerData.dui : "-------",
                "NRC: ",
                customerData.nrc ? customerData.nrc : "-------",
                "NIT: ",
                customerData.nit ? customerData.nit : "-------",
                "GIRO: ",
                customerData.giro ? customerData.giro : " -------",
              ]);
              valuesTributary.push([
                "Tipo de cliente:",
                customerData.customerType.name,
                customerData.customerType.id == 2
                  ? "Tipo de persona natural: "
                  : "",
                customerData.customerType.id == 2
                  ? customerData.customerTypeNatural.name
                  : "",
                "Tipo de contribuyente: ",
                customerData.customerTaxerType
                  ? customerData.customerTaxerType.name
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
                [nameReport, `NIT: ${nit}`, `NRC: ${nrc}`],
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
              const fileName = `reporte_cliente_${customerData.shortName}`;
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
        this.$router.push("/customers");
      });
    },
  },
};
</script>

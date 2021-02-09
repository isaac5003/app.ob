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
                this.customers = res.data.customers;
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
      const customers = () => this.$axios.get("/customers");
      const bussinesInfo = () => this.$axios.get("/business/info");
      switch (fileType) {
        case "pdf":
          Promise.all([customers(), bussinesInfo()]).then((res) => {
            const [customers, bussinesInfo] = res;
            const customersData = customers.data.customers;
            const { name, nit, nrc } = bussinesInfo.data.info;
            const values = [];
            const emptyRow = [{}, {}, {}, {}, {}];
            console.log(customersData);

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
              header: getHeader(name, nit, nrc, null, "REPORTE CLIENTES"),
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
          Promise.all([customers(), bussinesInfo()]).then((res) => {
            const [customers, bussinesInfo] = res;
            const { name, nit, nrc } = bussinesInfo.data.info;
            const customersData = customers.data.customers;
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
    reportCustomer(customerId, fileType) {
      const customer = () => this.$axios.get(`/customers/${customerId}`);
      const branches = () =>
        this.$axios.get(`/customers/${customerId}/branches`);
      const bussinesInfo = () => this.$axios.get("/business/info");
      switch (fileType) {
        case "pdf":
          Promise.all([bussinesInfo(), customer(), branches()]).then((res) => {
            const [bussinesInfo, customer, branch] = res;

            const { name, nit, nrc } = bussinesInfo.data.info;
            const customerData = customer.data.customer;
            const branches = branch.data.branches;
            const values = [];
            const valuesTable = [];
            values.push([
              {
                bold: true,
                text: "INFORMACIÓN GENERAL",
                style: "generalInfo",
              },
            ]);
            values.push([
              {
                text: [
                  { bold: true, style: "generalInfo", text: "Nombre: " },
                  {
                    text: customerData.name,
                  },
                ],
              },
            ]);
            values.push([
              {
                text: [
                  { bold: true, style: "generalInfo", text: "Identificador: " },
                  {
                    text: customerData.shortName,
                  },
                ],
              },
            ]);
            values.push([
              {
                text: [
                  { bold: true, style: "generalInfo", text: "Contacto: " },
                  {
                    text: customerData.customerBranches.contacName
                      ? customerData.customerBranches.contacName
                      : "----------------",
                  },
                ],
              },
            ]);
            values.push([
              {
                text: [
                  { bold: true, style: "generalInfo", text: "Telefono: " },
                  {
                    text: customerData.customerBranches.contactInfo,
                  },
                ],
              },
            ]);
            values.push([
              {
                text: [
                  { bold: true, style: "generalInfo", text: "Correo: " },
                  {
                    text: customerData.customerBranches.contactInfo,
                  },
                ],
              },
            ]);
            values.push([
              {
                style: "generalInfo",
                text: [
                  {
                    bold: true,
                    text: "Estado: ",
                  },
                  {
                    text: customerData.isActiveCustomer
                      ? "Activo        "
                      : "Inactivo      ",
                  },
                ],
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
            values.push([
              {
                text: [
                  {
                    bold: true,
                    text: "Tipo de cliente: ",
                  },
                  {
                    text: customerData.customerType.name,
                  },
                ],
              },
            ]);

            values.push([
              {
                style: "generalInfo",
                text: [
                  {
                    bold: true,
                    text: "NRC: ",
                  },
                  {
                    text: customerData.nrc ? customerData.nrc : "-------",
                  },
                ],
              },
            ]);
            values.push([
              {
                text: [
                  {
                    bold: true,
                    text: "NIT: ",
                  },
                  { text: customerData.nit ? customerData.nit : "-------" },
                ],
              },
            ]);
            values.push([
              {
                text: [
                  {
                    bold: true,
                    text: "GIRO: ",
                  },
                  {
                    text: customerData.giro ? customerData.giro : " -------",
                  },
                ],
              },
            ]);
            values.push([
              {
                text: [
                  {
                    bold: true,
                    text: "Tipo de persona natural: ",
                  },
                  {
                    text:
                      customerData.customerType.id == 2
                        ? customerData.customerTypeNatural.name
                        : "",
                  },
                ],
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
                text: "SUCURSALES",
                style: "generalInfo",
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
              header: getHeader(name, nit, nrc, null, `PERFIL DE CLIENTE`),
              footer: getFooter(),
              content: [
                ...values,
                {
                  fontSize: 10,
                  layout: "noBorders",
                  table: {
                    headerRows: 1,

                    widths: ["30%", "20%", "15%", "10%", "15%", "10%"],
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
          });
          break;
        case "excel":
          Promise.all([bussinesInfo(), customer(), branches()]).then((res) => {
            const [bussinesInfo, customer, branch] = res;

            const { name, nit, nrc } = bussinesInfo.data.info;
            const customerData = customer.data.customer;
            const branches = branch.data.branches;
            const values = [];
            const valuesTable = [];
            values.push(["  "]);
            values.push([
              "Nombre:",
              customerData.name,
              `(${customerData.shortName})`,
            ]);
            values.push(["  "]);
            values.push(["Información General"]);
            values.push([
              "Estado: ",
              customerData.isActiveCustomer
                ? "Activo        "
                : "Inactivo      ",
              "Tipo de cliente: ",
              customerData.customerType.name,
            ]);
            values.push(["  "]);
            values.push(["Información Tributaria"]);
            values.push([
              "NRC: ",
              customerData.nrc ? customerData.nrc : "-------",
              "     NIT: ",
              customerData.nit ? customerData.nit : "-------",
              "     GIRO: ",
              customerData.giro ? customerData.giro : " -------",
            ]);

            values.push(["  "]);

            values.push(["SUCURSALES"]);
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
              [
                `REPORTE DEL PERFIL DE ${customerData.name}`,
                `NIT: ${nit}`,
                `NRC: ${nrc}`,
              ],
              [""],
              ...values,

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
        this.$router.push("/entries");
      });
    },
  },
};
</script>

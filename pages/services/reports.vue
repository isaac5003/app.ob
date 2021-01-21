<template>
  <layout-content
    page-title="Reportes"
    :breadcrumb="[
      { name: 'Servicios', to: '/services' },
      { name: 'Reportes', to: null },
    ]"
  >
    <el-form
      :model="reportForm"
      :rules="reportFormRules"
      ref="reportForm"
      @submit.native.prevent="generateReport('reportForm', reportForm)"
      status-icon
    >
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-3">
          <el-form-item label="Seleccione el reporte" prop="reportType">
            <el-select
              v-model="reportForm.reportType"
              placeholder="Selecione reporte"
              size="small"
              class="w-full"
              default-first-option
              clearable
              filterable
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
          <el-form-item prop="radio" label="Tipo de reporte">
            <el-radio-group
              class="w-full"
              v-model="reportForm.radio"
              :disabled="reportForm.reportType ? false : true"
            >
              <el-radio border label="pdf" size="small">PDF</el-radio>
              <el-radio border label="excel" size="small">EXCEL</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>
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
          <el-button class="w-full" size="small">Cancelar</el-button>
        </div>
      </div>
    </el-form>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
import {
  getIcon,
  hasModule,
  selectValidation,
  getHeader,
  getFooter,
} from "../../tools";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import XLSX from "xlsx";

export default {
  name: "CustomerSettings",
  components: { LayoutContent, Notification },
  fetch() {},
  fetchOnServer: false,
  data() {
    return {
      generating: false,
      reports: [
        {
          id: "servicios",
          name: "Reporte servicios",
        },
      ],
      reportForm: {
        reportType: "",
        radio: "pdf",
      },
      reportFormRules: {
        reportType: selectValidation("change", true),
      },
    };
  },
  methods: {
    generateReport(formName, { reportType, radio }) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        }
        this.generating = true;
        switch (reportType) {
          case "servicios":
            this.generateServiceReport(radio);
            break;
        }
      });
    },

    generateServiceReport(fileType) {
      const service = () => this.$axios.get("/services/report/general");
      switch (fileType) {
        case "pdf":
          Promise.all([service()]).then((res) => {
            const [service] = res;
            const { company, services } = service.data;
            const values = services.map((s) => {
              return [
                { bold: false, text: s.index },
                { bold: false, text: s.name },
                { bold: false, text: s.description },
                {
                  bold: false,
                  text: this.$options.filters.formatMoney(s.cost),
                },
                { bold: false, text: s.sellingType.name, alignment: "center" },
              ];
            });

            const docDefinition = {
              pageSize: "LETTER",
              pageOrientation: "portrait",
              pageMargins: [20, 60, 20, 40],
              header: getHeader(
                company.name,
                company.nit,
                company.nrc,
                null,
                "REPORTE GENERAL DE SERVICIOS"
              ),
              footer: getFooter(),
              content: [
                {
                  fontSize: 9,
                  layout: "noBorders",
                  table: {
                    headerRows: 1,
                    widths: ["3%", "40%", "40%", "8.5%", "8.5%"],
                    heights: -5,
                    body: [
                      [
                        {
                          text: "#",
                          style: "tableHeader",
                        },
                        {
                          text: "Nombre",
                          style: "tableHeader",
                        },
                        {
                          text: "Descripción",
                          style: "tableHeader",
                        },
                        {
                          text: "Costo",
                          style: "tableHeader",
                        },
                        {
                          text: "Tipo de \nventa",
                          style: "tableHeader",
                          alignment: "center",
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
          Promise.all([service()]).then((res) => {
            const [service] = res;
            const { company, services } = service.data;

            const data = services.map((s) => {
              return [
                s.index,
                s.name,
                s.description,
                this.$options.filters.formatMoney(s.cost),
                s.sellingType.name,
              ];
            });

            const document = [
              [company.name],
              [
                "Reporte de servicios",
                "",
                "",
                `NIT: ${company.nit}`,
                `NRC: ${company.nrc}`,
              ],
              [""],
              ["#", "Nombre", "Descripción", "Costo", "Tipo de venta"],
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
  },
  computed: {},
};
</script>

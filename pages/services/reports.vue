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
              @change="showRequeriments(reportForm.reportType)"
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
      <div class="grid grid-cols-12 gap-4" v-if="requirementForm == 'seller'">
        <div class="col-span-3">
          <el-form-item label="Seleccione el tipo de venta">
            <el-select
              v-model="reportForm.sellingType"
              placeholder="Selecione reporte"
              size="small"
              class="w-full"
              default-first-option
              clearable
              filterable
            >
              <el-option
                v-for="sellingType in sellingTypes"
                :key="sellingType.id"
                :label="sellingType.name"
                :value="sellingType.id"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-4" v-if="requirementForm == 'status'">
        <div class="col-span-3">
          <el-form-item label="Seleccione el reporte de estado">
            <el-select
              v-model="reportForm.status"
              placeholder="Selecione reporte"
              size="small"
              class="w-full"
              default-first-option
              clearable
              filterable
            >
              <el-option
                v-for="active in status"
                :key="active.id"
                :label="active.name"
                :value="active.id"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4" v-if="requirementForm == 'price'">
        <div class="col-span-2">
          <el-form-item label="Desde" prop="initialCost">
            <el-input-number
              ref="cost"
              type="number"
              :min="0.01"
              :step="0.01"
              v-model="reportForm.initialCost"
              size="small"
              autocomplete="off"
              @change="setStorage(reportForm)"
              style="width: 101%"
            />
          </el-form-item>
        </div>
        <div class="col-span-2">
          <el-form-item label="hasta" prop="finalCost">
            <el-input-number
              ref="cost"
              type="number"
              :min="0.01"
              :step="0.01"
              v-model="reportForm.finalCost"
              size="small"
              autocomplete="off"
              @change="setStorage(reportForm)"
              style="width: 101%"
            />
          </el-form-item>
        </div>
      </div>

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
        <el-button size="small" @click="$router.push('/services')"
          >Cancelar</el-button
        >
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
  checkBeforeLeave,
  selectValidation,
  getHeader,
  getFooter,
  inputValidation,
} from "../../tools";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import XLSX from "xlsx";

const storagekey = "report";
export default {
  name: "CustomerSettings",
  components: { LayoutContent, Notification },
  fetchOnServer: false,
  beforeRouteLeave(to, from, next) {
    checkBeforeLeave(this, storagekey, next);
  },
  data() {
    return {
      generating: false,
      requirementForm: "",
      sellingTypes: [],

      status: [
        {
          id: 1,
          name: "Activo",
        },
        { id: 2, name: "Inactivo" },
      ],
      reports: [
        {
          id: "services",
          name: "Reporte servicios",
        },
        {
          id: "seller",
          name: "Reporte por tipo de venta",
        },
        {
          id: "status",
          name: "Reporte por tipo de estados",
        },
        {
          id: "price",
          name: "Reporte por precios",
        },
      ],
      reportForm: {
        reportType: "",
        status: "",
        initialCost: "",
        finalCost: "",
        sellingType: "",
        radio: "pdf",
      },
      reportFormRules: {
        reportType: selectValidation("change", true),
        initialCost: inputValidation(true, 0, null, "number"),
        finalCost: inputValidation(true, 0, null, "number"),
      },
    };
  },
  methods: {
    setStorage(reportForm) {
      localStorage.setItem(storagekey, JSON.stringify(reportForm));
    },
    showRequeriments(id) {
      if (!id) {
        this.requirementForm = null;
      } else {
        switch (id) {
          case "seller":
            this.requirementForm = "seller";
            this.$axios.get("/services/selling-types").then((res) => {
              this.sellingTypes = res.data.types;
            });
            break;
          case "status":
            this.requirementForm = "status";
            break;
          case "price":
            this.requirementForm = "price";
            break;
          default:
            this.requirementForm = "";
            break;
        }
      }
    },
    generateReport(formName, reportForm) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        }
        this.generating = true;
        let params = {};
        if (reportForm.sellingType) {
          params = { type: reportForm.sellingType };
        } else if (reportForm.status) {
          switch (reportForm.status) {
            case 1:
              params = { active: true };
              break;
            case 2:
              params = { active: false };
              break;
          }
        } else if (reportForm.initialCost && reportForm.finalCost) {
          params = {
            fromAmount: reportForm.initialCost,
            toAmount: reportForm.finalCost,
          };
        }

        switch (reportForm.reportType) {
          case "services":
            this.generateServiceReport(reportForm.radio);
            break;
          case "seller":
          case "status":
          case "price":
            this.generateEspecialService(params, reportForm.radio);
            break;
        }
      });
    },
    generateEspecialService(params, fileType) {
      const report = () => this.$axios.get("/services/report/general");
      switch (fileType) {
        case "pdf":
          Promise.all([report()]).then((res) => {
            const [report] = res;
            const reportData = report.data.data;
            const { name, nit, nrc } = report.data.company;
            const nameReport = report.data.name;
            this.reportForm.sellingType = "";
            this.reportForm.status = "";
            this.reportForm.initialCost = "";
            this.reportForm.finalCost = "";

            // const name = this.reports.find((r)=> this.reportForm.reportType == r.id).name
            const values = reportData.map((s) => {
              return [
                { bold: false, text: s.index },
                { bold: false, text: s.name },
                { bold: false, text: s.description },
                { bold: false, text: s.active ? "Activo" : "Inactivo" },
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
              header: getHeader(name, nit, nrc, null, nameReport.toUpperCase()),
              footer: getFooter(),
              content: [
                {
                  fontSize: 9,
                  layout: "noBorders",
                  table: {
                    headerRows: 1,
                    widths: ["3%", "36%", "36%", "8.5%", "8.5%", "8.5%"],
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
                          text: "Estado",
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
          Promise.all([report]).then((res) => {
            const [report] = res;
            const reportData = report.data.data;
            const { name, nit, nrc } = report.data.company;
            this.reportForm.sellingType = "";
            this.reportForm.status = "";
            this.reportForm.initialCost = "";
            this.reportForm.finalCost = "";
            //  const name = this.reports.find((r)=> this.reportForm.reportType == r.id).name
            const data = reportData.map((s) => {
              return [
                s.index,
                s.name,
                s.description,
                s.active ? "Activo" : "Inactivo",
                this.$options.filters.formatMoney(s.cost),
                s.sellingType.name,
              ];
            });

            const document = [
              [name],
              [name, "", "", `NIT: ${nit}`, `NRC: ${nrc}`],
              [""],
              [
                "#",
                "Nombre",
                "Descripción",
                "Estado",
                "Costo",
                "Tipo de venta",
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
    generateServiceReport(fileType) {
      const report = () => this.$axios.get("/services/report/general");
      switch (fileType) {
        case "pdf":
          Promise.all([report()]).then((res) => {
            const [report] = res;
            const { company, report } = report.data.data;
            const nameReport = report.data.name;
            const values = report.map((s) => {
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
                nameReport
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
          Promise.all([report()]).then((res) => {
            const [report] = res;
            const { company, report } = report.data.data;

            const data = report.map((s) => {
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
};
</script>

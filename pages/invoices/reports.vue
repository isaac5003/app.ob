<template>
  <layout-content
    v-loading="loading"
    page-title="Reportes"
    :breadcrumb="[
      { name: 'Ventas', to: '/invoices' },
      { name: 'Reportes', to: null },
    ]"
  >
    <div class="flex flex-col space-y-2">
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
    </div>
    <div class="flex flex-col">
      <el-form
        label-position="top"
        :model="filterForm"
        :rules="rulesInputData"
        status-icon
        ref="filterForm"
        @submit.native.prevent="generateReport('filterForm', filterForm)"
      >
        <div class="grid grid-cols-12 gap-4">
          <div class="col-start-1 col-span-3">
            <el-form-item prop="name">
              <span slot="label">Seleccione el reporte</span>
              <el-select
                filterable
                clearable
                v-model="filterForm.reportType"
                placeholder="Seleccione el reporte"
                size="small"
                class="w-full"
                default-first-option
                @change="showRequirements(filterForm.reportType)"
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
                v-model="filterForm.radioType"
                :disabled="filterForm.reportType ? false : true"
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
        <div class="flex flex-col" v-if="requirementForm == 'detalleReportes'">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4">
              <el-form-item label="Rango de fechas:" prop="dateRange">
                <el-date-picker
                  v-model="filterForm.dateRange"
                  style="width: 100%"
                  size="small"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="Fecha inicial"
                  end-placeholder="Fecha final"
                  format="dd/MM/yyyy"
                >
                </el-date-picker>
              </el-form-item>
            </div>

            <div class="col-span-4">
              <el-form-item label="Cliente:">
                <el-select
                  v-model="filterForm.customer"
                  size="small"
                  class="w-full"
                  clearable
                  filterable
                  default-first-option
                  placeholder="Todos los clientes:"
                >
                  <el-option label="Todos los clientes" value="" />
                  <el-option-group key="ACTIVOS" label="ACTIVOS">
                    <el-option
                      v-for="item in activeCustomers"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                      <div
                        class="
                          flex flex-row
                          justify-between
                          items-end
                          py-1
                          leading-normal
                        "
                      >
                        <div class="flex flex-col">
                          <span class="text-xs text-gray-500">{{
                            item.shortName
                          }}</span>
                          <span>{{ item.name }}</span>
                        </div>
                        <span class="text-xs text-gray-500">{{
                          item.nrc
                        }}</span>
                      </div>
                    </el-option>
                  </el-option-group>
                  <el-option-group key="INACTIVOS" label="INACTIVOS">
                    <el-option
                      v-for="item in inactiveCustomers"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                      <div
                        class="
                          flex flex-row
                          justify-between
                          items-end
                          py-1
                          leading-normal
                        "
                      >
                        <div class="flex flex-col">
                          <span class="text-xs text-gray-500">{{
                            item.shortName
                          }}</span>
                          <span>{{ item.name }}</span>
                        </div>
                        <span class="text-xs text-gray-500">{{
                          item.nrc
                        }}</span>
                      </div>
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
            </div>

            <div class="col-span-2">
              <el-form-item label="Tipo fact:">
                <el-select
                  v-model="filterForm.documentType"
                  size="small"
                  clearable
                  placeholder="Todos los tipos:"
                  class="w-full"
                >
                  <el-option label="Todos los tipos" value="" />
                  <el-option
                    v-for="item in documentTypes"
                    :key="item.id"
                    :label="`${item.code} - ${item.name}`"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>

            <div class="col-span-2">
              <el-form-item label="Estado:">
                <el-select
                  v-model="filterForm.status"
                  size="small"
                  clearable
                  placeholder="Todos los estados:"
                  class="w-full"
                >
                  <el-option label="Todos los estados" value="" />
                  <el-option
                    style="width: 103%"
                    v-for="item in statuses"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <!-- div vendedor, zona servicio-->
          <div class="grid grid-cols-12 gap-4">
            <template>
              <div class="col-span-3">
                <el-form-item label="Vendedor:">
                  <el-select
                    v-model="filterForm.seller"
                    size="small"
                    clearable
                    filterable
                    default-first-option
                    placeholder="Todos los vendedores:"
                    class="w-full"
                  >
                    <el-option-group key="ACTIVOS" label="ACTIVOS">
                      <el-option label="Todos los vendedores" value="" />
                      <el-option
                        v-for="item in activeSellers"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-option-group>
                    <el-option-group key="INACTIVOS" label="INACTIVOS">
                      <el-option
                        v-for="item in inactiveSellers"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-option-group>
                  </el-select>
                </el-form-item>
              </div>
            </template>
            <template>
              <div class="col-span-3">
                <el-form-item label="Zona:">
                  <el-select
                    v-model="filterForm.zone"
                    size="small"
                    clearable
                    filterable
                    default-first-option
                    placeholder="Todos las Zonas"
                    class="w-full"
                  >
                    <el-option-group key="ACTIVAS" label="ACTIVAS">
                      <el-option label="Todas las zonas" value="" />
                      <el-option
                        v-for="item in activeZones"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-option-group>
                    <el-option-group key="INACTIVAS" label="INACTIVAS">
                      <el-option
                        v-for="item in inactiveZones"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-option-group>
                  </el-select>
                </el-form-item>
              </div>
            </template>
            <template>
              <div class="col-span-3">
                <el-form-item label="Servicios:">
                  <el-select
                    v-model="filterForm.service"
                    size="small"
                    clearable
                    default-first-option
                    placeholder="Todos los servicios"
                    class="w-full"
                  >
                    <el-option-group key="ACTIVOS" label="ACTIVOS">
                      <el-option label="Todos los servicios" value="" />
                      <el-option
                        v-for="item in activeServices"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-option-group>
                    <el-option-group key="INACTIVOS" label="INACTIVOS">
                      <el-option
                        v-for="item in inactiveServices"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-option-group>
                  </el-select>
                </el-form-item>
              </div>
            </template>
          </div>
        </div>
        <div class="flex flex-col" v-if="requirementForm == 'listadoVentas'">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4">
              <el-form-item label="Rango de fechas:" prop="dateRange">
                <el-date-picker
                  v-model="filterForm.dateRange"
                  style="width: 100%"
                  size="small"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="Fecha inicial"
                  end-placeholder="Fecha final"
                  format="dd/MM/yyyy"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
              </el-form-item>
            </div>
            <template>
              <div class="col-span-4">
                <el-form-item label="Cliente:" prop="customer">
                  <el-select
                    v-model="filterForm.customer"
                    size="small"
                    class="w-full"
                    clearable
                    filterable
                    default-first-option
                    placeholder="Todos los clientes:"
                  >
                    <el-option label="Todos los clientes" value="" />
                    <el-option-group key="ACTIVOS" label="ACTIVOS">
                      <el-option
                        v-for="item in activeCustomers"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                        <div
                          class="
                            flex flex-row
                            justify-between
                            items-end
                            py-1
                            leading-normal
                          "
                        >
                          <div class="flex flex-col">
                            <span class="text-xs text-gray-500">{{
                              item.shortName
                            }}</span>
                            <span>{{ item.name }}</span>
                          </div>
                          <span class="text-xs text-gray-500">{{
                            item.nrc
                          }}</span>
                        </div>
                      </el-option>
                    </el-option-group>
                    <el-option-group key="INACTIVOS" label="INACTIVOS">
                      <el-option
                        v-for="item in inactiveCustomers"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                        <div
                          class="
                            flex flex-row
                            justify-between
                            items-end
                            py-1
                            leading-normal
                          "
                        >
                          <div class="flex flex-col">
                            <span class="text-xs text-gray-500">{{
                              item.shortName
                            }}</span>
                            <span>{{ item.name }}</span>
                          </div>
                          <span class="text-xs text-gray-500">{{
                            item.nrc
                          }}</span>
                        </div>
                      </el-option>
                    </el-option-group>
                  </el-select>
                </el-form-item>
              </div>
            </template>
            <template>
              <div class="col-span-2">
                <el-form-item label="Tipo fact:" prop="documentType">
                  <el-select
                    v-model="filterForm.documentType"
                    size="small"
                    clearable
                    placeholder="Todos los tipos:"
                    class="w-full"
                  >
                    <el-option label="Todos los tipos" value="" />
                    <el-option
                      v-for="item in documentTypes"
                      :key="item.id"
                      :label="`${item.code} - ${item.name}`"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </template>
          </div>
        </div>
        <div class="flex flex-row justify-end">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-download"
            :disabled="filterForm.reportType ? false : true"
            :loading="generating"
            native-type="submit"
            >Descargar
          </el-button>
          <el-button size="small" @click="$router.push('/invoices')"
            >Cancelar</el-button
          >
        </div>
      </el-form>
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
import {
  inputValidation,
  selectValidation,
  getHeader,
  getFooter,
  fixDate,
} from "../../tools";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import XLSX from "xlsx";
export default {
  name: "InvoicesReport",
  components: {
    LayoutContent,
    Notification,
  },
  fetch() {
    const documentTypes = () => this.$axios.get("/invoices/document-types");
    const customers = () => this.$axios.get("/customers");
    const sellers = () => this.$axios.get("/invoices/sellers");
    const zones = () => this.$axios.get("/invoices/zones");
    const services = () => this.$axios.get("/services");
    const invoices = () => this.$axios.get("/invoices", { params: this.page });
    const statuses = () => this.$axios.get("/invoices/status");

    Promise.all([
      documentTypes(),
      customers(),
      sellers(),
      zones(),
      services(),
      invoices(),
      statuses(),
    ])
      .then((res) => {
        const [
          documentTypes,
          customers,
          sellers,
          zones,
          services,
          invoices,
          statuses,
        ] = res;
        this.documentTypes = documentTypes.data.data;
        this.customers = customers.data.data;
        this.sellers = sellers.data.data;
        this.zones = zones.data.data;
        this.services = services.data.data;
        this.invoices = invoices.data;
        this.statuses = statuses.data.data;
        this.loading = false;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message
          ? err.response.data.message
          : "Comunicate con el administrador del sistema.";
      });
  },
  fetchOnServer: false,
  data() {
    return {
      requirementForm: null,
      centerDialogVisible: false,
      loading: false,
      errorMessage: "",
      generating: false,
      filterForm: {
        reportType: "",
        dateRange: "",
        customer: "",
        documentType: "",
        status: "",
        seller: "",
        zone: "",
        service: "",
        radioType: "pdf",
      },
      rulesInputData: {
        dateRange: selectValidation("blur", true),
      },
      reports: [
        {
          id: "detalleReportes",
          name: "Detalle de ventas",
        },
        {
          id: "listadoVentas",
          name: "Listado de ventas",
        },
      ],
    };
  },
  documentTypes: [],
  customers: [],
  sellers: [],
  zones: [],
  services: [],
  statuses: [],
  methods: {
    cancel() {
      this.$confirm("¿Estás seguro que deseas salir?", "Confirmación", {
        confirmButtonText: "Si, salir",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        this.$router.push("/invoices");
      });
    },
    fetchInvoices() {
      let params = this.page;
      if (this.status !== "") {
        params = {
          ...params,
          active: this.status,
        };
      }
      if (this.searchValue !== "") {
        params = {
          ...params,
          search: this.searchValue.toLowerCase(),
        };
      }

      this.$axios
        .get("/invoices", {
          params,
        })
        .then((res) => {
          this.invoices = res.data;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        });
    },
    showRequirements(id) {
      if (!id) {
        this.requirementForm = null;
      } else {
        switch (id) {
          case "detalleReportes":
            this.requirementForm = "detalleReportes";
            break;
          case "listadoVentas":
            this.requirementForm = "listadoVentas";
            break;
          default:
            this.requirementForm = "none";
            break;
        }
      }
    },
    generateReport(formName, data) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        }

        this.generating = true;
        switch (data.reportType) {
          case "detalleReportes":
            this.detailsReports(
              data.customer,
              data.dateRange,
              data.documentType,
              data.radioType,
              data.seller,
              data.service,
              data.status,
              data.zone
            );
            break;
          case "listadoVentas":
            this.sellignReports(
              data.customer,
              data.dateRange,
              data.documentType,
              data.radioType
            );
            break;
        }
      });
    },
    detailsReports(
      customer,
      dateRange,
      documentType,
      radioType,
      seller,
      service,
      status,
      zone
    ) {
      const startDate = dateRange[0];
      const endDate = dateRange[1];
      let params = { startDate, endDate };
      if (customer) {
        params = { ...params, customer };
      }
      if (documentType) {
        params = { ...params, documentType };
      }
      if (seller) {
        params = { ...params, seller };
      }
      if (service) {
        params = { ...params, service };
      }
      if (status) {
        params = { ...params, status };
      }
      if (zone) {
        params = { ...params, zone };
      }

      const report = () =>
        this.$axios.get("/invoices/report/general", {
          params,
        });
      switch (radioType) {
        case "pdf":
          Promise.all([report()]).then((res) => {
            const [report] = res;
            const { name, nit, nrc } = report.data.company;
            const general = report.data.invoices;
            const titleName = report.data.name;

            const values = [];
            const emptyRow = [{}, {}, {}, {}, {}, {}, {}, {}, {}];

            for (const r of general) {
              values.push(emptyRow);
              values.push([
                {
                  bold: true,
                  text: r.code,
                },
                {},
                {},
                {},
                {},
                {},
                {},
                {},
                {},
              ]);
              for (const d of r.documents) {
                values.push([
                  {
                    bold: false,
                    text: d.customer,
                  },

                  {
                    bold: false,
                    text: d.date,
                    alignment: "right",
                  },
                  {
                    bold: false,
                    text: d.documentNumber,
                    alignment: "right",
                  },
                  {
                    bold: false,
                    text: this.$options.filters.formatMoney(d.vGravada),
                    alignment: "right",
                  },
                  {
                    bold: false,
                    text: this.$options.filters.formatMoney(d.vNSujeta),
                    alignment: "right",
                  },
                  {
                    bold: false,
                    text: this.$options.filters.formatMoney(d.vExenta),
                    alignment: "right",
                  },
                  {
                    bold: false,
                    text: this.$options.filters.formatMoney(d.iva),
                    alignment: "right",
                  },
                  {
                    bold: false,
                    text: this.$options.filters.formatMoney(d.ivaRetenido),
                    alignment: "right",
                  },
                  {
                    bold: false,
                    text: this.$options.filters.formatMoney(d.total),
                    alignment: "right",
                  },
                ]);
              }
              values.push(emptyRow);
              values.push([
                {
                  bold: true,
                  text: r.count + ` Registros para ` + r.code,
                },
                {},
                {},
                {
                  bold: true,
                  text: this.$options.filters.formatMoney(r.vGravadaTotal),
                  alignment: "right",
                },
                {
                  bold: true,
                  text: this.$options.filters.formatMoney(r.vNSujetaTotal),
                  alignment: "right",
                },
                {
                  bold: true,
                  text: this.$options.filters.formatMoney(r.vExentaTotal),
                  alignment: "right",
                },
                {
                  bold: true,
                  text: this.$options.filters.formatMoney(r.ivaTotal),
                  alignment: "right",
                },
                {
                  bold: true,
                  text: this.$options.filters.formatMoney(r.ivaRetenidoTotal),
                  alignment: "right",
                },
                {
                  bold: true,
                  text: this.$options.filters.formatMoney(r.totalTotal),
                  alignment: "right",
                },
              ]);
            }

            const docDefinition = {
              info: {
                title: titleName,
              },
              pageSize: "LETTER",
              pageOrientation: "landscape",
              pageMargins: [20, 60, 20, 40],
              header: getHeader(
                name,
                nit,
                nrc,
                [new Date(startDate), new Date(endDate)],
                "DETALLE DE REPORTES ",
                "period"
              ),
              footer: getFooter(),
              content: [
                {
                  fontSize: 9,
                  layout: "noBorders",
                  table: {
                    headerRows: 1,
                    widths: [
                      "38%",
                      "7%",
                      "10%",
                      "9%",
                      "6%",
                      "6%",
                      "7.5%",
                      "7.5%",
                      "9%",
                    ],
                    heights: -5,
                    body: [
                      [
                        {
                          text: "CLIENTE",
                          style: "tableHeader",
                        },
                        {
                          text: "FECHA",
                          style: "tableHeader",
                        },
                        {
                          text: "DOC. N°",
                          style: "tableHeader",
                        },
                        {
                          alignment: "right",
                          text: "V. GRAV.",
                          style: "tableHeader",
                        },
                        {
                          alignment: "right",
                          text: "V. SUJ.",
                          style: "tableHeader",
                        },
                        {
                          alignment: "right",
                          text: "V. EXEN.",
                          style: "tableHeader",
                        },
                        {
                          alignment: "right",
                          text: "13% IVA",
                          style: "tableHeader",
                        },
                        {
                          alignment: "right",
                          text: "IVA RET.",
                          style: "tableHeader",
                        },
                        {
                          alignment: "right",
                          text: "V. TOTAL",
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
                text: {
                  fontSize: 8.5,
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
            const general = report.data.invoices;

            const data = [];

            for (const r of general) {
              data.push([""]);
              data.push([r.code, "", "", "", "", "", "", "", ""]);
              for (const d of r.documents) {
                data.push([
                  d.customer,

                  d.date,

                  d.documentNumber,
                  d.vGravada,
                  d.vNSujeta,
                  d.vExenta,
                  d.iva,
                  d.ivaRetenido,
                  d.total,
                ]);
              }
              data.push([""]);
              data.push([
                r.count + ` Registros para ` + r.code,

                "",
                "",
                r.vGravadaTotal,
                r.vNSujetaTotal,
                r.vExentaTotal,
                r.ivaTotal,
                r.ivaRetenidoTotal,
                r.totalTotal,
              ]);
            }
            const document = [
              [name],
              [
                `DETALLE DE REPORTES EN EL PERÍODO DEL ${startDate} AL ${endDate}`,
                "",
                "",
                "",
                "",
                "",
                "",
                `NIT: ${nit}`,
                `NRC: ${nrc}`,
              ],
              [""],
              [
                "CLIENTE",
                "FECHA",
                "DOC N°",
                "V. GRAV.",
                "V. SUJ.",
                "V. EXEN.",
                "13% IVA",
                "IVA RET.",
                "V. TOTAL",
              ],

              ...data,
            ];

            const sheet = XLSX.utils.aoa_to_sheet(document);
            const workbook = XLSX.utils.book_new();
            const fileName = `detallesdocs_${this.$dateFns.format(
              new Date(startDate),
              "yyyyMMdd"
            )}_${this.$dateFns.format(new Date(endDate), "yyyyMMdd")}`;
            XLSX.utils.book_append_sheet(workbook, sheet, fileName);
            XLSX.writeFile(workbook, `${fileName}.xlsx`);
            this.generating = false;
          });
          break;
      }
    },
    sellignReports(customer, dateRange, documentType, radioType) {
      const startDate = dateRange[0];
      const endDate = dateRange[1];
      let params = { startDate, endDate };
      if (customer) {
        params = { ...params, customer };
      }
      if (documentType) {
        params = { ...params, documentType };
      }

      const report = () =>
        this.$axios.get("/invoices/report/invoice-list", {
          params,
        });
      switch (radioType) {
        case "pdf":
          Promise.all([report()]).then((res) => {
            const [report] = res;
            const { name, nit, nrc } = report.data.company;
            const general = report.data.invoices;
            const titleName = report.data.name;

            const values = [];
            const emptyRow = [{}, {}, {}, {}, {}];

            for (const r of general) {
              values.push(emptyRow);

              values.push([
                {
                  bold: true,
                  text: r.code,
                },
                {
                  bold: false,
                  text: r.customer,
                },
                {
                  bold: false,
                  text: r.date,
                },
                {
                  bold: false,
                  text: r.documentNumber,
                },
                {
                  bold: false,
                  text: this.$options.filters.formatMoney(r.total),
                  alignment: "right",
                },
              ]);

              values.push(emptyRow);
            }

            const docDefinition = {
              info: {
                title: titleName,
              },
              pageSize: "LETTER",
              pageOrientation: "landscape",
              pageMargins: [20, 60, 20, 40],
              header: getHeader(
                name,
                nit,
                nrc,
                [new Date(startDate), new Date(endDate)],
                "DETALLE DE VENTAS ",
                "period"
              ),
              footer: getFooter(),
              content: [
                {
                  fontSize: 9,
                  layout: "noBorders",
                  table: {
                    headerRows: 1,
                    widths: ["15%", "40%", "15%", "15%", "15%"],
                    heights: -5,
                    body: [
                      [
                        {
                          text: "TIPO",
                          style: "tableHeader",
                        },
                        {
                          text: "CLIENTE",
                          style: "tableHeader",
                        },
                        {
                          text: "FECHA",
                          style: "tableHeader",
                        },
                        {
                          text: "DOC. N°",
                          style: "tableHeader",
                        },
                        {
                          alignment: "right",
                          text: "V. TOTAL",
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
                text: {
                  fontSize: 8.5,
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
            const general = report.data.invoices;

            const data = [];

            for (const r of general) {
              data.push([
                r.code,
                r.customer,
                r.date,
                r.documentNumber,
                r.total,
              ]);
            }
            const document = [
              [name],
              [
                `DETALLE DE VENTAS EN EL PERÍODO DEL ${startDate} AL ${endDate}`,
                "",
                "",
                "",
                "",
                "",
                "",
                `NIT: ${nit}`,
                `NRC: ${nrc}`,
              ],
              [""],
              ["TIPO", "CLIENTE", "FECHA", "DOC N°", "V. TOTAL"],

              ...data,
            ];

            const sheet = XLSX.utils.aoa_to_sheet(document);
            const workbook = XLSX.utils.book_new();
            const fileName = `detallesdocs_${this.$dateFns.format(
              new Date(startDate),
              "yyyyMMdd"
            )}_${this.$dateFns.format(new Date(endDate), "yyyyMMdd")}`;
            XLSX.utils.book_append_sheet(workbook, sheet, fileName);
            XLSX.writeFile(workbook, `${fileName}.xlsx`);
            this.generating = false;
          });
          break;
      }
    },
  },
  computed: {
    activeCustomers() {
      return this.customers.filter((c) => c.isActiveCustomer);
    },
    inactiveCustomers() {
      return this.customers.filter((c) => !c.isActiveCustomer);
    },
    activeSellers() {
      return this.sellers.filter((s) => s.active);
    },
    inactiveSellers() {
      return this.sellers.filter((s) => !s.active);
    },
    activeZones() {
      return this.zones.filter((z) => z.active);
    },
    inactiveZones() {
      return this.zones.filter((z) => !z.active);
    },
    activeServices() {
      return this.services.filter((s) => s.active);
    },
    inactiveServices() {
      return this.services.filter((s) => !s.active);
    },
  },
};
</script>

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
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
              </el-form-item>
            </div>
            <template>
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
                          class="flex flex-row justify-between items-end py-1 leading-normal"
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
                        v-for="item in activeCustomers"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                        <div
                          class="flex flex-row justify-between items-end py-1 leading-normal"
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
                <el-form-item label="Tipo fact:">
                  <el-select
                    v-model="filterForm.invoiceType"
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
            <template>
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
            </template>
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
                    placeholder="Todos los clientes:"
                    class="w-full"
                  >
                    <el-option-group key="ACTIVOS" label="ACTIVOS">
                      <el-option label="Todos los clientes" value="" />
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
                    <el-option-group key="ACTIVOS" label="ACTIVOS">
                      <el-option label="Tados las zonas" value="" />
                      <el-option
                        v-for="item in activeZones"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-option-group>
                    <el-option-group key="INACTIVOS" label="INACTIVOS">
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
                        v-for="item in activeService"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-option-group>
                    <el-option-group key="INACTIVOS" label="INACTIVOS">
                      <el-option
                        v-for="item in inactiveService"
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
                          class="flex flex-row justify-between items-end py-1 leading-normal"
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
                        v-for="item in activeCustomers"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                        <div
                          class="flex flex-row justify-between items-end py-1 leading-normal"
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
} from "../../tools";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import XLSX from "xlsx";
export default {
  name: "InvoicesIndex",
  components: {
    LayoutContent,
    Notification,
  },
  fetch() {
    const activeCustomers = () =>
      this.$axios.get("/customers", { params: { active: true } });
    const inactiveCustomers = () =>
      this.$axios.get("/customers", { params: { active: false } });
    const documentTypes = () => this.$axios.get("/invoices/document-types");
    const activeSellers = () =>
      this.$axios.get("/invoices/sellers", { params: { active: true } });
    const inactiveSellers = () =>
      this.$axios.get("/invoices/sellers", { params: { active: false } });
    const activeZones = () =>
      this.$axios.get("/invoices/zones", { params: { active: true } });
    const inactiveZones = () =>
      this.$axios.get("/invoices/zones", { params: { active: false } });
    const activeService = () =>
      this.$axios.get("/services", { params: { active: true } });
    const inactiveService = () =>
      this.$axios.get("/services", { params: { active: false } });

    const status = () => this.$axios.get("/invoices/status");

    Promise.all([
      activeCustomers(),
      inactiveCustomers(),
      activeSellers(),
      inactiveSellers(),
      activeZones(),
      inactiveZones(),
      activeService(),
      inactiveService(),
      documentTypes(),
      status(),
    ])
      .then((res) => {
        const [
          activeCustomers,
          inactiveCustomers,
          activeSellers,
          inactiveSellers,
          activeZones,
          inactiveZones,
          activeService,
          inactiveService,
          documentTypes,
          status,
        ] = res;
        this.activeCustomers = activeCustomers.data.customers;
        this.inactiveCustomers = inactiveCustomers.data.customers;
        this.documentTypes = documentTypes.data.documentTypes;
        this.activeSellers = activeSellers.data.sellers;
        this.inactiveSellers = inactiveSellers.data.sellers;
        this.activeZones = activeZones.data.zones;
        this.inactiveZones = inactiveZones.data.zones;
        this.activeService = activeService.data.services;
        this.inactiveService = inactiveService.data.services;
        this.statuses = status.data.statuses;
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
        invoiceType: "",
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
          name: "Detalle de reportes",
        },
        {
          id: "listadoVentas",
          name: "Listado de ventas",
        },
      ],
      page: {
        limit: 10,
        page: 1,
      },
    };
  },
  activeCustomers: [],
  inactiveCustomers: [],
  documentTypes: [],
  activeSellers: [],
  inactiveSellers: [],
  activeZones: [],
  inactiveZones: [],
  activeService: [],
  inactiveService: [],
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
    generateReport(
      formName,
      {
        customer,
        dateRange,
        documentType,
        invoiceType,
        radioType,
        reportType,
        seller,
        service,
        status,
        zone,
      }
    ) {
      console.log(radioType, reportType);
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        }

        this.generating = true;
        switch (reportType) {
          case "detalleReportes":
            this.detailsReports(
              customer,
              dateRange,
              documentType,
              invoiceType,
              radioType,
              reportType,
              seller,
              service,
              status,
              zone
            );
            break;
          case "listadoVentas":
            this.sellignReports(radioType);
            break;
        }
      });
    },
    detailsReports(
      customer,
      dateRange,
      documentType,
      invoiceType,
      radioType,
      reportType,
      seller,
      service,
      status,
      zone
    ) {
      console.log(
        dateRange,
        customer,
        invoiceType,
        status,
        seller,
        zone,
        service
      );
      const startDate = dateRange[0];
      const endDate = dateRange[1];

      const bussinesInfo = () => this.$axios.get("/business/info");
      const generales = () =>
        this.$axios.get("/invoices/report/general", {
          params: {
            startDate,
            endDate,
            customer,
            invoiceType,
            status,
            seller,
            zone,
            service,
          },
        });
      switch (radioType) {
        case "pdf":
          Promise.all([bussinesInfo(), generales()]).then((res) => {
            const [bussinesInfo, generales] = res;
            const { name, nit, nrc } = bussinesInfo.data.info;
            const general = generales.data.report;

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
                title: `detallesdocs_${this.$dateFns.format(
                  new Date(startDate),
                  "yyyyMMdd"
                )}_detallesdocs_${this.$dateFns.format(
                  new Date(endDate),
                  "yyyyMMdd"
                )}`,
              },
              pageSize: "LETTER",
              pageOrientation: "landscape",
              pageMargins: [20, 60, 20, 40],
              header: getHeader(
                name,
                nit,
                nrc,
                [new Date(startDate), new Date(endDate)],
                "DETALLE DE FACTURACIÓN ",
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
          Promise.all([bussinesInfo(), generales()]).then((res) => {
            const [bussinesInfo, generales] = res;
            const { name, nit, nrc } = bussinesInfo.data.info;
            const general = generales.data.report;

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
                `DETALLE DE FACTURACIÓN EN EL PERÍODO DEL ${startDate} AL ${endDate}`,
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
    sellignReports(radioType) {
      console.log(radioType);
    },
  },
};
</script>

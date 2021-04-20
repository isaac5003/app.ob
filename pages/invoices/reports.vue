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
        ref="reportsForm"
        @submit.native.prevent="generateReport(filterForm)"
      >
        <div class="grid grid-cols-12 gap-4">
          <div class="col-start-1 col-span-3">
            <el-form-item prop="name">
              <span slot="label">Seleccione el reporte</span>
              <el-select
                filterable
                clearable
                v-model="filterForm.report"
                placeholder="Seleccione el reporte"
                size="small"
                class="w-full"
                default-first-option
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
                :disabled="filterForm.report ? false : true"
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
        <div class="flex flex-col" v-if="filterForm.report != ''">
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
                        v-for="item in inactiveCustomers"
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
        <div class="flex flex-row justify-end">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-download"
            :disabled="filterForm.report ? false : true"
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
        this.documentTypes = documentTypes.data.documentTypes;
        this.customers = customers.data.customers;
        this.sellers = sellers.data.sellers;
        this.zones = zones.data.zones;
        this.services = services.data.services;
        this.invoices = invoices.data;
        this.statuses = statuses.data.statuses;
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
      centerDialogVisible: false,
      loading: false,
      errorMessage: "",
      generating: false,
      filterForm: {
        report: "",
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
          id: 1,
          name: "Detalle de ventas",
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
    generateReport(formData) {
      if (formData.dateRange) {
        let params = {
          startDate: formData.dateRange[0],
          endDate: formData.dateRange[1],
        };
        if (formData.customer != "") {
          params = { ...params, customer: formData.customer };
        }
        if (formData.invoiceType != "") {
          params = { ...params, documentType: formData.invoiceType };
        }
        if (formData.status != "") {
          params = { ...params, status: formData.status };
        }
        if (formData.seller != "") {
          params = { ...params, invoicesSeller: formData.seller };
        }
        if (formData.zone != "") {
          params = { ...params, invoicesZone: formData.zone };
        }
        if (formData.service != "") {
          params = { ...params, service: formData.service };
        }
        const bussinesInfo = () => this.$axios.get("/business/info");
        const generales = () =>
          this.$axios.get("/invoices/report/general", {
            params: { ...params },
            
          });

        switch (formData.radioType) {
          case "pdf":
            Promise.all([bussinesInfo(), generales()]).then((res) => {
              const [bussinesInfo, generales] = res;
              const { name, nit, nrc } = bussinesInfo.data.info;
              const general= generales.data.report;
              const values = [];
              const emptyRow = [{}, {}, {}, {}, {}, {}, {}, {}, {}];
              const f = general.filter(x => x.count > 0)
              for (const r of f) {
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
                     decoration: d.status.id == 3 ? 'lineThrough' : false
                    },

                    {
                      bold: false,
                      text: d.date,
                      alignment: "right",
                      decoration: d.status.id == 3 ? 'lineThrough' : false
                    },
                    {
                      bold: false,
                      text: d.documentNumber,
                      alignment: "left",
                     decoration: d.status.id == 3 ? 'lineThrough' : false
                    },
                    {
                      bold: false,
                      text: this.$options.filters.formatMoney(d.vGravada),
                      alignment: "right",
                       decoration: d.status.id == 3 ? 'lineThrough' : false
                    },
                    {
                      bold: false,
                      text: this.$options.filters.formatMoney(d.vNSujeta),
                      alignment: "right",
                     decoration: d.status.id == 3 ? 'lineThrough' : false
                    },
                    {
                      bold: false,
                      text: this.$options.filters.formatMoney(d.vExenta),
                      alignment: "right",
                      decoration: d.status.id == 3 ? 'lineThrough' : false
                    },
                    {
                      bold: false,
                      text: this.$options.filters.formatMoney(d.iva),
                      alignment: "right",
                      decoration: d.status.id == 3 ? 'lineThrough' : false
                    },
                    {
                      bold: false,
                      text: this.$options.filters.formatMoney(d.ivaRetenido),
                      alignment: "right",
                       decoration: d.status.id == 3 ? 'lineThrough' : false
                    },
                    {
                      bold: false,
                      text: this.$options.filters.formatMoney(d.total),
                      alignment: "right",
                       decoration: d.status.id == 3 ? 'lineThrough' : false
                    },
                  ]);
                }
                values.push(emptyRow);
                values.push([
                  {
                    bold: true,
                    text: r.count + ` Registros para ` + r.code  
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
                    alignment:"right",
                  },
                ]);
              }

              const docDefinition = {
                info: {
                  title: `detallesdocs_${this.$dateFns.format(
                    new Date(formData.dateRange[0]),
                    "yyyyMMdd"
                  )}_detallesdocs_${this.$dateFns.format(
                    new Date(formData.dateRange[1]),
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
                  [
                    new Date(formData.dateRange[0]),
                    new Date(formData.dateRange[1]),
                  ],
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
                data.push([r.code, "", "", "", "", "", "", "", "",""])
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
                    d.status.name,
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
                  `DETALLE DE FACTURACIÓN EN EL PERÍODO DEL ${formData.dateRange[0]} AL ${formData.dateRange[1]}`,
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
                new Date(formData.dateRange[0]),
                "yyyyMMdd"
              )}_${this.$dateFns.format(
                new Date(formData.dateRange[1]),
                "yyyyMMdd"
              )}`;
              XLSX.utils.book_append_sheet(workbook, sheet, fileName);
              XLSX.writeFile(workbook, `${fileName}.xlsx`);
              this.generating = false;
            });
            break;
        }
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

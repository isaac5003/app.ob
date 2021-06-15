<template>
  <layout-content
    v-loading="loading"
    page-title="Reportes"
    :breadcrumb="[
      { name: 'Cobros electrónicos', to: '/echarges' },
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
            <div class="col-span-3">
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
            <div class="col-span-3">
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
                  <el-option-group key="ACTIVOS" label="ACTIVOS">
                    <el-option label="Todos los clientes" value="" />
                    <el-option
                      v-for="item in activeCustomers"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-option-group>
                  <el-option-group key="INACTIVOS" label="INACTIVOS">
                    <el-option
                      v-for="item in inactiveCustomers"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-span-2">
              <el-form-item label="Tipo de documento:" class="col-span-2">
                <el-select
                  v-model="filterForm.documentType"
                  size="small"
                  clearable
                  placeholder="Todos los tipos:"
                  class="w-full"
                  @change="fetchInvoices"
                >
                  <el-option label="Todos los tipos" value="" />
                  <el-option
                    v-for="item in documentTypes"
                    :key="item.id"
                    :label="`${item.code} - ${item.name}`"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="col-span-2">
              <el-form-item label="Estado venta:">
                <el-select
                  v-model="filterForm.status"
                  size="small"
                  clearable
                  placeholder="Todos los estados:"
                  class="w-full"
                >
                  <el-option label="Todos los estados" value="" />
                  <el-option
                    v-for="item in statuses"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-span-2">
              <el-form-item label="Estado Cobro:">
                <el-select
                  v-model="filterForm.payment"
                  size="small"
                  clearable
                  filterable
                  default-first-option
                  placeholder="Todos los clientes:"
                  class="w-full"
                >
                  <el-option
                    v-for="item in activePayment"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>

                  <el-option
                    v-for="item in inactivePayment"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
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
          <el-button size="small" @click="$router.push('/echarges')"
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
      centerDialogVisible: false,
      loading: false,
      errorMessage: "",
      generating: false,
      filterForm: {
        report: "",
        dateRange: "",
        customer: "",
        status: "",
        payment: "",
        documentType: "",
        radioType: "pdf",
      },
      rulesInputData: {
        dateRange: selectValidation("blur", true),
      },
      reports: [
        {
          id: 1,
          name: "Listado genaral",
        },
      ],
    };
  },
};
</script>

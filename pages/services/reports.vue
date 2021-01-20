<template>
  <layout-content
    page-title="Reportes"
    :breadcrumb="[
      { name: 'Servicios', to: '/services' },
      { name: 'Reportes', to: null },
    ]"
  >
    <el-form :model="reportForm" :rules="reportFormRules" status-icon>
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
        <div class="col-span-5 col-start-5 space-x-4">
          <el-form-item prop="" label="Seleccione ">
            <el-radio-group
              class="w-full"
              v-model="reportForm.radio"
              :disabled="reportForm.reportType ? false : true"
            >
              <el-radio border size="small">PDF</el-radio>
              <el-radio border size="small">EXCEL</el-radio>
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
import { getIcon, hasModule, selectValidation } from "../../tools";

export default {
  name: "CustomerSettings",
  components: { LayoutContent, Notification },
  fetch() {},
  fetchOnServer: false,
  data() {
    return {
      reports: [
        {
          id: "servicios",
          name: "Reporte servicios",
        },
      ],
      reportForm: {
        reportType: "",
        radio: "excel",
      },
      reportFormRules: {
        reportType: selectValidation("change", true),
      },
    };
  },
  computed: {},
};
</script>

<template>
  <layout-content
    page-title="Reportes"
    :breadcrumb="[
      { name: 'IVA', to: '/taxes' },
      { name: 'Reportes', to: null },
    ]"
  >
    <el-form status-icon>
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-3">
          <el-form-item label="Seleccione el reporte" prop="reportType">
            <el-select
              v-model="value"
              placeholder="Selecione reporte"
              size="small"
              class="w-full"
              default-first-option
              clearable
              filterable
            >
              <el-option
                v-for="item in fileType"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="col-span-5">
          <el-form-item prop="radio" label="Tipo de reporte">
            <el-radio-group class="w-full">
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
      <div class="flex flex-row justify-end">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-download"
          native-type="submit"
          :loading="generating"
          >Descargar</el-button
        >
        <el-button size="small" @click="$router.push('/taxes')"
          >Cancelar</el-button
        >
      </div>
    </el-form>
  </layout-content>
</template>
<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
export default {
  name: "taxesReport",
  components: { LayoutContent, Notification },

  data() {
    return {
      value: "",
      fileType: [
        { id: "1", name: "Libro de debito fiscal" },
        { id: "2", name: "Libro de credito fiscal" },
      ],
    };
  },
};
</script>
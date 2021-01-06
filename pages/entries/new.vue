<template>
  <layout-content
    v-loading="loading"
    page-title="Nueva partida"
    :breadcrumb="[
      { name: 'Contabilidad', to: '/entries' },
      { name: 'Nueva partida', to: null },
    ]"
  >
    <div class="flex flex-col space-y-2">
      <el-form label-position="top">
        <!-- primer div tipo partida, correlativo y rango de fechas -->
        <div class="grid grid-cols-12 gap-4 relative">
          <div class="col-start-1 col-span-4">
            <el-form-item label="Tipo de patidad">
              <el-select
                v-model="value"
                size="small"
                class="w-full"
                placeholder="Select"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-start-9 col-span-2">
            <el-form-item label="N° de correlativo">
              <el-input
                v-model="input"
                :disabled="true"
                class="w-full"
                size="small"
              >
              </el-input>
            </el-form-item>
          </div>
          <div class="col-start-11 col-span-2">
            <el-form-item label="Rango de fechas:">
              <el-date-picker
                v-model="option.name"
                size="small"
                style="width: 100%"
                type="date"
              >
              </el-date-picker>
            </el-form-item>
          </div>
        </div>
        <!-- segundo div para titulo partida, opciones de partida -->
        <div class="grid grid-cols-12 gap-4 relative">
          <div class="col-start-1 col-span-8">
            <el-form-item label="Titulo de la partida">
              <el-input v-model="input" class="w-full" size="small"> </el-input>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item label="Opciones de partida">
              <el-checkbox
                v-model="checked"
                size="small"
                class="w-full"
                border="1"
                disabled="true"
                >Option</el-checkbox
              >
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item label=" ">
              <el-checkbox
                v-model="checked"
                size="small"
                class="w-full"
                border="1"
                disabled="true"
                >Option</el-checkbox
              >
            </el-form-item>
          </div>
        </div>
        <!-- boton de Agregar -->
        <div class="grid grid-cols-12 gap-4 relative">
          <div class="col-start-11 col-span-2">
            <el-button
              type="primary"
              icon="el-icon-plus"
              class="w-full"
              size="small"
              >Agregar detalle</el-button
            >
          </div>
        </div>
        <!-- Tabla -->
        <div class="mt-4">
          <el-table stripe>
            <el-table-column label="#" width="70"> </el-table-column>
            <el-table-column label="Cuenta contable" width="180">
            </el-table-column>
            <el-table-column label="Concepto" width="180"></el-table-column>
            <el-table-column label="Cargo" width="180"></el-table-column>
            <el-table-column label="Abono" width="180"></el-table-column>
            <el-table-column label="Opciones" width="180"></el-table-column>
          </el-table>
        </div>
        <!-- Guardar y Cancelar -->
        <div class="grid grid-cols-12 gap-4 relative mt-4">
          <div class="col-start-9 col-span-2">
            <el-button
              type="primary"
              icon="el-icon-check"
              class="w-full"
              size="small"
              >Guardar</el-button
            >
          </div>
          <div class="col-start-11 col-span-2">
            <el-button icon="el-icon-close" class="w-full" size="small"
              >Cancelar</el-button
            >
          </div>
        </div>
      </el-form>
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import {
  inputValidation,
  selectValidation,
  checkBeforeLeave,
  checkBeforeEnter,
} from "../../tools";
import Notification from "../../components/Notification";

const storagekey = "new-customer";

export default {
  name: "CustomerNew",
  components: { LayoutContent, Notification },
  fetch() {},
  data() {
    return {
      loading: false,
      option: {
        name: "",
      },
    };
  },
  methods: {},
  computed: {},
};
</script>

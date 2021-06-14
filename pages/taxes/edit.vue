code 
<template>
  <layout-content
    v-loading="pageloading"
    page-title="Editar registro"
    :breadcrumb="[
      { name: 'IVA', to: '/taxes' },
      { name: 'Editar registro', to: null },
    ]"
  >
    <div class="flex flex-col space-y-2">
      <el-form label-position="top" :model="ivaEditForm" ref="ivaEditForm">
        <div class="grid grid-cols-12 gap-4">
          <el-form-item
            label="Tipo de registro"
            class="col-span-3"
            prop="typeRegister"
          >
            <el-select
              v-model="ivaEditForm.typeRegister"
              class="w-full"
              clearable
              filterable
              size="small"
              :disabled="true"
            >
              <el-option
                v-for="item in filetype"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="Tipo de documento"
            class="col-span-3"
            v-if="ivaEditForm.taypeDocument != 'credifical'"
          >
            <el-select
              v-model="ivaEditForm.typeDocument"
              class="w-full"
              clearable
              filterable
              size="small"
              :disabled="true"
            >
              <el-option
                v-for="item in filetype1"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Tipo de documento" class="col-span-3" v-else>
            <el-select
              v-model="ivaEditForm.typeDocument"
              class="w-full"
              clearable
              filterable
              size="small"
            >
              <el-option
                v-for="item in filetype2"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            class="col-span-3 col-start-10"
            prop="dateRange"
            label="Fecha de ingreso del registro"
          >
            <el-date-picker
              type="month"
              format="MMMM yyyy"
              placeholder="Selecciona un mes"
              size="small"
              style="width: 100%"
            />
          </el-form-item>
        </div>
        <div class="class grid grid-cols-12 gap-4">
          <el-form-item
            label="Cliente"
            class="col-span-5"
            v-if="ivaEditForm.typeRegister != 'credifical'"
          >
            <el-select class="w-full" clearable filterable size="small">
            </el-select>
          </el-form-item>
          <el-form-item label="Proveedor" class="col-span-5" v-else>
            <el-select class="w-full" clearable filterable size="small">
            </el-select>
          </el-form-item>
          <el-form-item
            class="col-span-3"
            label="Fecha de emisión del documento"
          >
            <el-date-picker
              type="month"
              format="MMMM yyyy"
              placeholder="Selecciona un mes"
              size="small"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="N° de autorización" class="col-span-2">
            <el-input size="small" placeholder="000000" readonly> </el-input>
          </el-form-item>
          <el-form-item label="N° de correlativo" class="col-span-2">
            <el-input size="small" placeholder="000000" readonly> </el-input>
          </el-form-item>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <el-form-item label="Sumas" class="col-span-2" prop="sumas">
            <el-input-number
              v-model="ivaEditForm.sumas"
              type="number"
              :min="0.0"
              :step="0.01"
              size="small"
              autocomplete="off"
              :precision="2"
              style="width: 100%"
            >
            </el-input-number>
          </el-form-item>

          <el-form-item label="IVA" class="col-span-2" prop="iva">
            <el-input-number
              v-model="ivaEditForm.iva"
              type="number"
              :min="0.0"
              :step="0.01"
              size="small"
              autocomplete="off"
              :precision="2"
              :disabled="true"
              style="width: 100%"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item
            label="Subtotal"
            class="col-span-2"
            v-if="ivaEditForm.subTotal != 'consuFinal'"
            prop="subtotal"
          >
            <el-input-number
              v-model="ivaEditForm.subTotal"
              type="number"
              :min="0.0"
              :step="0.01"
              size="small"
              autocomplete="off"
              :precision="2"
              style="width: 100%"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item
            label="Iva retenido"
            class="col-span-2"
            v-if="ivaEditForm.typeRegister != 'credifical'"
          >
            <el-input-number
              v-model="ivaEditForm.ivaDetained"
              type="number"
              :min="0.0"
              :step="0.01"
              size="small"
              autocomplete="off"
              :precision="2"
              style="width: 100%"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="Total" class="col-span-2">
            <el-input style="width: 100%" size="small" :disabled="true">
            </el-input>
          </el-form-item>
        </div>
        <div class="flex flex-row justify-end">
          <el-button type="primary" size="small" native-type="submit"
            >Guardar
          </el-button>
          <el-button size="small" @click="$router.push('/taxes')"
            >Cancelar</el-button
          >
        </div>
      </el-form>
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import {
  checkBeforeEnter,
  checkBeforeLeave,
  inputValidation,
  selectValidation,
} from "../../tools";

const storagekey = "new-taxes";

export default {
  name: "TaxesNew",
  head: {
    titleTemplate: `%s | Nuevo registro`,
  },
  components: { LayoutContent },

  data() {
    return {
      ivaEditForm: {
        typeRegister: "",
        typeDocument: "",
        subTotal: "",
        ivaDetained: "",
      },

      filetype: [
        { name: "Débito Fiscal", id: "deviFilcal" },
        { name: "Credito fiscal", id: "credifical" },
      ],
      filetype1: [
        { name: "Credito fiscal", id: "crediFilcal" },
        { name: "Consumidor final", id: "consuiFinal" },
        { name: "Nota de debito", id: "notadevi" },
        { name: "Factura de exportación", id: "factExport" },
      ],
      filetype2: [
        { name: "Credito fiscal", id: "crediFilcal1" },
        { name: "Consumidor final", id: "consuFinal" },
        { name: "Otros", id: "others" },
      ],
    };
  },
  methods: {},
};
</script>

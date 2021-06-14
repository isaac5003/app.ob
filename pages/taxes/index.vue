<template>
  <layout-content
    page-title="Listado de IVA"
    :breadcrumb="[
      { name: 'IVA', to: '/taxes' },
      { name: 'Listado de IVA', to: null },
    ]"
  >
    <el-dialog
      title="Vista previa"
      size="mini"
      :visible.sync="showTaxePreview"
      width="900px"
      :append-to-body="true"
    >
      <div class="flex flex-col space-y-6">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-3 flex flex-col">
            <span class="text-gray-700 font-bold text-xs">Cliente</span>
            <span class="">
              {{ taxesPreview ? taxesPreview.name : "" }}
            </span>
          </div>
          <div class="col-span-2 flex flex-col">
            <span class="text-gray-700 font-bold text-xs">Fecha</span>
            <span class="">{{ taxesPreview ? taxesPreview.date : "" }} </span>
          </div>
          <div class="col-span-2 flex flex-col">
            <span class="text-gray-700 font-bold text-xs"
              >Tipo de registro</span
            >
            <span class="">
              {{ taxesPreview ? taxesPreview.registerType : "" }}</span
            >
          </div>
          <div class="col-span-2 flex flex-col">
            <span class="text-gray-700 font-bold text-xs"
              >Tipo de Documento</span
            >
            <span class="">
              {{ taxesPreview ? taxesPreview.documentType : "" }}</span
            >
          </div>
          <div class="col-span-3 flex flex-col">
            <span class="text-gray-700 font-bold text-xs"
              >N° de Autorización</span
            >
            <span class=""> {{ taxesPreview ? taxesPreview.number : "" }}</span>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-3 flex flex-col">
            <span class="text-gray-700 font-bold text-xs">Correlativo</span>
            <span class=""> 245800 </span>
          </div>
          <div class="col-span-2 flex flex-col">
            <span class="text-gray-700 font-bold text-xs">IVA</span>
            <span class="">{{ taxesPreview ? taxesPreview.iva : "" }} </span>
          </div>
          <div class="col-span-2 flex flex-col">
            <span class="text-gray-700 font-bold text-xs">Sub Total</span>
            <span class=""> $584</span>
          </div>
          <div class="col-span-2 flex flex-col">
            <span class="text-gray-700 font-bold text-xs">Otros</span>
            <span class=""> $2</span>
          </div>
          <div class="col-span-3 flex flex-col">
            <span class="text-gray-700 font-bold text-xs">Total</span>
            <span class=""> $586</span>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="showTaxePreview = false"
          >Cerrar</el-button
        >
      </span>
    </el-dialog>

    <div class="flex flex-col space-4">
      <el-form>
        <div class="grid grid-cols-12 gap-4">
          <el-form-item class="col-span-4 col-start-9">
            <el-input
              suffix-icon="el-icon-search"
              placeholder="Buscar..."
              size="small"
              v-model="taxesForm.search"
              clearable
            ></el-input>
          </el-form-item>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <el-form-item label="Rango de fechas:" class="col-span-4">
            <el-date-picker
              style="width: 100%"
              size="small"
              type="daterange"
              align="left"
              unlink-panels
              range-separator="-"
              start-placeholder="Fecha inicio"
              end-placeholder="Fecha final"
              :editable="false"
              format="dd/MM/yyyy"
              value-format="yyyy-MM-dd"
              v-model="taxesForm.date"
            />
          </el-form-item>
          <el-form-item label="Cliente:" class="col-span-3">
            <el-select
              v-model="taxesForm.customer"
              class="w-full"
              size="small"
              clearable
            >
              <el-option
                v-for="i in customers"
                :key="i.id"
                :label="i.name"
                :value="i.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Proveedores:" class="col-span-3">
            <el-select
              class="w-full"
              size="small"
              filterable
              clearable
              v-model="taxesForm.provider"
            >
              <el-option
                v-for="i in providers"
                :key="i.id"
                :label="i.name"
                :value="i.id"
            /></el-select>
          </el-form-item>
          <el-form-item label="Tipo de registro:" class="col-span-2">
            <el-select
              class="w-full"
              size="small"
              filterable
              clearable
              v-model="taxesForm.registerType"
            >
              <el-option
                v-for="i in registerTypes"
                :key="i.id"
                :label="i.name"
                :value="i.id"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <el-form-item label="Tipo de documento:" class="col-span-3">
            <el-select
              class="w-full"
              size="small"
              filterable
              clearable
              v-model="taxesForm.documentType"
              ><el-option
                v-for="i in documentTypes"
                :key="i.id"
                :label="i.name"
                :value="i.id"
            /></el-select>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-table
      stripe
      size="mini"
      ref="multipleTable"
      :data="taxesList.taxesList"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="40" />
      <el-table-column label="#" width="40" prop="id" />
      <el-table-column label="Fecha" width="110" prop="date"></el-table-column>
      <el-table-column
        label="Proveedor/cliente"
        min-width="180"
        prop="name"
      ></el-table-column>
      <el-table-column
        label="N° autorización"
        width="130"
        prop="number"
      ></el-table-column>
      <el-table-column
        label="Tipo de documento"
        width="150"
        prop="documentType"
      ></el-table-column>
      <el-table-column
        label="Tipo de registro"
        width="150"
        prop="registerType"
      ></el-table-column>
      <el-table-column label="IVA" width="50" prop="iva"></el-table-column>
      <el-table-column label width="110" align="center">
        <!-- dropdpwn selecction -->
        <template slot="header" v-if="selectionData.length">
          <el-dropdown trigger="click" szie="mini" type="primary">
            <el-button size="mini" type="primary" class="group">
              <span class="hidden group-hover:inline">
                {{ selectionData.length }} Filas</span
              >
              <i class="el-icon-more"
            /></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="font-semibold">
                <i class="el-icon-delete"></i> Eliminar
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>

        <!-- dropdown 1 -->
        <template slot-scope="scope">
          <el-dropdown trigger="click" szie="mini">
            <el-button icon="el-icon-more" size="mini" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="openPreviewEntry(scope.row)">
                <i class="el-icon-view"></i> Vista previa
              </el-dropdown-item>
              <el-dropdown-item @click.native="$router.push(`/taxes/edit`)">
                <i class="el-icon-edit-outline"></i> Editar
              </el-dropdown-item>
              <el-dropdown-item
                :divided="true"
                class="text-red-500 font-semibold"
              >
                <i class="el-icon-delete"></i> Eliminar
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
export default {
  name: "IVAIndex",
  head: {
    titleTemplate: `%s | IVA`,
  },
  components: { LayoutContent, Notification },
  data() {
    return {
      showTaxePreview: false,
      taxesPreview: {},
      selectionData: {},
      taxesForm: {
        search: "",
        date: "",
        customer: "",
        provider: "",
        registerType: "",
        documentType: "",
      },
      customers: [
        {
          id: "1",
          name: "Cliente 1",
        },
        {
          id: "2",
          name: "Cliente 2",
        },
        {
          id: "3",
          name: "Cliente 3",
        },
        {
          id: "4",
          name: "Cliente 4",
        },
        {
          id: "5",
          name: "Cliente 5",
        },
      ],
      providers: [
        {
          id: "1",
          name: "Proveedor 1",
        },
        {
          id: "2",
          name: "Proveedor 2",
        },
        {
          id: "3",
          name: "Proveedor 3",
        },
        {
          id: "4",
          name: "Proveedor 4",
        },
        {
          id: "5",
          name: "Proveedor 5",
        },
      ],
      registerTypes: [
        {
          id: "1",
          name: "Débito Fiscal",
        },
        {
          id: "2",
          name: "Cédito Fiscal",
        },
      ],
      documentTypes: [
        {
          id: "1",
          name: "Cédito Fiscal",
        },
        {
          id: "2",
          name: "Consumidor Final",
        },
        {
          id: "3",
          name: "Nota de Crédito",
        },
        {
          id: "4",
          name: "Factura de Exportación",
        },
        {
          id: "5",
          name: "Otros",
        },
      ],
      taxesList: {
        taxesList: [
          {
            id: "1",
            date: "08/04/2021",
            name: "AP TECHNOLOGY S.A de C.V",
            number: "69875105",
            documentType: "Nota de Crédito",
            registerType: "Crédito Fiscal",
            iva: "10%",
          },
          {
            id: "2",
            date: "08/04/2021",
            name: "OPTICA LA REALEZA S.A de C.V",
            number: "35698965",
            documentType: "Nota de Crédito",
            registerType: "Crédito Fiscal",
            iva: "5%",
          },
        ],
        count: 0,
      },
    };
  },
  methods: {
    openPreviewEntry(dataTable) {
      console.log(dataTable);
      this.taxesPreview = dataTable;
      this.showTaxePreview = true;
    },
    selectionChange(selectionData) {
      this.selectionData = selectionData;
    },
  },
};
</script>
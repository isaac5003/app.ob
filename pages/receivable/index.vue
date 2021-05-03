<template>
  <layout-content
    page-title="listado de cuentas por cobrar"
    :breadcrumb="[
      { name: 'Cuentas por pagar', to: '/receivable' },
      { name: 'Listado', to: null },
    ]"
  >
    <!-- dialogo -->
    <el-dialog
      title="Bitácora"
      :visible.sync="showReceivable"
      width="1000px"
      :append-to-body="true"
    >
      <div class="flex flex-col space-y-4 -mt-4">
        <div class="grid grid-cols-12 gap-4">
          <span class="col-span-3 flex flex-col">
            <span class="text-gray-700 font-bold text-xs">Cliente</span
            ><span>ORTIZ ROSALES, INES MARIA</span>
          </span>
          <span class="col-span-2 flex flex-col">
            <span class="text-gray-700 font-bold text-xs">Nº de documento</span
            ><span>16SD000F-56</span>
          </span>
          <span class="col-span-2 flex flex-col">
            <span class="text-gray-700 font-bold text-xs">Tipo</span
            ><span>Consumidor Final</span>
          </span>
          <span class="col-span-2 flex flex-col">
            <span class="text-gray-700 font-bold text-xs">Fecha</span
            ><span>05/04/2021</span>
          </span>
          <span class="col-span-2 flex flex-col">
            <span class="text-gray-700 font-bold text-xs"
              >Condicion de pago</span
            ><span>Pago 90 dias</span>
          </span>
          <span class="col-span-1 flex flex-col">
            <span class="text-gray-700 font-bold text-xs">Edad</span
            ><span>45</span>
          </span>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <span class="col-span-4">
            <h1 class="text-lg text-black">Ultimos seguimiento</h1>
          </span>
          <span class="col-span-4 col-start-7 text-black"
            >Por pagar:
            <span>
              <el-tag type="success" effect="dark" size="mini">$ 367.50</el-tag>
            </span></span
          >
          <el-button class="col-span-2 col-start-11" size="mini" type="primary"
            >Nuevo seguimiento</el-button
          >

          <!-- Probando commit -->
          <!-- Hola provando commit desde linux -->
  <!-- esto ya funciona -->
        </div>
        <div class="grid grid-cols-12 gap-4">
          <span class="col-span-4 flex flex-col">
            <span class="flex justify-between text-xs px-4 py-2 text-black">
            </span>
          </span>
          <span class="col-span-8 bg-pink-400">4</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showReceivable = false" size="small"
          >Cerrar</el-button
        >
      </span>
    </el-dialog>
    <!-- finish -->
    <div class="flex flex-col space-y-2">
      <el-form>
        <div class="grid grid-cols-12 gap-4">
          <el-form-item label="Cliente" class="col-span-3">
            <el-select class="w-full" size="small" clearable filterable>
              <el-option></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Tipo de documento" class="col-span-3">
            <el-select class="w-full" size="small" clearable filterable>
              <el-option></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Condiciones de pago" class="col-span-3">
            <el-select class="w-full" size="small" clearable filterable>
              <el-option></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="col-start-10 col-span-3 mt-3">
            <el-input
              suffix-icon="el-icon-search"
              placeholder="Buscar..."
              size="small"
              clearable
            />
          </el-form-item>
        </div>
      </el-form>
      <!-- tabla -->
      <el-table
        :data="tableData"
        stripe
        size="mini"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45" />
        <el-table-column prop="index" width="35" label=" #" />
        <el-table-column
          label="# Documento"
          prop="documento"
          width="130"
          sortable="custom"
        >
          <template> </template>
        </el-table-column>
        <el-table-column label="Tipo" prop="tipo" width="130" sortable="custom">
          <template> </template>
        </el-table-column>
        <el-table-column
          label="Fecha"
          prop="fecha"
          width="90"
          sortable="custom"
        />
        <el-table-column
          label="Cliente"
          prop="cliente"
          min-width="240"
          sortable="custom"
        />
        <el-table-column
          label="Cond. de pago"
          prop="pago"
          width="140"
          sortable="custom"
        >
          <template> </template>
        </el-table-column>
        <el-table-column
          label="Total"
          width="80"
          align="right"
          prop="total"
          sortable="custom"
        >
          <template> </template>
        </el-table-column>
        <el-table-column label width="70" align="center">
          <!-- dropdpwn selecction -->
          <template slot="header" v-if="multipleSelection.length > 0">
            <el-dropdown>
              <el-button
                trigger="click"
                icon="el-icon-more"
                type="primary"
                size="mini"
                class="transition ease-out duration-700"
              ></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <i class="el-icon-view"></i>Vista previa
                </el-dropdown-item>
                <el-dropdown-item>
                  <i class="el-icon-printer"></i>Imprimir documento
                </el-dropdown-item>
                <el-dropdown-item :divided="true">
                  <i class="el-icon-refresh-left"></i> Revertir estados
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <!-- dropdown 1 -->

          <template slot-scope="scope">
            <el-dropdown>
              <el-button trigger="click" size="mini" icon="el-icon-more">
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="openPreviewReceivable(scope.row)"
                >
                  <i class="el-icon-s-order"></i>Bitácora
                </el-dropdown-item>
                <el-dropdown-item>
                  <i class="el-icon-document-add"></i>Nuevo
                  seguimiento</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column></el-table
      >
      <!-- pagination  -->
      <div class="flex justify-end">
        <el-pagination
          :current-page.sync="page.page"
          :page-sizes="[5, 10, 15, 25, 50, 100]"
          :page-size="page.size"
          layout="total, sizes, prev, pager, next"
          :total="parseInt(receivable.count)"
          :pager-count="5"
        />
      </div>
    </div>
  </layout-content>
</template>
<script>
import LayoutContent from "../../components/layout/Content";
export default {
  components: {
    LayoutContent,
  },

  data() {
    return {
      showReceivable: false,
      receivablePreview: {},
      multipleSelection: [],
      tableData: [
        {
          index: 1,
          documento: "16SD000C-0142",
          tipo: "credito fiscal",
          fecha: "2016/05/02",
          cliente: "Gerson Aguirre OpenBox.cloud",
          pago: "Pagos en 30 dias",
          total: "$20,000",
        },
        {
          index: 2,
          documento: "16SD000C-0142",
          tipo: "Consumidor fiscal",
          fecha: "2016/05/02",
          cliente: "Radio 100.5 Restauracion Elim central",
          pago: "Pago en 45 dias",
          total: "$20,000",
        },
        {
          index: 3,
          documento: "16SD000C-0142",
          tipo: "Credito Fiscal",
          fecha: "2016/05/02",
          cliente: "GCA Telecom SV. CV",
          pago: "pagos en 43 dias",
          total: "$20,000",
        },
        {
          index: 4,
          documento: "16SD000C-0142",
          tipo: "Consumidor Final",
          fecha: "2016/05/02",
          cliente: "Impresa respuesta EL Salvador",
          pago: "pagos en 60 dias ",
          total: "$20,000",
        },
      ],
      showInvoicePreview: false,
      page: {
        limit: 10,
        page: 1,
      },
      receivable: {
        count: 0,
      },
    };
  },

  methods: {
    openPreviewReceivable(e) {
      this.receivablePreview = e;
      this.showReceivable = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>
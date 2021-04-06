<template>
  <layout-content
    page-title="Listado de IVA"
    :breadcrumb="[
      { name: 'IVA', to: '/taxes' },
      { name: 'Listado de IVA', to: null },
    ]"
  >
    <div class="flex flex-col space-y-2">
      <el-form>
        <div class="grid grid-cols-12 gap-4">
          <el-form-item class="col-span-4 col-start-9">
            <el-input
              suffix-icon="el-icon-search"
              placeholder="Buscar..."
              size="small"
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
            />
          </el-form-item>
          <el-form-item label="Cliente:" class="col-span-3">
            <el-select
              class="w-full"
              size="small"
              filterable
              clearable
            ></el-select>
          </el-form-item>
          <el-form-item label="Proveedores:" class="col-span-3">
            <el-select
              class="w-full"
              size="small"
              filterable
              clearable
            ></el-select>
          </el-form-item>
          <el-form-item label="Tipo de registro:" class="col-span-2">
            <el-select
              class="w-full"
              size="small"
              filterable
              clearable
            ></el-select>
          </el-form-item>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <el-form-item label="Tipo de documento:" class="col-span-3">
            <el-select
              class="w-full"
              size="small"
              filterable
              clearable
            ></el-select>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-table
      @sort-change="sortBy"
      stripe
      size="mini"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column label="#" width="50" />
      <el-table-column label="Fecha" width="80"></el-table-column>
      <el-table-column
        label="Proveedores/clientes"
        width="180"
      ></el-table-column>
      <el-table-column
        label="N° de  autorización"
        width="150"
      ></el-table-column>
      <el-table-column label="Tipo de documento" width="150"></el-table-column>
      <el-table-column label="Tipo de registro" width="150"></el-table-column>
      <el-table-column label="IVA" width="80"></el-table-column>
      <el-table-column label width="70" align="center">
        <!-- dropdpwn selecction -->
        <template slot="header">
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
          <el-dropdown trigger="click" szie="mini">
            <el-button icon="el-icon-more" size="mini" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="openPreviewEntry(scope.row)">
                <i class="el-icon-view"></i> Vista previa
              </el-dropdown-item>
              <el-dropdown-item
                @click.native="
                  $router.push(`/entries/edit?ref=${scope.row.id}`)
                "
              >
                <i class="el-icon-edit-outline"></i> Editar partida
              </el-dropdown-item>
              <el-dropdown-item @click.native="printEntry(scope.row)">
                <i class="el-icon-printer"></i> Imprimir partida
              </el-dropdown-item>
              <el-dropdown-item
                :divided="true"
                class="text-red-500 font-semibold"
                @click.native="deleteEntry(scope.row.id)"
              >
                <i class="el-icon-delete"></i> Eliminar partida
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!--  <div class="flex justify-end">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="fetchEntries"
        :current-page.sync="page.page"
        :page-sizes="[5, 10, 15, 25, 50, 100]"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next"
        :total="parseInt(entries.count)"
        :pager-count="5"
      />
    </div> -->
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
};
</script>
<template>
  <layout-content
    v-loading="loading"
    page-title="Partidas contables"
    :breadcrumb="[
      { name: 'Contabilidad', to: '/entries' },
      { name: 'Partidas contables', to: null },
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
      <el-dialog
        title="Vista previa"
        size="mini"
        :visible.sync="showInvoicePreview"
        width="900px"
        :append-to-body="true"
      >
        <div class="flex flex-col space-y-4">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4 flex flex-col">
              <span class="text-gray-700 font-bold text-sm w-full"
                >Tipo de partida</span
              >
              <span class="">
                {{
                  selecEntries.accountingEntryType
                    ? selecEntries.accountingEntryType.name
                    : ""
                }}
              </span>
            </div>
            <div class="col-span-4 flex flex-col">
              <span class="text-gray-700 font-bold text-sm w-full"
                >N° de correlativo</span
              >
              <span class=""
                >{{ selecEntries ? selecEntries.serie : "" }}
              </span>
            </div>
            <div class="col-span-4 flex flex-col">
              <span class="text-gray-700 font-bold text-sm w-full"
                >Fecha de partida</span
              >
              <span class="">
                {{ selecEntries ? selecEntries.rawDate : "" }}</span
              >
            </div>
          </div>
          <div class="grid grid-cols-12 gap-4 relative">
            <div class="col-span-8 flex flex-col">
              <span class="text-gray-700 font-bold text-sm w-full"
                >Titulo de la partida partida</span
              >
              <span class="">
                {{ selecEntries ? selecEntries.title : "" }}</span
              >
            </div>
            <div class="col-span-4 col-start-9" v-if="selecEntries !== null">
              <el-form>
                <div class="inline-block">
                  <el-form-item label="Opciones de partidad:">
                    <el-checkbox
                      v-model="selecEntries.squared"
                      size="small"
                      class="w-full"
                      label="Cuadrada"
                      disabled
                    >
                    </el-checkbox>
                  </el-form-item>
                </div>
                <div class="inline-block">
                  <el-form-item label=" ">
                    <el-checkbox
                      v-model="selecEntries.accounted"
                      size="small"
                      class="w-full"
                      label="Contabilizada"
                      disabled
                    >
                    </el-checkbox>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>
        </div>
        <!-- Tabla-->
        <el-table
          :data="
            selecEntries !== null ? selecEntries.accountingEntryDetails : []
          "
          size="mini"
          stripe
          style="width: 100%"
          show-summary
          sum-text=""
          :summary-method="getSummaries"
        >
          <el-table-column type="index" prop="quantity" label="#" width="50" />
          <el-table-column  label="Cta. Contable." width="120">
            <template slot-scope="scope">
              <span>{{scope.row.accountingCatalog.code }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="concept" label="Concepto" width="500" />
          <el-table-column prop="" label="Cargo" width="90">
            <template slot-scope="scope">
              <span>{{ scope.row.cargo | formatMoney }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="Abono" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.abono | formatMoney }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <!--Cierre de dialogo-->
      <el-form class="flex flex-col" label-position="top">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-start-10 col-span-3">
            <el-form-item>
              <el-input
                suffix-icon="el-icon-search"
                placeholder="Buscar..."
                v-model="filterBy.searchValue"
                size="small"
                v-debounce:500ms="fetchEntries"
                @change="fetchEntries()"
              />
            </el-form-item>
          </div>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-4">
            <el-form-item label="Rango de fechas:">
              <el-date-picker
                style="width: 100%"
                size="small"
                v-model="filterBy.dateRange"
                type="daterange"
                align="left"
                unlink-panels
                range-separator="-"
                start-placeholder="Fecha inicio"
                end-placeholder="Fecha final"
                :editable="false"
                format="dd/MM/yyyy"
                value-format="yyyy-MM-dd"
                @change="fetchEntries"
              />
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item label="Tipo de partida:">
              <el-select
                v-model="filterBy.entryType"
                placeholder="Seleccionar tipo"
                size="small"
                class="w-full"
                clearable
                filterable
                default-first-option
                @change="fetchEntries"
              >
                <el-option
                  v-for="e in entryType"
                  :key="e.id"
                  :label="e.name"
                  :value="e.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item label="Opciones de partidad:">
              <el-checkbox
                v-model="filterBy.squared"
                size="small"
                class="w-full"
                label="Cuadrada"
                border
                @change="fetchEntries"
              >
              </el-checkbox>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item label=" ">
              <el-checkbox
                v-model="filterBy.accounted"
                size="small"
                class="w-full"
                label="Contabilizadad"
                border
                @change="fetchEntries"
              >
              </el-checkbox>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <el-table :data="entries.entries" stripe size="mini">
        <el-table-column
          type="index"
          label="#"
          prop="index"
          min-width="60"
          align="center"
        />
        <el-table-column label="Serie" prop="serie" min-width="50" />
        <el-table-column label="Fecha" prop="date" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.date | formatDate("YYYY-MM-DD") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Titulo" prop="title" min-width="400" />
        <el-table-column label="Cargo" min-width="90" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.cargo | formatMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Tipo" min-width="80" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.accountingEntryType.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Estado" min-width="99">
          <template slot-scope="scope">
            <el-tag
              size="small"
              type="success"
              v-if="scope.row.accounted && scope.row.squared"
              >Completa</el-tag
            >
            <el-tag
              size="small"
              type="warning"
              v-else-if="selecEntries ? selecEntries.sequence : ''"
              >Cuadrada</el-tag
            >
            <el-tag size="small" type="danger" v-else>Incompleta</el-tag>
          </template>
        </el-table-column>
        <el-table-column label min-width="60" align="center">
          <template slot-scope="scope">
            <el-dropdown trigger="click" szie="mini">
              <el-button icon="el-icon-more" size="mini" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="openPreviewEntry(scope.row)">
                  <i class="el-icon-view"></i> Vista previa
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="$router.push(`entries/edit/${scope.row.id}`)"
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
      <div class="flex justify-end">
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
      </div>
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
export default {
  name: "EntriesIndex",
  components: { LayoutContent, Notification },
  fetch() {
    const entries = () => this.$axios.get("/entries", { params: this.page });
    const entryType = () => this.$axios.get("/entries/types");
    Promise.all([entries(), entryType()])
      .then((res) => {
        const [entries, entryType] = res;
        this.entries = entries.data;
       // this.count = entries.data.count;
        this.entryType = entryType.data.entryTypes;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message
          ? err.response.message
          : "Comunicate con el adminstrador del Sistema";
      });
  },
  fetchOnServer: false,
  data() {
    return {
      page: {
        limit: 10,
        page: 1,
      },
      selecEntries: {},
      showInvoicePreview: false,
      loading: false,
      errorMessage: "",
      searchValue: "",
      entryType: [],
      filterBy: {
        dateRange: null,
        entryType: "",
        searchValue: "",
        squared: false,
        accounted: false,
      },
      tipoPartida: [
        {
          id: "a0dea81f-e5e4-4253-a587-716102dfc6ab",
          name: "Diario",
          name: "Ingreso",
          name: "Egreso",
          name: "DIA",
        },
      ],
      entries: {
        entries: [],
        count: 0,
      },
    };
  },
  methods: {
    fetchEntries() {
      let params = this.page;
      if (this.filterBy.dateRange !== null) {
        params = {
          ...params,
          startDate: this.filterBy.dateRange[0],
          endDate: this.filterBy.dateRange[1],
        };
      }
      if (this.filterBy.entryType != "") {
        params = {
          ...params,
          sec: this.filterBy.entryType,
        };
      }
      if (this.filterBy.searchValue != "") {
        params = {
          ...params,
          search: this.filterBy.searchValue.toLowerCase(),
        };
      }
      if (this.filterBy.squared != false) {
        params = {
          ...params,
          squared: this.filterBy.squared,
        };
      }
      if (this.filterBy.accounted != false) {
        params = {
          ...params,
          accounted: this.filterBy.accounted,
        };
      }
      this.$axios
        .get("/entries", { params })
        .then((res) => {
          this.entries = res.data;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        });
    },
    handleSizeChange(val) {
      this.page.limit = val;
      this.page.fetchEntries();
    },
    getSummaries(value) {
      const { columns, data } = value;
      const totalAbono = data.reduce((a,b)=>a+b.abono ? b.abono:0, 0);
      const totalCargo = data.reduce((a,b) =>a+b.cargo ? b.cargo : 0, 0);

      const result = columns.map((column) => {
        console.log(column.label)
        if (column.label == "Abono") {
          return this.$options.filters.formatMoney(totalAbono);
        } else if (column.label == "Cargo" ) {
          return this.$options.filters.formatMoney(totalCargo);
        } else if (column.label == "Concepto") {
          return "TOTALES";
        } else {
          return "";
        }
      });
      return result;
    },
    // changeActive({ id, isActiveInvoice }) {
    //   const action = isActiveInvoice ? "desactivar" : "activar";
    //   this.$confirm(
    //     `¿Estás seguro que deseas ${action} este cliente?`,
    //     "Confirmación",
    //     {
    //       confirmButtonText: `Si, ${action}`,
    //       cancelButtonText: "Cancelar",
    //       type: "warning",
    //       beforeClose: (action, instance, done) => {
    //         if (action === "confirm") {
    //           instance.confirmButtonLoading = true;
    //           instance.confirmButtonText = "Procesando...";
    //           this.$axios
    //             .put(`entreis${id}`, { status: !isActiveInvoice })
    //             .then((res) => {
    //               this.$notify.success({
    //                 title: "Éxito",
    //                 message: res.data.message,
    //               });
    //               this.fetchEntries();
    //             })
    //             .catch((err) => {
    //               this.$notify.error({
    //                 title: "Error",
    //                 message: err.response.data.message,
    //               });
    //             })
    //             .then((alw) => {
    //               instance.confirmButtonLoading = false;
    //               instance.confirmButtonText = `Si, ${action}`;
    //               done();
    //             });
    //         }
    //         done();
    //       },
    //     }
    //   );
    // },
    // deleteInvoice({ id }) {
    //   this.$confirm(
    //     `¿Estás seguro que deseas eliminar este cliente?`,
    //     "Confirmación",
    //     {
    //       confirmButtonText: `Si, eliminar`,
    //       cancelButtonText: "Cancelar",
    //       type: "warning",
    //       beforeClose: (action, instance, done) => {
    //         if (action === "confirm") {
    //           instance.confirmButtonLoading = true;
    //           instance.confirmButtonText = "Procesando...";
    //           this.$axios
    //             .delete(`/invoices/${id}`)
    //             .then((res) => {
    //               this.$notify.success({
    //                 title: "Éxito",
    //                 message: res.data.message,
    //               });
    //               this.fetchEntries();
    //             })
    //             .catch((err) => {
    //               this.$notify.error({
    //                 title: "Error",
    //                 message: err.response.data.message,
    //               });
    //             })
    //             .then((alw) => {
    //               instance.confirmButtonLoading = false;
    //               instance.confirmButtonText = `Si, eliminar`;
    //               done();
    //             });
    //         }
    //         done();
    //       },
    //     }
    //   );
    // },
    async openPreviewEntry({ id }) {
      console.log(id);
      const { data } = await this.$axios.get(`/entries/${id}`);
      console.log(data.entry);
      this.selecEntries = data.entry;
    
      this.showInvoicePreview = true;
    },
  },
  
  


};
</script>

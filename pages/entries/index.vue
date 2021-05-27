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
          <el-table-column label="Cta. Contable." width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.accountingCatalog.code }}</span>
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

        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="showInvoicePreview = false"
            >Cerrar</el-button
          >
        </span>
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
      <!-- La tabla tiene las medidas exacta, la suma de las colummnas tiene 960-->
      <el-table
        @sort-change="sortBy"
        :data="entries.data"
        stripe
        size="mini"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45" />
        <el-table-column
          type="index"
          label="#"
          prop="index"
          width="50"
          align="center"
        />
        <el-table-column
          sortable="custom"
          label="Serie"
          prop="serie"
          width="80"
        />
        <el-table-column sortable="custom" label="Fecha" prop="date" width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column
          sortable="custom"
          label="Titulo"
          prop="title"
          min-width="300"
        />
        <el-table-column
          label="Cargo"
          width="110"
          prop="cargo"
          sortable="custom"
          align="right"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.cargo | formatMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column
          sortable="custom"
          label="Tipo"
          width="90"
          align="center"
          prop="accountingEntryType"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.accountingEntryType.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="squared"
          sortable="custom"
          label="Estado"
          width="110"
        >
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
import { getHeader, getFooter } from "../../tools";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default {
  name: "EntriesIndex",
  components: { LayoutContent, Notification },
  fetch() {
    const entries = () => this.$axios.get("/entries", { params: this.page });
    const entryType = () => this.$axios.get("/entries/types");
    Promise.all([entries(), entryType()])
      .then((res) => {
        this.loading = false;
        const [entries, entryType] = res;
        this.entries = entries.data;
        this.entryType = entryType.data.data;
        this.loading = false;
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
      multipleSelection: [],
      page: {
        limit: 10,
        page: 1,
      },
      selecEntries: {},
      showInvoicePreview: false,
      loading: true,
      errorMessage: "",
      searchValue: "",
      entryType: [],
      filterBy: {
        dateRange: null,
        entryType: "",
        searchValue: "",
        squared: false,
        accounted: false,
        active: false,
        prop: "",
        order: null,
      },

      entries: {
        data: [],
        count: 0,
      },
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
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
          entryType: this.filterBy.entryType,
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
      if (this.filterBy.order) {
        params = {
          ...params,
          prop: this.filterBy.prop,
          order: this.filterBy.order,
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
    deleteEntry(id) {
      this.$confirm(
        `¿Estás seguro que deseas eliminar esta partida?`,
        "Confirmación",
        {
          confirmButtonText: `Si, eliminar`,
          cancelButtonText: "Cancelar",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "Procesando...";
              this.$axios
                .delete(`/entries/${id}`)
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchEntries();
                })
                .catch((err) => {
                  this.$notify.error({
                    title: "Error",
                    message: err.response.data.message,
                  });
                })
                .then((alw) => {
                  instance.confirmButtonLoading = false;
                  instance.confirmButtonText = `Si, eliminar`;
                  done();
                });
            }
            done();
          },
        }
      );
    },
    handleSizeChange(val) {
      this.page.limit = val;
      this.fetchEntries();
    },
    getSummaries(param) {
      const { columns, data } = param;
      const totalAbono = data.reduce((a, b) => a + (b.abono ? b.abono : 0), 0);
      const totalCargo = data.reduce((a, b) => a + (b.cargo ? b.cargo : 0), 0);
      const resutls = columns.map((column) => {
        if (column.label == "Abono") {
          return this.$options.filters.formatMoney(totalAbono);
        } else if (column.label == "Cargo") {
          return this.$options.filters.formatMoney(totalCargo);
        } else if (column.label == "Concepto") {
          return "TOTALES";
        } else {
          return "";
        }
      });
      return resutls;
    },
    sortBy({ column, prop, order }) {
      this.filterBy.prop = prop;
      this.filterBy.order = order;
      this.fetchEntries();
    },
    printEntry({ id }) {
      this.$confirm(
        `¿Estás seguro que deseas imprimir esta factura?`,
        "Confirmación",
        {
          confirmButtonText: `Si, imprimir`,
          cancelButtonText: "Cancelar",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "Procesando...";
              const entry = () => this.$axios.get(`/entries/${id}`);
              const bussinesInfo = () => this.$axios.get("/business/info");
              Promise.all([entry(), bussinesInfo()])
                .then((res) => {
                  const [entry, bussinesInfo] = res;
                  const accountingEntry = entry.data.data;
                  const { name, nit, nrc } = bussinesInfo.data.info;

                  let totalAbono = 0;
                  let totalCargo = 0;
                  const values = accountingEntry.accountingEntryDetails.map(
                    (a) => {
                      totalAbono += a.abono ? a.abono : 0;
                      totalCargo += a.cargo ? a.cargo : 0;

                      return [
                        a.accountingCatalog.code,
                        a.accountingCatalog.name,
                        a.concept,
                        {
                          text: this.$options.filters.formatMoney(a.cargo),
                          alignment: "right",
                        },
                        {
                          text: this.$options.filters.formatMoney(a.abono),
                          alignment: "right",
                        },
                      ];
                    }
                  );

                  values.push([
                    "",
                    "",
                    {
                      text: "TOTAL COMPROBANTE",
                      bold: true,
                      alignment: "right",
                    },
                    {
                      text: this.$options.filters.formatMoney(totalCargo),
                      bold: true,
                      alignment: "right",
                    },
                    {
                      text: this.$options.filters.formatMoney(totalAbono),
                      bold: true,
                      alignment: "right",
                    },
                  ]);

                  const preTitle = [
                    {
                      text: "Comprobante: ",
                      bold: true,
                    },
                    {
                      text: accountingEntry.accountingEntryType.name,
                    },
                    {
                      text: " | N°: ",
                      bold: true,
                    },
                    {
                      text: accountingEntry.serie,
                    },
                    {
                      text: " | Fecha: ",
                      bold: true,
                    },
                    {
                      text: accountingEntry.date,
                    },
                  ];

                  const docDefinition = {
                    info: {
                      title: `partida_contable_${this.$dateFns.format(
                        new Date(accountingEntry.rawDate),
                        "yyyyMMdd"
                      )}`,
                    },
                    pageSize: "LETTER",
                    pageOrientation: "portrait",
                    pageMargins: [20, 80, 20, 40],
                    header: getHeader(
                      name,
                      nit,
                      nrc,
                      null,
                      accountingEntry.title,
                      preTitle
                    ),
                    footer: getFooter(),
                    content: [
                      {
                        fontSize: 9,
                        layout: "noBorders",
                        table: {
                          headerRows: 1,
                          widths: ["10%", "30%", "20%", "20%", "20%"],
                          heights: -5,
                          body: [
                            [
                              {
                                text: "N° CUENTA",
                                style: "tableHeader",
                              },
                              {
                                text: "NOMBRE CUENTA",
                                style: "tableHeader",
                              },
                              {
                                text: "DESCRIPCIÓN",
                                style: "tableHeader",
                              },
                              {
                                alignment: "right",
                                text: "CARGO",
                                style: "tableHeader",
                              },
                              {
                                alignment: "right",
                                text: "ABONO",
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
                    },
                  };
                  this.generating = false;
                  pdfMake.createPdf(docDefinition).open();
                })
                .catch((err) => {
                  this.errorMessage = err.response.data.message;
                })
                .then((alw) => {
                  instance.confirmButtonLoading = false;
                  instance.confirmButtonText = `Si, imprimir`;
                  done();
                });
            } else {
              instance.confirmButtonLoading = false;
              instance.confirmButtonText = `Si, imprimir`;
              done();
            }
          },
        }
      );
    },

    async openPreviewEntry({ id }) {
      const { data } = await this.$axios.get(`/entries/${id}`);
      this.selecEntries = data.entry;
      this.showInvoicePreview = true;
    },
  },
};
</script>

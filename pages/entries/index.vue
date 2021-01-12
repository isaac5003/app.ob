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
      <el-form class="flex flex-col" label-position="top">
        <div class="grid grid-cols-12 gap-4" >
        <div class="col-start-10 col-span-3 ">
            <el-form-item>
            <el-input
              suffix-icon="el-icon-search"
              placeholder="Buscar..."
              v-model="searchValue"
              size="small"
              style="margin-top: 26px"
              clearable
              v-debounce:500ms="fetchEntries"
              @change="fetchEntries"
            />
          </el-form-item>
        </div>
        
        </div>
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-4">
            <el-form-item label="Rango de fechas:">
              <el-date-picker
                style="width: 100%;"
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
              >
                <el-option
                  v-for="entryType in entryTypes"
                  :key="entryType.id"
                  :label="entryType.name"
                  :value="entryType.id"
                />
              </el-select>
            </el-form-item>
          </div>
            <div class="col-span-2">
              <el-form-item label="Opciones de partidad:">
                <el-checkbox 
                v-model="checked1" 
                size="small"
                class="w-full"
                label="Cuadrada" 
                border>
               </el-checkbox>
              </el-form-item>
             </div>
             <div class="col-span-2">
              <el-form-item label=" ">
                <el-checkbox 
                v-model="checked1" 
                size="small"
                class="w-full"
                label="Contabilizadad" 
                border>
               </el-checkbox>
              </el-form-item>
             </div>
        </div>
      </el-form>
      <el-table :data="entries.entries" stripe size="mini">
        <el-table-column type="index" label="#" min-width="50" align="center" />
        <el-table-column label="Serie" prop="serie" min-width="50" />
        <el-table-column label="Fecha" min-width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.date | formatDate('YYYY-MM-DD') }}</span>
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
        <el-table-column label="Estado" min-width="105">
          <template slot-scope="scope">
            <el-tag
              size="small"
              type="success"
              v-if="scope.row.accounted && scope.row.squared"
            >Completa</el-tag>
            <el-tag size="small" type="warning" v-else-if="scope.row.squared">Cuadrada</el-tag>
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
      <!-- <div class="flex justify-end">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="fetchInvoices"
          :current-page.sync="page.page"
          :page-sizes="[5, 10, 15, 25, 50, 100]"
          :page-size="page.size"
          layout="total, sizes, prev, pager, next"
          :total="parseInt(invoices.count)"
          :pager-count="5"
        />
      </div> -->
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
export default {
  name: "EntriesIndex",
  components: { LayoutContent, Notification },
  // fetch() {
  //   const invoices = () => {
  //     return this.$axios.get("/invoices", { params: this.page });
  //   };

  //   Promise.all([invoices()])
  //     .then((res) => {
  //       const [invoices] = res;
  //       this.invoices = invoices.data;
  //       this.loading = false;
  //     })
  //     .catch((err) => {
  //       this.errorMessage = err.response.data.message;
  //     });
  // },
  // fetchOnServer: false,
  data() {
    return {
      loading: false,
      errorMessage: "",
      searchValue: "",
      filterBy: {
        dateRange: null,
        entryType: '',
      },
      entries: {
        entries: [],
        count: 0,
      },
    };
  },
  methods: {
    fetchInvoices() {
      let params = this.page;
      if (this.status !== "") {
        params = { ...params, active: this.status };
      }
      if (this.searchValue !== "") {
        params = { ...params, search: this.searchValue.toLowerCase() };
      }

      this.$axios
        .get("/invoices", { params })
        .then((res) => {
          this.invoices = res.data;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        });
    },
    handleSizeChange(val) {
      this.page.limit = val;
      this.fetchInvoices();
    },
    changeActive({ id, isActiveInvoice }) {
      const action = isActiveInvoice ? "desactivar" : "activar";
      this.$confirm(
        `¿Estás seguro que deseas ${action} este cliente?`,
        "Confirmación",
        {
          confirmButtonText: `Si, ${action}`,
          cancelButtonText: "Cancelar",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "Procesando...";
              this.$axios
                .put(`/invoices/status/${id}`, { status: !isActiveInvoice })
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchInvoices();
                })
                .catch((err) => {
                  this.$notify.error({
                    title: "Error",
                    message: err.response.data.message,
                  });
                })
                .then((alw) => {
                  instance.confirmButtonLoading = false;
                  instance.confirmButtonText = `Si, ${action}`;
                  done();
                });
            }
            done();
          },
        }
      );
    },
    deleteInvoice({ id }) {
      this.$confirm(
        `¿Estás seguro que deseas eliminar este cliente?`,
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
                .delete(`/invoices/${id}`)
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchInvoices();
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
    async openInvoicePreview({ id }) {
      const { data } = await this.$axios.get(`/invoices/${id}`);
      this.selectedInvoice = data.invoice;
      this.showInvoicePreview = true;
    },
  },
};
</script>

<template>
  <layout-content
    v-loading="pageloading"
    page-title="Listado de cobros"
    :breadcrumb="[
      { name: 'Cobros electrónicos', to: '/echarges' },
      { name: 'Listado de cobros', to: null },
    ]"
  >
    <div class="flex flex-col space-4">
      <el-form>
        <div class="grid grid-cols-12 gap-4">
          <el-form-item label="Rango de fechas:" class="col-span-4">
            <el-date-picker
              v-model="filter.dateRange"
              style="width: 100%"
              size="small"
              type="daterange"
              range-separator="-"
              start-placeholder="Fecha inicial"
              end-placeholder="Fecha final"
              format="dd/MM/yyyy"
              value-format="yyyy-MM-dd"
              @change="fetchEcharges"
            />
          </el-form-item>
          <el-form-item label="Cliente:" class="col-span-4">
            <el-select
              v-model="filter.customer"
              size="small"
              class="w-full"
              clearable
              filterable
              default-first-option
              placeholder="Seleccionar:"
              @change="fetchEcharges"
            >
              <el-option label="Todos los clientes" value="" />
              <el-option-group key="ACTIVOS" label="ACTIVOS">
                <el-option
                  v-for="item in activeCustomers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-option-group>
              <el-option-group key="INACTIVOS" label="INACTIVOS">
                <el-option
                  v-for="item in inactiveCustomers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="Tipo de cobro:" class="col-span-2">
            <el-select
              v-model="filter.echargeType"
              size="small"
              clearable
              placeholder="Seleccionar:"
              class="w-full"
              @change="fetchEcharges"
            >
              <el-option label="Todos los tipos" value="" />
              <el-option label="CE" value="CE" />
              <el-option
                v-for="item in documentTypes"
                :key="item.id"
                :label="item.code"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Estado:" class="col-span-2">
            <el-select
              v-model="filter.status"
              size="small"
              clearable
              placeholder="Seleccionar"
              class="w-full"
              @change="fetchEcharges"
            >
              <el-option label="Todos los estados" value="" />
              <el-option
                v-for="status in statuses"
                :key="status.id"
                :label="status.name"
                :value="status.id"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div class="flex flex-col space-y-2">
        <el-table
          :data="echarges.data"
          stripe
          size="small"
          v-loading="tableloading"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
          class="w-full"
          @sort-change="sortBy"
        >
          <el-table-column type="selection" width="45" />
          <el-table-column label="#" width="40" prop="index" />
          <el-table-column
            label="Correlativo"
            prop="sequence"
            width="120"
            sortable="custom"
          >
          </el-table-column>
          <el-table-column
            label="Tipo"
            prop="echargeType"
            width="80"
            sortable="custom"
          >
          </el-table-column>
          <el-table-column
            label="Fecha"
            prop="date"
            width="100"
            sortable="custom"
          >
            <template slot-scope="scope">
              <span>{{
                  $dateFns.format(scope.row.createdAt, "dd/MM/yyyy"),
              }}</span>
            </template></el-table-column
          >
          <el-table-column
            label="Cliente"
            prop="customerName"
            min-width="275"
            sortable="custom"
          />
          <el-table-column
            label="Estado"
            prop="status"
            width="130"
            sortable="custom"
          >
            <template slot-scope="scope">
              <el-tag
                size="small"
                type="info"
                v-if="scope.row.status.id == '1'"
              >
                <i class="el-icon-warning"></i>
                {{ scope.row.status.name }}
              </el-tag>
              <el-tag size="small" v-else-if="scope.row.status.id == '2'">
                <i class="el-icon-success"></i>
                {{ scope.row.status.name }}</el-tag
              >
              <el-tag
                size="small"
                type="success"
                v-else-if="scope.row.status.id == '3'"
              >
                <i class="el-icon-success"></i>
                {{ scope.row.status.name }}</el-tag
              >
              <el-tag
                size="small"
                type="danger"
                v-else-if="scope.row.status.id == '4'"
              >
                <i class="el-icon-success"></i>
                {{ scope.row.status.name }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            label="Total"
            width="80"
            align="right"
            sortable="custom"
            prop="total"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.total | formatMoney }}</span>
            </template>
          </el-table-column>
          <el-table-column label width="90" align="center">
            <!-- dropdpwn selecction -->
            <template slot="header" v-if="multipleSelection.length > 0">
              <el-dropdown trigger="click" szie="mini">
                <el-button type="primary" size="mini" class="group">
                  <span class="hidden group-hover:inline">
                    {{ multipleSelection.length }} Filas</span
                  >
                  <i class="el-icon-more"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <i class="el-icon-check"></i>Activar seleccionados
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <i class="el-icon-close"></i>Desactivar seleccionados
                  </el-dropdown-item>
                  <el-dropdown-item :divided="true" class="font-semibold">
                    <i class="el-icon-delete"></i> Eliminar seleccionados
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <el-dropdown trigger="click" szie="mini">
                <el-button icon="el-icon-more" size="mini" />
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="scope.row.status.id == 1"
                    @click.native="sendEcharge(scope.row.id)"
                  >
                    <i class="el-icon-s-promotion"></i> Enviar cobro
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="
                      $router.push(`/echarges/edit?ref=${scope.row.id}`)
                    "
                    v-if="
                      scope.row.origin ==
                        '09a5c668-ab54-441e-9fb2-d24b36ae202e' &&
                        scope.row.status.id != 4
                    "
                  >
                    <i class="el-icon-edit-outline"></i> Editar cobro
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.status.id == 2"
                    @click.native="sendEcharge(scope.row.id)"
                  >
                    <i class="el-icon-s-promotion"></i>Reennviar cobro
                  </el-dropdown-item>
                  <!-- <el-dropdown-item>
                    <i class="el-icon-tickets"></i> Bitacora de cobros
                  </el-dropdown-item> -->
                  <el-dropdown-item
                    :divided="true"
                    class="font-semibold"
                    @click.native="voidDocument(scope.row)"
                    v-if="scope.row.status.id != 4"
                  >
                    <i class="el-icon-close"></i> Desactivar cobro
                  </el-dropdown-item>
                  <el-dropdown-item
                    :divided="true"
                    class="font-semibold"
                    @click.native="voidDocument(scope.row)"
                    v-if="scope.row.status.id == 4"
                  >
                    <i class="el-icon-check"></i> Activar cobro
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <div class="flex justify-end">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="fetchEcharges"
            :current-page.sync="page.page"
            :page-sizes="[5, 10, 15, 25, 50, 100]"
            :page-size="page.size"
            layout="total, sizes, prev, pager, next"
            :total="parseInt(echarges.count)"
            :pager-count="5"
          />
        </div>
      </div>
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
import { numeroALetras, calculatedAmount, parseErrors } from "../../tools";
import jsPDF from "jspdf";
export default {
  name: "EChargesIndex",
  components: { LayoutContent, Notification },
  fetch() {
    const documentTypes = () => this.$axios.get("/invoices/document-types");
    const customers = () => this.$axios.get("/customers");
    const echarges = () => this.$axios.get("/echarges");
    const echargesStatuses = () => this.$axios.get("/echarges/status");

    Promise.all([documentTypes(), customers(), echarges(), echargesStatuses()])
      .then((res) => {
        const [documentTypes, customers, echarges, status] = res;
        this.documentTypes = documentTypes.data.data;
        this.customers = customers.data.data;
        this.echarges = echarges.data;
        this.statuses = status.data.data;
        this.pageloading = false;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message
          ? err.response.data.message
          : "Comunicate con el administrador del sistema.";
      })
      .then((alw) => (this.pageloading = false));
  },
  fetchOnServer: false,
  data() {
    return {
      statuses: [],
      tableloading: false,
      errorMessage: "",
      pageloading: true,
      customers: [],
      documentTypes: [],
      filter: {
        dateRange: "",
        customer: "",
        echargeType: "",
        service: "",
        status: "",
      },
      echarges: { data: [], count: "" },
      multipleSelection: [],
      page: {
        page: 1,
        limit: 10,
      },
    };
  },
  methods: {
    handleSizeChange(val) {
      this.page.limit = val;
      this.fetchEcharges();
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    fetchEcharges() {
      this.tableloading = true;
      let params = this.page;
      if (this.filter.status !== "") {
        params = { ...params, status: this.filter.status };
      }
      // if (this.filter.searchValue != "") {
      //   params = { ...params, search: this.filter.searchValue.toLowerCase() };
      // }
      if (this.filter.customer !== "") {
        params = { ...params, customer: this.filter.customer };
      }
      if (this.filter.echargeType !== "") {
        params = { ...params, echargesType: this.filter.echargeType };
      }
      if (this.filter.dateRange !== null) {
        params = {
          ...params,
          startDate: this.filter.dateRange[0],
          endDate: this.filter.dateRange[1],
        };
      }
      if (this.filter.order) {
        params = {
          ...params,
          prop: this.filter.prop,
          order: this.filter.order,
        };
      }
      this.$axios
        .get("/echarges", { params })
        .then((res) => {
          this.echarges = res.data;
        })
        .catch((err) => {
          this.$notify.error({
            title: "Error",
            dangerouslyUseHTMLString: true,
            message: parseErrors(err.response.data.message),
          });
        })
        .then((alw) => (this.tableloading = false));
    },

    sortBy({ column, prop, order }) {
      this.filter.prop = prop;
      this.filter.order = order;
      this.fetchEcharges();
    },
    voidDocument(charge) {
      const activeAction = charge.status.id == 4 ? "activar" : "desactivar";
      this.$confirm(
        `¿Estás seguro que deseas ${activeAction} este cobro?`,
        "Confirmación",
        {
          confirmButtonText: `Si, ${activeAction}`,
          cancelButtonText: "Cancelar",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "Procesando...";
              this.$axios
                .put(`/echarges/status/${charge.id}`, {
                  status: charge.status.id == 4 ? 2 : 4,
                })
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchEcharges();
                })
                .catch((err) => {
                  this.$notify.error({
                    title: "Error",
                    dangerouslyUseHTMLString: true,
                    message: parseErrors(err.response.data.message),
                  });
                })
                .then((alw) => {
                  instance.confirmButtonLoading = false;
                  instance.confirmButtonText = `Si, ${activeAction}`;
                  done();
                });
            }
            done();
          },
        }
      );
    },

    sendEcharge(id) {
      this.$axios
        .post(`/echarges/send/${id}`)
        .then((res) => {
          this.$notify.success({
            title: "Éxito",
            message: res.data.message,
          });
        })
        .catch((err) => {
          this.$notify.error({
            title: "Error",
            dangerouslyUseHTMLString: true,
            message: parseErrors(err.response.data.message),
          });
        });
    },
  },
  computed: {
    activeCustomers() {
      return this.customers.filter((c) => c.isActiveCustomer);
    },
    inactiveCustomers() {
      return this.customers.filter((c) => !c.isActiveCustomer);
    },
  },
};
</script>

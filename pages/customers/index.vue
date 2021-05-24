<template>
  <layout-content
    v-loading="pageloading"
    page-title="Listado de clientes"
    :breadcrumb="[
      { name: 'Clientes', to: '/customers' },
      { name: 'Listado de clientes', to: null },
    ]"
  >
    <el-dialog
      title="Vista previa"
      :visible.sync="showCustomerPreview"
      width="900px"
      :append-to-body="true"
    >
      <div class="flex flex-col space-y-2 text-xs">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-6 flex flex-col">
            <span class="font-semibold">Nombre o razón social</span>
            <span>{{ selectedCustomer ? selectedCustomer.name : "" }}</span>
          </div>
          <div class="col-span-2 flex flex-col">
            <span class="font-semibold">Identificador</span>
            <span>{{
              selectedCustomer ? selectedCustomer.shortName : ""
            }}</span>
          </div>
          <div class="col-span-2 flex flex-col">
            <span class="font-semibold">Estado</span>
            <div v-if="selectedCustomer">
              <el-tag
                size="small"
                type="success"
                v-if="selectedCustomer.isActiveCustomer"
                >Activo</el-tag
              >
              <el-tag size="small" type="warning" v-else>Inactivo</el-tag>
            </div>
          </div>
          <div class="col-span-2 flex flex-col" v-if="hasModule()">
            <span class="font-semibold">Es proveedor</span>
            <div>
              <el-tag size="small" type="warning" class="w-auto">{{
                selectedCustomer
                  ? selectedCustomer.isProvider
                    ? "SI"
                    : "NO"
                  : ""
              }}</el-tag>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <div
            class="col-span-2 flex flex-col"
            v-if="selectedCustomer && selectedCustomer.customerType.id == 2"
          >
            <span class="font-semibold">DUI</span>
            <span>{{ selectedCustomer ? selectedCustomer.dui : "" }}</span>
          </div>
          <div class="col-span-3 flex flex-col">
            <span class="font-semibold">NIT</span>
            <span>{{ selectedCustomer ? selectedCustomer.nit : "" }}</span>
          </div>
          <template
            v-if="
              selectedCustomer &&
              (!selectedCustomer.customerTypeNatural ||
                selectedCustomer.customerTypeNatural.id == 2)
            "
          >
            <div class="col-span-2 flex flex-col">
              <span class="font-semibold">NRC</span>
              <span>{{ selectedCustomer ? selectedCustomer.nrc : "" }}</span>
            </div>
            <div class="col-span-5 flex flex-col">
              <span class="font-semibold">GIRO</span>
              <span>{{ selectedCustomer ? selectedCustomer.giro : "" }}</span>
            </div>
          </template>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-3 flex flex-col">
            <span class="font-semibold">Tipo de cliente</span>
            <span>{{
              selectedCustomer ? selectedCustomer.customerType.name : ""
            }}</span>
          </div>
          <div
            class="col-span-3 flex flex-col"
            v-if="selectedCustomer && selectedCustomer.customerTaxerType"
          >
            <span class="font-semibold">Tipo de contribuyente</span>
            <span>{{
              selectedCustomer && selectedCustomer.customerTaxerType
                ? selectedCustomer.customerTaxerType.name
                : ""
            }}</span>
          </div>
          <div
            class="col-span-3 flex flex-col"
            v-if="selectedCustomer && selectedCustomer.customerTaxerType == 2"
          >
            <span class="font-semibold">Tipo de persona natural</span>

            <span>{{ selectedCustomer.customerTypeNatural.name }}</span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showCustomerPreview = false" size="small"
          >Cerrar</el-button
        >
      </span>
    </el-dialog>

    <div class="flex flex-col space-y-2">
      <Notification
        v-if="errorMessage"
        class="w-full"
        type="danger"
        title="Error de comunicación"
        :message="errorMessage"
        :action="{
          title: 'Intentar nuevamente',
          function: () => $router.go(),
        }"
      />
      <el-form label-position="top" class="grid grid-cols-12 gap-4">
        <el-form-item class="col-span-3" label="Estado">
          <el-select
            v-model="status"
            placeholder="Seleccionar"
            size="small"
            class="w-full"
            clearable
            default-first-option
            @change="fetchCustomers"
          >
            <el-option label="Todos los estados" value="" />
            <el-option label="Activo" :value="true" />
            <el-option label="Inactivo" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item class="col-start-10 col-end-13">
          <el-input
            suffix-icon="el-icon-search"
            placeholder="Buscar..."
            v-model="searchValue"
            size="small"
            style="margin-top: 22px"
            clearable
            v-debounce:500ms="fetchCustomers"
            @change="fetchCustomers"
          />
        </el-form-item>
      </el-form>
      <el-table
        @sort-change="sortBy"
        :data="customers.data"
        stripe
        size="mini"
        v-loading="tableloading"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="index" width="50" label="#" />
        <el-table-column
          label="Nombre"
          min-width="270"
          prop="name"
          sortable="custom"
        >
          <template slot-scope="scope">
            <div class="flex flex-col">
              <span class="font-semibold text-xs">
                {{ scope.row.shortName }}
              </span>
              <span>
                {{ scope.row.name }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="Tipo"
          prop="customerType.id"
          width="130"
          sortable="custom"
        >
          <template slot-scope="scope">
            <span>
              {{ scope.row.customerType.name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="NIT" prop="nit" width="150" sortable="custom" />
        <el-table-column label="NRC" prop="nrc" width="90" sortable="custom" />
        <el-table-column
          label="Estado"
          width="110"
          prop="isActiveCustomer"
          sortable="custom"
        >
          <template slot-scope="scope">
            <el-tag
              size="small"
              type="success"
              v-if="scope.row.isActiveCustomer"
            >
              <i class="el-icon-success"></i>
              Activo</el-tag
            >
            <el-tag size="small" type="warning" v-else>
              <i class="el-icon-remove"></i>
              Inactivo</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label width="110" align="center">
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
                <el-dropdown-item
                  @click.native="updateSelected(multipleSelection, true)"
                >
                  <i class="el-icon-check"></i>Activar seleccionados
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="updateSelected(multipleSelection, false)"
                >
                  <i class="el-icon-close"></i>Desactivar seleccionados
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="deleteSelected(multipleSelection)"
                  :divided="true"
                  class="font-semibold"
                >
                  <i class="el-icon-delete"></i> Eliminar seleccionados
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <!-- dropdown 1 -->
          <template slot-scope="scope">
            <el-dropdown trigger="click" szie="mini">
              <el-button icon="el-icon-more" size="mini" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="openCustomerPreview(scope.row)"
                >
                  <i class="el-icon-view"></i> Vista previa
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="
                    $router.push(`/customers/edit?ref=${scope.row.id}`)
                  "
                >
                  <i class="el-icon-edit-outline"></i> Editar cliente
                </el-dropdown-item>
                <el-dropdown-item @click.native="changeActive(scope.row)">
                  <span v-if="scope.row.isActiveCustomer">
                    <i class="el-icon-close"></i> Desactivar
                  </span>
                  <span v-else> <i class="el-icon-check"></i> Activar </span>
                  cliente
                </el-dropdown-item>
                <!-- <el-dropdown-item>
                    <i class="el-icon-guide"></i> Sucursales
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <i class="el-icon-notebook-1"></i> Directorio
                </el-dropdown-item>-->
                <el-dropdown-item
                  :divided="true"
                  class="text-red-500 font-semibold"
                  @click.native="deleteCustomer(scope.row)"
                >
                  <i class="el-icon-delete"></i> Eliminar cliente
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="fetchCustomers"
          :current-page.sync="page.page"
          :page-sizes="[5, 10, 15, 25, 50, 100]"
          :page-size="page.size"
          layout="total, sizes, prev, pager, next"
          :total="parseInt(customers.count)"
          :pager-count="5"
        />
      </div>
    </div>
  </layout-content>
</template>

<script>
import { id } from "date-fns/locale";
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
import { hasModule } from "../../tools/index.js";
export default {
  name: "CustomersIndex",
  head: {
    titleTemplate: `%s | Clientes`,
  },
  components: { LayoutContent, Notification },
  fetch() {
    const customers = () => {
      return this.$axios.get("/customers", { params: this.page });
    };

    Promise.all([customers()])
      .then((res) => {
        const [customers] = res;
        this.customers = customers.data;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message;
      })
      .then((alw) => (this.pageloading = false));
  },
  fetchOnServer: false,
  data() {
    return {
      pageloading: true,
      tableloading: false,
      errorMessage: "",
      searchValue: "",
      status: "",
      sellingTypes: [],
      customers: {
        data: [],
        count: 0,
      },
      filter: {
        prop: "",
        order: null,
      },
      page: {
        limit: 10,
        page: 1,
      },
      showCustomerPreview: false,
      selectedCustomer: null,
      multipleSelection: [],
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    fetchCustomers() {
      this.tableloading = true;
      let params = this.page;
      if (this.status !== "") {
        params = { ...params, active: this.status };
      }
      if (this.searchValue !== "") {
        params = { ...params, search: this.searchValue.toLowerCase() };
      }
      if (this.filter.order) {
        params = {
          ...params,
          prop: this.filter.prop,
          order: this.filter.order,
        };
      }

      this.$axios
        .get("/customers", { params })
        .then((res) => {
          this.customers = res.data;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        })
        .then((alw) => (this.tableloading = false));
    },
    handleSizeChange(val) {
      this.page.limit = val;
      this.fetchCustomers();
    },
    changeActive({ id, isActiveCustomer }) {
      const action = isActiveCustomer ? "desactivar" : "activar";
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
                .put(`/customers/status/${id}`, { status: !isActiveCustomer })
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchCustomers();
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
    deleteCustomer({ id }) {
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
                .delete(`/customers/${id}`)
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchCustomers();
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

    deleteSelected(dataSelected) {
      const ids = dataSelected.map((x) => x.id);
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
                .post("/customers", {
                  ids,
                })
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchCustomers();
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
    updateSelected(dataSelected, status) {
      const ids = dataSelected.map((x) => x.id);
      console.log(ids);
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
                .put("/customers", {
                  ids,
                  status,
                })
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchCustomers();
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
    async openCustomerPreview({ id }) {
      const { data } = await this.$axios.get(`/customers/${id}`);
      (this.selectedCustomer = data.customer),
        (this.showCustomerPreview = true);
    },
    hasModule() {
      return hasModule("f6000cbb-1e6d-4f7d-a7cc-cadd78d23076", this.$auth.user);
    },
    sortBy({ column, prop, order }) {
      this.filter.prop = prop;
      this.filter.order = order;
      this.fetchCustomers();
    },
  },
};
</script>

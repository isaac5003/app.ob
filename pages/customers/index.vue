<template>
  <layout-content
    v-loading="loading"
    page-title="Listado de clientes"
    :breadcrumb="[
      { name: 'Clientes', to: '/customers' },
      { name: 'Listado de clientes', to: null },
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
      <el-form label-position="top">
        <div class="flex justify-between">
          <div class="flex">
            <el-form-item class="w-60" label="Estado">
              <el-select
                v-model="status"
                placeholder="Seleccionar"
                size="small"
                class="w-full"
                filterable
                clearable
                default-first-option
                @change="fetchCustomers"
              >
                <el-option label="Activo" :value="true" />
                <el-option label="Inactivo" :value="false" />
              </el-select>
            </el-form-item>
          </div>
          <div class="w-75">
            <el-input
              suffix-icon="el-icon-search"
              placeholder="Buscar..."
              v-model="searchValue"
              size="small"
              style="margin-top: 26px;"
              clearable
              v-debounce:500ms="fetchCustomers"
              @change="fetchCustomers"
            />
          </div>
        </div>
      </el-form>
      <el-table :data="customers.customers" stripe size="mini">
        <el-table-column type="index" min-width="40" />
        <el-table-column label="Nombre" prop="name" min-width="350" />
        <el-table-column
          label="Tipo"
          prop="customerType.name"
          min-width="120"
        />
        <el-table-column label="NIT" prop="nit" min-width="160" />
        <el-table-column label="NRC" prop="nrc" min-width="90" />
        <el-table-column label="Estado" min-width="90">
          <template slot-scope="scope">
            <el-tag
              size="small"
              type="success"
              v-if="scope.row.isActiveCustomer"
              >Activo</el-tag
            >
            <el-tag size="small" type="warning" v-else>Inactivo</el-tag>
          </template>
        </el-table-column>
        <el-table-column label min-width="60" align="center">
          <template slot-scope="scope">
            <el-dropdown trigger="click">
              <el-button icon="el-icon-more" size="small" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="showCustomerPreview(scope.row)"
                >
                  <i class="el-icon-view"></i> Vista previa
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="
                    $router.push(`/customers/edit/${scope.row.id}`)
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
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
export default {
  name: "CustomersIndex",
  components: { LayoutContent, Notification },
  fetch() {
    const customers = () => {
      return this.$axios.get("/customers", { params: this.page });
    };

    Promise.all([customers()])
      .then((res) => {
        const [customers] = res;
        this.customers = customers.data;
        this.loading = false;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message;
      });
  },
  fetchOnServer: false,
  data() {
    return {
      loading: true,
      errorMessage: "",
      searchValue: "",
      status: "",
      sellingTypes: [],
      customers: {
        customers: [],
        count: 0,
      },
      page: {
        limit: 10,
        page: 1,
      },
    };
  },
  methods: {
    fetchCustomers() {
      let params = this.page;
      if (this.status !== "") {
        params = { ...params, active: this.status };
      }
      if (this.searchValue !== "") {
        params = { ...params, search: this.searchValue.toLowerCase() };
      }

      this.$axios
        .get("/customers", { params })
        .then((res) => {
          this.customers = res.data;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        });
    },
    handleSizeChange(val) {
      this.page.limit = val;
      this.fetchCustomers();
    },
    changeActive({ id, active }) {
      const action = active ? "desactivar" : "activar";
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
                .put(`/customers/status/${id}`, { status: !active })
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
  },
};
</script>

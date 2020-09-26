<template>
  <layout-content
    v-loading="loading"
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
      <div class="flex flex-col space-y-2">
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
          <div class="col-span-2 flex flex-col">
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
                <el-option label="Todos los estados" value="" />
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
              style="margin-top: 26px"
              clearable
              v-debounce:500ms="fetchCustomers"
              @change="fetchCustomers"
            />
          </div>
        </div>
      </el-form>
      <el-table :data="customers.customers" stripe size="mini">
        <el-table-column prop="index" min-width="40" />
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
      showCustomerPreview: false,
      selectedCustomer: null,
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
    async openCustomerPreview({ id }) {
      const { data } = await this.$axios.get(`/customers/${id}`);
      this.selectedCustomer = data.customer;
      this.showCustomerPreview = true;
    },
  },
};
</script>

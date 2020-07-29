<template>
  <layout-content
    page-title="Listado de servicios"
    :breadcrumb="[
      { name: 'Servicios', to: '/services' },
      { name: 'Listado de servicios', to: null },
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
          <div class="flex space-x-4">
            <el-form-item class="w-60" label="Estado">
              <el-select
                v-model="status"
                placeholder="Seleccionar"
                size="small"
                class="w-full"
                filterable
                clearable
                default-first-option
                @change="fetchServices"
              >
                <el-option label="Activo" :value="true" />
                <el-option label="Inactivo" :value="false" />
              </el-select>
            </el-form-item>
            <el-form-item class="w-60" label="Tipo de venta">
              <el-select
                v-model="type"
                placeholder="Seleccionar"
                size="small"
                class="w-full"
                filterable
                clearable
                default-first-option
                @change="fetchServices"
              >
                <el-option
                  v-for="item in sellingTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
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
              v-debounce:500ms="fetchServices"
              @change="fetchServices"
            />
          </div>
        </div>
      </el-form>
      <el-table :data="services.services" stripe size="mini" v-loading="loading">
        <el-table-column type="index" min-width="40" />
        <el-table-column label="Nombre" prop="name" min-width="200" />
        <el-table-column label="Descripción" prop="description" min-width="300" />
        <el-table-column label="Precio" min-width="100" align="right">
          <template slot-scope="scope">
            <span>{{ scope.row.cost | formatMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Tipo de venta" prop="type" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.sellingType.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Estado" prop="status" min-width="80">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.active">Activo</el-tag>
            <el-tag size="small" type="warning" v-else>Inactivo</el-tag>
          </template>
        </el-table-column>
        <el-table-column label min-width="60" align="center">
          <template slot-scope="scope">
            <el-dropdown trigger="click">
              <el-button icon="el-icon-more" size="small" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="$router.push(`/services/edit/${scope.row.id}`)">
                  <i class="el-icon-edit-outline"></i> Editar servicio
                </el-dropdown-item>
                <el-dropdown-item @click.native="changeActive(scope.row)">
                  <span v-if="scope.row.active">
                    <i class="el-icon-close"></i> Desactivar
                  </span>
                  <span v-else>
                    <i class="el-icon-check"></i> Activar
                  </span>
                  servicio
                </el-dropdown-item>
                <el-dropdown-item
                  :divided="true"
                  class="font-semibold"
                  @click.native="deleteService(scope.row)"
                >
                  <span class="text-red-500">
                    <i class="el-icon-delete"></i> Eliminar servicio
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="fetchServices"
          :current-page.sync="page.page"
          :page-sizes="[5, 10, 15, 25, 50, 100]"
          :page-size="page.size"
          layout="total, sizes, prev, pager, next"
          :total="parseInt(services.count)"
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
  name: "ServicesIndex",
  components: { LayoutContent, Notification },
  fetch() {
    const sellingTypes = () => {
      return this.$axios.get("/services/selling-types");
    };

    const services = () => {
      return this.$axios.get("/services", { params: this.page });
    };

    Promise.all([sellingTypes(), services()])
      .then((res) => {
        const [sellingTypes, services] = res;
        this.sellingTypes = sellingTypes.data.types;
        this.services = services.data;
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
      type: "",
      sellingTypes: [],
      services: {
        services: [],
        count: 0,
      },
      page: {
        limit: 10,
        page: 1,
      },
    };
  },
  methods: {
    fetchServices() {
      let params = this.page;
      if (this.status !== "") {
        params = { ...params, active: this.status };
      }
      if (this.type !== "") {
        params = { ...params, type: this.type };
      }
      if (this.searchValue !== "") {
        params = { ...params, search: this.searchValue.toLowerCase() };
      }

      this.$axios
        .get("/services", { params })
        .then((res) => {
          this.services = res.data;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        });
    },
    handleSizeChange(val) {
      this.page.limit = val;
      this.fetchServices();
    },
    changeActive({ id, active }) {
      const action = active ? "desactivar" : "activar";
      this.$confirm(
        `¿Estás seguro que deseas ${action} este servicio?`,
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
                .put(`/services/status/${id}`, { status: !active })
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchServices();
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
    deleteService({ id }) {
      this.$confirm(
        `¿Estás seguro que deseas eliminar este servicio?`,
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
                .delete(`/services/${id}`)
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchServices();
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

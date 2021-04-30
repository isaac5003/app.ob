<template>
  <layout-content
    v-loading="pageloading"
    page-title="Listado de servicios"
    :breadcrumb="[
      { name: 'Servicios', to: '/services' },
      { name: 'Listado de servicios', to: null },
    ]"
  >
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
      <el-form label-position="top">
        <div class="grid grid-cols-12 gap-4">
          <el-form-item class="col-span-3" label="Estado">
            <el-select
              v-model="filter.status"
              placeholder="Seleccionar"
              size="small"
              class="w-full"
              clearable
              default-first-option
              @change="fetchServices"
            >
              <el-option label="Todos los estados" value="" />
              <el-option label="Activo" :value="true" />
              <el-option label="Inactivo" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item class="col-span-3" label="Tipo de venta">
            <el-select
              v-model="filter.type"
              placeholder="Seleccionar"
              size="small"
              class="w-full"
              clearable
              default-first-option
              @change="fetchServices"
            >
              <el-option label="Todos los tipos" value="" />
              <el-option
                v-for="item in sellingTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="col-start-10 col-span-4" label="">
            <el-input
              style="margin-top: 22px"
              suffix-icon="el-icon-search"
              placeholder="Buscar..."
              v-model="filter.searchValue"
              size="small"
              clearable
              v-debounce:500ms="fetchServices"
              @change="fetchServices"
            />
          </el-form-item>
        </div>
      </el-form>

      <el-table
        @sort-change="sortBy"
        v-loading="tableloading"
        :data="services.services"
        stripe
        size="mini"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="index" width="50" label="#" />
        <el-table-column
          label="Descripción"
          prop="description"
          min-width="430"
          sortable="custom"
        />
        <el-table-column
          label="Precio"
          width="120"
          align="right"
          sortable="custom"
          prop="cost"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.cost | formatMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Tipo de venta"
          prop="sellingType"
          width="130"
          sortable="custom"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.sellingType.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Estado"
          prop="active"
          width="110"
          sortable="custom"
        >
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.active">
              <i class="el-icon-success"></i>
              Activo</el-tag
            >
            <el-tag size="small" type="warning" v-else>
              <i class="el-icon-remove"></i>
              Inactivo</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label width="70" align="center">
          <!-- dropdpwn selecction -->
          <template slot="header" v-if="multipleSelection.length > 0">
            <el-dropdown slot="dropdown">
              <el-button
                trigger="click"
                icon="el-icon-more"
                type="primary"
                size="small"
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
                <el-dropdown-item
                  @click.native="
                    $router.push(`/services/edit?ref=${scope.row.id}`)
                  "
                >
                  <i class="el-icon-edit-outline"></i> Editar servicio
                </el-dropdown-item>
                <el-dropdown-item @click.native="changeActive(scope.row)">
                  <span v-if="scope.row.active">
                    <i class="el-icon-close"></i> Desactivar
                  </span>
                  <span v-else> <i class="el-icon-check"></i> Activar </span>
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
  head: {
    titleTemplate: `%s | Servicios`,
  },
  components: { LayoutContent, Notification },
  fetch() {
    const sellingTypes = () => this.$axios.get("/services/selling-types");
    const services = () => this.$axios.get("/services", { params: this.page });

    Promise.all([sellingTypes(), services()])
      .then((res) => {
        const [sellingTypes, services] = res;
        this.sellingTypes = sellingTypes.data.types;
        this.services = services.data;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message;
      })
      .then((alw) => (this.pageloading = false));
  },
  fetchOnServer: false,
  data() {
    return {
      multipleSelection: [],
      pageloading: true,
      tableloading: false,
      errorMessage: "",
      filter: {
        searchValue: "",
        status: "",
        type: "",
        prop: "",
        order: null,
      },
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    fetchServices() {
      this.tableloading = true;
      let params = this.page;
      if (this.filter.status !== "") {
        params = { ...params, active: this.filter.status };
      }
      if (this.filter.type !== "") {
        params = { ...params, type: this.filter.type };
      }
      if (this.filter.searchValue !== "") {
        params = { ...params, search: this.filter.searchValue.toLowerCase() };
      }
      if (this.filter.order) {
        params = {
          ...params,
          prop: this.filter.prop,
          order: this.filter.order,
        };
      }

      this.$axios
        .get("/services", { params })
        .then((res) => {
          this.services = res.data;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        })
        .then((alw) => (this.tableloading = false));
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
                  console.log(err);
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
    sortBy({ column, prop, order }) {
      this.filter.prop = prop;
      this.filter.order = order;
      this.fetchServices();
    },
  },
};
</script>


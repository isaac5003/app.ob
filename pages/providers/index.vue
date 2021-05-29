<template>
  <layout-content
    v-loanding="pageloading"
    page-title="Listado de proveedores"
    :breadcrumb="[
      { name: 'Proveedores', to: '/providers' },
      { name: 'Listado de Proveedores', to: null },
    ]"
  >
    <el-dialog
      title="Vista previa"
      :visible.sync="showProviderPreview"
      width="900px"
      :append-to-body="true"
    >
      <div class="flex flex-col space-y-2 text-xs">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-6 flex flex-col">
            <span class="font-semibold">Nombre o razón social</span>
            <span>{{ selectedProvider ? selectedProvider.name : "" }}</span>
          </div>
          <div class="col-span-2 flex flex-col">
            <span class="font-semibold">Identificador</span>
            <span>{{
              selectedProvider ? selectedProvider.shortName : ""
            }}</span>
          </div>
          <div class="col-span-2 flex flex-col">
            <span class="font-semibold">Estado</span>
            <div v-if="selectedProvider">
              <el-tag
                size="small"
                type="success"
                v-if="selectedProvider.isActiveProvider"
                >Activo</el-tag
              >
              <el-tag size="small" type="warning" v-else>Inactivo</el-tag>
            </div>
          </div>
         
          <div class="col-span-2 flex flex-col" v-if="hasModule()">
            <span class="font-semibold">Es cliente</span>

            <el-tag size="small" type="warning" class="w-auto">{{
              selectedProvider
                ? selectedProvider.isCustomer
                  ? "SI"
                  : "NO"
                : ""
            }}</el-tag>
          </div>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <div
            class="col-span-2 flex flex-col"
            v-if="selectedProvider && selectedProvider.customerType.id == 2"
          >
            <span class="font-semibold">DUI</span>
            <span>{{ selectedProvider ? selectedProvider.dui : "" }}</span>
          </div>
          <div class="col-span-3 flex flex-col">
            <span class="font-semibold">NIT</span>
            <span>{{ selectedProvider ? selectedProvider.nit : "" }}</span>
          </div>
          <template
            v-if="
              selectedProvider &&
              (!selectedProvider.customerTypeNatural ||
                selectedProvider.customerTypeNatural.id == 2)
            "
          >
            <div class="col-span-2 flex flex-col">
              <span class="font-semibold">NRC</span>
              <span>{{ selectedProvider ? selectedProvider.nrc : "" }}</span>
            </div>
            <div class="col-span-5 flex flex-col">
              <span class="font-semibold">GIRO</span>
              <span>{{ selectedProvider ? selectedProvider.giro : "" }}</span>
            </div>
          </template>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-3 flex flex-col">
            <span class="font-semibold">Tipo de cliente</span>
            <span>{{
              selectedProvider ? selectedProvider.customerType.name : ""
            }}</span>
          </div>
          <div
            class="col-span-3 flex flex-col"
            v-if="selectedProvider && selectedProvider.customerTaxerType"
          >
            <span class="font-semibold">Tipo de contribuyente</span>
            <span>{{
              selectedProvider && selectedProvider.customerTaxerType
                ? selectedProvider.customerTaxerType.name
                : ""
            }}</span>
          </div>
          <div
            class="col-span-3 flex flex-col"
            v-if="selectedProvider && selectedProvider.customerTaxerType == 2"
          >
            <span class="font-semibold">Tipo de persona natural</span>

            <span>{{ selectedProvider.customerTypeNatural.name }}</span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showProviderPreview = false" size="small"
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
        <el-form-item class="col-span-2" label="Estado">
          <el-select
            v-model="status"
            placeholder="Seleccionar"
            size="small"
            class="w-full"
            clearable
            default-first-option
            @change="fetchProviders"
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
            v-debounce:500ms="fetchProviders"
            @change="fetchProviders"
          />
        </el-form-item>
      </el-form>
      <el-table
        @sort-change="sortBy"
        :data="providers.data"
        stripe
        size="mini"
        v-loading="tableloading"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="index" label="#" width="50" />
        <el-table-column
          label="Nombre"
          min-width="310"
          sortable="custom"
          prop="name"
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
          prop="isActiveProvider"
          sortable="custom"
        >
          <template slot-scope="scope">
            <el-tag
              size="small"
              type="success"
              v-if="scope.row.isActiveProvider"
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
        <el-table-column label width="70" align="center">
          <template slot="header" v-if="multipleSelection.length > 0">
            <el-dropdown>
              <el-button type="primary" icon="el-icon-more"></el-button>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <el-dropdown trigger="click" szie="mini">
              <el-button icon="el-icon-more" size="mini" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="openProviderPreview(scope.row)"
                >
                  <i class="el-icon-view"></i> Vista previa
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="
                    $router.push(`/providers/edit?ref=${scope.row.id}`)
                  "
                >
                  <i class="el-icon-edit-outline"></i> Editar proveedor
                </el-dropdown-item>
                <el-dropdown-item @click.native="changeActive(scope.row)">
                  <span v-if="scope.row.isActiveProvider">
                    <i class="el-icon-close"></i> Desactivar
                  </span>
                  <span v-else> <i class="el-icon-check"></i> Activar </span>
                  proveedor
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
                  @click.native="deleteProvider(scope.row)"
                >
                  <i class="el-icon-delete"></i> Eliminar proveedor
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="fetchProviders"
          :current-page.sync="page.page"
          :page-sizes="[5, 10, 15, 25, 50, 100]"
          :page-size="page.size"
          layout="total, sizes, prev, pager, next"
          :total="parseInt(providers.count)"
          :pager-count="5"
        />
      </div>
    </div>
  </layout-content>
</template>
<script>
//Import components
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
import { hasModule } from "../../tools/index.js";
export default {
  name: "ProvidersIndex",
  head: {
    titleTemplate: `%s | Proveedores`,
  },
  components: { LayoutContent, Notification },
  fetch() {
    const providers = () => {
      return this.$axios.get("/providers", { params: this.page });
    };

    Promise.all([providers()])
      .then((res) => {
        const [providers] = res;
        this.providers = providers.data;

        this.pageloading = false
        this.tableloading = false
      })
      .catch((err) => {
        this.errorMessage = err.respose.data.message;
      })
      .then((alw) => (this.pageloadign = false));
  },
  fetchOnServer: false,

  data() {
    return {
      pageloading: true,
      tableloading: true,
      errorMessage: "",
      searchValue: "",
      status: "",
      multipleSelection: [],
      sellingTypes: [],
      providers: {
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
      showProviderPreview: false,
      selectedProvider: null,
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    fetchProviders() {
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
        .get("/providers", { params })
        .then((res) => {
          this.providers = res.data;
        })
        .catch((err) => {
          this.errorMessage = err.resposne.data.message;
        })
        .then((alw) => (this.tableloading = false));
    },
    handleSizeChange(val) {
      this.page.limit = val;
      this.fetchProviders();
    },
      changeActive({ id, isActiveProvider }) {
      const action = isActiveProvider ? "desactivar" : "activar";
      this.$confirm(
        `¿Estás seguro que deseas ${action} este proveedor?`,
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
                .put(`/providers/status/${id}`, {
                  isActiveProvider: !isActiveProvider,
                })
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchProviders();
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
    deleteProvider({ id }) {
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
                .delete(`/providers/${id}`)
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchProviders();
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
    async openProviderPreview({ id }) {
      const { data } = await this.$axios.get(`/providers/${id}`);
      (this.selectedProvider = data.data),
        (this.showProviderPreview = true);
    },
    hasModule() {
      return hasModule("9ff0b6f4-9c58-475b-b2dd-5eea6d7b66aa", this.$auth.user);
    },
    sortBy({ column, prop, order }) {
      this.filter.prop = prop;
      this.filter.order = order;
      this.fetchProviders();
    },
  },

};
</script>
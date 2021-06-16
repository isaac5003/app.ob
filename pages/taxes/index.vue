<template>
  <layout-content
    v-loading="loading"
    page-title="Listado de IVA"
    :breadcrumb="[
      { name: 'IVA', to: '/taxes' },
      { name: 'Listado de IVA', to: null },
    ]"
  >
    <el-dialog
      title="Vista previa"
      size="mini"
      :visible.sync="showTaxePreview"
      width="900px"
      :append-to-body="true"
    >
      <div class="flex flex-col space-y-6">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-2 flex flex-col">
            <span class="text-gray-700 font-bold text-xs">Cliente</span>
            <span class="">
              {{
                Object.keys(taxesPreview).length > 0
                  ? taxesPreview.customer.name
                  : ""
              }}
            </span>
          </div>
          <div class="col-span-2 flex flex-col">
            <span class="text-gray-700 font-bold text-xs">Fecha</span>
            <span class=""
              >{{
                Object.keys(taxesPreview).length > 0
                  ? taxesPreview.invoiceDate
                  : ""
              }}
            </span>
          </div>
          <div class="col-span-2 flex flex-col">
            <span class="text-gray-700 font-bold text-xs"
              >Tipo de registro</span
            >
            <span class="">
              {{
                Object.keys(taxesPreview).length > 0
                  ? taxesPreview.registerType
                  : ""
              }}</span
            >
          </div>
          <div class="col-span-3 flex flex-col">
            <span class="text-gray-700 font-bold text-xs"
              >Tipo de Documento</span
            >
            <span class="">
              {{
                Object.keys(taxesPreview).length > 0
                  ? taxesPreview.documentType.name
                  : ""
              }}</span
            >
          </div>
          <div class="col-span-3 flex flex-col">
            <span class="text-gray-700 font-bold text-xs"
              >N° de Autorización</span
            >
            <span class="">
              {{
                Object.keys(taxesPreview).length > 0
                  ? taxesPreview.authorization
                  : ""
              }}</span
            >
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-3 flex flex-col">
            <span class="text-gray-700 font-bold text-xs">Correlativo</span>
            <span class="">
              {{
                Object.keys(taxesPreview).length > 0
                  ? taxesPreview.sequence
                  : ""
              }}
            </span>
          </div>
          <div class="col-span-2 flex flex-col">
            <span class="text-gray-700 font-bold text-xs">IVA</span>
            <span class=""
              >{{
                Object.keys(taxesPreview).length > 0 ? taxesPreview.iva : ""
              }}
            </span>
          </div>
          <div class="col-span-2 flex flex-col">
            <span class="text-gray-700 font-bold text-xs">Sub Total</span>
            <span class="">{{
              Object.keys(taxesPreview).length > 0
                ? `$ ${taxesPreview.subtotal}`
                : ""
            }}</span>
          </div>
          <div class="col-span-2 flex flex-col">
            <span class="text-gray-700 font-bold text-xs">IVA retenido</span>
            <span class=""> $0</span>
          </div>
          <div class="col-span-3 flex flex-col">
            <span class="text-gray-700 font-bold text-xs">Total</span>
            <span class="">
              {{
                Object.keys(taxesPreview).length > 0
                  ? `$ ${taxesPreview.ventaTotal}`
                  : ""
              }}</span
            >
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="showTaxePreview = false"
          >Cerrar</el-button
        >
      </span>
    </el-dialog>

    <div class="flex flex-col space-4">
      <el-form :model="taxesForm" ref="taxesForm">
        <div class="grid grid-cols-12 gap-4">
          <el-form-item class="col-span-4 col-start-9">
            <el-input
              suffix-icon="el-icon-search"
              placeholder="Buscar..."
              size="small"
              v-model="taxesForm.search"
              v-debounce:500ms="fetchTaxes"
              @change="fetchTaxes()"
            ></el-input>
          </el-form-item>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <el-form-item label="Rango de fechas:" class="col-span-4">
            <el-date-picker
              style="width: 100%"
              size="small"
              v-model="taxesForm.date"
              type="daterange"
              align="left"
              unlink-panels
              range-separator="-"
              start-placeholder="Fecha inicio"
              end-placeholder="Fecha final"
              :editable="false"
              format="dd/MM/yyyy"
              value-format="yyyy-MM-dd"
              @change="fetchTaxes"
            />
          </el-form-item>
          <template>
            <el-form-item label="Cliente:" class="col-span-4">
              <el-select
                v-model="taxesForm.customer"
                size="small"
                class="w-full"
                clearable
                filterable
                default-first-option
                placeholder="Todos los clientes:"
                @change="fetchTaxes"
              >
                <el-option label="Todos los clientes" value="" />
                <el-option-group key="ACTIVOS" label="ACTIVOS">
                  <el-option
                    style="height: 60px"
                    v-for="item in activeCustomers"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                    <div
                      class="
                        flex flex-row
                        justify-between
                        items-end
                        py-1
                        leading-normal
                      "
                    >
                      <div class="flex flex-col">
                        <span class="text-xs text-gray-500">{{
                          item.shortName
                        }}</span>
                        <span>{{ item.name }}</span>
                      </div>
                      <span class="text-xs text-gray-500">{{ item.nrc }}</span>
                    </div>
                  </el-option>
                </el-option-group>
                <!-- toda esbien -->
                <el-option-group key="INACTIVOS" label="INACTIVOS">
                  <el-option
                    style="height: 50px"
                    v-for="item in inactiveCustomers"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                    <div
                      class="
                        flex flex-row
                        justify-between
                        items-end
                        py-1
                        leading-normal
                      "
                    >
                      <div class="flex flex-col">
                        <span class="text-xs text-gray-500">{{
                          item.shortName
                        }}</span>
                        <span>{{ item.name }}</span>
                      </div>
                      <span class="text-xs text-gray-500">{{ item.nrc }}</span>
                    </div>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item label="Proveedores:" class="col-span-4">
            <el-select
              class="w-full"
              size="small"
              filterable
              clearable
              v-model="taxesForm.provider"
              @change="fetchTaxes"
            >
              <el-option label="Todos los proveedores" value="" />
              <el-option-group key="ACTIVOS" label="ACTIVOS">
                <el-option
                  v-for="item in activeProviders"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                  <div
                    class="
                      flex flex-row
                      justify-between
                      items-end
                      py-1
                      leading-normal
                    "
                  >
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500">{{
                        item.shortName
                      }}</span>
                      <span>{{ item.name }}</span>
                    </div>
                    <span class="text-xs text-gray-500">{{ item.nrc }}</span>
                  </div>
                </el-option>
              </el-option-group>
              <el-option-group key="INACTIVOS" label="INACTIVOS">
                <el-option
                  style="height: 50px"
                  v-for="item in inactiveProviders"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                  <div
                    class="
                      flex flex-row
                      justify-between
                      items-end
                      py-1
                      leading-normal
                    "
                  >
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500">{{
                        item.shortName
                      }}</span>
                      <span>{{ item.name }}</span>
                    </div>
                    <span class="text-xs text-gray-500">{{ item.nrc }}</span>
                  </div>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <el-form-item label="Tipo de registro:" class="col-span-4">
            <el-select
              class="w-full"
              size="small"
              filterable
              clearable
              v-model="taxesForm.registerType"
              @change="fetchTaxes"
            >
              <el-option
                v-for="i in registerType"
                :key="i.id"
                :label="i.name"
                :value="i.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Tipo de documento:" class="col-span-3">
            <el-select
              class="w-full"
              size="small"
              filterable
              clearable
              v-model="taxesForm.documentType"
              :disabled="taxesForm.registerType ? false : true"
              @change="fetchTaxes"
              ><el-option
                v-for="i in documentTypes"
                :key="i.id"
                :label="i.name"
                :value="i.id"
            /></el-select>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-table
      @sort-change="sortBy"
      :data="taxesList.data"
      stripe
      size="mini"
      ref="multipleTable"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column label="#" width="40" prop="index" />
      <el-table-column
        label="Fecha"
        width="90"
        prop="date"
        sortable="custom"
      ></el-table-column>
      <el-table-column
        label="Proveedor/cliente"
        min-width="190"
        prop="name"
        sortable="custom"
      ></el-table-column>
      <el-table-column
        label="N° autorización"
        width="140"
        prop="authorization"
        sortable="custom"
      ></el-table-column>
      <el-table-column
        label="Tipo de documento"
        width="165"
        prop="documentType"
        sortable="custom"
      ></el-table-column>
      <el-table-column
        label="Tipo de registro"
        width="140"
        prop="registerType"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.registerType == "invoices" ? "Venta" : "Compra"
          }}</span>
        </template></el-table-column
      >
      <el-table-column label="IVA" width="70" prop="iva" sortable="custom">
        <template slot-scope="scope">
          <span>{{ scope.row.iva | formatMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column label width="80" align="center">
        <!-- dropdpwn selecction -->
        <template slot="header" v-if="selectionData.length">
          <el-dropdown trigger="click" szie="mini" type="primary">
            <el-button size="mini" type="primary">
              <i class="el-icon-more"
            /></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="font-semibold">
                <i class="el-icon-delete"></i> Eliminar
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <!-- dropdown 1 -->
        <template slot-scope="scope">
          <el-dropdown trigger="click" szie="mini">
            <el-button icon="el-icon-more" size="mini" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="openPreviewEntry(scope.row.id)">
                <i class="el-icon-view"></i> Vista previa
              </el-dropdown-item>
              <el-dropdown-item @click.native="$router.push(`/taxes/edit`)">
                <i class="el-icon-edit-outline"></i> Editar
              </el-dropdown-item>
              <el-dropdown-item
                v-if="
                  scope.row.origin == '53a36e54-bab2-4824-9e43-b40efab8bab9'
                "
                :divided="true"
                class="text-red-500 font-semibold"
                @click.native="deleteTaxe(scope.row.id)"
              >
                <i class="el-icon-delete"></i> Eliminar
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-end">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="fetchTaxes"
        :current-page.sync="page.page"
        :page-sizes="[5, 10, 15, 25, 50, 100]"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next"
        :total="parseInt(taxesList.count)"
        :pager-count="5"
      />
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
import { parseErrors } from "../../tools";
export default {
  name: "IVAIndex",
  head: {
    titleTemplate: `%s | IVA`,
  },
  components: { LayoutContent, Notification },
  fetch() {
    const customers = () => this.$axios.get("/customers");
    const providers = () => {
      return this.$axios.get("/providers");
    };
    const taxes = () => this.$axios.get("/taxes", { params: this.page });
    Promise.all([customers(), providers(), taxes()]).then((res) => {
      const [customers, providers, taxes] = res;
      this.customers = customers.data.data;
      this.providers = providers.data.data;
      this.taxesList = taxes.data;
      this.loading = false;
    });
  },
  fetchOnServer: false,
  data() {
    return {
      loading: true,
      page: {
        limit: 10,
        page: 1,
      },
      showTaxePreview: false,
      taxesPreview: {},
      selectionData: {},
      customers: [],
      providers: [],
      taxesForm: {
        search: "",
        date: "",
        customer: "",
        provider: "",
        registerType: "",
        documentType: "",
        prop: "",
        order: null,
      },
      documentTypes: [
        {
          id: 1,
          name: "FCF - Consumidor Final",
        },
        {
          id: 2,
          name: "CFC - Crédito Fiscal",
        },
      ],
      registerType: [
        {
          id: "purchases",
          name: "Crédito Fiscal",
        },
        {
          id: "invoices",
          name: "Débito Fiscal",
        },
      ],
      taxesList: {
        data: [],
        count: 0,
      },
    };
  },
  methods: {
    handleSizeChange(val) {
      this.page.limit = val;
      //this.fetchEntries();
    },
    async openPreviewEntry(id) {
      console.log(id);
      const { data } = await this.$axios.get(`/taxes/${id}`);
      this.taxesPreview = data.data;
      console.log(this.taxesPreview);
      this.showTaxePreview = true;
    },
    selectionChange(selectionData) {
      this.selectionData = selectionData;
    },
    fetchTaxes() {
      let params = this.page;
      if (this.taxesForm.date !== null) {
        params = {
          ...params,
          startDate: this.taxesForm.date[0],
          endDate: this.taxesForm.date[1],
        };
      }
      if (this.taxesForm.customer != "") {
        params = {
          ...params,
          customer: this.taxesForm.customer,
        };
      }
      if (this.taxesForm.provider != "") {
        params = {
          ...params,
          customer: this.taxesForm.provider,
        };
      }
      if (this.taxesForm.search != "") {
        params = {
          ...params,
          search: this.taxesForm.search.toLowerCase(),
        };
      }
      if (this.taxesForm.documentType != "") {
        params = {
          ...params,
          documentType: this.taxesForm.documentType,
        };
      }
      if (this.taxesForm.registerType != "") {
        params = {
          ...params,
          registerType: this.taxesForm.registerType,
        };
      }
      if (this.taxesForm.order) {
        params = {
          ...params,
          prop: this.taxesForm.prop,
          order: this.taxesForm.order,
        };
      }
      this.$axios
        .get("/taxes/", { params })
        .then((res) => {
          console.log(res);
          this.taxesList = res.data;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        });
    },
    sortBy({ column, prop, order }) {
      this.taxesForm.prop = prop;
      this.taxesForm.order = order;
      this.fetchTaxes();
    },
    deleteTaxe(id) {
      this.$confirm(
        `¿Estás seguro que deseas eliminar este registro?`,
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
                .delete(`/taxes/${id}`)
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchTaxes();
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
  computed: {
    activeCustomers() {
      return this.customers.filter((c) => c.isActiveCustomer);
    },
    inactiveCustomers() {
      return this.customers.filter((c) => !c.isActiveCustomer);
    },
    activeProviders() {
      return this.providers.filter((c) => c.isActiveProvider);
    },
    inactiveProviders() {
      return this.providers.filter((c) => !c.isActiveProvider);
    },
  },
};
</script>
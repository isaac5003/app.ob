<template>
  <layout-content
    v-loading="loading"
    page-title="Listado de ventas"
    :breadcrumb="[
      { name: 'Ventas', to: '/invoices' },
      { name: 'Listado de ventas', to: null },
    ]"
  >
    <div class="flex flex-col space-y-4">
      <Notification
        v-if="errorMessage"
        class="w-full"
        type="danger"
        title="Error de comunicación"
        :message="errorMessage"
      />
      <el-form label-position="top" class="flex flex-col ">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-start-10 col-span-3">
            <el-form-item>
              <el-input
                suffix-icon="el-icon-search"
                placeholder="Buscar..."
                v-model="searchValue"
                size="small"
                clearable
                v-debounce:500ms="fetchInvoices"
                @change="fetchInvoices"
              />
            </el-form-item>
          </div>
        </div>
        <!-- Colocamos los input corespondientes-->
        <!--No hay etiquetas que agregar-->
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-4">
            <el-form-item label="Rango de fechas:">
              <el-date-picker
                v-model="filter.dateRange"
                style="width:100%"
                size="small"
                type="daterange"
                range-separator="-"
                start-placeholder="Fecha inicial"
                end-placeholder="Fecha final"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="col-span-4">
            <el-form-item label="Cliente:">
              <el-select
                v-model="filter.customer"
                size="small"
                class="w-full"
                clearable
                filterable
                default-first-option
                placeholder="Todos los clientes:"
              >
                <el-option-group key="ACTIVOS" label="ACTIVOS">
                  <el-option
                  label="Todos los clientes"
                  value=""/>
                  <el-option
                    v-for="item in activeCustomers"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-option-group>
                <el-option-group key="INACTIVOS" label="INACTIVOS">
                  <el-option
                    v-for="item in inactiveCustomers"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item label="Tipo fact:">
              <el-select
                v-model="filter.invoiceType"
                size="small"
                clearable
                placeholder="Todos los tipos:"
                class="w-full"
              >
              <el-option label="Todos los tipos" value=""/>
                <el-option
                  v-for="item in documentTypes"
                  :key="item.id"
                  :label="`${item.code} - ${item.name}`"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item label="Estado:">
              <el-select
                v-model="filter.status"
                size="small"
                clearable
                placeholder="Todos los estados:"
                class="w-full"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <!-- div vendedor, zona servicio-->
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-3">
            <el-form-item label="Vendedor:">
              <el-select
                v-model="filter.seller"
                size="small"
                clearable
                filterable
                default-first-option
                placeholder="Todos los clientes:"
                class="w-full"
              >
                <el-option-group key="ACTIVOS" label="ACTIVOS">
                    <el-option label="Todos los clientes" value=""/>
                  <el-option
                    v-for="item in activeSellers"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-option-group>
                <el-option-group key="INACTIVOS" label="INACTIVOS">
                  <el-option
                    v-for="item in inactiveSellers"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-3">
            <el-form-item label="Zona:">
              <el-select
                v-model="filter.zone"
                size="small"
                clearable
                filterable
                default-first-option
                placeholder="Todos las Zonas"
                class="w-full"
              >
                <el-option-group key="ACTIVOS" label="ACTIVOS">
                    <el-option label="Tados las zonas" value=""/>
                  <el-option
                    v-for="item in activeZones"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-option-group>
                <el-option-group key="INACTIVOS" label="INACTIVOS">
                  <el-option
                    v-for="item in inactiveZones"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </div>
          <div class=" col-span-3">
            <el-form-item label="Servicios:">
              <el-select
                v-model="filter.service"
                size="small"
                clearable
                default-first-option
                placeholder="Todos los servicios"
                class="w-full"
              >
                <el-option-group key="ACTIVOS" label="ACTIVOS">
                    <el-option label="Todos los servicios" value=""/>
                  <el-option
                    v-for="item in activeService"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-option-group>
                <el-option-group key="INACTIVOS" label="INACTIVOS">
                  <el-option
                    v-for="item in inactiveService"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <el-table :data="invoices" stripe size="small">
        <el-table-column prop="index" min-width="40" />
        <el-table-column label="# Factura" prop="factura" min-width="120" />
        <el-table-column label="Tipo fact." prop="tipof" min-width="75" />
        <el-table-column label="Fecha" prop="fecha" min-width="100" />
        <el-table-column label="Cliente" prop="cliente" min-width="350" />
        <el-table-column label="Estado" prop="true" min-width="80">
          <template slot-scope="scope">
            <el-tag size="small" type="success" v-if="scope.row.isActiveInvoice"
              >Activo</el-tag
            >
            <el-tag size="small" type="warning" v-else>Inactivo</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="total" prop="total" min-width="80" />
        <el-table-column label min-width="60" align="center">
          <template slot-scope="scope">
            <el-dropdown trigger="click" szie="mini">
              <el-button icon="el-icon-more" size="mini" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="openInvoicePreview(scope.row)">
                  <i class="el-icon-view"></i> Vista previa
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="
                    $router.push(`/invoices/edit?ref=${scope.row.id}`)
                  "
                >
                  <i class="el-icon-edit-outline"></i> Editar factura
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="
                    $router.push(`/invoices/edit?ref=${scope.row.id}`)
                  "
                >
                  <i class="el-icon-printer"></i>Imprimir factura
                </el-dropdown-item>
                <!-- <el-dropdown-item @click.native="changeActive(scope.row)">
                  <span v-if="scope.row.isActiveInvoice">
                    <i class="el-icon-close"></i> Desactivar
                  </span>
                  <span v-else> <i class="el-icon-check"></i> Activar </span>
                  cliente
                </el-dropdown-item> -->
                <el-dropdown-item
                  :divided="true"
                  class="text-red-500 font-semibold"
                  @click.native="deleteInvoice(scope.row)"
                >
                  <i class="el-icon-delete"></i>Eliminar factura
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end">
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
      </div>
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
export default {
  name: "InvoicesIndex",
  components: { LayoutContent, Notification },
  fetch() {
    const activeCustomers = () =>
      this.$axios.get("/customers", { params: { active: true } });
    const inactiveCustomers = () =>
      this.$axios.get("/customers", { params: { active: false } });
    const documentTypes = () => this.$axios.get("/invoices/document-types");
    const activeSellers = () =>
      this.$axios.get("/invoices/sellers", { params: { active: true } });
    const inactiveSellers = () =>
      this.$axios.get("/invoices/sellers", { params: { active: false } });
    const activeZones = () =>
      this.$axios.get("/invoices/zones", { params: { active: true } });
    const inactiveZones = () =>
      this.$axios.get("/invoices/zones", { params: { active: false } });
    const activeService = () =>
      this.$axios.get("/services", { params: { active: true } });
    const inactiveService = () =>
      this.$axios.get("/services", { params: { active: false } });

    Promise.all([
      activeCustomers(),
      inactiveCustomers(),
      activeSellers(),
      inactiveSellers(),
      activeZones(),
      inactiveZones(),
      activeService(),
      inactiveService(),
      documentTypes(),
    ])
      .then((res) => {
        const [
          activeCustomers,
          inactiveCustomers,
          activeSellers,
          inactiveSellers,
          activeZones,
          inactiveZones,
          activeService,
          inactiveService,
          documentTypes,
        ] = res;
        this.activeCustomers = activeCustomers.data.customers;
        this.inactiveCustomers = inactiveCustomers.data.customers;
        this.documentTypes = documentTypes.data.documentTypes;
        this.activeSellers = activeSellers.data.sellers;
        this.inactiveSellers = inactiveSellers.data.sellers;
        this.activeZones = activeZones.data.zones;
        this.inactiveZones = inactiveZones.data.zones;
        this.activeService = activeService.data.services;
        this.inactiveService = inactiveService.data.services;
        this.loading = false;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message
          ? err.response.data.message
          : "Comunicate con el administrador del sistema.";
      });
  },
  fetchOnServer: false,
  data() {
    return {
      loading: false,
      errorMessage:  "",
      filter:{
      dateRange:"",
      customer:"",
      invoiceType:"",
      status:"",
      seller:"",
      zone:"",
      service:"",
      },

      value: "",
      page: {
        limit: 10,
        page: 1,
      },
      invoices: [
        {
          index: 1,
          factura: "16SD000C - 156",
          tipof: "CFC",
          fecha: "21/12/2020",
          cliente: "INSTITUTO SALVADOREÑO DE FORMACION PROFESIONAL",
          Estado: true,
          total: "$300.00",
        },
        {
          index: 1,
          factura: "16SD000C - 156",
          tipof: "CFC",
          fecha: "21/12/2020",
          cliente: "INSTITUTO SALVADOREÑO DE FORMACION PROFESIONAL",
          Estado: true,
          total: "$300.00",
        },
        {
          index: 1,
          factura: "16SD000C - 156",
          tipof: "CFC",
          fecha: "21/12/2020",
          cliente: "INSTITUTO SALVADOREÑO DE FORMACION PROFESIONAL",
          Estado: true,
          total: "$300.00",
        },
        {
          index: 1,
          factura: "16SD000C - 156",
          tipof: "CFC",
          fecha: "21/12/2020",
          cliente: "INSTITUTO SALVADOREÑO DE FORMACION PROFESIONAL",
          Estado: true,
          total: "$300.00",
        },
      ],

      activeCustomers:   [],
      inactiveCustomers: [],
      documentTypes:     [],
      activeSellers:     [],
      inactiveSellers:   [],
      activeZones:       [],
      inactiveZones:     [],
      activeService:     [],
      inactiveService:   [],
    };
  },
  methods: {
    handleSizeChange(val) {
      this.page.limit = val;
    },
  },
};
</script>

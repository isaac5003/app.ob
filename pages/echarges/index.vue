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
          <el-form-item label="Tipo de documento:" class="col-span-2">
            <el-select
              v-model="filter.documentType"
              size="small"
              clearable
              placeholder="Seleccionar:"
              class="w-full"
            >
              <el-option label="Todos los tipos" value="" />
              <el-option
                v-for="item in documentTypes"
                :key="item.id"
                :label="`${item.code} - ${item.name}`"
                :value="item.id"
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
          :data="charges"
          stripe
          size="mini"
          v-loading="tableloading"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" />
          <el-table-column
            label="Correlativo"
            prop="sequence"
            width="120"
            sortable="custom"
          >
          </el-table-column>
          <el-table-column
            label="Tipo"
            prop="documentType"
            width="100"
            sortable="custom"
          >
          </el-table-column>
          <el-table-column
            label="Fecha"
            prop="date"
            width="100"
            sortable="custom"
          />
          <el-table-column
            label="Cliente"
            prop="customerName"
            min-width="275"
            sortable="custom"
          />
          <el-table-column label="Estado" width="130" sortable="custom">
            <template slot-scope="scope">
              <el-tag
                size="small"
                type="info"
                v-if="scope.row.status.id == '1'"
              >
                <i class="el-icon-warning"></i>
                {{ scope.row.status.name }}
              </el-tag>
              <el-tag
                size="small"
                type="warning"
                v-else-if="scope.row.status.id == '2'"
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
          >
            <template slot-scope="scope">
              <span>{{ scope.row.total | formatMoney }}</span>
            </template>
          </el-table-column>
          <el-table-column label width="110" align="center">
            <template slot="header" v-if="multipleSelection.length > 0">
              <el-dropdown trigger="click" szie="mini">
                <el-button type="primary" size="mini">
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
                  <el-dropdown-item v-if="scope.row.status.id == 1">
                    <i class="el-icon-s-promotion"></i> Enviar cobro
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="
                      $router.push(`/echarges/edit?ref=${scope.row.id}`)
                    "
                  >
                    <i class="el-icon-edit-outline"></i> Editar cobros
                  </el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.status.id == 2">
                    <i class="el-icon-s-promotion"></i>Reennviar cobro
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <i class="el-icon-tickets"></i> Bitacora de cobros
                  </el-dropdown-item>
                  <el-dropdown-item :divided="true" class="font-semibold">
                    <i class="el-icon-delete"></i> Eliminar cobro
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
        </div>  -->
      </div>
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
import { numeroALetras, calculatedAmount } from "../../tools";
import jsPDF from "jspdf";
export default {
  name: "EChargesIndex",
  components: { LayoutContent, Notification },
  fetch() {
    const documentTypes = () => this.$axios.get("/invoices/document-types");
    const customers = () => this.$axios.get("/customers");

    Promise.all([documentTypes(), customers()])
      .then((res) => {
        const [documentTypes, customers] = res;
        this.documentTypes = documentTypes.data;
        this.customers = customers.data.data;
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
        documentType: "",
        service: "",
        status: "",
      },
      charges: [
        {
          sequence: 1,
          date: "03/02/2021",
          documentType: "FCF",
          customerName: "BRYAN STEVE AVALOS",
          status: {
            id: 1,
            name: "Sin solicitar",
          },
          total: 2345.65,
        },
        {
          sequence: 2,
          date: "03/02/2021",
          documentType: "FCF",
          customerName: "BRYAN STEVE AVALOS",
          status: {
            id: 2,
            name: "Solicitado",
          },
          total: 2345.65,
        },
      ],
      multipleSelection: [],
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
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

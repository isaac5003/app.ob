<template>
  <layout-content
    page-title="Configuraciones"
    :breadcrumb="[
      { name: 'Clientes', to: '/invoices' },
      { name: 'Configuraciones', to: null },
    ]"
  >
    <el-tabs
      v-model="tab"
      @tab-click="
        $router
          .replace({
            path: `/invoices/settings`,
            query: { tab },
          })
          .catch(() => {})
      "
    >
      <el-tab-pane label="Zonas y vendedores" name="zones-sellers">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-5 flex flex-col space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-blue-900 font-semibold text-lg">ZONAS</span>
              <el-button type="primary" size="mini" icon="el-icon-plus" />
            </div>
            <el-table :data="zones" stripe size="mini">
              <el-table-column prop="index" min-width="40" />
              <el-table-column label="Zona" prop="name" min-width="175" />
              <el-table-column label="Estado" min-width="80">
                <template slot-scope="scope">
                  <el-tag size="small" type="success" v-if="scope.row.active"
                    >Activo</el-tag
                  >
                  <el-tag size="small" type="danger" v-else>Inactivo</el-tag>
                </template>
              </el-table-column>
              <el-table-column label min-width="60" align="center">
                <template slot-scope="scope">
                  <el-dropdown trigger="click" szie="mini">
                    <el-button icon="el-icon-more" size="mini" />
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        @click.native="
                          $router.push(`/invoices/edit?ref=${scope.row.id}`)
                        "
                      >
                        <i class="el-icon-edit-outline"></i> Editar zona
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="changeActive(scope.row)">
                        <span v-if="scope.row.active">
                          <i class="el-icon-close"></i> Desactivar
                        </span>
                        <span v-else>
                          <i class="el-icon-check"></i> Activar
                        </span>
                        zona
                      </el-dropdown-item>
                      <el-dropdown-item
                        :divided="true"
                        class="text-red-500 font-semibold"
                        @click.native="deleteInvoice(scope.row)"
                      >
                        <i class="el-icon-delete"></i> Eliminar zona
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- Inicio de tabla vendedores -->

          <div class="col-span-7 flex flex-col space-y-4">

            <div class="flex justify-between items-center">
              <span class="text-blue-900 font-semibold text-lg">VENDEDORES</span>
              <el-button type="primary" size="mini" icon="el-icon-plus" />
            </div>

            <el-table :data="vendedores" stripe size="mini">
              <el-table-column label="ID" prop="id" min-width="40" />
              <el-table-column label="Vendedor" prop="nombre" min-width="175" />
              <el-table-column label="Zona" prop="zona" min-width="175" />

              <el-table-column label="Estado" min-width="80">
                <template slot-scope="scope">
                  <el-tag size="small" type="success" v-if="scope.row.active"
                    >Activo</el-tag
                  >
                  <el-tag size="small" type="danger" v-else>Inactivo</el-tag>
                </template>
              </el-table-column>
              <el-table-column label min-width="60" align="center">
                <template slot-scope="scope">
                  <el-dropdown trigger="click" szie="mini">
                    <el-button icon="el-icon-more" size="mini" />
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        @click.native="
                          $router.push(`/invoices/edit?ref=${scope.row.id}`)
                        "
                      >
                        <i class="el-icon-edit-outline"></i> Editar vendedor
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="changeActive(scope.row)">
                        <span v-if="scope.row.active">
                          <i class="el-icon-close"></i> Desactivar
                        </span>
                        <span v-else>
                          <i class="el-icon-check"></i> Activar
                        </span>
                        Vendedor
                      </el-dropdown-item>
                      <el-dropdown-item :divided="true" class="text-red-500 font-semibold" @click.native="deleteInvoice(scope.row)">
                        <i class="el-icon-delete"></i> Eliminar Vendedor22
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
              
            </el-table>


          <!-- Fin del div vendedores -->
          </div>



        </div>
      </el-tab-pane>
      <el-tab-pane
        label="Condiciones de pago"
        name="payment-conditions"
      ></el-tab-pane>
      <el-tab-pane label="Correlativos" name="sequences"></el-tab-pane>
      <!-- <el-tab-pane label="Integraciones" name="integrations" class="space-y-3">
        <Notification
          class="w-full"
          type="info"
          title="Integraciones"
          message="En esta sección se realizan las configuraciones de integración con otros modulos de manera general. Estas configuraciones se aplicarán a todos los zonas que no tengan una configuración individual."
        />
        <el-tabs
          tab-position="left"
          v-model="utab"
          @tab-click="
            $router
              .replace({
                path: `/invoices/settings`,
                query: { tab, utab },
              })
              .catch(() => {})
          "
        >
          <el-tab-pane
            v-for="(integration, k) of filteredIntegrations"
            :key="k"
            :name="integration.id"
          >
            <span slot="label" class="flex items-center justify-between"
              ><svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                stroke="currentColor"
                v-html="integration.icon"
              />
              {{ integration.name }}</span
            >
            {{ integration.name }}
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane> -->
    </el-tabs>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
import { getIcon, hasModule } from "../../tools";

export default {
  name: "InvoicesSettings",
  components: { LayoutContent, Notification },
  fetch() {
    // Se ubica en el tab correcto
    if (this.$route.query.tab) {
      this.tab = this.$route.query.tab;
    }
    if (this.$route.query.utab) {
      this.utab = this.$route.query.utab;
    }

    const zones = () => {
      return this.$axios.get("/invoices/zones");
    };

    Promise.all([zones()])
      .then((res) => {
        const [zones] = res;
        this.zones = zones.data.zones;
        this.loading = false;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message;
      });
  },
  fetchOnServer: false,
  data() {
    return {
      tab: "zones-sellers",
      utab: "invoicing",
      integrations: [
        {
          name: "Facturación",
          ref: "cfb8addb-541b-482f-8fa1-dfe5db03fdf4",
          id: "invoicing",
          icon: getIcon("dolar"),
        },
        {
          name: "Contabilidad",
          ref: "a98b98e6-b2d5-42a3-853d-9516f64eade8",
          id: "accounting",
          icon: getIcon("cash"),
        },
      ],
      zones: [],
      vendedores: [
        {
          id: '1',
          nombre: 'Isaac',
          zona: 'San Salvador'
        },
      ]
    };
    
  },
  methods: {
    fetchZones() {
      let params = this.page;
      this.$axios
        .get("/invoices/zones")
        .then((res) => {
          this.zones = res.data.zones;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        });
    },
    changeActive({ id, active }) {
      const action = active ? "desactivar" : "activar";
      this.$confirm(
        `¿Estás seguro que deseas ${action} esta zona?`,
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
                .put(`/invoices/zones/status/${id}`, { status: !active })
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchZones();
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
  },
  computed: {
    filteredIntegrations() {
      return this.integrations.filter((i) => hasModule(i.ref, this.$auth.user));
    },
  },
};
</script>

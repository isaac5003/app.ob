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
          <div class="col-span-7 bg-red-500"></div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="Condiciones de pago"
        name="payment-conditions"
      ></el-tab-pane>


      <el-tab-pane label="Correlativos" name="sequences">
        <div class="grid grid-cols-12 ">
          <!-- primer cuadro -->
          <div class="col-span-4 bg-white">
            <div class="border-2 p-4 border-blue-700 rounded-lg">
              <el-form>
                <!-- first row -->
                <div class="grid grid-cols-12 gap-4  ">
                   
                    <div class="col-span-8 ">
                      <el-label for="" class="font-semibold text-base text-blue-800 ">Consumidor final</el-label>
                    </div>
                      <div class="col-span-2">
                      <el-form-item>
                        <el-switch v-model="value1">
                        </el-switch>
                      </el-form-item>
                    </div>

                   <div class="col-span-2">
                      <el-form-item>
                         <el-button type="primary" icon="el-icon-plus" size="small"></el-button>
                      </el-form-item>
                    </div>
                  </div>
                <!-- second row -->
                <div class="grd grid-cols-12 gap-4">
                  <div class="col-span-12">
                     <div class="isRequired">
                        <el-form-item label="N° de autorización" >
                            <el-input
                              size="small"
                              placeholder=""
                              v-model="input"
                              :disabled="true">
                          </el-input>
                        </el-form-item>
                      </div>
                  </div>
                </div>

                <!-- third row -->
                <div class="grid grid-cols-12 gap-4">
                  <div class="col-span-6">
                     <el-form-item label="Inicial" >
                    <el-input-number  :disabled="true" size="small" v-model="numcant" controls-position="right" @change="handleChange" :min="1" :max="10">

                    </el-input-number>
                    </el-form-item>
                  </div>
                  <div class="col-span-6">
                    <el-form-item label="Final" >
                    <el-input-number  :disabled="true" size="small" v-model="numcant" controls-position="right" @change="handleChange" :min="1" :max="10">

                    </el-input-number>
                    </el-form-item>
                  </div>
                </div>
                  <!-- four row -->
                  <div class="grid grid-cols-12">
                    <div class="col-span-12">
                      <el-form-item label="Actual" >
                        <el-input  :disabled="true" size="small" v-model="numcant" >
                        </el-input>
                        </el-form-item>
                    </div>
                  </div>
              </el-form>
            </div>
          </div>
        </div>

      </el-tab-pane>


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

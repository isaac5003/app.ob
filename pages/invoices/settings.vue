<template>
  <layout-content
    page-title="Configuraciones"
    :breadcrumb="[
      { name: 'Ventas', to: '/invoices' },
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

      <el-dialog :append-to-body="true" title="Nueva zona" :visible.sync="showNewZone" width="30%"
        @close="closeDialog('newZoneForm')">
        <el-form
        :model="newZoneForm"
        :rules="newzoneRules"
        status-icon
        ref="newZoneForm"
        @submit.prevent.native="submitZone('newZoneForm', newZoneForm)"
      >
        <div>
          <el-form-item label="Nombre de la zona" prop="name">
            <el-input v-model="newZoneForm.name" clearable type="text"  maxlength="100" minlength="5" show-word-limit></el-input>
          </el-form-item>
        </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small"  @click.native="submitZone('newZoneForm', newZoneForm)">Guardar</el-button>
          <el-button @click="showNewZone = false" size="small">Cancelar</el-button>
        </span>
      </el-dialog>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-5 flex flex-col space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-blue-900 font-semibold text-lg">ZONAS</span>
              <el-button @click="showNewZone = true" type="primary" size="mini" icon="el-icon-plus" />
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
                      <el-dropdown-item @click.native="changeActiveZone(scope.row)">
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
                        @click.native="deleteZone(scope.row)"
                      >
                        <i class="el-icon-delete"></i> Eliminar zona
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- Inicio de tabla vendedores y dialogos -->
          <el-dialog :append-to-body="true" title="Nuevo vendedor" :visible.sync="showNewSeller" width="30%"
        @close="closeDialog('newSellerForm')">
        <el-form
        :model="newSellerForm"
        :rules="newzoneRules"
        status-icon
        ref="newSellerForm"
        @submit.prevent.native="submitZone('newSellerForm', newSellerForm)"
      >
        <div>
          <el-row :gutter="15">
            <el-col :span="15">
              <el-form-item label="Nombre del vendedor" prop="name">
                <el-input clearable v-model="newSellerForm.name" size="small" auto-complete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="Zona asignada" prop="zone">
                <el-select
                v-model="newSellerForm.zone"
                placeholder="Seleccionar"
                size="small"
                class="w-full"
                clearable
                filterable
                default-first-option
              >
              <el-option
                v-for="z in activeZones"
                :key="z.id"
                :label="z.name"
                :value="z.id"
                class="w.full"
              />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small"  @click.native="submitSeller('newSellerForm', newSellerForm)">Guardar</el-button>
          <el-button @click="showNewSeller = false" size="small">Cancelar</el-button>
        </span>
          </el-dialog>

          <div class="col-span-7 flex flex-col space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-blue-900 font-semibold text-lg"
                >VENDEDORES</span
              >
              <el-button @click="showNewSeller = true" type="primary" size="mini" icon="el-icon-plus" />
            </div>

            <el-table :data="sellers" stripe size="mini">
              <el-table-column label="ID" prop="index" min-width="40" />
              <el-table-column label="Vendedor" prop="name"  min-width="170" />
              <el-table-column label="Zona" min-width="175">
                <template slot-scope="scope">
                  <span
                    >{{
                      scope.row.invoicesZone ? scope.row.invoicesZone.name : ""
                    }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column label="Estado" min-width="90">
                <template slot-scope="scope">
                  <el-tag size="small" type="success" v-if="scope.row.active"
                    >Activo</el-tag
                  >
                  <el-tag size="small" type="danger" v-else>Inactivo</el-tag>
                </template>
              </el-table-column>
              <el-table-column label min-width="85" align="center">
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
                      <el-dropdown-item @click.native="changeActiveSellers(scope.row)">
                        <span v-if="scope.row.active">
                          <i class="el-icon-close"></i> Desactivar
                        </span>
                        <span v-else>
                          <i class="el-icon-check"></i> Activar
                        </span>vendedor
                      </el-dropdown-item>
                      <el-dropdown-item
                        :divided="true"
                        class="text-red-500 font-semibold"
                        @click.native="deleteSeller(scope.row)"
                      >
                        <i class="el-icon-delete"></i> Eliminar vendedor
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- Fin del div vendedores -->
        </div>
      </el-tab-pane>

      <!-- Tabla de condiciones de pago -->
      <el-tab-pane label="Condiciones de pago" name="payment-conditions">

        <el-dialog :append-to-body="true" title="Nueva condición de pago" :visible.sync="showNewPayment" width="30%"
        @close="closeDialog('newPaymentForm')">
        <el-form
        :model="newPaymentForm"
        :rules="newzoneRules"
        status-icon
        ref="newPaymentForm"
        @submit.prevent.native="submitPayment('newPaymentForm', newPaymentForm)"
      >
        <div>
          <el-form-item label="Nombre de la condición de pago" prop="name">
            <el-input v-model="newPaymentForm.name" clearable type="text"  maxlength="100" minlength="5" show-word-limit></el-input>
          </el-form-item>
        </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small"  @click.native="submitPayment('newPaymentForm', newPaymentForm)">Guardar</el-button>
          <el-button @click="showNewPayment = false" size="small">Cancelar</el-button>
        </span>
      </el-dialog>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-6 flex flex-col space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-blue-900 font-semibold text-lg"
                >CONDICIONES DE PAGO</span
              >
              <el-button @click="showNewPayment = true" type="primary" size="mini" icon="el-icon-plus" />
            </div>
            <el-table :data="payment" stripe size="mini">
              <el-table-column prop="index" min-width="40" />
              <el-table-column
                label="Condicion de pago"
                prop="name"
                min-width="175"
              />
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
                        <i class="el-icon-edit-outline"></i> Editar pago
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="changeActivePayment(scope.row)">
                        <span v-if="scope.row.active">
                          <i class="el-icon-close"></i> Desactivar
                        </span>
                        <span v-else>
                          <i class="el-icon-check"></i> Activar
                        </span>
                        pago
                      </el-dropdown-item>
                      <el-dropdown-item
                        :divided="true"
                        class="text-red-500 font-semibold"
                        @click.native="deletePayment(scope.row)"
                      >
                        <i class="el-icon-delete"></i> Eliminar pago
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>

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
import { getIcon, hasModule, inputValidation, selectValidation  } from "../../tools";
import * as R from "ramda";

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
    // método para hacer la petición a la url de vendedores
    const sellers = () => {
      return this.$axios.get("/invoices/sellers");
    };
    //método para mostrar data en la tabla de pagos
    const payment = () => {
      return this.$axios.get("/invoices/payment-condition")
    }
    // promesa que recibe los métodos con las peticiones http
    Promise.all([zones(), sellers(), payment()])
      .then((res) => {
        const [zones, sellers, payment] = res;
        this.zones = zones.data.zones;
        this.sellers = sellers.data.sellers;
        this.payment = payment.data.paymentConditions;
        this.loading = false;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message;
      });
  },
  fetchOnServer: false,
  data() {
    return {
      rawZones: [],
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
      sellers: [],
      payment: [],
      showNewZone: false,
      showNewSeller: false,
      showNewPayment: false,
      dialogFormVisible: false,
      newZoneForm: {
        name: ""
      },
      newPaymentForm: {
        name: ""
      },
      newzoneRules: {
        name: inputValidation(true, 5, 100),
        // service: selectValidation(true),
        // cost: amountValidate("blur", true, 0),
        // description: inputValidation(true),
      },
      newSellerForm:{
        name: "",
        zone: ""
      },

    };
  },
  watch:{
    zones() {
      this.rawZones = this.zones;
    }
  },
  methods: {
    closeDialog(name) {
      this.$refs[name].resetFields();
    },
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
    fetchSellers() {
      let params = this.page;
      this.$axios
        .get("/invoices/sellers")
        .then((res) => {
          this.sellers = res.data.sellers;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        });
    },
    fetchPayments(){
      let params = this.page;
      this.$axios
          .get("/invoices/payment-condition")
          .then((res) => {
            this.payment = res.data.paymentConditions;
          })
          .catch((err) => {
            this.errorMessage = err.response.data.message;
          });
    },
    changeActiveZone({ id, active }) {
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
    //Metodo para cambiar el estado de vendedores (Activar o Desactivar)
    changeActiveSellers({ id, active }) {
      const action = active ? "desactivar" : "activar";
      this.$confirm(
        `¿Estás seguro que deseas ${action} este vendedor?`,
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
                .put(`/invoices/sellers/status/${id}`, { status: !active })
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchSellers();
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
    //Metodo para camiar el estado de condiciones de pago
    changeActivePayment({ id, active }) {
      const action = active ? "desactivar" : "activar";
      this.$confirm(
        `¿Estás seguro que deseas ${action} este pago?`,
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
                .put(`/invoices/payment-condition/status/${id}`, { status: !active })
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchPayments();
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

    deleteZone({ id }) {
      const action = "eliminar" ;
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
                .delete(`/invoices/zones/${id}`)
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
    deleteSeller({ id }) {
      const action = "eliminar" ;
      this.$confirm(
        `¿Estás seguro que deseas ${action} este vendedor?`,
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
                .delete(`/invoices/sellers/${id}`)
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchSellers();
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
    deletePayment({ id }) {
      const action = "eliminar" ;
      this.$confirm(
        `¿Estás seguro que deseas ${action} este pago?`,
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
                .delete(`/invoices/payment-condition/${id}`)
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchPayments();
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
    submitZone( formName, data ){
      const action = "guardar" ;
      this.$refs[formName].validate( async valid =>{
        if(!valid){
          return false;
        }

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
                .post('/invoices/zones',{
                  name: data.name
                })
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
            this.showNewZone = false;
          },
        }
      );


      });
    },
    submitSeller( formName, data ){
      console.log(data)
      const action = "guardar" ;
      this.$refs[formName].validate( async valid =>{
        if(!valid){
          return false;
        }

        this.$confirm(
        `¿Estás seguro que deseas ${action} este vendedor?`,
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
                .post('/invoices/sellers',{
                  name: data.name,
                  invoicesZone: data.zone
                })
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchSellers();
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
            this.showNewSeller = false;
          },
        }
      );


      });
    },
    submitPayment( formName, data ){
      const action = "guardar" ;
      this.$refs[formName].validate( async valid =>{
        if(!valid){
          return false;
        }

        this.$confirm(
        `¿Estás seguro que deseas ${action} esta condición de pago?`,
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
                .post('/invoices/payment-condition',{
                  name: data.name
                })
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchPayments();
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
            //Cambio de valor en variable showNewPayment
            this.showNewPayment = false;
          },
        }
      );


      });
    },
  },
  computed: {
    filteredIntegrations() {
      return this.integrations.filter((i) => hasModule(i.ref, this.$auth.user));
    },
    activeZones() {
      return this.rawZones.filter( zone => zone.active );
    }
  },
};
</script>

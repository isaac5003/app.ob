<template>
  <layout-content
    page-title="Configuraciones"
    :breadcrumb="[
      { name: 'Ventas', to: '/invoices' },
      { name: 'Configuraciones', to: null },
    ]"
    v-loading="pageloading"
  >
    <!-- TODORealizar funcionamiento de agregar autorizacion. -->
    <!-- <el-dialog
      title="Nueva Autorización"
      :visible.sync="showAuthorization"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="400px"
    >
      <div class=" flex flex-col space-y-2">
        <el-form>
          <div class="grid grid-cols-12 gap-4">
            <el-form-item label="N° Autorización" class="col-span-12">
              <el-input
                placeholder="N° Autorización"
                class="w-full"
                size="small"
                v-model="d"
              />
            </el-form-item>
          </div>

          <div class="grid grid-cols-12 gap-4">
            <el-form-item label="Inicial" class="col-span-6">
              <el-input-number
                placeholder="Inicial"
                style="width:100%;"
                size="small"
                v-model="d"
              />
            </el-form-item>
            <el-form-item label="Final" class="col-span-6">
              <el-input-number
                placeholder="Final"
                style="width:100%;"
                size="small"
                v-model="d"
              />
            </el-form-item>
          </div>

          <div class="flex flex-rows justify-end">
            <el-button size="small" type="primary">Guardar</el-button>
            <el-button size="small" @click="showAuthorization = false">
              Cancelar
            </el-button>
          </div>
        </el-form>
      </div>
    </el-dialog> -->

    <!-- dialogo zonas -->
    <el-dialog
      :append-to-body="true"
      title="Nueva zona"
      :visible.sync="showNewZone"
      width="30%"
      @close="closeDialog('newZoneForm')"
    >
      <el-form
        :model="newZoneForm"
        :rules="newzoneRules"
        status-icon
        ref="newZoneForm"
        @submit.prevent.native="submitZone('newZoneForm', newZoneForm)"
      >
        <div class="grid grid-cols-12 gap-4">
          <el-form-item
            label="Nombre de la zona"
            prop="name"
            class="col-span-12"
          >
            <el-input
              v-model="newZoneForm.name"
              clearable
              type="text"
              maxlength="100"
              minlength="5"
              show-word-limit
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click.native="submitZone('newZoneForm', newZoneForm)"
          >Guardar</el-button
        >
        <el-button @click="showNewZone = false" size="small"
          >Cancelar</el-button
        >
      </span>
    </el-dialog>
    <!-- dialogo para editar zona -->
    <el-dialog
      :append-to-body="true"
      title="Editar zona zona"
      :visible.sync="showEditZone"
      width="30%"
      @close="closeDialog('editZoneForm')"
    >
      <el-form
        :model="editZoneForm"
        :rules="newzoneRules"
        status-icon
        ref="editZoneForm"
        @submit.prevent.native="submitZone('editZoneForm', editZoneForm)"
      >
        <div class="grid grid-cols-12 gap-4">
          <el-form-item
            label="Nombre de la zona"
            prop="name"
            class="col-span-12"
          >
            <el-input
              v-model="editZoneForm.name"
              clearable
              type="text"
              maxlength="100"
              minlength="5"
              show-word-limit
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click.native="submitZone('editZoneForm', editZoneForm)"
          >Guardar</el-button
        >
        <el-button @click="showEditZone = false" size="small"
          >Cancelar</el-button
        >
      </span>
    </el-dialog>
    <!-- dialogo nuevo vendedor -->
    <el-dialog
      :append-to-body="true"
      title="Nuevo vendedor"
      :visible.sync="showNewSeller"
      width="30%"
      @close="closeDialog('newSellerForm')"
    >
      <el-form
        :model="newSellerForm"
        :rules="newzoneRules"
        status-icon
        ref="newSellerForm"
      >
        <div>
          <el-form-item label="Nombre del vendedor" prop="name">
            <el-input
              clearable
              v-model="newSellerForm.name"
              size="small"
              auto-complete="off"
            />
          </el-form-item>

          <el-form-item label="Zona asignada" prop="invoicesZone">
            <el-select
              v-model="newSellerForm.invoicesZone"
              placeholder="Selecionar"
              size="small"
              class="w-full"
              clearable
              default-first-option
            >
              <el-option
                v-for="z in activeZones"
                :key="z.id"
                :label="z.name"
                :value="z.id"
                class="w-full"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click.native="submitSeller('newSellerForm', newSellerForm)"
          >Guardar</el-button
        >
        <el-button @click="showEditSeller = false" size="small"
          >Cancelar</el-button
        >
      </span>
    </el-dialog>
    <!-- dialogo editar vendedores -->
    <el-dialog
      :append-to-body="true"
      title="Editar vendedor"
      :visible.sync="showEditSeller"
      width="30%"
      @close="closeDialog('editSellerForm')"
    >
      <el-form
        :model="editSellerForm"
        :rules="newzoneRules"
        status-icon
        ref="editSellerForm"
      >
        <div>
          <el-row :gutter="15">
            <el-col :span="15">
              <el-form-item label="Nombre del vendedor" prop="name">
                <el-input
                  clearable
                  v-model="editSellerForm.name"
                  size="small"
                  auto-complete="off"
                />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="Zona asignada" prop="invoicesZone">
                <el-select
                  v-model="editSellerForm.invoicesZone"
                  placeholder="Selecionar"
                  size="small"
                  class="w-full"
                  clearable
                  default-first-option
                >
                  <el-option
                    v-for="z in activeZones"
                    :key="z.id"
                    :label="z.name"
                    :value="z.id"
                    class="w-full"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click.native="
            submitEditSeller('editSellerForm', sellerId, editSellerForm)
          "
          >Guardar</el-button
        >
        <el-button @click="showEditSeller = false" size="small"
          >Cancelar</el-button
        >
      </span>
    </el-dialog>

    <!-- Dialogo para agregar nueva condicion de pago -->
    <el-dialog
      :append-to-body="true"
      title="Nueva condición de pago"
      :visible.sync="showNewPayment"
      width="30%"
      @close="closeDialog('newPaymentForm')"
    >
      <el-form
        :model="newPaymentForm"
        :rules="newzoneRules"
        status-icon
        ref="newPaymentForm"
        @submit.prevent.native="submitPayment('newPaymentForm', newPaymentForm)"
      >
        <div>
          <el-form-item label="Nombre de la condición de pago" prop="name">
            <el-input
              v-model="newPaymentForm.name"
              clearable
              type="text"
              maxlength="100"
              minlength="5"
              show-word-limit
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click.native="submitPayment('newPaymentForm', newPaymentForm)"
          >Guardar</el-button
        >
        <el-button @click="showNewPayment = false" size="small"
          >Cancelar</el-button
        >
      </span>
    </el-dialog>

    <!-- Dialogo para editar condicion de pago -->
    <el-dialog
      :append-to-body="true"
      title="Editar condición de pago"
      :visible.sync="showEditPayment"
      width="30%"
      @close="closeDialog('editPaymentForm')"
    >
      <el-form
        :model="editPaymentForm"
        :rules="newzoneRules"
        status-icon
        ref="editPaymentForm"
        @submit.prevent.native="
          submitPayment('editPaymentForm', editPaymentForm)
        "
      >
        <el-form-item label="Nombre la condición de pago" prop="name">
          <el-input
            v-model="editPaymentForm.name"
            clearable
            type="text"
            maxlength="100"
            minlength="5"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click.native="submitPayment('editPaymentForm', editPaymentForm)"
          >Guardar</el-button
        >
        <el-button @click="showEditPayment = false" size="small"
          >Cancelar</el-button
        >
      </span>
    </el-dialog>

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
        <!-- Inicio de tablas zonas y vendedores -->
        <div class="grid grid-cols-12 gap-4">
          <!-- tabla de zonas -->
          <div class="col-span-5 flex flex-col space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-blue-900 font-semibold text-lg">ZONAS</span>
              <el-button
                @click="showNewZone = true"
                type="primary"
                size="mini"
                icon="el-icon-plus"
              />
            </div>
            <el-table :data="zones" stripe size="mini">
              <el-table-column prop="index" width="40" />
              <el-table-column label="Zona" prop="name" min-width="180" />
              <el-table-column label="Estado" width="100">
                <template slot-scope="scope">
                  <el-tag size="small" type="success" v-if="scope.row.active"
                    ><i class="el-icon-success"></i>Activo</el-tag
                  >
                  <el-tag size="small" type="danger" v-else
                    ><i class="el-icon-remove"></i>Inactivo</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column label min-width="70" align="center">
                <template slot-scope="scope">
                  <el-dropdown trigger="click" szie="mini">
                    <el-button icon="el-icon-more" size="mini" />
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="editZone(scope.row)">
                        <i class="el-icon-edit-outline"></i> Editar zona
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click.native="changeActiveZone(scope.row)"
                      >
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
          <!-- tabla de vendedores -->
          <div class="col-span-7 flex flex-col space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-blue-900 font-semibold text-lg"
                >VENDEDORES</span
              >
              <el-button
                @click="showNewSeller = true"
                type="primary"
                size="mini"
                icon="el-icon-plus"
              />
            </div>

            <el-table :data="sellers" stripe size="mini">
              <el-table-column label="ID" prop="index" width="40" />
              <el-table-column label="Vendedor" prop="name" min-width="240" />
              <el-table-column label="Zona" min-width="100">
                <template slot-scope="scope">
                  <span
                    >{{
                      scope.row.invoicesZone ? scope.row.invoicesZone.name : ""
                    }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column label="Estado" width="100">
                <template slot-scope="scope">
                  <el-tag size="small" type="success" v-if="scope.row.active">
                    <i class="el-icon-success"></i>Activo</el-tag
                  >
                  <el-tag size="small" type="danger" v-else
                    ><i class="el-icon-remove"></i>Inactivo</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column label width="70" align="center">
                <template slot-scope="scope">
                  <el-dropdown trigger="click" szie="mini">
                    <el-button icon="el-icon-more" size="mini" />
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="editSeller(scope.row)">
                        <i class="el-icon-edit-outline"></i> Editar vendedor
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click.native="changeActiveSellers(scope.row)"
                      >
                        <span v-if="scope.row.active">
                          <i class="el-icon-close"></i> Desactivar
                        </span>
                        <span v-else>
                          <i class="el-icon-check"></i> Activar </span
                        >vendedor
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
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-6 flex flex-col space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-blue-900 font-semibold text-lg"
                >CONDICIONES DE PAGO</span
              >
              <el-button
                @click="showNewPayment = true"
                type="primary"
                size="mini"
                icon="el-icon-plus"
              />
            </div>
            <el-table :data="payments" stripe size="mini">
              <el-table-column prop="index" width="40" />
              <el-table-column
                label="Condicion de pago"
                prop="name"
                min-width="260"
              />
              <el-table-column label="Estado" min-width="100">
                <template slot-scope="scope">
                  <el-tag size="small" type="success" v-if="scope.row.active"
                    ><i class="el-icon-success"></i>Activo</el-tag
                  >
                  <el-tag size="small" type="danger" v-else
                    ><i class="el-icon-remove"></i>Inactivo</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column label width="70" align="center">
                <template slot-scope="scope">
                  <el-dropdown trigger="click" szie="mini">
                    <el-button icon="el-icon-more" size="mini" />
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        @click.native="editCondition(scope.row)"
                      >
                        <i class="el-icon-edit-outline"></i> Editar condición
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click.native="changeActivePayment(scope.row)"
                      >
                        <span v-if="scope.row.active">
                          <i class="el-icon-close"></i> Desactivar
                        </span>
                        <span v-else>
                          <i class="el-icon-check"></i> Activar
                        </span>
                        condición
                      </el-dropdown-item>
                      <el-dropdown-item
                        :divided="true"
                        class="font-semibold"
                        @click.native="deletePayment(scope.row)"
                      >
                        <i class="el-icon-delete"></i> Eliminar condición
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Correlativos" name="correlatives">
        <el-form :model="correlativeForm" ref="correlativeForm">
          <div class="grid grid-cols-12 gap-4">
            <div
              v-for="(correlative, index) of correlativeForm.documents"
              :key="index"
              class="col-span-4 bg-white"
            >
              <div class="border-2 p-5 border-blue-800 rounded-md">
                <!-- Consumidor final, Switch y Button -->
                <div class="grid grid-cols-12 gap-4">
                  <div class="col-span-8">
                    <el-form-item label="" class="font-semibold text-blue-800"
                      ><span>{{
                        correlative.documentType
                          ? correlative.documentType.name
                          : ""
                      }}</span></el-form-item
                    >
                  </div>
                  <div class="col-span-2">
                    <el-form-item>
                      <el-switch
                        v-model="correlative.active"
                        @change="
                          changeActiveCorrelative(
                            'correlativeForm',
                            correlative,
                            index
                          )
                        "
                      ></el-switch>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item>
                      <el-button
                        type="primary"
                        icon="el-icon-plus"
                        size="mini"
                        @click="showAuthorization = true"
                      ></el-button>
                    </el-form-item>
                  </div>
                </div>
                <!-- Autorización -->
                <div class="grid grid-cols-12 gap-4">
                  <div class="col-span-12">
                    <el-form-item
                      label="N° Autorización"
                      :prop="`documents.${index}.authorization`"
                      :rules="
                        correlative.active
                          ? [
                              {
                                required: true,
                                message: 'Este campo es requerido.',
                                trigger: 'change',
                              },
                              ,
                            ]
                          : {}
                      "
                    >
                      <el-input
                        class="w-full"
                        size="small"
                        :disabled="
                          correlative.active
                            ? correlative.used
                              ? true
                              : false
                            : true
                        "
                        v-model="correlative.authorization"
                      ></el-input>
                    </el-form-item>
                  </div>
                </div>
                <!-- Inicial, Final -->
                <div class="grid grid-cols-12 gap-4">
                  <div class="col-span-6">
                    <el-form-item
                      label="Inicial"
                      :prop="`documents.${index}.initial`"
                      :rules="
                        correlative.active
                          ? [
                              {
                                required: true,
                                message: 'Este campo es requerido.',
                                trigger: 'change',
                              },
                              {
                                type: 'integer',
                                message: 'Debe ser de tipo entero.',
                              },
                            ]
                          : null
                      "
                    >
                      <el-input-number
                        class="w-full"
                        size="small"
                        :disabled="
                          correlative.active
                            ? correlative.used
                              ? true
                              : false
                            : true
                        "
                        v-model="correlative.initial"
                        style="width: 100%"
                        :step="1"
                      ></el-input-number>
                    </el-form-item>
                  </div>
                  <div class="col-span-6">
                    <el-form-item
                      label="Final"
                      :prop="`documents.${index}.final`"
                      :rules="
                        correlative.active
                          ? [
                              {
                                required: true,
                                message: 'Este campo es requerido.',
                                trigger: 'change',
                              },
                              {
                                type: 'integer',
                                message: 'Debe ser de tipo entero.',
                              },
                            ]
                          : null
                      "
                    >
                      <el-input-number
                        class="w-full"
                        size="small"
                        :disabled="
                          correlative.active
                            ? correlative.used
                              ? true
                              : false
                            : true
                        "
                        v-model="correlative.final"
                        style="width: 100%"
                        :step="1"
                      ></el-input-number>
                    </el-form-item>
                  </div>
                </div>
                <!-- Actual -->
                <div class="grid grid-cols-12 gap-4">
                  <div class="col-span-12">
                    <el-form-item
                      label="Actual"
                      :prop="`documents.${index}.current`"
                      :rules="
                        correlative.active
                          ? [
                              {
                                required: true,
                                message: 'Este campo es requerido.',
                                trigger: 'change',
                              },
                              {
                                type: 'integer',
                                message: 'Debe ser de tipo entero.',
                              },
                            ]
                          : null
                      "
                    >
                      <el-input-number
                        class="w-full"
                        size="small"
                        :disabled="
                          correlative.active
                            ? correlative.used
                              ? true
                              : false
                            : true
                        "
                        v-model="correlative.current"
                        style="width: 100%"
                        :step="1"
                      ></el-input-number>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-form>
        <!-- Botones Guardar y Cancelar -->
        <div class="flex justify-end dialog-footer mt-4">
          <el-button
            type="primary"
            size="small"
            @click="
              submitCorrelativeForm(
                'correlativeForm',
                correlativeForm.documents.filter((c) => !c.used && c.active)
              )
            "
            >Guardar</el-button
          >
          <el-button size="small" @click="$router.push('/invoices')"
            >Cancelar</el-button
          >
        </div>
      </el-tab-pane>
    </el-tabs>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
import {
  getIcon,
  hasModule,
  inputValidation,
  selectValidation,
} from "../../tools";

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
      return this.$axios.get("/invoices/payment-condition");
    };
    const documents = () => {
      return this.$axios.get("/invoices/documents");
    };
    const showAuthorization = () => {
      return this.$axios.get("/invoices/documents");
    };
    // promesa que recibe los métodos con las peticiones http
    Promise.all([
      zones(),
      sellers(),
      payment(),
      documents(),
      showAuthorization(),
    ])
      .then((res) => {
        const [zones, sellers, payment, documents] = res;
        this.zones = zones.data.data;
        this.sellers = sellers.data.data;
        this.payments = payment.data.data;
        this.correlativeForm.documents = documents.data.data;

        this.pageloading = false;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message;
      });
  },
  fetchOnServer: false,
  data() {
    return {
      d: "hola",
      pageloading: true,
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
      payments: [],
      documents: [],

      showNewZone: false,
      showNewSeller: false,
      showNewPayment: false,
      showEditPayment: false,
      showEditZone: false,
      showEditSeller: false,
      correlativeForm: {
        documents: [{ authorization: "", initial: "", final: "", current: "" }],
      },
      showAuthorization: false,

      newZoneForm: {
        name: "",
      },
      newPaymentForm: {
        name: "",
      },
      newSellerForm: {
        name: "",
        invoicesZone: "",
      },
      newzoneRules: {
        name: inputValidation(true, 5, 100),
        invoicesZone: selectValidation(true),
      },
      editPaymentForm: {
        name: "",
      },
      editZoneForm: {
        name: "",
      },
      editSellerForm: {
        name: "",
        invoicesZone: "",
      },
    };
  },
  methods: {
    closeDialog(name) {
      this.$refs[name].resetFields();
    },
    fetchZones() {
      this.$axios
        .get("/invoices/zones")
        .then((res) => {
          this.zones = res.data.data;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        });
    },
    fetchSellers() {
      this.$axios
        .get("/invoices/sellers")
        .then((res) => {
          this.sellers = res.data.data;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        });
    },
    fetchPayments() {
      this.$axios
        .get("/invoices/payment-condition")
        .then((res) => {
          this.payments = res.data.data;
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
                .put(`/invoices/payment-condition/status/${id}`, {
                  status: !active,
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
          },
        }
      );
    },
    deleteZone({ id }) {
      this.$confirm(
        `¿Estás seguro que deseas eliminar esta zona?`,
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
                  instance.confirmButtonText = `Si, eliminar`;
                  done();
                });
            }
            done();
          },
        }
      );
    },
    deleteSeller({ id }) {
      this.$confirm(
        `¿Estás seguro que deseas eliminar este vendedor?`,
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
                  instance.confirmButtonText = `Si, eliminar`;
                  done();
                });
            }
            done();
          },
        }
      );
    },
    deletePayment({ id }) {
      this.$confirm(
        `¿Estás seguro que deseas eliminar este pago?`,
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
                  instance.confirmButtonText = `Si, eliminar`;
                  done();
                });
            }
            done();
          },
        }
      );
    },
    submitZone(formName, { id, name }) {
      const action = id ? "actualizar" : "guardar";
      const method = id ? "PUT" : "POST";
      const url = `/invoices/zones/${id ? id : ""}`;
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
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
                this.$axios({
                  method,
                  url,
                  data: { name },
                })
                  .then((res) => {
                    this.$notify.success({
                      title: "Éxito",
                      message: res.data.message,
                    });
                    this.fetchZones();
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
              //Cambio de valor en variable showNewPayment
              this.showNewZone = false;
              this.showEditZone = false;
            },
          }
        );
      });
    },
    submitSeller(formName, { name, invoicesZone }) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$confirm(
          `¿Estás seguro que deseas guardar este vendedor?`,
          "Confirmación",
          {
            confirmButtonText: `Si, guardar`,
            cancelButtonText: "Cancelar",
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "Procesando...";
                this.$axios
                  .post("/invoices/sellers", {
                    name,
                    invoicesZone,
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
                    instance.confirmButtonText = `Si, guardar`;
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
    editSeller({ id, name, ...zone }) {
      console.log(id);
      console.log(name);
      console.log(zone);
      this.sellerId = id;
      this.editSellerForm.name = name;
      this.editSellerForm.invoicesZone = zone.invoicesZone.id;
      this.showEditSeller = true;
    },
    submitEditSeller(formName, sellerId, { name, invoicesZone }) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$confirm(
          `¿Estás seguro que deseas actualizar este vendedor?`,
          "Confirmación",
          {
            confirmButtonText: `Si, actualizar`,
            cancelButtonText: "Cancelar",
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "Procesando...";
                this.$axios
                  .put(`/invoices/sellers/${sellerId}`, {
                    name,
                    invoicesZone,
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
                    instance.confirmButtonText = `Si, actualizar`;
                    done();
                  });
              }
              done();
              this.showEditSeller = false;
            },
          }
        );
      });
    },
    submitPayment(formName, { id, name, cashPayment }) {
      console.log(formName);
      console.log(id);
      console.log(name);
      console.log(cashPayment);
      const action = id ? "actualizar" : "guardar";
      const method = id ? "PUT" : "POST";
      const url = `/invoices/payment-condition/${id ? id : ""}`;
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
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
                this.$axios({
                  method,
                  url,
                  data: { name, cashPayment },
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
              this.showEditPayment = false;
            },
          }
        );
      });
    },
    editCondition(condition) {
      this.editPaymentForm = { ...condition };
      this.showEditPayment = true;
    },
    editZone(zone) {
      this.editZoneForm = { ...zone };
      this.showEditZone = true;
    },
    async fetchDocuments() {
      const { data } = await this.$axios.get("/invoices/documents");
      this.correlativeForm.documents = data.data;
      this.pageloading = false;
    },
    changeActiveCorrelative(formName, correlative, index) {
      if (!correlative.id) {
        if (this.$refs[formName] && !correlative.active) {
          this.$refs[formName].fields
            .find((f) => f.prop == `documents.${index}.authorization`)
            .resetField();
          this.$refs[formName].fields
            .find((f) => f.prop == `documents.${index}.initial`)
            .resetField();
          this.$refs[formName].fields
            .find((f) => f.prop == `documents.${index}.final`)
            .resetField();
          this.$refs[formName].fields
            .find((f) => f.prop == `documents.${index}.current`)
            .resetField();
        }
        this.correlativeForm.documents[index].active = correlative.active;
      } else {
        this.$confirm(
          `¿Estás seguro que deseas ${
            correlative.active ? "activar" : "desactivar"
          } este documento?`,
          "Confirmación",
          {
            confirmButtonText: `Si, ${
              correlative.active ? "activar" : "desactivar"
            }`,
            cancelButtonText: "Cancelar",
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "Procesando...";
                this.$axios
                  .put(`/invoices/documents/status/${correlative.id}`, {
                    status: correlative.active,
                  })

                  .then((res) => {
                    this.$notify.success({
                      title: "Exito",
                      message: res.data.message,
                    });
                    this.fetchDocuments();
                  })
                  .catch((err) => {
                    this.$notify.error({
                      title: "Error",
                      message: err.response.data.message,
                    });
                  })
                  .then((alw) => {
                    instance.confirmButtonLoading = false;
                    instance.confirmButtonText = `Si, ${
                      correlative.active ? "activar" : "desactivar"
                    }`;
                    done();
                  });
              } else {
                done();
              }
            },
          }
        ).catch(() => {
          this.correlativeForm.documents[index].active = !correlative.active;
        });
      }
    },
    submitCorrelativeForm(formName, correlatives) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$confirm(
          "¿Estás seguro que deseas actualizar estos documentos?",
          "Confirmación",
          {
            confirmButtonText: "Si, actualizar",
            cancelButtonText: "Cancelar",
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "Procesando...";
                this.$axios
                  .put("/invoices/documents", {
                    documents: correlatives.map((d) => {
                      return {
                        id: d.id,
                        authorization: d.authorization,
                        initial: d.initial,
                        final: d.final,
                        current: d.current,
                        documentType: d.documentType.id,
                      };
                    }),
                  })

                  .then((res) => {
                    this.$notify.success({
                      title: "Exito",
                      message: res.data.message,
                    });
                    this.fetchDocuments();
                    this.pageloading = true;
                  })
                  .catch((err) => {
                    instance.confirmButtonLoading = false;
                    this.$notify.error({
                      title: "Error",
                      message: err.response.data.message,
                    });
                  })
                  .then((alw) => {
                    instance.confirmButtonLoading = false;
                    instance.confirmButtonText = "Si, actualizar";
                    done();
                  });
              } else {
                instance.confirmButtonLoading = false;
                done();
              }
            },
          }
        );
      });
    },
  },
  computed: {
    filteredIntegrations() {
      return this.integrations.filter((index) =>
        hasModule(i.ref, this.$auth.user)
      );
    },
    activeZones() {
      return this.zones.filter((zone) => zone.active);
    },
  },
};
</script>

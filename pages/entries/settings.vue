<template>
  <layout-content
    page-title="Configuraciones"
    :breadcrumb="[
      { name: 'Contabilidad', to: '/entries' },
      { name: 'Configuraciones', to: null },
    ]"
  >
    <!-- cuenta mayor -->
    <el-dialog
      title="Nueva cuenta mayor"
      :visible.sync="showCreateCatalogDialog"
      :append-to-body="true"
      width="900px"
    >
      <el-form :model="mayorAccountForm" status-icon ref="mayorAccountForm">
        <!-- first row -->
        <div
          class="grid grid-cols-12 gap-4"
          v-for="(item, i) in mayorAccountForm.items"
          :key="i"
        >
          <div class="col-span-2">
            <el-form-item
              label="Código"
              :prop="`items.${i}.code`"
              :rules="{ required: true, message: 'Requerido', trigger: 'blur' }"
            >
              <el-input-number
                v-model="item.code"
                type="number"
                :min="0"
                :step="1"
                size="small"
                autocomplete="off"
                style="width: 100%"
              />
            </el-form-item>
          </div>
          <div class="col-span-5">
            <el-form-item
              label="Nombre"
              :prop="`items.${i}.name`"
              :rules="{ required: true, message: 'Requerido', trigger: 'blur' }"
            >
              <el-input
                v-model="item.name"
                size="small"
                autocomplete="off"
                style="width: 100%"
                maxlength="100"
                minlength="3"
                show-word-limit
              />
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item label=" ">
              <el-checkbox
                size="small"
                border
                class="mt-5"
                style="width: 100%"
                v-model="item.isAcreedora"
              >
                Acreedora
              </el-checkbox>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item label=" ">
              <el-checkbox
                size="small"
                border
                class="mt-5"
                style="width: 100%"
                v-model="item.isBalance"
              >
                Balance
              </el-checkbox>
            </el-form-item>
          </div>
          <div class="col-span-1 flex items-center">
            <el-button
              class="w-full mt-5"
              type="danger"
              icon="el-icon-delete"
              :disabled="mayorAccountForm.items.length === 1"
              @click="removeMayorAccount(i)"
              size="small"
            />
          </div>
        </div>
        <!-- second row -->
        <div class="grid grid-cols-12">
          <div class="col-span-1">
            <el-form-item prop="service">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="addNewMayorAccount()"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="flex justify-end">
          <el-button
            type="primary"
            size="small"
            @click.native="
              submitNewCatalog(mayorAccountForm.items, 'mayorAccountForm')
            "
            >Guardar</el-button
          >
          <el-button @click="showCreateCatalogDialog = false" size="small"
            >Cancelar</el-button
          >
        </div>
      </span>
    </el-dialog>
    <!-- editar cuenta mayo -->
    <el-dialog
      title="Editar cuenta mayor"
      :visible.sync="showEditMayorDialog"
      :append-to-body="true"
      width="900px"
    >
      <el-form
        :model="activeAccount"
        :rules="mayorAccountFormRules"
        status-icon
        ref="activeAccount"
        class="space-y-4"
      >
        <div class="grid grid-cols-12 gap-4" v-if="activeAccount.isParent">
          <div class="col-span-12">
            <notification
              type="info"
              title="Atención"
              message="Esta cuenta tiene sub cuentas, y no se puede editar el código, solamente el nombre."
            />
          </div>
        </div>
        <!-- first row -->
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-2">
            <el-form-item
              label="Código"
              prop="code"
              :rules="{ required: true, message: 'Requerido', trigger: 'blur' }"
            >
              <el-input-number
                v-model="activeAccount.code"
                type="number"
                min="1"
                size="small"
                :disabled="activeAccount.isParent == true"
              />
            </el-form-item>
          </div>
          <div class="col-span-5">
            <el-form-item
              label="Nombre"
              prop="name"
              :rules="[
                {
                  required: true,
                  message: 'Este campo es requerido',
                  trigger: 'blur',
                },
                {
                  min: 3,
                  message: 'Debe contener mínimo 3 caracteres.',
                  trigger: 'blur',
                },
              ]"
            >
              <el-input v-model="activeAccount.name" size="small" />
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item prop="service" style="margin-top: 20px">
              <el-checkbox
                v-model="activeAccount.isAcreedora"
                label="Acreedora"
                size="small"
                border
                class="w-full"
              />
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item prop="service" style="margin-top: 20px">
              <el-checkbox
                v-model="activeAccount.isBalance"
                label="Balance"
                size="small"
                border
                class="w-full"
              />
            </el-form-item>
          </div>
        </div>
        <!-- second row -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="flex justify-end">
          <el-button
            type="primary"
            size="small"
            @click.native="submitEditedCatalog(activeAccount, 'activeAccount')"
            >Guardar</el-button
          >
          <el-button @click="showEditMayorDialog = false" size="small"
            >Cancelar</el-button
          >
        </div>
      </span>
    </el-dialog>
    <!-- cuenta contable -->
    <el-dialog
      title="Nueva cuenta contable"
      :visible.sync="showCreateAccountEntryDialog"
      :append-to-body="true"
      width="900px"
    >
      <el-form :model="newAccountForm" status-icon ref="newAccountForm">
        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-2 flex flex-col">
            <span class="font-bold text-xs">Código padre</span>
            <p class="text-xs">
              {{ activeAccount != null ? activeAccount.code : "" }}
            </p>
          </div>
          <div class="col-span-3 flex flex-col">
            <span class="font-bold text-xs">Nombre padre</span>
            <p class="text-xs">
              {{ activeAccount != null ? activeAccount.name : "" }}
            </p>
          </div>
        </div>

        <!-- first row -->
        <div
          class="grid grid-cols-12 gap-4"
          v-for="(item, i) in newAccountForm.items"
          :key="i"
        >
          <div class="col-span-2">
            <el-form-item
              label="Código"
              :prop="`items.${i}.code`"
              :rules="{ required: true, message: 'Requerido', trigger: 'blur' }"
            >
              <el-input-number
                v-model="item.code"
                ref="code"
                type="number"
                :min="0"
                :step="1"
                size="small"
                autocomplete="off"
                style="width: 100%"
              />
            </el-form-item>
          </div>
          <div class="col-span-5">
            <el-form-item
              label="Nombre"
              :prop="`items.${i}.name`"
              :rules="{ required: true, message: 'Requerido', trigger: 'blur' }"
            >
              <el-input
                size="small"
                v-model="item.name"
                autocomplete="off"
                style="width: 100%"
                maxlength="100"
                minlength="3"
                show-word-limit
              />
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item label=" ">
              <el-checkbox
                size="small"
                border
                class="mt-5"
                style="width: 100%"
                v-model="item.isAcreedora"
              >
                Acreedora
              </el-checkbox>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item label=" ">
              <el-checkbox
                size="small"
                border
                class="mt-5"
                style="width: 100%"
                v-model="newAccountForm.items[i].isBalance"
              >
                Balance
              </el-checkbox>
            </el-form-item>
          </div>
          <div class="col-span-1 flex items-center">
            <el-button
              class="w-full mt-5"
              type="danger"
              icon="el-icon-delete"
              :disabled="newAccountForm.items.length === 1"
              @click="removeNewAccount(i)"
              size="small"
            />
          </div>
        </div>
        <!-- second row -->
        <div class="grid grid-cols-12">
          <div class="col-span-1">
            <el-form-item prop="service">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="addNewAccount()"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="flex justify-end">
          <el-button
            type="primary"
            size="small"
            @click.native="
              submitNewCatalog(
                newAccountForm.items,
                'newAccountForm',
                activeAccount
              )
            "
            >Guardar</el-button
          >
          <el-button @click="showCreateCatalogDialog = false" size="small"
            >Cancelar</el-button
          >
        </div>
      </span>
    </el-dialog>
    <!-- editar cuenta contable -->
    <el-dialog
      :id="activeAccount != null ? activeAccount.code : ''"
      title="Editar cuenta contable"
      :visible.sync="showEditAccount"
      :append-to-body="true"
      width="1000px"
    >
      <el-form
        :model="activeAccount"
        :rules="mayorAccountFormRules"
        status-icon
        ref="accountFormEdit"
      >
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <notification
              type="info"
              title="Atención"
              message="Esta cuenta tiene sub cuentas, y no se puede editar el código, solamente el nombre."
            />
          </div>
        </div>
        <div class="grid grid-cols-12 gap-4 mb-4">
          <div class="col-span-2 flex flex-col">
            <span class="font-semibold text-xs">Código padre</span>
            <p class="text-xs">
              {{
                activeAccount != null && activeAccount.parentCatalog != null
                  ? activeAccount.parentCatalog.code
                  : ""
              }}
            </p>
          </div>
          <div class="col-span-3 flex flex-col">
            <span class="font-semibold text-xs">Nombre padre</span>
            <p class="text-xs">
              {{
                activeAccount != null && activeAccount.parentCatalog != null
                  ? activeAccount.parentCatalog.name
                  : ""
              }}
            </p>
          </div>
        </div>
        <!-- first row -->
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-2">
            <el-form-item
              label="Código"
              prop="code"
              :rules="{ required: true, message: 'Requerido', trigger: 'blur' }"
            >
              <el-input-number
                v-model="activeAccount.code"
                type="number"
                min="1"
                size="small"
              />
            </el-form-item>
          </div>
          <div class="col-span-5">
            <el-form-item
              label="Nombre"
              prop="name"
              :rules="[
                {
                  required: true,
                  message: 'Este campo es requerido',
                  trigger: 'blur',
                },
                {
                  min: 3,
                  message: 'Debe contener mínimo 3 caracteres.',
                  trigger: 'blur',
                },
              ]"
            >
              <el-input v-model="activeAccount.name" size="small" />
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item prop="service" style="margin-top: 20px">
              <el-checkbox
                v-model="activeAccount.isAcreedora"
                label="Acreedora"
                size="small"
                border
                class="w-full"
              />
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item prop="service" style="margin-top: 20px">
              <el-checkbox
                v-model="activeAccount.isBalance"
                label="Balance"
                size="small"
                border
                class="w-full"
              />
            </el-form-item>
          </div>
        </div>
        <!-- second row -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="flex justify-end">
          <el-button
            type="primary"
            size="small"
            @click.native="
              submitEditedCatalog(
                activeAccount,
                'accountFormEdit',
                activeAccount.parentCatalog
              )
            "
            >Guardar</el-button
          >
          <el-button @click="showEditAccount = false" size="small"
            >Cancelar</el-button
          >
        </div>
      </span>
    </el-dialog>
    <el-tabs
      v-model="tab"
      @tab-click="
        $router
          .replace({
            path: `/entries/settings`,
            query: { tab },
          })
          .catch(() => {})
      "
    >
      <!-- tab catalogo -->
      <el-tab-pane label="Catálogo de cuentas" name="catalog">
        <!-- first row -->
        <el-form>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-3">
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="small"
                  @click="addMayorAccount()"
                >
                  Agregar cuenta mayor
                </el-button>
              </el-form-item>
            </div>
            <div class="col-span-3 col-start-10">
              <el-form-item>
                <el-input
                  suffix-icon="el-icon-search"
                  placeholder="Buscar..."
                  size="small"
                />
              </el-form-item>
            </div>
          </div>
        </el-form>
        <!-- second row -->
        <div class="grid grid-cols-12">
          <div class="col-span-12">
            <el-table :data="accounts" style="width: 100%" stripe size="small">
              <el-table-column
                sortable="true"
                type="index"
                label="#"
                min-width="50"
                align="center"
              ></el-table-column>
              <el-table-column prop="code" label="Código" min-width="60" />
              <el-table-column
                prop="name"
                label="Nombre de la cuenta"
                min-width="260"
              ></el-table-column>
              <el-table-column
                prop="description"
                label="Descripción general"
                min-width="270"
              ></el-table-column>
              <el-table-column
                label="	(A)creedor/(D)eudor"
                min-width="150"
                align="center"
              >
                <template slot-scope="scope">{{
                  scope.row.isAcreedora ? "A" : "D"
                }}</template>
              </el-table-column>
              <el-table-column min-width="150">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="addNewAccountDialog(scope.row)"
                    icon="el-icon-plus"
                  />
                  <el-dropdown trigger="click" szie="mini">
                    <el-button icon="el-icon-more" size="mini" />
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        @click.native="openEditAccount(scope.row)"
                      >
                        <i class="el-icon-edit-outline"></i> Editar cuenta
                      </el-dropdown-item>

                      <el-dropdown-item
                        :divided="true"
                        class="text-red-500 font-semibold"
                        v-if="activeAccount.isParent"
                      >
                        <i class="el-icon-delete"></i> Eliminar Cuenta
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
      <!-- tab balance general -->
      <!-- <el-tab-pane label="Balance General" name="balance-general">
      
        <div class="grid grid-cols-12">
          <div class="col-span-12">
            <Notification
              class="mb-4 w-full"
              type="info"
              title="Información"
              message="Acá puedes configurar las cuentas a incluir en el balance general asi como el nombre para cada sección que deseas que aparezca."
            />
          </div>
        </div>
        
        <el-form>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-3">
              <el-form-item label="Utilidad ejercicios anteriores">
                <el-select
                  size="small"
                  class="w-full"
                  placeholder="Escriba el numero o el nombre"
                  filterable
                  clereable
                  default-first-option
                >
                </el-select>
              </el-form-item>
            </div>
            <div class="col-span-3">
              <el-form-item label="Utilidad ejercicios anteriores">
                <el-select
                  size="small"
                  class="w-full"
                  placeholder="Escribe el numero o el nombre"
                  filterable
                  clereable
                  default-first-option
                >
                </el-select>
              </el-form-item>
            </div>
            <div class="col-span-3">
              <el-form-item label="utilidad presente ejercicio">
                <el-select
                  size="small"
                  class="w-full"
                  placeholder="Escriba el numero o el nombre"
                  filterable
                  clereable
                  default-first-option
                >
                </el-select>
              </el-form-item>
            </div>
            <div class="col-span-3">
              <el-form-item label="Perdida presente ejercicio">
                <el-select
                  size="small"
                  class="w-full"
                  placeholder="Escriba el numero o el nombre"
                  filterable
                  clereable
                  default-first-option
                >
                </el-select>
              </el-form-item>
            </div>
          </div>
        </el-form>
     
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <el-table
              :data="balance"
              style="width: 100%"
              stripe
              size="small"
              border
            >
              <el-table-column prop="cuenta" label="Cuenta" min-width="200" />
              <el-table-column label="Nombre en reporte" min-width="170">
                <template slot-scope="scope">
                  <div class="flex justify-between items-center">
                    <span>{{ scope.row.nombrereporte }}</span>
                    <el-tooltip
                      :open-delay="600"
                      class="item"
                      effect="dark"
                      content="Editar nombre a mostrar en reporte"
                      placement="top"
                    >
                      <el-button icon="el-icon-edit" size="mini" />
                    </el-tooltip>
                  </div> </template
              ></el-table-column>
              <el-table-column min-width="40"></el-table-column>
            </el-table>
          </div>
        </div>
     
        <div class="flex justify-end mt-4">
          <el-button type="primary" size="small" native-type="submit"
            >Guardar</el-button
          >
          <el-button size="small">Cancelar</el-button>
        </div>
      </el-tab-pane> -->
      <!-- tab estado resultados -->
      <!-- <el-tab-pane label="Estado de resultados" name="estado resultados">
     
        <div class="grid grid-cols-12">
          <div class="col-span-12">
            <Notification
              class="mb-4 w-full"
              type="info"
              title="Información"
              message="Acá puedes configurar los detalles que deseas que aparezcan en el estado de resultados, asi como definir si deseas que aparezca desglosado o solo sus totales."
            />
          </div>
        </div>

        
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <el-table
              :data="balance"
              style="width: 100%"
              stripe
              size="small"
              border
            >
              <el-table-column prop="cuenta" label="Nombre" min-width="300" />
              <el-table-column align="center" min-width="40">
                <el-tooltip
                  :open-delay="600"
                  class="item"
                  effect="dark"
                  content="Agregar nueva cuenta"
                  placement="top"
                >
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="small"
                    @click="openAddAccount(scope.row)"
                  />
                </el-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                label="Incluir en reporte"
                min-width="70"
              >
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.show" />
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="Mostrar detalle"
                min-width="65"
              >
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.show" />
                </template>
              </el-table-column>
              <el-table-column min-width="35">
                <el-tooltip
                  :open-delay="600"
                  class="item"
                  effect="dark"
                  content="Agregar nueva cuenta"
                  placement="top"
                >
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    size="small"
                    @click="openAddAccount(scope.row)"
                  />
                </el-tooltip>
              </el-table-column>
            </el-table>
          </div>
        </div>
     
        <div class="flex justify-end mt-4">
          <el-button type="primary" size="small" native-type="submit"
            >Guardar</el-button
          >
          <el-button size="small">Cancelar</el-button>
        </div>
      </el-tab-pane> -->
      <!-- tab integraciones -->
      <!-- <el-tab-pane label="Integraciones" name="integrations" class="space-y-3">
        <Notification
          class="w-full"
          type="info"
          title="Integraciones"
          message="En esta sección se realizan las configuraciones de integración con otros modulos de manera general. Estas configuraciones se aplicarán a todos los clientes que no tengan una configuración individual."
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
import {
  inputValidation,
  selectValidation,
  checkBeforeLeave,
  checkBeforeEnter,
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

    const accountCatalogs = () => this.$axios.get("/entries/catalog");

    Promise.all([accountCatalogs()])
      .then((res) => {
        const [accountCatalogs] = res;
        this.accounts = accountCatalogs.data.accountingCatalog;
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
      balance: [
        { cuenta: "Activo", nombrereporte: "hola que ase en un dia caluroso" },
      ],
      tab: "catalog",
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
      showCreateCatalogDialog: false,
      showCreateAccountEntryDialog: false,
      accounts: [],

      mayorAccountForm: {
        items: [
          {
            code: "",
            name: "",
            isAcreedora: false,
            isBalance: false,
          },
        ],
      },
      newAccountFormRules: {
        code: inputValidation(true),
        name: inputValidation(true),
      },
      newAccountForm: {
        items: [
          {
            code: "",
            name: "",
            isAcreedora: false,
            isBalance: false,
          },
        ],
      },
      activeAccount: {
        code: "",
        name: "",
        description: "",
        isAcreedora: false,
        isBalance: false,
        subCatalogs: [],
      },
      showEditMayorDialog: false,
      showEditAccount: false,
    };
  },
  methods: {
    mayorAccountFormRules: {},
    addMayorAccount() {
      this.showCreateCatalogDialog = true;
      if (this.$refs["mayorAccountForm"]) {
        this.$refs["mayorAccountForm"].resetFields();
      }
    },
    addNewAccountDialog(parentAccount) {
      console.log(parentAccount);

      this.showCreateAccountEntryDialog = true;

      this.activeAccount = { ...parentAccount, subCatalogs: [] };
      console.log(this.activeAccount);
      return false;
      this.newAccountForm.items = [
        {
          code: "",
          name: "",
          description: "",
          isAcreedora: false,
          isBalance: false,
        },
      ];
    },
    addNewMayorAccount() {
      this.mayorAccountForm.items.push({
        code: "",
        name: "",
        isAcreedora: false,
        isBalance: false,
      });
    },
    removeMayorAccount(index) {
      this.mayorAccountForm.items.splice(index, 1);
    },
    addNewAccount() {
      this.newAccountForm.items.push({
        code: "",
        name: "",
        isAcreedora: false,
        isBalance: false,
      });
    },
    removeNewAccount(index) {
      this.newAccountForm.items.splice(index, 1);
    },
    submitNewCatalog(mayorAccounts, formName, activeAccount) {
      console.log(mayorAccounts, formName, activeAccount);
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        }

        // Verifica si es sub cuenta
        if (activeAccount) {
          // Si es sub cuenta actualiza el codigo a utilizar
          mayorAccounts = mayorAccounts.map((a) => {
            return { ...a, code: `${activeAccount.code}${a.code}` };
          });
        }

        // Verifica si los codigos en la ventana de dialogo estan duplicados entre ellos.
        let count = {};
        for (let i = 0; i < mayorAccounts.length; i++) {
          const acc = mayorAccounts[i].code;
          count[acc] = count[acc] ? count[acc] + 1 : 1;
        }

        if (Object.values(count).filter((v) => v > 1).length > 0) {
          return this.$notify({
            title: "Error",
            message: "No puedes tener números de códigos duplicados.",
            type: "error",
          });
        }

        // Verifica si los codigos nuevos y los guardados estan duplicados entre ellos.
        const catalog = this.accounts.map((a) => a.code);
        for (const acc of mayorAccounts) {
          if (catalog.includes(acc.code)) {
            return this.$notify({
              title: "Error",
              message:
                "No pueden existir códigos duplicados entres las nuevas cuentas y las ya existentes.",
              type: "error",
            });
          }
        }

        this.$confirm(
          "¿Estás seguro que deseas guardar estas cuentas contables?",
          "Confirmación",
          {
            confirmButtonText: "Si, guardar",
            cancelButtonText: "Cancelar",
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "Procesando...";
                let dataAccounts = "";
                for (const acc of mayorAccounts) {
                  // Agrega la descripcion
                  const description = !acc.description
                    ? null
                    : `"${acc.description}"`;

                  // Agrega parentCatalog
                  const parentCatalog = !activeAccount ? null : activeAccount;

                  // esto ya no seria necesario (pasarlo a string, ahorita guarda obketos en el arreglo)
                  // proba nuevamente

                  this.accounts.push({
                    code: `${acc.code}`,
                    name: acc.name,
                    description: description,
                    isAcreedora: acc.isAcreedora,
                    isBalance: acc.isBalance,
                    parentCatalog: parentCatalog,
                  });

                  // dataAccounts += `{
                  //   code: "${acc.code}",
                  //   name: "${acc.name}",
                  //   description: ${description},
                  //   isAcreedora: ${acc.isAcreedora},
                  //   isBalance: ${acc.isBalance},
                  //   parentCatalog: ${parentCatalog},
                  // }`;

                  // if (!activeAccount) {
                  //   this.accounts += dataAccounts;
                  // } else {
                  //   this.accounts += dataAccounts;
                  // }
                }
                setTimeout(() => {
                  this.$refs[formName].resetFields();
                  this.showCreateAccountEntryDialog = false;
                  (this.mayorAccountForm.items = [
                    {
                      code: "",
                      name: "",
                      isAcreedora: false,
                      isBalance: false,
                    },
                  ]),
                    (this.showCreateCatalogDialog = false);
                  instance.confirmButtonLoading = false;
                  instance.confirmButtonText = "Si, guardar";
                  done();
                }, 500);
              } else {
                done();
              }
            },
          }
        );
      });
    },
    openEditAccount(account) {
      console.log(account);

      if (account.code.length == 1) {
        this.activeAccount = { ...account };
        this.showEditMayorDialog = true;
      } else {
        this.activeAccount = {
          ...account,
        };
        this.showEditAccount = true;
      }
    },
  },
  computed: {
    // filteredIntegrations() {
    //   return this.integrations.filter((i) => hasModule(i.ref, this.$auth.user));
    // },
  },
};
</script>

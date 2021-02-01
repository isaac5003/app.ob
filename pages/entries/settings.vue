<template>
  <layout-content
    v-loading="pageloading"
    page-title="Configuraciones"
    :breadcrumb="[
      { name: 'Contabilidad', to: '/entries' },
      { name: 'Configuraciones', to: null },
    ]"
  >
    <!-- catalogocuentas -->
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
          <el-form-item
            class="col-span-2"
            label="Código"
            :prop="`items.${i}.code`"
            :rules="{ required: true, message: 'Requerido', trigger: 'blur' }"
          >
            <el-input
              v-model="item.code"
              type="number"
              :min="1"
              size="small"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            class="col-span-5"
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
          <el-form-item class="col-span-2">
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
          <el-form-item class="col-span-2">
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
          <el-form-item class="col-span-1">
            <el-button
              class="w-full"
              type="danger"
              icon="el-icon-delete"
              :disabled="mayorAccountForm.items.length === 1"
              @click="removeMayorAccount(i)"
              size="small"
              style="margin-top: 20px"
            />
          </el-form-item>
        </div>
        <!-- second row -->
        <div class="grid grid-cols-12">
          <el-form-item class="col-span-1">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="addNewMayorAccount()"
            />
          </el-form-item>
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
        status-icon
        ref="activeAccount"
        class="space-y-4"
      >
        <notification
          v-if="activeAccount.isParent"
          type="info"
          title="Atención"
          message="Esta cuenta tiene sub cuentas, y no se puede editar el código, solamente el nombre."
        />
        <!-- first row -->
        <div class="grid grid-cols-12 gap-4">
          <el-form-item
            class="col-span-2"
            label="Código"
            prop="code"
            :rules="{ required: true, message: 'Requerido', trigger: 'blur' }"
          >
            <el-input
              v-model="activeAccount.code"
              type="number"
              :min="1"
              size="small"
            />
          </el-form-item>
          <el-form-item
            class="col-span-6"
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
          <el-form-item prop="service" class="col-span-2">
            <el-checkbox
              v-model="activeAccount.isAcreedora"
              label="Acreedora"
              size="small"
              border
              class="w-full mt-5"
            />
          </el-form-item>
          <el-form-item prop="service" class="col-span-2">
            <el-checkbox
              v-model="activeAccount.isBalance"
              label="Balance"
              size="small"
              border
              class="w-full mt-5"
            />
          </el-form-item>
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
      <el-form :model="subAccountForm" status-icon ref="subAccountForm">
        <div class="flex flex-col space-y-4">
          <div class="grid grid-cols-12 gap-4 text-xs">
            <div class="col-span-2 flex flex-col">
              <span class="font-semibold">Código padre</span>
              <p>{{ activeAccount != null ? activeAccount.code : "" }}</p>
            </div>
            <div class="col-span-3 flex flex-col">
              <span class="font-semibold">Nombre padre</span>
              <p>{{ activeAccount != null ? activeAccount.name : "" }}</p>
            </div>
          </div>

          <!-- first row -->
          <div class="flex flex-col">
            <div
              class="grid grid-cols-12 gap-4"
              v-for="(item, i) in subAccountForm.items"
              :key="i"
            >
              <el-form-item
                class="col-span-2"
                label="Código"
                :prop="`items.${i}.code`"
                :rules="{
                  required: true,
                  message: 'Requerido',
                  trigger: 'blur',
                }"
              >
                <el-input
                  v-model="item.code"
                  type="number"
                  :min="1"
                  size="small"
                  autocomplete="off"
                />
              </el-form-item>
              <div class="col-span-5">
                <div class="grid grid-cols-12 gap-4">
                  <el-form-item
                    class="col-span-6"
                    label="Nombre"
                    :prop="`items.${i}.name`"
                    :rules="{
                      required: true,
                      message: 'Requerido',
                      trigger: 'blur',
                    }"
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
                  <el-form-item class="col-span-6" label="Descripción">
                    <el-input
                      size="small"
                      v-model="item.description"
                      autocomplete="off"
                      style="width: 100%"
                      maxlength="100"
                      minlength="3"
                      show-word-limit
                    />
                  </el-form-item>
                </div>
              </div>
              <el-form-item class="col-span-2">
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
              <el-form-item class="col-span-2">
                <el-checkbox
                  size="small"
                  border
                  class="mt-5"
                  style="width: 100%"
                  v-model="subAccountForm.items[i].isBalance"
                >
                  Balance
                </el-checkbox>
              </el-form-item>
              <el-form-item class="col-span-1">
                <el-button
                  class="w-full"
                  type="danger"
                  icon="el-icon-delete"
                  :disabled="subAccountForm.items.length === 1"
                  @click="removeSubAccount(i)"
                  size="small"
                  style="margin-top: 20px"
                />
              </el-form-item>
            </div>
          </div>
        </div>
        <!-- second row -->
        <div class="grid grid-cols-12">
          <el-form-item prop="service" class="col-span-1">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="addNewSubAccount()"
            />
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="flex justify-end">
          <el-button
            type="primary"
            size="small"
            @click.native="
              submitNewCatalog(
                subAccountForm.items,
                'subAccountForm',
                activeAccount
              )
            "
            >Guardar</el-button
          >
          <el-button @click="showCreateAccountEntryDialog = false" size="small"
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
      width="900px"
    >
      <el-form
        :model="activeAccount"
        status-icon
        ref="accountFormEdit"
        class="space-y-4"
      >
        <notification
          v-if="activeAccount.subAccounts"
          type="info"
          title="Atención"
          message="Esta cuenta tiene sub cuentas, y no se puede editar el código, solamente el nombre."
        />
        <div class="flex flex-col space-y-4">
          <div class="grid grid-cols-12 gap-4 text-xs">
            <div class="col-span-2 flex flex-col">
              <span class="font-semibold">Código padre</span>
              <p>
                {{
                  activeAccount && activeAccount.parentCatalog
                    ? activeAccount.parentCatalog.code
                    : ""
                }}
              </p>
            </div>
            <div class="col-span-10 flex flex-col">
              <span class="font-semibold">Nombre padre</span>
              <p>
                {{
                  activeAccount && activeAccount.parentCatalog
                    ? activeAccount.parentCatalog.name
                    : ""
                }}
              </p>
            </div>
          </div>
          <!-- first row -->
          <div class="grid grid-cols-12 gap-4">
            <el-form-item
              class="col-span-2"
              label="Código"
              prop="code"
              :rules="{
                required: true,
                message: 'Requerido',
                trigger: 'blur',
              }"
            >
              <el-input
                v-model="activeAccount.code"
                type="number"
                :min="1"
                size="small"
              />
            </el-form-item>
            <el-form-item
              class="col-span-3"
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
            <el-form-item class="col-span-3" label="Descripción">
              <el-input v-model="activeAccount.description" size="small" />
            </el-form-item>
            <el-form-item class="col-span-2">
              <el-checkbox
                v-model="activeAccount.isAcreedora"
                label="Acreedora"
                size="small"
                border
                class="w-full mt-5"
              />
            </el-form-item>
            <el-form-item class="col-span-2">
              <el-checkbox
                v-model="activeAccount.isBalance"
                label="Balance"
                size="small"
                border
                class="w-full mt-5"
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

    <!-- BALANCE General
    ADDaccount -->
    <el-dialog
      :title="`Agregar cuenta a: ${selectedParentAccount.name}`"
      :visible.sync="showAddAccount"
      width="500px"
      :append-to-body="true"
      @open="selectedCatalog = []"
    >
      <div class="grid grid-cols-12">
        <div class="col-span-12">
          <el-select
            multiple
            filterable
            remote
            default-first-option
            clearable
            v-model="selectedCatalog"
            placeholder="Escribe el numero o nombre de la cuenta"
            :remote-method="findAccount"
            :loading="loadingAccount"
            class="w-full"
            size="small"
            @focus="filterCatalog = []"
          >
            <el-option
              v-for="item in filteredCatalog"
              :key="item.id"
              :label="`${item.code} - ${item.name}`"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddAccount = false" size="small"
          >Cancelar</el-button
        >
        <el-button
          type="primary"
          @click="addSubAccount(selectedParentAccount, selectedCatalog)"
          size="small"
          >Agregar</el-button
        >
      </span>
    </el-dialog>
    <!-- changedisplayname -->
    <el-dialog
      title="Cambiar nombre en reporte"
      :visible.sync="showChangeDisplayName"
      width="500px"
      :append-to-body="true"
      @open="newDisplayName = ''"
    >
      <div class="flex flex-col space-y-2">
        <span>Cambiar de: {{ selectedParentAccount.display }}</span>
        <el-input
          placeholder="Nombre a mostrar en reporte"
          v-model="newDisplayName"
          size="small"
          clearable
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showChangeDisplayName = false" size="small"
          >Cancelar</el-button
        >
        <el-button
          type="primary"
          @click="addSubAccount(selectedParentAccount, selectedCatalog)"
          size="small"
          >Agregar</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="Cambiar nombre en reporte"
      :visible.sync="showChangeDisplayName"
      width="550px"
      :append-to-body="true"
    >
      <div class="flex flex-col space-y-2">
        <span>Cambiar de: {{ selectedParentAccount.name }}</span>
        <div class="flex flex-row items-center space-x-2">
          <el-checkbox
            size="small"
            v-model="allowNewDisplayName"
            label="Personalizar"
            border
            class="mt-1"
            @change="
              changeAllowDisplay(
                selectedParentAccount,
                allowNewDisplayName,
                newDisplayName
              )
            "
          />
          <el-input
            placeholder="Nombre a mostrar en reporte"
            v-model="newDisplayName"
            size="small"
            clearable
            :disabled="!allowNewDisplayName"
          />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showChangeDisplayName = false" size="small"
          >Cancelar</el-button
        >
        <el-button
          type="primary"
          @click="
            changeDisplayName(
              selectedParentAccount,
              newDisplayName,
              allowNewDisplayName
            )
          "
          size="small"
          >Agregar</el-button
        >
      </span>
    </el-dialog>
    <!-- Estadoderesultados -->
    <el-dialog
      :title="`Agregar cuenta a: ${selectedParentAccountEstado.name}`"
      :visible.sync="showAddAccountEstado"
      width="500px"
      :append-to-body="true"
    >
      <div class="grid grid-cols-12">
        <div class="col-span-12">
          <el-select
            multiple
            filterable
            remote
            default-first-option
            clearable
            v-model="selectedCatalogEstado"
            placeholder="Escribe el numero o nombre de la cuenta"
            :remote-method="findAccount"
            :loading="loadingAccount"
            class="w-full"
            size="small"
          >
            <el-option
              v-for="item in filteredCatalog"
              :key="item.id"
              :label="`${item.code} - ${item.name}`"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddAccountEstado = false" size="small"
          >Cancelar</el-button
        >
        <el-button
          type="primary"
          @click="
            addSubAccountEstado(
              selectedParentAccountEstado,
              selectedCatalogEstado
            )
          "
          size="small"
          >Agregar</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="Cambiar nombre en reporte"
      :visible.sync="showChangeDisplayNameEstado"
      width="550px"
      :append-to-body="true"
    >
      <div class="flex flex-col space-y-2">
        <span>Cambiar de: {{ selectedParentAccountEstado.name }}</span>
        <div class="flex flex-row items-center space-x-2">
          <el-checkbox
            size="small"
            v-model="allowNewDisplayNameEstado"
            label="Personalizar"
            border
            class="mt-1"
            @change="
              changeAllowDisplayName(
                selectedParentAccountEstado,
                allowNewDisplayNameEstado,
                newDisplayNameEstado
              )
            "
          />
          <el-input
            placeholder="Nombre a mostrar en reporte"
            v-model="newDisplayNameEstado"
            size="small"
            clearable
            :disabled="!allowNewDisplayNameEstado"
          />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showChangeDisplayNameEstado = false" size="small"
          >Cancelar</el-button
        >
        <el-button
          type="primary"
          @click="
            changeDisplayNameEstado(
              selectedParentAccountEstado,
              newDisplayNameEstado,
              allowNewDisplayNameEstado
            )
          "
          size="small"
          >Agregar</el-button
        >
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
      <!--  tab generales -->
      <el-tab-pane label="Generales" name="general">
        <!-- <div class="grid grid-cols-12">
          <div class="col-span-12">
            <Notification
              class="mb-4 w-full"
              type="info"
              title="Información"
              
            />
          </div>
        </div> -->
        <el-form
          :model="fiscalPeriodForm"
          :rules="fiscalPeriodFormRules"
          ref="fiscalPeriodForm"
        >
          <div class="grid grid-cols-12 gap-4">
            <el-form-item
              label="Ingrese el periodo fiscal de la empresa"
              prop="startDate"
              class="col-span-4"
            >
              <el-date-picker
                v-model="fiscalPeriodForm.startDate"
                size="small"
                type="month"
                format="MMM-yyyy"
                placeholder="Fecha inicial"
                style="width: 100%"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item label=" " prop="endDate" class="col-span-4">
              <el-date-picker
                v-model="fiscalPeriodForm.endDate"
                size="small"
                type="month"
                format="MMM-yyyy"
                placeholder="Fecha final"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
          </div>

          <div class="flex justify-end mt-4">
            <el-button
              type="primary"
              size="small"
              @click.native="
                settingsGeneral('fiscalPeriodForm', fiscalPeriodForm)
              "
              :disabled="
                fiscalPeriodForm.startDate && fiscalPeriodForm.endDate
                  ? false
                  : true
              "
              >Guardar</el-button
            >
            <el-button size="small" @click="$router.push('/entries')">
              Cancelar
            </el-button>
          </div>
        </el-form>
      </el-tab-pane>
      <!-- Firmantes -->
      <el-tab-pane label="Firmantes" name="signatures">
        <!-- <div class="grid grid-cols-12">
          <div class="col-span-12">
            <Notification
              class="mb-4 w-full"
              type="info"
              title="Información"
              
            />
          </div>
        </div> -->
        <el-form
          :model="firmantesForm"
          :rules="firmantesFormRules"
          ref="firmantesForm"
        >
          <div class="grid grid-cols-12 gap-4">
            <el-form-item
              label="Representante legal/Administrador único"
              prop="legal"
              class="col-span-4"
            >
              <el-input
                v-model="firmantesForm.legal"
                type="text"
                autocomplete="off"
                maxlength="100"
                minlength="5"
                size="small"
                show-word-limit
                clearable
                placeholder=""
              >
              </el-input>
            </el-form-item>
            <el-form-item
              label="Contador General"
              prop="accountant"
              class="col-span-4"
            >
              <el-input
                v-model="firmantesForm.accountant"
                size="small"
                class="w-full"
                autocomplete="off"
                maxlength="100"
                minlength="5"
                show-word-limit
                filterable
                clearable
                placeholder=""
              >
              </el-input>
            </el-form-item>

            <el-form-item label="Auditor" prop="auditor" class="col-span-4">
              <el-input
                v-model="firmantesForm.auditor"
                size="small"
                class="w-full"
                autocomplete="off"
                maxlength="100"
                minlength="5"
                show-word-limit
                filterable
                clearable
                placeholder=""
              >
              </el-input>
            </el-form-item>
          </div>
          <div class="flex justify-end mt-4">
            <el-button
              type="primary"
              size="small"
              @click.native="settingsSignature('firmantesForm', firmantesForm)"
              :disabled="
                firmantesForm.legal &&
                firmantesForm.accountant &&
                firmantesForm.auditor
                  ? false
                  : true
              "
              >Guardar</el-button
            >
            <el-button size="small" @click="$router.push('/entries')"
              >Cancelar</el-button
            >
          </div>
        </el-form>
      </el-tab-pane>
      <!-- tab catalogo -->
      <el-tab-pane label="Catálogo de cuentas" name="catalog" class="space-y-4">
        <!-- first row -->
        <div class="grid grid-cols-12 gap-4">
          <el-button
            class="col-span-3"
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="openMayorAccountDialog()"
          >
            Agregar cuenta mayor
          </el-button>
          <el-input
            class="col-span-3 col-start-10"
            suffix-icon="el-icon-search"
            placeholder="Buscar..."
            v-model="searchValue"
            size="small"
            v-debounce:500ms="fetchCatalog"
            @change="fetchCatalog"
          />
        </div>
        <!-- second row -->
        <el-table
          v-loading="tableloading"
          :data="accounts"
          style="width: 100%"
          stripe
          size="mini"
        >
          <el-table-column
            prop="index"
            label="#"
            min-width="40"
            align="center"
          />
          <el-table-column prop="code" label="Código" min-width="90" />
          <el-table-column
            prop="name"
            label="Nombre de la cuenta"
            min-width="260"
          />
          <el-table-column
            prop="description"
            label="Descripción general"
            min-width="290"
          />
          <el-table-column
            label="	(A)creedor/(D)eudor"
            min-width="160"
            align="center"
          >
            <template slot-scope="scope">{{
              scope.row.isAcreedora ? "A" : "D"
            }}</template>
          </el-table-column>
          <el-table-column min-width="120" align="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="openSubAccountDialog(scope.row)"
                icon="el-icon-plus"
              />
              <el-dropdown trigger="click" szie="mini">
                <el-button icon="el-icon-more" size="mini" />
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="openEditAccount(scope.row)">
                    <i class="el-icon-edit-outline"></i> Editar cuenta
                  </el-dropdown-item>
                  <el-dropdown-item
                    :divided="true"
                    class="text-red-500 font-semibold"
                    v-if="!scope.row.isParent"
                    @click.native="deleteAccount(scope.row)"
                  >
                    <i class="el-icon-delete"></i> Eliminar Cuenta
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <div class="flex justify-end">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="fetchCatalog"
            :current-page.sync="page.page"
            :page-sizes="[5, 10, 15, 25, 50, 100]"
            :page-size="page.size"
            layout="total, sizes, prev, pager, next"
            :total="parseInt(accountsCount)"
            :pager-count="5"
          />
        </div>
      </el-tab-pane>
      <!-- tab balance general -->
      <el-tab-pane label="Balance General" name="balance-general">
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
                  filterable
                  default-first-option
                  clearable
                  v-model="specialAccounts.accum_gain"
                  placeholder="Escribe el numero o nombre de la cuenta"
                  class="w-full"
                  size="small"
                >
                  <el-option
                    v-for="item in catalogs"
                    :key="item.id"
                    :label="`${item.code} - ${item.name}`"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-span-3">
              <el-form-item label="Perdida ejercicios anteriores">
                <el-select
                  filterable
                  default-first-option
                  clearable
                  v-model="specialAccounts.accum_lost"
                  placeholder="Escribe el numero o nombre de la cuenta"
                  class="w-full"
                  size="small"
                >
                  <el-option
                    v-for="item in catalogs"
                    :key="item.id"
                    :label="`${item.code} - ${item.name}`"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-span-3">
              <el-form-item label="Utilidad presente ejercicio">
                <el-select
                  filterable
                  default-first-option
                  clearable
                  v-model="specialAccounts.curre_gain"
                  placeholder="Escribe el numero o nombre de la cuenta"
                  class="w-full"
                  size="small"
                >
                  <el-option
                    v-for="item in catalogs"
                    :key="item.id"
                    :label="`${item.code} - ${item.name}`"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="col-span-3">
              <el-form-item label="Perdida presente ejercicio">
                <el-select
                  filterable
                  default-first-option
                  clearable
                  v-model="specialAccounts.curre_lost"
                  placeholder="Escribe el numero o nombre de la cuenta"
                  class="w-full"
                  size="small"
                >
                  <el-option
                    v-for="item in catalogs"
                    :key="item.id"
                    :label="`${item.code} - ${item.name}`"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
        </el-form>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <el-table
              :data="tableData"
              row-key="id"
              border
              default-expand-all
              size="mini"
              v-loading="tableloading"
            >
              <el-table-column label="Cuenta" min-width="200">
                <template slot-scope="scope">
                  <span>{{ scope.row.id }} - {{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="display"
                label="Nombre en reporte"
                min-width="170"
              >
                <template slot-scope="scope">
                  <div class="flex justify-between items-center">
                    <span>{{ scope.row.display }}</span>
                    <el-tooltip
                      :open-delay="600"
                      class="item"
                      effect="dark"
                      content="Editar nombre a mostrar en reporte"
                      placement="top"
                    >
                      <el-button
                        icon="el-icon-edit"
                        size="mini"
                        @click="openChangeDisplay(scope.row, 'balance')"
                      />
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="display" align="center" min-width="40">
                <template slot-scope="scope">
                  <el-tooltip
                    :open-delay="600"
                    v-if="scope.row.showAdd"
                    class="item"
                    effect="dark"
                    content="Agregar nueva cuenta"
                    placement="top"
                  >
                    <el-button
                      type="primary"
                      icon="el-icon-plus"
                      size="small"
                      @click="openAddAccount(scope.row, 'balance')"
                    />
                  </el-tooltip>
                  <el-tooltip
                    :open-delay="600"
                    v-if="scope.row.canDelete"
                    class="item"
                    effect="dark"
                    content="Eliminar esta cuenta"
                    placement="top"
                  >
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="small"
                      @click="deleteSubAccount(scope.row)"
                    />
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <div class="flex justify-end mt-4">
          <el-button
            type="primary"
            size="small"
            @click.native="
              submitBalance(
                tableData,

                specialAccounts
              )
            "
            >Guardar</el-button
          >
          <el-button size="small">Cancelar</el-button>
        </div>
      </el-tab-pane>

      <!-- tab estado resultados -->
      <el-tab-pane label="Estado de resultados" name="estado-resultados">
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
              v-loading="tableloading"
              ref="table"
              :data="tablesData"
              row-key="id"
              border
              size="mini"
            >
              <el-table-column label="Nombre" min-width="300">
                <template slot-scope="scope">
                  <span :class="{ 'font-semibold': scope.row.bold }"
                    >{{ scope.row.code ? `${scope.row.code} -` : "" }}
                    {{ scope.row.display }}</span
                  >
                  <i
                    class="el-icon-right mx-2"
                    v-if="scope.row.display != scope.row.name"
                  ></i>
                  <span
                    class="italic text-gray-600"
                    style="font-size: 10px"
                    v-if="scope.row.display != scope.row.name"
                    >( {{ scope.row.name }})</span
                  >
                </template>
              </el-table-column>
              <el-table-column align="center" width="90">
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="scope.row.showUpdateName"
                    :open-delay="600"
                    class="item"
                    effect="dark"
                    content="Editar nombre a mostrar en reporte"
                    placement="top"
                  >
                    <el-button
                      icon="el-icon-edit"
                      size="mini"
                      @click="openChangeDisplay(scope.row, 'results')"
                    />
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                label="Incluir en reporte"
                align="center"
                width="130"
              >
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.show"
                    v-if="!scope.row.canDelete"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="Mostrar detalle"
                align="center"
                width="130"
              >
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.details"
                    v-if="scope.row.showAdd"
                  />
                </template>
              </el-table-column>
              <el-table-column align="center" width="100">
                <template slot-scope="scope">
                  <el-tooltip
                    :open-delay="600"
                    v-if="scope.row.showAdd"
                    class="item"
                    effect="dark"
                    content="Agregar nueva cuenta"
                    placement="top"
                  >
                    <el-button
                      type="primary"
                      icon="el-icon-plus"
                      size="small"
                      @click="openAddAccount(scope.row, 'results')"
                    />
                  </el-tooltip>
                  <el-tooltip
                    :open-delay="600"
                    v-if="scope.row.canDelete"
                    class="item"
                    effect="dark"
                    content="Eliminar esta cuenta"
                    placement="top"
                  >
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="small"
                      @click="deleteSubAccountEstado(scope.row)"
                    />
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <div class="flex justify-end mt-4">
          <el-button
            type="primary"
            size="small"
            @click.native="submitResults(tablesData)"
            >Guardar</el-button
          >
          <el-button size="small">Cancelar</el-button>
        </div>
      </el-tab-pane>

      <!--  tab de firmante -->
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
import { endOfMonth, format, startOfMonth } from "date-fns";
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

    const accountCatalogs = () =>
      this.$axios.get("/entries/catalog", { params: this.page });
    const accounts = () => this.$axios.get("/entries/catalog");
    const balance = () => this.$axios.get("/entries/setting/balance-general");
    const results = () => this.$axios.get("/entries/setting/estado-resultados");
    Promise.all([accountCatalogs(), accounts(), balance(), results()])
      .then((res) => {
        const [accountCatalogs, accounts, balance, results] = res;
        this.accounts = accountCatalogs.data.accountingCatalog;
        this.accountsCount = accountCatalogs.data.count;
        this.catalogs = accounts.data.accountingCatalog;
        this.tableData = balance.data.balanceGeneral.report;
        this.specialAccounts = { ...balance.data.balanceGeneral.special };
        this.tablesData = results.data.estadoResultados.map((r) => {
          const obj = { ...r };
          if (r.children) {
            const children = r.children.map((ch) => {
              return {
                ...ch,
                code: ch.id,
              };
            });
            obj["children"] = children;
          }
          return obj;
        });
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message;
      })
      .then((alw) => (this.pageloading = false));
  },
  fetchOnServer: false,
  data() {
    const newCargoValidateCompare = (rule, value, callback) => {
      const abono =
        this.newEntryDetailForm.abono > 0
          ? this.newEntryDetailForm.abono.toFixed(2)
          : "";
      const val = value > 0 ? value.toFixed(2) : "";
      if (!abono) {
        if (!val) {
          callback(new Error("Este campo es requerido."));
        } else {
          callback();
        }
      } else if (abono && val) {
        return callback(
          new Error("No puedes agregar cargo y abono al mismo tiempo")
        );
      } else {
        callback();
      }
    };
    const startDateValidateCompare = (rule, value, callback) => {
      const startDate = this.fiscalPeriodForm.startDate
        ? new Date(this.fiscalPeriodForm.startDate)
        : "";
      const val = value ? new Date(value) : "";
      if (!startDate) {
        if (!val) {
          callback(new Error("Este campo es requerido."));
        } else {
          callback();
        }
      } else if (startDate > val) {
        return callback(new Error("La fecha inicial no puede ser mayor"));
      } else {
        callback();
      }
    };
    const endDateValidateCompare = (rule, value, callback) => {
      const endDate = this.fiscalPeriodForm.endDate
        ? new Date(this.fiscalPeriodForm.endDate)
        : "";
      const val = value ? new Date(value) : "";
      if (!endDate) {
        if (!val) {
          callback(new Error("Este campo es requerido."));
        } else {
          callback();
        }
      } else if (endDate < val) {
        return callback(new Error("La fecha final no puede ser menor"));
      } else {
        callback();
      }
    };

    return {
      pageloading: true,
      tableloading: false,
      tab: "general",
      utab: "invoicing",
      date: new Date(2021, 2),
      firmantesForm: {
        legal: "",
        accountant: "",
        auditor: "",
      },
      firmantesFormRules: {
        legal: inputValidation(true, 5, 100),
        accountant: inputValidation(true, 5, 100),
        auditor: inputValidation(true, 5, 100),
      },
      fiscalPeriodForm: {
        startDate: "",
        endDate: "",
      },
      fiscalPeriodFormRules: {
        startDate: selectValidation(true),
        endDate: selectValidation(true),
      },

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
      page: {
        limit: 10,
        page: 1,
      },
      accounts: [],
      accountsCount: "",
      rawCatalog: [],
      showCreateCatalogDialog: false,
      showCreateAccountEntryDialog: false,
      mayorAccountForm: {
        items: [
          {
            code: "1",
            name: "",
            isAcreedora: false,
            isBalance: false,
          },
        ],
      },
      subAccountForm: {
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
      searchValue: "",
      tableData: [
        {
          id: 1,
          name: "ACTIVO",
          display: "ACTIVO",
          children: [
            {
              id: 11,
              name: "ACTIVO CORRIENTE",
              display: "ACTIVO CORRIENTE",
              showAdd: true,
              children: [],
            },
            {
              id: 12,
              name: "ACTIVO NO CORRIENTE",
              display: "ACTIVO NO CORRIENTE",
              showAdd: true,
              children: [],
            },
          ],
        },
        {
          id: 2,
          name: "PASIVO",
          display: "PASIVO",
          children: [
            {
              id: 21,
              name: "PASIVO CORRIENTE",
              display: "PASIVO CORRIENTE",
              showAdd: true,
              children: [],
            },
            {
              id: 22,
              name: "PASIVO NO CORRIENTE",
              display: "PASIVO NO CORRIENTE",
              showAdd: true,
              children: [],
            },
          ],
        },
        {
          id: 3,
          name: "PATRIMONIO",
          display: "PATRIMONIO",
          children: [
            {
              id: 31,
              name: "CAPITAL Y RESERVAS",
              display: "CAPITAL Y RESERVAS",
              showAdd: true,
              children: [],
            },
          ],
        },
      ],
      specialAccounts: {
        accum_gain: "",
        accum_lost: "",
        curre_gain: "",
        curre_lost: "",
      },
      showAddAccount: false,
      selectedParentAccount: {},
      selectedCatalog: [],
      loadingAccount: false,
      filteredCatalog: [],
      showChangeDisplayName: false,

      allowNewDisplayName: false,
      newDisplayName: "",
      catalogs: [],
      // //Estadoderesultados
      tablesData: [
        {
          name: "Ingreso de actividades ordinarias",
          display: "Ingreso de actividades ordinarias",
          showUpdateName: true,
          showAdd: true,
          children: [],
          show: true,
          details: false,
          id: 1,
        },
        {
          name: "Costo de ventas, producción o servicios",
          display: "Costo de ventas, producción o servicios",
          showUpdateName: true,
          showAdd: true,
          children: [],
          show: true,
          details: false,
          id: 2,
        },
        {
          name: "Utilidad/Perdida bruta",
          display: "Utilidad/Perdida bruta",
          showUpdateName: true,
          bold: true,

          show: true,
        },
        {
          name: "Otros ingresos",
          display: "Otros ingresos",
          showUpdateName: true,
          showAdd: true,
          children: [],
          show: false,
          details: false,
          id: 3,
        },
        {
          name: "Otros gastos",
          display: "Otros gastos",
          showUpdateName: true,
          showAdd: true,
          children: [],
          show: true,
          details: false,
          id: 4,
        },
        {
          name: "Gastos de distribucion y venta",
          display: "Gastos de distribucion y venta",
          showUpdateName: true,
          showAdd: true,
          children: [],
          show: true,
          details: false,
          id: 5,
        },
        {
          name: "Gastos de administracion",
          display: "Gastos de administracion",
          showUpdateName: true,
          showAdd: true,
          children: [],
          show: true,
          details: false,
          id: 6,
        },
        {
          name: "Utilidad/Perdida de operacion",
          display: "Utilidad/Perdida de operacion",
          showUpdateName: true,
          bold: true,

          show: true,
        },
        {
          name: "Ingresos financieros",
          display: "Ingresos financieros",
          showUpdateName: true,
          showAdd: true,
          children: [],
          show: true,
          details: false,
          id: 7,
        },
        {
          name: "Gastos financieros",
          display: "Gastos financieros",
          showUpdateName: true,
          showAdd: true,
          children: [],
          show: true,
          details: false,
          id: 8,
        },
        {
          name:
            "Utiidad/Perdida antes de impuesto sobre la renta y las ganancias",
          display:
            "Utiidad/Perdida antes de impuesto sobre la renta y las ganancias",
          showUpdateName: true,
          bold: true,

          show: true,
        },
        {
          name: "Reserva legal",
          display: "Reserva legal",
          showUpdateName: true,
          showAdd: true,
          children: [],
          show: true,
          details: false,
          id: 9,
        },
        {
          name: "Utiidad/Perdida antes de impuesto sobre la renta",
          display: "Utiidad/Perdida antes de impuesto sobre la renta",
          showUpdateName: true,
          bold: true,

          show: true,
        },
        {
          name: "Impuesto sobre la renta",
          display: "Impuesto sobre la renta",
          showUpdateName: true,
          showAdd: true,
          children: [],
          show: true,
          details: false,
          id: 10,
        },
        {
          name:
            "Utilidad/Perdida antes de contribucion especial a las ganancias",
          display:
            "Utilidad/Perdida antes de contribucion especial a las ganancias",
          showUpdateName: true,
          bold: true,

          show: true,
        },
        {
          name: "Contribucion especial a las ganancias",
          display: "Contribucion especial a las ganancias",
          showUpdateName: true,
          showAdd: true,
          children: [],
          show: true,
          details: false,
          id: 11,
        },
        {
          name: "Resultado del ejercicio",
          display: "Resultado del ejercicio",
          showUpdateName: true,
          bold: true,
          show: true,
        },
        {
          name: "Otros resultados integrales del ejercicio neto de impuestos",
          display:
            "Otros resultados integrales del ejercicio neto de impuestos",
          showUpdateName: true,
          showAdd: true,
          children: [],
          show: true,
          details: false,
          id: 12,
        },
        {
          name: "RESULTADO INTEGRAL TOTAL DEL AÑO",
          display: "RESULTADO INTEGRAL TOTAL DEL AÑO",
          showUpdateName: true,
          bold: true,

          show: true,
        },
      ],

      showAddAccountEstado: false,
      selectedCatalogEstado: "",
      selectedParentAccountEstado: {},
      loadingAccountEstado: false,
      filteredCatalogEstado: [],
      showChangeDisplayNameEstado: false,
      allowNewDisplayNameEstado: false,
      newDisplayNameEstado: "",
      filteredCatalogBalance: [],
    };
  },
  methods: {
    //  CatalogAccount
    openMayorAccountDialog() {
      if (this.$refs["mayorAccountForm"]) {
        this.$refs["mayorAccountForm"].resetFields();
        this.mayorAccountForm.items = [
          {
            code: "1",
            name: "",
            isAcreedora: false,
            isBalance: false,
          },
        ];
      }
      this.showCreateCatalogDialog = true;
    },
    openSubAccountDialog(parentAccount) {
      if (this.$refs["subAccountForm"]) {
        this.$refs["subAccountForm"].resetFields();
        this.subAccountForm.items = [
          {
            code: "",
            name: "",
            description: "",
            isAcreedora: false,
            isBalance: false,
          },
        ];
      }
      this.showCreateAccountEntryDialog = true;
      this.activeAccount = { ...parentAccount, subCatalogs: [] };

      return false;
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
    addNewSubAccount() {
      this.subAccountForm.items.push({
        code: "",
        name: "",
        isAcreedora: false,
        isBalance: false,
      });
    },
    removeSubAccount(index) {
      this.subAccountForm.items.splice(index, 1);
    },
    submitNewCatalog(mayorAccounts, formName, activeAccount) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false;

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
          if (catalog.includes(acc.code.toString())) {
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

                this.$axios
                  .post("/entries/catalog", {
                    parentCatalog: !activeAccount ? null : activeAccount.id,
                    accounts: mayorAccounts,
                  })
                  .then((res) => {
                    this.$notify.success({
                      title: "Exito",
                      message: res.data.message,
                    });
                    this.fetchCatalog();
                    this.showCreateCatalogDialog = false;
                    this.showCreateAccount = false;
                    done();
                  })
                  .catch(
                    (err) => (this.errorMessage = err.response.data.message)
                  )
                  .then((alw) => {
                    instance.confirmButtonLoading = false;
                    instance.confirmButtonText = "Si, guardar";
                  });

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
    fetchCatalog() {
      this.tableloading = true;
      let params = this.page;
      if (this.searchValue) {
        params = { ...params, search: this.searchValue.toLowerCase() };
      }

      this.$axios
        .get("/entries/catalog", { params })
        .then((res) => {
          this.accounts = res.data.accountingCatalog;
          this.accountsCount = res.data.count;
          this.tableloading = false;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        })
        .then((alw) => (this.tableloading = false));
    },
    handleSizeChange(val) {
      this.page.limit = val;
      this.fetchCatalog();
    },
    openEditAccount(account) {
      this.activeAccount = { ...account };
      if (account.code.length == 1) {
        this.showEditMayorDialog = true;
      } else {
        this.showEditAccount = true;
      }
    },
    deleteAccount({ id }) {
      this.$confirm(
        "¿Estás seguro que deseas eliminar esta cuenta?",
        "Confirmación",
        {
          confirmButtonText: "Si, eliminar",
          cancelButtonText: "Cancelar",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "Procesando...";
              this.$axios
                .delete(`/entries/catalog/${id}`)
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchCatalog();
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
            } else {
              done();
            }
          },
        }
      );
    },
    submitEditedCatalog(accounts, formName, activeAccount) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        }

        // Genera el codigo real a guardar
        const realCode = !activeAccount
          ? `${accounts.code}`
          : `${activeAccount.code}${accounts.code}`;

        // Verifica si los codigos nuevos y los guardados estan duplicados entre ellos.
        // const catalog = this.accounts.map((a) => a.code);
        const catalog = this.accounts
          .filter((a) => a.id != accounts.id)
          .map((a) => a.code);

        if (catalog.includes(realCode)) {
          return this.$notify({
            title: "Error",
            message: "No pueden existir códigos duplicados entres las cuentas.",
            type: "error",
          });
        }

        this.$confirm(
          "¿Estás seguro que deseas actualizar esta cuenta contable?",
          "Confirmación",
          {
            confirmButtonText: "Si, guardar",
            cancelButtonText: "Cancelar",
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "Procesando...";

                this.$axios
                  .put(`/entries/catalog/${accounts.id}`, {
                    ...accounts,
                  })
                  .then((res) => {
                    this.$notify.success({
                      title: "Exito",
                      message: res.data.message,
                    });
                    this.fetchCatalog();
                    this.showEditMayorDialog = false;
                    this.showEditAccount = false;
                    done();
                  })
                  .catch(
                    (err) => (this.errorMessage = err.response.data.message)
                  )
                  .then((alw) => {
                    instance.confirmButtonLoading = false;
                    instance.confirmButtonText = "Si, guardar";
                  });

                setTimeout(() => {
                  this.$refs[formName].resetFields();
                  this.showCreateAccountEntryDialog = false;
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
    // balanceGeneral
    openAddAccount(parent, tabName) {
      switch (tabName) {
        case "balance":
          this.showAddAccount = true;
          this.selectedParentAccount = { ...parent };
          this.filteredCatalog = [];
          break;
        case "results":
          this.showAddAccountEstado = true;
          this.selectedParentAccountEstado = { ...parent };
          this.filteredCatalog = [];
          this.selectedCatalogEstado = "";
          break;
      }
    },
    findAccount(query) {
      if (query !== "") {
        this.loadingAccount = true;
        this.$axios
          .get("/entries/catalog", { params: { search: query.toLowerCase() } })
          .then((res) => {
            this.filteredCatalog = res.data.accountingCatalog;
            this.loadingAccount = false;
          })
          .catch((err) => (this.errorMessage = err.response.data.message));
      } else {
        this.filteredCatalog = [];
      }
    },
    addSubAccount(selected, list) {
      let addTo = this.tableData.find((td) => {
        return td.children.find((c) => c.id == selected.id);
      });
      addTo = addTo.children.find((c) => c.id == selected.id);
      for (const code of list) {
        const account = this.catalogs.find((c) => c.id == code);
        addTo.children.push({
          id: account.code,
          name: account.name,
          display: account.name,
          canDelete: true,
        });
      }
      this.showAddAccount = false;
    },
    deleteSubAccount(selected) {
      let parent = null;
      for (const acc of this.tableData) {
        for (const ch of acc.children) {
          for (const c of ch.children) {
            if (c.id == selected.id) {
              parent = ch;
            }
          }
        }
      }
      const index = parent.children.findIndex((e) => e.id == selected.id);
      parent.children.splice(index, 1);
    },
    changeDisplayName(account, display, allow) {
      if (display == "") {
        return this.$notify.error({
          title: "Error",
          message: "Debes incluir un nombre a mostrar",
        });
      }
      account.display = allow ? display : account.name;
      this.showChangeDisplayName = false;
    },
    changeAllowDisplay(account, allowNewDisplayName, newDisplayName) {
      this.newDisplayName == allowNewDisplayName
        ? newDisplayName
        : account.display;
    },
    openChangeDisplay(account, tabName) {
      switch (tabName) {
        case "balance":
          this.selectedParentAccount = account;
          this.showChangeDisplayName = true;

          break;
        case "results":
          this.selectedParentAccountEstado = account;
          this.newDisplayNameEstado = account.display;
          this.showChangeDisplayNameEstado = true;
          break;
      }
    },
    findAccountBalance(query) {
      if (query !== "") {
        this.loadingAccount = true;
        setTimeout(() => {
          this.filteredCatalogBalance = this.catalogs.filter((c) => {
            return (
              c.id.includes(query.toLowerCase()) ||
              c.code.toLowerCase().includes(query.toLowerCase()) ||
              c.name.toLowerCase().includes(query.toLowerCase())
            );
          });
          this.loadingAccount = false;
        }, 200);
      } else {
        this.filteredCatalogBalance = this.catalogs;
      }
    },
    fetchBalance() {
      this.$axios
        .get("/entries/setting/balance-general")
        .then((res) => {
          this.tableData = balance.data.balanceGeneral.report;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        })
        .then((alw) => (this.tableloading = false));
    },
    submitBalance(report, special) {
      this.$confirm(
        "¿Estás seguro que deseas actualizar balance General?",
        "Confirmación",
        {
          confirmButtonText: "Si, guardar",
          cancelButtonText: "Cancelar",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "Procesando...";

              this.$axios
                .put(`/entries/setting/balance-general`, {
                  settings: {
                    report: report,
                    special: special,
                  },
                })
                .then((res) => {
                  this.$notify.success({
                    title: "Exito",
                    message: res.data.message,
                  });
                  this.fetchBalance();

                  done();
                })
                .catch((err) => (this.errorMessage = err.response.data.message))
                .then((alw) => {
                  instance.confirmButtonLoading = false;
                  instance.confirmButtonText = "Si, guardar";
                });
            } else {
              instance.confirmButtonLoading = false;
              instance.confirmButtonText = "Si, guardar";
              done();
            }
          },
        }
      );
    },
    //estado de resultados

    addSubAccountEstado(selected, list) {
      const tablesData = [...this.tablesData];
      this.tablesData = [];

      for (const code of list) {
        let addTo = tablesData.find((c) => c.id == selected.id);
        const account = this.catalogs.find((c) => c.id == code);

        addTo.children.push({
          id: account.code,
          code: account.code,
          name: account.name,
          display: account.name,
          canDelete: true,
          showUpdateName: false,
        });
      }

      this.showAddAccountEstado = false;

      this.tablesData = [...tablesData];
    },
    deleteSubAccountEstado(selected) {
      let parent = null;
      const tablesData = [...this.tablesData];
      this.tablesData = [];

      for (const acc of tablesData) {
        if (acc.hasOwnProperty("children")) {
          for (const c of acc.children) {
            if (c.id == selected.id) {
              parent = acc;
            }
          }
        }
      }
      const index = parent.children.findIndex((e) => e.id == selected.id);
      parent.children.splice(index, 1);
      this.tablesData = [...tablesData];
    },

    changeDisplayNameEstado(account, display, allow) {
      if (display == "") {
        return this.$notify.error({
          title: "Error",
          message: "Debes incluir un nombre a mostrar",
        });
      }
      account.display = allow ? display : account.name;
      this.showChangeDisplayNameEstado = false;
    },
    changeAllowDisplayName(account, allowNewDisplayNameEstado, newDisplayName) {
      this.newDisplayNameEstado == allowNewDisplayNameEstado
        ? newDisplayNameEstado
        : account.display;
    },
    fetchResults() {
      this.$axios
        .get("/entries/setting/estado-resultados")
        .then((res) => {
          this.tablesData = res.data.estadoResultados;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        })
        .then((alw) => (this.tableloading = false));
    },

    submitResults(tablesData) {
      this.$confirm(
        "¿Estás seguro que deseas actualizar Estado de resultados?",
        "Confirmación",
        {
          confirmButtonText: "Si, guardar",
          cancelButtonText: "Cancelar",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "Procesando...";

              this.$axios
                .put(`/entries/setting/estado-resultados`, {
                  settings: tablesData,
                })
                .then((res) => {
                  this.$notify.success({
                    title: "Exito",
                    message: res.data.message,
                  });
                  this.fetchResults();

                  done();
                })
                .catch((err) => (this.errorMessage = err.response.data.message))
                .then((alw) => {
                  instance.confirmButtonLoading = false;
                  instance.confirmButtonText = "Si, guardar";
                });
            } else {
              instance.confirmButtonLoading = false;
              instance.confirmButtonText = "Si, guardar";
              done();
            }
          },
        }
      );
    },
    cancel() {
      this.$confirm("¿Estás seguro que deseas salir?", "Confirmación", {
        confirmButtonText: "Si, salir",
        cancelButtonText: "Cancelar",
        type: "warning",
      }).then(() => {
        this.$router.push("/entries");
      });
    },
    settingsGeneral(formName, fiscalPeriodForm) {
      const periodStart = fiscalPeriodForm.startDate;
      let peridoEnd = endOfMonth(new Date(fiscalPeriodForm.endDate));
      peridoEnd = this.$dateFns.format(new Date(peridoEnd), "yyyy-MM-dd");
      this.$confirm(
        "¿Estás seguro que deseas actualizar el periodo fiscal?",
        "Confirmación",
        {
          confirmButtonText: "Si, guardar",
          cancelButtonText: "Cancelar",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "Procesando...";

              this.$axios
                .put(`/entries/setting/general`, {
                  periodStart,
                  peridoEnd,
                })
                .then((res) => {
                  this.$notify.success({
                    title: "Exito",
                    message: res.data.message,
                  });
                  this.$refs[formName].resetFields();
                  instance.confirmButtonLoading = false;
                  instance.confirmButtonText = "Si, guardar";
                  done();
                })

                .catch((err) => {
                  console.log(err)(
                    (this.errorMessage = err.response.data.message)
                  );
                });
            } else {
              instance.confirmButtonLoading = false;
              instance.confirmButtonText = "Si, guardar";
              done();
            }
          },
        }
      );
    },
    settingsSignature(formName, firmantesForm) {
      console.log(formName);
      this.$confirm(
        "¿Estás seguro que deseas actualizar datos de firmantes?",
        "Confirmación",
        {
          confirmButtonText: "Si, guardar",
          cancelButtonText: "Cancelar",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "Procesando...";

              this.$axios
                .put(`/entries/setting/signatures`, {
                  ...firmantesForm,
                })
                .then((res) => {
                  this.$notify.success({
                    title: "Exito",
                    message: res.data.message,
                  });
                  this.$refs[formName].resetFields();
                  instance.confirmButtonLoading = false;
                  instance.confirmButtonText = "Si, guardar";
                  done();
                })

                .catch((err) => {
                  this.errorMessage = err.response.data.message;
                });
            } else {
              instance.confirmButtonLoading = false;
              instance.confirmButtonText = "Si, guardar";
              done();
            }
          },
        }
      );
    },
  },
  computed: {
    // filteredIntegrations() {
    //   return this.integrations.filter((i) => hasModule(i.ref, this.$auth.user));
    // },
  },
};
</script>

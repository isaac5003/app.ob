<template>
  <layout-content
    v-loading="pageloading"
    page-title="Sucursales"
    :breadcrumb="[
      { name: 'Proveedores', to: '/providers' },
      { name: 'Sucursales', to: null },
    ]"
  >
    <!-- vista previa -->
    <el-dialog
      title="Vista previa "
      :visible.sync="showViewPreview"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="900px"
    >
      <div class="flex flex-col space-y-6">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-4 flex flex-col">
            <span class="font-semibold">Nombre de sucursal</span>
            <div class="flex justify-between">
              {{ selectedBranch ? selectedBranch.name : "" }}
              <el-tag
                size="small"
                type="info"
                effect="dark"
                v-if="selectedBranch ? selectedBranch.default : false"
              >
                <i class="el-icon-place"></i>
                Principal</el-tag
              >
            </div>
          </div>

          <div class="col-span-2 flex flex-col">
            <span class="font-semibold">Pais</span>
            <span>{{ selectedBranch ? selectedBranch.country.name : "" }}</span>
          </div>
          <div class="col-span-2 flex flex-col">
            <span class="font-semibold">Deparmento</span>
            <span>{{ selectedBranch ? selectedBranch.state.name : "" }}</span>
          </div>
          <div class="col-span-3 flex flex-col">
            <span class="font-semibold">Municipio</span>
            <span>{{ selectedBranch ? selectedBranch.city.name : "" }}</span>
          </div>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-6 flex flex-col">
            <span class="font-semibold">Dirección 1</span>
            <span>{{ selectedBranch ? selectedBranch.address1 : "" }}</span>
          </div>
          <div class="col-span-6 flex flex-col">
            <span class="font-semibold">Dirección 2</span>
            <span>{{ selectedBranch ? selectedBranch.address2 : "" }}</span>
          </div>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-3 flex flex-col">
            <span class="font-semibold">Nombre de contacto</span>
            <span>{{ selectedBranch ? selectedBranch.contactName : "" }}</span>
          </div>
          <div class="col-span-3 flex flex-col">
            <span class="font-semibold">Teléfono</span>
            <span>{{
              selectedBranch ? selectedBranch.contactInfo.phones[0] : ""
            }}</span>
          </div>
          <div class="col-span-3 flex flex-col">
            <span class="font-semibold">Correo</span>
            <span>{{
              selectedBranch ? selectedBranch.contactInfo.emails[0] : ""
            }}</span>
          </div>
        </div>
        <div class="flex justify-end">
          <el-button size="small" @click="showViewPreview = false">
            Cerrar
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- Edit sucursal -->
    <el-dialog
      title="Editar sucursal "
      :visible.sync="showEditPreview"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="900px"
      @close="closeDialog('editOfficeForm', 'edit')"
    >
      <div class="flex flex-col space-y-4">
        <el-form
          :model="editOfficeForm"
          :rules="editOfficeFormRules"
          status-icon
          ref="editOfficeForm"
          @submit.native.prevent="
            submitEditBranch('editOfficeForm', editOfficeForm)
          "
        >
          <div class="grid grid-cols-12 gap-4">
            <el-form-item
              label="Nombre de la sucursal"
              class="col-span-12"
              prop="name"
            >
              <el-input
                size="small"
                class="w-full"
                v-model="editOfficeForm.name"
              />
            </el-form-item>
          </div>
          <!-- Seleccion de pais,departamento y municipio -->
          <div class="grid grid-cols-12 gap-4">
            <el-form-item label="Pais" class="col-span-4" prop="country">
              <el-select
                v-model="editOfficeForm.country"
                class="w-full"
                size="small"
                filterable
                clearable
                default-first-option
                @change="clearSelectEdit('state')"
              >
                <el-option
                  v-for="c in countries"
                  :key="c.id"
                  :label="c.name"
                  :value="c.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Departamento" class="col-span-4" prop="state">
              <el-select
                v-model="editOfficeForm.state"
                class="w-full"
                size="small"
                filterable
                clearable
                default-first-option
                @change="clearSelectEdit('city')"
              >
                <el-option
                  v-for="c in editStates"
                  :key="c.id"
                  :label="c.name"
                  :value="c.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Municipio" class="col-span-4" prop="city">
              <el-select
                v-model="editOfficeForm.city"
                class="w-full"
                size="small"
                filterable
                clearable
                default-first-option
              >
                <el-option
                  v-for="c in editCities"
                  :key="c.id"
                  :label="c.name"
                  :value="c.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <!-- Direcciones -->
          <div class="grid grid-cols-12 gap-4">
            <el-form-item
              label="Dirección 1"
              class="col-span-6"
              prop="address1"
            >
              <el-input
                v-model="editOfficeForm.address1"
                placeholder="Col, ciudad, pjs, pol, #casa"
                class="w-full"
                size="small"
                maxlength="150"
                show-word-limit
              >
                <el-option> </el-option>
              </el-input>
            </el-form-item>
            <el-form-item
              label="Dirección 2"
              class="col-span-6"
              prop="address2"
            >
              <el-input
                v-model="editOfficeForm.address2"
                type="text"
                placeholder="Col, ciudad, pjs, pol, #casa"
                class="w-full"
                size="small"
                maxlength="150"
                show-word-limit
              >
                <el-option> </el-option>
              </el-input>
            </el-form-item>
          </div>
          <!-- Contactos -->
          <h1 class="text-blue-500">Contacto</h1>
          <div class="grid grid-cols-12 gap-4">
            <el-form-item
              label="Nombre de contacto"
              class="col-span-4"
              prop="contactName"
            >
              <el-input
                v-model="editOfficeForm.contactName"
                placeholder="Nombre de contacto"
                class="w-full"
                size="small"
              >
                <el-option> </el-option>
              </el-input>
            </el-form-item>
            <el-form-item label="Teléfono" class="col-span-4" prop="phones">
              <el-input
                v-model="editOfficeForm.phones"
                placeholder="0000-0000"
                class="w-full"
                size="small"
                v-mask="'####-####'"
              />
            </el-form-item>
            <el-form-item
              label="Correo electronico"
              prop="emails"
              class="col-span-4"
            >
              <el-input
                v-model="editOfficeForm.emails"
                class="w-full"
                placeholder="example@example.com"
                size="small"
              />
            </el-form-item>
          </div>

          <div class="grid grid-cols-12 gap-4 mt-3">
            <div class="col-span-12">
              <div class="flex justify-end">
                <el-button
                  type="primary"
                  size="small"
                  class="col-span-2"
                  native-type="submit"
                  >Guardar</el-button
                >
                <el-button
                  size="small"
                  class="col-span-2"
                  @click="showEditPreview = false"
                  >Cancelar
                </el-button>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <!-- Dialogo de nueva sucursal -->
    <el-dialog
      title="Agregar nueva sucursal"
      :visible.sync="showBranchOffices"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="900px"
      @close="closeDialog('addOfficeNewForm', 'new')"
    >
      <div class="flex flex-col space-y-2">
        <el-form
          :model="addOfficeNewForm"
          :rules="editOfficeFormRules"
          status-icon
          ref="addOfficeNewForm"
          @submit.native.prevent="
            submitNewBranches('addOfficeNewForm', addOfficeNewForm)
          "
        >
          <!-- Seleccion de pais,departamento y municipio -->
          <div v-for="(item, i) in addOfficeNewForm.items" :key="i">
            <div class="grid grid-cols-12 mt-4">
              <div class="col-span-12">
                <div class="flex justify-between">
                  <span class="text-lg text-gray-900">
                    Nueva sucursal {{ i + 1 }}
                  </span>
                  <el-button
                    class="w-20"
                    size="mini"
                    type="danger"
                    :disabled="addOfficeNewForm.items.length === 1"
                    @click="removeOffice(i)"
                    ><i class="el-icon-delete"></i
                  ></el-button>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-12 gap-4">
              <el-form-item
                label="Nombre de la sucursal"
                class="col-span-12"
                :prop="`items.${i}.name`"
                :rules="{
                  required: true,
                  message: 'Requerido',
                  trigger: 'change',
                }"
              >
                <el-input size="small" class="w-full" v-model="item.name" />
              </el-form-item>
            </div>
            <div class="grid grid-cols-12 gap-4">
              <el-form-item
                label="Pais"
                class="col-span-4"
                :prop="`items.${i}.country`"
                :rules="{
                  required: true,
                  message: 'Requerido',
                  trigger: 'change',
                }"
              >
                <el-select
                  v-model="item.country"
                  class="w-full"
                  size="small"
                  filterable
                  clearable
                  default-first-option
                  @change="clearSelect('state', i)"
                >
                  <el-option
                    v-for="c in countries"
                    :key="c.id"
                    :label="c.name"
                    :value="c.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="Departamento"
                :prop="`items.${i}.state`"
                class="col-span-4"
                :rules="{
                  required: true,
                  message: 'Requerido',
                  trigger: 'change',
                }"
              >
                <el-select
                  v-model="item.state"
                  class="w-full"
                  size="small"
                  filterable
                  clearable
                  @change="clearSelect('city', i)"
                  default-first-option
                >
                  <el-option
                    v-for="c in item.states"
                    :key="c.id"
                    :label="c.name"
                    :value="c.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="Municipio"
                class="col-span-4"
                :prop="`items.${i}.city`"
                :rules="{
                  required: true,
                  message: 'Requerido',
                  trigger: 'change',
                }"
              >
                <el-select
                  v-model="item.city"
                  class="w-full"
                  size="small"
                  filterable
                  clearable
                  default-first-option
                >
                  <el-option
                    v-for="c in item.cities"
                    :key="c.id"
                    :label="c.name"
                    :value="c.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <!-- Direcciones -->
            <div class="grid grid-cols-12 gap-4">
              <el-form-item
                label="Dirección 1"
                class="col-span-6"
                :prop="`items.${i}.address1`"
                :rules="{
                  required: true,
                  message: 'Requerido',
                  trigger: 'change',
                }"
              >
                <el-input
                  v-model="item.address1"
                  placeholder="Col, ciudad, pjs, pol, #casa"
                  class="w-full"
                  size="small"
                  maxlength="150"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
              <el-form-item label="Dirección 2" class="col-span-6">
                <el-input
                  v-model="item.address2"
                  type="text"
                  placeholder="Col, ciudad, pjs, pol, #casa"
                  class="w-full"
                  size="small"
                  maxlength="150"
                  show-word-limit
                >
                </el-input>
              </el-form-item>
            </div>
            <!-- Contactos -->
            <h1 class="text-blue-700">Contacto</h1>
            <div class="grid grid-cols-12 gap-4 mt-4 border-b-2">
              <el-form-item label="Nombre de contacto" class="col-span-4">
                <el-input
                  v-model="item.contactName"
                  placeholder="Nombre de contacto"
                  class="w-full"
                  size="small"
                >
                  <el-option> </el-option>
                </el-input>
              </el-form-item>
              <el-form-item label="Teléfono" class="col-span-4">
                <el-input
                  v-model="item.phones"
                  placeholder="0000-0000"
                  class="w-full"
                  size="small"
                  v-mask="'####-####'"
                >
                  <el-option> </el-option>
                </el-input>
              </el-form-item>
              <el-form-item
                label="Correo electronico"
                class="col-span-4"
                :prop="`items.${i}.emails`"
                :rules="{
                  type: 'email',
                  message: 'Ingresa una direccion de correo valida.',
                  trigger: 'blur',
                }"
              >
                <el-input
                  v-model="item.emails"
                  class="w-full"
                  placeholder="example@example.com"
                  size="small"
                >
                  <el-option> </el-option>
                </el-input>
              </el-form-item>
            </div>
          </div>
          <div class="grid grid-cols-12 gap-4 mt-3">
            <div class="col-span-6">
              <el-button
                size="small"
                type="primary"
                @click.native="officetAdd()"
                icon="el-icon-plus"
                >Sucursal adicional</el-button
              >
            </div>
            <div class="col-span-6">
              <div class="flex justify-end">
                <el-button
                  type="primary"
                  size="small"
                  class="col-span-2"
                  native-type="submit"
                  >Guardar</el-button
                >
                <el-button
                  size="small"
                  class="col-span-2"
                  @click="showBranchOffices = false"
                  >Cancelar
                </el-button>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <div class="flex flex-col space-y-2">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-4 col-start-12">
          <el-button
            type="primary"
            size="small"
            @click="showBranchOffices = true"
          >
            Nueva sucursal
          </el-button>
        </div>
      </div>
      <el-form>
        <div class="grid grid-cols-12 gap-4 text-xs">
          <div class="col-span-3">
            <div class="flex flex-col">
              <span>CLIENTE</span>
              <el-form-item :label="`${provider ? provider.name : ''}`">
              </el-form-item>
            </div>
          </div>
          <div class="col-span-2">
            <div class="flex flex-col">
              <span>NIT</span>
              <el-form-item :label="`${provider.nit ? provider.nit : ''}`">
              </el-form-item>
            </div>
          </div>
          <div class="col-span-1">
            <div class="flex flex-col">
              <span>NRC</span>
              <el-form-item :label="`${provider.nrc ? provider.nrc : ''}`">
              </el-form-item>
            </div>
          </div>
          <div class="col-span-3">
            <div class="flex flex-col">
              <span>GIRO</span>
              <el-form-item :label="`${provider.giro ? provider.giro : ''}`">
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>

      <el-table
        :data="branches.data"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        stripe
        size="mini"
        @sort-change="sortBy"
      >
        <el-table-column type="selection" width="45"> </el-table-column>

        <el-table-column label="#" width="50" prop="index"></el-table-column>
        <el-table-column
          label="Nombre de la sucursal"
          min-width="355"
          sortable="custom"
          prop="name"
        >
          <template slot-scope="scope">
            <el-tag
              size="mini"
              type="info"
              effect="dark"
              v-if="scope.row.default"
            >
              <i class="el-icon-place"></i>
            </el-tag>
            <span> {{ scope.row.name }}</span>
          </template></el-table-column
        >
        <el-table-column label="Teléfono" width="100" prop="phone">
          <template slot-scope="scope">
            <span>{{
              scope.row.contactInfo ? scope.row.contactInfo.phones[0] : ""
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Correo" width="200" prop="email">
          <template slot-scope="scope">
            <span>{{
              scope.row.contactInfo ? scope.row.contactInfo.emails[0] : ""
            }}</span>
          </template></el-table-column
        >
        <el-table-column
          label="Pais"
          width="100"
          sortable="custom"
          prop="country"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.country.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label width="110" align="center">
          <template slot="header" v-if="multipleSelection.length > 0">
            <el-dropdown trigger="click" szie="mini">
              <el-button type="primary" size="mini" class="group">
                <span class="hidden group-hover:inline">
                  {{ multipleSelection.length }} Filas</span
                >
                <i class="el-icon-more"
              /></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <i class="el-icon-edit"></i>Editar sucursales
                </el-dropdown-item>
                <el-dropdown-item>
                  <i class="el-icon-close"></i>Desactivar sucursales
                </el-dropdown-item>
                <el-dropdown-item :divided="true" v-if="!scope.row.default">
                  <i class="el-icon-delete"></i> Eliminar sucursales
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <el-dropdown trigger="click" szie="mini">
              <el-button icon="el-icon-more" size="mini" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="openBranchPreview(scope.row.id)"
                >
                  <i class="el-icon-view"></i> Vista previa
                </el-dropdown-item>
                <el-dropdown-item @click.native="openEditDialog(scope.row.id)">
                  <i class="el-icon-edit-outline"></i> Editar sucursal
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="setDefaultBranch(scope.row.id)"
                  v-if="!scope.row.default"
                >
                  <i class="el-icon-place"></i>Definir como principal
                </el-dropdown-item>

                <el-dropdown-item
                  :divided="true"
                  class="font-semibold text-red-500"
                  @click.native="deleteBranch(scope.row.id)"
                  v-if="!scope.row.default"
                >
                  <i class="el-icon-delete"></i> Eliminar sucursal
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="fetchBranches"
          :current-page.sync="page.page"
          :page-sizes="[5, 10, 15, 25, 50, 100]"
          :page-size="page.size"
          layout="total, sizes, prev, pager, next"
          :total="parseInt(branches.count)"
          :pager-count="5"
        />
      </div>
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import {
  inputValidation,
  selectValidation,
  checkBeforeLeave,
  checkBeforeEnter,
  parseErrors,
} from "../../tools";
import Notification from "../../components/Notification";

const storagekey = "branches";

export default {
  name: "CustomerBranches",
  components: {
    LayoutContent,
    Notification,
  },
  fetch() {
    const countries = () => this.$axios.get(`/others/countries`);
    const states = () => this.$axios.get(`/others/states`);
    const cities = () => this.$axios.get(`/others/cities`);
    const provider = () =>
      this.$axios.get(`/providers/${this.$route.query.ref}`);
    const providerBranches = () =>
      this.$axios.get(`/providers/${this.$route.query.ref}/branches`);

    Promise.all([
      countries(),
      states(),
      cities(),
      provider(),
      providerBranches(),
    ])
      .then((res) => {
        const [countries, states, cities, provider, providerBranches] = res;

        this.countries = countries.data.data;
        this.rawStates = states.data.data;
        this.rawCities = cities.data.data;
        this.provider = provider.data.data;
        this.branches = providerBranches.data;
      })
      .catch((err) => {
        this.$message.error(err.response.data.message);
        this.$router.push("/providers");
      })
      .then((alw) => (this.pageloading = false));
  },
  fetchOnServer: false,
  data() {
    return {
      multipleSelection: [],
      countries: [],
      rawStates: [],
      rawCities: [],
      cities: [],
      states: [],
      provider: {},
      text: "",
      pageloading: true,
      showBranchOffices: false,
      showAdditionalBranch: false,
      showViewPreview: false,
      showEditPreview: false,
      addOfficeNewForm: {
        items: [
          {
            name: "",
            contactName: "",
            country: "",
            state: "",
            city: "",
            address1: "",
            address2: "",
            phones: "",
            emails: "",
            states: [],
            cities: [],
          },
        ],
      },
      editOfficeForm: {
        name: "",
        country: "",
        state: "",
        city: "",
        address1: "",
        address2: "",
        phones: "",
        emails: "",
        contactName: "",
      },
      editOfficeFormRules: {
        name: inputValidation(true),
        emails: inputValidation(false, null, null, "email"),
        address1: inputValidation(true),
        country: selectValidation(true),
        state: selectValidation(true),
        city: selectValidation(true),
      },

      page: {
        limit: 10,
        page: 1,
      },

      branches: {
        count: 0,
        data: [],
      },
      selectedBranch: "",
      filter: {
        prop: "",
        order: null,
      },
    };
  },
  methods: {
    clearSelect(name, index) {
      switch (name) {
        case "state":
          this.addOfficeNewForm.items[index].state = "";
          this.addOfficeNewForm.items[index].city = "";
          this.addOfficeNewForm.items[index].states = this.rawStates.filter(
            (s) => s.country.id == this.addOfficeNewForm.items[index].country
          );
          break;
        case "city":
          this.addOfficeNewForm.items.city = "";
          this.addOfficeNewForm.items[index].cities = this.rawCities.filter(
            (s) => s.state.id == this.addOfficeNewForm.items[index].state
          );
          break;
      }
    },

    clearSelectEdit(name) {
      switch (name) {
        case "state":
          this.editOfficeForm.state = "";
          this.editOfficeForm.city = "";
          break;
        case "city":
          this.editOfficeForm.city = "";
          break;
      }
    },
    handleSizeChange(val) {
      this.page.limit = val;
      this.fetchBranches();
    },
    async openBranchPreview(id) {
      const { data } = await this.$axios.get(
        `/providers/${this.$route.query.ref}/branches/${id}`
      );
      (this.selectedBranch = data.data), (this.showViewPreview = true);
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    officetAdd() {
      this.addOfficeNewForm.items.push({
        name: "",
        contactName: "",
        country: "",
        state: "",
        city: "",
        address: "",
        address1: "",
        phones: "",
        emails: "",
        states: [],
        cities: [],
      });
    },

    removeOffice(index) {
      this.addOfficeNewForm.items.splice(index, 1);
    },

    closeDialog(formName, type) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
        if (type == "new") {
          this.addOfficeNewForm.items = [
            {
              country: "",
              state: "",
              city: "",
              address: "",
              address1: "",
              phone: "",
              email: "",
            },
          ];
        }
      }

      return false;
    },

    setDefaultBranch(id) {
      this.$confirm(
        `¿Estás seguro que deseas definir como principal esta sucursal?`,
        "Confirmación",
        {
          confirmButtonText: `Si, guardar.`,
          cancelButtonText: "Cancelar",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "Procesando...";
              this.$axios
                .put(
                  `/providers/${this.$route.query.ref}/branches/${id}/default`
                )
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchBranches();
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
                  instance.confirmButtonText = `Si, guardar`;
                  done();
                });
            }
            done();
          },
        }
      );
    },

    fetchBranches() {
      this.tableloading = true;
      let params = this.page;
      if (this.status !== "") {
        params = { ...params, active: this.status };
      }

      if (this.filter.order) {
        params = {
          ...params,
          prop: this.filter.prop,
          order: this.filter.order,
        };
      }

      this.$axios
        .get(`/providers/${this.$route.query.ref}/branches`, { params })
        .then((res) => {
          this.branches = res.data;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        })
        .then((alw) => (this.tableloading = false));
    },

    deleteBranch(id) {
      this.$confirm(
        `¿Estás seguro que deseas eliminar esta sucursal?`,
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
                .delete(`/providers/${this.$route.query.ref}/branches/${id}`)
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchBranches();
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

    sortBy({ column, prop, order }) {
      this.filter.prop = prop;
      this.filter.order = order;
      this.fetchBranches();
    },

    async openEditDialog(id) {
      const { data } = await this.$axios.get(
        `/providers/${this.$route.query.ref}/branches/${id}`
      );
      this.editOfficeForm.name = data.data.name;
      this.editOfficeForm.contactName = data.data.contactName;
      this.editOfficeForm.country = data.data.country.id;
      this.editOfficeForm.state = data.data.state.id;
      this.editOfficeForm.city = data.data.city.id;
      this.editOfficeForm.phones = data.data.contactInfo.phones[0];
      this.editOfficeForm.emails = data.data.contactInfo.emails[0];
      (this.editOfficeForm.id = data.data.id),
        (this.editOfficeForm.address1 = data.data.address1);
      this.editOfficeForm.address2 = data.data.address2;
      this.showEditPreview = true;
    },
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    submitEditBranch(formName, branchData) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$confirm(
          "¿Estás seguro que deseas actualizar esta sucursal?",
          "Confirmación",
          {
            confirmButtonText: "Si, actualizar",
            cancelButtonText: "Cancelar",
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "Procesando...";
                const branch = () =>
                  this.$axios.put(
                    `/providers/${this.$route.query.ref}/branches/${branchData.id}`,
                    {
                      branch: {
                        name: branchData.name,
                        contactName: branchData.contactName,
                        address1: branchData.address1,
                        address2: branchData.address2,
                        country: branchData.country,
                        state: branchData.state,
                        city: branchData.city,
                        contactInfo: {
                          phones: [branchData.phones ? branchData.phones : ""],
                          emails: [branchData.emails ? branchData.emails : ""],
                        },
                      },
                    }
                  );

                Promise.all([branch()])
                  .then((res) => {
                    const [branch] = res;

                    this.$notify.success({
                      title: "Exito",
                      message: `${branch.data.message}`,
                    });
                    this.showEditPreview = false;

                    this.fetchBranches();
                    this.resetForm(formName);
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
                    instance.confirmButtonText = "Si, actualizar";
                    localStorage.removeItem(storagekey);
                    done();
                  });
              } else {
                done();
              }
            },
          }
        );
      });
    },

    submitNewBranches(formName, data) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$confirm(
          "¿Estás seguro que deseas guardar estas sucursales?",
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
                  .post(`/providers/${this.$route.query.ref}/branches`, {
                    branches: data.items.map((b) => {
                      return {
                        name: b.name,
                        contactName: b.contactName,
                        address1: b.address1,
                        address2: b.address2,
                        country: b.country,
                        state: b.state,
                        city: b.city,
                        contactInfo: {
                          phones: [b.phones ? b.phones : ""],
                          emails: [b.emails ? b.emails : ""],
                        },
                      };
                    }),
                  })

                  .then((res) => {
                    this.$notify.success({
                      title: "Exito",
                      message: res.data.message,
                    });
                    this.fetchBranches();
                    this.pageloading = true;
                    this.showBranchOffices = false;
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
                    instance.confirmButtonText = "Si, guardar";
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
    editStates() {
      return this.rawStates.filter(
        (s) => s.country.id == this.editOfficeForm.country
      );
    },
    editCities() {
      return this.rawCities.filter(
        (c) => c.state.id == this.editOfficeForm.state
      );
    },
  },
};
</script>

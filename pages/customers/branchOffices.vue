<template>
  <layout-content
    page-title="Sucursales"
    :breadcrumb="[
      { name: 'Clientes', to: '/customers' },
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
    <div class=" flex flex-col space-y-6">
      
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-5 flex flex-col">
          <span class=" font-semibold">Nombre de sucursal</span>
          <span>Grupo agropecuario de El Salvador S.A C.V</span>
        </div>
          <div class="col-span-2 flex flex-col">
          <span class=" font-semibold">Pais</span>
          <span>El Salvador</span>
        </div>
             <div class="col-span-2 flex flex-col">
          <span class=" font-semibold">Deparmento</span>
          <span>San Salvador</span>
        </div>
             <div class="col-span-2 flex flex-col">
          <span class=" font-semibold">Municipio</span>
          <span>Cuscatancingo</span>
        </div>

      </div>
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-3 flex flex-col">
          <span class=" font-semibold">Dirección 1</span>
          <span>Avenida los naranjo</span>
        </div>
          <div class="col-span-3 flex flex-col">
          <span class=" font-semibold">Dirección 2</span>
          <span>calle wascoran</span>
        </div>
      </div>  
       <div class="grid grid-cols-12 gap-4">
        <div class="col-span-3 flex flex-col">
          <span class=" font-semibold">Teléfono</span>
          <span>+503 0000-0000</span>
        </div>
          <div class="col-span-3 flex flex-col">
          <span class=" font-semibold">Correo</span>
          <span>example@axample.com</span>
        </div>
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
    >
      <div class="flex flex-col space-y-2">
        <el-form :model="addOfficeForm" status-icon ref="addOfficeForm">
          <!-- Seleccion de pais,departamento y municipio -->
          <div
            class="space-y-4"
            v-for="(item, i) in addOfficeForm.items"
            :key="i"
          >
            <div class="grid grid-cols-12 mt-4">
             
            </div>
            <div class="grid grid-cols-12 gap-4">
              <el-form-item label="Pais" class="col-span-4">
                <el-select
                  v-model="addOfficeForm.items.country"
                  class="w-full"
                  size="small"
                  filterable
                  clearable
                  default-first-option
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
              <el-form-item label="Departamento" class="col-span-4">
                <el-select
                  v-model="addOfficeForm.items.state"
                  class="w-full"
                  size="small"
                  filterable
                  clearable
                  default-first-option
                >
                  <el-option
                    v-for="c in states"
                    :key="c.id"
                    :label="c.name"
                    :value="c.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Municipio" class="col-span-4">
                <el-select
                  v-model="addOfficeForm.items.city"
                  class="w-full"
                  size="small"
                  filterable
                  clearable
                  default-first-option
                >
                  <el-option
                    v-for="c in cities"
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
              <el-form-item label="Dirección 1" class="col-span-4">
                <el-input
                  v-model="item.address"
                  placeholder="Col, ciudad, pjs, pol, #casa"
                  class="w-full"
                  size="small"
                  maxlength="10"
                  show-word-limit
                >
                  <el-option> </el-option>
                </el-input>
              </el-form-item>
              <el-form-item label="Dirección 2" class="col-span-4">
                <el-input
                  v-model="item.address1"
                  type="text"
                  placeholder="Col, ciudad, pjs, pol, #casa"
                  class="w-full"
                  size="small"
                  maxlength="10"
                  show-word-limit
                >
                  <el-option> </el-option>
                </el-input>
              </el-form-item>
            </div>
            <!-- Contactos -->
            <h1 class="text-blue-500">Contacto</h1>
            <div class="grid grid-cols-12 gap-4 mt-4 border-b-2">
              <el-form-item label="Teléfono" class="col-span-4">
                <el-input
                  v-model="item.phone"
                  placeholder="+503 0000-0000"
                  class="w-full"
                  size="small"
                >
                  <el-option
                   
                  >
                  </el-option>
                </el-input>
              </el-form-item>
              <el-form-item label="Correo electronico" class="col-span-4">
                <el-input
                  v-model="item.email"
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
           
            <div class="col-span-12">
              <div class="flex justify-end">
                <el-button type="primary" size="small" class="col-span-2"
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
      @close="closeDialog"
    >
      <div class="flex flex-col space-y-2">
        <el-form :model="addOfficeForm" status-icon ref="addOfficeForm">
          <!-- Seleccion de pais,departamento y municipio -->
          <div
            class="space-y-4"
            v-for="(item, i) in addOfficeForm.items"
            :key="i"
          >
            <div class="grid grid-cols-12 mt-4">
              <div class="col-span-12">
                <div class="flex justify-between">
                  <span class="text-lg font-semibold">
                    Nueva sucursal {{ i + 1 }}
                  </span>
                  <el-button
                    class="w-20"
                    size="mini"
                    type="danger"
                    :disabled="addOfficeForm.items.length === 1"
                    @click="removeOffice(i)"
                    ><i class="el-icon-delete"></i
                  ></el-button>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-12 gap-4">
              <el-form-item label="Pais"  class="col-span-4">
                <el-select
                  v-model="addOfficeForm.items.country"
                  class="w-full"
                  size="small"
                  filterable
                  clearable
                  default-first-option
                  @change="clearSelect('state')"
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
              <el-form-item label="Departamento"  prop="state" class="col-span-4">
                <el-select
                  v-model="addOfficeForm.items.state"
                  class="w-full"
                  size="small"
                  filterable
                  clearable
                  @change="clearSelect('city')"
                  default-first-option
                >
                  <el-option
                    v-for="c in states"
                    :key="c.id"
                    :label="c.name"
                    :value="c.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Municipio" class="col-span-4">
                <el-select
                  v-model="addOfficeForm.items.city"
                  class="w-full"
                  size="small"
                  filterable
                  clearable
                  default-first-option
                >
                  <el-option
                    v-for="c in cities"
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
              <el-form-item label="Dirección 1" class="col-span-4">
                <el-input
                  v-model="item.address"
                  placeholder="Col, ciudad, pjs, pol, #casa"
                  class="w-full"
                  size="small"
                  maxlength="10"
                  show-word-limit
                >
                  <el-option> </el-option>
                </el-input>
              </el-form-item>
              <el-form-item label="Dirección 2" class="col-span-4">
                <el-input
                  v-model="item.address1"
                  type="text"
                  placeholder="Col, ciudad, pjs, pol, #casa"
                  class="w-full"
                  size="small"
                  maxlength="10"
                  show-word-limit
                >
                  <el-option> </el-option>
                </el-input>
              </el-form-item>
            </div>
            <!-- Contactos -->
            <h1 class="text-blue-500">Contacto</h1>
            <div class="grid grid-cols-12 gap-4 mt-4 border-b-2">
              <el-form-item label="Teléfono" class="col-span-4">
                <el-input
                  v-model="addOfficeForm.items.phone"
                  placeholder="+503 0000-0000"
                  class="w-full"
                  size="small"
                >
                  <el-option
                  
                  >
                  </el-option>
                </el-input>
              </el-form-item>
              <el-form-item label="Correo electronico" class="col-span-4">
                <el-input
                  v-model="addOfficeForm.items.email"
                  class="w-full"
                  placeholder="example@example.com"
                  size="small"
                >
                  <el-option > </el-option>
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
                >+ Sucursal adicional</el-button
              >
            </div>
            <div class="col-span-6">
              <div class="flex justify-end">
                <el-button type="primary" size="small" class="col-span-2"
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
            @click="showBranchOffices = 'true'"
          >
            Nueva sucursal
          </el-button>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-4 text-xs">
        <div class="col-span-3">
          <div class="flex flex-col">
            <span class="font-semibold">Cliente</span>
            <span>{{customer ? customer.name :""}} </span>
          </div>
        </div>
        <div class="col-span-2">
          <div class="flex flex-col">
            <span class="font-semibold">NIT</span>
            <span>{{customer ? customer.nit :""}} </span>
          </div>
        </div>
        <div class="col-span-1">
          <div class="flex flex-col">
            <span class="font-semibold">NRC</span>
            <span>{{customer ? customer.nrc:""}} </span>
          </div>
        </div>
        <div class="col-span-3">
          <div class="flex flex-col">
            <span class="font-semibold">Giro</span>
            <span>{{ customer ? customer.giro:""}} </span>
          </div>
        </div>
      </div>

      <el-table
        :data="tabla"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        stripe
        size="mini"
      >
        <el-table-column type="selection" width="45"> </el-table-column>

        <el-table-column label="#" width="50" prop="index"></el-table-column>
        <el-table-column
          label="Nombre de la sucursal"
          min-width="355"
          sortable="custom"
          prop="name"
        ></el-table-column>
        <el-table-column
          label="Teléfono"
          width="100"
          sortable="custom"
          prop="phone"
        />
        <el-table-column
          label="Correo"
          width="200"
          sortable="custom"
          prop="email"
        ></el-table-column>
        <el-table-column
          label="Pais"
          width="100"
          sortable="custom"
          prop="country"
          show-overflow-tooltip
        >
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
                  <i class="el-icon-edit"></i>Editar Sucursales
                </el-dropdown-item>
                <el-dropdown-item>
                  <i class="el-icon-close"></i>Desactivar sucursales
                </el-dropdown-item>
                <el-dropdown-item :divided="true">
                  <i class="el-icon-delete"></i> Eliminar sucursales
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <el-dropdown trigger="click" szie="mini">
              <el-button icon="el-icon-more" size="mini" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="openBranchPreview(scope.row)">
                  <i class="el-icon-view"></i> Vista previa
                </el-dropdown-item>
                <el-dropdown-item @click.native="openEditPreview(scope.row)">
                  <i class="el-icon-edit-outline"></i> Editar
                </el-dropdown-item>
                <el-dropdown-item>
                  <i class="el-icon-map-location"></i>Definir como principal
                </el-dropdown-item>

                <el-dropdown-item
                  :divided="true"
                  class="text-red-500 font-semibold"
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
         
          :current-page.sync="page.page"
          :page-sizes="[5, 10, 15, 25, 50, 100]"
          :page-size="page.size"
          layout="total, sizes, prev, pager, next"
          :total="parseInt(BranchOffices.count)"
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
} from "../../tools";
import Notification from "../../components/Notification";
export default {
  components: {
    LayoutContent,
    Notification,
  },
  fetch() {
    const countries = () => this.$axios.get(`/others/countries`);
    const states = () => this.$axios.get(`/others/states`);
    const cities = () => this.$axios.get(`/others/cities`);
   const customer = () =>
      this.$axios.get(`/customers/${this.$route.query.ref}`);

    Promise.all([countries(), states(), cities(), customer()])
      .then((res) => {
        const [countries, states, cities,customer] = res;

        this.countries = countries.data.countries;
        this.rawStates = states.data.states;
        this.rawCities = cities.data.cities;
        this.customer = customer.data.customer
      })
      .catch((err) => {
        this.$message.error(err.response.data.message);
        this.$router.push("/customers");
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
      customer:{},
      text: "",
      pageloading: true,
      showBranchOffices: false,
      showAdditionalBranch: false,
      showViewPreview: false,
      showEditPreview: false,
      addOfficeForm: {
        items: [
          {
            country:1,
            state: "",
            city: "",
            address: "",
            address1: "",
            phone: "",
            email: "",
          },
        ],
      },
      BranchOffices: {
        BranchOffices: [],
        count: 0,
      },
      tabla: [
        {
          index: 1,
          name: "Grupo agropecuario de El Salvador S.A C.V",
          phone: "2332-3244",
          email: "example@example.com",
          country: "El Salvador",
        },
        {
          index: 2,
          name: "Impresa respuesto",
          phone: "2332-3244",
          email: "example@example.com",
          country: "El Salvador",
        },
        {
          index: 3,
          name: "Siman Sv de CV",
          phone: "2332-3244",
          email: "example@example.com",
          country: "El Salvador",
        },
      ],

      page: {
        limit: 10,
        page: 1,
      },
    };
  },
  methods: {
     clearSelect(name) {
      switch (name) {
        case "state":
          this.addOfficeForm.items.state = "";
          this.addOfficeForm.items.city = "";
          break;
        case "city":
          this.addOfficeForm.items.city = "";
          break;
      }
    
    },
    openBranchPreview(id) {
      this.showViewPreview = true;
    },
    openEditPreview() {
      this.showEditPreview = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection.length);
    },
    officetAdd() {
      this.addOfficeForm.items.push({
        country: "",
        state: "",
        city: "",
        address: "",
        address1: "",
        phone: "",
        email: "",
      });
    },
    closeDialog() {
      this.addOfficeForm.items = [
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
    },
    removeOffice(index) {
      this.addOfficeForm.items.splice(index, 1);
    },
  },
   computed: {
    states() {
      return this.rawStates.filter(
        (s) => s.country.id == this.addOfficeForm.items.country
      );
    },
    cities() {
      return this.rawCities.filter(
        (c) => c.state.id == this.addOfficeForm.items.state
      );
    },
  },
};
</script>
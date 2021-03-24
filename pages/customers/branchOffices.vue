<template>
  <layout-content
    page-title="Sucursales"
    :breadcrumb="[
      { name: 'Clientes', to: '/customers' },
      { name: 'Sucursales', to: null },
    ]"
  >
    <!-- vista previa -->
    <el-dialog></el-dialog>
    <!-- Dialogo de sucursal adicional -->
    <el-dialog
      title="Agregar nueva sucursal"
      :visible.sync="showAdditionalBranch"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="900px"
    >
      <div class="flex flex-col space-y-2">
        <el-form>
          <!-- Seleccion de pais,departamento y municipio -->
          <div class="grid grid-cols-12 gap-4">
            <el-form-item label="Pais" class="col-span-4">
              <el-select
                v-model="country"
                class="w-full"
                size="small"
                filterable
                clearable
                default-first-option
              >
                <el-option
                  v-for="p in paises"
                  :key="p.id"
                  :label="p.name"
                  :value="p.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Departamento" class="col-span-4">
              <el-select
                class="w-full"
                size="small"
                filterable
                clearable
                default-first-option
              >
                <el-option v-for="a in b" :key="a"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Municipio" class="col-span-4">
              <el-select
                class="w-full"
                size="small"
                filterable
                clearable
                default-first-option
              >
                <el-option v-for="a in b" :key="a"> </el-option>
              </el-select>
            </el-form-item>
          </div>
          <!-- Direcciones -->
          <div class="grid grid-cols-12 gap-4 mt-3">
            <el-form-item label="Dirección 1" class="col-span-4">
              <el-input
                v-model="text"
                placeholder="Col, ciudad, pjs, pol, #casa"
                class="w-full"
                size="small"
                maxlength="10"
                show-word-limit
              >
                <el-option
                  v-for="p in paises"
                  :key="p.id"
                  :label="p.name"
                  :value="p.id"
                >
                </el-option>
              </el-input>
            </el-form-item>
            <el-form-item label="Dirección 2" class="col-span-4">
              <el-input
                v-model="text"
                type="text"
                placeholder="Col, ciudad, pjs, pol, #casa"
                class="w-full"
                size="small"
                maxlength="10"
                show-word-limit
              >
                <el-option v-for="a in b" :key="a"> </el-option>
              </el-input>
            </el-form-item>
          </div>
          <!-- Contactos -->
          <h1 class="text-blue-500">Contacto</h1>
          <div class="grid grid-cols-12 gap-4 mt-3 border-b-2">
            <el-form-item label="Teléfono" class="col-span-4">
              <el-input
                v-model="country"
                placeholder="+503 0000-0000"
                class="w-full"
                size="small"
              >
                <el-option
                  v-for="p in paises"
                  :key="p.id"
                  :label="p.name"
                  :value="p.id"
                >
                </el-option>
              </el-input>
            </el-form-item>
            <el-form-item label="Correo electronico" class="col-span-4">
              <el-input
                class="w-full"
                placeholder="example@example.com"
                size="small"
              >
                <el-option v-for="a in b" :key="a"> </el-option>
              </el-input>
            </el-form-item>
          </div>
          <!-- new branch Offices -->
          <h1 class="text-lg text-black mt-3">Agregar nueva Sucursal</h1>
          <div class="grid grid-cols-12 gap-4 mt-4">
            <el-form-item label="Pais" class="col-span-4">
              <el-select
                v-model="country"
                class="w-full"
                size="small"
                filterable
                clearable
                default-first-option
              >
                <el-option
                  v-for="p in paises"
                  :key="p.id"
                  :label="p.name"
                  :value="p.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Departamento" class="col-span-4">
              <el-select
                class="w-full"
                size="small"
                filterable
                clearable
                default-first-option
              >
                <el-option v-for="a in b" :key="a"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Municipio" class="col-span-4">
              <el-select
                class="w-full"
                size="small"
                filterable
                clearable
                default-first-option
              >
                <el-option v-for="a in b" :key="a"> </el-option>
              </el-select>
            </el-form-item>
          </div>
          <!-- Direcciones -->
          <div class="grid grid-cols-12 gap-4">
            <el-form-item label="Dirección 1" class="col-span-4">
              <el-input
                v-model="text"
                placeholder="Col, ciudad, pjs, pol, #casa"
                class="w-full"
                size="small"
                maxlength="10"
                show-word-limit
              >
                <el-option
                  v-for="p in paises"
                  :key="p.id"
                  :label="p.name"
                  :value="p.id"
                >
                </el-option>
              </el-input>
            </el-form-item>
            <el-form-item label="Dirección 2" class="col-span-4">
              <el-input
                v-model="text"
                type="text"
                placeholder="Col, ciudad, pjs, pol, #casa"
                class="w-full"
                size="small"
                maxlength="10"
                show-word-limit
              >
                <el-option v-for="a in b" :key="a"> </el-option>
              </el-input>
            </el-form-item>
          </div>
          <!-- Contactos -->
          <h1 class="text-blue-500">Contacto</h1>
          <div class="grid grid-cols-12 gap-4 mt-3">
            <el-form-item label="Teléfono" class="col-span-4">
              <el-input
                v-model="country"
                placeholder="+503 0000-0000"
                class="w-full"
                size="small"
              >
                <el-option
                  v-for="p in paises"
                  :key="p.id"
                  :label="p.name"
                  :value="p.id"
                >
                </el-option>
              </el-input>
            </el-form-item>
            <el-form-item label="Correo electronico" class="col-span-4">
              <el-input
                class="w-full"
                placeholder="example@example.com"
                size="small"
              >
                <el-option v-for="a in b" :key="a"> </el-option>
              </el-input>
            </el-form-item>
          </div>
          <div class="grid grid-cols-12">
            <div class="col-span-3">
              <el-button
                size="small"
                type="primary"
                @click="showAdditionalBranch = 'true'"
                >Sucursal adicional</el-button
              >
            </div>
            <el-button
              type="primary"
              size="small"
              class="col-span-2 col-start-9"
              >Guardar</el-button
            >
            <el-button
              size="small"
              class="col-span-2 col-start-11"
              @click="showAdditionalBranch = false"
              >Cancelar</el-button
            >
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
    >
      <div class="flex flex-col space-y-2">
        <el-form>
          <!-- Seleccion de pais,departamento y municipio -->
          <div class="grid grid-cols-12 gap-4">
            <el-form-item label="Pais" class="col-span-4">
              <el-select
                v-model="country"
                class="w-full"
                size="small"
                filterable
                clearable
                default-first-option
              >
                <el-option
                  v-for="p in paises"
                  :key="p.id"
                  :label="p.name"
                  :value="p.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Departamento" class="col-span-4">
              <el-select
                class="w-full"
                size="small"
                filterable
                clearable
                default-first-option
              >
                <el-option v-for="a in b" :key="a"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Municipio" class="col-span-4">
              <el-select
                class="w-full"
                size="small"
                filterable
                clearable
                default-first-option
              >
                <el-option v-for="a in b" :key="a"> </el-option>
              </el-select>
            </el-form-item>
          </div>
          <!-- Direcciones -->
          <div class="grid grid-cols-12 gap-4">
            <el-form-item label="Dirección 1" class="col-span-4">
              <el-input
                v-model="text"
                placeholder="Col, ciudad, pjs, pol, #casa"
                class="w-full"
                size="small"
                maxlength="10"
                show-word-limit
              >
                <el-option
                  v-for="p in paises"
                  :key="p.id"
                  :label="p.name"
                  :value="p.id"
                >
                </el-option>
              </el-input>
            </el-form-item>
            <el-form-item label="Dirección 2" class="col-span-4">
              <el-input
                v-model="text"
                type="text"
                placeholder="Col, ciudad, pjs, pol, #casa"
                class="w-full"
                size="small"
                maxlength="10"
                show-word-limit
              >
                <el-option v-for="a in b" :key="a"> </el-option>
              </el-input>
            </el-form-item>
          </div>
          <!-- Contactos -->
          <h1 class="text-blue-500">Contacto</h1>
          <div class="grid grid-cols-12 gap-4 mt-3">
            <el-form-item label="Teléfono" class="col-span-4">
              <el-input
                v-model="country"
                placeholder="+503 0000-0000"
                class="w-full"
                size="small"
              >
                <el-option
                  v-for="p in paises"
                  :key="p.id"
                  :label="p.name"
                  :value="p.id"
                >
                </el-option>
              </el-input>
            </el-form-item>
            <el-form-item label="Correo electronico" class="col-span-4">
              <el-input
                class="w-full"
                placeholder="example@example.com"
                size="small"
              >
                <el-option v-for="a in b" :key="a"> </el-option>
              </el-input>
            </el-form-item>
          </div>
          <div class="grid grid-cols-12">
            <div class="col-span-3">
              <el-button
                size="small"
                type="primary"
                @click="showAdditionalBranch = 'true'"
                >Sucursal adicional</el-button
              >
            </div>
            <el-button
              type="primary"
              size="small"
              class="col-span-2 col-start-9"
              >Guardar</el-button
            >
            <el-button
              size="small"
              class="col-span-2 col-start-11"
              @click="showBranchOffices = false"
              >Cancelar</el-button
            >
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
            <span>Cristian Cortez, S.A de C.V. </span>
          </div>
        </div>
        <div class="col-span-2">
          <div class="flex flex-col">
            <span class="font-semibold">NIT</span>
            <span>0000-000000-000-0 </span>
          </div>
        </div>
        <div class="col-span-1">
          <div class="flex flex-col">
            <span class="font-semibold">NRC</span>
            <span>000000-0 </span>
          </div>
        </div>
        <div class="col-span-3">
          <div class="flex flex-col">
            <span class="font-semibold">Giro</span>
            <span>Actividades varias de restaurantes </span>
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
        <el-table-column type="selection" width="60" v-model="tab">
        </el-table-column>

        <el-table-column
          label="#"
          width="60"
          sortable="custom"
          prop="index"
        ></el-table-column>
        <el-table-column
          label="Nombre de la sucursal"
          sortable="custom"
          prop="name"
        ></el-table-column>
        <el-table-column label="Teléfono" sortable="custom" prop="phone" />
        <el-table-column
          label="Correo"
          sortable="custom"
          prop="email"
        ></el-table-column>
        <el-table-column
          label="Pais"
          sortable="custom"
          prop="country"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label width="70" align="center">
          <template slot="header" v-if="multipleSelection.length > 0" >
            <el-dropdown>
              <el-button
                trigger="click"
                icon="el-icon-more"
                type="primary"
                size="mini"
               class="transition duration-500 ease-in  transform  hover:scale-110"
              ></el-button>
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
                <el-dropdown-item
                  @click.native="openCustomerPreview(scope.row)"
                >
                  <i class="el-icon-view"></i> Vista previa
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="
                    $router.push(`/customers/edit?ref=${scope.row.id}`)
                  "
                >
                  <i class="el-icon-edit-outline"></i> Editar
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="
                    $router.push(`/customers/branchOffices?ref-${scope.row.id}`)
                  "
                >
                  <i class="el-icon-map-location"></i>Definir como principal
                </el-dropdown-item>

                <el-dropdown-item
                  :divided="true"
                  class="text-red-500 font-semibold"
                  @click.native="deleteCustomer(scope.row)"
                >
                  <i class="el-icon-delete"></i> Eliminar cliente
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="fetchBranchOffices"
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
import Notification from "../../components/Notification";
export default {
  components: { LayoutContent, Notification },

  data() {
    return {
      tab: true,
      multipleSelection: [],
      text: "",
      pageloading: true,
      showBranchOffices: false,
      showAdditionalBranch: false,

      BranchOffices: {
        BranchOffices: [],
        count: 0,
      },
      tabla: [
        {
          index: 1,
          name: "Siman Sv de CV",
          phone: "2332-3244",
          email: "example@example.com",
          country: "El Salvador",
        },
         {
          index: 2,
          name: "Siman Sv de CV",
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection.length)
    },
  },
};
</script>
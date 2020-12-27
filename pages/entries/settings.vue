<template>
  <layout-content
    page-title="Configuraciones"
    :breadcrumb="[
      { name: 'Contabilidad', to: '/entries' },
      { name: 'Configuraciones', to: null },
    ]"
  >
   <el-dialog
      title="Nueva cuenta mayor"
      :visible.sync="showCreateCatalogDialog"
      :append-to-body="true"
      width="900px"
    >
      <el-form
        :model="mayorAccountForm"
        :rules="mayorAccountFormRules"
        status-icon
        ref="mayorAccountForm"
      >
        <!-- first row -->
        <div class="grid grid-cols-12 gap-4" v-for="(item, i) in mayorAccountForm.items" :key="i">
          <div class="col-span-2">
            <el-form-item label="Código" prop="code">
              <el-input-number
                ref="coce"
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
             <el-form-item label="Nombre" prop="name">
              <el-input
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
                size="small" border class="mt-5" style="width: 100%;">
                Acreedora
              </el-checkbox>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item label=" ">
              <el-checkbox size="small" border class="mt-5" style="width: 100%;" >
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
            @click.native="submitNewCatalog(mayorAccountForm.items, 'mayorAccountForm')"
          >Guardar</el-button>
          <el-button @click="showCreateCatalogDialog = false" size="small">Cancelar</el-button>
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
            
              <div class="col-span-3 ">
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
            <el-table
              :data="accounts"
              style="width: 100%"
              stripe
              size="small"
            >
              <el-table-column sortable="true" type="index" label="#" min-width="50" align="center"></el-table-column>
              <el-table-column prop="code" label="Código" min-width="60" />
              <el-table-column prop="name" label="Nombre de la cuenta" min-width="260"></el-table-column>
              <el-table-column prop="description" label="Descripción general" min-width="270"></el-table-column>
              <el-table-column
                prop="isAcreedora"
                label="	(A)creedor/(D)eudor"
                min-width="150"
                align="center"
              ></el-table-column>
              <el-table-column prop="name" min-width="150">
                <template slot-scope="">
                  <el-button
                      size="mini"
                      type="primary"
                    
                      icon="el-icon-plus"
                    />
                <el-dropdown trigger="click" szie="mini">
                  <el-button icon="el-icon-more" size="mini" />
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                     
                    >
                      <i class="el-icon-edit-outline"></i> Editar Cuenta
                    </el-dropdown-item>
                    <el-dropdown-item
                      :divided="true"
                      class="font-semibold"
                    >
                      <span class="text-red-500">
                        <i class="el-icon-delete"></i> Eliminar cuenta
                      </span>
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
      <el-tab-pane
        label="Balance General"
        name="balance-general"
      >
    <!-- noticication -->
     <div class="grid grid-cols-12">
       <div class="col-span-12">
        <Notification
          class=" mb-4 w-full"  type="info"
          title="Información"
          message="Acá puedes configurar las cuentas a incluir en el balance general asi como el nombre para cada sección que deseas que aparezca."   
       />
     </div>
    </div>
    <!-- second row -->
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
            default-first-option>

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
            default-first-option>

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
            default-first-option>
            
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
            default-first-option>

            </el-select>
          </el-form-item>
        </div>
        
    </div>
    </el-form>  
    <!-- table row -->
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12">
         <el-table :data="[]" row-key="id" border  size="small">
            <el-table-colum label="Cuenta" prop="cuenta" min-widht="200"></el-table-colum>
            <el-table-colum prop="nombrereporte" label="Nombre en reporte" min-width="170"></el-table-colum>
            <el-table-colum prop="display" align="center" min-width="40"></el-table-colum>
        </el-table>
      </div>
    </div>
    <!-- botones de guardar y cancelar -->
    <div class="flex justify-end mt-4 ">
      <el-button type="primary" size="small" native-type="submit">Guardar</el-button>
      <el-button size="small">Cancelar</el-button>
    </div>

   </el-tab-pane>
      <!-- tab estado resultados -->
      <el-tab-pane label="Estado de resultados" name="estado resultados">
                <!-- noticication -->
            <div class="grid grid-cols-12">
              <div class="col-span-12">
                <Notification
                  class=" mb-4 w-full"  type="info"
                  title="Información"
                  message="Acá puedes configurar los detalles que deseas que aparezcan en el estado de resultados, asi como definir si deseas que aparezca desglosado o solo sus totales."   
              />
            </div>
            </div>
             
            <!-- table row -->
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12">
                <el-table :data="[]" row-key="id" border  size="small">
                    <el-table-colum label="Nombre" min-width="300"></el-table-colum>
                    <el-table-colum  align="center" min-width="40"></el-table-colum>
                    <el-table-colum label="Incluir en reporte" align="center" min-width="65"></el-table-colum>
                    <el-table-colum  label="Mostrar detalle" align="center" min-width="65"></el-table-colum>
                    <el-table-colum align="center" min-width="35"></el-table-colum>
                </el-table>
              </div>
            </div>
            <!-- botones de guardar y cancelar -->
            <div class="flex justify-end mt-4 ">
              <el-button type="primary" size="small" native-type="submit">Guardar</el-button>
              <el-button size="small">Cancelar</el-button>
            </div>

      </el-tab-pane>
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
      
      accounts:[{
        code: "454sa",
        name: "EFECTIVO Y EQUIVALENTES AL EFECTIVO",
        description: "Tangamandapio y perulapia",
        isAcreedora: "Acreedora"
      }],
      mayorAccountFormRules: {
        code: inputValidation(true),
        name: inputValidation(true)
      },
      mayorAccountForm: {
        items: [
          {
            code: "",
            name: "",
            isAcreedora: false,
            isBalance: false
          }
        ]
      },
    };
  },
  methods:{
    addMayorAccount() {
      this.showCreateCatalogDialog = true;
      this.mayorAccountForm.items = [
        {
          code: "",
          name: "",
          isAcreedora: false,
          isBalance: false
        }
      ];
    },
    addNewMayorAccount() {
      this.mayorAccountForm.items.push({
        code: "",
        name: "",
        isAcreedora: false,
        isBalance: false
      });
    },
    removeMayorAccount(index) {
      this.mayorAccountForm.items.splice(index, 1);
    },
  },
  computed: {
    filteredIntegrations() {
      return this.integrations.filter((i) => hasModule(i.ref, this.$auth.user));
    },
    
  },
};
</script>

<template>
  <layout-content
    page-title="Configuraciones"
    :breadcrumb="[
      { name: 'Clientes', to: '/customers' },
      { name: 'Configuraciones', to: null },
    ]"
  >
    <el-tabs
      v-model="tab"
      @tab-click="
        $router
          .replace({
            path: `/customers/settings`,
            query: { tab },
          })
          .catch(() => {})
      "
     >
      <el-tab-pane label="Integraciones" name="integrations" class="space-y-3">
        <div class="grid grid-cols-12">
          <div class=" col-span-12">
            <Notification
          class="w-full"
          type="info"
          title="Integraciones"
          message="En esta sección se realizan las configuraciones de integración con otros modulos de manera general. Estas configuraciones se aplicarán a todos los clientes que no tengan una configuración individual."
          
        />
        </div>
          </div>
      
      <div class=" flex flex-col space-y-2">
          <div class="grid grid-cols-12 gap-4  ">
            <el-form
             label-position="top"
             >
             <div class="w-56 ">
               <template>
                    <el-form-item
               label="Seleccione una cuenta"
               >
               <el-select
               v-model="cogInfo"
               placeholder=" seleccione una cuenta"
               clearable
               filterable
               class="w-full"
               default-first-option
               size="small"
               >
               <el-option
               v-for="c in cogSettings"
               :key="c.id"
               :label="c.name"
               :value="c.id"

               >

               </el-option>
               </el-select>
               </el-form-item>
               </template>
            
             </div>

             <div class=" flex-row justify-items-end mx-33">
               <div class=" flex flex-row justify-items-end mx-160">
               <el-button
               type="primary"
               size="small"
               > Guardar</el-button>
               <el-button
               size="small"
               
               >Cancelar</el-button>
             </div>
             </div>
             
            </el-form>
          </div>
        </div>
     

        <!-- <el-tabs
          tab-position="left"
          v-model="utab"
          @tab-click="
            $router
              .replace({
                path: `/customers/settings`,
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
        </el-tabs> -->
      </el-tab-pane>
      
    </el-tabs> 
    
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
import { getIcon, hasModule } from "../../tools";

export default {
  name: "CustomerSettings",
  components: { LayoutContent, Notification },
  fetch() {
    if (this.$route.query.tab) {
      this.tab = this.$route.query.tab;
    }
    if (this.$route.query.utab) {
      this.utab = this.$route.query.utab;
    }
  },
  fetchOnServer: false,
  data() {
    return {
      cogInfo:"",
      cogSettings:[
        {name:'cogSettings'},
      ],
      tab: "integrations",
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
    };
  },
  computed: {
    filteredIntegrations() {
      return this.integrations.filter((i) => hasModule(i.ref, this.$auth.user));
    },
  },
};
</script>

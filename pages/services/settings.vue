<template>
  <layout-content
    page-title="Configuraciones"
    :breadcrumb="[
      { name: 'Servicios', to: '/services' },
      { name: 'Configuraciones', to: null },
    ]"
  >
    <el-tabs
      v-model="tab"
      @tab-click="
        $router
          .replace({
            path: `/services/settings`,
            query: { tab },
          })
          .catch(() => {})
      "
    >
      <el-tab-pane label="Integraciones" name="integrations" class="space-y-3">
        <Notification
          class="w-full"
          type="info"
          title="Integraciones"
          message="En esta sección se realizan las configuraciones de integración con otros modulos de manera general. Estas configuraciones se aplicarán a todos los servicios que no tengan una configuración individual."
        />
        <el-tabs
          tab-position="left"
          v-model="utab"
          @tab-click="
            $router
              .replace({
                path: `/services/settings`,
                query: { tab, utab },
              })
              .catch(() => {})
          "
        >
          <div class="flex flex-col space-y-2">
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-3">
                <el-form label-position="top">
                  <el-form-item label="Seleccione una cuenta">
                    <template>
                      <el-select
                        v-model="cogIfo"
                        placeholder="Seleccione una cuenta"
                        size="small"
                        clearable
                        filterable
                        class="w-full"
                      >
                        <el-option
                          v-for="c in cogSetting"
                          :key="c.id"
                          :label="c.name"
                          :value="c.id"
                        >
                        </el-option>
                      </el-select>
                    </template>
                  </el-form-item>
                </el-form>
              </div>
            </div>
           
      <div class="flex flex-row justify-end">
        <el-button
          type="primary"
          size="small"
          native-type="submit"
          :loading="generating"
          >Guardar</el-button
        >
        <el-button size="small" @click="$router.push('/services')"
          >Cancelar</el-button
        >
        </div>
          </div>

          <!-- <el-tab-pane
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
          </el-tab-pane> -->
        </el-tabs>
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
      cogIfo: "",
      cogSetting: [
        {
          id: 1,
          name: "Gerson, Project management",
        },
        {
          id: 2,
          name: "Bryan, devJunior",
        },
        {
          id: 3,
          name: "Issac, DevJunior",
        },
        {
          id: 4,
          name: "Jorge, designer",
        },
      ],
      tab: "integrations",
      utab: "invoicing",
      integrations: [
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

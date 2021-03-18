<template>
  <layout-content
    page-title="Configuraciones"
    :breadcrumb="[
      { name: 'Servicios', to: '/services' },
      { name: 'Configuraciones', to: null },
    ]"
  >
    <el-form label-position="top">
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
        <el-tab-pane
          label="Integraciones"
          name="integrations"
          class="space-y-2"
        >
          <Notification
            class="w-full"
            type="info"
            title="Integraciones"
            message="En esta sección se realizan las configuraciones de integración con otros modulos de manera general. Estas configuraciones se aplicarán a todos los servicios que no tengan una configuración individual."
          />
          <div class="grid grid-cols-12 gap-4">
            <el-form-item label="Seleccione una cuenta" class="col-span-4">
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
            </el-form-item>
          </div>
        </el-tab-pane>
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
      </el-tabs>
    </el-form>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
export default {
  name: "CustomerSettings",
  components: { LayoutContent, Notification },
  fetch() {},
  fetchOnServer: false,
  data() {
    return {
       tab: "integrations",
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
     
    };
  },
};
</script>

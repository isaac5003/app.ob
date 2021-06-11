<template>
  <div class="flex">
    <layout-submenu page-name="Proveedores" :menu="menu" icon="truck" />
    <nuxt-child />
  </div>
</template>

<script>
import LayoutSubmenu from "../components/layout/Submenu";
import { getIcon, hasModule } from "../tools";
export default {
  name: "Providers",
  components: { LayoutSubmenu },

  fetch() {
    if (!hasModule(["a98b98e6-b2d5-42a3-853d-9516f64eade8"], this.$auth.user)) {
      this.menu = this.menu.slice(0, -1);
    }
  },
  data() {
    return {
      menu: [
        {
          name: "Nuevo proveedor",
          icon: getIcon("plus"),
          path: "/providers/new",
        },
        {
          name: "Listado de proveedores",
          icon: getIcon("menu"),
          path: "/providers",
        },
        {
          name: "Reportes",
          icon: getIcon("document-text"),
          path: "/providers/reports",
        },
        {
          name: "Configuraciones",
          icon: getIcon("cog"),
          path: "/providers/settings",
        },
      ],
    };
  },
};
</script>

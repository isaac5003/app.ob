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
    if (!hasModule(["f6000cbb-1e6d-4f7d-a7cc-cadd78d23076"], this.$auth.user)) {
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

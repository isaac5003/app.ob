<template>
  <div class="flex">
    <layout-submenu page-name="Proveedores" :menu="menu" icon="truck" />
    <nuxt-child />
  </div>
</template>

<script>
import LayoutSubmenu from "../components/layout/Submenu";
import { getIcon } from "../tools";
export default {
  name: "Providers",
  components: { LayoutSubmenu },
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
          path: "/providers/",
        },
      ],
    };
  },
};
</script>

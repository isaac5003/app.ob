<template>
  <div class="flex">
    <layout-submenu page-name="Servicios" :menu="menu" icon="duplicate" />
    <nuxt-child />
  </div>
</template>

<script>
import LayoutSubmenu from "../components/layout/Submenu";
import { getIcon, hasModule } from "../tools";
export default {
  name: "Services",
  middleware: "access",
  meta: {
    id: "0f88f2ea-aae9-44ad-8df0-0ee3debbf167",
  },
  components: { LayoutSubmenu },
  fetch() {
    if (!hasModule("a98b98e6-b2d5-42a3-853d-9516f64eade8", this.$auth.user)) {
      this.menu = this.menu.slice(0, -1);
    }
  },
  data() {
    return {
      menu: [
        {
          name: "Nuevo servicio",
          icon: getIcon("plus"),
          path: "/services/new",
        },
        {
          name: "Listado de servicios",
          icon: getIcon("menu"),
          path: "/services",
          epath: ["/services/edit"],
        },
        {
          name: "Reportes",
          icon: getIcon("document-text"),
          path: "/services/reports",
        },
        {
          name: "Configuraciones",
          icon: getIcon("cog"),
          path: "/services/settings",
        },
      ],
    };
  },
};
</script>

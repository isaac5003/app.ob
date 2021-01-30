<template>
  <div class="flex">
    <layout-submenu page-name="Contabilidad" :menu="menu" icon="cash" />
    <nuxt-child />
  </div>
</template>

<script>
import LayoutSubmenu from "../components/layout/Submenu";
import { getIcon } from "../tools";
export default {
  name: "Invoices",
  middleware: "access",
  meta: {
    id: "a98b98e6-b2d5-42a3-853d-9516f64eade8",
  },
  components: { LayoutSubmenu },
  data() {
    return {
      menu: [
        {
          name: "Nueva partida",
          icon: getIcon("plus"),
          path: "/entries/new",
        },
        {
          name: "Listado de partidas",
          icon: getIcon("menu"),
          path: "/entries",
          epath: ["/entries/edit"],
        },
        {
          name: "Reportes",
          icon: getIcon("document-text"),
          path: "/entries/reports",
        },
        {
          name: "Configuraciones",
          icon: getIcon("cog"),
          path: "/entries/settings",
        },
      ],
    };
  },
};
</script>

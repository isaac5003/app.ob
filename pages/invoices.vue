<template>
  <div class="flex">
    <layout-submenu page-name="Ventas" :menu="menu" icon="dolar" />
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
          name: "Nueva venta",
          icon: getIcon("plus"),
          path: "/invoices/new",
        },
        {
          name: "Listado de ventas",
          icon: getIcon("menu"),
          path: "/invoices",
          epath: ["/invoices/edit"],
        },
        {
          name: "Reportes",
          icon: getIcon("document-text"),
          path: "/invoices/reports",
        },
        {
          name: "Configuraciones",
          icon: getIcon("cog"),
          path: "/invoices/settings",
        },
      ],
    };
  },
};
</script>

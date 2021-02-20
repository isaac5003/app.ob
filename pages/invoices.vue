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
    id: "cfb8addb-541b-482f-8fa1-dfe5db03fdf4",
  },
  components: { LayoutSubmenu },
  data() {
    return {
      menu: [
        {
          name: "Nuevo documento",
          icon: getIcon("plus"),
          path: "/invoices/new",
        },
        {
          name: "Reservar documento",
          icon: getIcon("document-add"),
          path: "/invoices/reserve",
        },
        {
          name: "Listado de documentos",
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

<template>
  <div class="flex">
    <layout-submenu
      page-name="Cobros electrónicos"
      :menu="menu"
      icon="collection"
    />
    <nuxt-child />
  </div>
</template>

<script>
import LayoutSubmenu from "../components/layout/Submenu";
import { getIcon } from "../tools";
export default {
  name: "Echarges",
  middleware: "access",
  meta: {
    id: "09a5c668-ab54-441e-9fb2-d24b36ae202e",
  },
  components: { LayoutSubmenu },
  data() {
    return {
      menu: [
        {
          name: "Nuevo cobro",
          icon: getIcon("plus"),
          path: "/echarges/new",
        },
        {
          name: "Listado de cobros",
          icon: getIcon("menu"),
          path: "/echarges",
          epath: ["/echarges/edit"],
        },
        {
          name: "Reportes",
          icon: getIcon("document-text"),
          path: "/echarges/reports",
        },
        {
          name: "Configuraciones",
          icon: getIcon("cog"),
          path: "/echarges/settings",
        },
      ],
    };
  },
};
</script>

<template>
  <div class="flex">
    <layout-submenu page-name="Clientes" :menu="menu" icon="users" />
    <nuxt-child />
  </div>
</template>

<script>
import LayoutSubmenu from "../components/layout/Submenu";
import { getIcon } from "../tools";
export default {
  name: "Customers",
  middleware: "access",
  meta: {
    id: "9ff0b6f4-9c58-475b-b2dd-5eea6d7b66aa",
  },
  components: { LayoutSubmenu },
  data() {
    return {
      menu: [
        {
          name: "Nuevo cliente",
          icon: getIcon("plus"),
          path: "/customers/new",
        },
        {
          name: "Listado de clientes",
          icon: getIcon("menu"),
          path: "/customers",
          epath: ["/customers/edit"],
        },
        // {
        //   name: "Reportes",
        //   icon: getIcon("document-text"),
        //   path: "/customers/reports",
        // },
        // {
        //   name: "Configuraciones",
        //   icon: getIcon("cog"),
        //   path: "/customers/settings",
        // },
      ],
    };
  },
};
</script>

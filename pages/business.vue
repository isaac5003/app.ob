<template>
  <div class="flex">
    <layout-submenu page-name="Mi Negocio" :menu="menu" icon="briefcase" />
    <nuxt-child />
  </div>
</template>

<script>
import LayoutSubmenu from "../components/layout/Submenu";
import { getIcon } from "../tools";
export default {
  name: "Business",
  components: { LayoutSubmenu },
  data() {
    return {
      menu: [
        {
          name: "Detalles",
          icon: getIcon("office-building"),
          path: "/business",
        },
        // {
        //   name: "Usuarios",
        //   icon: getIcon("user-group"),
        //   path: "/business/users",
        // },
        // {
        //   name: "Modulos",
        //   icon: getIcon("collection"),
        //   path: "/business/modules",
        // },
        // {
        //   name: "Facturación",
        //   icon: getIcon("credit-card"),
        //   path: "/business/invoicing",
        // },
      ],
    };
  },
};
</script>

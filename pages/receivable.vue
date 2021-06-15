<template>
  <div class="flex">
    <layout-submenu
      page-name="Cuentas por cobrar"
      :menu="menu"
      icon="clipboard-list"
    />
    <nuxt-child />
  </div>
</template>

<script>
import LayoutSubmenu from "../components/layout/Submenu";
import { getIcon } from "../tools";
export default {
  name: "Receivable",
  middleware: "access",
  meta: {
    id: "9c5dbbf2-ba8a-443d-b1ac-8bf23ea9a8e5",
  },
  components: { LayoutSubmenu },
  data() {
    return {
      menu: [
        {
          name: "Listados de cuentas por cobrar",
          icon: getIcon("menu"),
          path: "/receivable",
        },
        {
          name: "Configuraciones",
          icon: getIcon("cog"),
          path: "/receivable/settings",
        },
      ],
    };
  },
};
</script>

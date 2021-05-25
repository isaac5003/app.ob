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
    id: "9ff0b6f4-9c58-475b-b2dd-5eea6d7b66aa",
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

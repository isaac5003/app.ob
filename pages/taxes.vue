<template>
  <div class="flex">
    <layout-submenu page-name="IVA" :menu="menu" icon="receipt-tax" />
    <nuxt-child />
  </div>
</template>

<script>
import LayoutSubmenu from "../components/layout/Submenu";
import { getIcon, hasModule } from "../tools";
export default {
  name: "IVA",
  middleware: "access",
  meta: {
    id: "53a36e54-bab2-4824-9e43-b40efab8bab9",
  },
  components: { LayoutSubmenu },
  fetch() {
    if (
      hasModule(
        [
          "cf5e4b29-f09c-438a-8d82-2ef482a9a461",
          "cfb8addb-541b-482f-8fa1-dfe5db03fdf4",
        ],
        this.$auth.user
      )
    ) {
      this.menu = this.menu.slice(1);
    }
  },
  data() {
    return {
      menu: [
        {
          name: "Nuevo registro",
          icon: getIcon("plus"),
          path: "/taxes/new",
        },
        {
          name: "Listado de IVA",
          icon: getIcon("menu"),
          path: "/taxes",
          epath: ["/taxes/edit"],
        },
        //  {
        //   name: "Reportes",
        //   icon: getIcon("document-text"),
        //   path: "/taxes/reports",
        // },
      ],
    };
  },
};
</script>

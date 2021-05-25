<template>
  <div class="flex">
    <layout-submenu page-name="IVA" :menu="menu" icon="receipt-tax" />
    <nuxt-child />
  </div>
</template>

<script>
import LayoutSubmenu from "../components/layout/Submenu";
import { getIcon } from "../tools";
export default {
  name: "IVA",
  middleware: "access",
  meta: {
    id: "53a36e54-bab2-4824-9e43-b40efab8bab9",
  },
  components: { LayoutSubmenu },
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

<template>
  <div class="flex">
    <layout-submenu page-name="IVA" :menu="menu" icon="duplicate" />
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
    id: "0f88f2ea-aae9-44ad-8df0-0ee3debbf167",
  },
  components: { LayoutSubmenu },
  data() {
    return {
      menu: [
        {
          name: "Listado de IVA",
          icon: getIcon("menu"),
          path: "/taxes",
          epath: ["/taxes/edit"],
        },
        /* {
          name: "Reportes",
          icon: getIcon("document-text"),
          path: "/services/reports",
        }, */
      ],
    };
  },
};
</script>

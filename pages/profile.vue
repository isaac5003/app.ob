<template>
  <div class="flex">
    <layout-submenu page-name="Mi Perfil" :menu="menu" icon="user-circle">
      <div slot="upper">
        <img
          :src="require('../assets/images/main-avatar.png')"
          class="p-1 border-4 w-50 h-50 rounded-full"
        />
      </div>
    </layout-submenu>
    <nuxt-child />
  </div>
</template>

<script>
import LayoutSubmenu from "../components/layout/Submenu";
import { getIcon } from "../tools";
export default {
  name: "Profile",
  components: { LayoutSubmenu },
  data() {
    return {
      menu: [
        {
          name: "Mi perfil",
          icon: getIcon("user"),
          path: "/profile"
        },
        // {
        //   name: "Cambiar avatar",
        //   icon: "image",
        //   path: "/profile/avatar"
        // },
        {
          name: "Cambiar contraseña",
          icon: getIcon("lock"),
          path: "/profile/password"
        }
      ]
    };
  }
};
</script>

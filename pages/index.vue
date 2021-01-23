<template>
  <layout-content
    page-title="Escritorio"
    :breadcrumb="[{ name: 'Escritorio', to: null }]"
  >
    <div class="flex flex-col items-center w-full space-y-2">
      <Notification
        class="w-1/2"
        type="info"
        title="Bienvenido"
        message="Openbox Cloud permite la gestión de sus operaciones diarias, administración de personal y/o recursos"
      />
      <Notification
        v-if="$auth.user.changePassword"
        class="w-1/2"
        type="warning"
        title="Cambio de contraseña"
        message="Se recomienda la actualización de tu contraseña a una nueva."
        :link="{ title: 'Cambiar contraseña', path: '/profile/password' }"
      />
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "../components/layout/Content";
import Notification from "../components/Notification";
export default {
  name: "Index",
  head: {
    titleTemplate: `%s | Escritorio`,
  },
  components: { LayoutContent, Notification },
};
</script>

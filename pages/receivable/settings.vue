<template>
  <layout-content
    page-title="Configuración"
    :breadcrumb="[
      { name: 'Cuentas por cobrar', to: '/chargeAccounts' },
      { name: 'Configuración', to: null },
    ]"
  >
    <el-tabs> </el-tabs>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";

export default {
  name: "chargeAccountsSettings",
  components: { LayoutContent, Notification },
  fetch() {},
  fetchOnServer: false,
  data() {},
};
</script>
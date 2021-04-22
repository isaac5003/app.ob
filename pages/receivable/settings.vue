<template>
  <layout-content
    page-title="Configuración"
    :breadcrumb="[
      { name: 'Cuentas por cobrar', to: '/receivable' },
      { name: 'Configuración', to: null },
    ]"
  >
    <el-tabs
      v-model="tab"
      @tab-click="
        $router
          .replace({
            path: `/receivable/settings`,
            query: { tab },
          })
          .catch(() => {})
      "
    >
      <el-tab-pane label="Condiciones de pago" name="payment-condition">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-6 flex flex-col space-x-4">
            <div class="flex justify-between items-center">
              <span class="text-blue-900 font-semibold text-lg"
                >CONDICIONES DE PAGO</span
              >
              <el-button
                @click="showNewZone = true"
                type="primary"
                size="mini"
                icon="el-icon-plus"
              />
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
import {
  getIcon,
  hasModule,
  inputValidation,
  selectValidation,
} from "../../tools";
export default {
  name: "ReceivableSettings",
  components: { LayoutContent, Notification },
  fetch() {
    if (this.$route.query.tab) {
      this.tab = this.$route.query.tab;
    }
    if (this.$route.query.utab) {
      this.utab = this.$route.query.utab;
    }
  },
  fetchOnServer: false,
  data() {
    return {
      tab: "payment-condition",
      utab: "receivable",
    };
  },
};
</script>
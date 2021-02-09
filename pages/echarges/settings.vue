<template>
  <layout-content
    v-loading="pageloading"
    page-title="Listado de documentos"
    :breadcrumb="[
      { name: 'Cobros electrónicos', to: '/echarges' },
      { name: 'Configuraciones', to: null },
    ]"
  >
    <el-tabs
      v-model="tab"
      @tab-click="
        $router
          .replace({
            path: `/echarges/settings`,
            query: { tab },
          })
          .catch(() => {})
      "
    >
      <el-tab-pane label="Documento" name="document">
        <el-form
          :model="documentForm"
          :rules="documentFormRules"
          ref="documentForm"
        >
          <div class="grid grid-cols-12 gap-4">
            <el-form-item
              label="Cuerpo de documento"
              prop="body"
              class="col-span-4"
            >
              <el-input
                v-model="documentForm.body"
                type="text"
                autocomplete="off"
                maxlength="100"
                minlength="5"
                size="small"
                show-word-limit
                clearable
                placeholder=""
              >
              </el-input>
            </el-form-item>
            <el-form-item
              label="Despedida de documento"
              prop="farewell"
              class="col-span-4"
            >
              <el-input
                v-model="documentForm.farewell"
                size="small"
                class="w-full"
                autocomplete="off"
                maxlength="100"
                minlength="5"
                show-word-limit
                filterable
                clearable
                placeholder=""
              >
              </el-input>
            </el-form-item>
          </div>
          <div class="flex justify-end mt-4">
            <el-button type="primary" size="small">Guardar</el-button>
            <el-button size="small" @click="$router.push('/echarges')"
              >Cancelar</el-button
            >
          </div>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="Pasarela de pago" name="payment">
        <el-form
          :model="paymentForm"
          :rules="paymentFormmRules"
          ref="paymentForm"
        >
          <div class="grid grid-cols-12 gap-4">
            <el-form-item label="Cliente ID" prop="clientId" class="col-span-4">
              <el-input
                v-model="paymentForm.clientId"
                type="text"
                autocomplete="off"
                maxlength="100"
                minlength="5"
                size="small"
                show-word-limit
                clearable
                placeholder=""
              >
              </el-input>
            </el-form-item>
            <el-form-item
              label="Codigo de cliente"
              prop="clientSecret"
              class="col-span-4"
            >
              <el-input
                v-model="paymentForm.clientSecret"
                size="small"
                class="w-full"
                autocomplete="off"
                maxlength="100"
                minlength="5"
                show-word-limit
                filterable
                clearable
                placeholder=""
              >
              </el-input>
            </el-form-item>
          </div>
          <div class="flex justify-end mt-4">
            <el-button type="primary" size="small">Guardar</el-button>
            <el-button size="small" @click="$router.push('/echarges')"
              >Cancelar</el-button
            >
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </layout-content>
</template>
<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
export default {
  name: "Configuraciones",
  components: { LayoutContent, Notification },
  fetch() {
    // Se ubica en el tab correcto
    if (this.$route.query.tab) {
      this.tab = this.$route.query.tab;
    }
    if (this.$route.query.utab) {
      this.utab = this.$route.query.utab;
    }
  },
  data() {
    return {
      //pageloading: true,
      tab: "document",
      utab: "invoicing",
      documentForm: {
        body: "",
        farewell: "",
      },
      paymentForm: {
        clientId: "",
        clientSecret: "",
      },
    };
  },
  methods: {
    cancel() {
      this.$confirm("¿Estás seguro que deseas salir?", "Confirmación", {
        confirmButtonText: "Si, salir",
        cancelButtonText: "Cancelar",
        type: "warning",
      }).then(() => {
        this.$router.push("/entries");
      });
    },
  },
};
</script>
<template>
  <layout-content
    v-loading="pageloading"
    page-title="Configuraciones"
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
            <div class="col-span-6">
              <el-form-item
                label="Cuerpo de documento"
                prop="body"
                class="col-span-4"
              >
                <el-input
                  v-model="documentForm.body"
                  type="textarea"
                  autocomplete="off"
                  maxlength="500"
                  minlength="5"
                  size="small"
                  show-word-limit
                  clearable
                  placeholder=""
                >
                </el-input>
              </el-form-item>
            </div>
            <div class="col-span-6">
              <el-form-item
                label="Despedida de documento"
                prop="farewell"
                class="col-span-4"
              >
                <el-input
                  v-model="documentForm.farewell"
                  type="textarea"
                  size="small"
                  class="w-full"
                  autocomplete="off"
                  maxlength="500"
                  minlength="5"
                  show-word-limit
                  filterable
                  clearable
                  placeholder=""
                >
                </el-input>
              </el-form-item>
            </div>
          </div>
          <div class="flex justify-end mt-4">
            <el-button type="primary" size="small">Guardar</el-button>
            <el-button size="small" @click="$router.push('/echarges')"
              >Cancelar</el-button
            >
          </div>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="Pasarelas de pago" name="payment">
        <template>
          <el-tabs
            :tab-position="tabPosition"
            v-model="utab"
            @tab-click="
              $router
                .replace({
                  path: `/echarges/settings`,
                  query: { tab, utab },
                })
                .catch(() => {})
            "
          >
            <el-tab-pane label="Wompi" name="wompi">
              <el-form>
                <div class="grid grid-cols-12 gap-4">
                  <el-form-item label=" APP ID " class="col-span-4">
                    <el-input
                      class="w-full"
                      size="small"
                      placeholder="Escribe el id app"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="API Secret" class="col-span-4">
                    <el-input
                      class="w-full"
                      size="small"
                      placeholder="Escribe la api secret"
                    ></el-input>
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
        </template>
      </el-tab-pane>
    </el-tabs>
  </layout-content>
</template>
<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";
import {
  inputValidation,
  selectValidation,
  checkBeforeLeave,
  checkBeforeEnter,
} from "../../tools";

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
      tabPosition: "left",
      tab: "document",
      utab: "wompi",
      documentForm: {
        body: "",
        farewell: "",
      },
      documentFormRules: {
        body: inputValidation(true, 5, 500),
        farewell: inputValidation(true, 5, 500),
      },
      paymentForm: {
        clientId: "",
        clientSecret: "",
      },
      paymentFormmRules: {
        clientId: inputValidation(true, 5, 500),
        clientSecret: inputValidation(true, 5, 500),
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
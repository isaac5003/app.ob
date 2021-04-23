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
      <el-dialog
        title="Nueva condición de pago"
        :visible.sync="showNewPaymentCondition"
        :append-to-body="true"
        :close-on-click-modal="false"
        width="500px"
      >
        <div class="flex flex-col">
          <el-form
            :model="newNameConditionForm"
            status-icon
            ref="newNameConditionForm"
          >
            <!-- Autorización -->
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12">
                <el-form-item label="Nombre de la condición de pago">
                  <el-input
                    placeholder="Nombre"
                    class="w-full"
                    size="small"
                    v-model="newNameConditionForm.name"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-7">
                <el-form-item label="Lapso de tiempo para realizar el pago">
                  <el-input-number
                    class="w-full"
                    size="small"
                    :min="1"
                    :max="10"
                    v-model="newNameConditionForm.day"
                  ></el-input-number>
                </el-form-item>
              </div>
            </div>

            <div class="flex flex-rows justify-end">
              <el-button size="small" @click="showNewPaymentCondition = false">
                Cancelar
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click.native="
                  newNameCondition('newNameConditionForm', newNameConditionForm)
                "
                >Crear</el-button
              >
            </div>
          </el-form>
        </div>
      </el-dialog>
      <el-tab-pane label="Condiciones de pago" name="payment-condition">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-6 flex flex-col space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-blue-900 font-semibold text-lg"
                >CONDICIONES DE PAGO</span
              >
              <el-button
                @click="showNewPaymentCondition = true"
                type="primary"
                size="mini"
                icon="el-icon-plus"
              />
            </div>
            <el-table
              :data="paymentConditions"
              size="mini"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="45"> </el-table-column>
              <el-table-column label="#" prop="id" width="40"></el-table-column>
              <el-table-column
                label="Condición de pago"
                prop="name"
                min-width="150"
              ></el-table-column>
              <el-table-column
                label="Días"
                prop="day"
                min-width="60"
              ></el-table-column>
              <el-table-column label="Estado" prop="state" width="110">
                <template slot-scope="scope">
                  <el-tag size="small" type="success" v-if="scope.row.state"
                    ><i class="el-icon-success"> </i> Activo</el-tag
                  >
                  <el-tag size="small" type="danger" v-else
                    ><i class="el-icon-error"> </i> Inactivo</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column label min-width="65" align="center">
                <template slot="header" v-if="multipleSelection.length > 0">
                  <el-dropdown>
                    <el-button
                      trigger="click"
                      icon="el-icon-more"
                      type="primary"
                      size="mini"
                      class="transition ease-out duration-700"
                    ></el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <i class="el-icon-check"></i> Activar
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <i class="el-icon-close"></i> Desactivar
                      </el-dropdown-item>
                      <el-dropdown-item
                        :divided="true"
                        class="text-red-500 font-semibold"
                      >
                        <i class="el-icon-delete"></i> Eliminar
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
                <template slot-scope="scope">
                  <el-dropdown trigger="click" szie="mini">
                    <el-button icon="el-icon-more" size="mini" />
                    <el-dropdown-menu>
                      <el-dropdown-item>
                        <i class="el-icon-edit-outline"></i> Editar
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <i class="el-icon-check"></i> Activar
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <i class="el-icon-close"></i> Desactivar
                      </el-dropdown-item>
                      <el-dropdown-item
                        :divided="true"
                        class="text-red-500 font-semibold"
                      >
                        <i class="el-icon-delete"></i> Eliminar
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
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
      showNewPaymentCondition: false,
      newNameConditionForm: {
        name: "",
        day: "",
      },
      paymentConditions: [
        {
          id: "1",
          name: "Crédito de 15 días",
          day: "15",
          state: true,
        },
        {
          id: "2",
          name: "Crédito de 20 días",
          day: "20",
          state: false,
        },
      ],
      multipleSelection: [],
    };
  },
  methods: {
    newNameCondition(nameForm, conditions) {
      //console.log(nameForm, conditions);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>
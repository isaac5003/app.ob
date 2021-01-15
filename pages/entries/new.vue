<template>
  <layout-content
    v-loading="loading"
    page-title="Nueva partida"
    :breadcrumb="[
      { name: 'Contabilidad', to: '/entries' },
      { name: 'Nueva partida', to: null },
    ]"
  >
    <!-- dialogo editdetalledepartida-->
    <el-dialog
      title="Editar detalle de partida"
      :visible.sync="showAccountingDetail"
      width="550px"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <el-form
        :model="formAccountingDetail"
        status-icon
        :rules="entryDetailFormRules"
        ref="formAccountingDetail"
      >
        <!-- first row -->
        <div class="grid grid-cols-12">
          <!-- cuenta contable -->
          <div class="col-span-12">
            <el-form-item label="Cuenta contable" prop="accountingCatalog">
              <el-select
                v-model="formAccountingDetail.accountingCatalog"
                clearable
                filterable
                default-first-option
                size="small"
                class="w-full"
                placeholder="Seleccionar"
              >
                <el-option
                  v-for="a in accountingCatalog"
                  :key="a.id"
                  :label="`${a.code} - ${a.name}`"
                  :value="a.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <!-- second row -->
        <div class="grid grid-cols-12 gap-4">
          <!-- concepto -->
          <div class="col-span-12">
            <el-form-item label="Concepto" prop="concept">
              <el-input
                v-model="formAccountingDetail.concept"
                size="small"
                autocomplete="off"
                style="width: 100%"
                :disabled="formAccountingDetail.accountingCatalog === ''"
              />
            </el-form-item>
          </div>
        </div>
        <!-- third row -->
        <div class="grid grid-cols-12 gap-4">
          <!-- Cargo -->
          <div class="col-span-6">
            <el-form-item label="Cargo" prop="cargo">
              <el-input-number
                type="number"
                :min="0"
                :step="0.01"
                v-model="formAccountingDetail.cargo"
                size="small"
                autocomplete="off"
                style="width: 100%"
                :disabled="formAccountingDetail.entryAccounting === ''"
              />
            </el-form-item>
          </div>
          <!-- Cargo -->
          <div class="col-span-6">
            <el-form-item label="Abono" prop="abono">
              <el-input-number
                type="number"
                :min="0"
                :step="0.01"
                v-model="formAccountingDetail.abono"
                size="small"
                autocomplete="off"
                style="width: 100%"
                :disabled="formAccountingDetail.entryAccounting === ''"
              />
            </el-form-item>
          </div>
        </div>
        <!-- boton guardar cancelar -->
        <div class="flex justify-end dialog-footer">
          <el-button
            type="primary"
            size="small"
            @click.native="
              addToEntryDetails('formAccountingDetail', formAccountingDetail)
            "
            >Guardar</el-button
          >
          <el-button @click="showEditEntryDetail = false" size="small"
            >Cancelar</el-button
          >
        </div>
      </el-form>
    </el-dialog>

    <div class="flex flex-col space-y-2">
      <el-form label-position="top">
        <!-- primer div tipo partida, correlativo y rango de fechas -->
        <div class="grid grid-cols-12 gap-4 relative">
          <div class="col-span-4">
            <el-form-item label="Tipo de patida" prop="select">
              <el-select
                v-model="formAccountingDetail.select"
                size="small"
                class="w-full"
                placeholder="Select"
                @change="changeEntryType(formAccountingDetail)"
              >
                <el-option
                  v-for="e in entryTypes"
                  :key="e.id"
                  :label="`${e.code} - ${e.name}`"
                  :value="e.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-start-8 col-span-2">
            <el-form-item label="N° de correlativo">
              <el-input
                v-model="formAccountingDetail.serie"
                :disabled="true"
                class="w-full"
                size="small"
              >
              </el-input>
            </el-form-item>
          </div>
          <div class="col-start-10 col-span-3">
            <el-form-item label="Fecha de partida :">
              <el-date-picker
                v-model="formAccountingDetail.fecha"
                size="small"
                style="width: 100%"
                type="date"
                format="dd MMMM yyyy"
                value-format="yyyy-MM-dd"
                @change="changeEntryType(formAccountingDetail)"
              >
                >
              </el-date-picker>
            </el-form-item>
          </div>
        </div>
        <!-- segundo div para titulo partida, opciones de partida -->
        <div class="grid grid-cols-12 gap-4 relative">
          <div class="col-start-1 col-span-8">
            <el-form-item label="Titulo de la partida">
              <el-input v-model="input" class="w-full" size="small"> </el-input>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item label="Opciones de partida">
              <el-checkbox v-model="checked" border size="small" class="w-full"
                >Cuadrada</el-checkbox
              >
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item label=" ">
              <el-checkbox v-model="checked" border size="small" class="w-full"
                >Contabilizada</el-checkbox
              >
            </el-form-item>
          </div>
        </div>
        <!-- boton de Agregar -->
        <div class="grid grid-cols-12 gap-4 relative">
          <div class="col-start-11 col-span-2">
            <el-button
              @click="showAccountingDetail = true"
              type="primary"
              icon="el-icon-plus"
              class="w-full"
              size="small"
              >Agregar detalle</el-button
            >
          </div>
        </div>
        <!-- Tabla -->
        <div class="mt-4">
          <el-table
            :data="accountingEntryDetails"
            stripe
            size="small"
            :summary-method="getSummaries"
            show-summary
          >
            <el-table-column label="#" min-width="70"> </el-table-column>
            <el-table-column
              label="Cuenta contable"
              prop="catalogCode"
              min-width="180"
            >
            </el-table-column>
            <el-table-column
              label="Concepto"
              prop="concept"
              min-width="180"
            ></el-table-column>
            <el-table-column label="Cargo" min-width="180">
              <template slot-scope="scope">
                <span> {{ scope.row.cargo | formatMoney }} </span>
              </template></el-table-column
            >
            <el-table-column label="Abono" min-width="180">
              <template slot-scope="scope">
                <span> {{ scope.row.abono | formatMoney }} </span>
              </template>
            </el-table-column>
            <el-table-column
              style="margin-left: 20px"
              label="Opciones"
              min-width="180"
            >
              <template slot-scope="">
                <div class="flex flex-row items-center justify-center">
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-edit"
                  ></el-button>
                  <el-button
                    type="danger"
                    size="small"
                    icon="el-icon-delete"
                  ></el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- Guardar y Cancelar -->
        <div class="grid grid-cols-12 gap-4 relative mt-4">
          <div class="col-start-9 col-span-2">
            <el-button
              type="primary"
              icon="el-icon-check"
              class="w-full"
              size="small"
              >Guardar</el-button
            >
          </div>
          <div class="col-start-11 col-span-2">
            <el-button icon="el-icon-close" class="w-full" size="small"
              >Cancelar</el-button
            >
          </div>
        </div>
      </el-form>
    </div>
  </layout-content>
</template>

<script>
// import * as R from "ramda";
import { format } from "date-fns";
import LayoutContent from "../../components/layout/Content";
import {
  inputValidation,
  selectValidation,
  checkBeforeLeave,
  hasModule,
  getIcon,
  checkBeforeEnter,
} from "../../tools";
import Notification from "../../components/Notification";

const storagekey = "new-customer";

export default {
  name: "CustomerNew",
  components: { LayoutContent, Notification },
  fetch() {
    const entryTypes = () => {
      return this.$axios.get("/entries/types");
    };

    const accountingCatalog = () => {
      return this.$axios.get("/entries/catalog");
    };

    Promise.all([entryTypes(), accountingCatalog()])
      .then((res) => {
        const [entryTypes, accountingCatalog] = res;
        this.entryTypes = entryTypes.data.entryTypes;
        this.accountingCatalog = accountingCatalog.data.accountingCatalog;
        this.loading = false;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message;
      });
  },
  data() {
    const editCargoValidateCompare = (rule, value, callback) => {
      const abono =
        this.formAccountingDetail.abono > 0
          ? this.formAccountingDetail.abono.toFixed(2)
          : "";
      const val = value > 0 ? value.toFixed(2) : "";
      if (!abono) {
        if (!val) {
          callback(new Error("Este campo es requerido."));
        } else {
          callback();
        }
      } else if (abono && val) {
        return callback(
          new Error("No puedes agregar cargo y abono al mismo tiempo")
        );
      } else {
        callback();
      }
    };
    const editAbonoValidateCompare = (rule, value, callback) => {
      const cargo =
        this.formAccountingDetail.cargo > 0
          ? this.formAccountingDetail.cargo.toFixed(2)
          : "";
      const val = value > 0 ? value.toFixed(2) : "";
      if (!cargo) {
        if (!val) {
          callback(new Error("Este campo es requerido."));
        } else {
          callback();
        }
      } else if (cargo && val) {
        return callback(
          new Error("No puedes agregar cargo y abono al mismo tiempo")
        );
      } else {
        callback();
      }
    };
    return {
      checked: "",
      entryTypes: [],
      accountingCatalog: [],
      accountingEntryDetails: [],
      accountingDetail: "",
      showAccountingDetail: false,
      formAccountingDetail: {
        fecha: new Date(),
        accountingCatalog: "",
        concept: "",
        select: "",
        cargo: "",
        abono: "",
        serie: "",
      },
      entryDetailFormRules: {
        accountingCatalog: selectValidation(true),
        concept: inputValidation(true),
        cargo: [
          {
            validator: editCargoValidateCompare,
            trigger: ["blur", "change"],
          },
        ],
        abono: [
          {
            validator: editAbonoValidateCompare,
            trigger: ["blur", "change"],
          },
        ],
      },
      loading: false,
      option: {
        name: "",
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "Ahora",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "Ayer",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "Mañana",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
    };
  },
  methods: {
    closeDialog(name) {
      this.$refs[name].resetFields();
    },
    addToEntryDetails(formName, data) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }
        this.accountingEntryDetails.push({
          ...data,
          catalogCode: this.accountingCatalog.find(
            (c) => c.id == this.formAccountingDetail.accountingCatalog
          ).code,
        });
        this.showAccountingDetail = false;
      });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const totalAbono = data.reduce((a, b) => (a + b.abono ? b.abono : 0), 0);
      const totalCargo = data.reduce((a, b) => a + (b.cargo ? b.cargo : 0), 0);
      const resutls = columns.map((column) => {
        if (column.label == "Abono") {
          return this.$options.filters.formatMoney(totalAbono);
        } else if (column.label == "Cargo") {
          return this.$options.filters.formatMoney(totalCargo);
        } else if (column.label == "Concepto") {
          return "TOTALES";
        } else {
          return "";
        }
      });
      return resutls;
    },
    changeEntryType(formAccountingDetail) {
      // console.log(formAccountingDetail);
      let params = "";
      if (formAccountingDetail.select && formAccountingDetail.fecha) {
        params = {
          accountingEntryType: formAccountingDetail.select,
          date: formAccountingDetail.fecha,
        };
        this.$axios
          .get("/entries/serie", { params })
          .then((res) => {
            console.log(res);
            formAccountingDetail.serie = res.data.nextSerie;
          })
          .catch((err) => {
            this.errorMessage = err.response.data.message;
          });
      }
    },
  },
  computed: {},
};
</script>

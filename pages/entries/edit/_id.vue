<template>
  <layout-content
    v-loading="loading"
    page-title="Editar partida"
    :breadcrumb="[
      { name: 'Contabilidad', to: '/entries' },
      { name: 'Editar partida', to: null },
    ]"
  >
    <!-- dialogo adddetalledepartida-->
    <el-dialog
      title="Agregar detalle de partida"
      :visible.sync="showAddEntryDetail"
      width="550px"
      :close-on-click-modal="false"
      :append-to-body="true"
      @open="resetForm('newEntryDetailForm')"
    >
      <el-form
        :model="newEntryDetailForm"
        status-icon
        :rules="newEntryDetailFormRules"
        ref="newEntryDetailForm"
      >
        <!-- first row -->
        <div class="grid grid-cols-12">
          <!-- cuenta contable -->
          <div class="col-span-12">
            <el-form-item label="Cuenta contable" prop="entryAccounting">
              <el-select
                v-model="newEntryDetailForm.entryAccounting"
                clearable
                filterable
                default-first-option
                size="small"
                class="w-full"
                placeholder="Seleccionar"
              >
                <el-option
                  v-for="s in accountings"
                  :key="s.id"
                  :label="s.name"
                  :value="s.id"
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
                v-model="newEntryDetailForm.concept"
                size="small"
                autocomplete="off"
                style="width: 100%"
                :disabled="newEntryDetailForm.entryAccounting === ''"
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
                v-model="newEntryDetailForm.cargo"
                size="small"
                autocomplete="off"
                style="width: 100%"
                :disabled="newEntryDetailForm.entryAccounting === ''"
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
                v-model="newEntryDetailForm.abono"
                size="small"
                autocomplete="off"
                style="width: 100%"
                :disabled="newEntryDetailForm.entryAccounting === ''"
              />
            </el-form-item>
          </div>
        </div>
        <!-- boton guardar cancelar -->
        <div class="flex justify-end dialog-footer">
          <el-button type="primary" size="small">Guardar</el-button>
          <el-button @click="showAddEntryDetail = false" size="small"
            >Cancelar</el-button
          >
        </div>
      </el-form>
    </el-dialog>
    <div class="flex flex-col space-y-2">
      <el-form :model="editEntryForm" :rules="editEntryFormRules" status-icon>
        <!-- first row -->
        <div class="grid grid-cols-12 gap-4 relative">
          <!-- tipo de partida -->
          <div class="col-start-1 col-span-4">
            <el-form-item label="Tipo de patidad" prop="accountingEntryType">
              <el-select
                v-model="editEntryForm.accountingEntryType"
                size="small"
                class="w-full"
                placeholder="Select"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <!-- correlativo -->
          <div class="col-start-9 col-span-2">
            <el-form-item label="N° de correlativo">
              <el-input
                v-model="editEntryForm.serie"
                :disabled="true"
                class="w-full"
                size="small"
              >
              </el-input>
            </el-form-item>
          </div>
          <!-- fechas -->
          <div class="col-start-11 col-span-2">
            <el-form-item label="Fecha de partida " prop="date">
              <el-date-picker
                v-model="editEntryForm.date"
                size="small"
                style="width: 100%"
                type="date"
                format="dd MMMM yyyy"
                :picker-options="datePickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </div>
        </div>
        <!-- second row -->
        <div class="grid grid-cols-12 gap-4">
          <!-- titulo de partida -->
          <div class="col-start-1 col-span-8">
            <el-form-item label="Titulo de la partida" prop="title">
              <el-input
                v-model="editEntryForm.title"
                class="w-full"
                size="small"
              />
            </el-form-item>
          </div>
          <!-- opciones de partida -->
          <div class="col-span-2">
            <el-form-item label="Opciones de partida">
              <el-checkbox
                class="w-full"
                label="Cuadrada"
                v-model="editEntryForm.squared"
                size="small"
                border
                disabled
              />
            </el-form-item>
          </div>
          <div class="col-span-2">
            <el-form-item label=" ">
              <el-checkbox
                class="w-full mt-4"
                label="Contabilizada"
                v-model="editEntryForm.accounted"
                size="small"
                border
                disabled
              />
            </el-form-item>
          </div>
        </div>
        <!-- boton de Agregar -->
        <div class="grid grid-cols-12 gap-4 relative">
          <div class="col-start-11 col-span-2">
            <el-button
              type="primary"
              icon="el-icon-plus"
              class="w-full"
              size="small"
              @click="openAddEntryDetail()"
              >Agregar detalle</el-button
            >
          </div>
        </div>
        <!-- Tabla -->
        <div class="mt-4">
          <el-table stripe>
            <el-table-column label="#" width="70"> </el-table-column>
            <el-table-column label="Cuenta contable" width="150">
            </el-table-column>
            <el-table-column label="Concepto" width="425"></el-table-column>
            <el-table-column label="Cargo" width="100"></el-table-column>
            <el-table-column label="Abono" width="100"></el-table-column>
            <el-table-column width="120"></el-table-column>
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
import LayoutContent from "../../../components/layout/Content";
import {
  inputValidation,
  selectValidation,
  checkBeforeLeave,
  checkBeforeEnter,
} from "../../../tools";
import Notification from "../../../components/Notification";

const storagekey = "new-customer";

export default {
  name: "editEntry",
  components: { LayoutContent, Notification },
  fetch() {},
  data() {
    const newCargoValidateCompare = (rule, value, callback) => {
      const abono =
        this.newEntryDetailForm.abono > 0
          ? this.newEntryDetailForm.abono.toFixed(2)
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
    const newAbonoValidateCompare = (rule, value, callback) => {
      const cargo =
        this.newEntryDetailForm.cargo > 0
          ? this.newEntryDetailForm.cargo.toFixed(2)
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
      accountings: [
        {
          id: 1,
          name: "prueba",
        },
      ],
      showAddEntryDetail: false,
      loading: false,
      options: [{ name: "" }],
      editEntryForm: {
        accountingEntryType: "",
        title: "",
        date: "",
        serie: "",
        squared: "",
        accounted: "",
      },
      editEntryFormRules: {
        title: inputValidation(true),
        accountingEntryType: selectValidation(true),
        date: selectValidation(true),
      },
      newEntryDetailForm: {
        entryAccounting: "",
        concept: "",
        cargo: "",
        abono: "",
      },
      newEntryDetailFormRules: {
        entryAccounting: selectValidation(true),
        concept: inputValidation(true),
        cargo: [
          {
            validator: newCargoValidateCompare,
            trigger: ["blur", "change"],
          },
        ],
        abono: [
          {
            validator: newAbonoValidateCompare,
            trigger: ["blur", "change"],
          },
        ],
      },

      datePickerOptions: {
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
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
        ],
      },
    };
  },
  methods: {
    openAddEntryDetail() {
      this.showAddEntryDetail = true;
    },
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
  },
  computed: {},
};
</script>

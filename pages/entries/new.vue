<template>
  <layout-content
    v-loading="loading"
    page-title="Nueva partida"
    :breadcrumb="[
      { name: 'Contabilidad', to: '/entries' },
      { name: 'Nueva partida', to: null },
    ]"
  >
    <!-- dialogo agregar detalle partida-->
    <el-dialog
      title="Agregar detalle de partida"
      :visible.sync="showNewEntryDetail"
      width="550px"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <el-form
        :model="newEntryDetailForm"
        status-icon
        :rules="newEntryDetailFormRules"
        ref="newEntryDetailForm"
      >
        <el-form-item label="Cuenta contable" prop="accountingCatalog">
          <el-select
            v-model="newEntryDetailForm.accountingCatalog"
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
              :disabled="a.isParent == true"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Concepto" prop="concept">
          <el-input
            v-model="newEntryDetailForm.concept"
            size="small"
            autocomplete="off"
            class="w-full"
            :disabled="newEntryDetailForm.accountingCatalog === ''"
          />
        </el-form-item>
        <div class="grid grid-cols-12 gap-4">
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
                :disabled="newEntryDetailForm.accountingCatalog === ''"
              />
            </el-form-item>
          </div>
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
                :disabled="newEntryDetailForm.accountingCatalog === ''"
              />
            </el-form-item>
          </div>
        </div>
        <div class="flex justify-end">
          <el-button
            type="primary"
            size="small"
            @click.native="
              addToEntryDetails('newEntryDetailForm', newEntryDetailForm)
            "
            >Guardar</el-button
          >
          <el-button @click="showNewEntryDetail = false" size="small"
            >Cancelar</el-button
          >
        </div>
      </el-form>
    </el-dialog>

    <!-- dialogo editdetalledepartida-->
    <el-dialog
      title="Editar detalle de partida"
      :visible.sync="showEditEntryDetail"
      width="550px"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <el-form
        :model="editEntryDetailForm"
        status-icon
        :rules="editEntryDetailFormRules"
        ref="editEntryDetailForm"
      >
        <div class="grid grid-cols-12">
          <div class="col-span-12">
            <el-form-item label="Cuenta contable" prop="accountingCatalog">
              <el-select
                v-model="editEntryDetailForm.accountingCatalog"
                clearable
                filterable
                default-first-option
                size="small"
                class="w-full"
                placeholder="Seleccionar"
              >
                <el-option
                  v-for="aC in accountingCatalog"
                  :key="aC.id"
                  :label="`${aC.code} - ${aC.name}`"
                  :value="aC.id"
                  :disabled="aC.isParent == true"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12">
            <el-form-item label="Concepto" prop="concept">
              <el-input
                v-model="editEntryDetailForm.concept"
                size="small"
                autocomplete="off"
                style="width: 100%"
                :disabled="editEntryDetailForm.accountingCatalog === ''"
              />
            </el-form-item>
          </div>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-6">
            <el-form-item label="Cargo" prop="cargo">
              <el-input-number
                type="number"
                :min="0"
                :step="0.01"
                v-model="editEntryDetailForm.cargo"
                size="small"
                autocomplete="off"
                style="width: 100%"
                :disabled="editEntryDetailForm.accountingCatalog === ''"
              />
            </el-form-item>
          </div>
          <div class="col-span-6">
            <el-form-item label="Abono" prop="abono">
              <el-input-number
                type="number"
                :min="0"
                :step="0.01"
                v-model="editEntryDetailForm.abono"
                size="small"
                autocomplete="off"
                style="width: 100%"
                :disabled="editEntryDetailForm.accountingCatalog === ''"
              />
            </el-form-item>
          </div>
        </div>
        <div class="flex justify-end dialog-footer">
          <el-button
            type="primary"
            @click.native="
              updateDetail(
                editingEntryDetail,
                'editEntryDetailForm',
                editEntryDetailForm
              )
            "
            size="small"
            >Guardar</el-button
          >
          <el-button @click="showEditEntryDetail = false" size="small"
            >Cancelar</el-button
          >
        </div>
      </el-form>
    </el-dialog>

    <div class="flex flex-col">
      <el-form
        label-position="top"
        :model="newEntryForm"
        :rules="newEntryFormRules"
        class="flex flex-col space-y-4"
        @submit.native.prevent="
          saveEntry('newEntryForm', newEntryForm, accountingEntryDetails)
        "
        ref="newEntryForm"
      >
        <div class="flex flex-col">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-3">
              <el-form-item label="Tipo de patida" prop="entryType">
                <el-select
                  v-model="newEntryForm.entryType"
                  size="small"
                  class="w-full"
                  placeholder="Seleccionar"
                  @change="changeEntryType(newEntryForm)"
                >
                  <el-option
                    v-for="e in entryTypes"
                    :key="e.id"
                    :label="`${e.code} - ${e.name}`"
                    :value="e.id"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="col-start-9 col-span-2">
              <el-form-item label="N° de correlativo" prop="serie">
                <el-input
                  v-model="newEntryForm.serie"
                  :disabled="true"
                  class="w-full"
                  size="small"
                />
              </el-form-item>
            </div>
            <div class="col-start-11 col-span-3">
              <el-form-item label="Fecha de partida :" prop="date">
                <el-date-picker
                  v-model="newEntryForm.date"
                  size="small"
                  style="width: 100%"
                  type="date"
                  format="dd MMMM yyyy"
                  value-format="yyyy-MM-dd"
                  :picker-options="datePickerOptions"
                  @change="changeEntryType(newEntryForm)"
                />
              </el-form-item>
            </div>
          </div>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-8">
              <el-form-item label="Titulo de la partida" prop="title">
                <el-input
                  v-model="newEntryForm.title"
                  class="w-full"
                  size="small"
                />
              </el-form-item>
            </div>
            <div class="col-span-2">
              <el-form-item label="Opciones de partida" prop="squared">
                <el-checkbox
                  v-model="newEntryForm.squared"
                  disabled
                  border
                  size="small"
                  class="w-full"
                  >Cuadrada</el-checkbox
                >
              </el-form-item>
            </div>
            <div class="col-span-2">
              <el-form-item label="Fecha de partida" prop="accounted">
                <el-checkbox
                  v-model="newEntryForm.accounted"
                  disabled
                  border
                  size="small"
                  class="w-full"
                  >Contabilizada</el-checkbox
                >
              </el-form-item>
            </div>
          </div>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-start-11 col-span-2">
              <el-button
                @click="openNewEntryDetail()"
                type="primary"
                icon="el-icon-plus"
                class="w-full"
                size="small"
                >Agregar detalle</el-button
              >
            </div>
          </div>
        </div>
        <el-table
          :data="accountingEntryDetails"
          stripe
          size="mini"
          show-summary
          :summary-method="getSummaries"
        >
          <el-table-column type="index" label="#" min-width="70" />
          <el-table-column
            label="Cuenta contable"
            prop="code"
            min-width="150"
          />
          <el-table-column label="Concepto" prop="concept" min-width="425" />
          <el-table-column label="Cargo" min-width="100">
            <template slot-scope="scope">
              <span> {{ scope.row.cargo | formatMoney }} </span>
            </template>
          </el-table-column>
          <el-table-column label="Abono" min-width="100">
            <template slot-scope="scope">
              <span> {{ scope.row.abono | formatMoney }} </span>
            </template>
          </el-table-column>
          <el-table-column min-width="120">
            <template slot-scope="scope">
              <div class="flex flex-row items-center justify-center">
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-edit"
                  @click="openEditEntryDetail(scope.$index, scope.row)"
                />
                <el-button
                  type="danger"
                  size="small"
                  icon="el-icon-delete"
                  @click="deleteDetail(scope.$index)"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="flex flex-row justify-end space-x-4">
          <el-button type="primary" size="small" native-type="submit"
            >Guardar</el-button
          >
          <el-button size="small" @click="cancel()">Cancelar</el-button>
        </div>
      </el-form>
    </div>
  </layout-content>
</template>

<script>
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

export default {
  name: "EntryNew",
  components: { LayoutContent, Notification },
  fetch() {
    const entryTypes = () => this.$axios.get("/entries/types");

    Promise.all([entryTypes()])
      .then((res) => {
        const [entryTypes] = res;
        this.entryTypes = entryTypes.data.entryTypes;
        this.loading = false;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message;
      });
  },
  data() {
    const newCargoValidateCompare = (rule, value, callback) => {
      const abono =
        this.newEntryDetailForm.abono > 0
          ? this.newEntryDetailForm.abono.toFixed(2)
          : 0;
      const val = value > 0 ? value.toFixed(2) : 0;
      if (!abono) {
        if (!val) {
          callback(new Error("Este campo es requerido."));
        } else {
          this.newEntryDetailForm.abono = 0;
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
          : 0;
      const val = value > 0 ? value.toFixed(2) : 0;
      if (!cargo) {
        if (!val) {
          callback(new Error("Este campo es requerido."));
        } else {
          this.newEntryDetailForm.cargo = 0;
          callback();
        }
      } else if (cargo && val) {
        return callback(
          new Error("No puedes agregar abono y cargo al mismo tiempo")
        );
      } else {
        callback();
      }
    };
    const editCargoValidateCompare = (rule, value, callback) => {
      const abono =
        this.editEntryDetailForm.abono > 0
          ? this.editEntryDetailForm.abono.toFixed(2)
          : 0;
      const val = value > 0 ? value.toFixed(2) : 0;
      if (!abono) {
        if (!val) {
          callback(new Error("Este campo es requerido."));
        } else {
          this.editEntryDetailForm.abono = 0;
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
        this.editEntryDetailForm.cargo > 0
          ? this.editEntryDetailForm.cargo.toFixed(2)
          : 0;
      const val = value > 0 ? value.toFixed(2) : 0;
      if (!cargo) {
        if (!val) {
          callback(new Error("Este campo es requerido."));
        } else {
          this.editEntryDetailForm.cargo = 0;
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
      loading: false,
      entryTypes: [],
      accountingCatalog: [],
      newEntryForm: {
        entryType: "",
        date: this.$dateFns.format(new Date(), "yyyy-MM-dd"),
        serie: "",
        squared: "",
        accounted: "",
        title: "",
      },
      newEntryFormRules: {
        entryType: selectValidation(true),
        date: selectValidation(true),
        title: inputValidation(true),
      },
      accountingEntryDetails: [],
      showNewEntryDetail: false,
      newEntryDetailForm: {
        accountingCatalog: "",
        concept: "",
        cargo: "",
        abono: "",
      },
      newEntryDetailFormRules: {
        accountingCatalog: selectValidation(true),
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
      editEntryDetailForm: {
        accountingCatalog: "",
        concept: "",
        cargo: "",
        abono: "",
      },
      editEntryDetailFormRules: {
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
      editingEntryDetail: "",
      showEditEntryDetail: false,
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
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
    };
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param;
      const totalAbono = data.reduce((a, b) => a + (b.abono ? b.abono : 0), 0);
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
    addToEntryDetails(formName, data) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }
        this.accountingEntryDetails.push({
          ...data,
          catalogCode: this.accountingCatalog.find(
            (c) => c.id == data.accountingCatalog
          ).code,
        });
        this.showNewEntryDetail = false;
        this.checkEntry();
      });
    },
    changeEntryType({ entryType, date }) {
      if (entryType && date) {
        this.$axios
          .get("/entries/serie", {
            params: {
              accountingEntryType: entryType,
              date,
            },
          })
          .then(({ data }) => {
            this.newEntryForm.serie = data.nextSerie;
          })
          .catch((err) => {
            this.errorMessage = err.response.data.message;
          });
      }
    },
    deleteDetail(index) {
      this.$confirm(
        "¿Estás seguro que deseas eliminar este detalle?",
        "Confirmación",
        {
          confirmButtonText: "Si, eliminar",
          cancelButtonText: "Cancelar",
          type: "warning",
        }
      ).then(() => {
        this.accountingEntryDetails.splice(index, 1);
      });
    },
    async getAccountingCatalog() {
      try {
        const { data } = await this.$axios.get("/entries/catalog");
        this.accountingCatalog = data.accountingCatalog;
      } catch (error) {
        this.errorMessage = err.response.data.message;
      }
    },
    openNewEntryDetail() {
      this.getAccountingCatalog();
      this.showNewEntryDetail = true;
      if (this.$refs["newEntryDetailForm"]) {
        this.$refs["newEntryDetailForm"].resetFields();
      }
    },

    openEditEntryDetail(index, details) {
      this.getAccountingCatalog();
      this.editingEntryDetail = index;
      this.editEntryDetailForm = { ...details };
      this.showEditEntryDetail = true;
      if (this.$refs["editEntryDetailForm"]) {
        this.$refs["editEntryDetailForm"].resetFields();
      }
    },
    updateDetail(index, formName, form) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }
        this.accountingEntryDetails.splice(index, 1, {
          ...form,
          code: this.accountingCatalog.find(
            (c) => c.id == form.accountingCatalog
          ).code,
        });
        console.log(this.accountingEntryDetails);

        this.showEditEntryDetail = false;
        this.checkEntry();
      });
    },
    checkEntry() {
      const totalAbono = this.accountingEntryDetails.reduce(
        (a, b) => a + (b.abono ? b.abono : 0),
        0
      );
      const totalCargo = this.accountingEntryDetails.reduce(
        (a, b) => a + (b.cargo ? b.cargo : 0),
        0
      );
      this.newEntryForm.squared =
        totalAbono.toFixed(3) == totalCargo.toFixed(3);
      this.newEntryForm.accounted = false;
    },
    saveEntry(formName, formData, details) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }
        const save = () => {
          this.$confirm(
            "¿Estás seguro que deseas guardar esta partida?",
            "Confirmación",
            {
              confirmButtonText: "Si, guardar",
              cancelButtonText: "Cancelar",
              type: "warning",
              beforeClose: (action, instance, done) => {
                if (action === "confirm") {
                  instance.confirmButtonLoading = true;
                  instance.confirmButtonText = "Procesando...";
                  this.$axios
                    .post("/entries", {
                      header: {
                        title: formData.title,
                        serie: formData.serie,
                        date: formData.date,
                        squared: formData.squared,
                        accounted: formData.accounted,
                        accountingEntryType: formData.entryType,
                      },
                      details: details.map((d) => {
                        return {
                          ...d,
                          accountingCatalog: d.accountingCatalog,
                          concept: d.concept,
                          cargo: d.cargo,
                          abono: d.abono,
                          order: details.indexOf(d) + 1,
                        };
                      }),
                    })
                    .then((res) => {
                      this.$notify.success({
                        title: "Exito",
                        message: res.data.message,
                      });
                      setTimeout(() => {
                        this.$confirm(
                          "¿Deseas crear una nueva partida?",
                          "Confirmación",
                          {
                            confirmButtonText: "Si, porfavor",
                            cancelButtonText: "No, gracias",
                            type: "warning",
                            closeOnClickModal: false,
                            closeOnPressEscape: false,
                          }
                        )
                          .then(() => {
                            this.$refs["newEntryForm"].resetFields();
                            this.accountingEntryDetails = [];
                          })
                          .catch(() => {
                            this.$router.push("/entries");
                          });
                      }, 500);
                    })
                    .catch((err) => {
                      this.$notify.error({
                        title: "Error",
                        message: err.response.data.message,
                      });
                    })
                    .then((alw) => {
                      instance.confirmButtonLoading = false;
                      instance.confirmButtonText = "Si, guardar";
                      done();
                    });
                } else {
                  done();
                }
              },
            }
          );
        };

        this.checkEntry();
        const originalAccounted = formData.accounted;
        if (formData.squared && !formData.accounted) {
          this.$confirm(
            "Esta partida esta cuadrada, ¿deseas marcarla como completada?",
            "Confirmación",
            {
              type: "warning",
              distinguishCancelAndClose: true,
              confirmButtonText: "Si, porfavor",
              cancelButtonText: "No, gracias",
            }
          )
            .then(() => {
              formData.accounted = true;
              save();
            })
            .catch((action) => {
              if (action === "cancel") {
                formData.accounted = false;
                save();
              } else {
                return false;
              }
            });
        } else {
          save();
        }
      });
    },

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

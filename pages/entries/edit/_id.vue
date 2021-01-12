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
                :disabled="newEntryDetailForm.accountingCatalog === ''"
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
                :disabled="newEntryDetailForm.accountingCatalog === ''"
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
          <el-button
            type="primary"
            @click.native="
              addToEntryDetails('newEntryDetailForm', newEntryDetailForm)
            "
            size="small"
            >Guardar</el-button
          >
          <el-button @click="showAddEntryDetail = false" size="small"
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
        <!-- first row -->
        <div class="grid grid-cols-12">
          <!-- cuenta contable -->
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
                />
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
                v-model="editEntryDetailForm.concept"
                size="small"
                autocomplete="off"
                style="width: 100%"
                :disabled="editEntryDetailForm.accountingCatalog === ''"
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
                v-model="editEntryDetailForm.cargo"
                size="small"
                autocomplete="off"
                style="width: 100%"
                :disabled="editEntryDetailForm.entryAccounting === ''"
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
                v-model="editEntryDetailForm.abono"
                size="small"
                autocomplete="off"
                style="width: 100%"
                :disabled="editEntryDetailForm.entryAccounting === ''"
              />
            </el-form-item>
          </div>
        </div>
        <!-- boton guardar cancelar -->
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

    <div class="flex flex-col space-y-2">
      <el-form
        :model="editEntryForm"
        :rules="editEntryFormRules"
        status-icon
        @submit.native.prevent="
          saveUpdateEntry(
            'editEntryForm',
            editEntryForm,
            accountingEntryDetails
          )
        "
        ref="editEntryForm"
      >
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
                  v-for="aeT in accountingEntryTypes"
                  :key="aeT.id"
                  :label="aeT.code + ' - ' + aeT.name"
                  :value="aeT.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <!-- correlativo -->
          <div class="col-start-8 col-span-2">
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
          <div class="col-span-3">
            <el-form-item label="Fecha de partida " prop="date">
              <el-date-picker
                v-model="editEntryForm.rawDate"
                size="small"
                style="width: 100%"
                type="date"
                format="dd MMMM yyyy"
                value-format="yyyy-MM-dd"
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
          <el-table
            :data="accountingEntryDetails"
            style="width: 100%"
            show-summary
            :summary-method="getSummaries"
            stripe
            size="mini"
          >
            <el-table-column type="index" label="#" min-width="70" />
            <el-table-column
              label="Cuenta contable"
              prop="catalogName"
              min-width="150"
            />
            <el-table-column label="Concepto" prop="concept" min-width="425" />
            <el-table-column label="Cargo" min-width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.cargo | formatMoney }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Abono" min-width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.abono | formatMoney }}</span>
              </template>
            </el-table-column>
            <el-table-column min-width="120">
              <template slot-scope="scope">
                <div class="flex flex-row items-center justify-center">
                  <el-button
                    type="primary"
                    @click="openEditEntryDetail(scope.$index, scope.row)"
                    size="small"
                    icon="el-icon-edit"
                    circle
                  ></el-button>
                  <el-button
                    type="danger"
                    @click="deleteDetail(scope.$index)"
                    size="small"
                    icon="el-icon-delete"
                    circle
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
              native-type="submit"
              >Guardar</el-button
            >
          </div>
          <div class="col-start-11 col-span-2">
            <el-button
              icon="el-icon-close"
              @click="cancel()"
              class="w-full"
              size="small"
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
const storagekey = "edit-entries";
export default {
  name: "editEntry",
  components: { LayoutContent, Notification },
  fetch() {
    const entryTypes = () => this.$axios.get(`/entries/types`);
    const entry = () => this.$axios.get(`/entries/${this.$route.params.id}`);

    Promise.all([entryTypes(), entry()])
      .then((res) => {
        const [entryTypes, entry] = res;
        this.accountingEntryTypes = entryTypes.data.entryTypes;
        this.editEntryForm = {
          ...entry.data.entry,
          accountingEntryType: entry.data.entry.accountingEntryType.id,
        };
        this.accountingEntryDetails = entry.data.entry.accountingEntryDetails.map(
          (d) => {
            return {
              ...d,
              accountingCatalog: d.accountingCatalog.id,
            };
          }
        );
        this.checkEntry();
      })
      .catch((err) => {
        console.log(err);
        this.errorMessage = err.response.data.message;
      });
  },

  // checkBeforeEnter(this, storagekey, "salesNewForm");

  fetchOnServer: false,
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
    const editCargoValidateCompare = (rule, value, callback) => {
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
    const editAbonoValidateCompare = (rule, value, callback) => {
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
      showEditEntryDetail: false,
      showAddEntryDetail: false,
      loading: false,
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
        accountingCatalog: "",
        concept: "",
        cargo: "",
        abono: "",
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
      accountingEntryTypes: [],
      accountingEntryDetails: [],
      editingEntryDetail: "",
      accountingCatalog: [],
    };
  },
  methods: {
    getSummaries(value) {
      const { columns, data } = value;
      let totalCargo = data.reduce((a, b) => (a + b.cargo ? b.cargo : 0), 0);
      let totalAbono = data.reduce((a, b) => (a + b.abono ? b.abono : 0), 0);

      const result = columns.map((column) => {
        switch (column.label) {
          case "Abono":
            return this.$options.filters.formatMoney(totalAbono);
            break;
          case "Cargo":
            return this.$options.filters.formatMoney(totalCargo);
            break;
          case "Concepto":
            return "TOTALES";
            break;
        }
      });
      return result;
    },
    getAccountingCatalog() {
      this.$axios
        .get("/entries/catalog")
        .then((res) => {
          this.accountingCatalog = res.data.accountingCatalog;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        });
    },
    openAddEntryDetail() {
      this.getAccountingCatalog();
      this.showAddEntryDetail = true;
    },
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    openEditEntryDetail(index, details) {
      this.getAccountingCatalog();
      this.editingEntryDetail = index;
      this.editEntryDetailForm = { ...details };
      this.showEditEntryDetail = true;
    },
    addToEntryDetails(formName, data) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.accountingEntryDetails.push({
          ...data,

          catalogName: this.accountingCatalog.find(
            (c) => c.id == this.newEntryDetailForm.accountingCatalog
          ).name,
        });
        this.showAddEntryDetail = false;
        this.checkEntry();
      });
    },
    updateDetail(index, formName, form) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.accountingEntryDetails.splice(index, 1, { ...form });

        this.showEditEntryDetail = false;
        this.checkEntry();
      });
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
    saveUpdateEntry(formName, formData, details) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        const save = () => {
          this.$confirm(
            "¿Estás seguro que deseas actualizar esta partida?",
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
                    .put(`/entries/${this.$route.params.id}`, {
                      header: {
                        title: formData.title,
                        date: formData.rawDate,

                        squared: formData.squared,
                        accounted: formData.accounted,
                        accountingEntryType: formData.accountingEntryType,
                      },
                      details: details.map((d) => {
                        return {
                          ...d,
                          accountingCatalog: d.accountingCatalog,
                        };
                      }),
                    })
                    .then((res) => {
                      this.$notify.success({
                        title: "Exito",
                        message: res.data.message,
                      });
                      // localStorage.removeItem(storagekey);
                      setTimeout(() => {
                        this.$router.push("/entries");
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
    checkEntry() {
      // let totalCargo = this.accountingEntryDetails.reduce(
      //   (a, b) => (a + b.cargo ? b.cargo : 0),
      //   0
      // );
      // let totalAbono = this.accountingEntryDetails.reduce(
      //   (a, b) => (a + b.abono ? b.abono : 0),
      //   0
      // );

      let totalAbono = this.accountingEntryDetails.reduce((a, b) => {
        const first = !a.abono ? 0 : parseFloat(a.abono);
        const second = !b.abono ? 0 : parseFloat(b.abono);
        return { abono: first + second };
      }).abono;
      let totalCargo = this.accountingEntryDetails.reduce((a, b) => {
        const first = !a.cargo ? 0 : parseFloat(a.cargo);
        const second = !b.cargo ? 0 : parseFloat(b.cargo);
        return { cargo: first + second };
      }).cargo;
      console.log(totalCargo);
      console.log(totalAbono);
      this.editEntryForm.squared =
        totalAbono.toFixed(3) === totalCargo.toFixed(3);
      this.editEntryForm.accounted = false;
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
  computed: {},
};
</script>

<template>
  <layout-content
    v-loading="loading"
    page-title="Nuevo Cobro electrónico"
    :breadcrumb="[
      { name: 'Cobros electronicos', to: '/echarges' },
      { name: 'Nuevo cobro', to: null },
    ]"
  >
    <el-form
      :model="eChargesNewForm"
      :rules="eChargesNewFormRules"
      status-icon
      @submit.native.prevent="
        submitNewEcharge('eChargesNewForm', eChargesNewForm)
      "
      ref="eChargesNewForm"
    >
      <!-- firstRow -->
      <div class="grid grid-cols-12 gap-4">
        <!-- invoice -->
        <el-form-item
          class="col-span-3"
          label="Ventas"
          prop="invoice"
          v-if="hasModule('cfb8addb-541b-482f-8fa1-dfe5db03fdf4')"
        >
          <el-select
            v-model="eChargesNewForm.invoice"
            class="w-full"
            size="small"
            clearable
            placeholder="Seleccionar"
            @change="getInvoiceDetails(eChargesNewForm.invoice)"
          >
            <el-option
              v-for="c in invoices"
              :key="c.id"
              :label="`${c.authorization} - ${c.sequence}`"
              :value="c.id"
            >
              <div
                class="
                  flex flex-row
                  justify-between
                  items-end
                  py-1
                  leading-normal
                "
              >
                <span>{{ c.authorization }} - {{ c.sequence }}</span>
                <span class="text-xs text-gray-500">{{ c.status.name }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- cliente -->
        <el-form-item class="col-span-3" label="Cliente" prop="customer" v-else>
          <el-select
            v-model="eChargesNewForm.customer"
            class="w-full"
            size="small"
            clearable
            placeholder="Seleccionar"
          >
            <el-option
              v-for="c in customers"
              :key="c.is"
              :label="c.name"
              :value="c.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- correo -->
        <div class="col-span-3">
          <el-form-item
            class="col-span-12"
            label="Introduzca el correo:"
            prop="email"
          >
            <el-input
              v-model="eChargesNewForm.email"
              size="small"
              class="w-full"
              type="email"
              placeholder="example@openbox.cloud"
              clearable
            ></el-input>
          </el-form-item>
        </div>
        <!-- authorization -->
        <div class="col-span-2 col-start-7">
          <el-form-item label="N° de autorización" prop="authorization">
            <el-input
              v-model="eChargesNewForm.authorization"
              size="small"
              placeholder=""
              :readonly="hasModule('cfb8addb-541b-482f-8fa1-dfe5db03fdf4')"
            >
            </el-input>
          </el-form-item>
        </div>
        <!-- n° Correlativo -->
        <div class="col-span-2">
          <el-form-item label="N° de correlativo" prop="sequence">
            <el-input
              size="small"
              placeholder=""
              v-model="eChargesNewForm.sequence"
              :readonly="hasModule('cfb8addb-541b-482f-8fa1-dfe5db03fdf4')"
            >
            </el-input>
          </el-form-item>
        </div>
        <!-- total -->
        <div class="col-span-2">
          <el-form-item label="Total" prop="total">
            <!-- invoice -->
            <el-input
              v-model="eChargesNewForm.total"
              size="small"
              style="width: 100%"
              readonly
              v-if="hasModule('cfb8addb-541b-482f-8fa1-dfe5db03fdf4')"
            />
            <el-input-number
              v-else
              type="number"
              :min="0"
              :step="0.01"
              v-model="eChargesNewForm.total"
              size="small"
              autocomplete="off"
              :precision="2"
              style="width: 100%"
            >
            </el-input-number>
          </el-form-item>
        </div>
      </div>
      <!-- secondRow -->
      <div class="grid grid-cols-12">
        <!--Descripcion -->
        <div class="col-span-12">
          <el-form-item label="Descripción" prop="description">
            <el-input
              type="textarea"
              :rows="5"
              size="small"
              v-model="eChargesNewForm.description"
              maxlength="500"
              minlength="5"
              show-word-limit
              :readonly="hasModule('cfb8addb-541b-482f-8fa1-dfe5db03fdf4')"
            >
            </el-input>
          </el-form-item>
        </div>
      </div>
      <div class="flex justify-end">
        <el-button type="primary" size="small" native-type="submit"
          >Guardar</el-button
        >
        <el-button size="small" @click="$router.push('/echarges')"
          >Cancelar</el-button
        >
      </div>
    </el-form>
    <!-- boton guardar cancelar -->
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import {
  inputValidation,
  selectValidation,
  hasModule,
  parseErrors,
} from "../../tools";
import Notification from "../../components/Notification";

export default {
  name: "echargesNew",
  components: { LayoutContent, Notification },
  fetch() {
    const customers = () => {
      return this.$axios.get("/customers", {
        params: { active: true },
      });
    };

    const invoices = () => this.$axios.get("/invoices");

    Promise.all([customers(), invoices()])
      .then((res) => {
        const [customers, invoices] = res;
        this.customers = customers.data.customers;
        this.rawInvoices = invoices.data.data;
        this.loading = false;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message;
        console.log(this.errorMessage);
      });
  },
  fetchOnServer: false,
  data() {
    return {
      loading: false,
      eChargesNewForm: {
        customer: "",
        invoice: "",
        sequence: "",
        description: "",
        total: "",
        email: "",
        authorization: "",
        notify: "",
      },
      customers: [],
      rawInvoices: [],
      eChargesNewFormRules: {
        customer: selectValidation(true),
        sequence: selectValidation(true),
        description: inputValidation(true, 5, 500),
        total: inputValidation(true),
        email: inputValidation(true, null, null, "email"),
      },
    };
  },
  methods: {
    hasModule(module) {
      return hasModule(module, this.$auth.user);
    },
    getInvoiceDetails(id) {
      this.$axios
        .get(`/invoices/${id}`)
        .then(({ data }) => {
          let description = "";
          for (const d of data.data.details) {
            description += `(${d.quantity}) - ${d.chargeDescription}\n`;
          }
          this.eChargesNewForm.authorization = data.data.authorization;
          this.eChargesNewForm.sequence = data.data.sequence;
          this.eChargesNewForm.total = parseFloat(data.data.ventaTotal).toFixed(
            2
          );
          this.eChargesNewForm.description = description;
          this.eChargesNewForm.customer = data.data.customer.id;
        })
        .catch();
    },
    submitNewEcharge(formName, formData) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }
        const save = () => {
          this.$confirm(
            "¿Estás seguro que deseas guardar este nuevo cobro?",
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
                    .post("/echarges", {
                      ...formData,
                    })
                    .then((res) => {
                      this.$notify.success({
                        title: "Exito",
                        message: res.data.message,
                      });
                      // localStorage.removeItem(storagekey);
                      setTimeout(() => {
                        this.$confirm(
                          "¿Deseas crear un nuevo cobro?",
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
                            this.$refs[formName].resetFields();
                          })
                          .catch(() => {
                            this.$router.push("/echarges");
                          });
                      }, 1000);
                    })
                    .catch((err) => {
                      instance.confirmButtonLoading = false;
                      instance.confirmButtonText = "Si, guardar";
                      this.$notify.error({
                        title: "Error",
                        dangerouslyUseHTMLString: true,
                        message: parseErrors(err.response.data.message),
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

        this.$confirm("¿Deseas notificar este cobro?", "Confirmación", {
          type: "warning",
          distinguishCancelAndClose: true,
          confirmButtonText: "Si, porfavor",
          cancelButtonText: "No, gracias",
        })
          .then(() => {
            formData.notify = true;

            save();
          })
          .catch((action) => {
            if (action === "cancel") {
              formData.notify = false;
              save();
            } else {
              return false;
            }
          });
      });
    },
  },
  computed: {
    invoices() {
      return this.rawInvoices.filter(
        (i) => i.status.d == 1 || i.status.id == 2
      );
    },
  },
};
</script>

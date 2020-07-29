<template>
  <layout-content
    page-title="Nuevo servicio"
    :breadcrumb="[
      { name: 'Servicios', to: '/services' },
      { name: 'Nuevo servicio', to: null },
    ]"
  >
    <el-form
      :model="servicesNewForm"
      :rules="servicesNewFormRules"
      status-icon
      ref="servicesNewForm"
      @submit.native.prevent="submitNewService('servicesNewForm', servicesNewForm)"
    >
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-6">
          <el-form-item label="Nombre del servicio" prop="name">
            <el-input
              ref="name"
              type="text"
              v-model="servicesNewForm.name"
              size="small"
              autocomplete="off"
              @blur="setStorage(servicesNewForm)"
            />
          </el-form-item>
        </div>
        <div class="col-span-2">
          <el-form-item label="Costo" prop="cost">
            <el-input
              ref="cost"
              type="number"
              min="0"
              step="0.01"
              v-model="servicesNewForm.cost"
              size="small"
              autocomplete="off"
              @blur="setStorage(servicesNewForm)"
            />
          </el-form-item>
        </div>
        <div class="col-span-4">
          <el-form-item label="Tipo de venta" prop="sellingType">
            <el-radio-group
              ref="sellingType"
              v-model="servicesNewForm.sellingType"
              class="w-full"
              @change="setStorage(servicesNewForm)"
            >
              <el-row :gutter="15">
                <el-col :span="8" v-for="(s, k) in sellingTypes" :key="k">
                  <el-radio :label="s.id" border class="w-full" size="small">{{s.name}}</el-radio>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>
      <div>
        <el-form-item label="Descripción del servicio" prop="description">
          <el-input
            ref="description"
            type="textarea"
            :rows="4"
            v-model="servicesNewForm.description"
            @blur="setStorage(servicesNewForm)"
          ></el-input>
        </el-form-item>
      </div>
      <div class="flex justify-end">
        <el-button type="primary" size="small" native-type="submit">Guardar</el-button>
        <el-button size="small" @click="cancel()">Cancelar</el-button>
      </div>
    </el-form>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import { inputValidation, selectValidation } from "../../tools";

const storagekey = "new-service";

export default {
  name: "ServicesEdit",
  components: { LayoutContent },
  fetch() {
    const sellingTypes = () => {
      return this.$axios.get("/services/selling-types");
    };

    Promise.all([sellingTypes()])
      .then((res) => {
        const [sellingTypes] = res;
        this.sellingTypes = sellingTypes.data.types;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message;
      });

    const stored = localStorage.getItem(storagekey);
    if (stored) {
      this.$confirm(
        "¿Existe informacion guardada previamente, deseas recuperarla?",
        "Autoguardado",
        {
          confirmButtonText: "Si, porfavor",
          cancelButtonText: "No, gracias",
          type: "info",
          closeOnClickModal: false,
          closeOnPressEscape: false,
        }
      )
        .then(() => {
          this.servicesNewForm = JSON.parse(stored);
        })
        .catch(() => {
          localStorage.removeItem(storagekey);
        });
    }
  },
  fetchOnServer: false,
  data() {
    return {
      sellingTypes: [],
      servicesNewForm: {
        name: "",
        cost: "",
        sellingType: "",
        description: "",
      },
      servicesNewFormRules: {
        name: inputValidation(true, 5, 60),
        cost: inputValidation(true, 0),
        sellingType: selectValidation(true),
        description: inputValidation(false, 5),
      },
    };
  },
  methods: {
    setStorage(servicesNewForm) {
      localStorage.setItem(storagekey, JSON.stringify(servicesNewForm));
    },
    submitNewService(formName, { name, cost, sellingType, description }) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$confirm(
          "¿Estás seguro que deseas guardar este nuevo servicio?",
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
                  .post("/services", {
                    name,
                    cost,
                    sellingType,
                    description,
                  })
                  .then((res) => {
                    this.$notify.success({
                      title: "Exito",
                      message: res.data.message,
                    });
                    setTimeout(() => {
                      this.$confirm(
                        "¿Deseas crear un nuevo servicio?",
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
                          this.$router.push("/services");
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
                    localStorage.removeItem(storagekey);
                    done();
                  });
              } else {
                done();
              }
            },
          }
        );
      });
    },
    cancel() {
      const stored = localStorage.getItem(storagekey);
      this.$confirm(
        `¿Estás seguro que deseas salir?. ${
          stored ? "Se perderá el avance realizado." : ""
        }`,
        "Confirmación",
        {
          confirmButtonText: "Si, salir",
          cancelButtonText: "Cancelar",
          type: "warning",
        }
      ).then(() => {
        localStorage.removeItem(storagekey);
        this.$router.push("/services");
      });
    },
  },
};
</script>

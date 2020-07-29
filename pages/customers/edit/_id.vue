<template>
  <layout-content
    page-title="Editar servicio"
    :breadcrumb="[
      { name: 'Servicios', to: '/services' },
      { name: 'Listado de servicios', to: '/services' },
      { name: 'Editar servicio', to: null },
    ]"
  >
    <el-form
      :model="servicesEditForm"
      :rules="servicesEditFormRules"
      status-icon
      ref="servicesEditForm"
      @submit.native.prevent="submitEditService('servicesEditForm', servicesEditForm)"
    >
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-6">
          <el-form-item label="Nombre del servicio" prop="name">
            <el-input
              ref="name"
              type="text"
              v-model="servicesEditForm.name"
              size="small"
              autocomplete="off"
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
              v-model="servicesEditForm.cost"
              size="small"
              autocomplete="off"
            />
          </el-form-item>
        </div>
        <div class="col-span-4">
          <el-form-item label="Tipo de venta" prop="sellingType">
            <el-radio-group ref="sellingType" v-model="servicesEditForm.sellingType" class="w-full">
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
            v-model="servicesEditForm.description"
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
import LayoutContent from "../../../components/layout/Content";
import { inputValidation, selectValidation } from "../../../tools";
export default {
  name: "ServicesEdit",
  components: { LayoutContent },
  fetch() {
    const sellingTypes = () => this.$axios.get("/services/selling-types");
    const service = () => this.$axios.get(`/services/${this.$route.params.id}`);

    Promise.all([sellingTypes(), service()])
      .then((res) => {
        const [sellingTypes, service] = res;
        this.sellingTypes = sellingTypes.data.types;
        this.servicesEditForm = {
          ...service.data.service,
          sellingType: service.data.service.sellingType.id,
        };
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message;
      });
  },
  fetchOnServer: false,
  data() {
    return {
      sellingTypes: [],
      servicesEditForm: {
        name: "",
        cost: "",
        sellingType: "",
        description: "",
      },
      servicesEditFormRules: {
        name: inputValidation(true, 5, 60),
        cost: inputValidation(true, 0),
        sellingType: selectValidation(true),
        description: inputValidation(false, 5),
      },
    };
  },
  methods: {
    submitEditService(formName, { name, cost, sellingType, description }) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$confirm(
          "¿Estás seguro que deseas actualizar este servicio?",
          "Confirmación",
          {
            confirmButtonText: "Si, actualizar",
            cancelButtonText: "Cancelar",
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "Procesando...";
                this.$axios
                  .put(`/services/${this.$route.params.id}`, {
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
                    this.$router.push("/services");
                  })
                  .catch((err) => {
                    this.$notify.error({
                      title: "Error",
                      message: err.response.data.message,
                    });
                  })
                  .then((alw) => {
                    instance.confirmButtonLoading = false;
                    instance.confirmButtonText = "Si, actualizar";
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
      this.$confirm("¿Estás seguro que deseas salir?", "Confirmación", {
        confirmButtonText: "Si, salir",
        cancelButtonText: "Cancelar",
        type: "warning",
      }).then(() => {
        this.$router.push("/services");
      });
    },
  },
};
</script>

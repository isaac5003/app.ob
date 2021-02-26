<template>
  <layout-content
    v-loading="pageloading"
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
      @submit.native.prevent="
        submitNewService('servicesNewForm', servicesNewForm)
      "
    >
      <div class="grid grid-cols-12 gap-4">
        <el-form-item
          label="Nombre del servicio"
          prop="name"
          class="col-span-8"
        >
          <el-input
            ref="name"
            type="text"
            v-model="servicesNewForm.name"
            size="small"
            autocomplete="off"
            @change="setStorage(servicesNewForm)"
            maxlength="60"
            minlength="5"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="Costo" prop="cost" class="col-span-2">
          <el-input-number
            ref="cost"
            type="number"
            :min="0.01"
            :step="0.01"
            v-model="servicesNewForm.cost"
            size="small"
            autocomplete="off"
            @change="setStorage(servicesNewForm)"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item class="col-span-2 pt-4" prop="incRenta">
          <el-checkbox
            v-model="servicesNewForm.incRenta"
            size="small"
            class="w-full"
            label="Desc. 10% Renta"
            border
          />
        </el-form-item>
      </div>
      <div class="grid grid-cols-12 gap-4">
        <el-form-item
          label="Tipo de venta"
          prop="sellingType"
          class="col-span-5"
        >
          <el-radio-group
            ref="sellingType"
            v-model="servicesNewForm.sellingType"
            class="w-full"
            @change="setStorage(servicesNewForm)"
          >
            <el-row :gutter="15">
              <el-col :span="8" v-for="(s, k) in sellingTypes" :key="k">
                <el-radio :label="s.id" border class="w-full" size="small">
                  {{ s.name }}
                </el-radio>
              </el-col>
            </el-row>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="col-span-2 pt-4" prop="incIva">
          <el-checkbox
            size="small"
            class="w-full"
            label="Inc. IVA"
            border
            v-model="servicesNewForm.incIva"
            :disabled="servicesNewForm.sellingType !== 3"
          />
        </el-form-item>
      </div>
      <el-form-item label="Descripción del servicio" prop="description">
        <el-input
          ref="description"
          type="textarea"
          :rows="4"
          v-model="servicesNewForm.description"
          @change="setStorage(servicesNewForm)"
          minlength="5"
          maxlength="5000"
          show-word-limit
          class="mt-1"
        />
      </el-form-item>
      <div class="flex justify-end">
        <el-button type="primary" size="small" native-type="submit"
          >Guardar</el-button
        >
        <el-button size="small" @click="$router.push('/services')"
          >Cancelar</el-button
        >
      </div>
    </el-form>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import {
  checkBeforeEnter,
  checkBeforeLeave,
  inputValidation,
  selectValidation,
} from "../../tools";

const storagekey = "new-service";

export default {
  name: "ServicesEdit",
  head: {
    titleTemplate: `%s | Nuevo servicio`,
  },
  components: { LayoutContent },
  fetch() {
    const sellingTypes = () => this.$axios.get("/services/selling-types");

    Promise.all([sellingTypes()])
      .then((res) => {
        const [sellingTypes] = res;
        this.sellingTypes = sellingTypes.data.types;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message;
      })
      .then((alw) => (this.pageloading = false));

    checkBeforeEnter(this, storagekey, "servicesNewForm");
  },
  fetchOnServer: false,
  beforeRouteLeave(to, from, next) {
    checkBeforeLeave(this, storagekey, next);
  },
  data() {
    return {
      pageloading: true,
      sellingTypes: [],
      servicesNewForm: {
        name: "",
        cost: "",
        sellingType: 3,
        description: "",
        incIva: false,
        incRenta: false,
      },
      servicesNewFormRules: {
        name: inputValidation(true, 5, 60),
        cost: inputValidation(true, 0, null, "number"),
        sellingType: selectValidation(true),
        description: inputValidation(false, 5),
      },
    };
  },
  methods: {
    setStorage(servicesNewForm) {
      localStorage.setItem(storagekey, JSON.stringify(servicesNewForm));
    },
    submitNewService(
      formName,
      { name, cost, sellingType, description, incIva, incRenta }
    ) {
      console.log(sellingType);
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
                    incIva,
                    incRenta,
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
  },
  watch: {
    "servicesNewForm.name": function (val, oldVal) {
      this.servicesNewForm.description = val;
    },
  },
};
</script>

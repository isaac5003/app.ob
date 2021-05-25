<template>
  <layout-content
    v-loading="pageloading"
    page-title="Editar servicio"
    :breadcrumb="[
      { name: 'Servicios', to: '/services' },
      { name: 'Editar servicio', to: null },
    ]"
  >
    <el-form
      :model="servicesEditForm"
      :rules="servicesEditFormRules"
      status-icon
      ref="servicesEditForm"
      @submit.native.prevent="
        submitEditService('servicesEditForm', servicesEditForm)
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
            v-model="servicesEditForm.name"
            size="small"
            autocomplete="off"
            minlength="5"
            maxlength="60"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="Costo" prop="cost" class="col-span-2">
          <el-input-number
            ref="cost"
            type="number"
            :min="0.01"
            :step="0.01"
            v-model="servicesEditForm.cost"
            size="small"
            autocomplete="off"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item class="col-span-2 pt-4" prop="incRenta">
          <el-checkbox
            v-model="servicesEditForm.incRenta"
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
            v-model="servicesEditForm.sellingType"
            class="w-full"
            @change="changeIva(servicesEditForm.sellingType)"
          >
            <el-row :gutter="15">
              <el-col :span="8" v-for="(s, k) in sellingTypes" :key="k">
                <el-radio :label="s.id" border class="w-full" size="small">{{
                  s.name
                }}</el-radio>
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
            v-model="servicesEditForm.incIva"
            :disabled="servicesEditForm.sellingType !== 3"
          />
        </el-form-item>
      </div>
      <el-form-item label="Descripción del servicio" prop="description">
        <el-input
          ref="description"
          type="textarea"
          :rows="4"
          v-model="servicesEditForm.description"
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

const storagekey = "edit-service";

export default {
  name: "ServicesEdit",
  head: {
    titleTemplate: `%s | Editar servicio`,
  },
  components: { LayoutContent },
  fetch() {
    const sellingTypes = () => this.$axios.get("/services/selling-types");
    const service = () => this.$axios.get(`/services/${this.$route.query.ref}`);

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
      servicesEditForm: {
        name: "",
        cost: "",
        sellingType: "",
        description: "",
        incIva: false,
        incRenta: false,
      },
      servicesEditFormRules: {
        name: inputValidation(true, 5, 60),
        cost: inputValidation(true, 0, null, "number"),
        sellingType: selectValidation(true),
        description: inputValidation(false, 5),
      },
    };
  },
  methods: {
    submitEditService(
      formName,
      { name, cost, sellingType, description, incIva, incRenta }
    ) {
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
                  .put(`/services/${this.$route.query.ref}`, {
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
    changeIva(sellingTypeValue) {
      if (sellingTypeValue !== 3) {
        this.servicesEditForm.incIva = false;
      } else {
        this.servicesEditForm.incIva = false;
      }
    },
  },
};
</script>

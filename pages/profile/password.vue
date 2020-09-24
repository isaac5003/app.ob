<template>
  <layout-content
    page-title="Cambiar contraseña"
    :breadcrumb="[
      { name: 'Perfil', to: '/profile' },
      { name: 'Cambiar contraseña', to: null },
    ]"
  >
    <el-form
      label-position="top"
      class="flex flex-col bg-white w-full p-5 border rounded"
      status-icon
      :model="form"
      :rules="rules"
      ref="form"
      @submit.native.prevent="changePassword('form', form)"
    >
      <div class="w-1/2">
        <el-form-item label="Contraseña actual" prop="currentPassword">
          <el-input
            type="password"
            v-model="form.currentPassword"
            size="small"
          />
        </el-form-item>
      </div>
      <div class="w-1/2">
        <el-form-item label="Nueva contraseña" prop="newPassword">
          <el-input type="password" v-model="form.newPassword" size="small" />
        </el-form-item>
      </div>
      <div class="w-1/2">
        <el-form-item label="Confirmar contraseña" prop="confirmPassword">
          <el-input
            type="password"
            v-model="form.confirmPassword"
            size="small"
          />
        </el-form-item>
      </div>
      <div class="flex justify-end">
        <el-button type="primary" native-type="submit" size="small"
          >Guardar</el-button
        >
        <el-button size="small" @click="close">Cancelar</el-button>
      </div>
    </el-form>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import { inputValidation } from "../../tools";
export default {
  name: "Password",
  components: { LayoutContent },
  data() {
    return {
      form: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      rules: {
        currentPassword: inputValidation(true),
        newPassword: inputValidation(true, 8),
        confirmPassword: inputValidation(true, 8),
      },
    };
  },
  methods: {
    changePassword(
      formName,
      { currentPassword, newPassword, confirmPassword }
    ) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        }

        if (newPassword != confirmPassword) {
          this.$notify.error({
            title: "Error",
            message: "La nueva contraseña y la confirmación no coinciden.",
          });
        }
        this.$confirm(
          "¿Estás seguro que deseas actualizar tu contraseña?",
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
                  .put("/auth/password", { currentPassword, newPassword })
                  .then(async (res) => {
                    this.$notify.success({
                      title: "Error",
                      message: res.data.message,
                    });
                    const { data } = await this.$axios.get("/auth/user");
                    this.$auth.setUser(data.user);
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
              }
              done();
            },
          }
        );
      });
    },
    close() {
      this.$confirm(
        "¿Estás seguro que deseas salir de esta pantalla?",
        "Confirmación",
        {
          confirmButtonText: "Si, porfavor",
          cancelButtonText: "Cancelar",
          type: "warning",
        }
      )
        .then(() => {
          this.$router.push("/");
        })
        .catch(() => {});
    },
  },
};
</script>

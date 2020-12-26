<template>
  <div class="flex w-screen h-screen font-body">
    <div class="w-1/2 flex items-center justify-center">
      <el-form
        class="w-90 flex flex-col space-y-12"
        @submit.native.prevent="processLogin(email, password)"
      >
        <div class="flex items-center justify-center h-15">
          <img
            class="h-full"
            src="./../../assets/images/logo_h_black.png"
            alt="Openbox Cloud"
          />
        </div>
        <span
          class="flex w-full justify-center text-2xl font-semibold text-gray-900"
          >Iniciar sesión</span
        >
        <el-alert
          :title="errorMessage"
          type="error"
          show-icon
          :closable="false"
          v-if="errorMessage"
        />
        <div class="flex flex-col text-sm">
          <input
            class="w-full py-2 focus:outline-none border-b"
            placeholder="Correo"
            type="email"
            v-model="email"
          />
          <input
            class="w-full py-2 focus:outline-none"
            placeholder="Contraseña"
            type="password"
            v-model="password"
          />
          <div class="flex items-center justify-end mt-10">
            <a href="javascript:" class="text-xs text-blue-900 hover:underline"
              >Olvidé mi contraseña</a
            >
          </div>
        </div>
        <div class="flex justify-center">
          <el-button
            class="w-52"
            type="primary"
            native-type="submit"
            :loading="loading"
            >Iniciar sesión</el-button
          >
        </div>
      </el-form>
    </div>
    <div
      class="w-1/2 flex items-center justify-center bg-blue-900 bg-no-repeat text-white"
      :style="{
        backgroundImage: `url(${require('./../../assets/images/backgrounds/bg_transparent.png')})`,
        backgroundSize: '150%',
      }"
    >
      <span class="w-125 text-justify">
        Openbox Cloud es un sistema de soporte para la gestión empresarial
        desarrollado por AP Technology, el cual permite a sus usuarios tener
        acceso a diferentes herramientas que le brindaran soporte en el dí­a a
        dí­a de sus operaciones o administración de personal y/o recursos. Para
        mayor información de lo que puedes hacer con Openbox Cloud haz
        <a href="javascript:;" class="border-b">clic Aquí</a>.
      </span>
    </div>
  </div>
</template>

<script>
export default {
  layout: "login",
  name: "Login",
  data() {
    return {
      loading: false,
      errorMessage: "",
      email: "",
      password: "",
    };
  },
  methods: {
    async processLogin(email, password) {
      this.errorMessage = "";
      if (email == "" || password == "") {
        this.errorMessage = "Favor ingresar correo y contraseña.";
        return false;
      }
      this.loading = true;
      try {
        let response = await this.$auth.loginWith("local", {
          data: { email, password },
        });
        this.$router.push("/");
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
      this.loading = false;
    },
  },
};
</script>

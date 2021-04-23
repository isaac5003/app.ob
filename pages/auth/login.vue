<template>
  <div class="flex w-screen h-screen font-body">
    <!-- Dialogo para Nueva pass -->
    <el-dialog
      title="Confirmar nueva contraseña"
      :visible.sync="showConfirmPassword"
      :append-to-body="false"
      :close-on-click-modal="false"
      width="500px"
    >
      <notification
        class="-mt-4"
        type="info"
        title="Atención"
        message="Ingresa y confirma tu nueva contraseña"
      />
      <div class="flex flex-col">
        <el-form>
          <div class="grid grid-cols-12 mt-2">
            <el-form-item class="col-span-12" label="Nueva contraseña:">
              <el-input
                v-model="recoverPasswor1"
                show-password
                size="small"
                class="w-full"
                type="password"
                placeholder="********"
              ></el-input>
            </el-form-item>
            <el-form-item class="col-span-12" label="Confirmar contraseña:">
              <el-input
                v-model="recoverPasswor2"
                show-password
                size="small"
                class="w-full"
                type="password"
                placeholder="********"
              ></el-input>
            </el-form-item>
          </div>

          <div class="flex flex-row justify-end">
            <el-button size="small" type="primary">Guardar</el-button>
            <el-button size="small" @click="showConfirmPassword = false"
              >Cancelar</el-button
            >
          </div>
        </el-form>
      </div>
    </el-dialog>
    <!-- Dialogo para recuperar contrase;a -->
    <el-dialog
      title="Recuperar contraseña"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="500px"
      :visible.sync="showRecoveryPassword"
    >
      <notification
        class="w-full -mt-4"
        type="info"
        title="Atención"
        message="Ingresa el correo electrónico que tienes registrado con
                 Openbox Cloud y te enviaremos un vinculo para que puedas
                ingresar tu nueva contraseña”"
      />
      <div class="flex flex-col">
        <el-form>
          <div class="grid grid-cols-12 gap-4 mt-2">
            <el-form-item class="col-span-12" label="Introduzca el correo:">
              <el-input
                v-model="recoverEmail"
                size="small"
                class="w-full"
                type="email"
                placeholder="correo@openbox.cloud"
              ></el-input>
            </el-form-item>
          </div>

          <div class="flex flex-row justify-end">
            <el-button size="small" type="primary">Recuperar</el-button>
            <el-button size="small" @click="showRecoveryPassword = false"
              >Cancelar</el-button
            >
          </div>
        </el-form>
      </div>
    </el-dialog>
    <div class="w-1/2 flex items-center justify-center">
      <el-form
        class="w-90 flex flex-col space-y-12"
        @submit.native.prevent="processLogin(email, password, trust)"
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
            show-password
          />
          <div class="flex items-center justify-between mt-10">
            <template>
              <!-- `checked` debe ser true o false -->
              <el-checkbox v-model="trust">
                <span class="text-xs"> Recuerdame </span>
              </el-checkbox>
            </template>
            <div class="flex items-center">
              <a
                href="javascript:"
                class="text-xs text-blue-900 hover:underline"
                @click="showRecoveryPassword = true"
                >Olvidé mi contraseña</a
              >
            </div>
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
import Notification from "../../components/Notification";
export default {
  components: { Notification },
  layout: "login",
  name: "Login",
  fetch() {
    this.showConfirmPassword = this.$route.query.resetToken ? true : false;
  },
  data() {
    return {
      loading: false,
      errorMessage: "",
      email: "",
      recoverEmail: "",
      password: "",
      recoverPasswor1: "",
      recoverPasswor2: "",
      trust: false,
      showRecoveryPassword: false,
      showConfirmPassword: false,
    };
  },
  methods: {
    async processLogin(email, password, trust) {
      this.errorMessage = "";
      if (email == "" || password == "") {
        this.errorMessage = "Favor ingresar correo y contraseña.";
        return false;
      }
      this.loading = true;
      try {
        let response = await this.$auth.loginWith("local", {
          data: { email, password, trust },
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

<template>
  <nav class="flex flex-col items-center justify-between bg-blue-900 w-14 py-4">
    <div class="flex flex-col items-center space-y-5">
      <nuxt-link to="/" tag="div" class="h-9 w-9 cursor-pointer">
        <img
          src="data:image/png;base64,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"
          alt
        />
      </nuxt-link>
      <el-tooltip
        class="item"
        effect="dark"
        :open-delay="1000"
        :content="`${$auth.user.workspace.company.name} | ${$auth.user.workspace.branch.name}`"
        placement="right"
      >
        <el-popover
          placement="left"
          width="350"
          trigger="click"
          @show="
            changeWorkSpace = {
              cid: $auth.user.workspace.company.id,
              bid: $auth.user.workspace.branch.id,
            }
          "
        >
          <el-form
            :model="changeWorkSpace"
            :rules="changeWorkSpaceRules"
            status-icon
            ref="changeWorkSpace"
            @submit.native.prevent="
              updateWorkSpace('changeWorkSpace', changeWorkSpace)
            "
            class="font-body"
          >
            <div class="mb-2">
              <span>Cambiar espacio de trabajo</span>
            </div>
            <el-form-item label="Empresa" prop="cid">
              <el-select
                v-model="changeWorkSpace.cid"
                placeholder="Seleccionar empresa"
                size="small"
                class="w-full"
                filterable
                default-first-option
                @change="changeWorkSpace.bid = ''"
              >
                <el-option
                  v-for="company in companies"
                  :key="company.id"
                  :label="company.name"
                  :value="company.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Sucursal" prop="bid">
              <el-select
                clearable
                v-model="changeWorkSpace.bid"
                placeholder="Seleccionar sucursal"
                size="small"
                class="w-full"
                filterable
                default-first-option
              >
                <el-option
                  v-for="branch in branches"
                  :key="branch.id"
                  :label="branch.name"
                  :value="branch.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button
              type="primary"
              size="small"
              native-type="submit"
              class="w-full"
              >Cambiar</el-button
            >
          </el-form>
          <div
            slot="reference"
            class="flex items-center justify-center rounded-full w-9 h-9 bg-gray-100 cursor-pointer"
          >
            <span
              class="text-gray-900 font-bold text-lg uppercase tracking-tight leading-none"
              >{{ initials }}</span
            >
          </div>
        </el-popover>
      </el-tooltip>
      <ul class="flex flex-col space-y-3 w-10 z-10">
        <nuxt-link
          v-for="(item, k) of modules"
          :key="k"
          tag="li"
          :to="item.path"
          active-class="text-blue-900 bg-yellow-500"
          :exact="item.exact"
          class="group flex items-center rounded text-white h-10 w-10 cursor-pointer space-x-4 p-2 transition transform duration-300 hover:w-50 hover:text-blue-900 hover:bg-yellow-500 hover:shadow-md"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            stroke="currentColor"
            v-html="item.icon"
          />
          <span class="hidden group-hover:block">{{ item.name }}</span>
        </nuxt-link>
      </ul>
    </div>
    <div class="flex flex-col items-center space-y-2">
      <el-tooltip
        class="item"
        effect="dark"
        content="Mi Empresa"
        placement="right"
        v-if="$auth.user.profile.admin"
      >
        <nuxt-link
          to="/business"
          tag="div"
          class="w-8 h-8 border-2 bg-blue-100 rounded-full cursor-pointer text-blue-900 flex items-center justify-center"
          active-class="border-yellow-500"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            ></path>
          </svg>
        </nuxt-link>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        :content="`${$auth.user.names} 
        ${$auth.user.lastnames}`"
        placement="right"
      >
        <nuxt-link
          to="/profile"
          tag="img"
          class="w-9 h-9 border-2 rounded-full cursor-pointer"
          active-class="border-yellow-500"
          :src="require('../../assets/images/main-avatar.png')"
          :alt="$auth.user.names"
        />
      </el-tooltip>
    </div>
  </nav>
</template>

<script>
import { getIcon, selectValidation } from "../../tools";

export default {
  name: "Menu",
  data() {
    return {
      items: [
        {
          always: true,
          id: "",
          path: "/",
          name: "Escritorio",
          icon: getIcon("desktop"),
          exact: true,
        },
        {
          always: false,
          id: "0f88f2ea-aae9-44ad-8df0-0ee3debbf167",
          path: "/services",
          name: "Servicios",
          icon: getIcon("duplicate"),
          exact: false,
        },
        {
          always: false,
          id: "9ff0b6f4-9c58-475b-b2dd-5eea6d7b66aa",
          path: "/customers",
          name: "Clientes",
          icon: getIcon("users"),
          exact: false,
        },
        {
          always: false,
          id: "cfb8addb-541b-482f-8fa1-dfe5db03fdf4",
          path: "/invoices",
          name: "Ventas",
          icon: getIcon("dolar"),
          exact: false,
        },
        {
          always: false,
          id: "a98b98e6-b2d5-42a3-853d-9516f64eade8",
          path: "/entries",
          name: "Contabilidad",
          icon: getIcon("cash"),
          exact: false,
        },
        {
          always: false,
          id: "a98b98e6-b2d5-42a3-853d-9516f64eade8",
          path: "/chargeAccounts",
          name: "Cuentas por cobrar",
          icon: getIcon("clipboard-list"),
          exact: false,
        },
      ],
      changeWorkSpace: {
        cid: "",
        bid: "",
      },
      changeWorkSpaceRules: {
        cid: selectValidation(true),
        bid: selectValidation(true),
      },
    };
  },
  methods: {
    updateWorkSpace(formName, { cid, bid }) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        }
        this.$confirm(
          "¿Estás seguro que deseas cambiar de espacio de trabajo?",
          "Confirmación",
          {
            confirmButtonText: "Si, cambiar",
            cancelButtonText: "Cancelar",
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "Procesando...";
                const loading = this.$loading({
                  lock: true,
                  text: "Cambiando espacio de trabajo...",
                  spinner: "el-icon-loading",
                  background: "rgba(255, 255, 255, 0.8)",
                  customClass: "text-3xl",
                });

                setTimeout(() => {
                  this.$axios
                    .put("/auth/update-workspace", { cid, bid })
                    .then((res) => {
                      this.$router.push("/");
                      this.$auth.setUserToken(res.data.access_token);

                      this.$notify.success({
                        title: "Éxito",
                        message:
                          "Se ha cambiado de espacio de trabajo correctamente.",
                      });
                    })
                    .catch((err) => {
                      this.$notify.error({
                        title: "Error",
                        message: err.response.data.message,
                      });
                    })

                    .then((alw) => {
                      instance.confirmButtonLoading = false;
                      instance.confirmButtonText = "Si, cambiar";

                      done();
                    });

                  loading.close();
                }, 2000);
              }
              done();
            },
          }
        );
      });
    },
  },
  computed: {
    companies() {
      return this.$auth.user.profile.access.map((a) => {
        return {
          id: a.id,
          name: a.name,
        };
      });
    },
    branches() {
      if (this.changeWorkSpace.cid != "") {
        const company = this.$auth.user.profile.access.find(
          (a) => a.id == this.changeWorkSpace.cid
        );
        return company.branches;
      } else {
        return [];
      }
    },
    initials() {
      return this.$store.state.auth.user.workspace.company.name.slice(0, 2);
    },
    modules() {
      const company = this.$auth.user.profile.access.find(
        (a) => a.id == this.$auth.user.workspace.company.id
      );
      const branch = company.branches.find(
        (b) => b.id == this.$auth.user.workspace.branch.id
      );
      return this.items.filter(
        (item) =>
          item.always || branch.modules.map((m) => m.id).includes(item.id)
      );
    },
  },
};
</script>

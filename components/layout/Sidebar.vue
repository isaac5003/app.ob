<template>
  <div
    class="flex flex-col justify-end items-center w-11 bg-white border-l py-4"
  >
    <el-tooltip
      class="item"
      effect="dark"
      content="Cerrar sesión"
      placement="left"
    >
      <div
        class="flex items-center justify-center w-7 h-7 rounded-full bg-blue-900 cursor-pointer"
        @click="logout()"
      >
        <svg class="w-4 h-4 fill-current text-white" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  methods: {
    logout() {
      this.$confirm("¿Estás seguro que deseas cerrar sesión?", "Confirmación", {
        confirmButtonText: "Cerrar sesión",
        cancelButtonText: "Cancelar",
        type: "warning",
      }).then(() => {
        this.$auth.logout();
      });
    },
  },
};
</script>

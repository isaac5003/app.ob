<template>
  <layout-content
    page-title="Mi perfil"
    :breadcrumb="[
      { name: 'Perfil', to: '/profile' },
      { name: 'Mi perfil', to: null },
    ]"
  >
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-9 space-y-1">
        <span class="uppercase">Detalles de usuario</span>
        <el-form
          label-position="top"
          class="bg-white w-full p-4 border rounded"
        >
          <div class="grid grid-cols-12 gap-4">
            <el-form-item label="Nombres" class="col-span-6">
              <el-input :value="$auth.user.names" size="small" readonly />
            </el-form-item>
            <el-form-item label="Apellidos" class="col-span-6">
              <el-input :value="$auth.user.lastnames" size="small" readonly />
            </el-form-item>
          </div>
          <div class="grid grid-cols-12 gap-4">
            <el-form-item label="Correo" class="col-span-6">
              <el-input :value="$auth.user.email" size="small" readonly />
            </el-form-item>
            <el-form-item label="Perfil" class="col-span-6">
              <el-input
                :value="$auth.user.profile.name"
                size="small"
                readonly
              />
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="col-span-3 space-y-1">
        <span class="uppercase">Información de soporte</span>
        <el-form
          label-position="top"
          class="bg-white w-full p-4 border rounded"
        >
          <el-form-item label="Código de empresa">
            <el-input
              :value="$auth.user.workspace.company.unique"
              size="small"
              readonly
            />
          </el-form-item>
          <el-form-item label="Código de usuario">
            <el-input :value="$auth.user.unique" size="small" readonly />
          </el-form-item>
        </el-form>
      </div>
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
export default {
  name: "ProfileIndex",
  head: {
    titleTemplate: `%s | Mi perfil`,
  },
  components: { LayoutContent },
};
</script>

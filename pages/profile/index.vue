<template>
  <layout-content
    page-title="Mi perfil"
    :breadcrumb="[
      { name: 'Perfil', to: '/profile' },
      { name: 'Mi Perfil', to: null },
    ]"
  >
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-9">
        <div class="space-y-1">
          <span class="uppercase">Detalles de usuario</span>
          <el-form
            label-position="top"
            class="bg-white w-full p-5 border rounded"
          >
            <el-row :gutter="15">
              <el-col :span="12">
                <el-form-item label="Nombres">
                  <el-input :value="$auth.user.names" size="small" readonly />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Apellidos">
                  <el-input
                    :value="$auth.user.lastnames"
                    size="small"
                    readonly
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="8">
                <el-form-item label="Correo">
                  <el-input :value="$auth.user.email" size="small" readonly />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Perfil">
                  <el-input
                    :value="$auth.user.profile.name"
                    size="small"
                    readonly
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="col-span-3">
        <div class="space-y-1">
          <span class="uppercase">Información de soporte</span>
          <el-form
            label-position="top"
            class="bg-white w-full p-5 border rounded"
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
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
export default {
  name: "ProfileIndex",
  components: { LayoutContent },
};
</script>

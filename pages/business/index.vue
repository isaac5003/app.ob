<template>
  <layout-content
    v-loading="loading"
    page-title="Detalles"
    :breadcrumb="[
      { name: 'Mi Negocio', to: null },
      { name: 'Detalles', to: null },
    ]"
  >
    <div class="space-y-4">
      <div class="space-y-1">
        <span class="uppercase">información general</span>
        <el-form
          label-position="top"
          class="bg-white w-full p-5 border rounded"
        >
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-7">
              <el-form-item label="Razón social / Nombre">
                <el-input
                  :value="business ? business.general.name : ''"
                  size="small"
                  readonly
                />
              </el-form-item>
            </div>
            <div class="col-span-5">
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-7">
                  <el-form-item label="Identificador">
                    <el-input
                      :value="business ? business.general.shortName : ''"
                      size="small"
                      readonly
                    />
                  </el-form-item>
                </div>
                <div class="col-span-5">
                  <el-form-item label="Provee outsourcing">
                    <el-radio-group
                      disabled
                      :value="business ? business.general.outsourcer : ''"
                    >
                      <el-radio :label="true">SI</el-radio>
                      <el-radio :label="false">NO</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-4">
              <el-form-item label="Tipo de negocio">
                <el-input
                  :value="business ? business.general.companyType.name : ''"
                  size="small"
                  readonly
                />
              </el-form-item>
            </div>
            <div class="col-span-4">
              <el-form-item label="Tipo de contribuyente">
                <el-input
                  :value="
                    business && business.general.taxerType
                      ? business.general.taxerType.name
                      : ''
                  "
                  size="small"
                  readonly
                />
              </el-form-item>
            </div>
            <div class="col-span-4">
              <el-form-item label="Tipo de persona natural">
                <el-input
                  :value="
                    business && business.general.naturalType
                      ? business.general.naturalType.name
                      : ''
                  "
                  size="small"
                  readonly
                />
              </el-form-item>
            </div>
          </div>
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-2">
              <el-form-item label="DUI">
                <el-input
                  :value="business ? business.general.dui : ''"
                  size="small"
                  readonly
                />
              </el-form-item>
            </div>
            <div class="col-span-5">
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-4">
                  <el-form-item label="NRC">
                    <el-input
                      :value="business ? business.general.nrc : ''"
                      size="small"
                      readonly
                    />
                  </el-form-item>
                </div>
                <div class="col-span-8">
                  <el-form-item label="NIT">
                    <el-input
                      :value="business ? business.general.nit : ''"
                      size="small"
                      readonly
                    />
                  </el-form-item>
                </div>
              </div>
            </div>
            <div class="col-span-5">
              <el-form-item label="Giro">
                <el-input
                  :value="business ? business.general.giro : ''"
                  size="small"
                  readonly
                />
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <div class="space-y-1">
        <div class="flex items-end space-x-2">
          <span class="uppercase">usuarios</span>
          <span class="text-xs">Utilizados: 2, Disponibles: 0</span>
        </div>
        <div class="bg-white w-full p-5 border rounded">
          <el-table :data="business ? business.users : []" stripe size="mini">
            <el-table-column prop="index" min-width="40" />
            <el-table-column label="Nombres" prop="names" min-width="150" />
            <el-table-column
              label="Apellidos"
              prop="lastnames"
              min-width="150"
            />
            <el-table-column
              label="Perfil"
              prop="profile.name"
              min-width="120"
            />
            <el-table-column
              label="Administrador"
              min-width="120"
              align="center"
            >
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  type="success"
                  v-if="scope.row.profile.admin"
                  >SI</el-tag
                >
                <el-tag size="small" type="danger" v-else>NO</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Correo" prop="email" min-width="175" />
            <el-table-column label="Estado" min-width="90" align="center">
              <template slot-scope="scope">
                <el-tag size="small" type="success" v-if="scope.row.isActive"
                  >Activo</el-tag
                >
                <el-tag size="small" type="warning" v-else>Inactivo</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="Creado el"
              prop="createdAt"
              min-width="90"
            />
          </el-table>
        </div>
      </div>
      <div class="space-y-1">
        <span class="uppercase">modulos</span>
        <div class="bg-white w-full p-5 border rounded">
          <el-table :data="business ? business.modules : []" stripe size="mini">
            <el-table-column prop="index" min-width="40" />
            <el-table-column label="Nombre" prop="name" min-width="150" />
            <el-table-column
              label="Descripción"
              prop="description"
              min-width="500"
            />
          </el-table>
        </div>
      </div>
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
export default {
  name: "BusinessIndex",
  middleware: "admin",
  components: { LayoutContent },
  fetch() {
    const business = () => {
      return this.$axios.get("/business/info");
    };

    Promise.all([business()])
      .then((res) => {
        const [business] = res;
        this.business = business.data;
        this.loading = false;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message;
      });
  },
  fetchOnServer: false,
  data() {
    return {
      loading: true,
      business: null,
    };
  },
};
</script>

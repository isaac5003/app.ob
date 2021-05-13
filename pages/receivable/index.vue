<template>
  <layout-content page-title="listado de cuentas por cobrar" :breadcrumb="[
      { name: 'Cuentas por pagar', to: '/receivable' },
      { name: 'Listado', to: null },
    ]">
    <!-- dialogo -->
    <el-dialog title="Bitácora" :visible.sync="showReceivable" width="1000px" :append-to-body="true"
      :close-on-click-modal="false">
      <div class="flex flex-col space-y-4">
        <div class="grid grid-cols-12 gap-4 text-xs">
          <div class="col-span-3 flex flex-col">
            <span class="font-semibold">Cliente</span><span>ORTIZ ROSALES, INES MARIA</span>
          </div>
          <div class="col-span-2 flex flex-col">
            <span class="font-semibold">Nº de documento</span><span>16SD000F-56</span>
          </div>
          <div class="col-span-2 flex flex-col">
            <span class="font-semibold">Tipo</span><span>Consumidor Final</span>
          </div>
          <div class="col-span-2 flex flex-col">
            <span class="font-semibold">Fecha</span><span>05/04/2021</span>
          </div>
          <div class="col-span-2 flex flex-col">
            <span class="font-semibold">Condicion de pago</span><span>Pago 90 dias</span>
          </div>
          <div class="col-span-1 flex flex-col">
            <span class="font-semibold">Edad</span><span>45 Años</span>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-4">
            <h1 class="text-lg font-semi-bold">Últimos seguimientos</h1>
          </div>
          <div class="col-span-4 col-start-7 font-semibold text-xs">Por pagar:
            <el-tag type="success" effect="dark" size="mini">$ 367.50</el-tag>
          </div>
          <el-button class="col-span-2 col-start-11" size="mini" type="primary"
            @click.native="showReceivableFollowing = true">Nuevo seguimiento</el-button>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-4 flex flex-col text-xs space-y-4">
            <button v-for="item in following" :key="item.id" @click="getFollow(item.id)"
              class="flex justify-between p-3 rounded-md focus:outline-none border focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:bg-blue-100 cursor-pointer">
              <div class="flex items-center justify-center">
                <span class="font-semibold">{{ item.follow }}</span>
              </div>

              <div class="flex flex-col">
                <span class="font-semibold"> Fecha:</span>
                <span>{{ item.date }}</span>
              </div>
            </button>
          </div>
          <div class="col-span-8 border">
            <div class="grid grid-cols-8 px-6 py-4">
              <div class="flex justify-between col-span-8 text-xs">
                <span class="col-span-2 text-sm font-semibold">{{
                  follow.followName
                }}</span>
                <div class="col-span-3 flex flex-col"><span class="font-semibold">Seguimiento realizado por:</span>
                  <span class="text-xs">{{ follow.followerName }}</span></div>
                <div class="col-span-2 flex flex-col"><span class="font-semibold">Fecha:</span>
                  <span>{{ follow.date }}</span></div>
              </div>
            </div>
            <div class="grid grid-cols-8 mx-6 h-80 border text-xs">
              <p class="col-span-8 mx-4 mt-3">
                Resumen
                <br />
                <br />
                {{ follow.resume }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showReceivable = false" size="small">Cerrar</el-button>
      </span>
    </el-dialog>
    <!-- Nuevo seguimiento -->
    <el-dialog title="Nuevo seguimiento" :visible.sync="showReceivableFollowing" :append-to-body="true"
      :close-on-click-modal="false" width="1000px">
      <div class="flex flex-col space-y-2">
        <div class="grid grid-cols-12 gap-4">
          <span class="col-span-6">
            <div class="grid grid-cols-6">
              <span class="col-span-6 text-lg">Información de cuenta por cobrar</span>
            </div>
            <div class="grid grid-cols-6 gap-4 mt-4 text-xs">
              <span class="flex flex-col col-span-2"><span class="font-semibold">Nº de
                  documento</span><span>16SD000F</span></span>
              <span class="flex flex-col col-span-2">
                <span class="font-semibold">Fecha</span>
                <span>23/04/2021</span></span>
              <span class="flex flex-col col-span-2"><span class="font-semibold">Condición de pago</span>
                <span>23/04/2021</span></span>
            </div>
            <div class="grid grid-cols-6 gap-4 mt-3">
              <span class="flex flex-col col-span-2 text-xs"><span class="font-semibold">Tipo</span><span>Consumidor
                  final</span></span>
              <span class="flex flex-col col-span-2 text-xs"><span class="font-semibold">Edad</span><span>45
                  ago</span></span>
              <span class="flex flex-col col-span-2 text-xs">
                <span class="font-semibold">Por pagar</span><span>
                  <el-tag type="success" effect="dark" size="mini">$ 367.50</el-tag>
                </span></span>
            </div>
            <div class="grid grid-cols-6 mt-4">
              <span class="col-span-6 text-lg">Datos de contacto</span>
            </div>
            <div class="grid grid-cols-6 mt-4">
              <span class="flex flex-col col-span-3 text-xs"><span class="font-semibold">Cliente</span><span>ORTIZ
                  ROSALES, INES MARIA</span></span>
              <span class="flex flex-col col-span-3 text-xs"><span class="font-semibold">Dirección</span><span>Avenida 4
                  de mayo, col Buenos aires #105</span></span>
              <span class="flex flex-col col-span-3 text-xs">
                <span class="font-semibold">Teléfono</span><span class="">+503 7856-5681</span></span>
              <span class="flex flex-col col-span-3 text-xs"><span class="font-semibold">
                  Correo</span><span>openBox@preuba.cloud</span></span>
            </div>
            <div class="grid grid-cols-6 mt-4">
              <span class="col-span-6 text-lg">Información de cuenta por cobrar</span>
            </div>
            <div class="grid grid-cols-6 mt-4 border">
              <span class="flex justify-between col-span-6 px-3 py-3 text-xs">
                <span class="flex flex-col col-span-2"><span class="font-semibold">Tipo de documento</span><span>Credito
                    fiscal</span></span>
                <span class="flex flex-col col-span-2"><span class="font-semibold">Edad</span><span>45
                    Años</span></span>

                <span class="col-span-2">
                  <el-button type="primary" size="small">Ver</el-button>
                </span>
              </span>
            </div>
            <div class="grid grid-cols-6 mt-4 border">
              <span class="flex justify-between col-span-6 text-xs px-3 py-3">
                <span class="flex flex-col col-span-2"><span class="font-semibold">Tipo de
                    documento</span><span>Consumidor final</span></span>
                <span class="flex flex-col col-span-2"><span class="font-semibold">Edad</span><span>45
                    Años</span></span>

                <span class="col-span-2">
                  <el-button type="primary" size="small">Ver</el-button>
                </span>
              </span>
            </div>
          </span>

          <div class="col-span-6 border">
            <div class="grid grid-cols-6 px-6 py-4">
              <span class="flex justify-between col-span-8 text-xs">
                <span class="col-span-2 font-semibold">Añadir seguimiento #5</span>
                <span class="col-span-2"><span class="font-semibold">Fecha: </span><span>23/03/2021</span></span>
              </span>
            </div>
            <div class="grid grid-cols-6 mx-6 h-90 border">
              <p class="col-span-8 mx-4 mb-4 text-xs">
                <br />
                Resumen
                <br />
                <el-form>
                  <div class="grid grid-cols-6">
                    <el-form-item class="col-span-6">
                      <el-input type="textarea" :rows="5" placeholder="Escriba un resumen del contacto de cliente..."
                        class="w-full" maxlength="500" minlength="5" show-word-limit>
                      </el-input>
                    </el-form-item>
                  </div>
                </el-form>
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <el-button type="primary" size="small"> Guardar </el-button>
          <el-button size="small" @click.native="showReceivableFollowing = false">Cancelar</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- finish -->
    <div class="flex flex-col space-y-2">
      <el-form>
        <div class="grid grid-cols-12 gap-4">
          <el-form-item label="Cliente" class="col-span-3">
            <el-select class="w-full" size="small" clearable filterable>
              <el-option></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Tipo de documento" class="col-span-3">
            <el-select class="w-full" size="small" clearable filterable>
              <el-option></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Condiciones de pago" class="col-span-3">
            <el-select class="w-full" size="small" clearable filterable>
              <el-option></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="col-start-10 col-span-3 mt-3">
            <el-input suffix-icon="el-icon-search" placeholder="Buscar..." size="small" clearable />
          </el-form-item>
        </div>
      </el-form>
      <!-- tabla -->
      <el-table :data="tableData" stripe size="mini" ref="multipleTable" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="45" />
        <el-table-column prop="index" width="35" label=" #" />
        <el-table-column label="# Documento" prop="documento" width="140" sortable="custom">
        </el-table-column>
        <el-table-column label="Tipo" prop="tipo" width="130" sortable="custom">
        </el-table-column>
        <el-table-column label="Fecha" prop="fecha" width="90" sortable="custom" />
        <el-table-column label="Cliente" prop="cliente" min-width="200" sortable="custom" />
        <el-table-column label="Cond. de pago" prop="pago" width="140" sortable="custom">
        </el-table-column>
        <el-table-column label="Total" width="80" align="right" prop="total" sortable="custom">
        </el-table-column>
        <el-table-column label width="100" align="center">
          <!-- dropdpwn selecction -->
          <template slot="header" v-if="multipleSelection.length > 0">
            <el-dropdown trigger="click" szie="mini">
              <el-button type="primary" size="mini" class="group">
                <span class="hidden group-hover:inline">
                  {{ multipleSelection.length }} Filas</span>
                <i class="el-icon-more" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <i class="el-icon-view"></i>Vista previa
                </el-dropdown-item>
                <el-dropdown-item>
                  <i class="el-icon-printer"></i>Imprimir documento
                </el-dropdown-item>
                <el-dropdown-item :divided="true">
                  <i class="el-icon-refresh-left"></i> Revertir estados
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>

          <!-- dropdown 1 -->

          <template slot-scope="scope">
            <el-dropdown trigger="click" szie="mini">
              <el-button size="mini" icon="el-icon-more">
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="openPreviewReceivable(scope.row)">
                  <i class="el-icon-notebook-1"></i>Bitácora
                </el-dropdown-item>
                <el-dropdown-item @click.native="openPreviewReceivableFollowing(scope.row)">
                  <i class="el-icon-document-add"></i>Nuevo
                  seguimiento</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!-- pagination  -->
      <div class="flex justify-end">
        <el-pagination :current-page.sync="page.page" :page-sizes="[5, 10, 15, 25, 50, 100]" :page-size="page.size"
          layout="total, sizes, prev, pager, next" :total="parseInt(receivable.count)" :pager-count="5" />
      </div>
    </div>
  </layout-content>
</template>
<script>
  import LayoutContent from "../../components/layout/Content";
  export default {
    components: {
      LayoutContent,
    },

    fetch() {
      this.getFollow(this.indexFollow[0].id);
    },

    data() {
      return {
        showReceivable: false,
        showReceivableFollowing: false,
        receivablePreview: {},
        multipleSelection: [],
        following: [{
            id: 1,
            follow: "Seguimiento #5",
            date: "29/03/2021",
          },
          {
            id: 2,
            follow: "Seguimiento #4",
            date: "21/03/2021",
          },
          {
            id: 3,
            follow: "Seguimiento #3",
            date: "17/04/2021",
          },
          {
            id: 4,
            follow: "Seguimiento #2",
            date: "10/03/2021",
          },
          {
            id: 5,
            follow: "Seguimiento #1",
            date: "28/02/2021",
          },
        ],
        indexFollow: [{
            id: 1,
            followerName: "Andres Blanco",
            followName: "Seguimiento #5",
            date: "29/03/2021",
            resume: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
                quo mollitia fugiat explicabo nesciunt totam placeat laboriosam
                modi itaque consectetur vitae ab, eaque voluptatem id assumenda,
                porro, provident aut iure.

                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi,
                corrupti laboriosam earum dolor fuga quibusdam quis veniam.

                Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
                quo mollitia fugiat explicabo nesciunt totam placeat laboriosam
                modi itaque consectetur vitae ab, eaque voluptatem id assumenda,
                porro, provident aut iure.`,
          },
          {
            id: 2,
            followerName: "Bryan",
            followName: "Seguimiento #4",
            date: "21/03/2021",
            resume: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
                quo mollitia fugiat explicabo nesciunt totam placeat laboriosam
                modi itaque consectetur vitae ab, eaque voluptatem id assumenda,
                porro, provident aut iure.

                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi,
                corrupti laboriosam earum dolor fuga quibusdam quis veniam.

                Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
                quo mollitia fugiat explicabo nesciunt totam placeat laboriosam
                modi itaque consectetur vitae ab, eaque voluptatem id assumenda,
                porro, provident aut iure.`,
          },
          {
            id: 3,
            followerName: "Gerson Agurre",
            followName: "Seguimiento #3",
            date: "17/03/2021",
            resume: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
                quo mollitia fugiat explicabo nesciunt totam placeat laboriosam
                modi itaque consectetur vitae ab, eaque voluptatem id assumenda,
                porro, provident aut iure.

                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi,
                corrupti laboriosam earum dolor fuga quibusdam quis veniam.

                Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
                quo mollitia fugiat explicabo nesciunt totam placeat laboriosam
                modi itaque consectetur vitae ab, eaque voluptatem id assumenda,
                porro, provident aut iure.`,
          },
          {
            id: 4,
            followerName: "Jorbe",
            followName: "Seguimiento #2",
            date: "10/03/2021",
            resume: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
                quo mollitia fugiat explicabo nesciunt totam placeat laboriosam
                modi itaque consectetur vitae ab, eaque voluptatem id assumenda,
                porro, provident aut iure.
              
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi,
                corrupti laboriosam earum dolor fuga quibusdam quis veniam..`,
          },
          {
            id: 5,
            followerName: "Issac Cortez",
            followName: "Seguimiento #1",
            date: "28/02/2021",
            resume: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
                quo mollitia fugiat explicabo nesciunt totam placeat laboriosam
                modi itaque consectetur vitae ab, eaque voluptatem id assumenda,
                porro, provident aut iure.

                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sequi,
                corrupti laboriosam earum dolor fuga quibusdam quis veniam.

                Lorem ipsum dolor sit amet consectetur adipisicing elit. `,
          },
        ],

        follow: {
          id: "",
          followName: "",
          followerName: "",
          date: "",
          resume: "",
        },
        tableData: [{
            index: 1,
            documento: "16SD000C-0142",
            tipo: "credito fiscal",
            fecha: "2016/05/02",
            cliente: "Gerson Aguirre OpenBox.cloud",
            pago: "Pagos en 30 dias",
            total: "$20,000",
          },
          {
            index: 2,
            documento: "16SD000C-0142",
            tipo: "Consumidor fiscal",
            fecha: "2016/05/02",
            cliente: "Radio 100.5 Restauracion Elim central",
            pago: "Pago en 45 dias",
            total: "$20,000",
          },
          {
            index: 3,
            documento: "16SD000C-0142",
            tipo: "Credito Fiscal",
            fecha: "2016/05/02",
            cliente: "GCA Telecom SV. CV",
            pago: "pagos en 43 dias",
            total: "$20,000",
          },
          {
            index: 4,
            documento: "16SD000C-0142",
            tipo: "Consumidor Final",
            fecha: "2016/05/02",
            cliente: "Impresa respuesta EL Salvador",
            pago: "pagos en 60 dias ",
            total: "$20,000",
          },
        ],
        showInvoicePreview: false,
        page: {
          limit: 10,
          page: 1,
        },
        receivable: {
          count: 0,
        },
      };
    },

    methods: {
      getFollow(e) {
        this.follow = this.indexFollow.find((f) => f.id == e);
      },
      openPreviewReceivable(e) {
        this.receivablePreview = e;
        this.showReceivable = true;
      },
      openPreviewReceivableFollowing(e) {
        this.receivablePreview = e;
        this.showReceivableFollowing = true;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
    },
  };
</script>
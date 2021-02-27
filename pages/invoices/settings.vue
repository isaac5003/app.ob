<template>
  <layout-content
    page-title="Configuraciones"
    :breadcrumb="[
      { name: 'Ventas', to: '/invoices' },
      { name: 'Configuraciones', to: null },
    ]"
  >
    <el-tabs
      v-model="tab"
      @tab-click="
        $router
          .replace({
            path: `/invoices/settings`,
            query: { tab },
          })
          .catch(() => {})
      "
    >
      <el-dialog
        title="Crear modelo de factura"
        width="1040px"
        :close-on-click-modal="false"
        :append-to-body="true"
        :visible.sync="closeDialog"
      >
        <Notification
          class="w-full"
          type="info"
          title="Información"
          message="
         <strong class='text-black'>Medida de X:</strong> mida la distancia que hay desde  el borde izquierdo de la factura hasta el inicio de la palabra y escribala en el campo correspondiente<br>
        <strong class='text-black'>Medida de Y:</strong> mida la distancia que hay desde el borde superior  de la factura de la palabra y escriba en el campo correspondiente<br>
        <strong class='text-black'>Medida de L:</strong> Es el largo de Linea que se encuentra al lado de cada titulo, donde la persona podra rellenar con los datos segun corresponda<br>
       <strong class='text-black'> Medida de A:</strong> se refiere al ancho del campo de una columnnan a campo 
        "
        />
        <!-- firts grid -->
        <div class="flex flex-col">
          <el-form label-position="top">
            <div class="grid grid-cols-12">
              <el-form-item class="grid col-span-4">
                <span class="font-semibold">Encabezado</span>
              </el-form-item>
              <!-- <span class="col-start-9 col-span-2 mt-6 ml-20 text-xs"
                >Tamaño de texto</span -->

              <el-form-item
                label="Tamaño de texto "
                class="grid mt-3 ml-10 col-span-4 col-start-11"
              >
                <template>
                  <el-input-number
                    v-model="num"
                    @change="handleChange"
                    :min="1"
                    :max="10"
                    placeholder="pts"
                    class="w-full"
                    size="small"
                  >
                  </el-input-number>
                </template>
              </el-form-item>
            </div>
            <!-- senores fecha Direccion  -->
            <div class="grid grid-cols-12">
              <div class="mt-4 col-span-4">
                <el-checkbox v-model="checked">Señor (es)</el-checkbox>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de L">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="mt-4 col-span-4">
                <el-checkbox v-model="checked">Fecha</el-checkbox>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="mt-4 col-span-4">
                <el-checkbox v-model="checked">Dirección</el-checkbox>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de L">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
            <!--nrc retencion giro  -->
            <div class="grid grid-cols-12">
              <div class="mt-4 col-span-4">
                <el-checkbox v-model="checked">NRC</el-checkbox>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          placeholder="pts"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de L">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="mt-4 col-span-4">
                <el-checkbox v-model="checked">Nota de remision</el-checkbox>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          placeholder="pts"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="mt-4 col-span-4">
                <el-checkbox v-model="checked">Giro</el-checkbox>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          controls-position="right"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de L">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
            <!-- Condiones de la opracion  ventas a cuenta -->
            <div class="grid grid-cols-12 border-b-2">
              <div class="mt-4 col-span-4">
                <el-checkbox v-model="checked"
                  >Condiciones de la operacion</el-checkbox
                >
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          placeholder="pts"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de L">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="mt-4 col-span-4">
                <el-checkbox v-model="checked">Ventas a cuenta de</el-checkbox>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          placeholder="pts"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
            <!-- DETALLES-->
            <div class="grid grid-cols-12 mt-3">
              <div class="w-full col-span-4 flex flex-col">
                <span class="font-semibold text-black">Detalles</span>
                <span>Campos para el encabezado para la tabla</span>
              </div>
              <!-- <span class="col-span-3 mt-6  text-xs col-start-9 bg-red-300"
                >Tamaño de texto</span

              > -->
              <el-form-item
                label="Altura de la descripcion de los items "
                class="col-span-4 col-start-7 ml-12"
              >
                <template>
                  <el-input-number
                    v-model="num"
                    @change="handleChange"
                    :min="1"
                    :max="10"
                    placeholder="pts"
                    class="w-full"
                    size="small"
                  >
                  </el-input-number>
                </template>
              </el-form-item>
              <el-form-item
                label="Tamaño de texto "
                class="col-span-4 col-start-11 ml-12"
              >
                <template>
                  <el-input-number
                    v-model="num"
                    @change="handleChange"
                    :min="1"
                    :max="10"
                    placeholder="pts"
                    class="w-full"
                    size="small"
                  >
                  </el-input-number>
                </template>
              </el-form-item>
            </div>
            <!-- cant  descripcion  preciounitatio -->
            <div class="grid grid-cols-12">
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Medida Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Medida L">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de L">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-12 borde-b-2">
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Medida Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Medida L">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de L">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
            <!-- TOTALES-->
            <div class="grid grid-cols-12">
              <div class="col-span-4">
                <span class="font-semibold">Totales</span>
              </div>
              <div class="col-span-4 col-start-11 ml-10">
                <el-form-item label="Tamaño de texto">
                  <template>
                    <el-input-number
                      v-model="num"
                      @change="handleChange"
                      :min="1"
                      :max="10"
                      placeholder="pts"
                      class="w-full"
                      size="small"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
            <!-- Son, Operacion superiora {a evaluar }, entregado por -->
            <div class="grid grid-cols-12">
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Medida Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Medida L">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de L">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
            <!-- NOMBRE DUI Y FIRMA -->
            <div class="grid grid-cols-12">
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Medida Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Medida L">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de L">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
            <!-- RECIVIDO POR, NPMBRE Y DUI -->
            <div class="grid grid-cols-12">
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Medida Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Medida L">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de L">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
            <!-- FIRMA, SUMAS, 13% DE IVA -->
            <div class="grid grid-cols-12">
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Medida Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Medida L">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de L">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
            <!-- subtotal, iva retenido, ventas extenta -->
            <div class="grid grid-cols-12">
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Medida Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Medida L">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de L">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
            <!-- VENTA NO SUJETAS VENTA TOTAL  (RECUADRO) -->
            <div class="grid grid-cols-12">
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Medida Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Medida L">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="mt-4 col-span-4 space-x-2">
                <el-checkbox v-model="checked"></el-checkbox>
                <el-input
                  placeholder="Please input"
                  style="width: 68%"
                  size="small"
                  v-model="input"
                ></el-input>
                <div class="grid grid-cols-6 mt-3">
                  <div class="col-span-2">
                    <el-form-item label="Media de X">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de Y">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item label="Media de L">
                      <template>
                        <el-input-number
                          v-model="num"
                          controls-position="right"
                          @change="handleChange"
                          :min="1"
                          :max="10"
                          style="width: 90%"
                          size="small"
                        >
                        </el-input-number>
                      </template>
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-row justify-end">
              <el-button type="primary" size="small">Guardar </el-button>
              <el-button size="small" @click="closeDialog = false"
                >Cerrar</el-button
              >
            </div>
          </el-form>
        </div>
      </el-dialog>
      <!-- Panel -->
      <el-tab-pane label="Zonas y vendedores" name="zones-sellers">
        <!-- dialogo zonas -->
        <el-dialog
          :append-to-body="true"
          title="Nueva zona"
          :visible.sync="showNewZone"
          width="30%"
          @close="closeDialog('newZoneForm')"
        >
          <el-form
            :model="newZoneForm"
            :rules="newzoneRules"
            status-icon
            ref="newZoneForm"
            @submit.prevent.native="submitZone('newZoneForm', newZoneForm)"
          >
            <div>
              <el-form-item label="Nombre de la zona" prop="name">
                <el-input
                  v-model="newZoneForm.name"
                  clearable
                  type="text"
                  maxlength="100"
                  minlength="5"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </div>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              size="small"
              @click.native="submitZone('newZoneForm', newZoneForm)"
              >Guardar</el-button
            >
            <el-button @click="showNewZone = false" size="small"
              >Cancelar</el-button
            >
          </span>
        </el-dialog>
        <!-- dialogo para editar zona -->
        <el-dialog
          :append-to-body="true"
          title="Editar zona zona"
          :visible.sync="showEditZone"
          width="30%"
          @close="closeDialog('editZoneForm')"
        >
          <el-form
            :model="editZoneForm"
            :rules="newzoneRules"
            status-icon
            ref="editZoneForm"
            @submit.prevent.native="submitZone('editZoneForm', editZoneForm)"
          >
            <div>
              <el-form-item label="Nombre de la zona" prop="name">
                <el-input
                  v-model="editZoneForm.name"
                  clearable
                  type="text"
                  maxlength="100"
                  minlength="5"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </div>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              size="small"
              @click.native="submitZone('editZoneForm', editZoneForm)"
              >Guardar</el-button
            >
            <el-button @click="showEditZone = false" size="small"
              >Cancelar</el-button
            >
          </span>
        </el-dialog>
        <!-- dialogo nuevo vendedor -->
        <el-dialog
          :append-to-body="true"
          title="Nuevo vendedor"
          :visible.sync="showNewSeller"
          width="30%"
          @close="closeDialog('newSellerForm')"
        >
          <el-form
            :model="newSellerForm"
            :rules="newzoneRules"
            status-icon
            ref="newSellerForm"
            @submit.prevent.native="
              submitSeller('newSellerForm', newSellerForm)
            "
          >
            <div>
              <el-row :gutter="15">
                <el-col :span="15">
                  <el-form-item label="Nombre del vendedor" prop="name">
                    <el-input
                      clearable
                      v-model="newSellerForm.name"
                      size="small"
                      auto-complete="off"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="Zona asignada" prop="invoicesZone">
                    <el-select
                      v-model="newSellerForm.invoicesZone"
                      placeholder="Seleccionar"
                      size="small"
                      class="w-full"
                      clearable
                      default-first-option
                    >
                      <el-option
                        v-for="z in activeZones"
                        :key="z.id"
                        :label="z.name"
                        :value="z.id"
                        class="w.full"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              size="small"
              @click.native="submitSeller('newSellerForm', newSellerForm)"
              >Guardar</el-button
            >
            <el-button @click="showNewSeller = false" size="small"
              >Cancelar</el-button
            >
          </span>
        </el-dialog>
        <!-- dialogo editar vendedores -->
        <el-dialog
          :append-to-body="true"
          title="Editar vendedor"
          :visible.sync="showEditSeller"
          width="30%"
          @close="closeDialog('editSellerForm')"
        >
          <el-form
            :model="editSellerForm"
            :rules="newzoneRules"
            status-icon
            ref="editSellerForm"
            @submit.prevent.native="
              submitEditSeller('editSellerForm', sellerId, editSellerForm)
            "
          >
            <div>
              <el-row :gutter="15">
                <el-col :span="15">
                  <el-form-item label="Nombre del vendedor" prop="name">
                    <el-input
                      clearable
                      v-model="editSellerForm.name"
                      size="small"
                      auto-complete="off"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="Zona asignada" prop="invoicesZone">
                    <el-select
                      v-model="editSellerForm.invoicesZone"
                      placeholder="Selecionar"
                      size="small"
                      class="w-full"
                      clearable
                      default-first-option
                    >
                      <el-option
                        v-for="z in activeZones"
                        :key="z.id"
                        :label="z.name"
                        :value="z.id"
                        class="w.full"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              size="small"
              @click.native="
                submitEditSeller('editSellerForm', sellerId, editSellerForm)
              "
              >Guardar</el-button
            >
            <el-button @click="showEditSeller = false" size="small"
              >Cancelar</el-button
            >
          </span>
        </el-dialog>
        <!-- Inicio de tablas zonas y vendedores -->
        <div class="grid grid-cols-12">
          <!-- tabla de zonas -->
          <div class="col-span-5 flex flex-col space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-blue-900 font-semibold text-lg">ZONAS</span>
              <el-button
                @click="showNewZone = true"
                type="primary"
                size="mini"
                icon="el-icon-plus"
              />
            </div>
            <el-table :data="zones" stripe size="mini">
              <el-table-column prop="index" width="40" />
              <el-table-column label="Zona" prop="name" min-width="180" />
              <el-table-column label="Estado" width="100">
                <template slot-scope="scope">
                  <el-tag size="small" type="success" v-if="scope.row.active"
                    ><i class="el-icon-success"></i>Activo</el-tag
                  >
                  <el-tag size="small" type="danger" v-else
                    ><i class="el-icon-remove"></i>Inactivo</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column label min-width="70" align="center">
                <template slot-scope="scope">
                  <el-dropdown trigger="click" szie="mini">
                    <el-button icon="el-icon-more" size="mini" />
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="editZone(scope.row)">
                        <i class="el-icon-edit-outline"></i> Editar zona
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click.native="changeActiveZone(scope.row)"
                      >
                        <span v-if="scope.row.active">
                          <i class="el-icon-close"></i> Desactivar
                        </span>
                        <span v-else>
                          <i class="el-icon-check"></i> Activar
                        </span>
                        zona
                      </el-dropdown-item>
                      <el-dropdown-item
                        :divided="true"
                        class="text-red-500 font-semibold"
                        @click.native="deleteZone(scope.row)"
                      >
                        <i class="el-icon-delete"></i> Eliminar zona
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- tabla de vendedores -->
          <div class="col-span-7 flex flex-col space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-blue-900 font-semibold text-lg"
                >VENDEDORES</span
              >
              <el-button
                @click="showNewSeller = true"
                type="primary"
                size="mini"
                icon="el-icon-plus"
              />
            </div>

            <el-table :data="sellers" stripe size="mini">
              <el-table-column label="ID" prop="index" width="40" />
              <el-table-column label="Vendedor" prop="name" min-width="240" />
              <el-table-column label="Zona" min-width="100">
                <template slot-scope="scope">
                  <span
                    >{{
                      scope.row.invoicesZone ? scope.row.invoicesZone.name : ""
                    }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column label="Estado" width="100">
                <template slot-scope="scope">
                  <el-tag size="small" type="success" v-if="scope.row.active">
                    <i class="el-icon-success"></i>Activo</el-tag
                  >
                  <el-tag size="small" type="danger" v-else
                    ><i class="el-icon-remove"></i>Inactivo</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column label width="70" align="center">
                <template slot-scope="scope">
                  <el-dropdown trigger="click" szie="mini">
                    <el-button icon="el-icon-more" size="mini" />
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="editSeller(scope.row)">
                        <i class="el-icon-edit-outline"></i> Editar vendedor
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click.native="changeActiveSellers(scope.row)"
                      >
                        <span v-if="scope.row.active">
                          <i class="el-icon-close"></i> Desactivar
                        </span>
                        <span v-else>
                          <i class="el-icon-check"></i> Activar </span
                        >vendedor
                      </el-dropdown-item>
                      <el-dropdown-item
                        :divided="true"
                        class="text-red-500 font-semibold"
                        @click.native="deleteSeller(scope.row)"
                      >
                        <i class="el-icon-delete"></i> Eliminar vendedor
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- Fin del div vendedores -->
        </div>
      </el-tab-pane>

      <!-- Tabla de condiciones de pago -->
      <el-tab-pane label="Condiciones de pago" name="payment-conditions">
        <!-- Dialogo para agregar nueva condicion de pago -->
        <el-dialog
          :append-to-body="true"
          title="Nueva condición de pago"
          :visible.sync="showNewPayment"
          width="30%"
          @close="closeDialog('newPaymentForm')"
        >
          <el-form
            :model="newPaymentForm"
            :rules="newzoneRules"
            status-icon
            ref="newPaymentForm"
            @submit.prevent.native="
              submitPayment('newPaymentForm', newPaymentForm)
            "
          >
            <div>
              <el-form-item label="Nombre de la condición de pago" prop="name">
                <el-input
                  v-model="newPaymentForm.name"
                  clearable
                  type="text"
                  maxlength="100"
                  minlength="5"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </div>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              size="small"
              @click.native="submitPayment('newPaymentForm', newPaymentForm)"
              >Guardar</el-button
            >
            <el-button @click="showNewPayment = false" size="small"
              >Cancelar</el-button
            >
          </span>
        </el-dialog>

        <!-- Dialogo para editar condicion de pago -->
        <el-dialog
          :append-to-body="true"
          title="Editar condición de pago"
          :visible.sync="showEditPayment"
          width="30%"
          @close="closeDialog('editPaymentForm')"
        >
          <el-form
            :model="editPaymentForm"
            :rules="newzoneRules"
            status-icon
            ref="editPaymentForm"
            @submit.prevent.native="
              submitPayment('editPaymentForm', editPaymentForm)
            "
          >
            <el-form-item label="Nombre la condición de pago" prop="name">
              <el-input
                v-model="editPaymentForm.name"
                clearable
                type="text"
                maxlength="100"
                minlength="5"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              size="small"
              @click.native="submitPayment('editPaymentForm', editPaymentForm)"
              >Guardar</el-button
            >
            <el-button @click="showEditPayment = false" size="small"
              >Cancelar</el-button
            >
          </span>
        </el-dialog>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-6 flex flex-col space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-blue-900 font-semibold text-lg"
                >CONDICIONES DE PAGO</span
              >
              <el-button
                @click="showNewPayment = true"
                type="primary"
                size="mini"
                icon="el-icon-plus"
              />
            </div>
            <el-table :data="payments" stripe size="mini">
              <el-table-column prop="index" width="40" />
              <el-table-column
                label="Condicion de pago"
                prop="name"
                min-width="260"
              />
              <el-table-column label="Estado" min-width="100">
                <template slot-scope="scope">
                  <el-tag size="small" type="success" v-if="scope.row.active"
                    ><i class="el-icon-success"></i>Activo</el-tag
                  >
                  <el-tag size="small" type="danger" v-else
                    ><i class="el-icon-remove"></i>Inactivo</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column label width="70" align="center">
                <template slot-scope="scope">
                  <el-dropdown trigger="click" szie="mini">
                    <el-button icon="el-icon-more" size="mini" />
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        @click.native="editCondition(scope.row)"
                      >
                        <i class="el-icon-edit-outline"></i> Editar condición
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click.native="changeActivePayment(scope.row)"
                      >
                        <span v-if="scope.row.active">
                          <i class="el-icon-close"></i> Desactivar
                        </span>
                        <span v-else>
                          <i class="el-icon-check"></i> Activar
                        </span>
                        condición
                      </el-dropdown-item>
                      <el-dropdown-item
                        :divided="true"
                        class="font-semibold"
                        @click.native="deletePayment(scope.row)"
                      >
                        <i class="el-icon-delete"></i> Eliminar condición
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Correlativos">
        <el-form v-model="documents">
          <div class="grid grid-cols-12 gap-4">
            <div
              v-for="(d, i) of documents"
              :key="i"
              class="col-span-4 bg-white"
            >
              <div class="border-2 p-5 border-blue-800 rounded-md">
                <!-- Consumidor final, Switch y Button -->
                <div class="grid grid-cols-12 gap-4">
                  <div class="col-span-8">
                    <el-form-item class="font-semibold text-blue-800">{{
                      d.documentType ? d.documentType.name : ""
                    }}</el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item>
                      <el-switch v-model="d.active"></el-switch>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item>
                      <el-button
                        type="primary"
                        icon="el-icon-plus"
                        size="mini"
                        :disabled="true"
                      ></el-button>
                    </el-form-item>
                  </div>
                </div>
                <!-- Autorización -->
                <div class="grid grid-cols-12 gap-4">
                  <div class="col-span-12">
                    <el-form-item label="N° Autorización">
                      <el-input
                        class="w-full"
                        size="small"
                        :disabled="true"
                        v-model="d.authorization"
                      ></el-input>
                    </el-form-item>
                  </div>
                </div>
                <!-- Inicial, Final -->
                <div class="grid grid-cols-12 gap-4">
                  <div class="col-span-6">
                    <el-form-item label="Inicial">
                      <el-input
                        class="w-full"
                        size="small"
                        :disabled="true"
                        v-model="d.initial"
                      ></el-input>
                    </el-form-item>
                  </div>
                  <div class="col-span-6">
                    <el-form-item label="Final">
                      <el-input
                        class="w-full"
                        size="small"
                        :disabled="true"
                        v-model="d.final"
                      ></el-input>
                    </el-form-item>
                  </div>
                </div>
                <!-- Actual -->
                <div class="grid grid-cols-12 gap-4">
                  <div class="col-span-12">
                    <el-form-item label="Actual">
                      <el-input
                        class="w-full"
                        size="small"
                        :disabled="true"
                        v-model="d.current"
                      ></el-input>
                    </el-form-item>
                  </div>
                  <el-link
                    @click="closeDialog = true"
                    class="w-56"
                    icon="el-icon-setting"
                  >
                    Creacion de Factura
                  </el-link>
                </div>
              </div>
            </div>
          </div>
        </el-form>
        <!-- Botones Guardar y Cancelar -->
        <div class="flex justify-end dialog-footer mt-4">
          <el-button type="primary" size="small">Guardar</el-button>
          <el-button size="small" @click="$router.push('/invoices')"
            >Cancelar</el-button
          >
        </div>
      </el-tab-pane>
    </el-tabs>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import Notification from "../../components/Notification";

import {
  getIcon,
  hasModule,
  inputValidation,
  selectValidation,
} from "../../tools";

export default {
  name: "InvoicesSettings",
  components: { LayoutContent, Notification },
  fetch() {
    // Se ubica en el tab correcto
    if (this.$route.query.tab) {
      this.tab = this.$route.query.tab;
    }
    if (this.$route.query.utab) {
      this.utab = this.$route.query.utab;
    }

    const zones = () => {
      return this.$axios.get("/invoices/zones");
    };
    // método para hacer la petición a la url de vendedores
    const sellers = () => {
      return this.$axios.get("/invoices/sellers");
    };
    //método para mostrar data en la tabla de pagos
    const payment = () => {
      return this.$axios.get("/invoices/payment-condition");
    };
    const documents = () => {
      return this.$axios.get("/invoices/documents");
    };
    // promesa que recibe los métodos con las peticiones http
    Promise.all([zones(), sellers(), payment(), documents()])
      .then((res) => {
        const [zones, sellers, payment, documents] = res;
        this.zones = zones.data.zones;
        this.sellers = sellers.data.sellers;
        this.payments = payment.data.paymentConditions;
        this.documents = documents.data.documents;
        this.loading = false;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message;
      });
  },
  fetchOnServer: false,
  data() {
    return {
      checked: true,
      input: "",
      num: 1,
      closeDialog: false,
      tab: "zones-sellers",
      utab: "invoicing",
      integrations: [
        {
          name: "Facturación",
          ref: "cfb8addb-541b-482f-8fa1-dfe5db03fdf4",
          id: "invoicing",
          icon: getIcon("dolar"),
        },
        {
          name: "Contabilidad",
          ref: "a98b98e6-b2d5-42a3-853d-9516f64eade8",
          id: "accounting",
          icon: getIcon("cash"),
        },
      ],
      zones: [],
      sellers: [],
      payments: [],
      documents: [],
      showNewZone: false,
      showNewSeller: false,
      showNewPayment: false,
      showEditPayment: false,
      showEditZone: false,
      showEditSeller: false,
      newZoneForm: {
        name: "",
      },
      newPaymentForm: {
        name: "",
      },
      newSellerForm: {
        name: "",
        invoicesZone: "",
      },
      newzoneRules: {
        name: inputValidation(true, 5, 100),
        invoicesZone: selectValidation(true),
      },
      editPaymentForm: {
        name: "",
      },
      editZoneForm: {
        name: "",
      },
      editSellerForm: {
        name: "",
        invoicesZone: "",
      },
    };
  },
  methods: {
    handleChange(value) {
      console.log(value);
    },
    closeDialog(name) {
      this.$refs[name].resetFields();
    },
    fetchZones() {
      this.$axios
        .get("/invoices/zones")
        .then((res) => {
          this.zones = res.data.zones;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        });
    },
    fetchSellers() {
      this.$axios
        .get("/invoices/sellers")
        .then((res) => {
          this.sellers = res.data.sellers;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        });
    },
    fetchPayments() {
      this.$axios
        .get("/invoices/payment-condition")
        .then((res) => {
          this.payments = res.data.paymentConditions;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        });
    },
    changeActiveZone({ id, active }) {
      const action = active ? "desactivar" : "activar";
      this.$confirm(
        `¿Estás seguro que deseas ${action} esta zona?`,
        "Confirmación",
        {
          confirmButtonText: `Si, ${action}`,
          cancelButtonText: "Cancelar",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "Procesando...";
              this.$axios
                .put(`/invoices/zones/status/${id}`, { status: !active })
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchZones();
                })
                .catch((err) => {
                  this.$notify.error({
                    title: "Error",
                    message: err.response.data.message,
                  });
                })
                .then((alw) => {
                  instance.confirmButtonLoading = false;
                  instance.confirmButtonText = `Si, ${action}`;
                  done();
                });
            }
            done();
          },
        }
      );
    },
    //Metodo para cambiar el estado de vendedores (Activar o Desactivar)
    changeActiveSellers({ id, active }) {
      const action = active ? "desactivar" : "activar";
      this.$confirm(
        `¿Estás seguro que deseas ${action} este vendedor?`,
        "Confirmación",
        {
          confirmButtonText: `Si, ${action}`,
          cancelButtonText: "Cancelar",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "Procesando...";
              this.$axios
                .put(`/invoices/sellers/status/${id}`, { status: !active })
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchSellers();
                })
                .catch((err) => {
                  this.$notify.error({
                    title: "Error",
                    message: err.response.data.message,
                  });
                })
                .then((alw) => {
                  instance.confirmButtonLoading = false;
                  instance.confirmButtonText = `Si, ${action}`;
                  done();
                });
            }
            done();
          },
        }
      );
    },
    //Metodo para camiar el estado de condiciones de pago
    changeActivePayment({ id, active }) {
      const action = active ? "desactivar" : "activar";
      this.$confirm(
        `¿Estás seguro que deseas ${action} este pago?`,
        "Confirmación",
        {
          confirmButtonText: `Si, ${action}`,
          cancelButtonText: "Cancelar",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "Procesando...";
              this.$axios
                .put(`/invoices/payment-condition/status/${id}`, {
                  status: !active,
                })
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchPayments();
                })
                .catch((err) => {
                  this.$notify.error({
                    title: "Error",
                    message: err.response.data.message,
                  });
                })
                .then((alw) => {
                  instance.confirmButtonLoading = false;
                  instance.confirmButtonText = `Si, ${action}`;
                  done();
                });
            }
            done();
          },
        }
      );
    },
    deleteZone({ id }) {
      this.$confirm(
        `¿Estás seguro que deseas eliminar esta zona?`,
        "Confirmación",
        {
          confirmButtonText: `Si, eliminar`,
          cancelButtonText: "Cancelar",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "Procesando...";
              this.$axios
                .delete(`/invoices/zones/${id}`)
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchZones();
                })
                .catch((err) => {
                  this.$notify.error({
                    title: "Error",
                    message: err.response.data.message,
                  });
                })
                .then((alw) => {
                  instance.confirmButtonLoading = false;
                  instance.confirmButtonText = `Si, eliminar`;
                  done();
                });
            }
            done();
          },
        }
      );
    },
    deleteSeller({ id }) {
      this.$confirm(
        `¿Estás seguro que deseas eliminar este vendedor?`,
        "Confirmación",
        {
          confirmButtonText: `Si, eliminar`,
          cancelButtonText: "Cancelar",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "Procesando...";
              this.$axios
                .delete(`/invoices/sellers/${id}`)
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchSellers();
                })
                .catch((err) => {
                  this.$notify.error({
                    title: "Error",
                    message: err.response.data.message,
                  });
                })
                .then((alw) => {
                  instance.confirmButtonLoading = false;
                  instance.confirmButtonText = `Si, eliminar`;
                  done();
                });
            }
            done();
          },
        }
      );
    },
    deletePayment({ id }) {
      this.$confirm(
        `¿Estás seguro que deseas eliminar este pago?`,
        "Confirmación",
        {
          confirmButtonText: `Si, eliminar`,
          cancelButtonText: "Cancelar",
          type: "warning",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "Procesando...";
              this.$axios
                .delete(`/invoices/payment-condition/${id}`)
                .then((res) => {
                  this.$notify.success({
                    title: "Éxito",
                    message: res.data.message,
                  });
                  this.fetchPayments();
                })
                .catch((err) => {
                  this.$notify.error({
                    title: "Error",
                    message: err.response.data.message,
                  });
                })
                .then((alw) => {
                  instance.confirmButtonLoading = false;
                  instance.confirmButtonText = `Si, eliminar`;
                  done();
                });
            }
            done();
          },
        }
      );
    },
    submitZone(formName, { id, name }) {
      const action = id ? "actualizar" : "guardar";
      const method = id ? "PUT" : "POST";
      const url = `/invoices/zones/${id ? id : ""}`;
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$confirm(
          `¿Estás seguro que deseas ${action} esta zona?`,
          "Confirmación",
          {
            confirmButtonText: `Si, ${action}`,
            cancelButtonText: "Cancelar",
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "Procesando...";
                this.$axios({
                  method,
                  url,
                  data: { name },
                })
                  .then((res) => {
                    this.$notify.success({
                      title: "Éxito",
                      message: res.data.message,
                    });
                    this.fetchZones();
                    this.fetchSellers();
                  })
                  .catch((err) => {
                    this.$notify.error({
                      title: "Error",
                      message: err.response.data.message,
                    });
                  })
                  .then((alw) => {
                    instance.confirmButtonLoading = false;
                    instance.confirmButtonText = `Si, ${action}`;
                    done();
                  });
              }
              done();
              //Cambio de valor en variable showNewPayment
              this.showNewZone = false;
              this.showEditZone = false;
            },
          }
        );
      });
    },
    submitSeller(formName, { name, invoicesZone }) {
      console.log(name, invoicesZone);
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$confirm(
          `¿Estás seguro que deseas guardar este vendedor?`,
          "Confirmación",
          {
            confirmButtonText: `Si, guardar`,
            cancelButtonText: "Cancelar",
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "Procesando...";
                this.$axios
                  .post("/invoices/sellers", {
                    name,
                    invoicesZone,
                  })
                  .then((res) => {
                    this.$notify.success({
                      title: "Éxito",
                      message: res.data.message,
                    });
                    this.fetchSellers();
                  })
                  .catch((err) => {
                    this.$notify.error({
                      title: "Error",
                      message: err.response.data.message,
                    });
                  })
                  .then((alw) => {
                    instance.confirmButtonLoading = false;
                    instance.confirmButtonText = `Si, guardar`;
                    done();
                  });
              }
              done();
              this.showNewSeller = false;
            },
          }
        );
      });
    },
    editSeller({ id, name, ...zone }) {
      this.sellerId = id;
      this.editSellerForm.name = name;
      this.editSellerForm.invoicesZone = zone.invoicesZone.id;
      this.showEditSeller = true;
    },
    submitEditSeller(formName, sellerId, { name, invoicesZone }) {
      console.log(name, invoicesZone);
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$confirm(
          `¿Estás seguro que deseas actualizar este vendedor?`,
          "Confirmación",
          {
            confirmButtonText: `Si, actualizar`,
            cancelButtonText: "Cancelar",
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "Procesando...";
                this.$axios
                  .put(`/invoices/sellers/${sellerId}`, {
                    name,
                    invoicesZone,
                  })
                  .then((res) => {
                    this.$notify.success({
                      title: "Éxito",
                      message: res.data.message,
                    });
                    this.fetchSellers();
                  })
                  .catch((err) => {
                    this.$notify.error({
                      title: "Error",
                      message: err.response.data.message,
                    });
                  })
                  .then((alw) => {
                    instance.confirmButtonLoading = false;
                    instance.confirmButtonText = `Si, actualizar`;
                    done();
                  });
              }
              done();
              this.showEditSeller = false;
            },
          }
        );
      });
    },
    submitPayment(formName, { id, name }) {
      const action = id ? "actualizar" : "guardar";
      const method = id ? "PUT" : "POST";
      const url = `/invoices/payment-condition/${id ? id : ""}`;
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$confirm(
          `¿Estás seguro que deseas ${action} esta condición de pago?`,
          "Confirmación",
          {
            confirmButtonText: `Si, ${action}`,
            cancelButtonText: "Cancelar",
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "Procesando...";
                this.$axios({
                  method,
                  url,
                  data: { name },
                })
                  .then((res) => {
                    this.$notify.success({
                      title: "Éxito",
                      message: res.data.message,
                    });
                    this.fetchPayments();
                  })
                  .catch((err) => {
                    this.$notify.error({
                      title: "Error",
                      message: err.response.data.message,
                    });
                  })
                  .then((alw) => {
                    instance.confirmButtonLoading = false;
                    instance.confirmButtonText = `Si, ${action}`;
                    done();
                  });
              }
              done();
              //Cambio de valor en variable showNewPayment
              this.showNewPayment = false;
              this.showEditPayment = false;
            },
          }
        );
      });
    },
    editCondition(condition) {
      this.editPaymentForm = { ...condition };
      this.showEditPayment = true;
    },
    editZone(zone) {
      this.editZoneForm = { ...zone };
      this.showEditZone = true;
    },
  },
  computed: {
    filteredIntegrations() {
      return this.integrations.filter((i) => hasModule(i.ref, this.$auth.user));
    },
    activeZones() {
      return this.zones.filter((zone) => zone.active);
    },
  },
};
</script>

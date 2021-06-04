<template>
  <layout-content
    page-title="Configuraciones"
    :breadcrumb="[
      { name: 'Ventas', to: '/invoices' },
      { name: 'Configuraciones', to: null },
    ]"
    v-loading="pageloading"
  >
    <!-- TODORealizar funcionamiento de agregar autorizacion. -->
    <!-- <el-dialog
      title="Nueva Autorización"
      :visible.sync="showAuthorization"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="400px"
    >
      Creacion de factura -->
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
      <el-form :model="invoiceModel" ref="invoiceModel">
        <!-- Encabezado y tamaño de texto  -->
        <div class="grid grid-cols-12">
          <el-form-item class="col-span-3">
            <span class="font-semibold">Encabezado</span>
          </el-form-item>
          <el-form-item class="col-span-3">
            <div class="inline-flex space-x-2">
              <div class="flex-1 text-xs">Tamaño de texto</div>
              <div class="flex-1">
                <el-input-number
                  v-model="num"
                  :min="1"
                  :max="10"
                  class="w-full"
                  size="small"
                ></el-input-number>
              </div>
            </div>
          </el-form-item>
          <el-form-item class="col-span-3">
            <div class="inline-flex space-x-2">
              <div class="flex-1 text-xs">Alto de página</div>
              <div class="flex-1">
                <el-input-number
                  v-model="invoiceModel.resolution.height"
                  :min="1"
                  :max="10"
                  class="w-full"
                  size="small"
                ></el-input-number>
              </div>
            </div>
          </el-form-item>
          <el-form-item class="col-span-3">
            <div class="inline-flex space-x-2">
              <div class="flex-1 text-xs">Ancho de página</div>
              <div class="flex-1">
                <el-input-number
                  v-model="invoiceModel.resolution.width"
                  :min="1"
                  :max="10"
                  class="w-full"
                  size="small"
                ></el-input-number>
              </div>
            </div>
          </el-form-item>
        </div>
        <!-- Numero de factura y tamaño de texto  -->
        <div class="grid grid-cols-12 gap-8">
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.invoice_authorization.show"
              >Correlativo</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X" prop="invoice_authorization">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.invoice_authorization.x"
                      controls-position="right"
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
                      v-model="invoiceModel.invoice_authorization.y"
                      controls-position="right"
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
                      v-model="invoiceModel.invoice_authorization.l"
                      controls-position="right"
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
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.invoice_number.show"
              >Secuencia</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.invoice_number.x"
                      controls-position="right"
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
                      v-model="invoiceModel.invoice_number.y"
                      controls-position="right"
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
                      v-model="invoiceModel.invoice_number.l"
                      controls-position="right"
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
        <!-- senores, fecha y Direccion  -->
        <div class="grid grid-cols-12 gap-8">
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.customer_name.show"
              >Señor (es)</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_name.x"
                      controls-position="right"
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
                      v-model="invoiceModel.customer_name.y"
                      controls-position="right"
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
                      v-model="invoiceModel.customer_name.l"
                      controls-position="right"
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
          <div class="col-span-4">
            <el-checkbox v-model="checked">Fecha</el-checkbox>
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
          <div class="col-span-4">
            <el-checkbox v-model="checked">Dirección</el-checkbox>
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
        <div class="grid grid-cols-12 gap-8">
          <div class="col-span-4">
            <el-checkbox v-model="checked">NRC</el-checkbox>
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
          <div class="col-span-4">
            <el-checkbox v-model="checked">Nota de remisión</el-checkbox>
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
          <div class="col-span-4">
            <el-checkbox v-model="checked">Giro</el-checkbox>
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
        <div class="grid grid-cols-12 border-b-2 gap-8">
          <div class="col-span-4">
            <el-checkbox v-model="checked"
              >Condiciones de la operacion</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
          <div class="col-span-4">
            <el-checkbox v-model="checked">Ventas a cuenta de</el-checkbox>
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
          <div class="col-span-3 flex flex-col">
            <span class="font-semibold text-black">Detalles</span>
            <span class="text-xs">Campos para el encabezado de la tabla</span>
          </div>
          <el-form-item class="col-span-5 col-start-5 ml-12">
            <div class="inline-flex space-x-2">
              <span class="flex-1 text-xs"
                >Altura para la descripción de items</span
              >
              <el-input-number
                v-model="num"
                :min="1"
                :max="10"
                class="w-full"
                size="small"
              ></el-input-number>
            </div>
          </el-form-item>
          <el-form-item class="col-span-3 col-start-10">
            <div class="inline-flex space-x-2">
              <span class="flex-1 text-xs">Tamaño de texto</span>
              <el-input-number
                v-model="num"
                :min="1"
                :max="10"
                class="w-full"
                size="small"
              ></el-input-number>
            </div>
          </el-form-item>
        </div>
        <!-- cant  descripcion  preciounitario -->
        <div class="grid grid-cols-12 gap-8">
          <div class="col-span-4">
            <el-checkbox v-model="checked">Cantidad</el-checkbox>
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
          <div class="col-span-4">
            <el-checkbox v-model="checked">Descripción</el-checkbox>

            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
          <div class="col-span-4">
            <el-checkbox v-model="checked">Precio unitario</el-checkbox>

            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
        <div class="grid grid-cols-12 border-b-2 gap-8">
          <div class="col-span-4 space-x-2">
            <el-checkbox v-model="checked">Venta No sujetas</el-checkbox>

            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
          <div class="col-span-4">
            <el-checkbox v-model="checked">Venta exentas</el-checkbox>

            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
          <div class="col-span-4">
            <el-checkbox v-model="checked">Ventas afectas</el-checkbox>

            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
        <div class="grid grid-cols-12 mt-3">
          <div class="col-span-4">
            <span class="font-semibold">Totales</span>
          </div>

          <el-form-item class="col-span-3 col-start-10">
            <div class="inline-flex space-x-2">
              <div class="flex-1 text-xs">Tamaño de texto</div>
              <div class="flex-1">
                <el-input-number
                  v-model="num"
                  :min="1"
                  :max="10"
                  class="w-full"
                  size="small"
                ></el-input-number>
              </div>
            </div>
          </el-form-item>
        </div>
        <!-- Son, Operacion superior a {evaluar }, entregado por -->
        <div class="grid grid-cols-12 gap-8">
          <div class="col-span-4">
            <el-checkbox v-model="checked">Son</el-checkbox>

            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
          <div class="col-span-4">
            <el-checkbox v-model="checked">Superior a evaluar</el-checkbox>

            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
          <div class="col-span-4">
            <el-checkbox v-model="checked">Entregado por</el-checkbox>

            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
        <div class="grid grid-cols-12 gap-8">
          <div class="col-span-4">
            <el-checkbox v-model="checked">Nombre</el-checkbox>

            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
          <div class="col-span-4">
            <el-checkbox v-model="checked">Dui</el-checkbox>

            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
          <div class="col-span-4">
            <el-checkbox v-model="checked">Firma</el-checkbox>

            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
        <div class="grid grid-cols-12 gap-8">
          <div class="col-span-4">
            <el-checkbox v-model="checked"> Recivido por</el-checkbox>

            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
          <div class="col-span-4">
            <el-checkbox v-model="checked">Nombre</el-checkbox>

            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
          <div class="col-span-4">
            <el-checkbox v-model="checked">Dui</el-checkbox>

            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
        <div class="grid grid-cols-12 gap-8">
          <div class="col-span-4">
            <el-checkbox v-model="checked">Firma</el-checkbox>

            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
          <div class="col-span-4">
            <el-checkbox v-model="checked">Sumas</el-checkbox>

            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
          <div class="col-span-4">
            <el-checkbox v-model="checked">13% de IVA</el-checkbox>

            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
        <div class="grid grid-cols-12 gap-8">
          <div class="col-span-4">
            <el-checkbox v-model="checked">Subtotal</el-checkbox>

            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
          <div class="col-span-4">
            <el-checkbox v-model="checked">Iva retenido</el-checkbox>

            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
          <div class="col-span-4">
            <el-checkbox v-model="checked">Ventas extentas</el-checkbox>

            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
        <div class="grid grid-cols-12 gap-8">
          <div class="col-span-4">
            <el-checkbox v-model="checked"> Venta no sujetas</el-checkbox>

            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
          <div class="col-span-4">
            <el-checkbox v-model="checked">Venta total</el-checkbox>
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
          <div class="col-span-4">
            <el-checkbox v-model="checked">Recuadro</el-checkbox>

            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Media de X">
                  <template>
                    <el-input-number
                      v-model="num"
                      controls-position="right"
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
          <el-button
            type="primary"
            size="small"
            @click.native="sumitModelInvoice('invoiceModel', invoiceModel)"
            >Guardar
          </el-button>
          <el-button size="small" @click="closeDialog = false"
            >Cerrar</el-button
          >
        </div>
      </el-form>
    </el-dialog>
    <!-- Panel -->
    <!-- dialogo zonas -->
    <el-dialog
      :append-to-body="true"
      title="Nueva zona"
      :visible.sync="showNewZone"
      width="30%"
      @close="closeDialogs('newZoneForm')"
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
      @close="closeDialogs('editZoneForm')"
    >
      <el-form
        :model="editZoneForm"
        :rules="newzoneRules"
        status-icon
        ref="editZoneForm"
        @submit.prevent.native="submitZone('editZoneForm', editZoneForm)"
      >
        <div class="grid grid-cols-12 gap-4">
          <el-form-item
            label="Nombre de la zona"
            prop="name"
            class="col-span-12"
          >
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
      @close="closeDialogs('newSellerForm')"
    >
      <el-form
        :model="newSellerForm"
        :rules="newzoneRules"
        status-icon
        ref="newSellerForm"
      >
        <div>
          <el-form-item label="Nombre del vendedor" prop="name">
            <el-input
              clearable
              v-model="newSellerForm.name"
              size="small"
              auto-complete="off"
            />
          </el-form-item>

          <el-form-item label="Zona asignada" prop="invoicesZone">
            <el-select
              v-model="newSellerForm.invoicesZone"
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
                class="w-full"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click.native="submitSeller('newSellerForm', newSellerForm)"
          >Guardar</el-button
        >
        <el-button @click="showEditSeller = false" size="small"
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
      @close="closeDialogs('editSellerForm')"
    >
      <el-form
        :model="editSellerForm"
        :rules="newzoneRules"
        status-icon
        ref="editSellerForm"
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
                    class="w-full"
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
    <!-- Dialogo para agregar nueva condicion de pago -->
    <el-dialog
      :append-to-body="true"
      title="Nueva condición de pago"
      :visible.sync="showNewPayment"
      width="30%"
      @close="closeDialogs('newPaymentForm')"
    >
      <el-form
        :model="newPaymentForm"
        :rules="newzoneRules"
        status-icon
        ref="newPaymentForm"
        @submit.prevent.native="submitPayment('newPaymentForm', newPaymentForm)"
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
      @close="closeDialogs('editPaymentForm')"
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
      <el-tab-pane label="Zonas y vendedores" name="zones-sellers">
        <!-- Inicio de tablas zonas y vendedores -->
        <div class="grid grid-cols-12 gap-4">
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
          width="400px"
          @close="closeDialogs('newPaymentForm')"
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
            <el-form-item prop="" label="Tipo de pago">
              <el-radio-group
                v-model="newPaymentForm.cashPayment"
                class="w-full"
              >
                <el-row :gutter="15">
                  <el-col :span="8">
                    <el-radio border size="small" class="w-full" :label="true"
                      >Contado</el-radio
                    >
                  </el-col>
                  <el-col :span="8">
                    <el-radio border size="small" class="w-full" :label="false"
                      >Credito</el-radio
                    >
                  </el-col>
                </el-row>
              </el-radio-group>
            </el-form-item>

            <div class="flex flex-row justify-end">
              <span slot="foot">
                <el-button
                  type="primary"
                  size="small"
                  @click.native="
                    submitPayment('newPaymentForm', newPaymentForm)
                  "
                  >Guardar</el-button
                >
                <el-button @click="showNewPayment = false" size="small"
                  >Cancelar</el-button
                >
              </span>
            </div>
          </el-form>
        </el-dialog>

        <!-- Dialogo para editar condicion de pago -->
        <el-dialog
          :append-to-body="true"
          title="Editar condición de pago"
          :visible.sync="showEditPayment"
          width="400px"
          @close="closeDialogs('editPaymentForm')"
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
            <el-form-item prop="" label="Tipo de pago">
              <el-radio-group
                v-model="editPaymentForm.cashPayment"
                class="w-full"
              >
                <el-row :gutter="15">
                  <el-col :span="8">
                    <el-radio border size="small" class="w-full" :label="true"
                      >Contado</el-radio
                    >
                  </el-col>
                  <el-col :span="8">
                    <el-radio border size="small" class="w-full" :label="false"
                      >Credito</el-radio
                    >
                  </el-col>
                </el-row>
              </el-radio-group>
            </el-form-item>
            <div class="flex justify-end">
              <span slot="footer" class="dialog-footer">
                <el-button
                  type="primary"
                  size="small"
                  @click.native="
                    submitPayment('editPaymentForm', editPaymentForm)
                  "
                  >Guardar</el-button
                >
                <el-button @click="showEditPayment = false" size="small"
                  >Cancelar</el-button
                >
              </span>
            </div>
          </el-form>
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

      <el-tab-pane label="Correlativos" name="correlatives">
        <el-form :model="correlativeForm" ref="correlativeForm">
          <div class="grid grid-cols-12 gap-4">
            <div
              v-for="(correlative, index) of correlativeForm.documents"
              :key="index"
              class="col-span-4 bg-white"
            >
              <div class="border-2 p-5 border-blue-800 rounded-md">
                <!-- Consumidor final, Switch y Button -->
                <div class="grid grid-cols-12 gap-4">
                  <div class="col-span-8">
                    <el-form-item label="" class="font-semibold text-blue-800"
                      ><span>{{
                        correlative.documentType
                          ? correlative.documentType.name
                          : ""
                      }}</span></el-form-item
                    >
                  </div>
                  <div class="col-span-2">
                    <el-form-item>
                      <el-switch
                        v-model="correlative.active"
                        @change="
                          changeActiveCorrelative(
                            'correlativeForm',
                            correlative,
                            index
                          )
                        "
                      ></el-switch>
                    </el-form-item>
                  </div>
                  <div class="col-span-2">
                    <el-form-item>
                      <el-button
                        type="primary"
                        icon="el-icon-plus"
                        size="mini"
                        @click="showAuthorization = true"
                      ></el-button>
                    </el-form-item>
                  </div>
                </div>
                <!-- Autorización -->
                <div class="grid grid-cols-12 gap-4">
                  <div class="col-span-12">
                    <el-form-item
                      label="N° Autorización"
                      :prop="`documents.${index}.authorization`"
                      :rules="
                        correlative.active
                          ? [
                              {
                                required: true,
                                message: 'Este campo es requerido.',
                                trigger: 'change',
                              },
                              ,
                            ]
                          : {}
                      "
                    >
                      <el-input
                        class="w-full"
                        size="small"
                        :disabled="
                          correlative.active
                            ? correlative.used
                              ? true
                              : false
                            : true
                        "
                        v-model="correlative.authorization"
                      ></el-input>
                    </el-form-item>
                  </div>
                </div>
                <!-- Inicial, Final -->
                <div class="grid grid-cols-12 gap-4">
                  <div class="col-span-6">
                    <el-form-item
                      label="Inicial"
                      :prop="`documents.${index}.initial`"
                      :rules="
                        correlative.active
                          ? [
                              {
                                required: true,
                                message: 'Este campo es requerido.',
                                trigger: 'change',
                              },
                              {
                                type: 'integer',
                                message: 'Debe ser de tipo entero.',
                              },
                            ]
                          : null
                      "
                    >
                      <el-input-number
                        class="w-full"
                        size="small"
                        :disabled="
                          correlative.active
                            ? correlative.used
                              ? true
                              : false
                            : true
                        "
                        v-model="correlative.initial"
                        style="width: 100%"
                        :step="1"
                      ></el-input-number>
                    </el-form-item>
                  </div>
                  <div class="col-span-6">
                    <el-form-item
                      label="Final"
                      :prop="`documents.${index}.final`"
                      :rules="
                        correlative.active
                          ? [
                              {
                                required: true,
                                message: 'Este campo es requerido.',
                                trigger: 'change',
                              },
                              {
                                type: 'integer',
                                message: 'Debe ser de tipo entero.',
                              },
                            ]
                          : null
                      "
                    >
                      <el-input-number
                        class="w-full"
                        size="small"
                        :disabled="
                          correlative.active
                            ? correlative.used
                              ? true
                              : false
                            : true
                        "
                        v-model="correlative.final"
                        style="width: 100%"
                        :step="1"
                      ></el-input-number>
                    </el-form-item>
                  </div>
                </div>
                <!-- Actual -->
                <div class="grid grid-cols-12 gap-4">
                  <div class="col-span-12">
                    <el-form-item
                      label="Actual"
                      :prop="`documents.${index}.current`"
                      :rules="
                        correlative.active
                          ? [
                              {
                                required: true,
                                message: 'Este campo es requerido.',
                                trigger: 'change',
                              },
                              {
                                type: 'integer',
                                message: 'Debe ser de tipo entero.',
                              },
                            ]
                          : null
                      "
                    >
                      <el-input-number
                        class="w-full"
                        size="small"
                        :disabled="
                          correlative.active
                            ? correlative.used
                              ? true
                              : false
                            : true
                        "
                        v-model="correlative.current"
                        style="width: 100%"
                        :step="1"
                      ></el-input-number>
                    </el-form-item>
                    <div class="col-span-2 float-right">
                      <el-link @click="closeDialog = true">
                        Configuración
                        <i class="el-icon-setting"></i>
                      </el-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-form>
        <!-- Botones Guardar y Cancelar -->
        <div class="flex justify-end dialog-footer mt-4">
          <el-button
            type="primary"
            size="small"
            @click="
              submitCorrelativeForm(
                'correlativeForm',
                correlativeForm.documents.filter((c) => !c.used && c.active)
              )
            "
            >Guardar</el-button
          >
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
    const showAuthorization = () => {
      return this.$axios.get("/invoices/documents");
    };
    // promesa que recibe los métodos con las peticiones http
    Promise.all([
      zones(),
      sellers(),
      payment(),
      documents(),
      showAuthorization(),
    ])
      .then((res) => {
        const [zones, sellers, payment, documents] = res;
        this.zones = zones.data.data;
        this.sellers = sellers.data.data;
        this.payments = payment.data.data;
        this.correlativeForm.documents = documents.data.data;

        this.pageloading = false;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message;
      });
  },
  fetchOnServer: false,
  data() {
    return {
      pageloading: false,
      checked: true,
      input: "",
      num: 1,
      closeDialog: false,
      radio1: "",
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
      correlativeForm: {
        documents: [{ authorization: "", initial: "", final: "", current: "" }],
      },
      showAuthorization: false,
      newZoneForm: {
        name: "",
      },
      newPaymentForm: {
        name: "",
        cashPayment: true,
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
        cashPayment: true,
      },
      editZoneForm: {
        name: "",
      },
      editSellerForm: {
        name: "",
        invoicesZone: "",
      },
      invoiceModel: {
        configuration: "positions",
        resolution: {
          width: "",
          height: "",
        },
        invoice_authorization: {
          x: "",
          y: "",
          l: "",
          value: "invoice_authorization",
          show: false,
        },
        invoice_number: {
          x: "",
          y: "",
          l: "",
          value: "invoice_number",
          show: false,
        },
        customer_name: {
          x: "",
          y: "",
          l: "",
          value: "customer_name",
          show: false,
        },
      },
    };
  },
  methods: {
    closeDialogs(name) {
      this.$refs[name].resetFields();
    },
    fetchZones() {
      this.$axios
        .get("/invoices/zones")
        .then((res) => {
          this.zones = res.data.data;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        });
    },
    fetchSellers() {
      this.$axios
        .get("/invoices/sellers")
        .then((res) => {
          this.sellers = res.data.data;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        });
    },
    fetchPayments() {
      this.$axios
        .get("/invoices/payment-condition")
        .then((res) => {
          this.payments = res.data.data;
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
                .put(`/invoices/zones/status/${id}`, { active: !active })
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
                .put(`/invoices/sellers/status/${id}`, { active: !active })
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
                  active: !active,
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
    submitPayment(formName, { id, name, cashPayment }) {
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
                  data: { name, cashPayment },
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
    async fetchDocuments() {
      const { data } = await this.$axios.get("/invoices/documents");
      this.correlativeForm.documents = data.data;
      this.pageloading = false;
    },
    changeActiveCorrelative(formName, correlative, index) {
      if (!correlative.id) {
        if (this.$refs[formName] && !correlative.active) {
          this.$refs[formName].fields
            .find((f) => f.prop == `documents.${index}.authorization`)
            .resetField();
          this.$refs[formName].fields
            .find((f) => f.prop == `documents.${index}.initial`)
            .resetField();
          this.$refs[formName].fields
            .find((f) => f.prop == `documents.${index}.final`)
            .resetField();
          this.$refs[formName].fields
            .find((f) => f.prop == `documents.${index}.current`)
            .resetField();
        }
        this.correlativeForm.documents[index].active = correlative.active;
      } else {
        this.$confirm(
          `¿Estás seguro que deseas ${
            correlative.active ? "activar" : "desactivar"
          } este documento?`,
          "Confirmación",
          {
            confirmButtonText: `Si, ${
              correlative.active ? "activar" : "desactivar"
            }`,
            cancelButtonText: "Cancelar",
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "Procesando...";
                this.$axios
                  .put(`/invoices/documents/status/${correlative.id}`, {
                    active: correlative.active,
                  })

                  .then((res) => {
                    this.$notify.success({
                      title: "Exito",
                      message: res.data.message,
                    });
                    this.fetchDocuments();
                  })
                  .catch((err) => {
                    this.$notify.error({
                      title: "Error",
                      message: err.response.data.message,
                    });
                  })
                  .then((alw) => {
                    instance.confirmButtonLoading = false;
                    instance.confirmButtonText = `Si, ${
                      correlative.active ? "activar" : "desactivar"
                    }`;
                    done();
                  });
              } else {
                done();
              }
            },
          }
        ).catch(() => {
          this.correlativeForm.documents[index].active = !correlative.active;
        });
      }
    },
    submitCorrelativeForm(formName, correlatives) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$confirm(
          "¿Estás seguro que deseas actualizar estos documentos?",
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
                  .put("/invoices/documents", {
                    documents: correlatives.map((d) => {
                      return {
                        id: d.id,
                        authorization: d.authorization,
                        initial: d.initial,
                        final: d.final,
                        current: d.current,
                        documentType: d.documentType.id,
                      };
                    }),
                  })

                  .then((res) => {
                    this.$notify.success({
                      title: "Exito",
                      message: res.data.message,
                    });
                    this.fetchDocuments();
                    this.pageloading = true;
                  })
                  .catch((err) => {
                    instance.confirmButtonLoading = false;
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
              } else {
                instance.confirmButtonLoading = false;
                done();
              }
            },
          }
        );
      });
    },
    sumitModelInvoice(formName, modelInvoice) {
      console.log(formName, modelInvoice);
    },
  },
  computed: {
    activeZones() {
      return this.zones.filter((zone) => zone.active);
    },
  },
};
</script>

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
      <el-form :model="invoiceModel" ref="invoiceModel" v-loading="pageloading">
        <!-- Encabezado y tamaño de texto  -->
        <div class="grid grid-cols-12">
          <el-form-item class="col-span-3">
            <span class="font-semibold">Encabezado</span>
          </el-form-item>
          <el-form-item class="col-span-3" prop="fontSizeHeader">
            <div class="inline-flex space-x-2">
              <div class="flex-1 text-xs">Tamaño de texto</div>
              <div class="flex-1">
                <el-input-number
                  v-model="invoiceModel.fontSizeHeader"
                  :min="1"
                  :max="16"
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
                  class="w-full"
                  size="small"
                ></el-input-number>
              </div>
            </div>
          </el-form-item>
        </div>
        <!-- Correlativo, Secuencia, Fecha  -->
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.invoice_authorization.show"
              >Correlativo</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Medida de X" prop="invoice_authorization">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.invoice_authorization.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.invoice_authorization.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de Y">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.invoice_authorization.y"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.invoice_authorization.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de L">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.invoice_authorization.length"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.invoice_authorization.show"
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
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.invoice_number.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.invoice_number.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de Y">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.invoice_number.y"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.invoice_number.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de L">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.invoice_number.length"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.invoice_number.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.invoice_date.show"
              >Fecha</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.invoice_date.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.invoice_date.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de Y">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.invoice_date.y"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.invoice_date.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de L">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.invoice_date.length"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.invoice_date.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
        <!-- Cliente, Direccion 1 y Direccion 2 -->
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.customer_name.show"
              >Cliente</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_name.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_name.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de Y">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_name.y"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_name.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de L">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_name.length"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_name.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.customer_address1.show"
              >Dirección 1</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Medida de X" prop="customer_address1.x">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_address1.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_address1.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de Y">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_address1.y"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_address1.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de L">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_address1.length"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_address1.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.customer_address2.show"
              >Dirección 2</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_address2.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_address2.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de Y">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_address2.y"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_address2.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de L">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_address2.length"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_address2.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
        <!--NRC NIT DUI  -->
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.customer_nrc.show"
              >NRC</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_nrc.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_nrc.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de Y">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_nrc.y"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_nrc.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de L">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_nrc.length"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_nrc.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.customer_nit.show"
              >NIT</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_nit.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_nit.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de Y">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_nit.y"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_nit.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de L">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_nit.length"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_nit.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.customer_dui.show"
              >DUI</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_dui.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_dui.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de Y">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_dui.y"
                      :min="1"
                      controls-position="right"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_dui.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de L">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_dui.length"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_dui.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
        <!-- Departamento Ciudad Giro-->
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.customer_state.show"
              >Departamento</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_state.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_state.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de Y">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_state.y"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_state.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de L">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_state.length"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_state.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.customer_city.show"
              >Ciudad</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_city.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_city.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de Y">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_city.y"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_city.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de L">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_city.length"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_city.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.customer_giro.show"
              >Giro</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_giro.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_giro.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de Y">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_giro.y"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_giro.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de L">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.customer_giro.length"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.customer_giro.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
        <!-- Ventas a cuenta de, Condición de pago -->
        <div class="grid grid-cols-12 border-b-2 gap-4">
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.seller_name.show"
              >Ventas a cuenta de</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.seller_name.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.seller_name.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de Y">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.seller_name.y"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.seller_name.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de L">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.seller_name.length"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.seller_name.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.payment_condition.show"
              >Condición de pago</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-2">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.payment_condition.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.payment_condition.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de Y">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.payment_condition.y"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.payment_condition.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-2">
                <el-form-item label="Medida de L">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.payment_condition.length"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.payment_condition.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
        <!-- DETALLES-->
        <div class="grid grid-cols-12">
          <el-form-item class="col-span-3">
            <span class="font-semibold">Detalles</span>
          </el-form-item>
          <el-form-item class="col-span-3">
            <div class="inline-flex space-x-2">
              <div class="flex-1 text-xs">Tamaño de texto</div>
              <div class="flex-1">
                <el-input-number
                  v-model="invoiceModel.fontSizeDetails"
                  :min="1"
                  :max="16"
                  class="w-full"
                  size="small"
                ></el-input-number>
              </div>
            </div>
          </el-form-item>
          <el-form-item class="col-span-3">
            <div class="inline-flex space-x-2">
              <div class="flex-1 text-xs">Alto</div>
              <div class="flex-1">
                <el-input-number
                  v-model="invoiceModel.heigth"
                  :min="1"
                  class="w-full"
                  size="small"
                ></el-input-number>
              </div>
            </div>
          </el-form-item>
          <el-form-item class="col-span-3">
            <div class="inline-flex space-x-2">
              <div class="flex-1 text-xs">Ancho</div>
              <div class="flex-1">
                <el-input-number
                  v-model="invoiceModel.position_y"
                  :min="1"
                  class="w-full"
                  size="small"
                ></el-input-number>
              </div>
            </div>
          </el-form-item>
        </div>
        <!-- cant  descripcion  preciounitario -->
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.charge_quantity.show"
              >Cantidad</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-3">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.charge_quantity.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.charge_quantity.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-3">
                <el-form-item label="Medida L">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.charge_quantity.length"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.charge_quantity.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.charge_description.show"
              >Descripción</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-3">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.charge_description.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.charge_description.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-3">
                <el-form-item label="Medida de L">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.charge_description.length"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.charge_description.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.price.show"
              >Precio unitario</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-3">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.price.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.price.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-3">
                <el-form-item label="Medida de L">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.price.length"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.price.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-12 border-b-2 gap-4">
          <div class="col-span-4 space-x-2">
            <el-checkbox v-model="invoiceModel.sujeto.show"
              >Venta No sujetas</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-3">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.sujeto.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.sujeto.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-3">
                <el-form-item label="Medida L">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.sujeto.length"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.sujeto.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.exento.show"
              >Venta exentas</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-3">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.exento.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.exento.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-3">
                <el-form-item label="Medida de L">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.exento.length"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.exento.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.afecto.show"
              >Ventas afectas</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-3">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.afecto.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.afecto.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-3">
                <el-form-item label="Medida de L">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.afecto.length"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.afecto.show"
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
                  v-model="invoiceModel.fontSizeTotals"
                  :min="1"
                  :max="16"
                  class="w-full"
                  size="small"
                ></el-input-number>
              </div>
            </div>
          </el-form-item>
        </div>
        <!-- Venta total (Text), Suma, IVA -->
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.venta_total_text.show"
              >Venta total (Text)</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-3">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.venta_total_text.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.venta_total_text.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-3">
                <el-form-item label="Medida Y">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.venta_total_text.y"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.venta_total_text.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.sum.show">Suma</el-checkbox>
            <div class="grid grid-cols-6">
              <div class="col-span-3">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.sum.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.sum.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-3">
                <el-form-item label="Medida de Y">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.sum.y"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.sum.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.iva.show">IVA</el-checkbox>
            <div class="grid grid-cols-6">
              <div class="col-span-3">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.iva.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.iva.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-3">
                <el-form-item label="Medida de Y">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.iva.y"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.iva.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
        <!-- Sub total, IVA retenido, Venta no sujeta -->
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.subtotal.show"
              >Sub total</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-3">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.subtotal.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.subtotal.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-3">
                <el-form-item label="Medida Y">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.subtotal.y"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.subtotal.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.iva_retenido.show"
              >IVA retenido</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-3">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.iva_retenido.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.iva_retenido.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-3">
                <el-form-item label="Medida de Y">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.iva_retenido.y"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.iva_retenido.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.ventas_no_sujetas.show"
              >Venta no sujeta</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-3">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.ventas_no_sujetas.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.ventas_no_sujetas.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-3">
                <el-form-item label="Medida de Y">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.ventas_no_sujetas.y"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.ventas_no_sujetas.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
        <!-- Ventas exentas, Venta total, Venta total text-->
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.ventas_exentas.show"
              >Ventas exentas</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-3">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.ventas_exentas.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.ventas_exentas.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-3">
                <el-form-item label="Medida Y">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.ventas_exentas.y"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.ventas_exentas.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="col-span-4">
            <el-checkbox v-model="invoiceModel.venta_total.show"
              >Venta total</el-checkbox
            >
            <div class="grid grid-cols-6">
              <div class="col-span-3">
                <el-form-item label="Medida de X">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.venta_total.x"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.venta_total.show"
                    >
                    </el-input-number>
                  </template>
                </el-form-item>
              </div>
              <div class="col-span-3">
                <el-form-item label="Medida de Y">
                  <template>
                    <el-input-number
                      v-model="invoiceModel.venta_total.y"
                      controls-position="right"
                      :min="1"
                      style="width: 90%"
                      size="small"
                      :disabled="!invoiceModel.venta_total.show"
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
            <el-form-item prop="cashPayment" label="Tipo de pago">
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
                min-width="240"
              />
              <el-table-column label="Tipo de pago" min-width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.cashPayment">Contado</span>
                  <span v-else>Crédito</span>
                </template>
              </el-table-column>
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
                      <el-link
                        :disabled="correlative.id == null"
                        @click="
                          (closeDialog = true),
                            saveIdCorrelative(correlative.documentType.id)
                        "
                      >
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
      <!-- tab de Integraciones  -->
      <el-tab-pane
        label="Integraciones"
        name="integraciones"
        v-if="hasModule(['a98b98e6-b2d5-42a3-853d-9516f64eade8'])"
      >
        <div class="grid grid-cols-12">
          <div class="col-span-12">
            <Notification
              class="mb-4 w-full"
              type="info"
              title="Información"
              message=" En esta sección se realizan las configuraciones de integración con
            otros modulos de manera general. Estas configuraciones se aplicarán
            a todos los servicios que no tengan una configuración individual."
            />
          </div>
        </div>

        <div class="flex flex-col space-y-2">
          <el-form
            label-position="top"
            :model="integrationSettingForm"
            :rules="integrationSettingFormRules"
            ref="integrationSettingForm"
            @submit.native.prevent="
              submitSettingsIntegrations(
                'integrationSettingForm',
                integrationSettingForm
              )
            "
          >
            <div class="flex flex-col space-y-2">
              <div class="grid grid-cols-12 gap-4">
                <el-form-item class="mt-3">
                  <el-switch
                    v-model="integrationSettingForm.active"
                  ></el-switch>
                </el-form-item>
                <el-form-item
                  label="Cuenta para pagos de contado"
                  class="col-span-4"
                  prop="accountingCatalog"
                  v-if="hasModule('a98b98e6-b2d5-42a3-853d-9516f64eade8')"
                >
                  <el-select
                    v-model="integrationSettingForm.accountingCatalog"
                    placeholder="Ingrese el codigo o el  Nombre de la cuenta"
                    size="small"
                    :loading="loadingAccount"
                    remote
                    class="w-full"
                    clearable
                    filterable
                    default-first-option
                    :remote-method="findAccount"
                    @focus="filteredCatalog = []"
                    :disabled="!integrationSettingForm.active"
                  >
                    <el-option
                      v-for="c in filteredCatalog"
                      :key="c.id"
                      :label="`${c.code}-${c.name}`"
                      :value="c.id"
                      :disabled="c.isParent == true"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  prop="registerType"
                  label="Tipo de integración contable"
                  class="col-span-5"
                  v-if="hasModule('a98b98e6-b2d5-42a3-853d-9516f64eade8')"
                >
                  <el-radio-group
                    class="w-full"
                    v-model="integrationSettingForm.registerType"
                    :disabled="!integrationSettingForm.active"
                  >
                    <el-row :gutter="15">
                      <el-col :span="8">
                        <el-radio
                          border
                          label="automatic"
                          size="small"
                          class="w-full"
                          :disabled="true"
                          >Automático</el-radio
                        >
                      </el-col>
                      <el-col :span="8">
                        <el-radio
                          border
                          label="manual"
                          size="small"
                          class="w-full"
                          >Manual</el-radio
                        >
                      </el-col>
                    </el-row>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
            <div class="flex flex-row justify-end">
              <el-button
                :disabled="!integrationSettingForm.active"
                type="primary"
                size="small"
                native-type="submit"
                >Guardar</el-button
              >
              <el-button
                :disabled="!integrationSettingForm.active"
                size="small"
                @click="$router.push('/invoices')"
                >Cancelar</el-button
              >
            </div>
          </el-form>
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
  parseErrors,
} from "../../tools";

export default {
  name: "InvoicesSettings",
  components: { LayoutContent, Notification },
  fetch() {
    // Se ubica en el tab correcto
    if (this.$route.query.tab) {
      this.tab = this.$route.query.tab;
    }
    const accounts = () => {
      return this.$axios.get("/entries/catalog");
    };
    const zones = () => {
      return this.$axios.get("/invoices/zones");
    };
    const sellers = () => {
      return this.$axios.get("/invoices/sellers");
    };
    const payment = () => {
      return this.$axios.get("/invoices/payment-condition");
    };
    const documents = () => {
      return this.$axios.get("/invoices/documents");
    };
    const settingIntegration = () => {
      return this.$axios.get("/entries/setting/integrations");
    };
    Promise.all([
      accounts(),
      zones(),
      sellers(),
      payment(),
      documents(),
      settingIntegration(),
    ])
      .then((res) => {
        const [accounts, zones, sellers, payment, documents, integration] = res;
        this.accounts = accounts.data.data;
        this.zones = zones.data.data;
        this.sellers = sellers.data.data;
        this.payments = payment.data.data;
        this.correlativeForm.documents = documents.data.data;
        this.integrationSettingForm.accountingCatalog =
          integration.data.data.catalog;
        this.integrationSettingForm.registerType =
          integration.data.data.registerType;
        this.filteredCatalog = this.accounts.filter(
          (c) => c.id == this.integrationSettingForm.accountingCatalog
        );

        this.pageloading = false;
      })
      .catch((err) => {
        this.errorMessage = err.response.data.message;
      });
  },
  fetchOnServer: false,
  data() {
    return {
      pageloading: true,
      loadingAccount: false,
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
      catalogs: [],
      filteredCatalog: [],
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
        idDocument: "",
        configuration: "positions",
        fontSizeHeader: "",
        fontSizeDetails: "",
        fontSizeTotals: "",
        resolution: {
          width: "",
          height: "",
        },
        invoice_authorization: {
          x: "",
          y: "",
          length: "",
          value: "invoice_authorization",
          show: false,
        },
        invoice_number: {
          x: "",
          y: "",
          length: "",
          value: "invoice_number",
          show: false,
        },
        invoice_date: {
          x: "",
          y: "",
          length: "",
          value: "invoice_date",
          show: false,
        },
        customer_name: {
          x: "",
          y: "",
          length: "",
          value: "customer_name",
          show: false,
        },
        customer_address1: {
          x: "",
          y: "",
          length: "",
          value: "customer_address1",
          show: false,
        },
        customer_address2: {
          x: "",
          y: "",
          length: "",
          value: "customer_address2",
          show: false,
        },
        customer_nrc: {
          x: "",
          y: "",
          length: "",
          value: "customer_nrc",
          show: false,
        },
        customer_nit: {
          x: "",
          y: "",
          length: "",
          value: "customer_nit",
          show: false,
        },
        customer_dui: {
          x: "",
          y: "",
          length: "",
          value: "customer_dui",
          show: false,
        },
        customer_state: {
          x: "",
          y: "",
          length: "",
          value: "customer_state",
          show: false,
        },
        customer_city: {
          x: "",
          y: "",
          length: "",
          value: "customer_city",
          show: false,
        },
        customer_giro: {
          x: "",
          y: "",
          length: "",
          value: "customer_giro",
          show: false,
        },
        seller_name: {
          x: "",
          y: "",
          length: "",
          value: "seller_name",
          show: false,
        },
        payment_condition: {
          x: "",
          y: "",
          length: "",
          value: "payment_condition",
          show: false,
        },
        //Campo para Detalles
        position_y: "",
        heigth: "",
        charge_quantity: {
          x: "",
          length: "",
          value: "charge_quantity",
          show: false,
          type: "text",
        },
        charge_description: {
          x: "",
          length: "",
          value: "charge_description",
          show: false,
          type: "text",
        },
        price: {
          x: "",
          length: "",
          value: "unit_price",
          show: false,
          type: "text",
        },
        sujeto: {
          x: "",
          length: "",
          value: "venta_sujeta",
          show: false,
          type: "text",
        },
        exento: {
          x: "",
          length: "",
          value: "venta_excenta",
          show: false,
          type: "text",
        },
        afecto: {
          x: "",
          length: "",
          value: "venta_afecta",
          show: false,
          type: "text",
        },
        //TOTALES
        venta_total_text: {
          x: "",
          y: "",
          value: "venta_total_text",
          show: false,
        },
        sum: {
          x: "",
          y: "",
          value: "sum",
          show: false,
        },
        iva: {
          x: "",
          y: "",
          value: "iva",
          show: false,
        },
        subtotal: {
          x: "",
          y: "",
          value: "subtotal",
          show: false,
        },
        iva_retenido: {
          x: "",
          y: "",
          value: "iva_retenido",
          show: false,
        },
        ventas_no_sujetas: {
          x: "",
          y: "",
          value: "ventas_no_sujetas",
          show: false,
        },
        ventas_exentas: {
          x: "",
          y: "",
          value: "ventas_exentas",
          show: false,
        },
        venta_total: {
          x: "",
          y: "",
          value: "venta_total",
          show: false,
        },
      },
      integrationSettingForm: {
        accountingCatalog: "",
        registerType: "manual",
        active: false,
      },
      integrationSettingFormRules: {
        accountingCatalog: selectValidation(true, "change"),
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
                    dangerouslyUseHTMLString: true,
                    message: parseErrors(err.response.data.message),
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
                    dangerouslyUseHTMLString: true,
                    message: parseErrors(err.response.data.message),
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
                    dangerouslyUseHTMLString: true,
                    message: parseErrors(err.response.data.message),
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
                    dangerouslyUseHTMLString: true,
                    message: parseErrors(err.response.data.message),
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
                    dangerouslyUseHTMLString: true,
                    message: parseErrors(err.response.data.message),
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
                    dangerouslyUseHTMLString: true,
                    message: parseErrors(err.response.data.message),
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
                      dangerouslyUseHTMLString: true,
                      message: parseErrors(err.response.data.message),
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
                      dangerouslyUseHTMLString: true,
                      message: parseErrors(err.response.data.message),
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
                      dangerouslyUseHTMLString: true,
                      message: parseErrors(err.response.data.message),
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
                      dangerouslyUseHTMLString: true,
                      message: parseErrors(err.response.data.message),
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
                      dangerouslyUseHTMLString: true,
                      message: parseErrors(err.response.data.message),
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
                    this.$notify.error({
                      title: "Error",
                      dangerouslyUseHTMLString: true,
                      message: parseErrors(err.response.data.message),
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
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }
        const headerNames = [
          "invoice_authorization",
          "invoice_number",
          "invoice_date",
          "customer_name",
          "customer_address1",
          "customer_address2",
          "customer_nrc",
          "customer_nit",
          "customer_dui",
          "customer_state",
          "customer_city",
          "customer_giro",
          "seller_name",
          "payment_condition",
        ];

        const header = [];
        for (const h of headerNames) {
          const found = { ...modelInvoice[h] };
          if (found && found.show) {
            delete found.show;
            header.push(found);
          }
        }

        const detailsFields = {
          quantity: "charge_quantity",
          description: "charge_description",
          price: "price",
          sujeto: "sujeto",
          exento: "exento",
          afecto: "afecto",
        };

        const details = {};
        const detailsValues = Object.values(detailsFields);

        for (const d of detailsValues) {
          const found = { ...modelInvoice[d] };
          if (found && found.show) {
            delete found.show;
            const objectKey = Object.keys(detailsFields).find(
              (key) => detailsFields[key] === d
            );
            details[objectKey] = found;
          }
        }

        const detailTotals = [
          "venta_total_text",
          "sum",
          "iva",
          "subtotal",
          "iva_retenido",
          "ventas_no_sujetas",
          "ventas_exentas",
          "venta_total",
        ];

        const totals = [];
        for (const t of detailTotals) {
          const found = { ...modelInvoice[t] };
          if (found && found.show) {
            delete found.show;
            totals.push(found);
          }
        }
        this.$confirm(
          "¿Estás seguro que deseas guardar la configuración?",
          "Confirmación",
          {
            confirmButtonText: "Si, guardar",
            cancelButtonText: "Cancelar",
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "Procesando...";
                this.$axios
                  .put(
                    `/invoices/documents/documentlayout/${modelInvoice.idDocument}`,
                    {
                      configuration: modelInvoice.configuration,
                      resolution: [
                        modelInvoice.resolution.width,
                        modelInvoice.resolution.height,
                      ],
                      fontSizeHeader: modelInvoice.fontSizeHeader,
                      fontSizeDetails: modelInvoice.fontSizeDetails,
                      fontSizeTotals: modelInvoice.fontSizeTotals,
                      header: [...header],
                      details: {
                        position_y: modelInvoice.position_y,
                        heigth: modelInvoice.heigth,
                        ...details,
                      },
                      totals: [...totals],
                    }
                  )

                  .then((res) => {
                    this.$notify.success({
                      title: "Exito",
                      message: res.data.message,
                    });
                    this.closeDialog = false;
                  })
                  .catch((err) => {
                    instance.confirmButtonLoading = false;
                    this.$notify.error({
                      title: "Error",
                      dangerouslyUseHTMLString: true,
                      message: parseErrors(err.response.data.message),
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
    saveIdCorrelative(index) {
      this.invoiceModel.idDocument = index;
      this.$axios.get(`/invoices/documents/${index}/layout`).then((res) => {
        const layout = res.data.data;
        if (layout !== null) {
          const { header, details, totals } = layout;

          this.invoiceModel.fontSizeHeader = layout.fontSizeHeader;
          this.invoiceModel.fontSizeDetails = layout.fontSizeDetails;
          this.invoiceModel.fontSizeTotals = layout.fontSizeTotals;

          for (const h of header) {
            let value = {};
            if (h.hasOwnProperty("position")) {
              const x = h.position[0][0];
              const y = h.position[0][1];
              const length = h.lenght;
              delete h.position;
              value = {
                ...h,
                x,
                y,
                length,
                show: true,
              };
            } else {
              value = {
                ...h,
                show: true,
              };
            }
            this.invoiceModel[h.value] = value;
          }

          const detailsFields = [
            "position_y",
            "heigth",
            "quantity",
            "description",
            "price",
            "sujeto",
            "exento",
            "afecto",
          ];

          for (const d of detailsFields) {
            if (details[d]) {
              let value = {};
              if (details[d].hasOwnProperty("position")) {
                const x = details[d].position[0];
                delete details[d].position;
                value = {
                  ...details[d],
                  x,
                  length: 10,
                  show: true,
                };
              } else {
                value = {
                  ...details[d],
                  show: true,
                };
              }
              this.invoiceModel[d] =
                typeof details[d] == "object"
                  ? d == "quantity"
                    ? (this.invoiceModel["charge_quantity"] = value)
                    : d == "description"
                    ? (this.invoiceModel["charge_description"] = value)
                    : value
                  : details[d];
            }
          }

          for (const t of totals) {
            let value = {};
            if (t.hasOwnProperty("position")) {
              const x = t.position[0];
              const y = t.position[1];
              delete t.position;
              value = {
                ...t,
                x,
                y,
                show: true,
              };
            } else {
              value = {
                ...t,
                show: true,
              };
            }
            this.invoiceModel[t.value] = value;
          }

          this.pageloading = false;
        }
      });
    },
    findAccount(query) {
      if (query !== "") {
        this.loadingAccount = true;
        this.$axios
          .get("entries/catalog", { params: { search: query.toLowerCase() } })
          .then((res) => {
            this.filteredCatalog = res.data.data;
            this.loadingAccount = false;
          })
          .catch((err) => (this.errorMessage = err.response.data.message));
      } else {
        this.filteredCatalog = [];
      }
    },
    submitSettingsIntegrations(formName, { accountingCatalog, registerType }) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }
        this.$confirm(
          "¿Estás seguro que deseas guardar esta configuración?",
          "Confirmación",
          {
            confirmButtonText: "Si, guardar",
            cancelButtonText: "Cancelar",
            type: "warning",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "Procesando...";
                this.$axios
                  .put("/entries/setting/integrations", {
                    accountingCatalog,
                    registerType,
                  })
                  .then((res) => {
                    this.$notify.success({
                      title: "Exito",
                      message: res.data.message,
                    });
                    this.pageloading = true;
                    this.fetchIntegration();
                  })
                  .catch((err) => {
                    this.$notify.error({
                      title: "Error",
                      dangerouslyUseHTMLString: true,
                      message: parseErrors(err.response.data.message),
                    });
                  })
                  .then((alw) => {
                    instance.confirmButtonLoading = false;
                    instance.confirmButtonText = "Si, guardar";
                    done();
                  });
              } else {
                instance.confirmButtonLoading = false;
                instance.confirmButtonText = "Si, guardar";
                done();
              }
            },
          }
        );
      });
    },
    fetchIntegration() {
      this.$axios
        .get("/entries/setting/integrations")
        .then((res) => {
          this.integrationSettingForm.accountingCatalog = res.data.data.catalog;
          this.filteredCatalog = this.catalogs.filter(
            (c) => c.id == this.integrationSettingForm.accountingCatalog
          );
          this.pageloading = false;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        })
        .then((alw) => (this.pageloading = false));
    },
    hasModule(modules) {
      return hasModule(modules, this.$auth.user);
    },
  },
  computed: {
    activeZones() {
      return this.zones.filter((zone) => zone.active);
    },
  },
};
</script>

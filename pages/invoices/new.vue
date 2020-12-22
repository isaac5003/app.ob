<template>
  <layout-content
    v-loading="loading"
    page-title="Nueva Factura"
    :breadcrumb="[
      { name: 'Facturas', to: '/invoices' },
      
      { name: 'Nueva factura', to: null },
    ]"
  >
    <el-form
      :model="invoicesNewForm"
      :rules="invoicesNewFormRules"
      status-icon
      ref="customersNewInvoice"
     
     
    
    >
   <div class="flex flex-col space-y-4">
    <div class="flex flex-col ">
        <!-- first row -->
        <div class="grid grid-cols-12 gap-4">
          <!-- tipo de documento -->
          <div class="col-span-3">
            <el-form-item label="Tipo de documento" prop="document">
                <el-select v-model="value" class="w-full" size="small" clearable placeholder="Seleccionar">
                  <el-option
                    v-for="item in documents"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
          </div>
          <!-- n° autorizacion -->
          <div class="col-span-2 col-start-7">
            <el-form-item label="N° de autorización" >
              <el-input
                size="small"
                placeholder=""
                v-model="input"
                :disabled="true">
              </el-input>
             </el-form-item>
          </div>
           <!-- n° Correlativo -->
          <div class="col-span-2">
            <el-form-item label="N° de correlativo" >
              <el-input
                size="small"
                placeholder=""
                v-model="input"
                :disabled="true">
              </el-input>
            </el-form-item>
          </div>
          <!-- Fecha Factura -->
          <div class="col-span-2">
            <el-form-item label="Fecha de factura" >
              <el-date-picker
                v-model="value2"
                size="small"
                type="date"
                placeholder=""
                :picker-options="pickerOptions"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </div>
        </div>

        <!-- second row -->
        <div class="grid grid-cols-12 gap-4">
          <!-- cliente -->
          <div class="col-span-3">
           <el-form-item label="Cliente" prop="name">
                <el-select v-model="value" class="w-full" clearable filterable placeholder="Seleccionar">
                  <el-option
                    v-for="item in clientes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
             </el-form-item>
          
          </div>
          <!-- sucursal -->
          <div class="col-span-3">
            <el-form-item  label="Sucursal" prop="name">
                <el-select v-model="value" class="w-full" clearable filterable  size="small" placeholder="Seleccionar">
                  <el-option
                    v-for="item in sucursales"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
             </el-form-item>
          </div>
          <!-- condiciones de pago -->
          <div class="col-span-3">
            <el-form-item label="Condiciones de pago"  prop="name">
              <el-select v-model="value" size="small" class="w-full" clearable filterable  placeholder="Seleccionar">
                    <el-option
                      v-for="item in paymants"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
            </el-form-item>
          </div>
          
          <!-- Venta a cuenta de -->
          <div class="col-span-3">
            <el-form-item label="Venta a cuenta de" >
              <el-select v-model="value" class="w-full" size="small" clearable filterable placeholder="Seleccionar">
                <el-option
                  v-for="item in sellers"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          
          
        </div>

        <!-- third row -->
        <div class="grid grid-cols-12 gap-4 text-xs">
         
          <!-- NRC -->
          <div class="col-span-1">
            <span>NRC</span>
          </div>
          <!-- NIT -->
          <div class="col-span-2"> 
            <span>NIT</span>
          </div>
          <!-- Direccion -->
          <div class="col-span-3">
            <span>Dirección</span>
          </div>
          <!-- departamento -->
          <div class="col-span-2">
            <span>Departamento</span>
          </div>
          <!-- Municipio -->
          <div class="col-span-2">
            <span>Municipio</span>
          </div>
          <!-- Giro -->
          <div class="col-span-2">
            <span>Giro</span>
          </div>
        </div>

        <!-- fourth row btn agregarservicio -->
        
         <div  class="flex justify-end">
              <el-button type="primary" size="small" @click="dialogVisible = true"
              >Agregar Servicio</el-button>
        </div>
      

        <!-- dialogo -->
        <el-dialog
          title="Agregar Servicio"
          :visible.sync="dialogVisible"
          width="35%"
          :before-close="handleClose"
          >
          <div class="flex flex-col">
            <!-- first row -->
            <div class="grid grid-cols-12">
              <!-- Servicio -->
              <div class="col-span-12 ">
                
                <el-form-item label="Servicio" prop="service">
                    <el-select v-model="value" clearable size="small" class="w-full" placeholder="Seleccionar servicio">
                      <el-option
                        v-for="item in services"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>
              
              </div>

            </div>
            <!-- second row -->
            <div class="grid grid-cols-12 ">
              <!-- Cantidad -->
              <div class="col-span-5 w-full ">
                
                <el-form-item label="Cantidad" >
                    <el-input-number  :disabled="true" size="small" v-model="numcant" controls-position="right" :min="1" :max="10">

                    </el-input-number>
                </el-form-item>
              
              </div>

              <!-- precio -->
               <div class="col-span-7">
            
                  <el-form-item label="Precio" >
                  
                    <div class="w-full flex flex-row items-center">
                     <el-input-number  :disabled="true" size="small" v-model="numcant" controls-position="right"  :min="1" :max="10">

                    </el-input-number>
                      <div class="border-2 h-8 border-gray-300 rounded-sm bg-gray-100 px-2 flex items-center">
                        <el-checkbox v-model="checked1" size="small" disabled>
                           IVA incl.
                        </el-checkbox>
                      </div>
                    </div>
                 
                  </el-form-item>
               </div>
            </div>

            <!-- third row -->
            <div class="grid grid-cols-12">
              <!--Descripcion -->
              <div class="col-span-12">
                
                <el-form-item label="Descripción" prop="name">
                    <el-input
                      type="textarea"
                      :rows="5"
                      size="small"
                      v-model="textarea"
                      :disabled="true">
                    </el-input>
                </el-form-item>
              
              </div>

            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
          </span>
        </el-dialog>

     </div>

      <!-- table row -->
     <div class="grid grid-cols-12">
      <div class="col-span-12">
        <el-table
          :data="facturas"
          style="width: 100%"
          stripe
          size="small">
          <el-table-column
            type="index"
            label="#"
          />
          
          <el-table-column
            prop="quantity"
            label="Cant."
            min-width="50">
          </el-table-column>
          <el-table-column
            prop="details"
            label="Descripción"
            width="270">
            
          </el-table-column>
          <el-table-column
            prop="precuni"
            label="Precio Unit."
            min-width="75"
            align="right">
          </el-table-column>
          <el-table-column
            prop="vnosujeta"
            label="V. No sujeta"
             min-width="75"
            align="right">
          </el-table-column>
          <el-table-column
            prop="vexenta"
            label="V. Exenta"
             min-width="75"
            align="right">
          </el-table-column>
          <el-table-column
            prop="vgrabada"
            label="V. Grabada"
             min-width="75"
            align="right">
          </el-table-column>
          <el-table-column
            prop="name"
            min-width="80">
          </el-table-column>
        </el-table>
    </div>  
     </div>
     
     <!-- sumas -->
      <div class="grid grid-cols-12">
        <div class="grid col-span-4 col-start-9 text-sm">
          <div class="divide-y divide-gray-300">
            <!-- espacio en blanco -->
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-5 col-start-5 ">
               
            </div>
            </div>
            <!-- first row -->
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-5 col-start-5 ">
                <div class="text-right text-blue-800">
                  SUMAS:
                </div>
              </div>
                <div class="col-span-2 col-start-11 ">
                <div class="text-right text-gray-800">
                  $0.00
                </div>
              </div>
            </div>
            <!-- second row -->
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-5 col-start-5 ">
                <div class="text-right text-blue-800">
                  Subtotal:
                </div>
              </div>
                <div class="col-span-2 col-start-11 ">
                <div class="text-right text-gray-800">
                  $0.00
                </div>
              </div>
            </div>
            <!-- third row -->
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-5 col-start-5 ">
                <div class="text-right text-blue-800">
                  Iva retenido:
                </div>
              </div>
                <div class="col-span-2 col-start-11 ">
                <div class="text-right text-gray-800">
                  $0.00
                </div>
              </div>
            </div>
             <!-- fourth row -->
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-5 col-start-5 ">
                <div class="text-right text-blue-800">
                  Ventas exentas:
                </div>
              </div>
                <div class="col-span-2 col-start-11 ">
                <div class="text-right text-gray-800">
                  $0.00
                </div>
              </div>
            </div>
            <!-- fifth row -->
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-6 col-start-4 ">
                <div class="text-right text-blue-800">
                 Ventas no sujetas:
                </div>
              </div>
                <div class="col-span-2 col-start-11 ">
                <div class="text-right text-gray-800">
                  $0.00
                </div>
              </div>
            </div>
            <!-- sixth row -->
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-5 col-start-5 ">
                <div class="text-right text-blue-800 font-semibold ">
                 Venta total:
                </div>
              </div>
                <div class="col-span-2 col-start-11 ">
                <div class="text-right text-gray-800">
                  $0.00
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
      
    
      <!-- boton guardar cancelar -->
      <div class="flex justify-end " >
        <el-button type="primary" size="small" native-type="submit"
          >Guardar</el-button
        >
        <el-button size="small" 
          >Cancelar</el-button
        >
     </div>
   </div>
    </el-form>
    
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import {
  inputValidation,
  selectValidation,
  checkBeforeLeave,
  checkBeforeEnter,
} from "../../tools";
import Notification from "../../components/Notification";

const storagekey = "new-invoices";

export default {
  name: "InvoicesNew",
  components: { LayoutContent, Notification },
  fetch() {
   

  
      

    checkBeforeEnter(this, storagekey, "customersNewInvoice");
  },
  fetchOnServer: false,
  beforeRouteLeave(to, from, next) {
    checkBeforeLeave(this, storagekey, next);
  },
  data() {
    
    return {
      
      facturas:[
        {
          num: '1',
          cant: '3',
          details: "Hola k ase",
          precuni: "45.55",
          vnosujeta: "hola",
          vexenta: "hola",
          vgrabada: "hola"
        },
      ],
      
      loading: false,
     
      invoicesNewForm: {
       
      },
      invoicesNewFormRules: {
        
      },
      
        sellers: [{
          value: 'Option1',
          label: 'Isaac'
        }, {
          value: 'Option2',
          label: 'Jorbe'
        },
        {
          value: 'Option3',
          label: 'Bryan'
        }],
        services: [{
          value: 'Option1',
          label: 'Servicio 1'
        }, {
          value: 'Option2',
          label: 'Servicio 2'
        }],
       paymants: [{
          value: 'Option1',
          label: 'Contado'
        }, {
          value: 'Option2',
          label: 'Credito'
        }],
        sucursales: [{
          value: 'Option1',
          label: 'Sucursal 1'
        }, {
          value: 'Option2',
          label: 'Sucursal 2'
        }],
        clientes: [{
          value: 'Option1',
          label: 'Cliente 1'
        }, {
          value: 'Option2',
          label: 'Cliente 2'
        }],
      documents: [{
          value: 'Option1',
          label: 'FCF - Consumidor Final'
        }, {
          value: 'Option2',
          label: 'CFC - Crédito Fiscal'
        }],
        value: '',
        dialogVisible: false,
        numcant:[
          {num:1},
          {num:2},
          {num:3},
              ],
          pickerOptions: {
          
          shortcuts: [{
            text: 'Ahora',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: 'Ayer',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: 'Mañana',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 );
              picker.$emit('pick', date);
            }
          }]
        },
         value2: '',
         input: "",
         chkSeller: "",
         chkPaymants: "",
    };
  
  },
  
  methods: {
    handleClose(done) {
        this.$confirm('Are you sure to close this dialog?')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
   
}
}
</script>

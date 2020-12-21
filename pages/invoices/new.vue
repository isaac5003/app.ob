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
     
      @submit.native.prevent="
        submitNewCustomer('customersNewForm', customersNewForm)
      "
    
    >
   <div class="flex flex-col space-y-4">
    <div class="flex flex-col ">
        <!-- first row -->
        <div class="grid grid-cols-12 gap-4">
          <!-- tipo de documento -->
          <div class="col-span-5 flex">
           <div class="isRequired">
             <el-form-item label="Tipo de documento" prop="name">
                <el-select v-model="value" size="small" clearable placeholder="Select">
                  <el-option
                    v-for="item in documents"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
             </el-form-item>
           </div>
          </div>
          <!-- n° autorizacion -->
          <div class="col-span-2">
           <div class="isRequired">
             <el-form-item label="N° de autorización" >
                <el-input
                  size="small"
                  placeholder=""
                  v-model="input"
                  :disabled="true">
              </el-input>
             </el-form-item>
           </div>
          </div>
           <!-- n° Correlativo -->
          <div class="col-span-2">
           <div class="isRequired">
             <el-form-item label="N° de correlativo" >
                <el-input
                  size="small"
                  placeholder=""
                  v-model="input"
                  :disabled="true">
              </el-input>
             </el-form-item>
           </div>
          </div>
          <!-- Fecha Factura -->
          <div class="col-span-2">
           <div class="isRequired">
             <el-form-item label="Fecha de factura" >
                 <el-date-picker
                    v-model="value2"
                    size="small"
                    type="date"
                    placeholder=""
                    :picker-options="pickerOptions">
                 </el-date-picker>
             </el-form-item>
           </div>
          </div>
        </div>

        <!-- second row -->
        <div class="grid grid-cols-12 gap-4">
          <!-- cliente -->
          <div class="col-span-3">
            
             <el-form-item label="Cliente" prop="name">
                <el-select v-model="value" clearable size="small" placeholder="Select">
                  <el-option
                    v-for="item in options"
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
                <el-select v-model="value" clearable size="small" placeholder="Select">
                  <el-option
                    v-for="item in options"
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
               <div class="w-full">
                 <div class="w-full flex flex-row  ">
                  <el-select v-model="value" size="small" placeholder="Select">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <div class="border-2 border-gray-300 rounded-sm bg-gray-100 px-2">
                    <el-checkbox v-model="checked1" size="small" disabled>

                    </el-checkbox>
                  </div>
                </div>
               </div>
              </el-form-item>
              
           
             
            </div>
          
          <!-- Venta a cuenta de -->
           <div class="col-span-3">
            
              <el-form-item label="Condiciones de pago"  prop="name">
               <div class="w-full">
                 <div class="w-full flex flex-row  ">
                  <el-select v-model="value" size="small" placeholder="Select">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <div class="border-2 border-gray-300 rounded-sm bg-gray-100 px-2">
                    <el-checkbox v-model="checked1" size="small"  disabled>

                    </el-checkbox>
                  </div>
                </div>
               </div>
              </el-form-item>
              
           
             
            </div>
          
          
        </div>

        <!-- third row -->
        <div class="flex flex-row grid grid-cols-12 gap-4 text-gray-800">
         
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
        <div class="grid grid-cols-12 ">
         <div class="cols-span-12 col-start-11 col-end-12 ">
              <el-button type="primary" size="small" @click="dialogVisible = true"
              >Agregar Servicio</el-button>
        </div>
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
                        v-for="item in options"
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
                    <el-input-number  :disabled="true" size="small" v-model="numcant" controls-position="right" @change="handleChange" :min="1" :max="10">

                    </el-input-number>
                </el-form-item>
              
              </div>

              <!-- precio -->
               <div class="col-span-7">
            
                  <el-form-item label="Precio" >
                  
                    <div class="w-full flex flex-row items-center">
                     <el-input-number  :disabled="true" size="small" v-model="numcant" controls-position="right" @change="handleChange" :min="1" :max="10">

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
        <el-table class="text-lg font-light"
          :data="[]"
          style="width: 100%">
          <el-table-column
            prop="Num"
            label="#"
            width="50">
          </el-table-column>
          <el-table-column
            prop="cant"
            label="Cant."
            width="90">
          </el-table-column>
          <el-table-column
            prop="details"
            label="Descripción"
            width="400">>
            
          </el-table-column>
          <el-table-column
            prop="precuni"
            label="Precio Unit.">
          </el-table-column>
          <el-table-column
            prop="vnosujeta"
            label="V. No sujeta">
          </el-table-column>
          <el-table-column
            prop="vexenta"
            label="V. Exenta">
          </el-table-column>
          <el-table-column
            prop="vgrabada"
            label="V. Grabada">
          </el-table-column>
        </el-table>
    </div>  
     </div>
      <!-- sumas -->
      <div class="grid grid-cols-12">
        <div class="col-span-5 col-start-8 col-end-13  flex flex-col">
          <div class="divide-y divide-gray-300">
            <div class=" flex flex-row space-x-12 justify-end">
              <div class="text-blue-800 text-right">SUMAS:</div>
              <div class="text-gray-800">hola</div>
            </div>
            <div class=" flex flex-row space-x-12 justify-end">
              <div class="text-blue-800 text-right">Subtotal:</div>
              <div class="text-gray-800">hola</div>
            </div>
            <div class="flex flex-row space-x-12 justify-end">
              <div class="text-blue-800 text-right">Iva retenido:</div>
              <div class="text-gray-800">hola</div>
            </div>
            <div class="flex flex-row space-x-12 justify-end">
              <div class="text-blue-800 text-right">Ventas exentas:</div>
              <div class="text-gray-800">hola</div>
            </div>
            <div class="flex flex-row space-x-12 justify-end">
              <div class="text-blue-800 text-right">Ventas no sujetas:</div>
              <div class="text-gray-800">hola</div>
            </div>
            <div class="flex flex-row space-x-12 justify-end ">
              <div class="text-blue-800 text-right font-semibold">Venta Total:</div>
              <div class="text-gray-800">hola</div>
            </div>
          </div>
        </div>
      </div>

      <!-- boton guardar cancelar -->
      <div class="flex justify-end " v-if="activeTab != 'integrations'">
        <el-button type="primary" size="small" native-type="submit"
          >Guardar</el-button
        >
        <el-button size="small" @click="$router.push('/customers')"
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

const storagekey = "new-customer";

export default {
  name: "InvoicesNew",
  components: { LayoutContent, Notification },
  
  data() {
    return {
      loading: false,
     
      invoicesNewForm: {
       
      },
      invoicesNewFormRules: {
        
      },
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
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: 'Today',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: 'Yesterday',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: 'A week ago',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
         value2: '',
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

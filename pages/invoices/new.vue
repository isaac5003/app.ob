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
      
     
     
    
    >
   <div class="flex flex-col space-y-4">
    <div class="flex flex-col ">
        <!-- first row -->
        <div class="grid grid-cols-12 gap-4">
          <!-- tipo de documento -->
          <div class="col-span-3">
            <el-form-item label="Tipo de documento" prop="document">
                <el-select v-model="invoicesNewForm.document" class="w-full" size="small" clearable placeholder="Seleccionar">
                  <el-option
                    v-for="item in documents"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                     @change="setStorage(invoicesNewForm)">
                  </el-option>
                </el-select>
            </el-form-item>
          </div>
          <!-- n° autorizacion -->
          <div class="col-span-2 col-start-7 ">
            <el-form-item label="N° de autorización" >
              <el-input
                size="small"
                placeholder=""
                v-model="invoicesNewForm.auth"
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
                v-model="invoicesNewForm.correlativo"
                :disabled="true">
              </el-input>
            </el-form-item>
          </div>
          <!-- Fecha Factura -->
          <div class="col-span-2">
            <el-form-item label="Fecha de factura" prop="date">
              <el-date-picker
                v-model="invoicesNewForm.date"
                size="small"
                type="date"
                placeholder=""
                :picker-options="pickerOptions"
                style="width: 100%;"
                @change="setStorage(invoicesNewForm)">
              </el-date-picker>
            </el-form-item>
          </div>
        </div>

        <!-- second row -->
        <div class="grid grid-cols-12 gap-4">
          <!-- cliente -->
          <div class="col-span-4">
           <el-form-item label="Cliente" prop="costumer">
                <el-select v-model="invoicesNewForm.costumer" size="small" class="w-full" clearable filterable default-first-option placeholder="Seleccionar">
                  <el-option
                    v-for="item in clientes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                     @change="setStorage(invoicesNewForm)">
                  </el-option>
                </el-select>
             </el-form-item>
          
          </div>
          <!-- sucursal -->
          <div class="col-span-2">
            <el-form-item  label="Sucursal" prop="office">
                <el-select v-model="invoicesNewForm.office" class="w-full" clearable filterable default-first-option size="small" placeholder="Seleccionar">
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
            <el-form-item label="Condiciones de pago"  prop="paymants">
              <el-select v-model="invoicesNewForm.paymants" size="small" class="w-full" clearable filterable default-first-option placeholder="Seleccionar">
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
            <el-form-item label="Venta a cuenta de" prop="sellfor">
              <el-select v-model="invoicesNewForm.sellfor" class="w-full" size="small" clearable filterable default-first-option placeholder="Seleccionar">
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
          :append-to-body="true"
          >
          <el-form
            :model="newServiceForm"
            status-icon
            :rules="newServiceFormRules"
            
            
          >
          
            <!-- first row -->
            <div class="grid grid-cols-12">
              <!-- Servicio -->
              <div class="col-span-12">
                
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
            <div class="grid grid-cols-12 gap-4 ">
              <!-- Cantidad -->
              <div class="col-span-6">
                
                <el-form-item label="Cantidad" >
                   <el-input
                        step="0.01"
                        size="small"
                        type="number"
                        disabled/>
                </el-form-item>
              </div>

              <!-- precio -->
               <div class="col-span-6">
            
                  <el-form-item label="Precio" >
                  
                    <div class="w-full flex items-center  ">
                     <el-input
                        step="0.01"
                        size="small"
                        type="number"
                        disabled/>
                <el-checkbox
                 
                  border
                  size="small"
                  class="px-3"
                  disabled
                >IVA incl.</el-checkbox>
                    </div>
                 
                  </el-form-item>
               </div>
            </div>

            <!-- third row -->
            <div class="grid grid-cols-12">
              <!--Descripcion -->
              <div class="col-span-12">
                
                <el-form-item label="Descripción" prop="description">
                    <el-input
                      type="textarea"
                      :rows="5"
                      size="small"
                      v-model="descripcion"
                      :disabled="true">
                    </el-input>
                </el-form-item>
              
              </div>

            </div>
          
         
           <!-- boton guardar cancelar -->
            <div class="flex justify-end dialog-footer"  >
                <el-button type="primary" size="small" 
                @click="dialogVisible = false" >Guardar</el-button
                >
                <el-button size="small" 
                  @click="dialogVisible = false">Cancelar</el-button
                >
                
            </div>
          
          </el-form>
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
        <table class="flex justify-end">
            <tbody class="text-sm divide-y divide-gray-300">

              <tr class=" flex  space-x-16">
                <td align="right" class="text-blue-900 w-50" >SUMAS:</td>
                <td align="right" class="text-gray-800">$0.00</td>
              </tr>
              <!-- <tr class="border-t" v-if="newInvoiceForm.documentType === '2'">
                <td align="right" class="text-blue-900" width="200px">13% Iva:</td>
                <td align="right" class="pl-15 pr-2 text-gray-800">{{taxes | formatMoney}}</td>
              </tr> -->
              <tr class="flex  space-x-16">
                <td align="right" class="text-blue-900 w-50" >Subtotal:</td>
                <td align="right" class="text-gray-800">$0.00</td>
              </tr>
              <tr class="flex  space-x-16">
                <td align="right" class="text-blue-900 w-50" >Iva retenido:</td>
                <td align="right" class=" text-gray-800">$0.00</td>
              </tr>
              <tr class="flex  space-x-16">
                <td align="right" class="text-blue-900 w-50" >Ventas exentas:</td>
                <td align="right" class=" text-gray-800">$0.00</td>
              </tr>
              <tr class="flex  space-x-16">
                <td align="right" class="text-blue-900 w-50" >Ventas no sujetas:</td>
                <td align="right" class=" text-gray-800">$0.00</td>
              </tr>
              <tr class="flex  space-x-16">
                <td align="right" class="text-blue-900 font-semibold w-50">Venta total:</td>
                <td align="right" class="text-gray-800">$0.00</td>
              </tr>
            </tbody>
          </table>
          
        
      
    
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
   

  
      

    checkBeforeEnter(this, storagekey, "invoicesNewForm");
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
        document: "",
        auth: "",
        correlativo: "",
        date: "",
        costumer: "",
        office: "",
        paymants:"",
        sellfor: "",


      },
      invoicesNewFormRules: {
        document: selectValidation(true),
        date: selectValidation(true),
        costumer: selectValidation(true),
        office: selectValidation(true),
        paymants: selectValidation(true),
        sellfor: selectValidation(true),
        
        
      
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
         chkIva: "",
         descripcion: "",
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
      setStorage(invoicesNewForm) {
      localStorage.setItem(storagekey, JSON.stringify(invoicesNewForm));
    },
   
}
}
</script>

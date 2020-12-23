<template>
  <layout-content
    v-loading="loading"
    page-title="Nueva Factura"
    :breadcrumb="[
      { name: 'Facturas', to: '/invoices' },
      
      { name: 'Nueva factura', to: null },
    ]"
  >
    <!-- dialogo -->
        <el-dialog
          title="Agregar Servicio"
          :visible.sync="dialogVisible"
          width="35%"
           :close-on-click-modal="false"
          :append-to-body="true"
          @open="openDialog()"
         
          >
          <el-form
            :model="newServiceForm"
            status-icon
            :rules="newServiceFormRules"
             ref="newServiceForm"
            @submit.prevent.native="selectService(newServiceForm.service, 'edit')"
            
          >
          
            <!-- first row -->
            <div class="grid grid-cols-12">
              <!-- Servicio -->
              <div class="col-span-12">
                
                <el-form-item label="Servicio" prop="service">
                    <el-select v-model="newServiceForm.service" clearable filterable @change="selectService(newServiceForm.service, 'new')" size="small" class="w-full" placeholder="Seleccionar servicio">
                      <el-option
                        v-for="s in services"
                        :key="s.id"
                        :label="s.name"
                        :value="s.id"
                         
                         >
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
                        step="1"
                        size="small"
                        type="number"
                        v-model="newServiceForm.quantity"
                        :disabled="newServiceForm.service === ''"/>
                </el-form-item>
              </div>

              <!-- precio -->
               <div class="col-span-6">
            
                  <el-form-item label="Precio" >
                  
                    <div class="w-full flex items-center  ">
                     <el-input
                        v-model="newServiceForm.cost"
                        step="0.01"
                        size="small"
                        type="number"
                        value=""
                        :disabled="newServiceForm.service === ''"/>
                <el-checkbox
                 
                  border
                  size="small"
                  class="px-3"
                  :disabled="newServiceForm.service === ''"
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
                      v-model="newServiceForm.description"
                      
                      maxlength="1000"
                      minlength="5"
                      show-word-limit
                      :disabled="newServiceForm.service === ''">
                    </el-input>
                </el-form-item>
              
              </div>

            </div>
          
         
           <!-- boton guardar cancelar -->
            <div class="flex justify-end dialog-footer"  >
                <el-button type="primary" size="small" 
                 @click.native="selectService(newServiceForm.service, 'edit')" >Guardar</el-button
                >
                <el-button size="small" 
                  @click="dialogVisible = false">Cancelar</el-button
                >
                
            </div>
          
          </el-form>
        </el-dialog>
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
            <el-form-item label="Condiciones de pago"  prop="paymentConditions">
              <el-select v-model="invoicesNewForm.paymentConditions" size="small" class="w-full" clearable filterable default-first-option placeholder="Seleccionar">
                    <el-option
                      v-for="p in paymentConditions"
                      :key="p.value"
                      :label="p.name"
                      :value="p.id">
                    </el-option>
                  </el-select>
            </el-form-item>
          </div>
          
          <!-- Venta a cuenta de -->
          <div class="col-span-3">
            <el-form-item label="Venta a cuenta de" prop="sellers">
              <el-select v-model="invoicesNewForm.sellers" class="w-full" size="small" clearable filterable default-first-option placeholder="Seleccionar">
                <el-option
                  v-for="s in sellers"
                  :key="s.value"
                  :label="s.name"
                  :value="s.id">
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
     const sellers = () => {
      return this.$axios.get("/invoices/sellers");
    };
     const paymentsConditions = () => {
      return this.$axios.get("/invoices/payment-condition");
    };
   
     
     Promise.all([sellers(),paymentsConditions()])
      .then((res) => {
        const [sellers, paymentConditions] = res;
       
        this.sellers = sellers.data.sellers;
        this.paymentConditions = paymentConditions.data.paymentConditions
        this.loading = false;
        
      })
      .catch((err) => {
        console.log(err)
        this.errorMessage = err.response.data.message;
      });

      
      

    // checkBeforeEnter(this, storagekey, "invoicesNewForm");
  },
  fetchOnServer: false,
  beforeRouteLeave(to, from, next) {
    checkBeforeLeave(this, storagekey, next);
  },
  data() {
    
    return {
      
        facturas:[],
        loading: false,
        invoicesNewForm: {
          document: "",
          auth: "",
          correlativo: "",
          date: "",
          costumer: "",
          office: "",
          paymentConditions: null,
          sellers: null,


        },
        invoicesNewFormRules: {
          document: selectValidation(true),
          date: selectValidation(true),
          costumer: selectValidation(true),
          office: selectValidation(true),
          paymentConditions: selectValidation(true),
          sellers: selectValidation(true),
          
          
        
        },
        sellers: [],
        paymentConditions: [],
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
        newServiceForm: {
        service: "",
        quantity: "",
        cost: "",
        description: "",
        incTax: false
      },
      newServiceForm: {
        service: "",
        quantity: "",
        cost: "",
        description: "",
        incTax: false
      },
      newServiceFormRules: {
        service: selectValidation(true),
        // quantity: amountValidate("blur", true, 1),
        // cost: amountValidate("blur", true, 0),
        description: inputValidation(true),
      },
      cost:"",
      services: [],
      description: "",
       selectedService: null,
    };
  
  },
  
  methods: {
    
      setStorage(invoicesNewForm) {
      localStorage.setItem(storagekey, JSON.stringify(invoicesNewForm));
    },
     fetchSellers() {
      let params = this.page;
      this.$axios
        .get("/invoices/sellers")
        .then((res) => {
          this.sellers = res.data.sellers;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        });
    },
    fetchPaymentConditions() {
          let params = this.page;
          this.$axios
            .get("/invoices/payment-condition")
            .then((res) => {
              this.paymentConditions = res.data.paymentConditions;
            
            })
            .catch((err) => {
              console.log(err)
              this.errorMessage = err.response.data.message;
            });
    },
    

    openDialog() {
      
      const services = () => {
      return this.$axios.get("/services");
      };
       
     Promise.all([services()])
      .then((res) => {
        const [services] = res;
       
        this.services = services.data.services;
        
        
        
      })
      .catch((err) => {
        console.log(err)
        this.errorMessage = err.response.data.message;
      });
 
    },
    selectService(id, type) {
     switch(type){
       case "new":
        this.$axios.get(`/services/${id}`)
          .then(res => {
            this.newServiceForm.cost = res.data.service.cost;
            this.newServiceForm.description = res.data.service.description;
          })
          .catch(err => {  this.errorMessage = err.response.data.message;})
        break;
        case "edit":
          let service = {
            cost: 500,
            description: "ELABORACIÓN DE REGLAMENTO INTERNO"
          }
          this.$axios.put(`/services/${id}`, service )
                    .then((res) => { console.log(res)})

        break;
       
     }    
   },
  
      
}
}
</script>

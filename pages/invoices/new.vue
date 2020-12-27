<template>
  <layout-content
    v-loading="loading"
    page-title="Nueva Factura"
    :breadcrumb="[
      { name: 'Facturas', to: '/sales' },

      { name: 'Nueva factura', to: null },
    ]">
    <!-- dialogo -->
    <el-dialog
      title="Agregar Servicio"
      :visible.sync="dialogVisible"
      width="550px"
      :close-on-click-modal="false"
      :append-to-body="true"
      @open="openDialog()"
      @close="closeDialog(newServiceForm)">
      <el-form
        :model="newServiceForm"
        status-icon
        :rules="newServiceFormRules"
        ref="newServiceForm">
        <!-- first row -->
        <div class="grid grid-cols-12">
          <!-- Servicio -->
          <div class="col-span-12">
            <el-form-item label="Servicio" prop="service">
              <el-select
                v-model="newServiceForm.service"
                clearable
                filterable
                @change="selectService(newServiceForm.service, 'new')"
                size="small"
                class="w-full"
                placeholder="Seleccionar servicio">
                <el-option
                  v-for="s in services"
                  :key="s.id"
                  :label="s.name"
                  :value="s.id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <!-- second row -->
        <div class="grid grid-cols-12 gap-4 ">
          <!-- Cantidad -->
          <div class="col-span-6">
            <el-form-item label="Cantidad">
              <el-input-number
                ref="quantity"
                type="number"
                :min="0"
                :step="1"
                v-model="newServiceForm.quantity"
                size="small"
                autocomplete="off"
                style="width: 100%"
                :disabled="newServiceForm.service === ''"           
              />
            </el-form-item>
          </div>
          <!-- precio -->
          <div class="col-span-6">
            <el-form-item label="Precio">
              <div class="w-full flex items-end">
                <el-input-number
                  class="w-full mt-1"
                  ref="cost"
                  type="number"
                  :min="0.0"
                  :step="0.01"
                  v-model="newServiceForm.cost"
                  size="small"
                  autocomplete="off"
                  style="width: 100%"
                  :disabled="newServiceForm.service === ''"
                  :precision="2"
                />
                <el-checkbox
                  border
                  size="small"
                  class="px-3 mt-1"
                  :disabled="newServiceForm.service === ''"
                  >IVA incl.</el-checkbox
                >
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
                maxlength="5000"
                minlength="5"
                show-word-limit
                :disabled="newServiceForm.service === ''"
              >
              </el-input>
            </el-form-item>
          </div>
        </div>
        <!-- boton guardar cancelar -->
        <div class="flex justify-end dialog-footer">
          <el-button
            type="primary"
            size="small"
            @click.native="selectService(newServiceForm.service, 'edit')"
            >Guardar</el-button
          >
          <el-button size="small" @click="dialogVisible = false"
            >Cancelar</el-button
          >
        </div>
      </el-form>
    </el-dialog>
    <!-- noticication -->
  <div class="grid grid-cols-12">
    <div class="col-span-12">
      <Notification
        v-if="activeNotification"
        class=" mb-4 w-full"
        type="danger"
        title="Atención"
        message="No puede dar crédito fiscal a un cliente que no declare IVA."
        
      />
    </div>
    </div>
    <el-form :model="salesNewForm" :rules="salesNewFormRules" status-icon>
      <div class="flex flex-col space-y-4">
        <div class="flex flex-col">
          <!-- first row -->
          <div class="grid grid-cols-12 gap-4">
            <!-- tipo de documento -->
            <div class="col-span-3">
              <el-form-item label="Tipo de documento" prop="document">
                <el-select
                  v-model="salesNewForm.document"
                  class="w-full"
                  size="small"
                  clearable
                  placeholder="Seleccionar"
                  @change="validateDocumentType(salesNewForm.document, tributary)"
                >
                  <el-option
                    v-for="d in documents"
                    :key="d.id"
                    :label="d.code + ' - ' + d.name"
                    :value="d.id"
                    
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <!-- n° autorizacion -->
            <div class="col-span-2 col-start-7 ">
              <el-form-item label="N° de autorización">
                <el-input
                  size="small"
                  placeholder=""
                  v-model="salesNewForm.auth"
                  :disabled="true"
                >
                </el-input>
              </el-form-item>
            </div>
            <!-- n° Correlativo -->
            <div class="col-span-2">
              <el-form-item label="N° de correlativo">
                <el-input
                  size="small"
                  placeholder=""
                  v-model="salesNewForm.correlativo"
                  :disabled="true"
                >
                </el-input>
              </el-form-item>
            </div>
            <!-- Fecha Factura -->
            <div class="col-span-2">
              <el-form-item label="Fecha de factura" prop="date">
                <el-date-picker
                  v-model="salesNewForm.date"
                  size="small"
                  type="date"
                  placeholder=""
                  :picker-options="pickerOptions"
                  style="width: 100%;"
                  @change="setStorage(salesNewForm)"
                >
                </el-date-picker>
              </el-form-item>
            </div>
          </div>
          <!-- second row -->
          <div class="grid grid-cols-12 gap-4">
            <!-- cliente -->
            <div class="col-span-4">
              <el-form-item label="Cliente" prop="customer">
                <el-select
                  v-model="salesNewForm.customer"
                  size="small"
                  class="w-full"
                  clearable
                  filterable
                  default-first-option
                  placeholder="Seleccionar"
                  @change="getCustomerDetails(salesNewForm.customer)"
                >
                  <el-option
                    v-for="c in customers"
                    :key="c.id"
                    :label="c.name"
                    :value="c.id"
                    @change="setStorage(salesNewForm)"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <!-- sucursal -->
            <div class="col-span-2">
              <el-form-item label="Sucursal" prop="branch">
                <el-select
                  v-model="salesNewForm.branch"
                  class="w-full"
                  clearable
                  filterable
                  default-first-option
                  size="small"
                  placeholder="Seleccionar"
                >
                  <el-option
                    v-for="br in branches"
                    :key="br.id"
                    :label="br.name"
                    :value="br.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <!-- condiciones de pago -->
            <div class="col-span-3">
              <el-form-item
                label="Condiciones de pago"
                prop="paymentConditions"
              >
                <el-select
                  v-model="salesNewForm.paymentConditions"
                  size="small"
                  class="w-full"
                  clearable
                  filterable
                  default-first-option
                  placeholder="Seleccionar"
                >
                  <el-option
                    v-for="p in paymentConditions"
                    :key="p.value"
                    :label="p.name"
                    :value="p.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>

            <!-- Venta a cuenta de -->
            <div class="col-span-3">
              <el-form-item label="Venta a cuenta de" prop="sellers">
                <el-select
                  v-model="salesNewForm.sellers"
                  class="w-full"
                  size="small"
                  clearable
                  filterable
                  default-first-option
                  placeholder="Seleccionar"
                >
                  <el-option
                    v-for="s in sellers"
                    :key="s.value"
                    :label="s.name"
                    :value="s.id"
                  >
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
          <div v-if="!activeNotification" class="grid grid-cols-12 gap-4 text-xs">
            
            <!-- NRC -->
            <div class="col-span-1">
              <span>{{tributary != null ? tributary.nrc : ''}}</span>
            </div>
            <!-- NIT -->
            <div class="col-span-2">
              <span>{{tributary != null ? tributary.nit : ''}}</span>
            </div>
            <!-- Direccion -->
            <div class="col-span-3">
              <span>{{branches != null ? branches[0].address1 : ''}}</span>
            </div>
            <!-- departamento -->
            <div class="col-span-2">
              <span>{{branches != null ? branches[0].state.name :""}}</span>
            </div>
            <!-- Municipio -->
            <div class="col-span-2">
             <span>{{branches != null ? branches[0].city.name : ''}}</span>
            </div>
            <!-- Giro -->
            <div class="col-span-2">
               <span>{{tributary != null ? tributary.giro : ''}}</span>
            </div>
        </div>
          <!-- fourth row btn agregarservicio -->
          <div class="flex justify-end">
            <el-button type="primary" size="small" @click="dialogVisible = true" 
              >Agregar Servicio</el-button
            >
          </div>
        </div>
        <!-- table row -->
        <div class="grid grid-cols-12">
          <div class="col-span-12">
            <el-table :data="sales" style="width: 100%" stripe size="small">
              <el-table-column type="index" label="#" />
              <el-table-column prop="quantity" label="Cant." min-width="50">
              </el-table-column>
              <el-table-column prop="details" label="Descripción" width="270">
              </el-table-column>
              <el-table-column
                prop="precuni"
                label="Precio Unit."
                min-width="75"
                align="right"
              >
              </el-table-column>
              <el-table-column
                prop="vnosujeta"
                label="V. No sujeta"
                min-width="75"
                align="right"
              >
              </el-table-column>
              <el-table-column
                prop="vexenta"
                label="V. Exenta"
                min-width="75"
                align="right"
              >
              </el-table-column>
              <el-table-column
                prop="vgrabada"
                label="V. Grabada"
                min-width="75"
                align="right"
              >
              </el-table-column>
              <el-table-column prop="name" min-width="80"> </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- sumas -->
        <table class="flex justify-end">
          <tbody class="text-sm divide-y divide-gray-300">
            <tr class=" flex  space-x-16">
              <td align="right" class="text-blue-900 w-50">SUMAS:</td>
              <td align="right" class="text-gray-800">$0.00</td>
            </tr>
            <!-- <tr class="border-t" v-if="newInvoiceForm.documentType === '2'">
                <td align="right" class="text-blue-900" width="200px">13% Iva:</td>
                <td align="right" class="pl-15 pr-2 text-gray-800">{{taxes | formatMoney}}</td>
              </tr> -->
            <tr class="flex  space-x-16">
              <td align="right" class="text-blue-900 w-50">Subtotal:</td>
              <td align="right" class="text-gray-800">$0.00</td>
            </tr>
            <tr class="flex space-x-16">
              <td align="right" class="text-blue-900 w-50">Iva retenido:</td>
              <td align="right" class=" text-gray-800">$0.00</td>
            </tr>
            <tr class="flex space-x-16">
              <td align="right" class="text-blue-900 w-50">Ventas exentas:</td>
              <td align="right" class=" text-gray-800">$0.00</td>
            </tr>
            <tr class="flex space-x-16">
              <td align="right" class="text-blue-900 w-50">
                Ventas no sujetas:
              </td>
              <td align="right" class=" text-gray-800">$0.00</td>
            </tr>
            <tr class="flex space-x-16">
              <td align="right" class="text-blue-900 font-semibold w-50">
                Venta total:
              </td>
              <td align="right" class="text-gray-800">$0.00</td>
            </tr>
          </tbody>
        </table>
        <!-- boton guardar cancelar -->
        <div class="flex justify-end ">
          <el-button v-if="!activeNotification" type="primary" size="small" native-type="submit" 
            >Guardar</el-button
          >
          <el-button size="small">Cancelar</el-button>
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

const storagekey = "new-sales";

export default {
  name: "InvoicesNew",
  components: { LayoutContent, Notification },
  fetch() {
    const sellers = () => { return this.$axios.get("/invoices/sellers", { params: { active: true } });
    };
    const paymentsConditions = () => { return this.$axios.get("/invoices/payment-condition");
    };
    const customers = () => {return this.$axios.get("/customers", {params: { isActiveCustomer: true }});
   };
   const documentTypes = () => { return this.$axios.get("/invoices/document-types");};

    Promise.all([sellers(), paymentsConditions(), customers(), documentTypes()])
      .then((res) => {
        const [sellers, paymentConditions, customers, documents] = res;
       
        this.sellers = sellers.data.sellers;
        this.paymentConditions = paymentConditions.data.paymentConditions;
        this.customers = customers.data.customers;
        this.documents = documents.data.documentTypes;
        this.loading = false;
      })
      .catch((err) => {
        console.log(err);
        this.errorMessage = err.response.data.message;
      });

    // checkBeforeEnter(this, storagekey, "salesNewForm");
  },
  fetchOnServer: false,
  beforeRouteLeave(to, from, next) {
    checkBeforeLeave(this, storagekey, next);
  },
  data() {
    return {
      activeNotification: false,
      sales: [],
      loading: false,
      salesNewForm: {
        document: "",
        auth: "",
        next: "",
        date: "",
        customer: "",
        branch: null,
        paymentConditions: null,
        sellers: null,
      },
      salesNewFormRules: {
        document: selectValidation(true),
        date: selectValidation(true),
        customer: selectValidation(true),
        branch: selectValidation(true),
        paymentConditions: selectValidation(true),
        sellers: selectValidation(true),
      },
      sellers: [],
      paymentConditions: [],
      branches: null,
      customers: [],
      documents: [],
      dialogVisible: false,
      pickerOptions: {
        shortcuts: [
          {
            text: "Ahora",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "Ayer",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "Mañana",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      newServiceForm: {
        service: "",
        quantity: "",
        cost: "",
        description: "",
        incTax: false,
      },
      newServiceFormRules: {
        service: selectValidation(true),
        // quantity: amountValidate("blur", true, 1),
        // cost: amountValidate("blur", true, 0),
        description: inputValidation(true),
      },
      services: [],
      tributary:null,
    };
  },
  methods: {
    setStorage(salesNewForm) {
      localStorage.setItem(storagekey, JSON.stringify(salesNewForm));
    },
    closeDialog() {
      this.$refs.newServiceForm.resetFields();
      this.newServiceForm.cost = "";
      this.newServiceForm.quantity = "";
    },
    openDialog() {
      this.$axios
        .get("/services", { params: { active: true } })
        .then((res) => {
          this.services = res.data.services;
        })
        .catch((err) => {
          this.errorMessage = err.response.data.message;
        });
    },
    selectService(id, type) {
      switch (type) {
        case "new":
          this.$axios
            .get(`/services/${id}`)
            .then((res) => {
              this.newServiceForm.cost = res.data.service.cost;
              this.newServiceForm.description = res.data.service.description;
            })
            .catch((err) => {
              this.errorMessage = err.response.data.message;
            });
          break;
      }
    },
    getCustomerDetails(id){
      if(id){
        const branches = () =>  { return this.$axios.get(`/customers/${id}/branches`);};
        const tributary = () => {return this.$axios.get(`/customers/${id}/tributary`)};
        Promise.all([branches(),tributary()])
        .then((res) => {
        const [branches, tributary] = res;
        this.branches = branches.data.branches;
        this.tributary = tributary.data.customer;
        this.loading = false;
        console.log(this.branches)
        this.validateDocumentType(this.salesNewForm.document, this.tributary)
      })
      .catch((err) => {
        console.log(err);
        this.errorMessage = err.response.data.message;
      });
      }else{
         this.salesNewForm.branch = ""
      }
    
    },
    validateDocumentType(id, tributary){
     this.setStorage(this.salesNewForm)
     if(tributary){
      switch(id){
          case 2:
            if(tributary.customerType.name == "Persona Natural" && tributary.customerTypeNatural.name == "No declara IVA"){
              this.activeNotification = true
            }else{
              this.activeNotification = false
              
            }
          break;
          case 1:
            this.activeNotification = false
          break;
        }
      }
      
    }
  },
};
</script>

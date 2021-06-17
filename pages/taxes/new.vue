 <template>
  <layout-content
    page-title="Nuevo registro"
    :breadcrumb="[
      { name: 'IVA', to: '/taxes' },
      { name: 'Nuevo registro', to: null },
    ]"
  >
    <div class="flex flex-col space-4">
      <el-form
        :model="taxesNewForm"
        ref="taxesNewForm"
        @submit.prevent.native="newTaxe('taxesNewForm', taxesNewForm)"
      >
        <div class="grid grid-cols-12 gap-4">
          <el-form-item
            label="Tipo de registro"
            class="col-span-3"
            prop="typeRegister"
          >
            <el-select
              v-model="taxesNewForm.registerType"
              class="w-full"
              clearable
              filterable
              size="small"
            >
              <el-option
                v-for="item in registerType"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Tipo de documento" class="col-span-3">
            <el-select
              v-model="taxesNewForm.documentType"
              class="w-full"
              clearable
              filterable
              size="small"
            >
              <el-option
                v-for="item in documentTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <el-form-item
            label="Cliente"
            class="col-span-5"
            v-if="taxesNewForm.typeRegister != 'credifical'"
          >
            <el-select
              class="w-full"
              clearable
              filterable
              size="small"
              v-model="taxesNewForm.customers"
            >
              <el-option label="Todos los clientes" value="" />
              <el-option-group key="ACTIVOS" label="ACTIVOS">
                <el-option
                  v-for="item in activeCustomers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                  <div
                    class="
                      flex flex-row
                      justify-between
                      items-end
                      py-1
                      leading-normal
                    "
                  >
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500">{{
                        item.shortName
                      }}</span>
                      <span>{{ item.name }}</span>
                    </div>
                    <span class="text-xs text-gray-500">{{ item.nrc }}</span>
                  </div>
                </el-option>
              </el-option-group>
              <el-option-group key="INACTIVOS" label="INACTIVOS">
                <el-option
                  style="height: 50px"
                  v-for="item in inactiveCustomers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                  <div
                    class="
                      flex flex-row
                      justify-between
                      items-end
                      py-1
                      leading-normal
                    "
                  >
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500">{{
                        item.shortName
                      }}</span>
                      <span>{{ item.name }}</span>
                    </div>
                    <span class="text-xs text-gray-500">{{ item.nrc }}</span>
                  </div>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item
            class="col-span-3"
            label="Fecha de emisión del documento"
          >
            <el-date-picker
              v-model="taxesNewForm.date"
              size="small"
              class="w-full"
              type="date"
              placeholder="Selecciona un mes"
              :picker-options="pickerOptions"
              style="width: 100%"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="N° de autorización" class="col-span-2">
            <el-input
              placeholder="000000"
              v-model="taxesNewForm.authorization"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="N° de correlativo" class="col-span-2">
            <el-input
              placeholder="000000"
              v-model="taxesNewForm.sequence"
              size="small"
            ></el-input>
          </el-form-item>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <el-form-item label="Sumas" class="col-span-2" prop="sumas">
            <el-input-number
              v-model="taxesNewForm.sum"
              type="number"
              :min="0.0"
              :step="0.01"
              size="small"
              autocomplete="off"
              :precision="2"
              style="width: 100%"
            >
            </el-input-number>
          </el-form-item>

          <el-form-item label="IVA" class="col-span-2" prop="iva">
            <el-input-number
              v-model="taxesNewForm.iva"
              :value="taxes"
              type="number"
              :min="0.0"
              :step="0.01"
              size="small"
              autocomplete="off"
              :precision="2"
              style="width: 100%"
              :disabled="true"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item
            label="Subtotal"
            prop="subtotal"
            class="col-span-2"
            v-if="taxesNewForm.subTotal != 'consuFinal'"
          >
            <el-input-number
              v-model="taxesNewForm.subTotal"
              :value="subTotal"
              type="number"
              :min="0.0"
              :step="0.01"
              size="small"
              autocomplete="off"
              :precision="2"
              style="width: 100%"
              :disabled="true"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item
            label="Iva retenido"
            prop="ivaRetenido"
            class="col-span-2"
            v-if="taxesNewForm.typeRegister != 'credifical'"
          >
            <el-input-number
              v-model="taxesNewForm.ivaRetenido"
              :value="taxesDetained"
              type="number"
              :min="0.0"
              :step="0.01"
              size="small"
              autocomplete="off"
              :precision="2"
              style="width: 100%"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="Total" class="col-span-2">
            <el-input-number
              v-model="taxesNewForm.totals"
              style="width: 100%"
              size="small"
              :minlength="0.01"
              :step="0.01"
              :disabled="true"
              :value="totals"
              :precision="2"
            >
            </el-input-number>
          </el-form-item>
        </div>
        <div class="flex flex-row justify-end">
          <el-button type="primary" size="small" native-type="submit"
            >Guardar
          </el-button>
          <el-button size="small" @click="$router.push('/taxes')"
            >Cancelar</el-button
          >
        </div>
      </el-form>
    </div>
  </layout-content>
</template>

<script>
import LayoutContent from "../../components/layout/Content";
import { parseErrors } from "../../tools";
export default {
  name: "TaxesNew",
  head: {
    titleTemplate: `%s | Nuevo registro`,
  },
  components: { LayoutContent },
  fetch() {
    const customers = () => this.$axios.get("/customers");
    const providers = () => {
      return this.$axios.get("/providers");
    };
    Promise.all([customers(), providers()]).then((res) => {
      const [customers, providers] = res;
      this.customers = customers.data.data;
      this.providers = providers.data.data;
    });
  },
  fetchOnServer: false,
  data() {
    return {
      taxesNewForm: {
        registerType: "",
        documentType: "",
        authorization: "",
        sequence: "",
        date: "",
        sum: "",
        iva: "",
        subTotal: "",
        ivaRetenido: "",
        totals: "",
      },
      customers: [],
      providers: [],
      documentTypes: [
        {
          id: 1,
          name: "FCF - Consumidor Final",
        },
        {
          id: 2,
          name: "CFC - Crédito Fiscal",
        },
      ],
      registerType: [
        {
          id: "purchases",
          name: "Crédito Fiscal",
        },
        {
          id: "invoices",
          name: "Débito Fiscal",
        },
      ],
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
    };
  },
  methods: {
    newTaxe(formName, dataTaxe) {
      console.log(dataTaxe);
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }

        this.$confirm(
          "¿Estás seguro que deseas guardar este nuevo registro?",
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
                  .post("/taxes", {
                    registerType: dataTaxe.registerType,
                    documentType: dataTaxe.documentType,
                    authorization: dataTaxe.authorization,
                    sequence: dataTaxe.sequence,
                    entity: dataTaxe.customers,
                    date: dataTaxe.date,
                    sum: dataTaxe.sum,
                    iva: dataTaxe.iva,
                    subtotal: dataTaxe.subTotal,
                    ivaRetenido: dataTaxe.ivaRetenido,
                    total: dataTaxe.totals,
                  })
                  .then((res) => {
                    this.$notify.success({
                      title: "Exito",
                      message: res.data.message,
                    });
                    setTimeout(() => {
                      this.$confirm(
                        "¿Deseas crear un nuevo servicio?",
                        "Confirmación",
                        {
                          confirmButtonText: "Si, porfavor",
                          cancelButtonText: "No, gracias",
                          type: "warning",
                          closeOnClickModal: false,
                          closeOnPressEscape: false,
                        }
                      )
                        .then(() => {
                          this.$refs[formName].resetFields();
                        })
                        .catch(() => {
                          this.$router.push("/services");
                        });
                    }, 500);
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
                done();
              }
            },
          }
        );
      });
    },
  },

  computed: {
    activeCustomers() {
      return this.customers.filter((c) => c.isActiveCustomer);
    },
    inactiveCustomers() {
      return this.customers.filter((c) => !c.isActiveCustomer);
    },
    activeProviders() {
      return this.providers.filter((c) => c.isActiveProvider);
    },
    inactiveProviders() {
      return this.providers.filter((c) => !c.isActiveProvider);
    },
    taxes() {
      const taxes = this.taxesNewForm.sum * 0.13;
      this.taxesNewForm.iva = this.taxesNewForm.sum * 0.13;
      return taxes;
    },
    taxesDetained() {
      const taxesDetained =
        this.taxesNewForm.subTotal - this.taxesNewForm.ivaRetenido;
      return taxesDetained;
    },
    subTotal() {
      const subtotal = this.taxes + this.taxesNewForm.sum;
      this.taxesNewForm.subTotal = this.taxes + this.taxesNewForm.sum;
      return subtotal;
    },
    totals() {
      const totals = this.subTotal;
      const totalDetained = this.taxesDetained;
      this.taxesNewForm.totals = this.subTotal;
      this.taxesNewForm.totals = this.taxesDetained;
      return totals, totalDetained;
    },
  },
};
</script>

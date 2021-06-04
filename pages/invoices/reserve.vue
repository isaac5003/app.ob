<template>
  <layout-content
    page-title="Reservar documentos"
    :breadcrumb="[
      { name: 'Reservar', to: '/invoices' },
      { name: 'Reservar documentos', to: null },
    ]"
  >
    <el-form
      :model="reserveNewForm"
      :rules="reserveNewFormRules"
      status-icon
      @submit.native.prevent="submitNewSale('reserveNewForm', reserveNewForm)"
      ref="reserveNewForm"
    >
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-3">
          <el-form-item label="Tipo de documento" prop="documentType">
            <el-select
              v-model="reserveNewForm.documentType"
              size="small"
              clearable
              placeholder="Todos los tipos:"
              class="w-full"
            >
              <el-option
                v-for="item in documentTypes"
                :key="item.id"
                :label="`${item.code} - ${item.name}`"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="col-span-3">
          <el-form-item label="N° de correlativo desde " prop="sequenceFrom">
            <el-input
              size="small"
              placeholder=""
              v-model="reserveNewForm.sequenceFrom"
              :disabled="!reserveNewForm.documentType"
            >
            </el-input>
          </el-form-item>
        </div>
        <div class="col-span-3">
          <el-form-item label="N° de correlativo hasta" prop="sequenceTo">
            <el-input
              size="small"
              placeholder=""
              v-model="reserveNewForm.sequenceTo"
              :disabled="!reserveNewForm.documentType"
            >
            </el-input>
          </el-form-item>
        </div>
      </div>
      <div class="flex justify-end">
        <el-button type="primary" size="small" native-type="submit"
          >Guardar</el-button
        >
        <el-button @click="$router.push('/invoices')" size="small"
          >Cancelar</el-button
        >
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
  amountValidate,
} from "../../tools";
import Notification from "../../components/Notification";
import jsPDF from "jspdf";
const storagekey = "reserve-sales";
export default {
  name: "InvoicesIndex",
  components: { LayoutContent, Notification },

  fetch() {
    const documentTypes = () => this.$axios.get("/invoices/document-types");
    const documents = () => {
      return this.$axios.get("/invoices/documents", {
        params: { active: true },
      });
    };
    Promise.all([documentTypes(), documents()])
      .then((res) => {
        const [documentTypes, documents] = res;
        this.documentTypes = documents.data.data
          .filter((d) => d.active == true)
          .map((d) => d.documentType);
        this.documents = documents.data.data;
      })
      .catch((err) => {
        console.log(err);
        this.errorMessage = err.response.data.message;
      });
  },

  fetchOnServer: false,
  data() {
    return {
      documentTypes: [],
      reserveNewForm: {
        documentType: "",
        sequenceFrom: "",
        sequenceTo: "",
      },
      reserveNewFormRules: {
        documentType: selectValidation(true),
        sequenceFrom: inputValidation(true),
        sequenceTo: inputValidation(true),
      },
      documents: [],
    };
  },
  methods: {
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    submitNewSale(formName, data) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return false;
        }
        this.$confirm(
          "¿Estás seguro que deseas reservar los documentos?",
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
                  .post("/invoices/reserved", {
                    authorization: this.documents.find(
                      (d) => d.documentType.id == data.documentType
                    ).authorization,
                    documentType: data.documentType,
                    sequenceFrom: data.sequenceFrom,
                    sequenceTo: data.sequenceTo,
                  })
                  .then((res) => {
                    this.$notify.success({
                      title: "Exito",
                      message: res.data.message,
                    });
                    localStorage.removeItem(storagekey);

                    setTimeout(() => {
                      this.$confirm(
                        "¿Deseas reservar mas correlativos?",
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
                          this.resetForm(formName);
                        })
                        .catch(() => {
                          this.$router.push("/invoices");
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
                instance.confirmButtonLoading = false;
                instance.confirmButtonText = "Si, guardar";
                done();
              }
            },
          }
        );
      });
    },
  },
};
</script>

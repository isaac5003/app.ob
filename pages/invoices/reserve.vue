<template>
  <layout-content
    page-title="Reservar documentos"
    :breadcrumb="[
      { name: 'Reservar', to: '/invoices' },
      { name: 'Reservar documentos', to: null },
    ]"
  >
    <el-form
      :model="serveNewForm"
      :rules="reserveNewFormRules"
      status-icon
      @submit.native.prevent="
        submitNewSale('reserveNewForm', reserveNewForm, details)
      "
      ref="reserveNewForm"
    >
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-3">
          <el-form-item label="Tipo de documento">
            <el-select
              v-model="reserve.documentType"
              size="small"
              clearable
              placeholder="Todos los tipos:"
              class="w-full"
              @change="fetchInvoices"
            >
              <el-option label="Todos los tipos" value="" />
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
          <el-form-item label="N° de correlativo desde ">
            <el-input
              size="small"
              placeholder=""
              v-model="reserve.until"
              :disabled="true"
              readonly
            >
            </el-input>
          </el-form-item>
        </div>
        <div class="col-span-3">
          <el-form-item label="N° de correlativo hasta">
            <el-input
              size="small"
              placeholder=""
              v-model="reserve.since"
              :disabled="true"
              readonly
            >
            </el-input>
          </el-form-item>
        </div>
      </div>
      <div class="flex justify-end">
        <el-button type="primary" size="small" @click.native="addToDetails('')"
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
export default {
  name: "InvoicesIndex",
  components: { LayoutContent, Notification },
  fetch() {
    const documentTypes = () => this.$axios.get("/invoices/document-types");

    Promise.all([documentTypes()])
      .then((res) => {
        const [documentTypes] = res;
        this.documentTypes = documentTypes.data.data;
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
      reserve: {
        DocumentType: "",
        since: "",
        until: "",
        a: "",
      },
    };
  },
};
</script>
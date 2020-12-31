<template>
  <layout-content
    v-loading="loading"
    page-title="Nueva partida"
    :breadcrumb="[
      { name: 'Contabilidad', to: '/entries' }, 
      { name: 'Nueva partida', to: null }
    ]"
  >
   <div class="flex flex-col space-y-2">
     <el-form label-position="top">
          <div class="grid grid-cols-12 gap-4  relative">
            <div class=" col-start-1 col-span-4 ">
              <el-form-item label="* Tipo de patidad">
                 <el-select 
                 v-model="value" 
                 size="small"
                 class="w-full"
                 placeholder="Select">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              </el-form-item>
            </div>
            <div class="col-start-9 col-span-2">
              <el-form-item label="N° de correlativo">
                <el-input
                  placeholder="Please input"
                  v-model="input"
                  :disabled="true"
                  class="w-full"
                  size="small">
                </el-input>
              </el-form-item>
            </div>
           <div class="col-start-11 col-span-3 absolute">
            <el-form-item label="Rango de fechas:">
              <el-date-picker
                v-model="option.name"
                size="small"
                style="width:100%"
                type="date"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          </div>
     </el-form>
   </div>
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
  name: "CustomerNew",
  components: { LayoutContent, Notification },
  fetch() {
  },
  data() {
    return {
      loading: false,
      option:{
        name:""
      }
    };
  },
  methods: {
  },
  computed: {
  },
};
</script>

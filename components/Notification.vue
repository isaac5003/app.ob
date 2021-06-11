<template>
  <div :class="`${colors.bgLightest}`">
    <div
      class="flex items-center border rounded p-5 space-x-2 text-xs"
      :class="`${colors.borderLight}`"
    >
      <div
        :class="`${colors.bgLight}`"
        class="flex justify-center items-center w-10 h-10 rounded-full"
      >
        <div
          class="flex justify-center items-center p-2 w-6 h-6 border-2 rounded-full"
          :class="`${colors.bgLightest} ${colors.borderBase}`"
        >
          <i :class="`${icon} ${colors.textDark}`"></i>
        </div>
      </div>
      <div class="flex flex-col flex-1">
        <span class="uppercase font-semibold" :class="`${colors.textDarker}`">
          {{ title }}
        </span>
        <span :class="`${colors.textDark}`" v-html="message"></span>
      </div>
      <el-button
        v-if="link"
        :type="type"
        size="small"
        @click="$router.push(link.path)"
        >{{ link.title }}</el-button
      >
      <el-button
        v-if="action"
        :type="type"
        size="small"
        @click="action.function()"
        >{{ action.title }}</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "Notification",
  props: ["type", "title", "message", "link", "action"],
  computed: {
    icon() {
      let icon;
      switch (this.type) {
        case "warning":
          icon = "el-icon-warning";
          break;
        case "danger":
          icon = "el-icon-error";
          break;
        case "success":
          icon = "el-icon-success";
          break;
        case "info":
          icon = "el-icon-info";
          break;
      }
      return icon;
    },
    colors() {
      switch (this.type) {
        case "warning":
          return {
            bgLightest: "bg-orange-100",
            bgLight: "bg-orange-400",
            borderLight: "border-orange-400",
            borderBase: "border-orange-500",
            textDark: "text-orange-600",
            textDarker: "text-orange-800",
          };
          break;
        case "danger":
          return {
            bgLightest: "bg-red-100",
            bgLight: "bg-red-400",
            borderLight: "border-red-400",
            borderBase: "border-red-500",
            textDark: "text-red-600",
            textDarker: "text-red-800",
          };
          break;
        case "success":
          return {
            bgLightest: "bg-green-100",
            bgLight: "bg-green-400",
            borderLight: "border-green-400",
            borderBase: "border-green-600",
            textDark: "text-green-700",
            textDarker: "text-green-800",
          };
          break;
        case "info":
        default:
          return {
            bgLightest: "bg-blue-100",
            bgLight: "bg-blue-400",
            borderLight: "border-blue-400",
            borderBase: "border-blue-600",
            textDark: "text-blue-700",
            textDarker: "text-blue-800",
          };
          break;
      }
    },
  },
};
</script>

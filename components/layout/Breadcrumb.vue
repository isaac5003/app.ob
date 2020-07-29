<template>
  <el-breadcrumb separator-class="el-icon-arrow-right" class="mb-4">
    <el-breadcrumb-item
      class="text-sm"
      v-for="(p, k) of path"
      :key="k"
      :to="p.to"
      >{{ p.name }}</el-breadcrumb-item
    >
  </el-breadcrumb>
</template>

<script>
export default {
  name: "Breadcrumb",
  props: ["path"],
};
</script>

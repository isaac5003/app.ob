<template>
  <simplebar class="flex flex-col flex-1 p-6 relative h-screen">
    <layout-breadcrumb :path="breadcrumb" />
    <h1 class="uppercase text-lg mb-2">{{ PageTitle }}</h1>
    <slot />
  </simplebar>
</template>

<script>
import LayoutBreadcrumb from "./Breadcrumb";
import simplebar from "simplebar-vue";
import "simplebar/dist/simplebar.min.css";

export default {
  name: "Content",
  components: { simplebar, LayoutBreadcrumb },
  props: ["PageTitle", "breadcrumb"]
};
</script>

<template>
  <div
    class="flex flex-row font-body text-sm min-w-screen min-h-screen bg-gray-100 text-gray-900"
  >
    <layout-menu />
    <nuxt class="flex-1" />
    <layout-sidebar />
  </div>
</template>

<script>
import LayoutMenu from "../components/layout/Menu";
import LayoutSidebar from "../components/layout/Sidebar";
export default {
  name: "DefaultLayout",
  components: { LayoutMenu, LayoutSidebar },
};
</script>

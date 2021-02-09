<template>
  <div
    class="flex flex-col items-center py-6 px-4 bg-white w-64 border-r space-y-14"
  >
    <div class="flex items-center w-full text-gray-800 space-x-2">
      <svg
        class="w-7 h-7"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        stroke="currentColor"
        v-html="moduleIcon"
      />
      <span class="font-semibold text-lg leading-none">{{ pageName }}</span>
    </div>
    <slot name="upper"></slot>
    <ul class="flex flex-col w-full space-y-1">
      <nuxt-link
        v-for="(m, k) of menu"
        :key="k"
        tag="li"
        :to="{ path: m.path }"
        class="flex items-center py-3 px-3 hover:bg-blue-200 hover:text-blue-800 text-gray-900 text-sm rounded cursor-pointer space-x-2"
        :class="{ 'bg-blue-200 text-blue-800': activePath($route.path, m) }"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
          v-html="m.icon"
        />
        <span class="leading-none">{{ m.name }}</span>
      </nuxt-link>
    </ul>
  </div>
</template>

<script>
import { getIcon } from "../../tools";

export default {
  name: "Submenu",

  props: ["pageName", "menu", "icon"],
  fetchOnServer: false,
  methods: {
    activePath(path, item) {
      const paths = [item.path];
      if (item.epath) {
        for (const p of item.epath) {
          paths.push(p);
        }
      }
      return paths.includes(path);
    },
  },
  computed: {
    moduleIcon() {
      return getIcon(this.icon);
    },
  },
};
</script>

export default {
  head: {
    title: "Openbox Cloud",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content:
          "Sistema de soporte para la gesti�n empresarial, que permite tener acceso a herramientas de soporte operativo y administrativo.",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  loading: { color: "#2c5282", height: "5px" },
  plugins: [
    "./plugins/element-ui.js",
    "./plugins/filters.js",
    "./plugins/vue-debounce.js",
    "./plugins/vue-mask.js",
  ],
  buildModules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/google-fonts",
    "@nuxtjs/date-fns",
  ],
  modules: ["@nuxtjs/axios", "@nuxtjs/auth-next"],
  router: {
    middleware: ["auth"],
  },
  dateFns: {
    defaultLocale: "es",
  },
  axios: {
    baseURL: process.env.API_URL || "https://devapi.openbox.cloud/",
    // baseURL: "http://localhost:5001",
  },
  googleFonts: {
    families: {
      Poppins: true,
    },
  },
  auth: {
    redirect: {
      login: "/auth/login",
      logout: "/auth/login",
    },
    strategies: {
      local: {
        scheme: "refresh",
        autoRefresh: { enable: true },
        token: { property: "access_token" },
        refreshToken: { property: "refresh_token" },
        user: { property: "user" },
        endpoints: {
          login: { url: "auth/login", method: "post" },
          refresh: { url: "auth/refresh", method: "post" },
          user: { url: "auth/user", method: "get" },
          logout: { url: "auth/logout", method: "delete" },
        },
      },
    },
  },
};

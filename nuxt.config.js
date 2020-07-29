export default {
  mode: "universal",
  /*
   ** Headers of the page
   */
  head: {
    title: "Openbox Cloud",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
      },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#2c5282", height: "5px" },
  /*
   ** Global CSS
   */
  css: ["./assets/styles/tailwind.css"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "./plugins/element-ui.js",
    "./plugins/filters.js",
    "./plugins/vue-debounce.js",
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/axios", "@nuxtjs/auth-next"],

  axios: {
    baseURL: "http://localhost:5001/",
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    postcss: {
      plugins: {
        tailwindcss: "./tailwind.config.js",
      },
    },
    extend(config, ctx) {},
  },

  server: {
    port: 5002,
  },

  router: {
    middleware: ["auth"],
  },

  auth: {
    redirect: {
      login: "/auth/login",
      logout: "/auth/login",
      home: "/",
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

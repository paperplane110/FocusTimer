// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["nuxt-windicss", "nuxt-icon", "@nuxtjs/color-mode"],
  colorMode: {
    classSuffix: ''
  }
})

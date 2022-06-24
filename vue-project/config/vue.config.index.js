const { defineConfig } = require('@vue/cli-service')
const path = require("path");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, '/src/index')
      }
    }
  },
  publicPath: './',
  outputDir: '../express/dist/public/',
  pages: {
    index: {
      entry: 'src/index/src/main.ts',
      template:"src/index/public/index.html"
    }
  },
  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    }
  }
})
